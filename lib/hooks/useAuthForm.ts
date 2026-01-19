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
  const [name, setName] = useState("");

  const submit = useCallback(async () => {
    setIsLoading(true);

    try {
      if (mode === "signup") {
        await signUp(email, password, name.trim() || undefined);

        // attempt immediate sign-in in case the same email already exists.
        try {
          await signIn(email, password);
          showSuccess("Welcome back!");
          router.push("/dashboard");
          router.refresh();
          return;
        } catch (e) {
          const msg = e instanceof Error ? e.message : "";

          // user created but must confirm email
          if (msg.toLowerCase().includes("email not confirmed")) {
            showSuccess("Check your email for the confirmation link!");
            return;
          }

          // account exists but password doesn't match, or other auth issue
          showError(
            "This email may already be registered. Try signing in instead (or reset your password).",
          );
          setMode("login");
          return;
        }
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
  }, [email, password, name, mode, router, showSuccess, showError]);

  return useMemo(
    () => ({
      mode,
      setMode,
      email,
      setEmail,
      name,
      setName,
      password,
      setPassword,
      isLoading,
      submit,
      alerts: alertsHook.alerts,
      dismissAlert: alertsHook.dismissAlert,
    }),
    [
      mode,
      email,
      name,
      password,
      isLoading,
      submit,
      alertsHook.alerts,
      alertsHook.dismissAlert,
    ],
  );
}
