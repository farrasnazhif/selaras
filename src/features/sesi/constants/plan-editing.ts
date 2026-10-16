import type { SessionPlan } from "../types/schedule.ts";

// Reflow explicit edits without replacing teacher content or the roster snapshot.
export function reflowPlan(plan: SessionPlan): SessionPlan {
  let minute = 0;
  return { ...plan, blocks: plan.blocks.map((block) => {
    const start = minute;
    minute += block.end - block.start;
    const teacher = block.teacherAssignments[0] ?? [];
    return { ...block, start, end: minute, activities: block.activities.map((activity) => ({
      ...activity,
      mode: teacher.includes(activity.classKey) ? "teacher" : "independent",
      taskIds: teacher.includes(activity.classKey) ? [] : plan.tasks.filter((task) => task.classKey === activity.classKey && task.group === activity.group).map((task) => task.id),
    })) };
  }) };
}

export function sessionTurnLabel(plan: SessionPlan) {
  const lengths = [...new Set(plan.blocks.filter((block) => block.kind === "core").map((block) => block.end - block.start))].sort((first, second) => first - second);
  return `Giliran ${lengths.join(" / ")} menit`;
}
