import { Card } from "./ui/card";
import { Clock, GitBranch, Route } from "lucide-react";

interface MetricsPanelProps {
  metrics: {
    pathLength: number;
    nodesVisited: number;
    executionTime: number;
  };
}

export const MetricsPanel = ({ metrics }: MetricsPanelProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="bg-card border-border p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Route className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Path Length</p>
            <p className="text-2xl font-bold text-foreground">{metrics.pathLength}</p>
          </div>
        </div>
      </Card>

      <Card className="bg-card border-border p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-node-visited/20 rounded-lg">
            <GitBranch className="w-5 h-5 text-node-visited" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Nodes Visited</p>
            <p className="text-2xl font-bold text-foreground">{metrics.nodesVisited}</p>
          </div>
        </div>
      </Card>

      <Card className="bg-card border-border p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Clock className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Execution Time</p>
            <p className="text-2xl font-bold text-foreground">{metrics.executionTime}ms</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
