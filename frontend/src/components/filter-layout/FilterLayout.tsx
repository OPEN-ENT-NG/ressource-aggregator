import React, { useCallback, useEffect, useState } from "react";

import { Checkbox } from "@edifice-ui/react";
import "./FilterLayout.scss";

import { Resource } from "~/model/Resource.model";
import { useResourceListInfo } from "~/hooks/useResourceListInfo";
import { MutliCheckbox } from "../multi-checkbox/MultiCheckbox";

interface FilterLayoutProps {
  resources: Resource[];
  disciplines: string[];
  levels: string[];
  types: string[];
  setAllResourcesDisplayed: React.Dispatch<
    React.SetStateAction<Resource[]>
  >;
}

export const FilterLayout: React.FC<FilterLayoutProps> = ({
  resources,
  disciplines,
  levels,
  types,
  setAllResourcesDisplayed,
}) => {
  const {
    textbooks,
    externalResources,
    signets,
    moodle,
    containTextbook,
    containExternalResource,
    containSignet,
    containMoodle,
  } = useResourceListInfo(resources);

  // these useStates are used to store the state of the checkboxes
  const [checkboxTextbook, setCheckboxTextbook] = useState<boolean>(containTextbook);
  const [checkboxExternalResource, setCheckboxExternalResource] = useState<boolean>(containExternalResource);
  const [checkboxSignet, setCheckboxSignet] = useState<boolean>(containSignet);
  const [checkboxMoodle, setCheckboxMoodle] = useState<boolean>(containMoodle);
  const [selectedCheckboxesLevels, setSelectedCheckboxesLevels] =
    useState<string[]>(levels);
  const [selectedCheckboxesTypes, setSelectedCheckboxesTypes] =
    useState<string[]>(types);
  const [selectedCheckboxesDiscipline, setSelectedCheckboxesDiscipline] =
    useState<string[]>(disciplines);


  const fetchFilters = useCallback(() => {
    if (!resources) {
      return;
    }

    let filteredResources = []
    // first part we filter by single check (textbook, external resource, signet, moodle)
    if (checkboxTextbook) {
      filteredResources.push(...textbooks);
    }
    if (checkboxExternalResource) {
      filteredResources.push(...externalResources);
    }
    if (checkboxSignet) {
      filteredResources.push(...signets);
    }
    if (checkboxMoodle) {
      filteredResources.push(...moodle);
    }
    // second part we filter by multiple check (discipline, level, type)
    filteredResources = filteredResources.filter((resource) => {
      const matchesDiscipline =
          resource?.disciplines &&
          disciplines.some((discipline) =>
            resource.disciplines.includes(discipline),
          );
        const matchesLevel =
          resource?.levels &&
          levels.some((level) => resource.levels.includes(level));
        const matchesType =
          resource?.document_types &&
          types.some((type) => resource.document_types.includes(type));
        return matchesDiscipline || matchesLevel || matchesType;
    })

    setAllResourcesDisplayed(filteredResources);
  }, [
    checkboxSignet,
    checkboxMoodle,
    checkboxExternalResource,
    checkboxTextbook,
    selectedCheckboxesDiscipline,
    selectedCheckboxesLevels,
    selectedCheckboxesTypes,
    resources,
    setAllResourcesDisplayed,
  ]);

  // useEffect(() => {
  //   if (!resources) {
  //     return;
  //   }
  //   setCheckboxExternalResource()
  //   if (resources?.external_resources?.length > 0) {
  //     setCheckboxResource(true);
  //   } else {
  //     setCheckboxResource(false);
  //   }
  //   if (resources?.signets?.length > 0) {
  //     setCheckboxSignet(true);
  //   } else {
  //     setCheckboxSignet(false);
  //   }
  //   if (resources?.moodle?.length > 0) {
  //     setCheckboxMoodle(true);
  //   } else {
  //     setCheckboxMoodle(false);
  //   }
  //   setSelectedCheckboxesDiscipline(disciplines);
  //   setSelectedCheckboxesLevels(levels);
  //   setSelectedCheckboxesTypes(types);
  // }, [resources, disciplines, levels, types, resourcesNotEmpty]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters, resources]);

  return (
    <>
      <div className="med-filters">
      <Checkbox
          checked={checkboxTextbook}
          label="Manuels"
          onChange={() => setCheckboxTextbook((isChecked) => !isChecked)}
        />
        <Checkbox
          checked={checkboxExternalResource}
          label="Ressources"
          onChange={() => setCheckboxExternalResource((isChecked) => !isChecked)}
        />
        {checkboxExternalResource && (
          <MutliCheckbox
            selectedCheckboxes={selectedCheckboxesTypes}
            setSelectedCheckboxes={setSelectedCheckboxesTypes}
            checkboxOptions={types ?? []}
            label="Type"
          />
        )}
        <MutliCheckbox
          selectedCheckboxes={selectedCheckboxesLevels}
          setSelectedCheckboxes={setSelectedCheckboxesLevels}
          checkboxOptions={levels ?? []}
          label="Niveaux"
        />
        <MutliCheckbox
          selectedCheckboxes={selectedCheckboxesDiscipline}
          setSelectedCheckboxes={setSelectedCheckboxesDiscipline}
          checkboxOptions={disciplines ?? []}
          label="Disciplines"
        />
        <Checkbox
          checked={checkboxSignet}
          label="Signets"
          onChange={() => setCheckboxSignet((isChecked) => !isChecked)}
        />
        <Checkbox
          checked={checkboxMoodle}
          label="Moodle"
          onChange={() => setCheckboxMoodle((isChecked) => !isChecked)}
        />
      </div>
    </>
  );
};
