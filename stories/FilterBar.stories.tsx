import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import FilterBar from "@/components/FilterBar";
import { ProjectStatusFilter } from "@/types/project";
import type { UserOwner } from "@/types/users";

const ownersMock: UserOwner[] = [
  { id: "user-1", name: "Alice" },
  { id: "user-2", name: "Bob" },
  { id: "user-3", name: "Charlie" },
];

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
    assignee: "",
    owners: ownersMock,
    onSearchChange: (value) => console.log("Search:", value),
    onStatusChange: (value) => console.log("Status:", value),
    onAssigneeChange: (value) => console.log("Assignee:", value),
    onAddClick: () => console.log("Add clicked"),
  },
};

export const WithSearch: Story = {
  args: {
    search: "dashboard",
    status: ProjectStatusFilter.ALL,
    assignee: "",
    owners: ownersMock,
    onSearchChange: (value) => console.log("Search:", value),
    onStatusChange: (value) => console.log("Status:", value),
    onAssigneeChange: (value) => console.log("Assignee:", value),
    onAddClick: () => console.log("Add clicked"),
  },
};

export const WithStatusFilter: Story = {
  args: {
    search: "",
    status: ProjectStatusFilter.ACTIVE,
    assignee: "",
    owners: ownersMock,
    onSearchChange: (value) => console.log("Search:", value),
    onStatusChange: (value) => console.log("Status:", value),
    onAssigneeChange: (value) => console.log("Assignee:", value),
    onAddClick: () => console.log("Add clicked"),
  },
};

export const WithOwnerFilter: Story = {
  args: {
    search: "",
    status: ProjectStatusFilter.ALL,
    assignee: "user-2",
    owners: ownersMock,
    onSearchChange: (value) => console.log("Search:", value),
    onStatusChange: (value) => console.log("Status:", value),
    onAssigneeChange: (value) => console.log("Assignee:", value),
    onAddClick: () => console.log("Add clicked"),
  },
};

export const WithBothFilters: Story = {
  args: {
    search: "api",
    status: ProjectStatusFilter.ON_HOLD,
    assignee: "user-1",
    owners: ownersMock,
    onSearchChange: (value) => console.log("Search:", value),
    onStatusChange: (value) => console.log("Status:", value),
    onAssigneeChange: (value) => console.log("Assignee:", value),
    onAddClick: () => console.log("Add clicked"),
  },
};

const InteractiveFilterBar = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProjectStatusFilter>(
    ProjectStatusFilter.ALL,
  );
  const [assignee, setAssignee] = useState("");

  return (
    <div>
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={(s) => setStatus(s as ProjectStatusFilter)}
        assignee={assignee}
        owners={ownersMock}
        onAssigneeChange={setAssignee}
        onAddClick={() => alert("Add project clicked!")}
      />

      <div className="mt-4 p-4 bg-white rounded-lg text-sm">
        <p>
          <strong>Current Search:</strong> {search || "(empty)"}
        </p>
        <p>
          <strong>Current Status:</strong> {status}
        </p>
        <p>
          <strong>Current Owner:</strong>{" "}
          {assignee
            ? ownersMock.find((o) => o.id === assignee)?.name ?? assignee
            : "(all)"}
        </p>
      </div>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveFilterBar />,
};
