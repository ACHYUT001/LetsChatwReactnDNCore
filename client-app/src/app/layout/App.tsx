import React, { useEffect, Fragment, useContext, FC } from "react";
import { Container } from "semantic-ui-react";

import { NavBar } from "../../features/navbar/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

import LoadingComponent from "./LoadingComponent";

import ActivityStore from "../stores/activityStore";
import { observer } from "mobx-react-lite";
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import { ActivityForm } from "../../features/activities/form/ActivityForm";
import { ActivityDetails } from "../../features/activities/details/ActivityDetails";
import NotFound from "./NotFound";
import { ToastContainer } from "react-toastify";

const App: FC<RouteComponentProps> = ({ location }) => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    console.log("activitystore changed");
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial)
    return <LoadingComponent content="loading..." />;

  return (
    <Fragment>
      <ToastContainer position="bottom-right" />

      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Switch>
                <Route exact path="/activities" component={ActivityDashboard} />
                <Route
                  key={location.key}
                  path={["/createActivity", "/manage/:id"]}
                  component={ActivityForm}
                />
                <Route path="/activities/:id" component={ActivityDetails} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
