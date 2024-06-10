import { CardTypeEnum } from "~/core/enum/card-type.enum";
import { ListCard } from "../list-card/ListCard";
import { Resource } from "../resource/Resource";
import { AlertTypes } from "@edifice-ui/react";
import { useNavigate } from "react-router-dom";
import { ExternalResource } from "~/model/ExternalResource.model";

interface HomeExternalResourcesListProps {
  externalResources: ExternalResource[];
  setAlertText: (arg: string) => void;
  setAlertType: (arg: AlertTypes) => void;
  handleAddFavorite: (resource: any) => void;
  handleRemoveFavorite: (id: string) => void;
}

export const HomeExternalResourcesList: React.FC<
  HomeExternalResourcesListProps
> = ({
  externalResources,
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
      components={externalResources.map(
        (externalResource: ExternalResource) => (
          <Resource
            id={externalResource?.id ?? ""}
            key={externalResource.id}
            image={
              externalResource?.image ?? "/mediacentre/public/img/no-avatar.svg"
            }
            title={externalResource.title}
            subtitle={externalResource?.editors?.join(", ") ?? ""}
            type={CardTypeEnum.manuals}
            favorite={externalResource.favorite}
            link={externalResource.link ?? externalResource.url ?? "/"}
            setAlertText={(arg: string, type: AlertTypes) => {
              setAlertText(arg);
              setAlertType(type);
            }}
            resource={externalResource}
            handleAddFavorite={handleAddFavorite}
            handleRemoveFavorite={handleRemoveFavorite}
          />
        ),
      )}
      redirectLink={() => navigate("/resources")}
    />
  );
};
