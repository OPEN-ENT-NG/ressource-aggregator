import { useGetPinsQuery } from "../services/api/pins.service";

export const usePins = (idStructure: string) => {
  const {
    data: pins,
    error,
    isLoading,
    refetch: refetchPins,
  } = useGetPinsQuery(idStructure);

  return {
    pins,
    refetchPins,
    error,
    isLoading,
  };
};
