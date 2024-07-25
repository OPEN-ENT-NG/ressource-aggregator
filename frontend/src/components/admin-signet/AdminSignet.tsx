import React from "react";

import DeleteForeverIcon from "@mui/icons-material/DeleteForeverOutlined";
import FolderIcon from "@mui/icons-material/FolderOutlined";
import FolderSharedIcon from "@mui/icons-material/FolderSharedOutlined";
import PublicIcon from "@mui/icons-material/PublicOutlined";
import "./AdminSignet.scss";
import { useTranslation } from "react-i18next";
import { Signet } from "~/model/Signet.model";
import { useSignet } from "~/hooks/useSignet";
import { Resource } from "~/model/Resource.model";

interface AdminSignetProps {
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
  signets: Signet[] | null;
  setSignetsData: React.Dispatch<React.SetStateAction<Signet[] | null>>;
  setAllResourcesDisplayed: React.Dispatch<React.SetStateAction<Resource[] | null>>;
}

export const AdminSignet: React.FC<AdminSignetProps> = ({
  setSelectedTab,
  signets,
  setSignetsData,
  setAllResourcesDisplayed
}) => {
  const { t } = useTranslation();
  const { mine, shared, published, archived } = useSignet();

  const selectMine = () => {
    setAllResourcesDisplayed(null);
    setSelectedTab("mediacentre.signets.mine");
    if (signets) {
      setSignetsData(mine(signets));
    }
  };

  const selectShared = () => {
    setAllResourcesDisplayed(null);
    setSelectedTab("mediacentre.signets.shared");
    if (signets) {
      setSignetsData(shared(signets));
    }
  }

  const selectPublished = () => {
    setAllResourcesDisplayed(null);
    setSelectedTab("mediacentre.signets.published");
    if (signets) {
      setSignetsData(published(signets));
    }
  }

  const selectArchived = () => {
    setAllResourcesDisplayed(null);
    setSelectedTab("mediacentre.signets.archived");
    if (signets) {
      setSignetsData(archived(signets));
    }
  }

  return (
    <div className="med-signets-admin-list">
      <div className="med-signets-admin-box active" onClick={() => selectMine()}>
        <FolderIcon style={{ width: "1.75em", height: "1.75em" }} />
        <p className="med-signets-admin-box-text">
          {t("mediacentre.signets.mine")}
        </p>
      </div>
      <div className="med-signets-admin-box" onClick={() => selectShared()}>
        <FolderSharedIcon style={{ width: "1.75em", height: "1.75em" }} />
        <p className="med-signets-admin-box-text">
          {t("mediacentre.signets.shared")}
        </p>
      </div>
      <div className="med-signets-admin-box" onClick={() => selectPublished()}>
        <PublicIcon style={{ width: "1.75em", height: "1.75em" }} />
        <p className="med-signets-admin-box-text">
          {t("mediacentre.signets.published")}
        </p>
      </div>
      <div className="med-signets-admin-box" onClick={() => selectArchived()}>
        <DeleteForeverIcon style={{ width: "1.75em", height: "1.75em" }} />
        <p className="med-signets-admin-box-text">
          {t("mediacentre.signets.archived")}
        </p>
      </div>
    </div>
  );
};
