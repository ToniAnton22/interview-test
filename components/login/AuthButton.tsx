"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { LogOut, User, Loader2 } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface AuthButtonProps {
  user: SupabaseUser | null;
}

export default function AuthButton({ user }: AuthButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  if (!user) {
    return (
      <button
        onClick={() => router.push("/login")}
        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">{user.email}</span>
      </div>
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
}