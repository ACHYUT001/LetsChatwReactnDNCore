import { observable } from "mobx";
import { observer } from "mobx-react-lite";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import {
  Segment,
  Header,
  Form,
  Button,
  Comment,
  Item,
  Label,
  List,
  Image,
} from "semantic-ui-react";
import { IActivity, IAttendee } from "../../../app/models/activity";

interface IProps {
  activity: IActivity;
}

const ActivityDetailedSidebar: React.FC<IProps> = ({ activity }) => {
  return (
    <Fragment>
      <Segment
        textAlign="center"
        attached="top"
        secondary
        inverted
        color="teal"
        style={{ border: "none" }}
      >
        {activity.attendees.length}{" "}
        {activity.attendees.length === 1 ? "Person" : "People"} going
      </Segment>
      <Segment attached>
        <List relaxed divided>
          {activity.attendees.map((attendee) => (
            <Item key={attendee.username} style={{ position: "relative" }}>
              {attendee.isHost && (
                <Label
                  style={{ position: "absolute" }}
                  color="orange"
                  ribbon="right"
                >
                  Host
                </Label>
              )}

              <Image
                size="mini"
                src={attendee.image || "/assets/stock_user.png"}
              />
              <Item.Content verticalAlign="middle">
                <Item.Header as="h3">
                  <Link to={`/profile/${attendee.username}`}>
                    {attendee.displayName}
                  </Link>
                </Item.Header>
                {attendee.following && (
                  <Item.Extra style={{ color: "orange" }}>Following</Item.Extra>
                )}
              </Item.Content>
            </Item>
          ))}
        </List>
      </Segment>
    </Fragment>
  );
};

export default observer(ActivityDetailedSidebar);
