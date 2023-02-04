import React, { useRef, useState, useEffect } from "react";
import L, { LatLngExpression, LatLngTuple, LatLngBoundsExpression } from "leaflet";
import styled from "styled-components";
import { LayerMakers, PolyLine, PolyLineMap } from "./layers";
// import OverPassLayer from "leaflet-overpass-layer";

// @ts-ignore
// const opl = new L.OverPassLayer();

// Map container
const StyledMap = styled.div`
  width: 100%;
  height: 500px;
  z-index: 1;
`;

// Map attributions
const ATTR_OSM =
    'Map data &copy; <a href="http://openstreetmap.org/">OpenStreetMap</a> contributors',
  ATTR_OVERPASS =
    'POI via <a href="http://www.overpass-api.de/">Overpass API</a>';

// Map props
interface MapProps {
  latitude: number;
  longitude: number;
  fullTitle: string;
  activeMarkers: LayerMakers[];
  activeWays?: PolyLine[] | null;
  setBounds: (bounds: string) => void;
}

// Map component
const MapLeaflet: React.FC<MapProps> = ({
  latitude,
  longitude,
  fullTitle,
  activeMarkers,
  activeWays,
  setBounds
}) => {

  const [SVGOutline, setSVGOutline] = useState(null);

  const mapRef = useRef<L.Map>();
  const layerGroupRef = useRef<L.LayerGroup>();
  const layerWaysGroupRef = useRef<L.LayerGroup>();
  const layerShapeGroupRef = useRef<L.LayerGroup>();

  // Compute a string version of the map bounds for overpass API requests
  const updateBounds = () => {
    if (!mapRef.current) return;
    const mapBounds = mapRef.current.getBounds();
    const southWest = mapBounds.getSouthWest();
    const northEast = mapBounds.getNorthEast();
    setBounds(
      `(${southWest.lat},${southWest.lng},${northEast.lat},${northEast.lng})`
    );
  };

  // Initialize the map
  useEffect(() => {
    if (!mapRef.current) {
      const center: LatLngExpression = [latitude, longitude];
      // Create the map
      mapRef.current = L.map("leaflet-map", {
        center,
        zoom: 16,
        layers: [
          L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
            attribution: [ATTR_OSM, ATTR_OVERPASS].join(", ")
          })
        ],
        scrollWheelZoom: false
      });
      // Create layer group
      layerGroupRef.current = L.layerGroup().addTo(mapRef.current);
      layerWaysGroupRef.current = L.layerGroup().addTo(mapRef.current);
      layerShapeGroupRef.current = L.layerGroup().addTo(mapRef.current);
      // Create marker
      const localisation = L.marker(center);
      localisation.bindPopup(fullTitle);
      // localisation.addTo(mapRef.current);
      // Create radius around marker
      //L.circle(center, { radius: 500 }).addTo(mapRef.current);

      // Map bounds update listener
      mapRef.current.on("moveend", updateBounds);
      updateBounds();
    }
  },[]);

  // Dynamically add markers
  useEffect(() => {
    if (layerGroupRef.current) {
      layerGroupRef.current.clearLayers();

      activeMarkers.forEach((layer) => {
        const icon = new L.Icon({ iconUrl: layer.icon });
        layer.markers.forEach((marker) => {
          const pos: LatLngTuple = [marker.lat, marker.lon];
          const mapMarker = L.marker(pos, { icon });
          if (marker.name) {
            mapMarker.bindPopup(marker.name);
          }
          if (layerGroupRef.current) mapMarker.addTo(layerGroupRef.current);
        });
      });
    }
  }, [activeMarkers]);

  useEffect(() => {
    if (layerWaysGroupRef.current) {
      // layerGroupRef.current.clearLayers();
      const line4:LatLngExpression[] = [[50.2864856,19.1427196], [50.2884856, 19.1427196]];
      const mapLine1 = L.polyline(line4, {color: 'red'});
        if (layerWaysGroupRef.current) mapLine1.addTo(layerWaysGroupRef.current);

      const line3:LatLngExpression[] = [[50.2713933, 19.1798567], [50.2716743, 19.1599677]];
      const mapLine2 = L.polyline(line3, {color: 'red'});
        if (layerWaysGroupRef.current) mapLine2.addTo(layerWaysGroupRef.current);

      activeWays?.forEach((way) => {
        const line:LatLngExpression[] = way.nodes.map(node => [node?.lat, node?.lon]);
        const mapLine = L.polyline(line, {color: 'red'});
        if (layerWaysGroupRef.current) mapLine.addTo(layerWaysGroupRef.current);
      })

    }
    // const polyLine  = L.polyline(line, {color: 'red'}); //.addTo(map);
  }, [activeWays])


  const getData=(setResult:any)=>{
    fetch('sosnowiec.json'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){
        console.log(response)
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson);
        setResult(myJson)
      });
  }


  useEffect(() => {
    getData(setSVGOutline);

    if (layerGroupRef.current) {
      layerGroupRef.current.clearLayers();

      const line3:LatLngExpression[] = [[50.2713733, 19.1798567], [50.2716743, 19.1599677]];
      const mapLine = L.polyline(line3, {color: 'blue'});
        if (layerGroupRef.current) mapLine.addTo(layerGroupRef.current);

        var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
        svgElement.setAttribute('viewBox', "0 0 200 200");
        svgElement.innerHTML = '<rect width="200" height="200"/><rect x="75" y="23" width="50" height="50" style="fill:red"/><rect x="75" y="123" width="50" height="50" style="fill:#0013ff"/>';
        L.svgOverlay(svgElement, [[50.2713733, 19.1798567], [50.2716743, 19.1599677]]).addTo(layerGroupRef.current);

      }
  },[])

  var myStyle = {
    "color": "#EF9999",
    "weight": 2,
    "opacity": 0.7
};

  useEffect(() =>{
    if(SVGOutline && layerShapeGroupRef?.current) {
      console.log("SVGOutline", SVGOutline);
      const sosno = L.geoJSON(SVGOutline,{
        style: myStyle
      })
      if(sosno && mapRef.current) {
        sosno.addTo(mapRef.current);
        // .addTo(layerShapeGroupRef.current);
      }
    }

    if(layerShapeGroupRef?.current) {
      const geojsonFeature = {
        "type": "Feature" as const,
        "properties": {
            "name": "Coors Field",
            "amenity": "Baseball Stadium",
            "popupContent": "This is where the Rockies play!"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
              [50.2715723, 19.1599667], [50.2715743, 19.1599677]
            ]
        }
      };
//MultiPolygon //Polygon

      // const outline:L.GeoJSON<any> = L.geoJSON(geojsonFeature, {
      //   style: myStyle
      // })
      // if(outline && mapRef.current) {
      //   outline.addTo(mapRef.current);
      // }
    }
  },[SVGOutline])

  // Render the map
  return <StyledMap id="leaflet-map" />;
};

export default MapLeaflet;
