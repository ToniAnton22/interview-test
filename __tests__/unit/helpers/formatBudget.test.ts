import { formatBudget } from "@/lib/utils/formatters/formatBudget";

describe("formatBudget", () => {
  it("formats 0 as $0", () => {
    expect(formatBudget(0)).toBe("$0");
  });

  it("formats whole numbers with separators and no decimals", () => {
    expect(formatBudget(100)).toBe("$100");
    expect(formatBudget(2500)).toBe("$2,500");
  });

  it("rounds to 0 decimals", () => {
    expect(formatBudget(999.4)).toBe("$999");
    expect(formatBudget(999.5)).toBe("$1,000");
  });

  it("formats negative numbers", () => {
    expect(formatBudget(-50)).toBe("-$50");
  });

  it("formats large numbers", () => {
    expect(formatBudget(1234567)).toBe("$1,234,567");
  });
});
