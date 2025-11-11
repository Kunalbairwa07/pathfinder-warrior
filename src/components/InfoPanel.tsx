import { Card } from "./ui/card";
import { AlgorithmType } from "./PathfindingVisualizer";
import { BookOpen } from "lucide-react";

interface InfoPanelProps {
  algorithm: AlgorithmType;
}

const algorithmInfo = {
  dijkstra: {
    name: "Dijkstra's Algorithm",
    description:
      "Dijkstra's algorithm is a weighted algorithm that guarantees the shortest path. It explores nodes in order of their distance from the start node.",
    timeComplexity: "O((V + E) log V)",
    spaceComplexity: "O(V)",
    guaranteesPath: true,
    weighted: true,
  },
  astar: {
    name: "A* (A-star) Algorithm",
    description:
      "A* is a weighted algorithm that uses heuristics to guide its search. It's typically faster than Dijkstra's by prioritizing nodes that appear to lead toward the goal.",
    timeComplexity: "O(E)",
    spaceComplexity: "O(V)",
    guaranteesPath: true,
    weighted: true,
  },
  bfs: {
    name: "Breadth-First Search (BFS)",
    description:
      "BFS is an unweighted algorithm that explores nodes level by level. It guarantees the shortest path in unweighted graphs.",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    guaranteesPath: true,
    weighted: false,
  },
  dfs: {
    name: "Depth-First Search (DFS)",
    description:
      "DFS is an unweighted algorithm that explores as far as possible along each branch before backtracking. It does not guarantee the shortest path.",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    guaranteesPath: false,
    weighted: false,
  },
};

export const InfoPanel = ({ algorithm }: InfoPanelProps) => {
  const info = algorithmInfo[algorithm];

  return (
    <Card className="w-80 bg-card border-border p-6 shadow-lg h-fit sticky top-6">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Algorithm Info</h3>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-primary mb-2">{info.name}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{info.description}</p>
        </div>

        <div className="space-y-2 pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Time Complexity:</span>
            <span className="font-mono text-foreground">{info.timeComplexity}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Space Complexity:</span>
            <span className="font-mono text-foreground">{info.spaceComplexity}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Guarantees Shortest:</span>
            <span className={info.guaranteesPath ? "text-node-start" : "text-destructive"}>
              {info.guaranteesPath ? "Yes" : "No"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Weighted:</span>
            <span className="text-foreground">{info.weighted ? "Yes" : "No"}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h5 className="text-sm font-medium text-foreground mb-2">How to use:</h5>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Click and drag to create walls</li>
            <li>Select your algorithm</li>
            <li>Click "Visualize" to see it in action</li>
            <li>Adjust speed for better observation</li>
          </ol>
        </div>
      </div>
    </Card>
  );
};
