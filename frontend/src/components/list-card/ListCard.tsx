import React, {
  useState,
  useEffect,
  MouseEventHandler,
  KeyboardEventHandler,
} from "react";

import { Grid } from "@edifice-ui/react";
import { isActionAvailable } from "@edifice-ui/react";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "./ListCard.scss";
import { NavigateFunction } from "react-router-dom";

import { ListCardTitle } from "./list-card-title/ListCardTitle";
import { breakpoints } from "~/core/const/breakpoints.ts";
import {
  NbColumnsListCard,
  NbComponentsListCard,
} from "~/core/const/home-element-list-sizes.const";
import { CardTypeEnum } from "~/core/enum/card-type.enum.ts";
import { useActions } from "~/services/queries";

interface ListCardProps {
  scrollable: boolean;
  type?: CardTypeEnum;
  components?: any[];
  redirectLink: string | NavigateFunction;
  homeDouble?: boolean;
}

export const ListCard: React.FC<ListCardProps> = ({
  scrollable,
  type = CardTypeEnum.favorites,
  components,
  redirectLink,
  homeDouble = false,
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { data: actions } = useActions();
  const canAccessSignet = isActionAvailable("signets", actions);

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
    if (windowWidth < breakpoints.md) return nbComponent.sm;
    if (windowWidth < breakpoints.lg) return nbComponent.md;
    if (windowWidth < breakpoints.xl) return nbComponent.lg * double;
    return nbComponent.xl * double;
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
              (type !== CardTypeEnum.book_mark || canAccessSignet) &&
              (typeof redirectLink === "string" ? (
                <a href={redirectLink as string} className="right-button">
                  Voir plus
                </a>
              ) : (
                <button
                  onClick={redirectLink as MouseEventHandler}
                  onKeyDown={redirectLink as KeyboardEventHandler}
                  className="right-button list-card-button"
                >
                  Voir plus
                </button>
              ))}
          </div>
        )}
        <Grid className={`grid-${NbColumns(windowWidth)}`}>
          {components &&
            components.map((component, index) =>
              showComponent(component, index),
            )}
        </Grid>
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
