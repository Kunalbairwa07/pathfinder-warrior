import { useState, useEffect, useCallback } from "react";
import { Grid } from "./Grid";
import { ControlPanel } from "./ControlPanel";
import { MetricsPanel } from "./MetricsPanel";
import { InfoPanel } from "./InfoPanel";
import { dijkstra, getNodesInShortestPathOrder } from "@/algorithms/dijkstra";
import { aStar } from "@/algorithms/aStar";
import { bfs } from "@/algorithms/bfs";
import { dfs } from "@/algorithms/dfs";
import { Node } from "@/types/node";

const GRID_ROWS = 20;
const GRID_COLS = 50;
const START_NODE_ROW = 10;
const START_NODE_COL = 10;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 40;

export type AlgorithmType = "dijkstra" | "astar" | "bfs" | "dfs";

export const PathfindingVisualizer = () => {
  const [grid, setGrid] = useState<Node[][]>([]);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>("dijkstra");
  const [speed, setSpeed] = useState(10);
  const [metrics, setMetrics] = useState({
    pathLength: 0,
    nodesVisited: 0,
    executionTime: 0,
  });

  useEffect(() => {
    const initialGrid = createInitialGrid();
    setGrid(initialGrid);
  }, []);

  const createInitialGrid = (): Node[][] => {
    const grid: Node[][] = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      const currentRow: Node[] = [];
      for (let col = 0; col < GRID_COLS; col++) {
        currentRow.push(createNode(row, col));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  const createNode = (row: number, col: number): Node => {
    return {
      row,
      col,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
      isPath: false,
      isCurrent: false,
      heuristic: 0,
      fScore: Infinity,
    };
  };

  const handleMouseDown = (row: number, col: number) => {
    if (isVisualizing) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
    setIsMousePressed(true);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isMousePressed || isVisualizing) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setIsMousePressed(false);
  };

  const getNewGridWithWallToggled = (grid: Node[][], row: number, col: number): Node[][] => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    if (!node.isStart && !node.isFinish) {
      const newNode = {
        ...node,
        isWall: !node.isWall,
      };
      newGrid[row][col] = newNode;
    }
    return newGrid;
  };

  const clearGrid = useCallback(() => {
    if (isVisualizing) return;
    const newGrid = createInitialGrid();
    setGrid(newGrid);
    setMetrics({ pathLength: 0, nodesVisited: 0, executionTime: 0 });
  }, [isVisualizing]);

  const clearPath = useCallback(() => {
    if (isVisualizing) return;
    const newGrid = grid.map((row) =>
      row.map((node) => ({
        ...node,
        isVisited: false,
        isPath: false,
        isCurrent: false,
        distance: Infinity,
        previousNode: null,
        heuristic: 0,
        fScore: Infinity,
      }))
    );
    setGrid(newGrid);
    setMetrics({ pathLength: 0, nodesVisited: 0, executionTime: 0 });
  }, [grid, isVisualizing]);

  const animateAlgorithm = (visitedNodesInOrder: Node[], nodesInShortestPathOrder: Node[]) => {
    const startTime = performance.now();
    
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
          const endTime = performance.now();
          setMetrics((prev) => ({
            ...prev,
            nodesVisited: visitedNodesInOrder.length,
            executionTime: Math.round(endTime - startTime),
          }));
        }, (speed * i) / 2);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        setGrid((prevGrid) => {
          const newGrid = prevGrid.map((row) =>
            row.map((n) => {
              if (n.row === node.row && n.col === node.col) {
                return { ...n, isVisited: true, isCurrent: true };
              }
              if (n.isCurrent && !(n.row === node.row && n.col === node.col)) {
                return { ...n, isCurrent: false };
              }
              return n;
            })
          );
          return newGrid;
        });
      }, (speed * i) / 2);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder: Node[]) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        setGrid((prevGrid) => {
          const newGrid = prevGrid.map((row) =>
            row.map((n) => {
              if (n.row === node.row && n.col === node.col) {
                return { ...n, isPath: true, isCurrent: false };
              }
              return n;
            })
          );
          return newGrid;
        });
        
        if (i === nodesInShortestPathOrder.length - 1) {
          setIsVisualizing(false);
          setMetrics((prev) => ({
            ...prev,
            pathLength: nodesInShortestPathOrder.length,
          }));
        }
      }, 50 * i);
    }
  };

  const visualize = () => {
    if (isVisualizing) return;
    clearPath();
    setIsVisualizing(true);

    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

    let visitedNodesInOrder: Node[] = [];

    switch (selectedAlgorithm) {
      case "dijkstra":
        visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        break;
      case "astar":
        visitedNodesInOrder = aStar(grid, startNode, finishNode);
        break;
      case "bfs":
        visitedNodesInOrder = bfs(grid, startNode, finishNode);
        break;
      case "dfs":
        visitedNodesInOrder = dfs(grid, startNode, finishNode);
        break;
    }

    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  const loadDemoMaze = () => {
    if (isVisualizing) return;
    const newGrid = createInitialGrid();
    
    // Create a demo maze pattern
    for (let row = 5; row < 15; row++) {
      if (row !== 10) {
        newGrid[row][20].isWall = true;
        newGrid[row][30].isWall = true;
      }
    }
    
    for (let col = 15; col < 25; col++) {
      if (col !== 20) {
        newGrid[7][col].isWall = true;
        newGrid[13][col].isWall = true;
      }
    }
    
    setGrid(newGrid);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="flex-1 container mx-auto px-6 py-6 flex gap-6">
        <div className="flex-1 flex flex-col gap-6">
          <ControlPanel
            selectedAlgorithm={selectedAlgorithm}
            onAlgorithmChange={setSelectedAlgorithm}
            onVisualize={visualize}
            onClearGrid={clearGrid}
            onClearPath={clearPath}
            onLoadDemo={loadDemoMaze}
            isVisualizing={isVisualizing}
            speed={speed}
            onSpeedChange={setSpeed}
          />
          
          <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
            <Grid
              grid={grid}
              onMouseDown={handleMouseDown}
              onMouseEnter={handleMouseEnter}
              onMouseUp={handleMouseUp}
            />
          </div>

          <MetricsPanel metrics={metrics} />
        </div>

        <InfoPanel algorithm={selectedAlgorithm} />
      </div>
    </div>
  );
};
