import type { Meta, StoryObj } from "@storybook/react";
import StatusBadge from "@/components/StatusBadge";
import { ProjectStatus } from "@/types/project";

const meta: Meta<typeof StatusBadge> = {
  title: "Components/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["active", "on_hold", "completed"],
      description: "The status of the project",
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Active: Story = {
  args: {
    status: ProjectStatus.ACTIVE,
  },
};

export const OnHold: Story = {
  args: {
    status: ProjectStatus.ON_HOLD,
  },
};

export const Completed: Story = {
  args: {
    status: ProjectStatus.COMPLETED,
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex gap-4">
      <StatusBadge status={ProjectStatus.ACTIVE} />
      <StatusBadge status={ProjectStatus.ON_HOLD} />
      <StatusBadge status={ProjectStatus.COMPLETED} />
    </div>
  ),
};
