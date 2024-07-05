import React from "react";

import { PinResource } from "~/model/PinResource.model";

interface PinsCarouselCardProps {
  pin: PinResource;
}

export const PinsCarouselCard: React.FC<PinsCarouselCardProps> = ({ pin }) => {
  return (
    <div
      style={{
        backgroundColor: "lightgrey",
        height: "100%",
        backgroundImage: pin?.image,
      }}
    />
  );
};
