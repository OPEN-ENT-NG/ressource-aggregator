import React from "react";

import { Button, FormControl, Input, Label, Modal } from "@edifice-ui/react";
import { useTranslation } from "react-i18next";

import { ExternalResource } from "~/model/ExternalResource.model";
import { Moodle } from "~/model/Moodle.model";
import { Signet } from "~/model/Signet.model";
import { Textbook } from "~/model/Textbook.model";
import "../Modal.scss";

interface CreatePinsProps {
  resource: Signet | Textbook | ExternalResource | Moodle | null;
  isOpen: boolean;
  setIsOpen: (arg: boolean) => void;
}

export const CreatePins: React.FC<CreatePinsProps> = ({
  resource,
  isOpen,
  setIsOpen,
}) => {
  const { t } = useTranslation();
  const handleCloseModal = () => {
    setIsOpen(false);
  };
  return (
    <Modal onModalClose={handleCloseModal} isOpen={isOpen} id="create-pins">
      <Modal.Header onModalClose={handleCloseModal}>
        <h2>{t("mediacentre.pins.modal.create.title")}</h2>
      </Modal.Header>
      <Modal.Subtitle>
        <p>{t("mediacentre.pins.modal.subtitle")}</p>
      </Modal.Subtitle>
      <Modal.Body>
        <div className="med-modal-container">
          <div className="med-modal-image">
            <img
              src={resource?.image}
              alt="Resource"
              className="med-image"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = "/mediacentre/public/img/no-avatar.svg";
              }}
            />
          </div>
          <div className="med-modal-content">
            <FormControl id="create-pin-title">
              <Label>
                {t("mediacentre.advanced.name.title")}{" "}
                <span className="med-red">*</span>
              </Label>
              <Input placeholder="Votre titre" size="md" type="text" />
            </FormControl>
            <FormControl id="create-pin-description">
              <Label>
                {t("mediacentre.description.title.description")}{" "}
                <span className="med-optional">
                  - {t("mediacentre.pins.modal.optional")}
                </span>
              </Label>
              <Input placeholder="Votre titre" size="md" type="text" />
            </FormControl>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="tertiary">{t("mediacentre.cancel")}</Button>
        <Button color="primary" type="submit">
          {t("mediacentre.pin")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
