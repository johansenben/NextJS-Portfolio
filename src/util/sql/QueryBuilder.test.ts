import { Builder } from "./queryBuilder";

console.log(
  Builder.SELECT(null, "x", ["a", { prop: "b", as: "c" }])
    .JOIN("INNER", "y", ["x", "=", ""])
    .WHERE("a", "=", "3")
    .GROUP_BY("a", "b")
    .toString(),
);

describe("", () => {
  it("", () => {
    expect(1).toBe(1);
  });
});
