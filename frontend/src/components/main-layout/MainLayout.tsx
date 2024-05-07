import React from "react";
import { Sidebar } from "../sidebar/Sidebar";
import { Header } from "../header/Header";

interface MainLayoutProps {}

export const MainLayout: React.FC<MainLayoutProps> = () => {
  return (
    <>
      <Sidebar />
      <Header />
    </>
  );
};
