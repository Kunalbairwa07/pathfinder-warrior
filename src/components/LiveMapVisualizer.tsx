import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { toast } from "sonner";
import { Navigation, MapPin, Route } from "lucide-react";

// Fix Leaflet default icon issue with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface RouteMetrics {
  distance: number;
  duration: number;
  coordinates: number;
}

export const LiveMapVisualizer = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const endMarkerRef = useRef<L.Marker | null>(null);
  
  const [sourceAddress, setSourceAddress] = useState("");
  const [destAddress, setDestAddress] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [metrics, setMetrics] = useState<RouteMetrics | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map centered on a default location
    const map = L.map(mapContainerRef.current).setView([40.7128, -74.0060], 13);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const geocodeAddress = async (address: string): Promise<{ lat: number; lon: number } | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const getRoute = async (start: { lat: number; lon: number }, end: { lat: number; lon: number }) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`
      );
      const data = await response.json();
      
      if (data.code === "Ok" && data.routes && data.routes.length > 0) {
        return data.routes[0];
      }
      return null;
    } catch (error) {
      console.error("Routing error:", error);
      return null;
    }
  };

  const animateRoute = (coordinates: [number, number][]) => {
    if (!mapRef.current) return;

    let index = 0;
    const animatedCoords: [number, number][] = [];
    
    const animate = () => {
      if (index < coordinates.length) {
        animatedCoords.push(coordinates[index]);
        
        if (routeLayerRef.current) {
          routeLayerRef.current.setLatLngs(animatedCoords);
        } else {
          routeLayerRef.current = L.polyline(animatedCoords, {
            color: "hsl(var(--primary))",
            weight: 5,
            opacity: 0.8,
          }).addTo(mapRef.current!);
        }
        
        index++;
        setTimeout(animate, 10);
      } else {
        setIsCalculating(false);
      }
    };
    
    animate();
  };

  const handleVisualize = async () => {
    if (!sourceAddress.trim() || !destAddress.trim()) {
      toast.error("Please enter both source and destination addresses");
      return;
    }

    setIsCalculating(true);
    setMetrics(null);

    // Clear previous route and markers
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }
    if (startMarkerRef.current) {
      startMarkerRef.current.remove();
      startMarkerRef.current = null;
    }
    if (endMarkerRef.current) {
      endMarkerRef.current.remove();
      endMarkerRef.current = null;
    }

    toast.info("Geocoding addresses...");

    // Geocode addresses
    const startCoords = await geocodeAddress(sourceAddress);
    const endCoords = await geocodeAddress(destAddress);

    if (!startCoords || !endCoords) {
      toast.error("Could not find one or both addresses. Please try again.");
      setIsCalculating(false);
      return;
    }

    // Add markers
    const startIcon = L.icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const endIcon = L.icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    startMarkerRef.current = L.marker([startCoords.lat, startCoords.lon], { icon: startIcon })
      .addTo(mapRef.current!)
      .bindPopup(`<strong>Start:</strong> ${sourceAddress}`);

    endMarkerRef.current = L.marker([endCoords.lat, endCoords.lon], { icon: endIcon })
      .addTo(mapRef.current!)
      .bindPopup(`<strong>Destination:</strong> ${destAddress}`);

    toast.info("Calculating shortest path...");

    // Get route
    const route = await getRoute(startCoords, endCoords);

    if (!route) {
      toast.error("Could not calculate route. Please try different addresses.");
      setIsCalculating(false);
      return;
    }

    // Convert GeoJSON coordinates to Leaflet format [lat, lng]
    const coordinates: [number, number][] = route.geometry.coordinates.map(
      (coord: number[]) => [coord[1], coord[0]]
    );

    // Fit map to show entire route
    const bounds = L.latLngBounds(coordinates);
    mapRef.current?.fitBounds(bounds, { padding: [50, 50] });

    // Set metrics
    setMetrics({
      distance: parseFloat((route.distance / 1000).toFixed(2)),
      duration: Math.round(route.duration / 60),
      coordinates: coordinates.length,
    });

    toast.success("Route calculated! Animating path...");

    // Animate the route
    animateRoute(coordinates);
  };

  const loadDemoRoute = () => {
    setSourceAddress("Times Square, New York");
    setDestAddress("Central Park, New York");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="flex-1 container mx-auto px-6 py-6 flex flex-col gap-6">
        {/* Control Panel */}
        <Card className="p-6 border-border shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Navigation className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Live Map Navigation</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-500" />
                Source Address
              </label>
              <Input
                value={sourceAddress}
                onChange={(e) => setSourceAddress(e.target.value)}
                placeholder="e.g., Empire State Building, New York"
                className="w-full"
                disabled={isCalculating}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                Destination Address
              </label>
              <Input
                value={destAddress}
                onChange={(e) => setDestAddress(e.target.value)}
                placeholder="e.g., Statue of Liberty, New York"
                className="w-full"
                disabled={isCalculating}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleVisualize}
              disabled={isCalculating}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <Route className="w-4 h-4 mr-2" />
              {isCalculating ? "Calculating..." : "LIVE Visualize"}
            </Button>
            <Button
              onClick={loadDemoRoute}
              variant="outline"
              disabled={isCalculating}
            >
              Load Demo
            </Button>
          </div>
        </Card>

        {/* Metrics Panel */}
        {metrics && (
          <Card className="p-6 border-border shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Route Metrics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{metrics.distance.toFixed(2)} km</div>
                <div className="text-sm text-muted-foreground">Distance</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{metrics.duration} min</div>
                <div className="text-sm text-muted-foreground">Est. Duration</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{metrics.coordinates}</div>
                <div className="text-sm text-muted-foreground">Route Points</div>
              </div>
            </div>
          </Card>
        )}

        {/* Map Container */}
        <Card className="flex-1 p-6 border-border shadow-lg min-h-[500px]">
          <div
            ref={mapContainerRef}
            className="w-full h-full rounded-lg overflow-hidden"
            style={{ minHeight: "500px" }}
          />
        </Card>

        {/* Info Panel */}
        <Card className="p-6 border-border shadow-lg">
          <h3 className="text-lg font-semibold mb-3">About Live Map</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            This Live Map Visualizer uses real-world map data from OpenStreetMap and OSRM routing engine
            to find the shortest driving path between two addresses. Enter any valid address or landmark,
            and watch as the algorithm calculates and animates the optimal route in real-time.
          </p>
        </Card>
      </div>
    </div>
  );
};
