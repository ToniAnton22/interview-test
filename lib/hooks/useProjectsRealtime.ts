import { useEffect } from "react";
import { createClient } from "@/lib/utils/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type ProjectPayload = RealtimePostgresChangesPayload<{
  [key: string]: unknown;
}>;

interface UseProjectsRealtimeOptions {
  onInsert?: (payload: ProjectPayload) => void;
  onUpdate?: (payload: ProjectPayload) => void;
  onDelete?: (payload: ProjectPayload) => void;
  enabled?: boolean;
}

/**
 * Manages real-time project updates via Supabase subscriptions.
 * 
 * This prevents mismatches in the UX when the user is deleting pages.
 */

export function useProjectsRealtime({
  onInsert,
  onUpdate,
  onDelete,
  enabled = true,
}: UseProjectsRealtimeOptions) {
  useEffect(() => {
    if (!enabled) return;

    const supabase = createClient();

    const channel = supabase
      .channel("projects-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "projects",
        },
        (payload) => {
          console.log("🆕 Project inserted");
          onInsert?.(payload);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "projects",
        },
        (payload) => {
          console.log("✏️ Project updated");
          onUpdate?.(payload);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "projects",
        },
        (payload) => {
          console.log("🗑️ Project deleted");
          onDelete?.(payload);
        }
      )
      .subscribe((status) => {
        console.log("📡 Realtime subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, onInsert, onUpdate, onDelete]);
}