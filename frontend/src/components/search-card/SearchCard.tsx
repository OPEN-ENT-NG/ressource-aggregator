import "./SearchCard.scss";
import React, { useEffect, useState } from "react";

import { AlertTypes, Card, Tooltip } from "@edifice-ui/react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import PinIcon from "@mui/icons-material/PushPin";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useTranslation } from "react-i18next";

import { SearchCardDescription } from "./search-card-description/SearchCardDescription";
import { SearchCardDetails } from "./search-card-details/SearchCardDetails";
import { SearchCardType } from "./search-card-type/SearchCardType";
import { SearchCardTypeEnum } from "~/core/enum/search-card-type.enum";
import { SearchResource } from "~/model/SearchResource.model";
import { useAlertProvider } from "~/providers/AlertProvider";
import { useModalProvider } from "~/providers/ModalsProvider";
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "~/services/api/favorite.service";

interface SearchResourceProps {
  searchResource: SearchResource;
  link: string;
  refetchSearch: () => void;
}

export const SearchCard: React.FC<SearchResourceProps> = ({
  searchResource,
  link,
  refetchSearch,
}) => {
  const [newLink, setNewLink] = useState<string>("");
  const { t } = useTranslation();
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();
  const [isExpanded, setIsExpanded] = useState(false);
  const { setModalResource, setIsCreatedOpen } = useModalProvider();
  const { setAlertText, setAlertType } = useAlertProvider();

  const type = (): SearchCardTypeEnum => {
    if (searchResource?.source) {
      switch (searchResource.source) {
        case "fr.openent.mediacentre.source.Moodle":
          return SearchCardTypeEnum.moodle;
        case "fr.openent.mediacentre.source.Signet":
          return SearchCardTypeEnum.book_mark;
        case "fr.openent.mediacentre.source.GAR":
          if (searchResource?.is_textbook) {
            return SearchCardTypeEnum.manuals;
          }
          return SearchCardTypeEnum.external_resources;
        case "fr.openent.mediacentre.source.GlobalResource":
          return SearchCardTypeEnum.external_resources;
        default:
          return SearchCardTypeEnum.manuals;
      }
    } else {
      return SearchCardTypeEnum.manuals;
    }
  };

  const notify = (message: string, type: AlertTypes) => {
    setAlertText(message);
    setAlertType(type);
  };

  const copy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(
        searchResource?.link ?? searchResource?.url ?? "",
      );
      notify(t("mediacentre.notification.copy"), "success");
    } else {
      console.error("Clipboard not available");
    }
  };

  const fav = async () => {
    try {
      if (
        searchResource.source === "fr.openent.mediacentre.source.Signet" ||
        searchResource.source === "fr.openent.mediacentre.source.GlobalResource"
      ) {
        const newId = searchResource.id
          ? parseInt(searchResource.id.toString())
          : searchResource.id;
        const newSearchResource = {
          ...searchResource,
          id: newId,
        };
        await addFavorite({
          id: newId,
          resource: newSearchResource,
        });
      } else {
        await addFavorite({
          id: searchResource._id,
          resource: searchResource,
        });
      }
      notify(t("mediacentre.notification.addFavorite"), "success");
      refetchSearch();
    } catch (e) {
      console.error(e);
    }
  };

  const unfav = async () => {
    try {
      if (
        searchResource.source === "fr.openent.mediacentre.source.Signet" ||
        searchResource.source === "fr.openent.mediacentre.source.GlobalResource"
      ) {
        const newId = searchResource.id
          ? parseInt(searchResource.id.toString())
          : searchResource.id;
        await removeFavorite({
          id: newId,
          source: searchResource?.source,
        });
      } else {
        await removeFavorite({
          id: searchResource.favoriteId ?? searchResource._id,
          source: searchResource?.source,
        });
      }
      notify(t("mediacentre.notification.removeFavorite"), "success");
      refetchSearch();
    } catch (e) {
      console.error(e);
    }
  };

  const pin = () => {
    setModalResource(searchResource);
    setIsCreatedOpen(true);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (
      !link.startsWith("https://") &&
      !link.startsWith("http://") &&
      link !== "/"
    ) {
      setNewLink("https://" + link);
    } else {
      setNewLink(link);
    }
  }, [link]);

  return (
    <Card
      isSelectable={false}
      isClickable={false}
      className={`med-search-resource-card ${
        isExpanded ? "expanded" : "not-expanded"
      }`}
    >
      <div className="med-search-resource-top-container">
        <a href={newLink !== "/" ? newLink : "/"} target="_blank">
          <div className="med-search-resource-left-container">
            {searchResource.image && (
              <img
                src={searchResource.image}
                alt="Resource"
                className="med-search-resource-image"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src =
                    "/mediacentre/public/img/no-image-resource.png";
                }}
              />
            )}
          </div>
        </a>
        <div className="med-search-resource-right-container">
          <Card.Body space={"0"}>
            <a href={newLink !== "/" ? newLink : "/"} target="_blank">
              <SearchCardType type={type()} />
              <Card.Title>{searchResource.title}</Card.Title>
              <Card.Text>
                {searchResource.editors && searchResource.editors[0]}
              </Card.Text>
            </a>
          </Card.Body>
          <Card.Footer>
            <div
              className="med-footer-details"
              role="button"
              onClick={toggleExpand}
              onKeyDown={() => {}}
              tabIndex={0}
            >
              <InfoOutlinedIcon className="med-footer-icon med-info-icon" />
              {t("mediacentre.description.button")}
              {isExpanded ? (
                <KeyboardArrowDownIcon className="med-footer-icon" />
              ) : (
                <KeyboardArrowRight className="med-footer-icon" />
              )}
            </div>
            <div className="med-footer-svg">
              <Tooltip message={t("mediacentre.card.pin")} placement="top">
                <PinIcon className="med-pin" onClick={() => pin()} />
              </Tooltip>
              <Tooltip message={t("mediacentre.card.copy")} placement="top">
                <ContentCopyIcon className="med-link" onClick={() => copy()} />
              </Tooltip>
              {searchResource.source !=
              "fr.openent.mediacentre.source.GlobalResource" ? (
                searchResource.favorite ? (
                  <Tooltip
                    message={t("mediacentre.card.unfavorite")}
                    placement="top"
                  >
                    <StarIcon className="med-star" onClick={() => unfav()} />
                  </Tooltip>
                ) : (
                  <Tooltip
                    message={t("mediacentre.card.favorite")}
                    placement="top"
                  >
                    <StarBorderIcon
                      className="med-star"
                      onClick={() => fav()}
                    />
                  </Tooltip>
                )
              ) : null}
            </div>
          </Card.Footer>
        </div>
      </div>
      <div className={`med-search-resource-bottom-container`}>
        {searchResource.description && (
          <SearchCardDescription searchResource={searchResource} />
        )}
        <SearchCardDetails searchResource={searchResource} />
      </div>
    </Card>
  );
};
