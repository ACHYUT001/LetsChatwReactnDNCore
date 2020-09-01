import React from "react";
import { Menu, Container, Button } from "semantic-ui-react";
import "../../app/layout/style.css"

export const NavBar = () => {
  return (
    <Menu inverted fixed="top" className=".ui.inveted.top.fixed.menu">
      <Container>
        
        <Menu.Item header>
            <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}}/>
            Lets Chat
        </Menu.Item>
        <Menu.Item name="Activities" />
        <Menu.Item>
            
            <Button positive content='Create Activity'/>
            </Menu.Item>
      </Container>
    </Menu>
  );
};

//Note the <Menu inveted "fixexd="top""----> makes the menu bar fixed on the top of the page
//the <Button "positive" --> makes the button green in color

