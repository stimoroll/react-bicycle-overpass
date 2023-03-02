import React from "react";

import { layers } from "./layers";
import LayerBtn from "./LayerBtn";
import styled from "styled-components";

const Column = styled.div`
  
`;

// Renders checkboxes to toggle layers
type MapLayersProps = {
  toggleLayer: (key: any) => Promise<void | any>;
};

const MapLayers: React.FC<MapLayersProps> = ({ toggleLayer }) => {
  return (
    <div className="mt-3 px-3">
      {/* <p>
        Click on a Point of Interest to reveal corresponding locations in the
        visible area. Click again to hide them.
      </p> */}
      <div className="d-flex flex-column justify-content-center">
        {layers.map((layer, idx) => (
          <LayerBtn
            key={idx}
            layerKey={layer.key}
            onToggle={toggleLayer}
            icon={layer.icon}
            label={layer.label}
          />
        ))}
      </div>
    </div>
  );
};

export default MapLayers;
