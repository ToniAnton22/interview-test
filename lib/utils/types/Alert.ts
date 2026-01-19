export type AlertType = "success" | "error" | "info";

export interface AlertMessage {
  id: string;
  type: AlertType;
  message: string;
}

export interface AlertProps {
  alert: AlertMessage;
  onDismiss: (id: string) => void;
}

export interface AlertContainerProps {
  alerts: AlertMessage[];
  onDismiss: (id: string) => void;
}