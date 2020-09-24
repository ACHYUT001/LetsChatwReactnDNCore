import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Card, Image, Button } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { IActivity } from "../../../app/models/activity";

import ActivityStore from "../../../app/stores/activityStore";

interface DetailProps {
  id: string;
}

export const ActivityDetails: React.FC<RouteComponentProps<DetailProps>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore);
  const { activity, loadingInitial, loadActivity } = activityStore;
  console.log("opening card");

  const [activity1, setActivity1] = useState<Promise<IActivity | null>>();

  useEffect(() => {
    console.log(match.params.id);
    console.log(activity);

    setActivity1(loadActivity(match.params.id));
    console.log(activity);
  }, [loadActivity, match.params.id]);

  console.log(loadingInitial);
  if (loadingInitial || !activity)
    return <LoadingComponent content="Loading activity...." />;

  return (
    <Card fluid>
      <Image src={`/assets/${activity!.category}.jpg`} wrapped ui={false} />
      <Card.Content>
        <Card.Header>{activity!.title}</Card.Header>
        <Card.Meta>
          <span className="date">{activity!.date}</span>
        </Card.Meta>
        <Card.Description>
          <div>{activity?.description}</div>
          <div>
            {activity!.city}, {activity!.venue}
          </div>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={2}>
          <Button
            as={Link}
            to={`/manage/${activity.id}`}
            basic
            color="blue"
            content="Edit"
          />
          <Button
            basic
            color="grey"
            content="Cancel"
            onClick={() => history.push("/activities")}
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default observer(ActivityDetails);
