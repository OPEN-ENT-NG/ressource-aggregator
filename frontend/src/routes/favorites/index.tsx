import React, { useEffect, useState } from "react";

import { Alert } from "@edifice-ui/react";
import StarIcon from "@mui/icons-material/Star";
import { useTranslation } from "react-i18next";

import { FilterLayout } from "../../components/filter-layout/FilterLayout";
import { EmptyState } from "~/components/empty-state/empty-state";
import { InfiniteScrollList } from "~/components/infinite-scroll-list/InfiniteScrollList";
import { MainLayout } from "~/components/main-layout/MainLayout";
import "~/styles/page/search.scss";
import { CreatePins } from "~/components/modals/create-pins/CreatePins";
import { ModalEnum } from "~/core/enum/modal.enum";
import { useFavorite } from "~/hooks/useFavorite";
import { useResourceListInfo } from "~/hooks/useResourceListInfo";
import { Resource } from "~/model/Resource.model";
import { useAlertProvider } from "~/providers/AlertProvider";
import { useModalProvider } from "~/providers/ModalsProvider";
import { usePinProvider } from "~/providers/PinProvider";
import { sortByAlphabet } from "~/utils/sortResources.util";
import { ModalEnum } from "~/core/enum/modal.enum";

export const FavoritePage: React.FC = () => {
  const { t } = useTranslation("mediacentre");
  const { refetchPins } = usePinProvider();
  const { alertType, alertText, setAlertText } = useAlertProvider();
  const { openModal } = useModalProvider();

  const { favorites, refetchFavorite } = useFavorite();
  const [allResourcesDisplayed, setAllResourcesDisplayed] = useState<
    Resource[] | null
  >(null); // all resources after the filters
  const [favoriteResourcesData, setFavoriteResourcesData] = useState<
    Resource[] | null
  >(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const { resourcesMap } = useResourceListInfo(favorites);

  useEffect(() => {
    if (!favorites) return;
    if (!initialLoadDone) {
      refetchFavorite();
      setInitialLoadDone(true);
    }
    const sortedFavoriteResources = [
      ...sortByAlphabet(resourcesMap.textbooks),
      ...sortByAlphabet(resourcesMap.externalResources),
      ...sortByAlphabet(resourcesMap.signets),
      ...sortByAlphabet(resourcesMap.moodle),
    ];
    setFavoriteResourcesData(sortedFavoriteResources);
    setAllResourcesDisplayed(sortedFavoriteResources);
  }, [favorites, refetchFavorite, initialLoadDone, resourcesMap]);

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
      {openModal === ModalEnum.CREATE_PIN && (
        <CreatePins refetch={refetchPins} />
      )}
      <div className="med-search-container">
        <div className="med-search-page-content">
          <div className="med-search-page-header">
            <div className="med-search-page-title">
              <StarIcon className="med-search-icon" />
              <h1 className="med-search-title">
                {t("mediacentre.list.card.favorites")}
              </h1>
            </div>
          </div>
          <div className="med-search-page-content-body">
            {favoriteResourcesData && !favoriteResourcesData.length ? (
              <EmptyState
                imgSource="empty-state-favorites.png"
                title="mediacentre.empty.state.favorites"
              />
            ) : (
              <>
                <FilterLayout
                  resources={favoriteResourcesData}
                  allResourcesDisplayed={allResourcesDisplayed}
                  setAllResourcesDisplayed={setAllResourcesDisplayed}
                />
                {allResourcesDisplayed && !allResourcesDisplayed.length ? (
                  <EmptyState title="mediacentre.empty.state.filter" />
                ) : (
                  <InfiniteScrollList
                    redirectLink="/favorites"
                    allResourcesDisplayed={allResourcesDisplayed}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
