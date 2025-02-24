import React, {
  useState,
  useEffect,
  MouseEventHandler,
  KeyboardEventHandler,
  ReactNode,
} from "react";

import { Grid } from "@edifice.io/react";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "./ListCard.scss";
import { useTranslation } from "react-i18next";
import { NavigateFunction } from "react-router-dom";

import { ListCardTitle } from "./list-card-title/ListCardTitle";
import { EmptyState } from "../empty-state/EmptyState";
import { breakpoints } from "~/core/const/breakpoints.ts";
import {
  NbColumnsListCard,
  NbComponentsListCard,
} from "~/core/const/home-element-list-sizes.const";
import { CardTypeEnum } from "~/core/enum/card-type.enum.ts";

interface ListCardProps {
  scrollable: boolean;
  type?: CardTypeEnum;
  components?: ReactNode[];
  redirectLink: string | NavigateFunction;
  homeDouble?: boolean;
  isPinsEmpty?: boolean;
}

export const ListCard: React.FC<ListCardProps> = ({
  scrollable,
  type = CardTypeEnum.favorites,
  components,
  redirectLink,
  homeDouble = false,
  isPinsEmpty = true,
}) => {
  const { t } = useTranslation("mediacentre");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const NbComponents = (windowWidth: number) => {
    const nbComponent = NbComponentsListCard[type];
    const double = homeDouble ? 2 : 1;
    if (windowWidth < breakpoints.md) return nbComponent.sm * double;
    if (windowWidth < breakpoints.lg) return nbComponent.md * double;
    if (windowWidth < breakpoints.xl) return nbComponent.lg * double;
    return (nbComponent.xl - (isPinsEmpty ? 0 : 2)) * double; // we remove 2 components if pins are not empty
  };

  const NbColumns = (windowWidth: number) => {
    const nbColumns = NbColumnsListCard[type];
    const double = homeDouble ? 2 : 1;
    if (windowWidth < breakpoints.md) return nbColumns.sm;
    if (windowWidth < breakpoints.lg) return nbColumns.md;
    if (windowWidth < breakpoints.xl) return nbColumns.lg * double;
    return nbColumns.xl * double;
  };

  const tooMuchComponents = (components: any[]) => {
    return components.length > NbComponents(windowWidth);
  };

  const showComponent = (component: any, index: number) => {
    const maxComponents = NbComponents(windowWidth);
    if (maxComponents === -1 || index < maxComponents) {
      return component;
    }
  };

  if (!scrollable) {
    return (
      <div className={`list-card ${type}`}>
        {type !== CardTypeEnum.search && (
          <div className="list-card-header">
            <ListCardTitle type={type} />
            {components &&
              tooMuchComponents(components) &&
              (typeof redirectLink === "string" ? (
                <a href={redirectLink as string} className="right-button">
                  {t("mediacentre.list.card.see.more")}
                </a>
              ) : (
                <button
                  onClick={redirectLink as MouseEventHandler}
                  onKeyDown={redirectLink as KeyboardEventHandler}
                  className="right-button list-card-button"
                >
                  {t("mediacentre.list.card.see.more")}
                </button>
              ))}
          </div>
        )}
        {components && components.length > 0 ? (
          <Grid className={`grid-${NbColumns(windowWidth)}`}>
            {components &&
              components.map((component, index) =>
                showComponent(component, index),
              )}
          </Grid>
        ) : (
          type === CardTypeEnum.favorites && (
            <EmptyState
              image="empty-state-favorites.png"
              title={t("mediacentre.favorite.empty.first")}
              description={t("mediacentre.favorite.empty.second")}
            />
          )
        )}
      </div>
    );
  } else {
    return (
      <div className={`list-card ${type}`}>
        <div className="list-card-header">
          <ListCardTitle type={type} />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <KeyboardArrowLeftIcon className="left-arrow" />
          <Grid className={`grid-${NbColumns(windowWidth)}`}>
            {components &&
              components.map((component, index) =>
                showComponent(component, index),
              )}
          </Grid>
          <KeyboardArrowRightIcon className="right-arrow" />
        </div>
        <div className="dots">
          <Brightness1Icon className="dot" />
          <Brightness1Icon className="dot" />
          <Brightness1Icon className="dot" />
        </div>
      </div>
    );
  }
};
