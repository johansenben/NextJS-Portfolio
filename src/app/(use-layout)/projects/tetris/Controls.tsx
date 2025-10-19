export default function Controls({
  rotate,
  newShape,
  moveDown,
  moveX,
  playPause,
}: {
  rotate: () => void;
  newShape: () => void;
  moveDown: () => void;
  moveX: (d: 1 | -1) => void;
  playPause: () => void;
}) {
  return (
    <div className="grid w-fit">
      <button onClick={playPause}>Play/Pause</button>
      <button onClick={newShape}>new shape</button>
      <button onClick={moveDown}>down</button>
      <button onClick={() => moveX(-1)}>left</button>
      <button onClick={() => moveX(1)}>right</button>
      <button onClick={rotate}>rotate</button>
    </div>
  );
}
