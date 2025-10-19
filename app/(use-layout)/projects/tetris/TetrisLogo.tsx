import Cell from "./Cell"
import { Shape } from "./util"

export default function TetrisLogo() {
  const layout: Shape[] = [
    7,7,7,5,5,5,2,2,2,6,6,0,1,3,3,3,
    0,7,0,5,0,0,0,2,0,6,0,6,1,3,0,0,
    0,7,0,5,5,5,0,2,0,6,6,0,1,3,3,3,
    0,7,0,5,0,0,0,2,0,6,0,6,1,0,0,3,
    0,7,0,5,5,5,0,2,0,6,0,6,1,3,3,3,
  ]
  return (
    <div className="grid grid-rows-[repeat(5,auto)] grid-cols-[repeat(16,auto)] w-fit h-fit text-[0.5rem]">
    {
      layout.map((type,i) => <Cell key={`tetris-logo-${i}`} cellType={type} invisibleEmptyCell />)
    }
    </div>
  )
}