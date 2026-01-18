import { render, screen, fireEvent, within } from "@testing-library/react";
import Pagination, { PaginationInfo } from "@/components/Pagination";

describe("Pagination", () => {
  const onPageChange = jest.fn();

  beforeEach(() => onPageChange.mockClear());

  const renderWith = (p: Partial<PaginationInfo>) => {
    const pagination: PaginationInfo = {
      page: 1,
      limit: 10,
      total: 50,
      totalPages: 5,
      hasNext: true,
      hasPrev: false,
      ...p,
    };

    const utils = render(
      <Pagination pagination={pagination} onPageChange={onPageChange} />,
    );
    return { pagination, ...utils };
  };

  it("returns null when totalPages <= 1", () => {
    const { container } = renderWith({ totalPages: 1 });
    expect(container.firstChild).toBeNull();
  });

  it("renders all page numbers when totalPages <= 5 (no ellipsis)", () => {
    renderWith({ totalPages: 5, page: 3, hasPrev: true, hasNext: true });

    const nav = screen.getByRole("navigation", { name: /pagination/i });
    const w = within(nav);

    // buttons 1..5 exist
    for (let i = 1; i <= 5; i++) {
      expect(w.getByRole("button", { name: String(i) })).toBeInTheDocument();
    }

    // no ellipsis
    expect(w.queryByText("...")).not.toBeInTheDocument();
  });

  it("renders leading and trailing ellipsis when in the middle of many pages", () => {
    renderWith({ totalPages: 10, page: 5, hasPrev: true, hasNext: true });

    const nav = screen.getByRole("navigation", { name: /pagination/i });
    const w = within(nav);

    const ellipses = w.getAllByText("...");
    expect(ellipses).toHaveLength(2); // one before, one after

    // first and last always present
    expect(w.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(w.getByRole("button", { name: "10" })).toBeInTheDocument();

    // around current: 4,5,6
    expect(w.getByRole("button", { name: "4" })).toBeInTheDocument();
    expect(w.getByRole("button", { name: "5" })).toBeInTheDocument();
    expect(w.getByRole("button", { name: "6" })).toBeInTheDocument();
  });

  it("does not render leading ellipsis when page <= 3", () => {
    renderWith({ totalPages: 10, page: 3, hasPrev: true, hasNext: true });

    const nav = screen.getByRole("navigation", { name: /pagination/i });
    const w = within(nav);

    // should only have trailing ellipsis
    expect(w.getAllByText("...")).toHaveLength(1);
  });

  it("does not render trailing ellipsis when page >= totalPages - 2", () => {
    renderWith({ totalPages: 10, page: 9, hasPrev: true, hasNext: true });

    const nav = screen.getByRole("navigation", { name: /pagination/i });
    const w = within(nav);

    // should only have leading ellipsis
    expect(w.getAllByText("...")).toHaveLength(1);
    expect(w.getByRole("button", { name: "10" })).toBeInTheDocument();
  });

  it("highlights the current page button with active classes", () => {
    renderWith({ totalPages: 10, page: 5, hasPrev: true, hasNext: true });

    const nav = screen.getByRole("navigation", { name: /pagination/i });
    const current = within(nav).getByRole("button", { name: "5" });

    expect(current).toHaveClass("bg-blue-600", "text-white", "z-10");
  });

  it("calls onPageChange when clicking a page number", () => {
    renderWith({ totalPages: 10, page: 5, hasPrev: true, hasNext: true });

    const nav = screen.getByRole("navigation", { name: /pagination/i });
    fireEvent.click(within(nav).getByRole("button", { name: "6" }));

    expect(onPageChange).toHaveBeenCalledWith(6);
  });

  it("prev/next buttons call onPageChange with page-1/page+1 (desktop)", () => {
    renderWith({ totalPages: 10, page: 5, hasPrev: true, hasNext: true });

    const nav = screen.getByRole("navigation", { name: /pagination/i });
    const w = within(nav);

    fireEvent.click(w.getByRole("button", { name: /previous/i }));
    fireEvent.click(w.getByRole("button", { name: /next/i }));

    expect(onPageChange).toHaveBeenCalledWith(4);
    expect(onPageChange).toHaveBeenCalledWith(6);
  });

  it("disables prev/next appropriately (desktop)", () => {
    renderWith({ totalPages: 10, page: 1, hasPrev: false, hasNext: true });

    const nav = screen.getByRole("navigation", { name: /pagination/i });
    const w = within(nav);

    expect(w.getByRole("button", { name: /previous/i })).toBeDisabled();
    expect(w.getByRole("button", { name: /next/i })).not.toBeDisabled();
  });

  it("renders correct 'Showing X to Y of Z results' and clamps end on last page", () => {
    renderWith({
      page: 5,
      limit: 10,
      total: 42,
      totalPages: 5,
      hasPrev: true,
      hasNext: false,
    });

    const matches = screen.getAllByText((_, node) => {
      const t = node?.textContent?.replace(/\s+/g, " ").trim();
      return t === "Showing 41 to 42 of 42 results";
    });

    // pick the <p> (avoid the wrapping <div>)
    const p = matches.find((el) => el.tagName.toLowerCase() === "p");
    expect(p).toBeTruthy();
  });

  it("mobile Previous/Next buttons also call onPageChange", () => {
    renderWith({ totalPages: 10, page: 5, hasPrev: true, hasNext: true });

    const prevButtons = screen.getAllByRole("button", { name: /previous/i });
    const nextButtons = screen.getAllByRole("button", { name: /next/i });

    // click the mobile ones: they have visible text content "Previous"/"Next"
    const mobilePrev = prevButtons.find(
      (b) => b.textContent?.trim() === "Previous",
    );
    const mobileNext = nextButtons.find(
      (b) => b.textContent?.trim() === "Next",
    );

    expect(mobilePrev).toBeTruthy();
    expect(mobileNext).toBeTruthy();

    fireEvent.click(mobilePrev!);
    fireEvent.click(mobileNext!);

    expect(onPageChange).toHaveBeenCalledWith(4);
    expect(onPageChange).toHaveBeenCalledWith(6);
  });

  it("ellipsis nodes are spans (not buttons)", () => {
    renderWith({ totalPages: 10, page: 5, hasPrev: true, hasNext: true });

    const nav = screen.getByRole("navigation", { name: /pagination/i });
    const w = within(nav);

    w.getAllByText("...").forEach((el) => {
      expect(el.tagName.toLowerCase()).toBe("span");
    });
  });
});
