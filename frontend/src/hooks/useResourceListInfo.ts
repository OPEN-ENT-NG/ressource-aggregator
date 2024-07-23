import { useEffect, useState } from "react";
import { GAR, MOODLE, SIGNET } from "~/core/const/sources.const";

import { Resource } from "~/model/Resource.model";
import { ResourceInfosMap } from "~/model/ResourceInfosMap";
import { ResourcesMap } from "~/model/ResourcesMap";


const ResourcesMapInitialStates : ResourcesMap = { textbooks: [], externalResources: [], moodle: [], signets: [] };
const ResourceInfosMapInitialStates : ResourceInfosMap = { disciplines: [], levels: [], types: [] };

const isTextbook = (resource: Resource) =>
  resource.source === GAR &&
  (resource?.is_textbook ?? false);
const isExternalResource = (resource: Resource) =>
  resource.source === GAR &&
  (!resource?.is_textbook ?? true);
const isMoodle = (resource: Resource) =>
  resource.source === MOODLE;
const isSignet = (resource: Resource) =>
  resource.source === SIGNET;

// this kook get all information about a list of resources and it's used in the FilterLayout component
export const useResourceListInfo = (resources: Resource[] | null) => {
  const [resourcesMap, setResourcesMap] = useState(ResourcesMapInitialStates);

  const [resourcesInfosMap, setResourcesInfosMap] = useState(ResourceInfosMapInitialStates);

  useEffect(() => {
    if (!resources) return;

    let textbooksTemp : Resource[] = [];
    let externalResourcesTemp : Resource[] = [];
    let moodleTemp : Resource[] = [];
    let signetsTemp : Resource[] = [];

    let disciplinesTemp : string[] = [];
    let levelsTemp : string[] = [];
    let typesTemp : string[] = [];


    resources.forEach((resource) => {
      // Case textbook
      if (isTextbook(resource)) {
        textbooksTemp = [...textbooksTemp, resource];
      }
      // Case external resource
      else if (isExternalResource(resource)) {
        externalResourcesTemp = [...externalResourcesTemp, resource];
        resource.document_types.forEach((type) => {
          if (!typesTemp.includes(type)) typesTemp = [...typesTemp, type]; // we want types only from external resources
        });
      }
      // Case moodle
      else if (isMoodle(resource)) {
        moodleTemp = [...moodleTemp, resource];
      }
      // Case signet
      else if (isSignet(resource)) {
        signetsTemp = [...signetsTemp, resource];
      }
      resource.disciplines.forEach((discipline) => {
        if (!disciplinesTemp.includes(discipline))
          disciplinesTemp = [...disciplinesTemp, discipline]; // we want disciplines from all resources
      });
      resource.levels.forEach((level) => {
        if (!levelsTemp.includes(level)) levelsTemp = [...levelsTemp, level]; // we want levels from all resources
      });
    });

    setResourcesMap({
      textbooks: textbooksTemp,
      externalResources: externalResourcesTemp,
      moodle: moodleTemp,
      signets: signetsTemp,
    });

    setResourcesInfosMap({
      disciplines: disciplinesTemp,
      levels: levelsTemp,
      types: typesTemp,
    });
  }, [resources]);

  return {
    resourcesMap,
    resourcesInfosMap,
  };
};
