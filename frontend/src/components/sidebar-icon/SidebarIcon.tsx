import React from "react";
import "./SidebarIcon.scss";
import { Link } from "react-router-dom";

interface SidebarIconProps {
  link: string;
  icon: React.ReactNode;
  name: string;
}

export const SidebarIcon: React.FC<SidebarIconProps> = ({
  link,
  icon,
  name,
}) => {
  return (
    <>
      <Link to={link} className="sidebar-icon">
        {icon}
        <span>{name}</span>
      </Link>
    </>
  );
};
