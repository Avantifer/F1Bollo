import { PricePipe } from "./price.pipe";

describe("PricePipe", () => {
  let pipe: PricePipe;

  beforeEach(() => {
    pipe = new PricePipe();
  });

  it("create an instance", () => {
    expect(pipe).toBeTruthy();
  });

  it("should format 1234 as 1.234", () => {
    expect(pipe.transform(1234)).toBe("1.234");
  });

  it("should format 1234567 as 1.234.567", () => {
    expect(pipe.transform(1234567)).toBe("1.234.567");
  });

  it("should format 123 as 123", () => {
    expect(pipe.transform(123)).toBe("123");
  });

  it("should format 1234567890 as 1.234.567.890", () => {
    expect(pipe.transform(1234567890)).toBe("1.234.567.890");
  });

  it("should format -1234 as -1.234", () => {
    expect(pipe.transform(-1234)).toBe("-1.234");
  });

  it("should format -1234567 as -1.234.567", () => {
    expect(pipe.transform(-1234567)).toBe("-1.234.567");
  });

  it("should format 0 as 0", () => {
    expect(pipe.transform(0)).toBe("0");
  });

  it("should format -0 as 0", () => {
    expect(pipe.transform(-0)).toBe("0");
  });

  it("should format 12 as 12", () => {
    expect(pipe.transform(12)).toBe("12");
  });

  it("should format -12 as -12", () => {
    expect(pipe.transform(-12)).toBe("-12");
  });
});
