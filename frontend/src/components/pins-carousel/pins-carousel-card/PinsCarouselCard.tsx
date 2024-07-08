import { Card } from "@edifice-ui/react";
import React from "react";

import { PinResource } from "~/model/PinResource.model";
import "./PinsCarouselCard.scss";

interface PinsCarouselCardProps {
  pin: PinResource;
}

export const PinsCarouselCard: React.FC<PinsCarouselCardProps> = ({ pin }) => {
  return (
  <Card
    isClickable={false}
    isSelectable={false}
    className="med-pin-card"
  >
    <Card.Title>{pin.pinned_title}</Card.Title>
    <Card.Text>{pin.pinned_description}</Card.Text>
    <Card.Body space={"0"}>
      <img src={pin.image} alt={pin.pinned_title} className="med-pin-image" />
    </Card.Body>
  </Card>
  );
};
