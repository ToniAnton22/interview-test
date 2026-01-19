import { formatDate } from "@/lib/utils/formatters/formatDate";

describe("formatDate", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns "—" for undefined', () => {
    expect(formatDate(undefined)).toBe("—");
  });

  it('returns "—" for null', () => {
    expect(formatDate(null)).toBe("—");
  });

  it('returns "—" for empty string', () => {
    expect(formatDate("")).toBe("—");
  });

  it("returns original input if date is invalid", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });

  it("formats a valid date deterministically (locale + timezone)", () => {
    const spy = jest
      .spyOn(Date.prototype, "toLocaleDateString")
      .mockReturnValue("MOCK_DATE");

    expect(formatDate("2024-12-31")).toBe("MOCK_DATE");

    expect(spy).toHaveBeenCalledWith("en-US", {
      timeZone: "UTC",
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  });
});
