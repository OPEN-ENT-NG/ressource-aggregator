import { useEffect, useState } from "react";

import { useSearchQuery } from "../services/api/search.service";
import { ExternalResource } from "~/model/ExternalResource.model";
import { SearchResultCategory } from "~/model/SearchResultCategory";
import { Resource } from "~/model/Resource.model";

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

  const {
    data,
    error,
    isLoading,
    refetch: refetchSearch,
  } = useSearchQuery(query);

  const [externalResources, setExternalResources] = useState<
    ExternalResource[]>([]);

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
  };

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
  };

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
  };

  useEffect(() => {
    if (data) {
      const searchResult: SearchResultCategory[] = data;
      const garResult = searchResult?.find(
        (result) => result?.data?.source == "fr.openent.mediacentre.source.GAR",
      );
      const garResources : Resource[] = garResult?.data?.resources;
      const externalResourcesData = garResources.filter(
        (resource) => resource?.is_textbook ?? false,
      ) as ExternalResource[];
      selectDisciplines(externalResourcesData);
      selectLevels(externalResourcesData);
      selectTypes(externalResourcesData);
      setExternalResources(externalResourcesData);
    }
  }, [data]);

  return {
    externalResources,
    setExternalResources,
    refetchSearch,
    disciplines,
    levels,
    types,
    error,
    isLoading,
  };
};
