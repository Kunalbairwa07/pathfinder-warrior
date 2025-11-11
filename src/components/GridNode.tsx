import { Node } from "@/types/node";
import { cn } from "@/lib/utils";

interface GridNodeProps {
  node: Node;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

export const GridNode = ({ node, onMouseDown, onMouseEnter, onMouseUp }: GridNodeProps) => {
  const { row, col, isStart, isFinish, isWall, isVisited, isPath, isCurrent } = node;

  const getNodeClass = () => {
    if (isStart) return "bg-node-start";
    if (isFinish) return "bg-node-end";
    if (isPath) return "bg-node-path animate-node-path";
    if (isCurrent) return "bg-node-current animate-pulse-glow";
    if (isWall) return "bg-node-wall";
    if (isVisited) return "bg-node-visited animate-node-visited";
    return "bg-secondary hover:bg-secondary/70";
  };

  return (
    <div
      className={cn(
        "w-6 h-6 border border-border/30 cursor-pointer transition-colors",
        getNodeClass()
      )}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={onMouseUp}
    />
  );
};
