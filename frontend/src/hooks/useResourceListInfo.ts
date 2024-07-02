import { useEffect, useState } from "react";

import { Resource } from "~/model/Resource.model";

export const useResourceListInfo = (resources : Resource[]) => {
    const [textbooks, setTextbooks] = useState<Resource[]>([]);
    const [externalResources, setExternalResources] = useState<Resource[]>([]);
    const [moodle, setMoodle] = useState<Resource[]>([]);
    const [signets, setSignets] = useState<Resource[]>([]);

    const [containTextbook, setContainTextbook] = useState<boolean>(false);
    const [containExternalResource, setContainExternalResource] = useState<boolean>(false);
    const [containMoodle, setContainMoodle] = useState<boolean>(false);
    const [containSignet, setContainSignet] = useState<boolean>(false);

  useEffect(() => {
      for (let i = 0; i < resources.length; i++) {
          switch (resources[i].source) {
              case "fr.openent.mediacentre.source.GAR":
                  if (resources[i].is_textbook) {
                      setTextbooks([...textbooks, resources[i]]);
            }
            else {
                setExternalResources([...externalResources, resources[i]]);
            }
            break;
        case "fr.openent.mediacentre.source.Moodle":
            setMoodle([...moodle, resources[i]]);
            break;
        case "fr.openent.mediacentre.source.Signet":
            setSignets([...signets, resources[i]]);
            break;
        }
    }
    setContainTextbook(textbooks.length > 0);
    setContainExternalResource(externalResources.length > 0);
    setContainMoodle(moodle.length > 0);
    setContainSignet(signets.length > 0);
  }, [resources]);

  return {
    textbooks,
    externalResources,
    moodle,
    signets,
    containTextbook,
    containExternalResource,
    containMoodle,
    containSignet,
  };
};
