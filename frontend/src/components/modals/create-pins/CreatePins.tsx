import React, { useEffect, useState } from "react";

import {
  AlertTypes,
  Button,
  FormControl,
  Input,
  Label,
  Modal,
} from "@edifice.io/react";
import { useTranslation } from "react-i18next";

import { links } from "~/core/const/links.const";
import { ModalEnum } from "~/core/enum/modal.enum";
import { useAlertProvider } from "~/providers/AlertProvider";
import { useModalProvider } from "~/providers/ModalsProvider";
import { usePinProvider } from "~/providers/PinProvider";
import { useSelectedStructureProvider } from "~/providers/SelectedStructureProvider";
import { useCreatePinMutation } from "~/services/api/pin.service";
import "../Modal.scss";

interface CreatePinsProps {
  refetch: () => void;
}

export const CreatePins: React.FC<CreatePinsProps> = ({ refetch }) => {
  const { t } = useTranslation("mediacentre");
  const { idSelectedStructure } = useSelectedStructureProvider();
  const { modalResource, openModal, closeAllModals } = useModalProvider();
  const { setAlertText, setAlertType } = useAlertProvider();
  const { setIsRefetchPins } = usePinProvider();
  const [createPin] = useCreatePinMutation();
  const [title, setTitle] = useState<string>(modalResource?.title ?? "");
  const [description, setDescription] = useState<string>(
    (modalResource as any)?.description ?? "",
  );

  const handleCloseModal = () => {
    closeAllModals();
  };

  const resetFields = () => {
    setTitle("");
    setDescription("");
  };

  const notify = (message: string, type: AlertTypes) => {
    setAlertText(message);
    setAlertType(type);
  };

  const onSubmit = async () => {
    try {
      const payload = {
        pinned_title: title,
        pinned_description: description,
        id: modalResource?.id ? String(modalResource.id) : undefined,
        source: modalResource?.source,
        is_textbook: modalResource?.is_textbook,
      };
      const response = await createPin({
        idStructure: idSelectedStructure,
        payload,
      });

      if (response?.error) {
        notify(t("mediacentre.error.pin"), "danger");
        return;
      }
      notify(t("mediacentre.notification.pin.wait"), "success");
      setIsRefetchPins(true);
      refetch();
      handleCloseModal();
      resetFields();
    } catch (error) {
      notify(t("mediacentre.error.pin"), "danger");
      console.error(error);
    }
  };

  useEffect(() => {
    setTitle(modalResource?.title ?? "");
    setDescription((modalResource as any)?.description ?? "");
  }, [modalResource]);

  if (!modalResource || openModal !== ModalEnum.CREATE_PIN) {
    return null;
  }

  return (
    <Modal onModalClose={handleCloseModal} isOpen={true} id="create-pins">
      <Modal.Header onModalClose={handleCloseModal}>
        {t("mediacentre.pins.modal.create.title")}
      </Modal.Header>
      <Modal.Subtitle>{t("mediacentre.pins.modal.subtitle")}</Modal.Subtitle>
      <Modal.Body>
        <div className="med-modal-container">
          <div className="med-modal-image">
            <img
              src={modalResource?.image}
              alt="Resource"
              className="med-image"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = links.IMAGE_NO_RESOURCE;
              }}
            />
          </div>
          <div className="med-modal-content">
            <FormControl id="create-pin-title" isRequired={true}>
              <Label>{t("mediacentre.advanced.name.title")}</Label>
              <Input
                placeholder="Votre titre"
                size="md"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value.trimStart())}
              />
            </FormControl>
            <FormControl id="create-pin-description">
              <Label>
                {t("mediacentre.description.title.description")}{" "}
                <span className="med-optional">
                  - {t("mediacentre.pins.modal.optional")}
                </span>
              </Label>
              <Input
                placeholder="Description"
                size="md"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value.trimStart())}
              />
            </FormControl>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="tertiary" onClick={handleCloseModal}>
          {t("mediacentre.cancel")}
        </Button>
        <Button
          color="primary"
          type="submit"
          disabled={!title}
          onClick={onSubmit}
        >
          {t("mediacentre.pin")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
