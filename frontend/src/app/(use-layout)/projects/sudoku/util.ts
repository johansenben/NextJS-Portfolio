import { iDiv } from "@/util/global-utils";
import { BoardCellType, BoardType, CellState, cellStates } from "./types";

export const boxWidth = 3;
export const boardWidth = boxWidth ** 2;

export const cellContainsNotes = (boardVal: BoardCellType) => Array.isArray(boardVal);
export const getCellState = (boardVal: BoardCellType) => {
	if (boardVal == 0 || cellContainsNotes(boardVal)) return cellStates.EMPTY;
	if (boardVal < 0) return cellStates.INCORRECT_USER_INPUT;
	if (boardVal <= boardWidth) return cellStates.LOCKED;
	if (boardVal <= 2 * boardWidth) return cellStates.CORRECT_USER_INPUT;
	return cellStates.SOLVER_INPUT;
};
export const getCellStateAsText = (boardVal: BoardCellType) => {
	const state = getCellState(boardVal);
	return (
		{
			0: "empty",
			1: "locked",
			2: "correctUserInput",
			3: "incorrectUserInput",
			4: "solverInput"
		}[state] ?? "empty"
	);
};
export const getBoardVal = (state: number, num: number = 0) => {
	if (state == cellStates.EMPTY) return 0;
	if (state == cellStates.INCORRECT_USER_INPUT) return num * -1;
	if (state == cellStates.LOCKED) return num;
	if (state == cellStates.CORRECT_USER_INPUT) return num + boardWidth;
	return num + boardWidth * 2;
};

export const getCellDisplayValue = (boardVal: BoardCellType, removeIncorrectValues: boolean = false) => {
	if (cellContainsNotes(boardVal)) return boardVal;
	if (removeIncorrectValues && boardVal < 0) return 0;
	if (boardVal == 0) return 0;
	if (boardVal < 0) return boardVal * -1;
	return ((boardVal - 1) % boardWidth) + 1;
};

export const isValid = (board: BoardType, index: number, value: number) => {
	const row = iDiv(index / boardWidth);
	const col = index % boardWidth;
	for (let i = 0; i < boardWidth; i++) {
		if (getCellDisplayValue(board[row * boardWidth + i], true) == value) return false;
		if (getCellDisplayValue(board[i * boardWidth + col], true) == value) return false;
	}
	for (let i = 0; i < boxWidth; i++) {
		for (let j = 0; j < boxWidth; j++) {
			let indexToCheck = (iDiv(row / boxWidth) * boxWidth + i) * boardWidth + iDiv(col / boxWidth) * boxWidth + j;
			if (getCellDisplayValue(board[indexToCheck], true) == value) return false;
		}
	}
	return true;
};
export const solveStates = {
	SOLVING: 0,
	SOLVED: 1,
	UNSOLVEABLE: 2,
	NOT_SOLVING: 3
};

export function solve(board: BoardType) {
	let iterations = 0;
	let tryValue = 1;
	let currentIndex = 0;
	let reverse = false;
	while (iterations < 100000 && currentIndex >= 0 && currentIndex < boardWidth ** 2) {
		iterations++;
		if (
			([cellStates.LOCKED, cellStates.CORRECT_USER_INPUT] as CellState[]).includes(getCellState(board[currentIndex]))
		) {
			if (reverse) {
				currentIndex--;
				tryValue = cellContainsNotes(board[currentIndex]) ? 0 : (getCellDisplayValue(board[currentIndex]) as number);
				continue;
			}
			currentIndex++;
			tryValue = 1;
			continue;
		}
		if (tryValue > boardWidth) {
			board[currentIndex] = getBoardVal(cellStates.EMPTY, 0);
			currentIndex--;
			tryValue = cellContainsNotes(board[currentIndex]) ? 0 : (getCellDisplayValue(board[currentIndex]) as number);
			reverse = true;
			continue;
		}
		if (isValid(board, currentIndex, tryValue)) {
			board[currentIndex] = getBoardVal(cellStates.SOLVER_INPUT, tryValue);
			currentIndex++;
			tryValue = 1;
			reverse = false;
			continue;
		}
		tryValue++;
	}
	if (currentIndex >= boardWidth ** 2) return solveStates.SOLVED;
	return solveStates.UNSOLVEABLE;
}

export const createLockedBoard = (setCells: Record<number, BoardCellType>) =>
	Array.from({ length: boardWidth ** 2 }, (_, i) => setCells[i] ?? 0);
export const createRandomBoard = (cellsToFill = 10) => {
	let board = Array(boardWidth ** 2).fill(0);
	let cellsFilled = 0;
	let tries = 0;
	while (cellsFilled < cellsToFill && tries < 200) {
		tries++;
		const index = iDiv(Math.random() * boardWidth ** 2);
		const value = iDiv(Math.random() * boardWidth);
		const copy: BoardType = [...board];
		if (!isValid(copy, index, value)) continue;
		const state = solve(copy);
		if (state == solveStates.SOLVED) {
			board[index] = getBoardVal(cellStates.LOCKED, value);
			cellsFilled++;
		}
	}
	return board;
};
