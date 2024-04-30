import React from "react";
import "./Sidebar.scss";
import CameraIcon from "@mui/icons-material/Camera";
import { SidebarIcon } from "../sidebar-icon/SidebarIcon";

interface SidebarProps {}

export const Sidebar: React.FC<SidebarProps> = () => {
  return (
    <div className="sidebar">
      <div className="icons-container">
        <SidebarIcon link="/user" icon={<CameraIcon />} name="name" />
      </div>
    </div>
  );
};
