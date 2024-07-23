import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { DropDown } from "../drop-down/DropDown";
import { useResourceListInfo } from "~/hooks/useResourceListInfo";
import { Resource } from "~/model/Resource.model";
import "./FilterLayout.scss";
import { sortByAlphabet } from "~/utils/sortResources.util";
import { ResourcesMap } from "~/model/ResourcesMap";
import { GAR, SIGNET } from "~/core/const/sources.const";

interface FilterLayoutProps {
  resources: Resource[] | null;
  setAllResourcesDisplayed: React.Dispatch<
    React.SetStateAction<Resource[] | null>
  >;
}

const filterBySources = (resources: ResourcesMap, sources: string[], SOURCES : {
  MANUALS: string;
  RESOURCES: string;
  SIGNETS: string;
  MOODLES: string;
}) => {
  if(!sources.length) {
    return [...sortByAlphabet(resources.textbooks), ...sortByAlphabet(resources.externalResources), ...sortByAlphabet(resources.signets), ...sortByAlphabet(resources.moodle)];
  }
  let filteredResources: Resource[] = [];
  if(sources.some(source => source === SOURCES.MANUALS)) {
    filteredResources = [...filteredResources, ...sortByAlphabet(resources.textbooks)];
  }
  if(sources.some(source => source === SOURCES.RESOURCES)) {
    filteredResources = [...filteredResources, ...sortByAlphabet(resources.externalResources)];
  }
  if(sources.some(source => source === SOURCES.SIGNETS)) {
    filteredResources = [...filteredResources, ...sortByAlphabet(resources.signets)];
  }
  if(sources.some(source => source === SOURCES.MOODLES)) {
    filteredResources = [...filteredResources, ...sortByAlphabet(resources.moodle)];
  }
  return filteredResources;
};

const filterByThemes = (resources: Resource[], themes: string[], 
  THEMES: {
    ORIENTATION: string;
    WITHOUT_THEME: string;
  }
) => {
  if(themes.length === 1) { // we filter only if one theme is selected
    return resources.filter((resource) => {
        if(resource.source !== SIGNET) { return true; } // we filter only signets
        if(themes[0] ===THEMES.ORIENTATION) {
          return resource.document_types.includes("Orientation");
        } 
        if(themes[0] === THEMES.WITHOUT_THEME) {
          return !resource.document_types.includes("Orientation");
        }
      }
    );
  }
  return resources;
}

const filterByTypes = (resources: Resource[], types: string[]) => {
  if(!types.length) {
    return resources;
  }
  return resources.filter((resource) => {
    if(resource.source !== GAR || resource.is_textbook) { return true; } // we filter only external resources
    return types.some(type => resource.document_types.includes(type));
  });
}

const filterByLevels = (resources: Resource[], levels: string[]) => {
  if(!levels.length) {
    return resources;
  }
  return resources.filter((resource) => levels.some(level => resource.levels.includes(level)));
}

const filterByDisciplines = (resources: Resource[], disciplines: string[]) => {
  if(!disciplines.length) {
    return resources;
  }
  return resources.filter((resource) => disciplines.some(discipline => resource.disciplines.includes(discipline)));
}


