import { useEffect, useState } from "react";

import { useFavorite } from "./useFavorite";
import { useSearchQuery } from "../services/api/search.service";
import { SearchResultCategory } from "~/model/SearchResultCategory";
import { Resource } from "~/model/Resource.model";

export const useSearch = (query: any) => {
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const { favorites } = useFavorite();
  const {
    data,
    error,
    isLoading,
    refetch: refetchSearch,
  } = useSearchQuery(query);

  const selectDisciplines = (
    resources: Resource[],
  ) => {
    const disciplines: string[] = [];

    resources.forEach((item) => {
      item.disciplines?.forEach((discipline) => {
        if (!disciplines.includes(discipline)) {
          disciplines.push(discipline);
        }
      });
    });

    setDisciplines(disciplines);
  };

  const selectLevels = (
    resources: Resource[],
  ) => {
    const levels: string[] = [];

    resources.forEach((item) => {
      item.levels?.forEach((level) => {
        if (!levels.includes(level)) {
          levels.push(level);
        }
      });
    }
    );
    setLevels(levels);
  };

  const selectTypes = (resources: Resource[]) => {
    const types: string[] = [];

    
    resources.forEach((item) => {
      if (item.source === "fr.openent.mediacentre.source.GAR" && !item.is_textbook) {    // add only external resources types
        item.document_types?.forEach((type) => {
          if (!types.includes(type)) {
            types.push(type);
          }
        }
      );}});

    setTypes(types);
  };

  useEffect(() => {
    if (!isLoading) {
      const searchResult: SearchResultCategory[] = data;

      const signets = searchResult?.find(
        (result) =>
          result?.data?.source == "fr.openent.mediacentre.source.Signet",
      );
      const moodle = searchResult?.find(
        (result) =>
          result?.data?.source == "fr.openent.mediacentre.source.Moodle",
      );
      const gar = searchResult?.find(
        (result) => result?.data?.source == "fr.openent.mediacentre.source.GAR",
      );
      setAllResources([...signets?.data?.resources, ...moodle?.data?.resources, ...gar?.data?.resources])
      
      selectDisciplines(allResources);
      selectLevels(allResources);
      selectTypes(allResources);
    }
  }, [data, isLoading, favorites]);

  return {
    allResources,
    disciplines,
    levels,
    types,
    error,
    isLoading,
    refetchSearch,
  };
};
