import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import Map from "./Map/Map";
import MapLayers from "./Map/MapLayers";
import { LayerMakers, layers } from "./Map/layers";
import { fetchMarkers } from "./service/overpass";

export default function App() {
  const [activeMarkers, setActiveMarkers] = React.useState<LayerMakers[]>([]);
  const [mapBounds, setBounds] = React.useState(""); //???

  /**React.useEffect(() => {
    // TODO research POI ?
  }, [activeLayers, mapBounds])*/

  // Toggle a layer on the map
  const toggleLayer = (key: any) => {
    const activeLayer = activeMarkers.find((layer) => layer.key === key);
    if (activeLayer) {
      // Layer was found: remove its markers
      setActiveMarkers(
        activeMarkers.filter((layerMarkers) => layerMarkers.key !== key)
      );
      // Remove layer from the active layers
      return Promise.resolve();
    } else {
      // Layer not active yet
      const newLayer = layers.find((layer) => layer.key === key);
      if (newLayer) {
        // It layer was found, fetch its markers
        return fetchMarkers(newLayer.query, mapBounds).then((elems) => {
          if (typeof elems !== "boolean") {

            const newMarkers: LayerMakers = {
              key,
              icon: newLayer.icon,
              markers: elems
                .filter((elem) => elem.lat && elem.lon)
                .map((elem) => ({
                  lat: elem.lat,
                  lon: elem.lon,
                  name: elem.tags?.name
                }))
            };
            // Add the markers
            setActiveMarkers([...activeMarkers, newMarkers]);
            return newMarkers.markers.length;
          }
        });
      } else {
        return Promise.reject();
      }
    }
  };

  return (
    <div className="App">
      <h1>Leaflet CodeSandbox</h1>
      <Map
        fullTitle="My marker"
        latitude={50.2713933}
        longitude={19.1598567}
        setBounds={(bounds) => setBounds(bounds)}
        activeMarkers={activeMarkers}
        />
      <MapLayers toggleLayer={toggleLayer} />
    </div>
  // latitude={48.855123611569105}
  // longitude={2.3859649980443733}
  );
}
