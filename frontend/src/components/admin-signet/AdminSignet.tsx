import React from "react";

import DeleteForeverIcon from "@mui/icons-material/DeleteForeverOutlined";
import FolderIcon from "@mui/icons-material/FolderOutlined";
import FolderSharedIcon from "@mui/icons-material/FolderSharedOutlined";
import PublicIcon from "@mui/icons-material/PublicOutlined";
import { useTranslation } from "react-i18next";
import "./AdminSignet.scss";

import { Resource } from "~/model/Resource.model";
import { Signet } from "~/model/Signet.model";
import { useSignet } from "~/providers/SignetProvider";
import { useToasterProvider } from "~/providers/ToasterProvider";
import { sortByAlphabet } from "~/utils/sortResources.util";

interface AdminSignetProps {
  setSignetsData: React.Dispatch<React.SetStateAction<Signet[] | null>>;
  setAllResourcesDisplayed: React.Dispatch<
    React.SetStateAction<Resource[] | null>
  >;
  chooseEmptyState: (text: string, image: string) => void;
}

export const AdminSignet: React.FC<AdminSignetProps> = ({
  setSignetsData,
  setAllResourcesDisplayed,
  chooseEmptyState = () => {},
}) => {
  const { t } = useTranslation("mediacentre");
  const { resetResources, selectedTab, setSelectedTab } = useToasterProvider();
  // const { mine, shared, published, archived } = useSignet();
  const { mine, shared, published, archived } = useSignet();

  const selectMine = () => {
    chooseEmptyState("mediacentre.empty.state.mine", "empty-state-mine.png");
    resetPage();
    setSelectedTab("mediacentre.signets.mine");
    !!mine && setSignetsData(sortByAlphabet(mine) as Signet[]);
  };

  const selectShared = () => {
    chooseEmptyState(
      "mediacentre.empty.state.shared",
      "empty-state-shared.png",
    );
    resetPage();
    setSelectedTab("mediacentre.signets.shared");
    shared && setSignetsData(sortByAlphabet(shared) as Signet[]);
  };

  const selectPublished = () => {
    chooseEmptyState(
      "mediacentre.empty.state.published",
      "empty-state-published.png",
    );
    resetPage();
    setSelectedTab("mediacentre.signets.published");
    published && setSignetsData(sortByAlphabet(published) as Signet[]);
  };

  const selectArchived = () => {
    chooseEmptyState(
      "mediacentre.empty.state.archived",
      "empty-state-archived.png",
    );
    resetPage();
    setSelectedTab("mediacentre.signets.archived");
    archived && setSignetsData(sortByAlphabet(archived) as Signet[]);
  };

  const resetPage = () => {
    resetResources();
    setAllResourcesDisplayed(null);
  };

  return (
    <div className="med-signets-admin-list">
      <div
        className={`med-signets-admin-box ${
          selectedTab === "mediacentre.signets.mine" ? "active" : ""
        }`}
        onClick={() => selectMine()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectMine();
          }
        }}
      >
        <FolderIcon style={{ width: "1.75em", height: "1.75em" }} />
        <p className="med-signets-admin-box-text">
          {t("mediacentre.signets.mine")}
        </p>
      </div>
      <div
        className={`med-signets-admin-box ${
          selectedTab === "mediacentre.signets.shared" ? "active" : ""
        }`}
        onClick={() => selectShared()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectShared();
          }
        }}
      >
        <FolderSharedIcon style={{ width: "1.75em", height: "1.75em" }} />
        <p className="med-signets-admin-box-text">
          {t("mediacentre.signets.shared")}
        </p>
      </div>
      <div
        className={`med-signets-admin-box ${
          selectedTab === "mediacentre.signets.published" ? "active" : ""
        }`}
        onClick={() => selectPublished()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectPublished();
          }
        }}
      >
        <PublicIcon style={{ width: "1.75em", height: "1.75em" }} />
        <p className="med-signets-admin-box-text">
          {t("mediacentre.signets.published")}
        </p>
      </div>
      <div
        className={`med-signets-admin-box ${
          selectedTab === "mediacentre.signets.archived" ? "active" : ""
        }`}
        onClick={() => selectArchived()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectArchived();
          }
        }}
      >
        <DeleteForeverIcon style={{ width: "1.75em", height: "1.75em" }} />
        <p className="med-signets-admin-box-text">
          {t("mediacentre.signets.archived")}
        </p>
      </div>
    </div>
  );
};
