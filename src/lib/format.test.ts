import { describe, expect, it } from "vitest";
import { formatDate } from "./format";

describe("formatDate", () => {
  it("formats an ISO date", () => {
    expect(formatDate("2026-10-14T00:00:00.000Z")).toBe("14 Oct 2026");
  });

  it("returns empty string for null", () => {
    expect(formatDate(null)).toBe("");
  });
});
