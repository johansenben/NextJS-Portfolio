import clsx from "clsx";
import { Shape, SHAPES } from "./util";

export const COLORS: { [key in Shape]: string } = {
  [SHAPES.EMPTY]: "#bbb",
  [SHAPES.I]: "#00ffff",
  [SHAPES.O]: "#ffff00",
  [SHAPES.T]: "#800080",
  [SHAPES.J]: "#0000ff",
  [SHAPES.L]: "#ffa500",
  [SHAPES.S]: "#008000",
  [SHAPES.Z]: "#ff0000",
} as const;
export default function Cell({
  cellType,
  invisibleEmptyCell = false,
  className = "",
}: {
  cellType: Shape;
  invisibleEmptyCell?: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx("w-[2em] h-[2em] box-border", className)}
      style={{
        background: COLORS[cellType],
        ...(cellType == SHAPES.EMPTY
          ? !invisibleEmptyCell
            ? {
                border: "1px solid #333",
              }
            : {
                background: "none",
              }
          : {
              borderTop: "0.25rem solid #0004",
              borderLeft: "0.25rem solid #0008",
              borderBottom: "0.25rem solid #0008",
              borderRight: "0.25rem solid #0004",
            }),
      }}
    ></div>
  );
}
