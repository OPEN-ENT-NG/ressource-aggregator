import { CardTypeEnum } from "~/core/enum/card-type.enum";
import { ListCard } from "../list-card/ListCard";
import { Resource } from "../resource/Resource";
import { Signet } from "~/model/Signet.model";
import { AlertTypes } from "@edifice-ui/react";
import { useTranslation } from "react-i18next";

interface HomeBookMarksListProps {
  homeSignets: Signet[];
  setAlertText: (arg: string) => void;
  setAlertType: (arg: AlertTypes) => void;
  handleAddFavorite: (resource: any) => void;
  handleRemoveFavorite: (id: string) => void;
  double?: boolean;
}

export const HomeBookMarksList: React.FC<HomeBookMarksListProps> = ({
  homeSignets,
  setAlertText,
  setAlertType,
  handleAddFavorite,
  handleRemoveFavorite,
  double,
}) => {
  const { t } = useTranslation();
  return (
    <ListCard
      scrollable={false}
      type={CardTypeEnum.book_mark}
      components={homeSignets.map((signet: Signet) => (
        <Resource
          id={signet?.id ?? signet?._id ?? ""}
          key={signet.id ?? signet?._id ?? ""}
          image={signet?.image ?? "/mediacentre/public/img/no-avatar.svg"}
          title={signet.title}
          subtitle={
            signet.orientation ? t("mediacentre.signet.orientation") : ""
          }
          type={CardTypeEnum.book_mark}
          favorite={signet.favorite}
          link={signet.link ?? signet.url ?? "/"}
          footerImage={
            signet.owner_id
              ? `/userbook/avatar/${signet.owner_id}?thumbnail=48x48`
              : `/mediacentre/public/img/no-avatar.svg`
          }
          footerText={
            signet.owner_name ?? (signet.authors ? signet.authors[0] : " ")
          }
          setAlertText={(arg: string, type: AlertTypes) => {
            setAlertText(arg);
            setAlertType(type);
          }}
          resource={signet}
          handleAddFavorite={handleAddFavorite}
          handleRemoveFavorite={handleRemoveFavorite}
        />
      ))}
      redirectLink="/mediacentre?view=angular#/signet"
      homeDouble={double}
    />
  );
};