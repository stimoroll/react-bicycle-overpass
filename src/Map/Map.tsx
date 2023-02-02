import React, { useRef, useEffect } from "react";
import L, { LatLngExpression } from "leaflet";
import styled from "styled-components";
import { LayerMakers } from "./layers";

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
  setBounds: (bounds: string) => void;
}

// Map component
const Map: React.FC<MapProps> = ({
  latitude,
  longitude,
  fullTitle,
  activeMarkers,
  setBounds
}) => {
  const mapRef = useRef<L.Map>();
  const layerGroupRef = useRef<L.LayerGroup>();

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
      // Create marker
      const localisation = L.marker(center);
      localisation.bindPopup(fullTitle);
      localisation.addTo(mapRef.current);
      // Create radius around marker
      //L.circle(center, { radius: 500 }).addTo(mapRef.current);

      // Map bounds update listener
      mapRef.current.on("moveend", updateBounds);
      updateBounds();
    }
  });

  // Dynamically add markers
  useEffect(() => {
    if (layerGroupRef.current) {
      layerGroupRef.current.clearLayers();

      activeMarkers.forEach((layer) => {
        const icon = new L.Icon({ iconUrl: layer.icon });
        layer.markers.forEach((marker) => {
          const pos: LatLngExpression = [marker.lat, marker.lon];
          const mapMarker = L.marker(pos, { icon });
          if (marker.name) {
            mapMarker.bindPopup(marker.name);
          }
          if (layerGroupRef.current) mapMarker.addTo(layerGroupRef.current);
        });
      });
    }
  }, [activeMarkers]);

  // Render the map
  return <StyledMap id="leaflet-map" />;
};

export default Map;
