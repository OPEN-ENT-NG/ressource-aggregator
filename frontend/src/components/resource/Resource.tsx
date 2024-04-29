import React, { RefAttributes } from "react";
import "./Resource.scss";
import {
  Card,
  CardProps,
  Dropdown,
} from "@edifice-ui/react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  return (
    <>
      <Dropdown block>
        {(
          triggerProps: JSX.IntrinsicAttributes &
            Omit<CardProps, "ref"> &
            RefAttributes<HTMLDivElement>,
        ) => (
          <>
            <Card className="med-resource-card" {...triggerProps}>
              <Card.Body space="8" flexDirection="column">
                <Card.Image imageSrc={image} />
                <div className="med-resource-body-text">
                  <Card.Text className="med-resource-card-text">
                    {title}
                  </Card.Text>
                  <Card.Text className="text-black-50 med-resource-card-text">
                    {ownerName}
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>

            <Dropdown.Menu>
              <Dropdown.Item>{t("mediacentre.card.open")}</Dropdown.Item>
              <Dropdown.Separator />
              <Dropdown.Item>{t("mediacentre.card.favorite")}</Dropdown.Item>
              <Dropdown.Item>{t("mediacentre.card.pin")}</Dropdown.Item>
              <Dropdown.Item>{t("mediacentre.card.copy")}</Dropdown.Item>
            </Dropdown.Menu>
          </>
        )}
      </Dropdown>
    </>
  );
};
