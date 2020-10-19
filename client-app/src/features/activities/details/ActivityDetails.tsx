import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";

import { RouteComponentProps } from "react-router-dom";
import { Grid } from "semantic-ui-react";

import LoadingComponent from "../../../app/layout/LoadingComponent";
import { IActivity } from "../../../app/models/activity";

import { RootStoreContext } from "../../../app/stores/rootStore";
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
  const rootStore = useContext(RootStoreContext);
  const { activity, loadingInitial, loadActivity } = rootStore.activityStore;
  console.log("opening card");

  const [activity1, setActivity1] = useState<IActivity | null>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(match.params.id + "   #1");
    console.log(activity + "   #2");
    async function test() {
      await loadActivity(match.params.id);
      setActivity1(activity);
      setLoading(loadingInitial);
    }

    test();
    // loadActivity(match.params.id);
    // setActivity1(activity);

    // setActivity1(loadActivity(match.params.id));
    console.log(activity + " in use effect  #7");
  }, [loadActivity, match.params.id, history]);

  // sleep(1000);
  // setLoading(false);
  console.log(loadingInitial + " outside of use effect  #8");

  if (loading) return <LoadingComponent content="Loading activity...." />;

  if (!activity) return <h2>Loading...</h2>;
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activity} />
        <ActivityDetailedInfo activity={activity} />
        <ActivityDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar activity={activity} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDetails);
