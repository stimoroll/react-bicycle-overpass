import React, { useRef, useState, useEffect } from "react";
import L, { LatLngExpression, LatLngTuple, LatLngBoundsExpression } from "leaflet";
import styled from "styled-components";
import { LayerMakers, PolyLine, PolyLineMap } from "./layers";
import axios from "axios";
// import OverPassLayer from "leaflet-overpass-layer";

// @ts-ignore
// const opl = new L.OverPassLayer();

type pointNextBike = {
  name: string,
  lat: any,
  lng: any,
}

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
  const [poi, setPoi] = useState(null);
  const [poiNextBike, setPoiNextBike] = useState(null);

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
      /* FOR TEST ONLY SECTION
      const line4:LatLngExpression[] = [[50.2864856,19.1427196], [50.2884856, 19.1427196]];
      const mapLine1 = L.polyline(line4, {color: 'red'});
        if (layerWaysGroupRef.current) mapLine1.addTo(layerWaysGroupRef.current);

      const line3:LatLngExpression[] = [[50.2713933, 19.1798567], [50.2716743, 19.1599677]];
      const mapLine2 = L.polyline(line3, {color: 'red'});
        if (layerWaysGroupRef.current) mapLine2.addTo(layerWaysGroupRef.current); */

      activeWays?.forEach((way) => {
        const line:LatLngExpression[] = way.nodes.map(node => [node?.lat, node?.lon]);
        const mapLine = L.polyline(line, {color: 'red'});
        if (layerWaysGroupRef.current) mapLine.addTo(layerWaysGroupRef.current);
      })
    }
  }, [activeWays])

  // $.getJSON("/data/json/parkingi.json", function(response) {
  //   console.log("parkingi", response.results);
  //   setPoi(response.results);
  // }).catch(function(error) {});

  // $.getJSON("/data/json/stacje.json", function(response) {
  //   console.log("stacje", response.results);
  // }).catch(function(error) {});

  const getData = (jsonFileName: string, setResult:any) => {
    fetch(jsonFileName
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

  const getParkingiPOI = () => getData('parkingi.json', setPoi);
  const getStacjePOI = () => getData('stacje.json', setPoi);
  const getSosnowiecBoundary = () => getData('sosnowiec.json', setSVGOutline);  


  //TODO: do włączenia około 1 kwietnia = teraz jest nieaktuwne i nie zwraca danych
  const getNextBike = () => {
    const nextbike_api_url = 'https://api.nextbike.net/maps/nextbike-live.json?city=497';
    axios.get(nextbike_api_url).then(function(response) {
      // console.log('NEXTBIKE', response.data);
      // console.log('NEXTBIKE', response.data.countries[0].cities[0].places);
      const st = response.data.countries[0].cities[0].places;
      setPoiNextBike(st.map((pointNB:any) => {
        // console.log(point);
        return { 
          name: pointNB?.name,
          location: [pointNB?.lat, pointNB?.lng] }
      }))

        st.forEach((pointNB:any) => {
          const pos: LatLngTuple = [pointNB?.lat, pointNB?.lng];
          // const mapMarker = L.marker(pos, { icon });
          const mapMarker = L.marker(pos);
          if (pointNB.name) {
            mapMarker.bindPopup(pointNB.name);
          }
          if (layerGroupRef.current) mapMarker.addTo(layerGroupRef.current);
        });
    }).catch(function(error) {});
  }


  useEffect(() => {
    getSosnowiecBoundary();
    // getNextBike() //TODO: 
    getParkingiPOI()
    getStacjePOI()

  var myStyle = {
    "color": "#EF9999",
    "weight": 2,
    "opacity": 0.2
};

  useEffect(() =>{
    if(SVGOutline && layerShapeGroupRef?.current) {
      layerShapeGroupRef.current.clearLayers();
      console.log("SVGOutline", SVGOutline);
      const sosno = L.geoJSON(SVGOutline,{
        style: myStyle
      })
      if(sosno && mapRef.current) {
        sosno.addTo(mapRef.current);
        // .addTo(layerShapeGroupRef.current);
      }
    }

  },[SVGOutline])

  // Render the map
  return <StyledMap id="leaflet-map" />;
};

export default MapLeaflet;
