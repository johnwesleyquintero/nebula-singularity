import { supabase } from "@/lib/supabase";
import { useSession } from "next-auth/react";

interface UseSupabaseOptions {
  tableName: string;
}

export function useSupabase({ tableName }: UseSupabaseOptions) {
  const { data: session } = useSession();

  const updateRecord = async (data: any) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session?.user?.id);

      if (error) {
        throw error;
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to update record");
    }
  };

  return {
    updateRecord,
  };
}
