import { useState, useEffect, useReducer } from "react";

import { Alert, AlertTypes } from "@edifice-ui/react";
import { ID } from "edifice-ts-client";

import { MainLayout } from "~/components/main-layout/MainLayout";
import { useFavorite } from "~/hooks/useFavorite";
import { useSignet } from "~/hooks/useSignet";
import { useTextbook } from "~/hooks/useTextbook";
import { Favorite } from "~/model/Favorite.model";
import { Signet } from "~/model/Signet.model";
import { Textbook } from "~/model/Textbook.model";
import { ExternalResource } from "~/model/ExternalResource.model";
import { HomeManualsList } from "~/components/home-lists/HomeManualsList";
import { HomeFavoritesList } from "~/components/home-lists/HomeFavoritesList";
import { HomeBookMarksList } from "~/components/home-lists/HomeBookMarksList";
import { HomeExternalResourcesList } from "~/components/home-lists/HomeExternalResourcesList";

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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertTypes>("success");
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const { favorites, setFavorites } = useFavorite();
  const { homeSignets, setHomeSignets } = useSignet();
  const { textbooks, setTextbooks, externalResources, setExternalResources } =
    useTextbook();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [alertText]);

  const handleAddFavorite = (resource: any) => {
    resource.favorite = true;
    setFavorites((prevFavorites: Favorite[]) => [...prevFavorites, resource]);
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
    let newExternalResources: ExternalResource[] = [...externalResources];
    newExternalResources = newExternalResources.map((externalResource: ExternalResource) =>
      externalResource?.id?.toString() == id.toString()
        ? { ...externalResource, favorite: isFavorite }
        : externalResource,
    );
    setExternalResources(newExternalResources);
    forceUpdate(); // List are not re-rendering without this
  };

  const firstColumn = () => {
    if(textbooks && textbooks.length > 0) {
      return (
        <HomeManualsList
          textbooks={textbooks}
          setAlertText={setAlertText}
          setAlertType={setAlertType}
          handleAddFavorite={handleAddFavorite}
          handleRemoveFavorite={handleRemoveFavorite}
        />
      );
    }
    else if (externalResources && externalResources.length > 0) {
      return (
        <HomeExternalResourcesList
          externalResources={externalResources}
          setAlertText={setAlertText}
          setAlertType={setAlertType}
          handleAddFavorite={handleAddFavorite}
          handleRemoveFavorite={handleRemoveFavorite}
        />
      );
    }
  }

  const secondColumn = () => {
    if (homeSignets && homeSignets.length > 0) {
      return (
        <HomeBookMarksList
          homeSignets={homeSignets}
          setAlertText={setAlertText}
          setAlertType={setAlertType}
          handleAddFavorite={handleAddFavorite}
          handleRemoveFavorite={handleRemoveFavorite}
        />
      );
    }
    else if (externalResources && externalResources.length > 0) {
      return (
        <HomeExternalResourcesList
          externalResources={externalResources}
          setAlertText={setAlertText}
          setAlertType={setAlertType}
          handleAddFavorite={handleAddFavorite}
          handleRemoveFavorite={handleRemoveFavorite}
        />
      );
    }
  }

  if (windowWidth >= 1280) {
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
        <div className="med-container">
          <div className="list-container">
            <div className="left-container">
              <div className="bottom-container">
                <div className="bottom-left-container">
                  {firstColumn()}
                </div>
                <div className="bottom-right-container">
                  {secondColumn()}
                </div>
              </div>
            </div>
            <div className="right-container">
              {favorites && (
                <HomeFavoritesList
                  favorites={favorites}
                  setAlertText={setAlertText}
                  setAlertType={setAlertType}
                  handleAddFavorite={handleAddFavorite}
                  handleRemoveFavorite={handleRemoveFavorite}
                />
              )}
            </div>
          </div>
        </div>
      </>
    );
  } else if (windowWidth >= 768) {
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
            type="success"
            className="med-alert"
          >
            {alertText}
          </Alert>
        )}
        <div className="med-container">
          <HomeFavoritesList
            favorites={favorites}
            setAlertText={setAlertText}
            setAlertType={setAlertType}
            handleAddFavorite={handleAddFavorite}
            handleRemoveFavorite={handleRemoveFavorite}
          />
          <div className="bottom-container">
            <div className="bottom-left-container">
              <HomeManualsList
                textbooks={textbooks}
                setAlertText={setAlertText}
                setAlertType={setAlertType}
                handleAddFavorite={handleAddFavorite}
                handleRemoveFavorite={handleRemoveFavorite}
              />
            </div>
            <div className="bottom-right-container">
              <HomeBookMarksList
                homeSignets={homeSignets}
                setAlertText={setAlertText}
                setAlertType={setAlertType}
                handleAddFavorite={handleAddFavorite}
                handleRemoveFavorite={handleRemoveFavorite}
              />
            </div>
          </div>
        </div>
      </>
    );
  } else {
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
            type="success"
            className="med-alert"
          >
            {alertText}
          </Alert>
        )}
        <div className="med-container">
          <HomeFavoritesList
            favorites={favorites}
            setAlertText={setAlertText}
            setAlertType={setAlertType}
            handleAddFavorite={handleAddFavorite}
            handleRemoveFavorite={handleRemoveFavorite}
          />
          <HomeManualsList
            textbooks={textbooks}
            setAlertText={setAlertText}
            setAlertType={setAlertType}
            handleAddFavorite={handleAddFavorite}
            handleRemoveFavorite={handleRemoveFavorite}
          />
          <HomeBookMarksList
            homeSignets={homeSignets}
            setAlertText={setAlertText}
            setAlertType={setAlertType}
            handleAddFavorite={handleAddFavorite}
            handleRemoveFavorite={handleRemoveFavorite}
          />
        </div>
      </>
    );
  }
};
