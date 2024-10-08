import "./SearchCardDetails.scss";
import React from "react";

import { useTranslation } from "react-i18next";

import { SearchCardDetail } from "../search-card-detail/SearchCardDetail";
import { GAR } from "~/core/const/sources.const";
import { ResourceDetailsEnum } from "~/core/enum/resource-details.enum";
import { SearchResource } from "~/model/SearchResource.model";
import {
  convertDisciplines,
  convertKeyWords,
  convertLevels,
} from "~/utils/property.utils";

interface SearchCardDetailsProps {
  searchResource: SearchResource;
}
export const SearchCardDetails: React.FC<SearchCardDetailsProps> = ({
  searchResource,
}) => {
  const { t } = useTranslation("mediacentre");
  return (
    <div className="med-search-resource-details">
      <span className="med-search-resource-details-title">
        {t("mediacentre.description.title.details")}
      </span>
      <SearchCardDetail
        type={ResourceDetailsEnum.authors}
        list={searchResource.authors}
        separator={" / "}
      />
      <SearchCardDetail
        type={ResourceDetailsEnum.editors}
        list={searchResource.editors}
        separator={" / "}
      />
      <SearchCardDetail
        type={ResourceDetailsEnum.disciplines}
        list={convertDisciplines(searchResource.disciplines)}
        separator={" / "}
      />
      <SearchCardDetail
        type={ResourceDetailsEnum.levels}
        list={convertLevels(searchResource.levels)}
        separator={" / "}
      />
      <SearchCardDetail
        type={ResourceDetailsEnum.keywords}
        list={convertKeyWords(searchResource.plain_text)}
        separator={" / "}
      />
      {searchResource.source == GAR && (
        <SearchCardDetail
          type={ResourceDetailsEnum.ark}
          list={[searchResource.id as string]}
          separator={" / "}
        />
      )}
    </div>
  );
};
