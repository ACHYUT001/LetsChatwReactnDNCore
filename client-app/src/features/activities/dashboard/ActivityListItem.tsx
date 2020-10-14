import React, { FC } from "react";
import { act } from "react-dom/test-utils";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import ActivityListItemAttendees from "./ActivityListItemAttendees";

const ActivityListItem: FC<{ activity: IActivity }> = ({ activity }) => {
  //   const activityStore = useContext(ActivityStore);
  //   const { submitting, target } = activityStore;
  const host = activity.attendees.filter((x) => x.isHost)[0];
  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image
              size="tiny"
              circular
              src={host.image || "/assets/stock_user.png"}
              style={{ marginBottom: 3 }}
            />
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>
                {" "}
                Hosted by
                <Link to={`/profile/${host.username}`}>
                  {" "}
                  {host.displayName}
                </Link>
              </Item.Description>
              <Item.Description>
                {" "}
                {activity.isHost && (
                  <Label
                    basic
                    color="orange"
                    content="You are hosting this activity"
                  />
                )}
              </Item.Description>
              <Item.Description>
                {" "}
                {activity.isGoing && !activity.isHost && (
                  <Label
                    basic
                    color="green"
                    content="You are going to this activity"
                  />
                )}
              </Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>

      <Segment>
        <Icon name="clock" /> {activity.date}
        <Icon name="marker" /> {activity.venue}, {activity.city}
      </Segment>

      <Segment secondary>
        {" "}
        <ActivityListItemAttendees attendees={activity.attendees} />{" "}
      </Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          as={Link}
          to={`/activities/${activity.id}`}
          floated="right"
          content="View"
          color="blue"
        />
      </Segment>
    </Segment.Group>
  );
};

export default ActivityListItem;
