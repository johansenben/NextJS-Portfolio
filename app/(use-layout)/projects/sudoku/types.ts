export type BoardCellType = number | boolean[];
export type BoardType = BoardCellType[];

export const cellStates = {
  EMPTY: 0,
  LOCKED: 1,
  CORRECT_USER_INPUT: 2,
  INCORRECT_USER_INPUT: 3,
  SOLVER_INPUT: 4,
} as const;
export type CellState = (typeof cellStates)[keyof typeof cellStates];
