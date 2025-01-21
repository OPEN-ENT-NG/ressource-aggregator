import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useUser } from "@edifice.io/react";

import { SIGNET } from "~/core/const/sources.const";
import { useFavorite } from "~/hooks/useFavorite";
import { Favorite } from "~/model/Favorite.model";
import { Pin } from "~/model/Pin.model";
import { Signet } from "~/model/Signet.model";
import {
  useGetMyPublishedSignetsQuery,
  useGetMySignetsQuery,
  useGetPublishedSignetsQuery,
} from "~/services/api/signet.service";
import {
  convertDisciplines,
  convertKeyWords,
  convertLevels,
} from "~/utils/property.utils";
import { usePinProvider } from "./PinProvider";
import { SignetProviderContextType, SignetProviderProps } from "./types";

const SignetProviderContext = createContext<SignetProviderContextType | null>(
  null,
);

export const useSignet = () => {
  const context = useContext(SignetProviderContext);
  if (!context) {
    throw new Error(
      "useSignetProvider must be used within a SignetProviderProvider",
    );
  }
  return context;
};

export const SignetProvider: FC<SignetProviderProps> = ({ children }) => {
  const { user } = useUser();
  const { pins } = usePinProvider();
  const { data: publics } = useGetPublishedSignetsQuery(null);
  const { data: mySignets } = useGetMySignetsQuery(null);
  const { data: myPublishedSignetsData } = useGetMyPublishedSignetsQuery(null);
  const { favorites } = useFavorite();

  const [homeSignets, setHomeSignets] = useState<Signet[] | null>(null);
  const [allSignets, setAllSignets] = useState<Signet[] | null>(null);
  const [myPublishedSignets, setMyPublishedSignets] = useState<Signet[] | null>(
    null,
  );
  const [publicSignets, setPublicSignets] = useState<Signet[] | null>(null);

  // States for admin arborescence
  const [mine, setMine] = useState<Signet[] | null>(null);
  const [shared, setShared] = useState<Signet[] | null>(null);
  const [published, setPublished] = useState<Signet[] | null>(null);
  const [archived, setArchived] = useState<Signet[] | null>(null);

  const getHomeSignets = useCallback(() => {
    if (!allSignets) {
      return null;
    }

    return allSignets.filter(
      (signet: Signet) => signet.owner_id != user?.userId,
    );
  }, [allSignets, user?.userId]);

  const getAllSignets = useCallback(() => {
    if (!publics || !mySignets) {
      return null;
    }
    const publicSignetsData: Signet[] = publics?.data?.signets?.resources ?? [];
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
  }, [favorites, mySignets, publics, pins]);

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

  const getPublicSignets = useCallback(() => {
    if (!publics) {
      return null;
    }
    const publicSignetsData: Signet[] = publics?.data?.signets?.resources ?? [];
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
  }, [publics, favorites, pins]);

  useEffect(() => {
    setAllSignets(getAllSignets());
  }, [publics, mySignets, favorites, pins]);

  useEffect(() => {
    if (favorites && pins) {
      setHomeSignets(getHomeSignets());
    }
  }, [favorites, pins]);

  useEffect(() => {
    if (favorites && pins && myPublishedSignetsData) {
      setMyPublishedSignets(getMyPublishedSignets());
    }
  }, [favorites, pins, myPublishedSignetsData]);

  useEffect(() => {
    setPublicSignets(getPublicSignets());
  }, [publics, favorites, pins]);

  useEffect(() => {
    if (allSignets) {
      setMine(
        allSignets.filter(
          (signet: Signet) =>
            !signet.archived && signet.owner_id === user?.userId,
        ),
      );
      setShared(
        allSignets.filter(
          (signet: Signet) =>
            !signet.archived &&
            signet.collab &&
            signet.owner_id !== user?.userId,
        ),
      );
      setPublished(
        allSignets.filter(
          (signet: Signet) => !signet.archived && signet.published,
        ),
      );
      setArchived(allSignets.filter((signet: Signet) => signet.archived));
    }
  }, [allSignets]);

  const value = useMemo<SignetProviderContextType>(
    () => ({
      mine,
      shared,
      published,
      archived,
      allSignets,
      publicSignets,
      myPublishedSignets,
      homeSignets,
      setHomeSignets,
    }),
    [
      mine,
      shared,
      published,
      archived,
      allSignets,
      publicSignets,
      myPublishedSignets,
      homeSignets,
    ],
  );

  return (
    <SignetProviderContext.Provider value={value}>
      {children}
    </SignetProviderContext.Provider>
  );
};
