import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import MapLeaflet from "./Map/Map";
import MapLayers from "./Map/MapLayers";
import { LayerMakers, layers, LayerType, PolyLine } from "./Map/layers";
import { fetchMarkers } from "./service/overpass";
import { fetchWays } from './service/bicycle_ways';

type poiNode = {
  lat: number,
  lon: number
}



export default function App() {
  const [activeMarkers, setActiveMarkers] = React.useState<LayerMakers[]>([]);
  const [activeWays, setActiveWays] = React.useState<PolyLine[]>([])
  const [activeRoutes, setActiveRoutes] = React.useState<(any|PolyLine)[]>([])
  const [mapBounds, setBounds] = React.useState(""); //???

  /**React.useEffect(() => {
    // TODO research POI ?
  }, [activeLayers, mapBounds])*/

  const innitLayer = () => {

  }

  // Toggle a layer on the map
  const toggleLayer = (key: any) => {
    const activeLayer = activeMarkers.find((layer) => layer.key === key);
    //TODO: wyłączone chwilowo bo cą dwie warstwy - drogi i markery 
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
      if (newLayer && newLayer.type === LayerType.MARKER) {
          return fetchMarkers(newLayer.query, mapBounds).then((elems) => {
            if (typeof elems !== "boolean") {
              //TODO: zmien filtry na poczatek tylko node a potem dodawaj tags amenity
              //TODO: tags higway itp - i sprawdz literowki
              const newMarkers: LayerMakers = {
                key,
                icon: newLayer.icon,
                markers: elems
                .filter((elem) => 
                  elem.tags?.amenity in [...key] ||
                  elem.tags?.amenity === key
                  )
                  .map((elem) => ({
                    lat: elem.lat,
                    lon: elem.lon,
                    name: elem.tags?.name
                  }))
                  // .filter((elem) => elem.lat && elem.lon)
                };
                // Add the markers
                setActiveMarkers([...activeMarkers, newMarkers]);
                return newMarkers.markers.length;
              }
            }
          );
      } else {
          return Promise.reject();
      }
    }
  };

  React.useEffect(() => {
    // const activeLayer = activeWays.find((layer) => layer.key === key);
    const activeLayer = layers.find((layer) => layer.key === 'bicycleways');
    fetchWays(setActiveWays, setActiveRoutes, activeLayer);
  },[])

  return (
    <div className="App">
      <h1>Leaflet CodeSandbox</h1>
      <MapLeaflet
        fullTitle="My marker"
        latitude={50.2713933}
        longitude={19.1598567}
        setBounds={(bounds: React.SetStateAction<string>) => setBounds(bounds)}
        activeMarkers={activeMarkers}
        activeWays={activeWays}
        activeRoutes={activeRoutes}
        />
      <MapLayers toggleLayer={toggleLayer} />
    </div>
  );
}
