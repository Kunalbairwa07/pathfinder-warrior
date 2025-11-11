import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Play, RotateCcw, Eraser, Map } from "lucide-react";
import { AlgorithmType } from "./PathfindingVisualizer";

interface ControlPanelProps {
  selectedAlgorithm: AlgorithmType;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
  onVisualize: () => void;
  onClearGrid: () => void;
  onClearPath: () => void;
  onLoadDemo: () => void;
  isVisualizing: boolean;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const ControlPanel = ({
  selectedAlgorithm,
  onAlgorithmChange,
  onVisualize,
  onClearGrid,
  onClearPath,
  onLoadDemo,
  isVisualizing,
  speed,
  onSpeedChange,
}: ControlPanelProps) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium mb-2 block text-muted-foreground">
            Select Algorithm
          </label>
          <Select value={selectedAlgorithm} onValueChange={(value) => onAlgorithmChange(value as AlgorithmType)}>
            <SelectTrigger className="w-full bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
              <SelectItem value="dijkstra">Dijkstra's Algorithm</SelectItem>
              <SelectItem value="astar">A* (A-star) Algorithm</SelectItem>
              <SelectItem value="bfs">Breadth-First Search (BFS)</SelectItem>
              <SelectItem value="dfs">Depth-First Search (DFS)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium mb-2 block text-muted-foreground">
            Animation Speed: {speed}ms
          </label>
          <Slider
            value={[speed]}
            onValueChange={(value) => onSpeedChange(value[0])}
            min={1}
            max={50}
            step={1}
            className="w-full"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={onVisualize}
            disabled={isVisualizing}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
          >
            <Play className="w-4 h-4 mr-2" />
            Visualize
          </Button>
          
          <Button
            onClick={onClearPath}
            disabled={isVisualizing}
            variant="outline"
            className="border-border hover:bg-secondary"
          >
            <Eraser className="w-4 h-4 mr-2" />
            Clear Path
          </Button>
          
          <Button
            onClick={onClearGrid}
            disabled={isVisualizing}
            variant="outline"
            className="border-border hover:bg-secondary"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Grid
          </Button>
          
          <Button
            onClick={onLoadDemo}
            disabled={isVisualizing}
            variant="outline"
            className="border-border hover:bg-secondary"
          >
            <Map className="w-4 h-4 mr-2" />
            Load Demo
          </Button>
        </div>
      </div>

      <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-node-start rounded"></div>
          <span>Start Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-node-end rounded"></div>
          <span>End Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-node-wall rounded"></div>
          <span>Wall (Click & Drag)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-node-visited rounded"></div>
          <span>Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-node-path rounded"></div>
          <span>Shortest Path</span>
        </div>
      </div>
    </div>
  );
};