export const FilterLayout: React.FC<FilterLayoutProps> = ({
  resources,
  setAllResourcesDisplayed,
}) => {
  const { resourcesMap, resourcesInfosMap} = useResourceListInfo(resources);

  const page = useLocation().pathname;
  const { t } = useTranslation();

  const [sources, setSources] = useState<string[]>([]);
  const themes = [t("mediacentre.signets.themes.orientation"), t("mediacentre.signets.without.theme")];
  
  const [selectedCheckboxesSources, setSelectedCheckboxesSources] =
    useState<string[]>([]);
  const [selectedCheckboxesThemes, setSelectedCheckboxesThemes] =
    useState<string[]>([]);
  const [selectedCheckboxesLevels, setSelectedCheckboxesLevels] =
    useState<string[]>([]);
  const [selectedCheckboxesTypes, setSelectedCheckboxesTypes] =
    useState<string[]>([]);
  const [selectedCheckboxesDiscipline, setSelectedCheckboxesDiscipline] =
    useState<string[]>([]);

  const SOURCES = {
    MANUALS : t("mediacentre.sidebar.textbooks"),
    RESOURCES : t("mediacentre.sidebar.resources"),
    SIGNETS : t("mediacentre.sidebar.signets"),
    MOODLES : t("mediacentre.search.card.moodle")
  };

  const THEMES = {
    ORIENTATION : t("mediacentre.signets.themes.orientation"),
    WITHOUT_THEME : t("mediacentre.signets.without.theme")
  };

  useEffect(() => {
    if (!resources) {
      return;
    }

    let filteredResources: Resource[] = [];
    filteredResources = filterBySources(resourcesMap, selectedCheckboxesSources, SOURCES);
    filteredResources = filterByThemes(filteredResources, selectedCheckboxesThemes, THEMES);
    filteredResources = filterByTypes(filteredResources, selectedCheckboxesTypes);
    filteredResources = filterByLevels(filteredResources, selectedCheckboxesLevels);
    filteredResources = filterByDisciplines(filteredResources, selectedCheckboxesDiscipline);
    setAllResourcesDisplayed(filteredResources);
  }, [
    selectedCheckboxesSources,
    selectedCheckboxesThemes,
    selectedCheckboxesTypes,
    selectedCheckboxesDiscipline,
    selectedCheckboxesLevels,
    resourcesMap,
    resources,
    setAllResourcesDisplayed,
  ]);

  useEffect(() => {
    let sourcesTemp: string[] = [];
    if (resourcesMap.textbooks.length) {
      sourcesTemp = [...sourcesTemp, SOURCES.MANUALS];
    }
    if (resourcesMap.externalResources.length) {
      sourcesTemp = [...sourcesTemp, SOURCES.RESOURCES];
    }
    if (resourcesMap.signets.length) {
      sourcesTemp = [...sourcesTemp, SOURCES.SIGNETS];
    }
    if (resourcesMap.moodle.length) {
      sourcesTemp = [...sourcesTemp, SOURCES.MOODLES];
    }
    setSources(sourcesTemp);
  }, [
    resourcesMap,
  ]);

  return (
    <>
      <div className="med-filters">
        <DropDown
          selectedCheckboxes={selectedCheckboxesSources}
          setSelectedCheckboxes={setSelectedCheckboxesSources}
          checkboxOptions={sources ?? []}
          label={t("mediacentre.filter.source")}
        />
        {(selectedCheckboxesSources.includes(SOURCES.RESOURCES) || page === "/resources") && (
          <DropDown
            selectedCheckboxes={selectedCheckboxesTypes}
            setSelectedCheckboxes={setSelectedCheckboxesTypes}
            checkboxOptions={resourcesInfosMap.types ?? []}
            label={t("mediacentre.filter.type")}
          />
        )}
        {(selectedCheckboxesSources.includes(SOURCES.SIGNETS) || page === "/signets") && (
          <DropDown
            selectedCheckboxes={selectedCheckboxesThemes}
            setSelectedCheckboxes={setSelectedCheckboxesThemes}
            checkboxOptions={themes ?? []}
            label={t("mediacentre.filter.theme")}
          />
        )}
        <DropDown
          selectedCheckboxes={selectedCheckboxesLevels}
          setSelectedCheckboxes={setSelectedCheckboxesLevels}
          checkboxOptions={resourcesInfosMap.levels ?? []}
          label={t("mediacentre.filter.level")}
        />
        <DropDown
          selectedCheckboxes={selectedCheckboxesDiscipline}
          setSelectedCheckboxes={setSelectedCheckboxesDiscipline}
          checkboxOptions={resourcesInfosMap.disciplines ?? []}
          label={t("mediacentre.filter.discipline")}
        />
      </div>
    </>
  );
};
