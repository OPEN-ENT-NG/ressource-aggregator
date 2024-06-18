import { useState, useEffect, useReducer, useCallback } from "react";

import { Alert, AlertTypes, useUser } from "@edifice-ui/react";
import { ID } from "edifice-ts-client";
import { useTranslation } from "react-i18next";

import { HomeList } from "~/components/home-lists/HomeList";
import { MainLayout } from "~/components/main-layout/MainLayout";
import { CardTypeEnum } from "~/core/enum/card-type.enum";
import { useExternalResource } from "~/hooks/useExternalResource";
import { useFavorite } from "~/hooks/useFavorite";
import { useGlobal } from "~/hooks/useGlobal";
import { useSignet } from "~/hooks/useSignet";
import { useTextbook } from "~/hooks/useTextbook";
import { ExternalResource } from "~/model/ExternalResource.model";
import { Favorite } from "~/model/Favorite.model";
import { GlobalResource } from "~/model/GlobalResource";
import { Signet } from "~/model/Signet.model";
import { Textbook } from "~/model/Textbook.model";

export interface AppProps {
  _id: string;
  created: Date;
  description: string;
  map: string;
  modified: Date;
  name: string;
  owner: { userId: ID; displayName: string };
  shared: any[];
  thumbnail: string;
}

export const App = () => {
  const { user } = useUser();
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertTypes>("success");
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const { favorites, setFavorites, refetchFavorite } = useFavorite();
  const { homeSignets, setHomeSignets } = useSignet();

  const { textbooks, setTextbooks, refetchTextbooks } = useTextbook();
  const { externalResources, setExternalResources } = useExternalResource();
  const { globals } = useGlobal();
  const [externalsResourcesData, setExternalResourcesData] = useState<
    ExternalResource[] | GlobalResource[]
  >([]);
  const [textbooksData, setTextbooksData] = useState<Textbook[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    let newExternalResourcesData: ExternalResource[] = [];
    if (user?.type.length === 1 && user.type.includes("Relative")) {
      if (globals) {
        newExternalResourcesData = globals;
      }
    } else {
      newExternalResourcesData = externalResources;
    }

    // Avoid unnecessary state update to prevent infinite loop
    if (
      JSON.stringify(newExternalResourcesData) !==
      JSON.stringify(externalsResourcesData)
    ) {
      setExternalResourcesData(newExternalResourcesData);
    }
  }, [user, externalResources, globals, externalsResourcesData]);

  const fetchFavoriteTextbook = useCallback(() => {
    if (textbooks && favorites) {
      return textbooks.map((textbook: Textbook) => {
        const favorite = favorites.find(
          (fav: Favorite) => fav.id === textbook.id,
        );
        if (favorite) {
          return { ...textbook, favoriteId: favorite._id };
        }
        return textbook;
      });
    } else {
      return textbooks;
    }
  }, [textbooks, favorites]);

  useEffect(() => {
    const updated: Textbook[] = fetchFavoriteTextbook();
    setTextbooksData(updated);
  }, [textbooks, fetchFavoriteTextbook]);

  const handleAddFavorite = (resource: any) => {
    resource.favorite = true;
    setFavorites((prevFavorites: Favorite[]) => [...prevFavorites, resource]);
    refetchAll();
  };

  const refetchAll = () => {
    refetchFavorite();
    refetchTextbooks();
  };

  const handleRemoveFavorite = (id: string | number) => {
    setFavorites((prevFavorites: Favorite[]) =>
      prevFavorites.filter((fav) => fav.id != id),
    );
    updateFavoriteStatus(id, false);
  };

  const updateFavoriteStatus = (id: string | number, isFavorite: boolean) => {
    let newSignets: Signet[] = [...homeSignets];
    newSignets = newSignets.map((signet: Signet) =>
      signet?.id?.toString() == id.toString()
        ? { ...signet, favorite: isFavorite }
        : signet,
    );
    setHomeSignets(newSignets);
    let newTextbooks: Textbook[] = [...textbooks];
    newTextbooks = newTextbooks.map((textbook: Textbook) =>
      textbook?.id?.toString() == id.toString()
        ? { ...textbook, favorite: isFavorite }
        : textbook,
    );
    setTextbooks(newTextbooks);
    let newExternalResources: ExternalResource[] | GlobalResource[] = [
      ...externalsResourcesData,
    ];
    newExternalResources = newExternalResources.map(
      (externalResource: ExternalResource | GlobalResource) =>
        externalResource?.id?.toString() == id.toString()
          ? { ...externalResource, favorite: isFavorite }
          : externalResource,
    );
    setExternalResources(newExternalResources);
    forceUpdate(); // List are not re-rendering without this
  };

  const isTextbooksEmpty = () => {
    return textbooksData.length === 0;
  };

  const isExternalResourcesEmpty = () => {
    return externalsResourcesData.length === 0;
  };

  const isHomeSignetsEmpty = () => {
    return homeSignets.length === 0;
  };

  // return the type and the resource of the first non favorite list of resources
  const fisrtNonFav = () => {
    if (!isTextbooksEmpty()) {
      return { type: CardTypeEnum.manuals, resource: textbooksData };
    }
    if (!isExternalResourcesEmpty()) {
      // textbooks is empty
      return {
        type: CardTypeEnum.external_resources,
        resource: externalsResourcesData,
      };
    }
    if (!isHomeSignetsEmpty()) {
      // textbooks and externalResources are empty
      return { type: CardTypeEnum.book_mark, resource: homeSignets };
    }
    return null;
  };

  // return the type and the resource of the second non favorite list of resources
  const secondNonFav = () => {
    if (
      !isHomeSignetsEmpty() &&
      (!isTextbooksEmpty() || !isExternalResourcesEmpty())
    ) {
      return { type: CardTypeEnum.book_mark, resource: homeSignets };
    }
    if (
      isHomeSignetsEmpty() &&
      !isTextbooksEmpty() &&
      !isExternalResourcesEmpty()
    ) {
      return {
        type: CardTypeEnum.external_resources,
        resource: externalsResourcesData,
      };
    }
    return null;
  };

  return (
    <>
      <MainLayout />
      {alertText !== "" && (
        <Alert
          autoClose
          autoCloseDelay={3000}
          isDismissible
          isToast
          onClose={() => setAlertText("")}
          position="top-right"
          type={alertType}
          className="med-alert"
        >
          {alertText}
        </Alert>
      )}
      <div className="med-container">
        <div className="med-fav-container">
          <HomeList
            resources={favorites}
            type={CardTypeEnum.favorites}
            setAlertText={setAlertText}
            setAlertType={setAlertType}
            handleAddFavorite={handleAddFavorite}
            handleRemoveFavorite={handleRemoveFavorite}
          />
        </div>
        <div className="med-non-fav-container">
          {fisrtNonFav() === null ? ( // involve secondNonFavType() === null
            <div className="empty-state">
              <img
                src="/mediacentre/public/img/empty-state.png"
                alt="empty-state"
                className="empty-state-img"
              />
              <span className="empty-state-text">
                {t("mediacentre.ressources.empty")}
              </span>
            </div>
          ) : secondNonFav() === null ? ( // fisrtNonFavType() !== null
            <HomeList
              resources={fisrtNonFav()?.resource ?? []} // fisrtNonFav() is not null involve resource can't be null
              type={fisrtNonFav()?.type ?? CardTypeEnum.manuals} // fisrtNonFav() is not null
              setAlertText={setAlertText}
              setAlertType={setAlertType}
              handleAddFavorite={handleAddFavorite}
              handleRemoveFavorite={handleRemoveFavorite}
              double={true} // we double the number of cards to display because we have only one list
            />
          ) : (
            // both not empty
            <>
              <div className="med-first-non-fav-container">
                <HomeList
                  resources={fisrtNonFav()?.resource ?? []} // fisrtNonFav() is not null involve resource can't be null
                  type={fisrtNonFav()?.type ?? CardTypeEnum.manuals} // fisrtNonFav() is not null
                  setAlertText={setAlertText}
                  setAlertType={setAlertType}
                  handleAddFavorite={handleAddFavorite}
                  handleRemoveFavorite={handleRemoveFavorite}
                  double={false} // we don't double the number of cards to display because we have two lists
                />
              </div>
              <div className="med-second-non-fav-container">
                <HomeList
                  resources={secondNonFav()?.resource ?? []} // secondNonFav() is not null involve resource can't be null
                  type={secondNonFav()?.type ?? CardTypeEnum.manuals} // secondNonFav() is not null
                  setAlertText={setAlertText}
                  setAlertType={setAlertType}
                  handleAddFavorite={handleAddFavorite}
                  handleRemoveFavorite={handleRemoveFavorite}
                  double={false} // we don't double the number of cards to display because we have two lists
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
