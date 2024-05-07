import React from "react";
import "./Sidebar.scss";
import HomeIcon from "@mui/icons-material/Home";
import StarIcon from "@mui/icons-material/Star";
import SchoolIcon from "@mui/icons-material/School";
import LaptopIcon from "@mui/icons-material/Laptop";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { SidebarIcon } from "../sidebar-icon/SidebarIcon";

interface SidebarProps {}

export const Sidebar: React.FC<SidebarProps> = () => {
  return (
    <div className="sidebar">
      <div className="icons-container">
        <SidebarIcon
          action={() => console.log(1)}
          icon={<HomeIcon />}
          name="Accueil"
        />
        <SidebarIcon
          action={() => console.log(2)}
          icon={<StarIcon />}
          name="Favoris"
        />
        <SidebarIcon
          action={() => console.log(3)}
          icon={<SchoolIcon />}
          name="Manuels"
        />
        <SidebarIcon
          action={() => console.log(4)}
          icon={<LaptopIcon />}
          name="Ressources"
        />
        <SidebarIcon
          action={() => console.log(5)}
          icon={<BookmarkIcon />}
          name="Signets"
        />
        <SidebarIcon
          action={() => console.log(6)}
          icon={<MenuBookIcon />}
          name="CDI"
        />
      </div>
    </div>
  );
};
