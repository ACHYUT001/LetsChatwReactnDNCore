import { observable } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import { Tab } from "semantic-ui-react";
import ProfileDescription from "./ProfileDescription";
import ProfilePhotos from "./ProfilePhotos";

const panes = [
  { menuItem: "About", render: () => <ProfileDescription /> },
  {
    menuItem: "Photos",
    render: () => <ProfilePhotos />,
  },
  { menuItem: "Activities", render: () => <Tab.Pane>About Content</Tab.Pane> },
  { menuItem: "Followers", render: () => <Tab.Pane>About Content</Tab.Pane> },
  {
    menuItem: "Following",
    render: () => <Tab.Pane>Following Content</Tab.Pane>,
  },
];

const ProfileContent = () => {
  return (
    <div>
      <Tab
        menu={{ fluid: true, vertical: true }}
        menuPosition={"right"}
        panes={panes}
      />
    </div>
  );
};

export default observer(ProfileContent);
