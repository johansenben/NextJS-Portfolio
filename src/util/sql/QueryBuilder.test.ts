import { Builder } from "./QueryBuilder";

type TableExample = {
	x: number;
	y: string;
};

console.log(
	Builder("x")
		.INSERT<TableExample>({ x: [1], y: ["c", "d"] })
		.RETURNING(["x", { prop: "y", as: "123" }])
		.toString()
);

describe("", () => {
	it("", () => {
		expect(1).toBe(1);
	});
});
