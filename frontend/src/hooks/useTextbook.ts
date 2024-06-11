import { useEffect, useState } from "react";

import { useFavorite } from "./useFavorite";
import { useGetTextbooksQuery } from "../services/api/textbook.service";
import { ExternalResource } from "~/model/ExternalResource.model";
import { Favorite } from "~/model/Favorite.model";
import { Textbook } from "~/model/Textbook.model";

export const useTextbook = () => {
  const { data: textbook, error, isLoading } = useGetTextbooksQuery(null);
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [externalResources, setExternalResources] = useState<
    ExternalResource[]
  >([]);
  const { favorites } = useFavorite();

  useEffect(() => {
    if (favorites) {
      let garData: Textbook[] = textbook?.data?.textbooks ?? [];
      garData = garData.map((textbook: Textbook) => ({
        ...textbook,
        favorite: favorites.some((fav: Favorite) => fav.id === textbook.id),
      }));
      const textbookData = garData.filter(
        (textbook: Textbook) =>
          textbook.document_types?.includes("livre numérique") ?? false,
      );
      const externalResourceData = garData.filter(
        (externalResource: ExternalResource) =>
          externalResource.document_types?.includes("site web") ?? false,
      );
      setTextbooks(textbookData);
      setExternalResources(externalResourceData);
    }
  }, [textbook, favorites]);

  return {
    textbooks,
    setTextbooks,
    externalResources,
    setExternalResources,
    error,
    isLoading,
  };
};
