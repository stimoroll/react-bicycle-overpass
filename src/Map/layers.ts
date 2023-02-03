import school from "./Icons/school.png";
import bus from "./Icons/bus.png";
import primary from "./Icons/primary.png";
import restaurant from "./Icons/restaurant.png";

//area
//area[name="Sosnowiec"]->.sosnowiec;

// Layer Mapping type
type LayerMapping = {
  key: string;
  label: string;
  query: string;
  icon: string;
};

// Mapping Layers <=> Overpass queries
export const layers: LayerMapping[] = [
  {
    key: "bicycleways",
    label: "Bicycleways",
    icon: school,
    query: `
      way[AREA][highway=cycleway];
      `
      // relation[AREA][route=bicycle];
      // way[AREA][highway=path][bicycle=designated];


      // way[highway=cycleway][BOX];
      // way(area.sosnowiec)[highway=path][bicycle=designated][BOX];
      // node["amenity"="college"][BOX];
  },
  {
    key: "college",
    label: "Colleges",
    icon: school,
    query: `
      node["amenity"="college"][BOX];
    `
  },
  {
    key: "school",
    label: "Schools",
    icon: primary,
    query: `
      node["amenity"="school"][BOX];
    `
  },
  {
    key: "bus",
    label: "Bus stops",
    icon: bus,
    query: `
      node["highway"="bus_stop"][BOX];
    `
  },
  {
    key: "restaurant",
    label: "Restaurants",
    icon: restaurant,
    query: `
      node["amenity"="restaurant"][BOX];
    `
  }
];

// Collection of markers found for a layer
export type LayerMakers = {
  key: string;
  icon: string;
  markers: {
    lat: number;
    lon: number;
    name?: string;
  }[];
};



export type PolyLine = {
  key: string | undefined;
  icon: string | undefined;
  nodes: {
    lat: number;
    lon: number;
  }[];
}
