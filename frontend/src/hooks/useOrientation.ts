import { useEffect, useState } from "react";

import { useSignet } from "./useSignet";
import { Signet } from "~/model/Signet.model";
import { sortByAlphabet } from "~/utils/sortResources.util";

// same rule as the timeline Mediacentre widget: published signets
// whose document types contain "orientation" (computed in getPublicSignets)
export const useOrientation = () => {
  const { getPublicSignets } = useSignet();
  const [orientationSignets, setOrientationSignets] = useState<Signet[] | null>(
    null,
  );

  useEffect(() => {
    const publicSignets = getPublicSignets();
    if (publicSignets) {
      setOrientationSignets(
        sortByAlphabet(
          publicSignets.filter((signet: Signet) => signet.orientation),
        ) as Signet[],
      );
    }
  }, [getPublicSignets]);

  return { orientationSignets };
};
