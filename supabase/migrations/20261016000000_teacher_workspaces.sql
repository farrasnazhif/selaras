-- One private aggregate per teacher preserves the current application snapshots without
-- introducing cross-owner child references. Revision checks prevent lost updates.
create table public.teacher_workspaces (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  state jsonb not null default '{"classrooms":[],"students":[],"sessions":[],"assessments":[],"observations":[],"groupOverrides":{"literasi":{},"numerasi":{}}}'::jsonb,
  revision bigint not null default 1 check (revision > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workspace_shape check (
    jsonb_typeof(state) = 'object'
    and state ?& array['classrooms', 'students', 'sessions', 'assessments', 'observations', 'groupOverrides']
    and jsonb_typeof(state->'classrooms') = 'array'
    and jsonb_typeof(state->'students') = 'array'
    and jsonb_typeof(state->'sessions') = 'array'
    and jsonb_typeof(state->'assessments') = 'array'
    and jsonb_typeof(state->'observations') = 'array'
    and jsonb_typeof(state->'groupOverrides') = 'object'
    and (state->'groupOverrides') ?& array['literasi', 'numerasi']
    and jsonb_typeof(state->'groupOverrides'->'literasi') = 'object'
    and jsonb_typeof(state->'groupOverrides'->'numerasi') = 'object'
  )
);

create function public.maintain_teacher_workspace() returns trigger
language plpgsql set search_path = '' as $$
begin
  if tg_op = 'UPDATE' then
    if new.user_id is distinct from old.user_id then
      raise exception 'Workspace ownership cannot change';
    end if;
    new.revision := old.revision + 1;
    new.created_at := old.created_at;
  else
    new.revision := 1;
    new.created_at := now();
  end if;
  new.updated_at := now();
  return new;
end;
$$;
create trigger teacher_workspace_fields before insert or update on public.teacher_workspaces
for each row execute function public.maintain_teacher_workspace();

alter table public.teacher_workspaces enable row level security;
revoke all on public.teacher_workspaces from anon, authenticated;
grant select on public.teacher_workspaces to authenticated;
grant insert (user_id, state) on public.teacher_workspaces to authenticated;
grant update (state) on public.teacher_workspaces to authenticated;
create policy "Teachers read own workspace" on public.teacher_workspaces for select to authenticated
using ((select auth.uid()) = user_id);
create policy "Teachers create own workspace" on public.teacher_workspaces for insert to authenticated
with check ((select auth.uid()) = user_id);
create policy "Teachers update own workspace" on public.teacher_workspaces for update to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- The server must reserve a request atomically before contacting the paid provider.
create table public.task_variation_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  requests integer not null check (requests > 0),
  primary key (user_id, day)
);
alter table public.task_variation_usage enable row level security;
revoke all on public.task_variation_usage from anon, authenticated;

create function public.reserve_task_variation(request_limit integer) returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  teacher uuid := auth.uid();
  reserved integer;
begin
  if teacher is null or request_limit is null or request_limit <= 0 then
    return false;
  end if;
  insert into public.task_variation_usage (user_id, day, requests)
  values (teacher, (now() at time zone 'UTC')::date, 1)
  on conflict (user_id, day) do update
    set requests = public.task_variation_usage.requests + 1
    where public.task_variation_usage.requests < request_limit
  returning requests into reserved;
  return reserved is not null;
end;
$$;
revoke all on function public.reserve_task_variation(integer) from public, anon;
grant execute on function public.reserve_task_variation(integer) to authenticated;
