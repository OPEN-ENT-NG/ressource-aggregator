import { useEffect, useState } from "react";

import { useFavorite } from "./useFavorite";
import { useGetTextbooksQuery } from "../services/api/textbook.service";
import { Favorite } from "~/model/Favorite.model";
import { Textbook } from "~/model/Textbook.model";

export const useTextbook = () => {
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const {
    data: textbook,
    error,
    isLoading,
    refetch: refetchTextbooks,
  } = useGetTextbooksQuery(null);
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const { favorites } = useFavorite();

  const TEXTBOOKS = [
    {
      "title": "Arts Plastisque 0771992X",
      "editors": [
          "C'est Ã  voir"
      ],
      "authors": [],
      "image": "https://vignette.validation.test-gar.education.fr/VAtest1/gar/115.png",
      "disciplines": [
          "français (cycle 3)"
      ],
      "levels": [],
      "document_types": [
          "livre numérique"
      ],
      "link": "https://sp-auth.validation.test-gar.education.fr/domaineGar?idENT=RU5UVEVTVDE=&idEtab=MDY1MDQ5OVAtRVQ2&idSrc=aHR0cDovL24ydC5uZXQvYXJrOi85OTk5OS9yMjB4eHh4eHh4eA==",
      "source": "fr.openent.mediacentre.source.GAR",
      "plain_text": "français (cycle 3) activité pédagogique matériel de référence ",
      "id": "http://n2t.net/ark:/99999/r20xxxxxxx0771992X",
      "favorite": false,
      "date": 1718612386810,
      "structure_name": "Etablissement Formation 25603                                                                       ",
      "structure_uai": "0771992X",
      "user": "7c740a91-7d5b-41f2-9b46-aed8cebf464e"
  },
  {
      "title": "Arts Plastisque 0772227C",
      "editors": [
          "C'est Ã  voir"
      ],
      "authors": [],
      "image": "https://vignette.validation.test-gar.education.fr/VAtest1/gar/115.png",
      "disciplines": [
          "français (cycle 3)"
      ],
      "levels": [],
      "document_types": [
          "livre numérique"
      ],
      "link": "https://sp-auth.validation.test-gar.education.fr/domaineGar?idENT=RU5UVEVTVDE=&idEtab=MDY1MDQ5OVAtRVQ2&idSrc=aHR0cDovL24ydC5uZXQvYXJrOi85OTk5OS9yMjB4eHh4eHh4eA==",
      "source": "fr.openent.mediacentre.source.GAR",
      "plain_text": "français (cycle 3) activité pédagogique matériel de référence ",
      "id": "http://n2t.net/ark:/99999/r20xxxxxxx0772227C",
      "favorite": false,
      "date": 1718612386810,
      "structure_name": "Etablissement Formation 15613                                                                       ",
      "structure_uai": "0772227C",
      "user": "7c740a91-7d5b-41f2-9b46-aed8cebf464e"
  },
  {
      "title": "Arts Plastisque 0771519H",
      "editors": [
          "C'est Ã  voir"
      ],
      "authors": [],
      "image": "https://vignette.validation.test-gar.education.fr/VAtest1/gar/115.png",
      "disciplines": [
          "français (cycle 3)"
      ],
      "levels": [],
      "document_types": [
          "livre numérique"
      ],
      "link": "https://sp-auth.validation.test-gar.education.fr/domaineGar?idENT=RU5UVEVTVDE=&idEtab=MDY1MDQ5OVAtRVQ2&idSrc=aHR0cDovL24ydC5uZXQvYXJrOi85OTk5OS9yMjB4eHh4eHh4eA==",
      "source": "fr.openent.mediacentre.source.GAR",
      "plain_text": "français (cycle 3) activité pédagogique matériel de référence ",
      "id": "http://n2t.net/ark:/99999/r20xxxxxxx0771519H",
      "favorite": false,
      "date": 1718612386810,
      "structure_name": "Etablissement Formation 14351                                                                       ",
      "structure_uai": "0771519H",
      "user": "7c740a91-7d5b-41f2-9b46-aed8cebf464e"
  }
  ]

  const selectDisciplines = (textbooks: Textbook[]) => {
    const disciplines: string[] = [];

    textbooks.forEach((textbook) => {
      if (textbook.disciplines) {
        textbook.disciplines.forEach((discipline) => {
          if (!disciplines.includes(discipline)) {
            disciplines.push(discipline);
          }
        });
      }
    });

    setDisciplines(disciplines);
  };

  const selectLevels = (textbooks: Textbook[]) => {
    const levels: string[] = [];

    textbooks.forEach((textbook) => {
      if (textbook.levels) {
        textbook.levels.forEach((level) => {
          if (!levels.includes(level)) {
            levels.push(level);
          }
        });
      }
    });

    setLevels(levels);
  };

  useEffect(() => {
    if (favorites) {
      let textbookData: Textbook[] = TEXTBOOKS ?? []; // textbook?.data?.textbooks
      textbookData = textbookData.map((textbook: Textbook) => ({
        ...textbook,
        favorite: favorites.some((fav: Favorite) => fav.id === textbook.id),
      }));
      selectDisciplines(textbookData);
      selectLevels(textbookData);

      setTextbooks(textbookData);
    }
  }, [textbook, favorites]);

  return {
    textbooks,
    setTextbooks,
    refetchTextbooks,
    disciplines,
    levels,
    error,
    isLoading,
  };
};
