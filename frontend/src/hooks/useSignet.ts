import { useCallback, useEffect, useState } from "react";

import { useUser } from "@edifice.io/react";

import { Signet } from "./../model/Signet.model";
import {
  useGetPublishedSignetsQuery,
  useGetMySignetsQuery,
  useGetMyPublishedSignetsQuery,
} from "./../services/api/signet.service";
import { useFavorite } from "./useFavorite";
import { SIGNET } from "~/core/const/sources.const";
import { Favorite } from "~/model/Favorite.model";
import { Pin } from "~/model/Pin.model";
import { usePinProvider } from "~/providers/PinProvider";
import {
  convertDisciplines,
  convertKeyWords,
  convertLevels,
} from "~/utils/property.utils";

export const useSignet = () => {
  const { user } = useUser();
  const { pins } = usePinProvider();
  const { data: publicSignets } = useGetPublishedSignetsQuery(null);
  const { data: mySignets } = useGetMySignetsQuery(null);
  const { data: myPublishedSignetsData } = useGetMyPublishedSignetsQuery(null);
  const [homeSignets, setHomeSignets] = useState<Signet[] | null>(null);
  const [allSignets, setAllSignets] = useState<Signet[] | null>(null);
  const [myPublishedSignets, setMyPublishedSignets] = useState<Signet[] | null>(
    null,
  );
  const { favorites } = useFavorite();

  const getHomeSignets = useCallback(() => {
    if (!allSignets) {
      return null;
    }

    return allSignets.filter(
      (signet: Signet) => signet.owner_id != user?.userId,
    );
  }, [allSignets, user?.userId]);

  const getMyPublishedSignets = useCallback(() => {
    if (!myPublishedSignetsData) {
      return null;
    }
    const signetsData = myPublishedSignetsData?.resources ?? [];
    let updatedMyPublishedSignetsData: Signet[] = signetsData.map(
      (signet: Signet) => ({
        ...signet,
        source: SIGNET,
        disciplines: convertDisciplines(signet.disciplines),
        levels: convertLevels(signet.levels),
        plain_text: convertKeyWords(signet.plain_text),
        published: true,
      }),
    );
    if (favorites) {
      updatedMyPublishedSignetsData = updatedMyPublishedSignetsData.map(
        (signet: Signet) => ({
          ...signet,
          favorite: favorites.some((fav: Favorite) =>
            signet?.id
              ? fav?.id?.toString() === signet?.id
              : fav?.id?.toString() === signet?._id,
          ),
        }),
      );
    }
    if (pins) {
      updatedMyPublishedSignetsData = updatedMyPublishedSignetsData.map(
        (signet: Signet) => ({
          ...signet,
          is_pinned: pins.some(
            (pin: Pin) =>
              pin?.id?.toString() == signet?.id?.toString() &&
              pin.source === SIGNET,
          ),
        }),
      );
    }
    return updatedMyPublishedSignetsData;
  }, [myPublishedSignetsData, favorites, pins]);

  const getAllSignets = useCallback(() => {
    if (!publicSignets || !mySignets) {
      return null;
    }
    const publicSignetsData: Signet[] =
      publicSignets?.data?.signets?.resources ?? [];
    const updatedMySignetsData: Signet[] = mySignets.map((signet: Signet) => ({
      ...signet,
      source: SIGNET,
      disciplines: convertDisciplines(signet.disciplines),
      levels: convertLevels(signet.levels),
      plain_text: convertKeyWords(signet.plain_text),
      published: false,
      collab: !!signet?.shared?.length,
    }));
    const updatedPublicSignetsData: Signet[] = publicSignetsData.map(
      (signet: Signet) => ({
        ...signet,
        orientation: signet?.document_types?.some((type) =>
          type.toLowerCase().includes("orientation"),
        ),
        source: SIGNET,
        published: true,
      }),
    );
    let signetsData: Signet[] = [
      ...updatedPublicSignetsData,
      ...updatedMySignetsData,
    ];
    if (favorites) {
      signetsData = signetsData.map((signet: Signet) => ({
        ...signet,
        favorite: favorites.some((fav: Favorite) =>
          fav.source === SIGNET && signet?.id
            ? fav?.id?.toString() === signet?.id.toString()
            : fav?.id?.toString() === signet?._id?.toString(),
        ),
      }));
    }
    if (pins) {
      signetsData = signetsData.map((signet: Signet) => ({
        ...signet,
        is_pinned: pins.some(
          (pin: Pin) =>
            pin?.id?.toString() == signet?.id?.toString() &&
            pin.source === SIGNET,
        ),
      }));
    }
    return signetsData;
  }, [favorites, mySignets, publicSignets, pins]);

  const getPublicSignets = useCallback(() => {
    if (!publicSignets) {
      return null;
    }
    const publicSignetsData: Signet[] =
      publicSignets?.data?.signets?.resources ?? [];
    let updatedPublicSignetsData: Signet[] = publicSignetsData.map(
      (signet: Signet) => ({
        ...signet,
        orientation: signet?.document_types?.some((type) =>
          type.toLowerCase().includes("orientation"),
        ),
        source: SIGNET,
        published: true,
      }),
    );
    if (favorites) {
      updatedPublicSignetsData = updatedPublicSignetsData.map(
        (signet: Signet) => ({
          ...signet,
          favorite: favorites.some((fav: Favorite) =>
            fav.source === SIGNET && signet?.id
              ? fav?.id?.toString() === signet?.id.toString()
              : fav?.id?.toString() === signet?._id?.toString(),
          ),
        }),
      );
    }
    if (pins) {
      updatedPublicSignetsData = updatedPublicSignetsData.map(
        (signet: Signet) => ({
          ...signet,
          is_pinned: pins.some(
            (pin: Pin) =>
              pin?.id?.toString() == signet?.id?.toString() &&
              pin.source === SIGNET,
          ),
        }),
      );
    }
    return updatedPublicSignetsData;
  }, [publicSignets, favorites, pins]);

  useEffect(() => {
    if (favorites && pins) {
      const signetsData = getHomeSignets();
      setHomeSignets(signetsData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSignets, favorites, pins]);

  useEffect(() => {
    if (favorites && pins) {
      const signetsData = getAllSignets();
      setAllSignets(signetsData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicSignets, mySignets, user?.userId, favorites, pins]);

  useEffect(() => {
    if (favorites && pins && myPublishedSignetsData) {
      const signetsData = getMyPublishedSignets();
      setMyPublishedSignets(signetsData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myPublishedSignetsData, favorites, pins]);

  const mine = (signets: Signet[]) => {
    return signets.filter(
      (signet: Signet) => !signet.archived && signet.owner_id === user?.userId,
    );
  };

  const shared = (signets: Signet[]) => {
    return signets.filter(
      (signet: Signet) =>
        !signet.archived && signet.collab && signet.owner_id !== user?.userId,
    );
  };

  const published = (signets: Signet[]) => {
    return signets.filter(
      (signet: Signet) => !signet.archived && signet.published,
    );
  };

  const archived = (signets: Signet[]) => {
    return signets.filter((signet: Signet) => signet.archived);
  };

  return {
    homeSignets,
    setHomeSignets,
    getHomeSignets,
    allSignets,
    setAllSignets,
    mine,
    shared,
    published,
    archived,
    myPublishedSignets,
    getPublicSignets,
  };
};
