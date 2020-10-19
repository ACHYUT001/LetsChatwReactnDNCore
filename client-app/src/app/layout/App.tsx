import React, { useEffect, Fragment, useContext, FC } from "react";
import { Container } from "semantic-ui-react";

import { NavBar } from "../../features/navbar/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

import LoadingComponent from "./LoadingComponent";

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
import { RootStoreContext } from "../stores/rootStore";
import LoginForm from "../../features/user/LoginForm";
import ModalContainer from "../common/modals/ModalContainer";
import ProfilePage from "../../features/profiles/ProfilePage";

const App: FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const { getUser } = rootStore.userStore;
  const { token, setAppLoaded, appLoaded } = rootStore.commonStore;

  //this makes sure that if our app is rerun/renders and when the this store is re-initialized it checks if there is a valid token in the
  //browser local storage and makes sure the token persists and the app is aware about it
  useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [token, getUser, setAppLoaded]);

  // if (activityStore.loadingInitial)
  if (!appLoaded) return <LoadingComponent content="loading..." />;

  return (
    <Fragment>
      <ModalContainer />
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
                  path={["/manage/:id", "/createActivity"]}
                  component={ActivityForm}
                />
                <Route path="/activities/:id" component={ActivityDetails} />

                <Route path="/login" component={LoginForm} />

                <Route path="/profile/:username" component={ProfilePage} />
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
