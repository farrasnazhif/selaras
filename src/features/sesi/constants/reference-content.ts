import type { SessionPreviewInput } from "../validations/session.ts";

export const EXAMPLE_SESSION_ID = "literasi-2026-10-14";
export const SESSION_DEFAULTS: SessionPreviewInput = {
  lessonSubject: "Bahasa Indonesia", topic: "", focus: "literasi", duration: "70",
  blockMinutes: "15", date: "2026-10-14", phaseTasks: { literasi: { first: "", second: "" }, numerasi: { first: "", second: "" } },
};
