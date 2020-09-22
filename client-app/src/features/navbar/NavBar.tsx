import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Menu, Container, Button } from "semantic-ui-react";
import "../../app/layout/style.css";
import ActivityStore from "../../app/stores/activityStore";

interface IProps {}

export const NavBar: React.FC<IProps> = () => {
  const activityStore = useContext(ActivityStore);
  const { openCreateForm } = activityStore;
  return (
    <Menu inverted fixed="top" className=".ui.inveted.top.fixed.menu">
      <Container>
        <Menu.Item header>
          <img
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: "10px" }}
          />
          Lets Chat
        </Menu.Item>
        <Menu.Item name="Activities" />
        <Menu.Item>
          <Button positive content="Create Activity" onClick={openCreateForm} />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
//Note the <Menu inveted "fixexd="top""----> makes the menu bar fixed on the top of the page
//the <Button "positive" --> makes the button green in color
