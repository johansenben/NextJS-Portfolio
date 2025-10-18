export default function Controls({
  rotate,
  newShape,
  moveDown,
  moveX,
}: {
  rotate: () => void;
  newShape: () => void;
  moveDown: () => void;
  moveX: (d: 1 | -1) => void;
}) {
  return (
    <div className="grid absolute right-32 top-[50%]">
      <button onClick={rotate}>rotate</button>
      <button onClick={newShape}>new shape</button>
      <button onClick={moveDown}>down</button>
      <button onClick={() => moveX(-1)}>left</button>
      <button onClick={() => moveX(1)}>right</button>
    </div>
  );
}
