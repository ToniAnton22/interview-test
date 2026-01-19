"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/apis/auth.api";
import { useAlerts } from "@/lib/hooks/useAlert";

export type AuthMode = "login" | "signup";

export function useAuthForm() {
  const router = useRouter();
  const alertsHook = useAlerts();
  const { showSuccess, showError } = alertsHook;

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = useCallback(async () => {
    setIsLoading(true);

    try {
      if (mode === "signup") {
        await signUp(email, password);
        showSuccess("Check your email for the confirmation link!");
      } else {
        await signIn(email, password);
        showSuccess("Welcome back!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [email, mode, password, router, showSuccess, showError]);

  return useMemo(
    () => ({
      mode,
      setMode,
      email,
      setEmail,
      password,
      setPassword,
      isLoading,
      submit,
      alerts: alertsHook.alerts,
      dismissAlert: alertsHook.dismissAlert,
    }),
    [mode, email, password, isLoading, submit, alertsHook.alerts, alertsHook.dismissAlert]
  );
}