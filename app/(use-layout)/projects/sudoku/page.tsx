"use client";
import { useState } from "react";
import Board from "./Board";
import styles from "./sudoku.module.css";

import { EraseCellButton, NewBoardButton, NumberBtn, PencilToggle, SolveButton } from "./Buttons";
import { useBoard } from "./useBoard";

export default function Sudoku() {
  const [isSolving, setIsSolving] = useState(false);
  const [pencilOn, setPencilOn] = useState(false);
  const { board, selected, clickCell, setCell, user_setCell, erase, createNewBoard } = useBoard();

  return (
    <>
      <Board
        board={board}
        setCell={setCell}
        solveBoard={isSolving}
        selectedCell={selected}
        clickCell={clickCell}
        stopSolving={() => setIsSolving(false)}
      />
      <div className={styles.bottomBtnsRow}>
        {Array.from({ length: 9 }, (_, i) => (
          <NumberBtn
            num={i + 1}
            selectedCell={selected}
            user_setCell={(index: number, value: number) =>
              user_setCell(pencilOn, index, value)
            }
            key={`numberBtn-${i}`}
          />
        ))}
      </div>
      <div className={styles.bottomBtnsRow}>
        <PencilToggle isPencilOn={pencilOn} togglePencil={() => setPencilOn(!pencilOn)} />
        <EraseCellButton eraseSelected={() => erase(selected)}/>
        <SolveButton setIsSolving={setIsSolving} />
        <NewBoardButton createNewBoard={createNewBoard} />
      </div>
    </>
  );
}
