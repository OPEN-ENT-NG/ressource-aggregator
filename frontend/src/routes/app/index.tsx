import { FileCard } from "@edifice-ui/react";
import { ID } from "edifice-ts-client";
import { useTranslation } from "react-i18next";

import { Header } from "~/components/header/Header.tsx";
import { ListCard } from "~/components/list-card/ListCard.tsx";
import { Sidebar } from "~/components/sidebar/Sidebar.tsx";
import { Square } from "~/components/square/Square.tsx";
import { ListCardType } from "~/core/enum/list-card-type";
import {
  NbColumnsListCard,
  NbComponentsListCard,
  TitleListCard,
} from "~/core/object/home.ts";

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
  const { t } = useTranslation();
  // function that return a FileCard component
  const getFileCard = () => {
    return (
      <FileCard
        className="file-card"
        doc={{
          _id: "1",
          _isShared: false,
          _shared: [],
          children: [],
          created: new Date(),
          eParent: "",
          eType: "file",
          name: "test",
          owner: { userId: "1", displayName: "ownerName" },
          ownerName: "ownerName",
        }}
        isClickable
        onClick={function Ga() {}}
        onSelect={function Ga() {}}
      />
    );
  };
  return (
    <>
      <Sidebar />
      <div className="home-container">
        <Header />
        {/* <Resource
          image="https://via.placeholder.com/150"
          title="Resource Title"
          subtitle="Resource Subtitle"
          size="medium"
          favorite={false}
        /> */}
        <div className="square-container">
          <Square
            width="60%"
            height="300px"
            color="#c3c3c3"
            margin="0 5% 10px 0"
          />
          <Square
            width="40%"
            height="300px"
            color="#d0d0d0"
            margin="0 0 10px 0"
          />
        </div>
        <ListCard
          scrolable={false}
          type={ListCardType.manuals}
          title={TitleListCard[ListCardType.manuals]}
          nbColumns={NbColumnsListCard[ListCardType.manuals]}
          nbComponent={NbComponentsListCard[ListCardType.manuals]}
          components={[
            getFileCard(),
            getFileCard(),
            getFileCard(),
            getFileCard(),
            getFileCard(),
            getFileCard(),
          ]}
        />
        <ListCard
          scrolable={false}
          type={ListCardType.util_links}
          title={TitleListCard[ListCardType.util_links]}
          nbColumns={NbColumnsListCard[ListCardType.util_links]}
          nbComponent={NbComponentsListCard[ListCardType.util_links]}
          components={[
            getFileCard(),
            getFileCard(),
            getFileCard(),
            getFileCard(),
            getFileCard(),
          ]}
        />
      </div>
    </>
  );
};
