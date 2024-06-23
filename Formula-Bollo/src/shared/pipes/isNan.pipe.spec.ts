import { IsNanPipe } from "./isNan.pipe";

describe("IsNanPipe", () => {
  let pipe: IsNanPipe;

  beforeEach(() => {
    pipe = new IsNanPipe();
  });

  it("create an instance", () => {
    expect(pipe).toBeTruthy();
  });

  it("should return false for NaN", () => {
    expect(pipe.transform(NaN)).toBe(false);
  });

  it("should return true for a number", () => {
    expect(pipe.transform(123)).toBe(true);
  });

  it("should return true for zero", () => {
    expect(pipe.transform(0)).toBe(true);
  });

  it("should return true for a negative number", () => {
    expect(pipe.transform(-123)).toBe(true);
  });

  it("should return true for Infinity", () => {
    expect(pipe.transform(Infinity)).toBe(true);
  });

  it("should return true for -Infinity", () => {
    expect(pipe.transform(-Infinity)).toBe(true);
  });
});
