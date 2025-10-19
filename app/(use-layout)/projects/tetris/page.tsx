"use client";

import { useState } from "react";
import Board from "./Board";
import Controls from "./Controls";
import { useBoard } from "./useBoard";
import TetrisLogo from "./TetrisLogo";

export default function Tetris() {
  const [ gameStarted, setGameStarted ] = useState(false);
  const [ run, setRun ] = useState(false);
  const { board, rotate, moveX, moveDown, newShape } = useBoard(run);
  return (
    <div className="mt-4 grid grid-cols-[auto_auto] w-fit gap-4 mx-auto">
      <Board board={board} startGameOverlay={!gameStarted} startGame={()=>{setGameStarted(true);setRun(true)}} />
      <TetrisLogo />
      <Controls
        rotate={() => run && rotate()}
        newShape={() => run && newShape()}
        moveDown={() => run && moveDown()}
        moveX={(d: -1 | 1) => run && moveX(d)}
        playPause={()=>gameStarted && setRun(!run)}
      />
    </div>
  );
}
