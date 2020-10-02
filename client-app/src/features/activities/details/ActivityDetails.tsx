import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { IActivity } from "../../../app/models/activity";

import ActivityStore from "../../../app/stores/activityStore";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";

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
  if (loadingInitial)
    return <LoadingComponent content="Loading activity...." />;
  if (!activity) return <h2>Not Found</h2>;
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activity} />
        <ActivityDetailedInfo activity={activity} />
        <ActivityDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDetails);
