import { SpaceToUnderscorePipe } from "./spaceToUnderscore.pipe";

describe("SpaceToUnderscorePipe", () => {
  let pipe: SpaceToUnderscorePipe;

  beforeEach(() => {
    pipe = new SpaceToUnderscorePipe();
  });

  it("create an instance", () => {
    expect(pipe).toBeTruthy();
  });

  it("should transform hello world to hello_world", () => {
    expect(pipe.transform("hello world")).toBe("hello_world");
  });

  it("should transform angular pipe test to angular_pipe_test", () => {
    expect(pipe.transform("angular pipe test")).toBe("angular_pipe_test");
  });

  it("should transform multiple   spaces to multiple___spaces", () => {
    expect(pipe.transform("multiple   spaces")).toBe("multiple___spaces");
  });

  it("should return an empty string if input is empty", () => {
    expect(pipe.transform("")).toBe("");
  });

  it("should not alter a string with no spaces", () => {
    expect(pipe.transform("nospace")).toBe("nospace");
  });

  it("should handle strings with leading and trailing spaces", () => {
    expect(pipe.transform("  leading and trailing  ")).toBe("__leading_and_trailing__");
  });

  it("should handle strings with only spaces", () => {
    expect(pipe.transform("     ")).toBe("_____");
  });
});
