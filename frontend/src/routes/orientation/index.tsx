import React from "react";

import { Alert } from "@edifice.io/react";
import ExploreIcon from "@mui/icons-material/Explore";
import { useTranslation } from "react-i18next";

import { EmptyState } from "~/components/empty-state/EmptyState";
import { InfiniteScrollList } from "~/components/infinite-scroll-list/InfiniteScrollList";
import { MainLayout } from "~/components/main-layout/MainLayout";
import { CreatePins } from "~/components/modals/create-pins/CreatePins";
import { ModalEnum } from "~/core/enum/modal.enum";
import { useOrientation } from "~/hooks/useOrientation";
import { useAlertProvider } from "~/providers/AlertProvider";
import { useModalProvider } from "~/providers/ModalsProvider";
import "~/styles/page/search.scss";

export const OrientationPage: React.FC = () => {
  const { t } = useTranslation("mediacentre");
  const { alertType, alertText, setAlertText } = useAlertProvider();
  const { openModal } = useModalProvider();

  const { orientationSignets } = useOrientation();

  return (
    <>
      <MainLayout />
      {alertText !== "" && (
        <Alert
          autoClose
          autoCloseDelay={3000}
          isDismissible={false}
          isToast
          onClose={() => setAlertText("")}
          position="top-right"
          type={alertType}
          className="med-alert"
        >
          {alertText}
        </Alert>
      )}
      {openModal === ModalEnum.CREATE_PIN && <CreatePins />}
      <div className="med-search-container">
        <div className="med-search-page-content">
          <div className="med-search-page-header">
            <div className="med-search-page-title">
              <ExploreIcon className="med-search-icon" />
              <h1 className="med-search-title">
                {t("fr.openent.mediacentre.orientation")}
              </h1>
            </div>
          </div>
          <div className="med-search-page-content-body">
            {orientationSignets && !orientationSignets.length ? (
              <EmptyState
                image="empty-state.png"
                title="mediacentre.empty.state.resources"
              />
            ) : (
              <InfiniteScrollList
                redirectLink="/orientation"
                allResourcesDisplayed={orientationSignets}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
