import { datesUtil } from "./dates.util";

describe("formatDate", () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date("2024-11-05T15:00:00.000Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("returns hours when the date is today", () => {
    const result = datesUtil.formatDate("2024-11-05T12:00:00.000Z");
    expect(result).toBe("3h"); 
  });

  it('returns "Yesterday" for a date that was yesterday', () => {
    const result = datesUtil.formatDate("2024-11-04T15:00:00.000Z");
    expect(result).toBe("Yesterday");
  });

  it("returns days when the date is less than a week ago", () => {
    const result = datesUtil.formatDate("2024-10-30T15:00:00.000Z");
    expect(result).toBe("6d");
  });

  it("returns the formatted date if it’s more than a week ago in the same year", () => {
    const result = datesUtil.formatDate("2024-10-01T15:00:00.000Z");
    expect(result).toBe("Oct 1");
  });

  it("returns the formatted date with the year if it’s from a previous year", () => {
    const result = datesUtil.formatDate("2023-09-30T15:00:00.000Z");
    expect(result).toBe("Sep 30, 2023");
  });
});
