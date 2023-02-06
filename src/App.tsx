import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import MapLeaflet from "./Map/Map";
import MapLayers from "./Map/MapLayers";
import { LayerMakers, layers, PolyLine } from "./Map/layers";
import { fetchMarkers } from "./service/overpass";

type poiNode = {
  lat: number,
  lon: number
}

type wayNode = {
  id: number,
  type: string,
  nodes: number[]
  tags: Object
}

export default function App() {
  const [activeMarkers, setActiveMarkers] = React.useState<LayerMakers[]>([]);
  const [activeWays, setActiveWays] = React.useState<PolyLine[]>([])
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

            // let myMap:Map<string, any> = new Map();
            const nodes = new Map<string, any>();
            const ways = new Map<string, any>();



            //TODO: zdefiniuj typ 
            const nodesArray:Array<any> = elems.filter(el => el?.type === "node").map((el:any) => {
              if(el?.type === "node") {
                return [el?.id, { lat: el?.lat, lon: el?.lon }]
              }
            });

            const waysArray:Array<any|wayNode> = elems.filter(el => el?.type === "way")

            let map1 = new Map(nodesArray);
            let map2 = new Map(waysArray);


            const newLines:PolyLine[] = waysArray.map(way => {
              way.nodes = way?.nodes.map((point: any) => {
                const poi = map1.get(point)
                return poi
              })
              return way
            });

            setActiveWays([...newLines]);


            //TODO: zmien filtry na poczatek tylko node a potem dodawaj tags amenity 
            //TODO: tags higway itp - i sprawdz literowki
            const newMarkers: LayerMakers = {
              key,
              icon: newLayer.icon,
              markers: elems
                .filter((elem) => elem.type === "node" && (
                  elem.tags?.amenity in ['school', 'restaurant'] ||
                  elem.tags?.higway === 'bus_stop'
                ))
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
      <MapLeaflet
        fullTitle="My marker"
        latitude={50.2713933}
        longitude={19.1598567}
        setBounds={(bounds) => setBounds(bounds)}
        activeMarkers={activeMarkers}
        activeWays={activeWays}
        />
      <MapLayers toggleLayer={toggleLayer} />
    </div>
  );
}
