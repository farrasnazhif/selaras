import type { Database, Json } from "@/types/database";

// Explicit migration contract; regenerate the main Database type once Supabase is configured.
export type TeacherDatabase = Database & {
  public: {
    Tables: {
      teacher_workspaces: {
        Row: { user_id: string; state: Json; revision: number; created_at: string; updated_at: string };
        Insert: { user_id?: string; state?: Json; revision?: number };
        Update: { state?: Json };
        Relationships: [];
      };
    };
    Functions: {
      reserve_task_variation: { Args: { request_limit: number }; Returns: boolean };
    };
  };
};
