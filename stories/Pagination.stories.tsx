import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Pagination, { PaginationInfo } from "@/components/Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="bg-white rounded-lg shadow">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

const defaultPagination: PaginationInfo = {
  page: 1,
  limit: 10,
  total: 50,
  totalPages: 5,
  hasNext: true,
  hasPrev: false,
};

export const FirstPage: Story = {
  args: {
    pagination: defaultPagination,
    onPageChange: (page) => console.log("Page changed to:", page),
  },
};

export const MiddlePage: Story = {
  args: {
    pagination: {
      ...defaultPagination,
      page: 3,
      hasNext: true,
      hasPrev: true,
    },
    onPageChange: (page) => console.log("Page changed to:", page),
  },
};

export const LastPage: Story = {
  args: {
    pagination: {
      ...defaultPagination,
      page: 5,
      hasNext: false,
      hasPrev: true,
    },
    onPageChange: (page) => console.log("Page changed to:", page),
  },
};

export const ManyPages: Story = {
  args: {
    pagination: {
      page: 10,
      limit: 10,
      total: 250,
      totalPages: 25,
      hasNext: true,
      hasPrev: true,
    },
    onPageChange: (page) => console.log("Page changed to:", page),
  },
};

export const SinglePage: Story = {
  args: {
    pagination: {
      page: 1,
      limit: 10,
      total: 5,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
    onPageChange: (page) => console.log("Page changed to:", page),
  },
};

// Interactive example
const InteractivePagination = () => {
  const [page, setPage] = useState(1);
  const totalPages = 10;

  const pagination: PaginationInfo = {
    page,
    limit: 10,
    total: 100,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };

  return <Pagination pagination={pagination} onPageChange={setPage} />;
};

export const Interactive: Story = {
  render: () => <InteractivePagination />,
};
