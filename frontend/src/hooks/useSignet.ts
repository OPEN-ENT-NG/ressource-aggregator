import { useEffect, useState } from "react";

import { Signet } from "./../model/Signet.model";
import {
  useGetPublishedSignetsQuery,
  useGetMySignetsQuery,
} from "./../services/api/signet.service";

export const useSignet = () => {
  const {
    data: publicSignets,
    error: publicSignetError,
    isLoading: publicSignetIsLoading,
  } = useGetPublishedSignetsQuery(null);
  const {
    data: mySignets,
    error: mySignetError,
    isLoading: mySignetIsLoading,
  } = useGetMySignetsQuery(null);
  const [homeSignets, setHomeSignets] = useState<Signet[]>([]);

  useEffect(() => {
    const publicSignetsData = publicSignets?.data?.resources
      ? publicSignets.data.resources
      : [];
    const mySignetsData = mySignets ? mySignets : [];
    setHomeSignets([...publicSignetsData, ...mySignetsData]);
  }, [publicSignets, mySignets]);

  return {
    homeSignets,
    publicSignetError,
    publicSignetIsLoading,
    mySignetError,
    mySignetIsLoading,
  };
};
