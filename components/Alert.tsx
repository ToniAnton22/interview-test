"use client";

import { useEffect } from "react";
import { AlertCircle, CheckCircle, X, Info } from "lucide-react";
import { AlertContainerProps, AlertProps, AlertType } from "@/lib/utils/types/Alert";

const alertStyles: Record<AlertType, { bg: string; border: string; text: string; icon: typeof AlertCircle }> = {
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-800",
    icon: CheckCircle,
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    icon: AlertCircle,
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    icon: Info,
  },
};

function Alert({ alert, onDismiss }: AlertProps) {
  const style = alertStyles[alert.type];
  const Icon = style.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(alert.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [alert.id, onDismiss]);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${style.bg} ${style.border} ${style.text} shadow-lg animate-slide-in`}
      role="alert"
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <p className="text-sm font-medium flex-1">{alert.message}</p>
      <button
        onClick={() => onDismiss(alert.id)}
        className="flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function AlertContainer({ alerts, onDismiss }: AlertContainerProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {alerts.map((alert) => (
        <Alert key={alert.id} alert={alert} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

export default Alert;