"use client";

import clsx from "clsx";
import styles from "./sudoku.module.css";
import { boxWidth, boardWidth } from "./util";

export default function Cell({
  value,
  index,
  state,
  clickCell,
  isSelected,
}: {
  value: number;
  index: number;
  state: string;
  clickCell: (index?: number) => void;
  isSelected: boolean;
}) {
  //console.log(index, styles[`state-${getCellStateAsText(value)}`])
  return (
    <div
      onClick={() => clickCell(index)}
      className={clsx(
        styles.cell,
        styles[`state-${state}`],
        isSelected ? styles.selected : "",
        { 0: styles.boxBorderOnLeft, [boxWidth - 1]: styles.boxBorderOnRight }[
          index % boxWidth
        ],
        { 0: styles.boxBorderOnTop, [boxWidth - 1]: styles.boxBorderOnBottom }[
          Math.floor(index / boardWidth) % boxWidth
        ],
      )}
    >
      <span>{value == 0 ? "" : value}</span>
    </div>
  );
}
