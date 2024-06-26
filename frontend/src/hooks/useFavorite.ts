import { useEffect, useState } from "react";

import { Favorite } from "./../model/Favorite.model";
import { useGetFavoriteQuery } from "./../services/api/favorite.service";

export const useFavorite = () => {
  const {
    data: favorite,
    error,
    isLoading,
    refetch: refetchFavorite,
  } = useGetFavoriteQuery(null);
  const [favorites, setFavorites] = useState<Favorite[] | null>(null);

  useEffect(() => {
    if (favorite) {
      let favoriteData: Favorite[] =
        favorite?.data?.length > 0 ? favorite.data : [] ?? [];
      favoriteData = favoriteData.map((favorite: Favorite) => ({
        ...favorite,
        favorite: true,
      }));
      setFavorites(favoriteData);
    }
  }, [favorite]);

  return { favorites, setFavorites, refetchFavorite, error, isLoading };
};
