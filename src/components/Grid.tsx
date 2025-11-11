import { Node as NodeType } from "@/types/node";
import { GridNode } from "./GridNode";

interface GridProps {
  grid: NodeType[][];
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

export const Grid = ({ grid, onMouseDown, onMouseEnter, onMouseUp }: GridProps) => {
  return (
    <div 
      className="inline-block border border-border rounded-md overflow-hidden"
      onMouseLeave={onMouseUp}
    >
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="flex">
          {row.map((node, nodeIdx) => (
            <GridNode
              key={nodeIdx}
              node={node}
              onMouseDown={onMouseDown}
              onMouseEnter={onMouseEnter}
              onMouseUp={onMouseUp}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
