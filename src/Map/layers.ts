import school from "./Icons/school.png";
import bus from "./Icons/bus.png";
import primary from "./Icons/primary.png";
import restaurant from "./Icons/restaurant.png";
import { LatLngTuple } from "leaflet";

//area
//area[name="Sosnowiec"]->.sosnowiec;

export enum LayerType {
  MARKER = 'marker',
  WAY = 'way'
}



// Layer Mapping type
export type LayerMapping = {
  key: string;
  label: string;
  query: string;
  icon: string;
  type: LayerType; //string | undefined;
};

// Mapping Layers <=> Overpass queries
export const layers: LayerMapping[] = [
  {
    key: "bicycle_parking",
    label: "Parkingi rowerowe",
    icon: school,
    type: LayerType.MARKER,
    query: `
      relation[AREA][amenity="bicycle_parking"];
      node[AREA][amenity="bicycle_parking"];
      way[AREA][amenity="bicycle_parking"];
      `
  },
  {
    key: "compressed_air",
    label: "compressed_air",
    icon: school,
    type: LayerType.MARKER,
    query: `
      relation[AREA][amenity="compressed_air"];
      node[AREA][amenity="compressed_air"];
      way[AREA][amenity="compressed_air"];
      `
  },
  {
    key: "bicycle_rental",
    label: "Stacje rowerowe",
    icon: school,
    type: LayerType.MARKER,
    query: `
      relation[AREA][amenity="bicycle_rental"]["brand:wikidata" = "Q55754308"];
      node[AREA][amenity="bicycle_rental"]["brand:wikidata" = "Q55754308"];
      way[AREA][amenity="bicycle_rental"]["brand:wikidata" = "Q55754308"];
      `
  },
  {
    key: "bicycleways",
    label: "Bicycleways",
    icon: school,
    type: LayerType.WAY,
    query: `
      way[AREA][highway=cycleway];
      relation[AREA][route=bicycle];
      way[AREA][highway=path][bicycle=designated];
      `


      // way[highway=cycleway][BOX];
      // way(area.sosnowiec)[highway=path][bicycle=designated][BOX];
      // node["amenity"="college"][BOX];
  },
  // {
  //   key: "college",
  //   label: "Colleges",
  //   icon: school,
  //   query: `
  //     node["amenity"="college"][BOX];
  //   `
  // },
  // {
  //   key: "school",
  //   label: "Schools",
  //   icon: primary,
  //   query: `
  //     node["amenity"="school"][BOX];
  //   `
  // },
  // {
  //   key: "bus",
  //   label: "Bus stops",
  //   icon: bus,
  //   query: `
  //     node["highway"="bus_stop"][BOX];
  //   `
  // },
  // {
  //   key: "restaurant",
  //   label: "Restaurants",
  //   icon: restaurant,
  //   query: `
  //     node["amenity"="restaurant"][BOX];
  //   `
  // }
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
  tags: any | undefined | null;
  nodes: {
    lat: number;
    lon: number;
  }[];
}


export type PolyLineMap = {
  key: string | undefined;
  icon: string | undefined;
  nodes: LatLngTuple[];
}

// „LatLngExpression[] | LatLngExpression[][]”.
//   Typu „number[][]” nie można przypisać do typu „LatLngExpression[]”.
//     Typu „number[]” nie można przypisać do typu „LatLngExpression”.
//       Typu „number[]” nie można przypisać do typu „LatLngTuple”