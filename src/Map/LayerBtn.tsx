import React, { useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import Badge from "react-bootstrap/Badge";
import styled from "styled-components";

// Button to toggle the layer on the map
const StyledLayerBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0e47c1;
  padding: 5px 20px;
  border: none;
  color: white;
  line-height: "40px";
  border-radius: 5px;
  margin-right: 10px;
`;

type LayerBtnProps = {
  onToggle: (key: string) => Promise<void>;
  layerKey: string;
  icon?: string;
  label: string;
};

const LayerBtn: React.FC<LayerBtnProps> = ({
  onToggle,
  layerKey,
  icon,
  label
}) => {
  const [isLoading, setLoading] = useState(false);
  const [nbResults, setNbResults] = useState<number | null>(null);

  const handleClick = () => {
    setLoading(true);
    onToggle(layerKey)
      .then((nbMarkers) => {
        if (typeof nbMarkers === "number") {
          setNbResults(Number(nbMarkers));
        } else {
          setNbResults(null);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <StyledLayerBtn onClick={handleClick}>
      {isLoading && (
        <Spinner role="status" animation="border" size="sm" className="mr-2" />
      )}
      {icon && <img src={icon} alt={label} className="mr-2" />}
      <span className="mr-2">{label}</span>
      {nbResults !== null && (
        // <Badge pill> variant="danger">
        <Badge pill>
          {nbResults}
        </Badge>
      )}
    </StyledLayerBtn>
  );
};

export default LayerBtn;
