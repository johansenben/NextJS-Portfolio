"use client";

import { useEffect, useState } from "react";
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  CellData,
  Shape,
  SHAPE_LAYOUTS,
  SHAPES,
} from "./util";
import { iDiv } from "@/global-utils";

const getShape = (shapeType: Shape, rotation: number) => {
  return (
    SHAPE_LAYOUTS[shapeType][rotation]?.map((isTile) =>
      isTile ? shapeType : SHAPES.EMPTY,
    ) ?? Array(16).fill(SHAPES.EMPTY)
  );
};
const getBoardData = (
  board: Shape[],
  shape: Shape[],
  [shapeX, shapeY]: [number, number],
) => {
  return board.map((tile, i) => {
    const x = i % BOARD_WIDTH,
      y = iDiv(i / BOARD_WIDTH);
    return {
      tile:
        x >= shapeX &&
        y >= shapeY &&
        x < shapeX + 4 &&
        y < shapeY + 4 &&
        shape[(y - shapeY) * 4 + (x - shapeX)] != SHAPES.EMPTY
          ? shape[(y - shapeY) * 4 + (x - shapeX)]
          : tile,
    } as CellData;
  });
};
const useCurrentShape = () => {
  const [shapeType, setShapeType] = useState<Shape>(SHAPES.EMPTY);
  const [nextShapeType, setNextShapeType] = useState<Shape>(SHAPES.EMPTY);
  const [rotation, setRotation] = useState(0);
  const [pos, setPos] = useState([3, -4]);

  const canMoveX = (board: Shape[], shape: Shape[], deltaX: 1 | -1) => {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const shapeCoord = y * 4 + x;
        if (shape[shapeCoord] == SHAPES.EMPTY) continue;

        const newX = pos[0] + x + deltaX;
        const newY = pos[1] + y;

        if (newX < 0 || newX >= BOARD_WIDTH) return false;
        if (board[newY * BOARD_WIDTH + newX] != SHAPES.EMPTY) return false;
      }
    }
    return true;
  };
  const canMoveDown = (board: Shape[], shape: Shape[]) => {
    for (let y = 3; y >= 0; y--) {
      for (let x = 0; x < 4; x++) {
        const shapeCoord = y * 4 + x;
        if (shape[shapeCoord] == SHAPES.EMPTY) continue;

        const newX = pos[0] + x;
        const newY = pos[1] + y + 1;

        if (newY >= BOARD_HEIGHT) return false;
        if (newY >= 0 && board[newY * BOARD_WIDTH + newX] != SHAPES.EMPTY)
          return false;
      }
    }
    return true;
  };
  const lockShape = (setBoard: SetState<Shape[]>, shape: Shape[]) => {
    setBoard((prev) =>
      prev.map((tile, i) => {
        const x = i % BOARD_WIDTH,
          y = iDiv(i / BOARD_WIDTH);
        return x >= pos[0] &&
          y >= pos[1] &&
          x < pos[0] + 4 &&
          y < pos[1] + 4 &&
          shape[(y - pos[1]) * 4 + (x - pos[0])] != SHAPES.EMPTY
          ? shape[(y - pos[1]) * 4 + (x - pos[0])]
          : tile;
      }),
    );
    newShape();
  };

  const rotate = () => setRotation((rotation + 1) % 4);
  const moveX = (board: Shape[], shape: Shape[], delta: 1 | -1) => {
    if (canMoveX(board, shape, delta)) setPos([pos[0] + delta, pos[1]]);
  };
  const newShape = () => {
    setPos([3, -4]);
    setRotation(0);
    const shapes = Object.values(SHAPES).filter(s => s != SHAPES.EMPTY);
    setShapeType(
      nextShapeType != SHAPES.EMPTY
        ? nextShapeType
        : shapes[iDiv(Math.random() * shapes.length)],
    );
    setNextShapeType(shapes[iDiv(Math.random() * shapes.length)]);
  };
  const moveDown = (
    board: Shape[],
    setBoard: SetState<Shape[]>,
    shape: Shape[],
  ) => {
    if (shapeType == SHAPES.EMPTY) newShape();
    setPos([pos[0], pos[1] + 1]);
    if (!canMoveDown(board, shape)) lockShape(setBoard, shape);
  };

  return {
    shape: getShape(shapeType, rotation),
    pos,
    rotate,
    moveX,
    moveDown,
    newShape,
    nextShapeType,
  };
};
export const useBoard = (run = false) => {
  const [board, setBoard] = useState(
    Array(BOARD_WIDTH * BOARD_HEIGHT).fill(SHAPES.EMPTY),
  );
  const {
    shape,
    pos: [x, y],
    rotate,
    moveX,
    moveDown,
    newShape,
    nextShapeType,
  } = useCurrentShape();

  const removeFullRows = () => {
    setBoard((prev) => {
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          if (prev[y * BOARD_WIDTH + x] == SHAPES.EMPTY) break;
          if (x == BOARD_WIDTH - 1) {
            for (let y2 = y; y2 > 0; y2--) {
              for (let x2 = 0; x2 < BOARD_WIDTH; x2++) {
                prev[y2 * BOARD_WIDTH + x2] = prev[(y2 - 1) * BOARD_WIDTH + x2];
              }
            }
          }
        }
      }
      return [...prev];
    });
  };

  useEffect(() => {
    if (!run) return;

    const interval = setInterval(() => {
      moveDown(board, setBoard, shape);
      removeFullRows();
    }, 500);

    return () => clearInterval(interval);
  }, [run, shape, board]);

  return {
    board: getBoardData(board, shape, [x, y]),
    rotate,
    moveX: (d: 1 | -1) => {
      moveX(board, shape, d);
      removeFullRows();
    },
    moveDown: () => {
      moveDown(board, setBoard, shape);
      removeFullRows();
    },
    newShape,
    nextShapeType,
  };
};
