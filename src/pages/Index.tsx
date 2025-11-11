import { useState } from "react";
import { PathfindingVisualizer } from "@/components/PathfindingVisualizer";
import { LiveMapVisualizer } from "@/components/LiveMapVisualizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3x3, Map } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("classic");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border bg-card shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Team Warrior – Shortest Path Visualizer
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Interactive Algorithm Visualization Tool
          </p>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b border-border bg-card/50">
          <div className="container mx-auto px-6">
            <TabsList className="h-14 bg-transparent">
              <TabsTrigger 
                value="classic" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
              >
                <Grid3x3 className="w-4 h-4" />
                Classic Grid Visualizer
              </TabsTrigger>
              <TabsTrigger 
                value="live" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
              >
                <Map className="w-4 h-4" />
                Live Map Visualizer
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="classic" className="flex-1 m-0">
          <PathfindingVisualizer />
        </TabsContent>

        <TabsContent value="live" className="flex-1 m-0">
          <LiveMapVisualizer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
