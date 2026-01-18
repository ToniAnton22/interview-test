import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import FilterBar from "@/components/FilterBar";
import { ProjectStatusFilter } from "@/types/project";

const meta: Meta<typeof FilterBar> = {
  title: "Components/FilterBar",
  component: FilterBar,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="bg-gray-50 p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FilterBar>;

export const Default: Story = {
  args: {
    search: "",
    status: ProjectStatusFilter.ALL,
    onSearchChange: (value) => console.log("Search:", value),
    onStatusChange: (value) => console.log("Status:", value),
    onAddClick: () => console.log("Add clicked"),
  },
};

export const WithSearch: Story = {
  args: {
    search: "dashboard",
    status: ProjectStatusFilter.ALL,
    onSearchChange: (value) => console.log("Search:", value),
    onStatusChange: (value) => console.log("Status:", value),
    onAddClick: () => console.log("Add clicked"),
  },
};

export const WithStatusFilter: Story = {
  args: {
    search: "",
    status: ProjectStatusFilter.ACTIVE,
    onSearchChange: (value) => console.log("Search:", value),
    onStatusChange: (value) => console.log("Status:", value),
    onAddClick: () => console.log("Add clicked"),
  },
};

export const WithBothFilters: Story = {
  args: {
    search: "api",
    status: ProjectStatusFilter.ON_HOLD,
    onSearchChange: (value) => console.log("Search:", value),
    onStatusChange: (value) => console.log("Status:", value),
    onAddClick: () => console.log("Add clicked"),
  },
};

// Interactive example
const InteractiveFilterBar = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProjectStatusFilter>(
    ProjectStatusFilter.ALL
  );

  return (
    <div>
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={(s) => setStatus(s as ProjectStatusFilter)}
        onAddClick={() => alert("Add project clicked!")}
      />
      <div className="mt-4 p-4 bg-white rounded-lg">
        <p>
          <strong>Current Search:</strong> {search || "(empty)"}
        </p>
        <p>
          <strong>Current Status:</strong> {status}
        </p>
      </div>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveFilterBar />,
};