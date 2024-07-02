import React, { useEffect, useState } from "react";

import { Alert, AlertTypes, LoadingScreen, useUser } from "@edifice-ui/react";
import LaptopIcon from "@mui/icons-material/Laptop";
import { useTranslation } from "react-i18next";
import { FilterLayout } from "~/components/filter-layout/FilterLayout";
import { MainLayout } from "~/components/main-layout/MainLayout";
import "~/styles/page/search.scss";
import { useExternalResource } from "~/hooks/useExternalResource";
import { useGlobal } from "~/hooks/useGlobal";
import { InfiniteScrollList } from "~/components/infinite-scroll-list/InfiniteScrollList";
import { Resource } from "~/model/Resource.model";

export const ResourcePage: React.FC = () => {
  const { user } = useUser();
  const { t } = useTranslation();
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertTypes>("success");
  const {
    globals,
    disciplines: disciplinesGlobal,
    levels: levelsGlobal
  } = useGlobal();
  const {
    externalResources,
    disciplines: disciplinesExternal,
    levels: levelsExternal,
    types: typesExternal,
    refetchSearch,
  } = useExternalResource();

  const [externalResourcesData, setExternalResourcesData] = useState<Resource[]>([]);
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const [allResourcesDisplayed, setAllResourcesDisplayed] =
    useState<Resource[]>([]); // all resources after the filters

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!initialLoadDone) {
      refetchSearch();
      setInitialLoadDone(true);
    }
    if (user?.type.length === 1 && user.type.includes("Relative")) {
      if (globals) {
        setDisciplines(disciplinesGlobal);
        setLevels(levelsGlobal);
        setExternalResourcesData(globals);
      }
    } else {
      setDisciplines(disciplinesExternal);
      setLevels(levelsExternal);
      setTypes(typesExternal);
      setExternalResourcesData(externalResources);
    }
  }, [
    user,
    externalResources,
    globals,
    disciplinesExternal,
    disciplinesGlobal,
    levelsGlobal,
    levelsExternal,
    typesExternal,
    initialLoadDone,
    refetchSearch,
  ]);

  return (
    <>
      <MainLayout />
      {alertText !== "" && (
        <Alert
          autoClose
          autoCloseDelay={3000}
          isDismissible
          isToast
          onClose={() => {
            setAlertText("");
            setAlertType("success");
          }}
          position="top-right"
          type={alertType}
          className="med-alert"
        >
          {alertText}
        </Alert>
      )}
      <div className="med-search-container">
        <div className="med-search-page-content">
          <div className="med-search-page-header">
            <div className="med-search-page-title">
              <LaptopIcon className="med-search-icon" />
              <h1 className="med-search-title">
                {t("mediacentre.sidebar.resources")}
              </h1>
            </div>
          </div>
          <div className="med-search-page-content-body">
            <FilterLayout
                resources={externalResourcesData}
                disciplines={disciplines}
                levels={levels}
                setAllResourcesDisplayed={setAllResourcesDisplayed}
                types={types}
              />
            {isLoading ? (
              <LoadingScreen position={false} />
            ) : (
              <InfiniteScrollList
                allResourcesDisplayed={allResourcesDisplayed}
                setIsLoading={setIsLoading}
                setAlertText={setAlertText}
                refetchSearch={refetchSearch}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
