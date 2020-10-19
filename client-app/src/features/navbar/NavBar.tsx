import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Container, Button, Dropdown, Image } from "semantic-ui-react";
import "../../app/layout/style.css";

import { RootStoreContext } from "../../app/stores/rootStore";

export const NavBar = () => {
  const rootStore = useContext(RootStoreContext);
  const { logout, user } = rootStore.userStore;

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
        {user && (
          <Menu.Item position="right">
            <Image
              avatar
              spaced="right"
              src={user.image || "/assets/stock_user.png"}
            />
            <Dropdown pointing="top left" text={user.username}>
              <Dropdown.Menu>
                <Dropdown.Item
                  as={Link}
                  to={`/profile/${user.username}`}
                  text="My profile"
                  icon="user"
                />
                <Dropdown.Item text="Logout" icon="power" onClick={logout} />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        )}
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
//Note the <Menu inveted "fixexd="top""----> makes the menu bar fixed on the top of the page
//the <Button "positive" --> makes the button green in color
