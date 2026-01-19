"use client";

import { useCallback, useState } from "react";
import { AlertMessage, AlertType } from "../utils/types/Alert";

let alertIdCounter = 0;

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  const showAlert = useCallback((type: AlertType, message: string) => {
    const id = `alert-${++alertIdCounter}`;
    setAlerts((prev) => [...prev, { id, type, message }]);
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message: string) => showAlert("success", message),
    [showAlert]
  );

  const showError = useCallback(
    (message: string) => showAlert("error", message),
    [showAlert]
  );

  const showInfo = useCallback(
    (message: string) => showAlert("info", message),
    [showAlert]
  );

  return {
    alerts,
    showAlert,
    showSuccess,
    showError,
    showInfo,
    dismissAlert,
  };
}

export type UseAlertsReturn = ReturnType<typeof useAlerts>;