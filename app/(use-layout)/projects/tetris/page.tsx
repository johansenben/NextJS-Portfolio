"use client";

import { useState } from "react";
import Board from "./Board";
import Controls from "./Controls";
import { useBoard } from "./useBoard";

export default function Tetris() {
  const [ gameStarted, setGameStarted ] = useState(false);
  const [ run, setRun ] = useState(false);
  const { board, rotate, moveX, moveDown, newShape } = useBoard(run);
  return (
    <>
      <Board board={board} startGameOverlay={!gameStarted} startGame={()=>{setGameStarted(true);setRun(true)}} />
      <Controls
        rotate={() => run && rotate()}
        newShape={() => run && newShape()}
        moveDown={() => run && moveDown()}
        moveX={(d: -1 | 1) => run && moveX(d)}
        playPause={()=>gameStarted && setRun(!run)}
      />
    </>
  );
}
