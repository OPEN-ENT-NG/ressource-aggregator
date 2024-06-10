import { useState, useEffect, useReducer } from "react";

import { Alert, AlertTypes } from "@edifice-ui/react";
import { ID } from "edifice-ts-client";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ListCard } from "~/components/list-card/ListCard.tsx";
import { MainLayout } from "~/components/main-layout/MainLayout";
import { Resource } from "~/components/resource/Resource";
import { CardTypeEnum } from "~/core/enum/card-type.enum.ts";
import { useFavorite } from "~/hooks/useFavorite";
import { useSignet } from "~/hooks/useSignet";
import { useTextbook } from "~/hooks/useTextbook";
import { Favorite } from "~/model/Favorite.model";
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertTypes>("success");
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const { favorites, setFavorites } = useFavorite();
  const { homeSignets, setHomeSignets } = useSignet();
  const { textbooks, setTextbooks } = useTextbook();
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  const handleRemoveFavorite = (id: string) => {
    setFavorites((prevFavorites: Favorite[]) =>
      prevFavorites.filter((fav) => fav.id !== id),
    );
    updateFavoriteStatus(id, false);
  };

  const updateFavoriteStatus = (id: string, isFavorite: boolean) => {
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
    forceUpdate(); // List are not re-rendering without this
  };

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
                  {textbooks && (
                    <ListCard
                      scrollable={false}
                      type={CardTypeEnum.manuals}
                      components={textbooks.map((textbook: Textbook) => (
                        <Resource
                          id={textbook?.id ?? ""}
                          key={textbook.id}
                          image={
                            textbook?.image ??
                            "/mediacentre/public/img/no-avatar.svg"
                          }
                          title={textbook.title}
                          subtitle={textbook?.editors?.join(", ") ?? ""}
                          type={CardTypeEnum.manuals}
                          favorite={textbook.favorite}
                          link={textbook.link ?? textbook.url ?? "/"}
                          setAlertText={(arg: string, type: AlertTypes) => {
                            setAlertText(arg);
                            setAlertType(type);
                          }}
                          resource={textbook}
                          handleAddFavorite={handleAddFavorite}
                          handleRemoveFavorite={handleRemoveFavorite}
                        />
                      ))}
                      redirectLink={() => navigate("/textbook")}
                    />
                  )}
                </div>
                <div className="bottom-right-container">
                  {homeSignets && (
                    <ListCard
                      scrollable={false}
                      type={CardTypeEnum.book_mark}
                      components={homeSignets.map((signet: Signet) => (
                        <Resource
                          id={signet?.id ?? signet?._id ?? ""}
                          key={signet.id ?? signet?._id ?? ""}
                          image={
                            signet?.image ??
                            "/mediacentre/public/img/no-avatar.svg"
                          }
                          title={signet.title}
                          subtitle={
                            signet.orientation
                              ? t("mediacentre.signet.orientation")
                              : ""
                          }
                          type={CardTypeEnum.book_mark}
                          favorite={signet.favorite}
                          link={signet.link ?? signet.url ?? "/"}
                          footerImage={
                            signet.owner_id
                              ? `/userbook/avatar/${signet.owner_id}?thumbnail=48x48`
                              : `/mediacentre/public/img/no-avatar.svg`
                          }
                          footerText={
                            signet.owner_name ??
                            (signet.authors ? signet.authors[0] : " ")
                          }
                          setAlertText={(arg: string, type: AlertTypes) => {
                            setAlertText(arg);
                            setAlertType(type);
                          }}
                          resource={signet}
                          handleAddFavorite={handleAddFavorite}
                          handleRemoveFavorite={handleRemoveFavorite}
                        />
                      ))}
                      redirectLink="/mediacentre?view=angular#/signet"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="right-container">
              {favorites && (
                <ListCard
                  scrollable={false}
                  type={CardTypeEnum.favorites}
                  components={favorites.map((favorite: Favorite) => (
                    <Resource
                      id={favorite?.id ?? ""}
                      key={favorite?.id ?? ""}
                      image={
                        favorite?.image ??
                        "/mediacentre/public/img/no-avatar.svg"
                      }
                      title={favorite.title}
                      subtitle={favorite.description}
                      type={CardTypeEnum.favorites}
                      favorite={favorite.favorite}
                      link={favorite.link ?? favorite.url ?? "/"}
                      setAlertText={(arg: string, type: AlertTypes) => {
                        setAlertText(arg);
                        setAlertType(type);
                      }}
                      resource={favorite}
                      handleAddFavorite={handleAddFavorite}
                      handleRemoveFavorite={handleRemoveFavorite}
                    />
                  ))}
                  redirectLink="/mediacentre?view=angular#/favorite"
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
          <ListCard
            scrollable={false}
            type={CardTypeEnum.favorites}
            components={favorites.map((favorite: Favorite) => (
              <Resource
                id={favorite?.id ?? ""}
                key={favorite.id}
                image={
                  favorite?.image ?? "/mediacentre/public/img/no-avatar.svg"
                }
                title={favorite.title}
                subtitle={favorite.description}
                type={CardTypeEnum.favorites}
                favorite={favorite.favorite}
                link={favorite.link ?? favorite.url ?? "/"}
                setAlertText={(arg: string, type: AlertTypes) => {
                  setAlertText(arg);
                  setAlertType(type);
                }}
                resource={favorite}
                handleAddFavorite={handleAddFavorite}
                handleRemoveFavorite={handleRemoveFavorite}
              />
            ))}
            redirectLink="/mediacentre?view=angular#/favorite"
          />
          <div className="bottom-container">
            <div className="bottom-left-container">
              <ListCard
                scrollable={false}
                type={CardTypeEnum.manuals}
                components={textbooks.map((textbook: Textbook) => (
                  <Resource
                    id={textbook?.id ?? ""}
                    key={textbook.id}
                    image={
                      textbook?.image ?? "/mediacentre/public/img/no-avatar.svg"
                    }
                    title={textbook.title}
                    subtitle={textbook?.editors?.join(", ") ?? ""}
                    type={CardTypeEnum.manuals}
                    favorite={textbook.favorite}
                    link={textbook.link ?? textbook.url ?? "/"}
                    setAlertText={(arg: string, type: AlertTypes) => {
                      setAlertText(arg);
                      setAlertType(type);
                    }}
                    resource={textbook}
                    handleAddFavorite={handleAddFavorite}
                    handleRemoveFavorite={handleRemoveFavorite}
                  />
                ))}
                redirectLink={() => navigate("/textbook")}
              />
            </div>
            <div className="bottom-right-container">
              <ListCard
                scrollable={false}
                type={CardTypeEnum.book_mark}
                components={homeSignets.map((signet: Signet) => (
                  <Resource
                    id={signet?.id ?? signet?._id ?? ""}
                    key={signet.id ?? signet._id}
                    image={
                      signet?.image ?? "/mediacentre/public/img/no-avatar.svg"
                    }
                    title={signet.title}
                    subtitle={
                      signet.orientation
                        ? t("mediacentre.signet.orientation")
                        : ""
                    }
                    type={CardTypeEnum.book_mark}
                    favorite={signet.favorite}
                    link={signet.link ?? signet.url ?? "/"}
                    footerImage={
                      signet.owner_id
                        ? `/userbook/avatar/${signet.owner_id}?thumbnail=48x48`
                        : `/mediacentre/public/img/no-avatar.svg`
                    }
                    footerText={
                      signet.owner_name ??
                      (signet.authors ? signet.authors[0] : "")
                    }
                    setAlertText={(arg: string, type: AlertTypes) => {
                      setAlertText(arg);
                      setAlertType(type);
                    }}
                    resource={signet}
                    handleAddFavorite={handleAddFavorite}
                    handleRemoveFavorite={handleRemoveFavorite}
                  />
                ))}
                redirectLink="/mediacentre?view=angular#/signet"
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
          <ListCard
            scrollable={false}
            type={CardTypeEnum.favorites}
            components={favorites.map((favorite: Favorite) => (
              <Resource
                id={favorite?.id ?? ""}
                key={favorite.id}
                image={
                  favorite?.image ?? "/mediacentre/public/img/no-avatar.svg"
                }
                title={favorite.title}
                subtitle={favorite.description}
                type={CardTypeEnum.favorites}
                favorite={favorite.favorite}
                link={favorite.link ?? favorite.url ?? "/"}
                setAlertText={(arg: string, type: AlertTypes) => {
                  setAlertText(arg);
                  setAlertType(type);
                }}
                resource={favorite}
                handleAddFavorite={handleAddFavorite}
                handleRemoveFavorite={handleRemoveFavorite}
              />
            ))}
            redirectLink="/mediacentre?view=angular#/favorite"
          />
          <ListCard
            scrollable={false}
            type={CardTypeEnum.manuals}
            components={textbooks.map((textbook: Textbook) => (
              <Resource
                id={textbook?.id ?? ""}
                key={textbook?.id ?? ""}
                image={
                  textbook?.image ?? "/mediacentre/public/img/no-avatar.svg"
                }
                title={textbook.title}
                subtitle={textbook?.editors?.join(", ") ?? ""}
                type={CardTypeEnum.manuals}
                favorite={textbook.favorite}
                link={textbook.link ?? textbook.url ?? "/"}
                setAlertText={(arg: string, type: AlertTypes) => {
                  setAlertText(arg);
                  setAlertType(type);
                }}
                resource={textbook}
                handleAddFavorite={handleAddFavorite}
                handleRemoveFavorite={handleRemoveFavorite}
              />
            ))}
            redirectLink={() => navigate("/textbook")}
          />
          <ListCard
            scrollable={false}
            type={CardTypeEnum.book_mark}
            components={homeSignets.map((signet: Signet) => (
              <Resource
                id={signet?.id ?? signet?._id ?? ""}
                key={signet?.id ?? signet?._id ?? ""}
                image={signet?.image ?? "/mediacentre/public/img/no-avatar.svg"}
                title={signet.title}
                subtitle={
                  signet.orientation ? t("mediacentre.signet.orientation") : ""
                }
                type={CardTypeEnum.book_mark}
                favorite={signet.favorite}
                link={signet.link ?? signet.url ?? "/"}
                footerImage={
                  signet.owner_id
                    ? `/userbook/avatar/${signet.owner_id}?thumbnail=48x48`
                    : `/mediacentre/public/img/no-avatar.svg`
                }
                footerText={
                  signet.owner_name ?? (signet.authors ? signet.authors[0] : "")
                }
                setAlertText={(arg: string, type: AlertTypes) => {
                  setAlertText(arg);
                  setAlertType(type);
                }}
                resource={signet}
                handleAddFavorite={handleAddFavorite}
                handleRemoveFavorite={handleRemoveFavorite}
              />
            ))}
            redirectLink="/mediacentre?view=angular#/signet"
          />
        </div>
      </>
    );
  }
};
