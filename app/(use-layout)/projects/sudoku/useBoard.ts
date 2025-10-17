import { useEffect, useState } from "react";
import {
  boardWidth,
  boxWidth,
  cellContainsNotes,
  createRandomBoard,
  getBoardVal,
  getCellState,
  isValid,
  solveStates,
} from "./util";
import { BoardCellType, BoardType, cellStates } from "./types";
import { solve } from "./util";

export const useBoard = () => {
  const [board, setBoard] = useState<BoardType>(Array(boardWidth*boardWidth).fill(0));
  const [selected, setSelected] = useState(-1);

  useEffect(() => {
    setBoard(createRandomBoard());
  }, []);

  //for when the user clicks on the cell to select it or unselect it
  const clickCell = (index: number = -1) =>
    setSelected(index != selected ? index : -1);

  //sets the cell without any checks
  const setCell = (index: number, value: BoardCellType) => {
    board[index] = value;
    setBoard([...board]);
  };

  const toggleCellNote = (index: number, value: number) => {
    if (board[index] == 0) board[index] = Array(boardWidth).fill(false);
    if (cellContainsNotes(board[index])) {
      board[index][value - 1] = !board[index][value - 1];
      setCell(index, board[index]);
    }
  };

  //removes note in the same row/col/box if the user places the correct number
  const removeNotesAfterCorrectPlacement = (index: number, value: number) => {
    const row = Math.floor(index / boardWidth);
    const col = Math.floor(index % boardWidth);
    for (let i = 0; i < boardWidth; i++) {
      let cell = board[row * boardWidth + i];
      if (cellContainsNotes(cell)) cell[value - 1] = false;
      cell = board[i * boardWidth + col];
      if (cellContainsNotes(cell)) cell[value - 1] = false;
    }
    for (let i = 0; i < boxWidth; i++) {
      for (let j = 0; j < boxWidth; j++) {
        let cell =
          board[
            (Math.floor(row / boxWidth) * boxWidth + i) * boardWidth +
              Math.floor(col / boxWidth) * boxWidth +
              j
          ];
        if (cellContainsNotes(cell)) cell[value - 1] = false;
      }
    }
    setBoard([...board]);
  };

  //only for when user tries to set a cell; it checks if the number is correct
  const user_setCell = (pencilOn: boolean, index: number, value: number) => {
    let b = [...board];
    const state = getCellState(b[index]);
    if (state == cellStates.LOCKED) {
      setSelected(-1);
      return;
    }
    const valid = isValid(b, index, value);
    if (pencilOn && state == cellStates.EMPTY) {console.log(1)
      if (!valid) return;console.log(2)
      toggleCellNote(index, value);
      return;
    }
    b[index] = getBoardVal(cellStates.LOCKED, value);
    const result = solve(b);
    if (valid && result == solveStates.SOLVED) {
      setCell(index, getBoardVal(cellStates.CORRECT_USER_INPUT, value));
      removeNotesAfterCorrectPlacement(index, value);
    } else setCell(index, getBoardVal(cellStates.INCORRECT_USER_INPUT, value));
    setSelected(-1);
  };

  const erase = (index: number) => {
    if (getCellState(board[index]) != cellStates.LOCKED)
      setCell(index, 0);
    setSelected(-1);
  }

  const createNewBoard = () => {
    setBoard(createRandomBoard());
  }

  return { board, selected, clickCell, setCell, user_setCell, erase, createNewBoard };
};
