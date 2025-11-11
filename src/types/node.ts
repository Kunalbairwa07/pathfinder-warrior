export interface Node {
  row: number;
  col: number;
  isStart: boolean;
  isFinish: boolean;
  distance: number;
  isVisited: boolean;
  isWall: boolean;
  previousNode: Node | null;
  isPath: boolean;
  isCurrent: boolean;
  heuristic: number;
  fScore: number;
}
