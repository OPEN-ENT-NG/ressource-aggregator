import { ListCardType } from "../enum/list-card-type";
import { NbColumns } from "~/model/NbColumns.tsx";
import { NbComponents } from "~/model/NbComponents.tsx";

export const NbColumnsListCard = {
  [ListCardType.favorites]: new NbColumns(1, 2, 3),
  [ListCardType.manuals]: new NbColumns(2, 4, 6),
  [ListCardType.util_links]: new NbColumns(2, 4, 6),
};

export const NbComponentsListCard = {
  [ListCardType.favorites]: new NbComponents(3, 6, 9),
  [ListCardType.manuals]: new NbComponents(4, 4, 6),
  [ListCardType.util_links]: new NbComponents(4, 4, 6),
};

export const TitleListCard = {
  [ListCardType.favorites]: "Mes favoris",
  [ListCardType.manuals]: "Mes manuels",
  [ListCardType.util_links]: "Mes liens utiles",
};
