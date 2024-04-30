import React from "react";
import "./Resource.scss";
import {
  Card,
  useDropdown
} from "@edifice-ui/react";

interface ResourceProps {
  image: string;
  title: string;
  ownerName: string;
}

export const Resource: React.FC<ResourceProps> = ({
  image,
  title,
  ownerName,
}) => {
  const { visible, setVisible, triggerProps } = useDropdown("bottom-start");
  
  const select = () => {
    console.log("Selected")
    console.log("Before : ", visible);
    setVisible(!visible);
    console.log("After : ", visible);
  }

  return (
    <Card className="med-resource-card" {...triggerProps} onSelect={() => select()}>
      <Card.Body space="8" flexDirection="column">
        <Card.Image
          imageSrc={image}
        />
        <div className="med-resource-body-text">
          <Card.Text className="med-resource-card-text">{title}</Card.Text>
          <Card.Text className="text-black-50 med-resource-card-text">{ownerName}</Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
};
