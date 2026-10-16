"use client";

import { useMutation } from "@tanstack/react-query";
import { createTaskVariation } from "../api/create-task-variation";

export function useTaskVariation() {
  return useMutation({ mutationFn: createTaskVariation, retry: false });
}
