"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getWorkspace, saveWorkspace, workspaceKey, type WorkspaceRecord } from "../api/workspace";
import type { TeacherWorkspace } from "../validations/workspace";

export function useWorkspace(userId: string) {
  const cache = useQueryClient();
  const key = workspaceKey(userId);
  const query = useQuery({ queryKey: key, queryFn: () => getWorkspace(userId), staleTime: Infinity, enabled: !!userId });
  const mutation = useMutation({
    mutationFn: ({ revision, state }: WorkspaceRecord) => saveWorkspace(userId, revision, state),
    retry: false,
    onSuccess: (record) => { if (cache.getQueryData(key)) cache.setQueryData(key, record); },
  });
  async function commit(update: (state: TeacherWorkspace) => TeacherWorkspace) {
    const current = cache.getQueryData<WorkspaceRecord>(key);
    if (!current) throw new Error("Data belum siap.");
    await mutation.mutateAsync({ state: update(current.state), revision: current.revision });
  }
  return { ...query, commit, saving: mutation.isPending };
}
