import { Node } from "@/types/node";

function heuristic(nodeA: Node, nodeB: Node): number {
  // Manhattan distance
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

export function aStar(grid: Node[][], startNode: Node, finishNode: Node): Node[] {
  const visitedNodesInOrder: Node[] = [];
  const openSet: Node[] = [startNode];
  startNode.distance = 0;
  startNode.fScore = heuristic(startNode, finishNode);

  while (openSet.length > 0) {
    // Sort by fScore
    openSet.sort((a, b) => a.fScore - b.fScore);
    const currentNode = openSet.shift()!;

    if (currentNode.isWall) continue;
    if (currentNode.isVisited) continue;

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    if (currentNode === finishNode) return visitedNodesInOrder;

    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (neighbor.isVisited || neighbor.isWall) continue;

      const tentativeGScore = currentNode.distance + 1;

      if (tentativeGScore < neighbor.distance) {
        neighbor.previousNode = currentNode;
        neighbor.distance = tentativeGScore;
        neighbor.heuristic = heuristic(neighbor, finishNode);
        neighbor.fScore = neighbor.distance + neighbor.heuristic;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return visitedNodesInOrder;
}

function getNeighbors(node: Node, grid: Node[][]): Node[] {
  const neighbors: Node[] = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors;
}
