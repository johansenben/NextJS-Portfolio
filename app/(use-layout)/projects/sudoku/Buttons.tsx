import styles from "./sudoku.module.css";

export function NumberBtn({
  num,
  selectedCell,
  user_setCell
}: {
  num: number;
  selectedCell: number;
  user_setCell: (index: number, value: number) => void;
}) {
  return (
    <button
      className={styles.numberBtn}
      onClick={() => {
        if (selectedCell != -1) user_setCell(selectedCell, num);
      }}
    >
      {num}
    </button>
  );
}

export function SolveButton({
  setIsSolving,
}: {
  setIsSolving: (isSolving: boolean) => void;
}) {
  return (
    <button className={styles.solveBtn} onClick={() => setIsSolving(true)}>
      Solve
    </button>
  );
}

export function PencilToggle(){

}
export function RemoveNotesButton(){

}
export function NewBoardButton(){

}