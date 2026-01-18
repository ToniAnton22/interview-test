"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/apis/auth.api";

export type AuthMode = "login" | "signup";

export function useAuthForm() {
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const submit = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === "signup") {
        await signUp(email, password);
        setMessage("Check your email for the confirmation link!");
      } else {
        await signIn(email, password);
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [email, mode, password, router]);

  return useMemo(
    () => ({
      mode,
      setMode,
      email,
      setEmail,
      password,
      setPassword,
      isLoading,
      error,
      message,
      submit,
    }),
    [mode, email, password, isLoading, error, message, submit],
  );
}
