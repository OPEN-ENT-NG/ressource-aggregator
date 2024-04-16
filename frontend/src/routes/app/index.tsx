import React from "react";

import { ID } from "edifice-ts-client";

import {Square} from "~/components/square/Square.tsx";
import {Sidebar} from "~/components/sidebar/Sidebar.tsx";
import {Header} from "~/components/header/Header.tsx";

// const ExportModal = lazy(async () => await import("~/features/export-modal"));

export interface AppProps {
  _id: string;
  created: Date;
  description: string;
  map: string;
  modified: Date;
  name: string;
  owner: { userId: ID; displayName: string };
  shared: any[];
  thumbnail: string;
}

export const App = () => {
  console.log("i am in app");
  return (
    <>
        <Sidebar />
        <div className="home-container">
            <Header />
            <div className="square-container">
              <Square width="60%" height="300px" color="#c3c3c3" margin="0 5% 10px 0"/>
              <Square width="40%" height="300px" color="#d0d0d0" margin="0 0 10px 0"/>
            </div>
            <Square width="100%" height="300px" color="#afafaf" margin="0 0 10px 0"/>
            <Square width="100%" height="300px" color="#414141" margin="0 0 10px 0"/>
        </div>
    </>
  );
};
