import { observer } from "mobx-react-lite";
import React from "react";
import { NavLink } from "react-router-dom";
import { Menu, Container, Button } from "semantic-ui-react";
import "../../app/layout/style.css";

export const NavBar: React.FC = () => {
  return (
    <Menu inverted fixed="top" className=".ui.inveted.top.fixed.menu">
      <Container>
        <Menu.Item header as={NavLink} exact to="/">
          <img
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: "10px" }}
          />
          Lets Chat
        </Menu.Item>
        <Menu.Item name="Activities" as={NavLink} exact to="/activities" />
        <Menu.Item>
          <Button
            as={NavLink}
            exact
            to="/createactivity"
            positive
            content="Create Activity"
          />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
//Note the <Menu inveted "fixexd="top""----> makes the menu bar fixed on the top of the page
//the <Button "positive" --> makes the button green in color
