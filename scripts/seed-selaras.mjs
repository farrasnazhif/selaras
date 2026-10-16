import { createClient } from "@supabase/supabase-js";
import { createDemoWorkspace } from "../src/features/shared/constants/demo-workspace.ts";
import { workspaceSchema } from "../src/features/shared/validations/workspace.ts";
import { combineIndependentClassrooms } from "../src/features/kelas/constants/class-pairing.ts";

if (!process.argv.includes("--confirm-development")) {
  throw new Error("Confirm the development target with --confirm-development. This command never resets the database.");
}
const required = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "DEMO_TEACHER_EMAIL", "DEMO_TEACHER_PASSWORD"];
for (const name of required) if (!process.env[name]) throw new Error(`Configure ${name} in .env.local.`);
if (process.env.DEMO_TEACHER_PASSWORD.length < 6) throw new Error("Use a seed password of at least 6 characters, subject to the project's Auth policy.");
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const schemaCheck = await client.from("teacher_workspaces").select("user_id,state,revision").limit(0);
if (schemaCheck.error) {
  throw new Error("Apply supabase/migrations/20261016000000_teacher_workspaces.sql before seeding. No accounts or records were changed.");
}
const email = process.env.DEMO_TEACHER_EMAIL.trim().toLowerCase();
const initial = createDemoWorkspace();
const combined = combineIndependentClassrooms(initial.classrooms, initial.students, ["kelas-1a", "kelas-2b"], "kelas-1a-2b");
if (!combined.ok) throw new Error("Could not prepare the 1A + 2B seed class.");
const seedState = workspaceSchema.parse({ ...initial, classrooms: combined.classrooms, students: combined.students });
let existing;
for (let page = 1; ; page++) {
  const { data, error } = await client.auth.admin.listUsers({ page, perPage: 100 });
  if (error) throw new Error("Could not inspect development users. Check the target and service-role key.");
  existing = data.users.find((user) => user.email?.toLowerCase() === email);
  if (existing || data.users.length < 100) break;
}
let user = existing;
if (!user) {
  const { data, error } = await client.auth.admin.createUser({
    email, password: process.env.DEMO_TEACHER_PASSWORD, email_confirm: true,
    user_metadata: { full_name: "Guru" },
  });
  if (error || !data.user) throw new Error("Could not create the demo teacher. No classes were written.");
  user = data.user;
}
const { data: inserted, error } = await client.from("teacher_workspaces").upsert({
  user_id: user.id, state: seedState,
}, { onConflict: "user_id", ignoreDuplicates: true }).select("user_id").maybeSingle();
if (error) {
  if (!existing) {
    const cleanup = await client.auth.admin.deleteUser(user.id);
    if (cleanup.error) console.error("Demo-account cleanup failed; inspect the newly created development account manually.");
  }
  throw new Error("Could not seed the workspace. Apply the teacher-workspace migration first; existing records were not overwritten.");
}
const stored = await client.from("teacher_workspaces").select("state").eq("user_id", user.id).single();
if (stored.error) throw new Error("Seed was submitted but could not be verified. Rerun to check it without overwriting data.");
const state = workspaceSchema.parse(stored.data.state);
console.log(`${inserted ? "Seeded" : "Preserved existing workspace:"} ${state.classrooms.length} classes and ${state.students.length} students. Existing passwords were preserved.`);
