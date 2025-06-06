import { useCallback, useEffect, useState } from "react";

import { GAR, GLOBAL, MOODLE, SIGNET } from "~/core/const/sources.const";
import { STRING } from "~/core/const/typescript.const";
import { ExternalResource } from "~/model/ExternalResource.model";
import { GlobalResource } from "~/model/GlobalResource.model";
import { Moodle } from "~/model/Moodle.model";
import { Resource } from "~/model/Resource.model";
import { ResourceInfosMap } from "~/model/ResourceInfosMap";
import { ResourcesMap } from "~/model/ResourcesMap";
import { Signet } from "~/model/Signet.model";
import { Textbook } from "~/model/Textbook.model";

const ResourcesMapInitialStates: ResourcesMap = {
  textbooks: [],
  externalResources: [],
  moodle: [],
  signets: [],
  global: [],
};
const ResourceInfosMapInitialStates: ResourceInfosMap = {
  disciplines: [],
  levels: [],
  types: [],
};

// Normalize string to avoid accent and case issues
const normalizeString = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

// custom sort function for strings that normalizes the strings before comparing them
const customStringSort = (a: string, b: string) =>
  normalizeString(a).localeCompare(normalizeString(b));

const isTextbook = (resource: Resource) =>
  resource.source === GAR && (resource?.is_textbook ?? false);
const isExternalResource = (resource: Resource) =>
  resource.source === GAR && (!resource?.is_textbook ?? true);
const isMoodle = (resource: Resource) => resource.source === MOODLE;
const isSignet = (resource: Resource) => resource.source === SIGNET;
const isGlobalResource = (resource: Resource) => resource.source === GLOBAL;

// this kook get all information about a list of resources and it's used in the FilterLayout component
export const useResourceListInfo = (resources: Resource[] | null) => {
  const [resourcesMap, setResourcesMap] = useState(ResourcesMapInitialStates);

  const [resourcesInfosMap, setResourcesInfosMap] = useState(
    ResourceInfosMapInitialStates,
  );

  const getResourcesMap = useCallback((resources: Resource[]) => {
    const result = resources.reduce(
      (acc, resource) => {
        // Case textbook
        if (isTextbook(resource)) {
          acc.textbooks = [...acc.textbooks, resource];
        }
        // Case external resource
        if (isExternalResource(resource)) {
          acc.externalResources = [...acc.externalResources, resource];
          acc.types =
            resource?.document_types?.reduce((accumulatedTypes, type) => {
              const typeToAdd = Array.isArray(type) ? type[1] : type;
              if (!accumulatedTypes.includes(typeToAdd)) {
                accumulatedTypes.push(typeToAdd);
              }
              return accumulatedTypes;
            }, acc.types) ?? [];
        }
        // Case moodle
        if (isMoodle(resource)) {
          acc.moodle = [...acc.moodle, resource];
        }
        // Case signet
        if (isSignet(resource)) {
          acc.signets = [...acc.signets, resource];
        }

        // Case global resource
        if (isGlobalResource(resource)) {
          acc.global = [...acc.global, resource];
        }

        acc.disciplines =
          resource?.disciplines?.reduce(
            (accumulatedDisciplines, discipline) => {
              const disciplineToAdd = Array.isArray(discipline)
                ? discipline[1]
                : discipline;
              if (!accumulatedDisciplines.includes(disciplineToAdd)) {
                accumulatedDisciplines.push(disciplineToAdd);
              }
              return accumulatedDisciplines;
            },
            acc.disciplines,
          ) ?? [];
        acc.levels =
          resource?.levels?.reduce((accumulatedLevels, level) => {
            const levelToAdd = Array.isArray(level) ? level[1] : level;
            if (!accumulatedLevels.includes(levelToAdd)) {
              accumulatedLevels.push(levelToAdd);
            }
            return accumulatedLevels;
          }, acc.levels) ?? [];

        return acc;
      },
      {
        textbooks: [] as Resource[],
        externalResources: [] as Resource[],
        moodle: [] as Resource[],
        signets: [] as Resource[],
        global: [] as Resource[],
        disciplines: [] as string[],
        levels: [] as string[],
        types: [] as string[],
      },
    );
    return result;
  }, []);

  useEffect(() => {
    if (!resources) return;

    const result = getResourcesMap(resources);
    setResourcesMap({
      textbooks: result.textbooks as Textbook[],
      externalResources: result.externalResources as ExternalResource[],
      moodle: result.moodle as Moodle[],
      signets: result.signets as Signet[],
      global: result.global as GlobalResource[],
    });
    setResourcesInfosMap({
      // sort disciplines, levels and types by custom string sort
      disciplines: result.disciplines
        .filter(
          (discipline) =>
            typeof discipline === STRING && discipline.trim() !== "",
        )
        .sort(customStringSort),
      levels: result.levels
        .filter((level) => typeof level === STRING && level.trim() !== "")
        .sort(customStringSort),
      types: result.types
        .filter((type) => type.trim() !== "")
        .sort(customStringSort),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resources]);

  return {
    resourcesMap,
    resourcesInfosMap,
    getResourcesMap,
  };
};
