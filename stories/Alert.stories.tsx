import { AlertContainer } from "@/components/Alert";
import { AlertMessage } from "@/lib/utils/types/Alert";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const meta: Meta<typeof AlertContainer> = {
  title: "Components/Alert",
  component: AlertContainer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AlertContainer>;

// Single alert examples
export const SuccessAlert: Story = {
  render: () => {
    const alerts: AlertMessage[] = [
      { id: "1", type: "success", message: "Project created successfully!" },
    ];
    return (
      <div className="p-4">
        <AlertContainer alerts={alerts} onDismiss={() => {}} />
      </div>
    );
  },
};

export const ErrorAlert: Story = {
  render: () => {
    const alerts: AlertMessage[] = [
      { id: "1", type: "error", message: "Failed to delete project. Please try again." },
    ];
    return (
      <div className="p-4">
        <AlertContainer alerts={alerts} onDismiss={() => {}} />
      </div>
    );
  },
};

export const InfoAlert: Story = {
  render: () => {
    const alerts: AlertMessage[] = [
      { id: "1", type: "info", message: "Check your email for the confirmation link!" },
    ];
    return (
      <div className="p-4">
        <AlertContainer alerts={alerts} onDismiss={() => {}} />
      </div>
    );
  },
};

// All types together
export const AllTypes: Story = {
  render: () => {
    const alerts: AlertMessage[] = [
      { id: "1", type: "success", message: "Operation completed successfully!" },
      { id: "2", type: "error", message: "Something went wrong. Please try again." },
      { id: "3", type: "info", message: "Your changes have been saved." },
    ];
    return (
      <div className="p-4">
        <AlertContainer alerts={alerts} onDismiss={() => {}} />
      </div>
    );
  },
};

// Long message
export const LongMessage: Story = {
  render: () => {
    const alerts: AlertMessage[] = [
      {
        id: "1",
        type: "error",
        message:
          "Failed to update project: The server returned an unexpected error. Please check your network connection and try again. If the problem persists, contact support.",
      },
    ];
    return (
      <div className="p-4">
        <AlertContainer alerts={alerts} onDismiss={() => {}} />
      </div>
    );
  },
};

// Interactive example with dismiss
export const Interactive: Story = {
  render: function InteractiveAlerts() {
    const [alerts, setAlerts] = useState<AlertMessage[]>([
      { id: "1", type: "success", message: "Welcome back!" },
      { id: "2", type: "info", message: "You have 3 new notifications." },
    ]);

    const addAlert = (type: "success" | "error" | "info") => {
      const messages = {
        success: "Action completed successfully!",
        error: "Something went wrong!",
        info: "Here's some information for you.",
      };
      setAlerts((prev) => [
        ...prev,
        { id: Date.now().toString(), type, message: messages[type] },
      ]);
    };

    const dismissAlert = (id: string) => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    };

    return (
      <div className="p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => addAlert("success")}
            className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            Add Success
          </button>
          <button
            onClick={() => addAlert("error")}
            className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Add Error
          </button>
          <button
            onClick={() => addAlert("info")}
            className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Add Info
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Click the X button or wait 5 seconds to dismiss alerts.
        </p>
        <AlertContainer alerts={alerts} onDismiss={dismissAlert} />
      </div>
    );
  },
};

// Stacked alerts (showing how they stack)
export const StackedAlerts: Story = {
  render: () => {
    const alerts: AlertMessage[] = [
      { id: "1", type: "success", message: "Project saved!" },
      { id: "2", type: "success", message: "Team member added!" },
      { id: "3", type: "success", message: "Notification sent!" },
      { id: "4", type: "info", message: "Syncing with server..." },
    ];
    return (
      <div className="p-4 min-h-[300px]">
        <AlertContainer alerts={alerts} onDismiss={() => {}} />
      </div>
    );
  },
};

// Empty state
export const NoAlerts: Story = {
  render: () => {
    return (
      <div className="p-4">
        <p className="text-gray-500">No alerts to display (container renders nothing)</p>
        <AlertContainer alerts={[]} onDismiss={() => {}} />
      </div>
    );
  },
};