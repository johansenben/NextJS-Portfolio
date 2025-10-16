import {
  BoardCellType,
  BoardType,
  boardWidth,
  boxWidth,
  cellContainsNotes,
  cellStates,
  getBoardVal,
  getCellState,
  isValid,
  solve,
  solveStates,
} from "./util";

//for when the user clicks on the cell to select it or unselect it
export const clickCell = (
  selected: number,
  setSelected: (index: number) => void,
  index: number = -1,
) => {
  setSelected(index != selected ? index : -1);
};

//sets the cell without any checks
export const setCell = (
  board: BoardType,
  setBoard: (b: BoardType) => void,
  index: number,
  value: BoardCellType,
) => {
  board[index] = value;
  setBoard([...board]);
};

export const toggleCellNote = (
  board: BoardType,
  setBoard: (b: BoardType) => void,
  index: number,
  value: number,
) => {
  if (board[index] == 0) board[index] = Array(boardWidth).fill(false);
  if (cellContainsNotes(board[index])) {
    board[index][value - 1] = !board[index][value - 1];
    setCell(board, setBoard, index, board[index]);
  }
};

//removes note in the same row/col/box if the user places the correct number
export const removeNotesAfterCorrectPlacement = (
  board: BoardType,
  setBoard: (b: BoardType) => void,
  index: number,
  value: number,
) => {
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
export const user_setCell = (
  board: BoardType,
  setBoard: (b: BoardType) => void,
  setSelected: (i: number) => void,
  pencilOn: boolean,
  index: number,
  value: number,
) => {
  let b = [...board];
  const state = getCellState(b[index]);
  if (state == cellStates.LOCKED) {
    setSelected(-1);
    return;
  }
  const valid = isValid(b, index, value);
  if (pencilOn && state == cellStates.EMPTY) {
    if (!valid) return;
    toggleCellNote(board, setBoard, index, value);
    return;
  }
  b[index] = getBoardVal(cellStates.LOCKED, value);
  const result = solve(b);
  if (valid && result == solveStates.SOLVED) {
    setCell(
      board,
      setBoard,
      index,
      getBoardVal(cellStates.CORRECT_USER_INPUT, value),
    );
    removeNotesAfterCorrectPlacement(board, setBoard, index, value);
  } else
    setCell(
      board,
      setBoard,
      index,
      getBoardVal(cellStates.INCORRECT_USER_INPUT, value),
    );
  setSelected(-1);
};
