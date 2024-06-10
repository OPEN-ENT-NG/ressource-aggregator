import { CardTypeEnum } from "~/core/enum/card-type.enum";
import { ListCard } from "../list-card/ListCard";
import { Resource } from "../resource/Resource";
import { Textbook } from "~/model/Textbook.model";
import { AlertTypes } from "@edifice-ui/react";
import { useNavigate } from "react-router-dom";

interface HomeManualsListProps {
  textbooks: Textbook[];
  setAlertText: (arg: string) => void;
  setAlertType: (arg: AlertTypes) => void;
  handleAddFavorite: (resource: any) => void;
  handleRemoveFavorite: (id: string) => void;
}

export const HomeManualsList: React.FC<HomeManualsListProps> = ({
  textbooks,
  setAlertText,
  setAlertType,
  handleAddFavorite,
  handleRemoveFavorite,
}) => {
  const navigate = useNavigate();
  return (
    <ListCard
      scrollable={false}
      type={CardTypeEnum.manuals}
      components={textbooks.map((textbook: Textbook) => (
        <Resource
          id={textbook?.id ?? ""}
          key={textbook.id}
          image={textbook?.image ?? "/mediacentre/public/img/no-avatar.svg"}
          title={textbook.title}
          subtitle={textbook?.editors?.join(", ") ?? ""}
          type={CardTypeEnum.manuals}
          favorite={textbook.favorite}
          link={textbook.link ?? textbook.url ?? "/"}
          setAlertText={(arg: string, type: AlertTypes) => {
            setAlertText(arg);
            setAlertType(type);
          }}
          resource={textbook}
          handleAddFavorite={handleAddFavorite}
          handleRemoveFavorite={handleRemoveFavorite}
        />
      ))}
      redirectLink={() => navigate("/textbook")}
    />
  );
};
