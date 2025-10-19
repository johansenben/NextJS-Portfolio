import clsx from "clsx";
import styles from "./sudoku.module.css";
import { PencilIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/16/solid";

export function NumberBtn({
  num,
  selectedCell,
  user_setCell,
}: {
  num: number;
  selectedCell: number;
  user_setCell: (index: number, value: number) => void;
}) {
  return (
    <button
      className={clsx(
        styles.numberBtn,
        "select-none cursor-pointer px-3 py-2 border-solid border-[1px]",
      )}
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
    <div
      onClick={() => setIsSolving(true)}
      className="select-none cursor-pointer flex items-center justify-center flex-col"
    >
      <PlayIcon className="w-8" />
      <span>Solve</span>
    </div>
  );
}

export function PencilToggle({
  togglePencil,
  isPencilOn,
}: {
  togglePencil: () => void;
  isPencilOn: boolean;
}) {
  return (
    <div
      onClick={togglePencil}
      className={clsx(
        "select-none cursor-pointer",
        isPencilOn ? "text-blue-600" : "text-black",
      )}
    >
      <PencilIcon className={clsx("w-8")}></PencilIcon>
      <span>{isPencilOn ? "On" : "Off"}</span>
    </div>
  );
}
export function EraseCellButton({
  eraseSelected,
}: {
  eraseSelected: () => void;
}) {
  return (
    <div
      onClick={eraseSelected}
      className="select-none cursor-pointer flex items-center justify-center flex-col"
    >
      <TrashIcon className="w-8" />
      <span>Delete</span>
    </div>
  );
}

export function NewBoardButton({
  createNewBoard,
}: {
  createNewBoard: () => void;
}) {
  return (
    <div
      onClick={createNewBoard}
      className="select-none cursor-pointer flex items-center justify-center flex-col"
    >
      <svg
        className="w-8"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        {/* Outer border */}
        <rect x="2" y="2" width="20" height="20" />

        {/* Vertical lines */}
        <line x1="8" y1="2" x2="8" y2="22" />
        <line x1="16" y1="2" x2="16" y2="22" />

        {/* Horizontal lines */}
        <line x1="2" y1="8" x2="22" y2="8" />
        <line x1="2" y1="16" x2="22" y2="16" />
      </svg>
      <span>New</span>
    </div>
  );
}
