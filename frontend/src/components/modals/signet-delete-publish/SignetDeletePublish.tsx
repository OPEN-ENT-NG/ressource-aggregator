import React from "react";

import { Button, Modal } from "@edifice.io/react";
import { useTranslation } from "react-i18next";

import { ModalEnum } from "~/core/enum/modal.enum";
import { PutSharePayload } from "~/model/payloads/PutSharePayload";
import { SearchResource } from "~/model/SearchResource.model";
import { useAlertProvider } from "~/providers/AlertProvider";
import { useModalProvider } from "~/providers/ModalsProvider";
import { useToasterProvider } from "~/providers/ToasterProvider";
import "../Modal.scss";
import {
  useDeleteSignetMutation,
  useDeleteSignetPublicMutation,
  useUpdateShareResourceMutation,
} from "~/services/api/signet.service";

export const SignetDeletePublish: React.FC = () => {
  const { t } = useTranslation("mediacentre");
  const { openModal, closeAllModals } = useModalProvider();
  const { toasterResources, resetResources } = useToasterProvider();
  const [updateShareResource] = useUpdateShareResourceMutation();
  const [deleteSignet] = useDeleteSignetMutation();
  const [deletePublicSignet] = useDeleteSignetPublicMutation();
  const { notify } = useAlertProvider();

  const handleCloseModal = () => {
    resetResources();
    closeAllModals();
  };

  const onSubmit = async () => {
    try {
      if (
        !toasterResources ||
        !toasterResources.find((resource) => resource.published)
      ) {
        notify(t("mediacentre.error.anyResource"), "danger");
        return;
      }

      const promises = toasterResources.map(
        async (resource: SearchResource) => {
          const idSignet = resource?.id?.toString();
          try {
            if (resource.published) {
              const deleteResponse = await deletePublicSignet({ idSignet });
              if (deleteResponse?.error) {
                throw new Error(t("mediacentre.error.delete"));
              }
            } else {
              const sharePayload: PutSharePayload = {
                bookmarks: {},
                groups: {},
                users: {},
              };
              await updateShareResource({ idSignet, payload: sharePayload });
              const deleteResponse = await deleteSignet({ idSignet });
              if (deleteResponse?.error) {
                throw new Error(t("mediacentre.error.delete"));
              }
            }
            return { status: "fulfilled" };
          } catch (error) {
            return { status: "rejected", reason: error };
          }
        },
      );

      const results = await Promise.allSettled(promises);

      const rejectedResults = results.filter(
        (result) => (result as any)?.value?.status === "rejected",
      );

      if (rejectedResults.length > 0) {
        notify(t("mediacentre.error.delete"), "danger");
      } else {
        setTimeout(async () => {
          resetResources();
          handleCloseModal();
          notify(
            toasterResources.length > 1
              ? t("mediacentre.signet.delete.many.success")
              : t("mediacentre.signet.delete.success"),
            "success",
          );
        }, 500);
      }
    } catch (e) {
      console.error(e);
      notify(t("mediacentre.error.delete"), "danger");
    }
  };

  if (!toasterResources || openModal !== ModalEnum.DELETE_SIGNET_PUBLISHED) {
    return null;
  }

  return (
    <Modal onModalClose={handleCloseModal} isOpen={true} id="delete-signet">
      <Modal.Header onModalClose={handleCloseModal}>
        {toasterResources.length > 1
          ? t("mediacentre.modal.signet.delete.published.title.many")
          : t("mediacentre.modal.signet.delete.published.title")}
      </Modal.Header>
      <Modal.Body>
        {toasterResources.length > 1
          ? t("mediacentre.modal.signet.delete.published.subtitle.many")
          : t("mediacentre.modal.signet.delete.published.subtitle")}
      </Modal.Body>
      <Modal.Footer>
        <Button color="tertiary" onClick={handleCloseModal}>
          {t("mediacentre.cancel")}
        </Button>
        <Button color="danger" type="submit" onClick={onSubmit}>
          {t("mediacentre.delete")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
