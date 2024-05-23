import React, { useState } from "react";

import "./SearchResource.scss";
import { Card } from "@edifice-ui/react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import PushPinIcon from "@mui/icons-material/PushPin";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useTranslation } from "react-i18next";

import { IconMapping } from "~/core/const/icon-mapping.const";
import { SearchCardTitle } from "~/core/const/search-card-title.const";
import { ResourceDetailsEnum } from "~/core/enum/resource-details.enum";
import { SearchCardTypeEnum } from "~/core/enum/search-card-type.enum";
import { Resource } from "~/model/Resource.model";

interface SearchResourceProps {
  resource: Resource;
}

export const SearchResource: React.FC<SearchResourceProps> = ({ resource }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const type = (): SearchCardTypeEnum => {
    if (resource?.source) {
      switch (resource.source) {
        case "fr.openent.mediacentre.source.Moodle":
          return SearchCardTypeEnum.moodle;
        case "fr.openent.mediacentre.source.Signet":
          return SearchCardTypeEnum.book_mark;
        case "fr.openent.mediacentre.source.GAR":
          if (resource?.document_types?.includes("livre numérique")) {
            return SearchCardTypeEnum.manuals;
          }
          return SearchCardTypeEnum.external_resources;
        default:
          return SearchCardTypeEnum.manuals;
      }
    } else {
      return SearchCardTypeEnum.manuals;
    }
  };

  const copy = () => {
    console.log("copy");
  };
  const pin = () => {
    console.log("pin");
  };
  const fav = () => {
    console.log("fav");
  };
  const unfav = () => {
    console.log("unfav");
  };

  const toggleExpand = () => {
    console.log("test");
    setIsExpanded(!isExpanded);
  };

  const Type: React.FC<{ type: SearchCardTypeEnum }> = ({ type }) => {
    const IconComponent = IconMapping[type];

    return (
      <span className="med-search-resource-type">
        {type === SearchCardTypeEnum.moodle ? (
          <img
            src={IconMapping[type]}
            alt={t(`mediacentre.advanced.name.moodle`)}
            className="med-search-resource-icon"
          />
        ) : (
          <IconComponent className="med-search-resource-icon" />
        )}
        {t(SearchCardTitle[type])}
      </span>
    );
  };

  const Description: React.FC = () => {
    return (
      <div className="med-search-resource-description">
        <span className="med-search-resource-description-title">
          {t("mediacentre.description.title.description")}
        </span>
        <span className="med-search-resource-description-content">
          {resource.description}
        </span>
      </div>
    );
  };

  const Detail: React.FC<{
    type: ResourceDetailsEnum;
    list: string[] | undefined;
    separator: string;
  }> = ({ type, list, separator }) => {
    const IconComponent = IconMapping[type];
    const name = list && list.length > 1 ? type + "s" : type;
    return (
      <div className="med-search-resource-details-content">
        {IconComponent && (
          <IconComponent className="med-search-resource-details-icon" />
        )}
        <span className="med-search-resource-details-name">
          {t(`mediacentre.description.name.${name}`)}
        </span>
        <span className="med-search-resource-details-value">
          {list &&
            list.map((item, index) => {
              return (
                <span key={index}>
                  {<strong>{item}</strong>}
                  {index < list.length - 1 && separator}
                </span>
              );
            })}
        </span>
      </div>
    );
  };

  const Details: React.FC = () => {
    return (
      <div className="med-search-resource-details">
        <span className="med-search-resource-details-title">
          {t("mediacentre.description.title.details")}
        </span>
        <Detail
          type={ResourceDetailsEnum.authors}
          list={resource.authors}
          separator={" / "}
        />
        <Detail
          type={ResourceDetailsEnum.editors}
          list={resource.editors}
          separator={" / "}
        />
        <Detail
          type={ResourceDetailsEnum.disciplines}
          list={resource.disciplines}
          separator={" / "}
        />
        <Detail
          type={ResourceDetailsEnum.levels}
          list={resource.levels}
          separator={" / "}
        />
        <Detail
          type={ResourceDetailsEnum.keywords}
          list={
            typeof resource.plain_text === "string"
              ? [resource.plain_text]
              : resource.plain_text
          }
          separator={" / "}
        />
      </div>
    );
  };

  return (
    <Card
      isSelectable={false}
      isClickable={false}
      className={`med-search-resource-card ${
        isExpanded ? "expanded" : "not-expanded"
      }`}
    >
      <div className="med-search-resource-top-container">
        <div className="med-search-resource-left-container">
          {resource.image && (
            <img
              src={resource.image}
              alt="Resource"
              className="med-search-resource-image"
            />
          )}
        </div>
        <div className="med-search-resource-right-container">
          <Card.Body space={"0"}>
            <Type type={type()} />
            <Card.Title>{resource.title}</Card.Title>
            <Card.Text>{resource.editors && resource.editors[0]}</Card.Text>
          </Card.Body>
          <Card.Footer>
            <div
              className="med-footer-details"
              onClick={toggleExpand}
              onKeyDown={toggleExpand}
              aria-hidden="true"
            >
              <InfoOutlinedIcon className="med-footer-icon" />
              {t("mediacentre.description.button")}
              {isExpanded ? (
                <KeyboardArrowDownIcon className="med-footer-icon" />
              ) : (
                <KeyboardArrowRight className="med-footer-icon" />
              )}
            </div>
            <div className="med-footer-svg">
              <PushPinIcon className="med-pin" onClick={() => pin()} />
              <ContentCopyIcon className="med-link" onClick={() => copy()} />
              {resource.favorite ? (
                <StarIcon className="med-star" onClick={() => unfav()} />
              ) : (
                <StarBorderIcon className="med-star" onClick={() => fav()} />
              )}
            </div>
          </Card.Footer>
        </div>
      </div>
      <div className={`med-search-resource-bottom-container`}>
        {resource.description && <Description />}
        <Details />
      </div>
    </Card>
  );
};
