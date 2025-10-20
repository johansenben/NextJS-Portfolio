import Cell from "./Cell";
import { Shape, SHAPES } from "./util";

const layouts: Record<Shape, { width: number; shape: Shape[] }> = {
  [SHAPES.EMPTY]: { width: 1, shape: [0, 0, 0, 0] },
  [SHAPES.I]: { width: 1, shape: [1, 1, 1, 1] },
  [SHAPES.J]: { width: 2, shape: [0, 4, 0, 4, 4, 4, 0, 0] },
  [SHAPES.L]: { width: 2, shape: [5, 0, 5, 0, 5, 5, 0, 0] },
  [SHAPES.O]: { width: 2, shape: [2, 2, 2, 2, 0, 0, 0, 0] },
  [SHAPES.S]: { width: 3, shape: [0, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0] },
  [SHAPES.T]: { width: 3, shape: [3, 3, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0] },
  [SHAPES.Z]: { width: 3, shape: [7, 7, 0, 0, 7, 7, 0, 0, 0, 0, 0, 0] },
};

export default function NextShape({ shapeType }: { shapeType: Shape }) {
  return (
    <div
      className="grid w-fit h-fit text-[0.75rem] mx-auto"
      style={{
        gridTemplateColumns: `repeat(${layouts[shapeType].width}, auto)`,
      }}
    >
      {layouts[shapeType].shape.map((cell, i) => (
        <Cell key={`next-shape-${i}`} cellType={cell} invisibleEmptyCell />
      ))}
    </div>
  );
}
