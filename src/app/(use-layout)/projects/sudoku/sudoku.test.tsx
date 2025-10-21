import { solve } from "./util";
import { cellStates } from "./types";
import {
	createLockedBoard,
	getBoardVal,
	getCellDisplayValue,
	getCellState,
	getCellStateAsText,
	isValid,
	solveStates
} from "./util";

describe("getCellState", () => {
	const cases = [
		//[boardVal, state]
		[0, cellStates.EMPTY],
		[-1, cellStates.INCORRECT_USER_INPUT],
		[1, cellStates.LOCKED],
		[11, cellStates.CORRECT_USER_INPUT]
	];
	for (const [boardVal, state] of cases) {
		it(`boardVal: ${boardVal}, state: ${getCellStateAsText(boardVal)}`, () => {
			expect(getCellState(boardVal)).toBe(state);
		});
	}
});

describe("getBoardVal", () => {
	const cases = [
		//[state, number, expected boardVal]
		[cellStates.EMPTY, 0, 0],
		[cellStates.LOCKED, 0, 0],
		[cellStates.CORRECT_USER_INPUT, 1, 10],
		[cellStates.INCORRECT_USER_INPUT, 2, -2],
		[cellStates.LOCKED, 3, 3]
	];
	for (const [state, number, boardVal] of cases) {
		it(`state: ${getCellStateAsText(boardVal)}, number: ${number}, boardVal: ${boardVal}`, () => {
			expect(getBoardVal(state, number)).toBe(boardVal);
		});
	}
});

describe("getCellDisplayValue", () => {
	const cases = [
		//[boardVal, displayVal]
		[-5, 5],
		[0, 0],
		[3, 3],
		[9, 9],
		[10, 1],
		[18, 9],
		[20, 2]
	];
	for (const [boardVal, displayVal] of cases) {
		it(`boardVal: ${boardVal}, displayVal: ${displayVal}`, () => {
			expect(getCellDisplayValue(boardVal)).toBe(displayVal);
			expect(getCellDisplayValue(boardVal, true)).toBe(boardVal > 0 ? displayVal : 0);
		});
	}
});

describe("isValid", () => {
	const board = createLockedBoard({ 10: 3 });
	it("same row", () => {
		expect(isValid(board, 11, 3)).toBe(false);
		expect(isValid(board, 12, 3)).toBe(false);
	});
	it("same col", () => {
		expect(isValid(board, 19, 3)).toBe(false);
		expect(isValid(board, 28, 3)).toBe(false);
	});
	it("same 3x3 box", () => {
		expect(isValid(board, 20, 3)).toBe(false);
	});
	it("valid", () => {
		expect(isValid(board, 29, 3)).toBe(true);
	});
});

describe("solve", () => {
	it("empty board", () => {
		expect(solve(createLockedBoard({}))).toBe(solveStates.SOLVED);
	});
	it("solveable board", () => {
		expect(solve(createLockedBoard({ 1: 5, 3: 7, 45: 2, 36: 3, 78: 4, 63: 1 }))).toBe(solveStates.SOLVED);
	});
	it("unsolveable board", () => {
		const unsolvablePuzzles = [
			createLockedBoard({ 0: 5, 1: 5 }),
			createLockedBoard({ 0: 3, 9: 3 }),
			createLockedBoard({ 0: 2, 10: 2 })
		];
		for (const board of unsolvablePuzzles) {
			expect(solve(board)).toBe(solveStates.UNSOLVEABLE);
		}
	});
});
