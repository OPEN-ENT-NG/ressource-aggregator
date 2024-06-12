import { useEffect, useState } from "react";

import { useFavorite } from "./useFavorite";
import { useSearchQuery } from "../services/api/search.service";
import { Favorite } from "~/model/Favorite.model";
import { SearchResultCategory } from "~/model/SearchResultCategory";
import { ExternalResource } from "~/model/ExternalResource.model";

export const useExternalResource = () => {
  const query = {
    state: "PLAIN_TEXT",
      data: {
        query: ".*",
      },
      event: "search",
      sources: ["fr.openent.mediacentre.source.GAR"],
    };

  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  const { data, error, isLoading } = useSearchQuery(query);

  const [externalResources, setExternalResources] = useState<ExternalResource[]>([]);
  const { favorites } = useFavorite();

  const selectDisciplines = (externalResources: ExternalResource[]) => {
    const disciplines: string[] = [];

    externalResources.forEach((externalResource) => {
      if (externalResource.disciplines) {
        externalResource.disciplines.forEach((discipline) => {
          if (!disciplines.includes(discipline)) {
            disciplines.push(discipline);
          }
        });
      }
    });

    setDisciplines(disciplines);
  }

  const selectLevels = (externalResources: ExternalResource[]) => {
    const levels: string[] = [];

    externalResources.forEach((externalResource) => {
      if (externalResource.levels) {
        externalResource.levels.forEach((level) => {
          if (!levels.includes(level)) {
            levels.push(level);
          }
        });
      }
    });

    setLevels(levels);
  }

  const selectTypes = (externalResources: ExternalResource[]) => {
    const types: string[] = [];

    externalResources.forEach((externalResource) => {
      if (externalResource.document_types) {
        externalResource.document_types.forEach((type) => {
          if (!types.includes(type)) {
            types.push(type);
          }
        });
      }
    });

    setTypes(types);
  }

  useEffect(() => {
    if (!isLoading) {
      const searchResult: SearchResultCategory[] = data;
      const gar = searchResult?.find(
        (result) => result?.data?.source == "fr.openent.mediacentre.source.GAR",
      );
      const externalResources: ExternalResource[] = gar?.data?.resources || [];
      if(favorites) {
        externalResources.forEach((externalResource: ExternalResource) => {
          externalResource.favorite = favorites.some((fav: Favorite) => fav.id === externalResource.id);
        });
      }
      selectDisciplines(externalResources);
      selectLevels(externalResources);
      selectTypes(externalResources);

      setExternalResources(externalResources);
    }
  }, [externalResources, favorites]);

  return { externalResources, setExternalResources, disciplines, levels, types, error, isLoading };
};
