import React from "react";

import { Button, FormControl, Input, Label, Modal } from "@edifice-ui/react";
import { useTranslation } from "react-i18next";

import { ExternalResource } from "~/model/ExternalResource.model";
import { Moodle } from "~/model/Moodle.model";
import { Signet } from "~/model/Signet.model";
import { Textbook } from "~/model/Textbook.model";
import "../Modal.scss";

interface EditPinsProps {
  resource: Signet | Textbook | ExternalResource | Moodle | null;
  isOpen: boolean;
  setIsOpen: (arg: boolean) => void;
}

export const EditPins: React.FC<EditPinsProps> = ({
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
        {t("mediacentre.pins.modal.edit.title")}
      </Modal.Header>
      <Modal.Subtitle>{t("mediacentre.pins.modal.subtitle")}</Modal.Subtitle>
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
        <Button color="danger" className="med-delete-pin">
          {t("mediacentre.pins.modal.remove.pin")}
        </Button>
        <Button color="tertiary">{t("mediacentre.cancel")}</Button>
        <Button color="primary" type="submit">
          {t("mediacentre.save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
