import React, { useState, FormEvent, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";

import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { RootStoreContext } from "../../../app/stores/rootStore";
import LoadingComponent from "../../../app/layout/LoadingComponent";

interface DetailParams {
  id: string;
}

export const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
  location,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {
    createActivity,
    editActivity,
    submitting,
    cancelOpenForm,
    activity: initialFormState,
    loadActivity,
    clearActivity,
    loadingInitial,
  } = rootStore.activityStore;

  const [activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    description: "",
    category: "",
    date: "",
    city: "",
    venue: "",
    attendees: [],
  });

  const [loading, setLoading] = useState(false);

  // const [activity1, setActivity1] = useState<Promise<IActivity | null>>();
  const [activity1, setActivity1] = useState<IActivity>();
  const [li, setLi] = useState<IActivity>();

  useEffect(() => {
    async function test() {
      await loadActivity(match.params.id);
      if (initialFormState) {
        setActivity(initialFormState);
        setLoading(loadingInitial);
      }
    }
    console.log(match.params.id);
    if (match.params.id && activity.id.length === 0) {
      // loadActivity(match.params.id);
      // // setActivity1(loadActivity(match.params.id));
      // loadActivity(match.params.id);

      test();

      // setActivity(activity1);

      console.log(initialFormState);
    }
    return () => {
      clearActivity();
    };
  }, [
    loadActivity,
    clearActivity,
    match.params.id,
    activity.id.length,
    activity,
    loading,
    loadingInitial,
    history,
  ]);

  if (loading) return <LoadingComponent content="Loading activity...." />;

  // if (!activity) return <h2>Loading...</h2>;

  const handleSubmit = () => {
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity).then(() =>
        history.push(`/activities/${newActivity.id}`)
      );
    } else {
      editActivity(activity).then(() =>
        history.push(`/activities/${activity.id}`)
      );
    }
  };

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  const closeOpenForm = () => {
    if (location.pathname === "/createactivity") history.push("/activities");
    else cancelOpenForm();
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <Form onSubmit={handleSubmit}>
            <Form.Input
              name="title"
              placeholder="Title"
              value={activity.title}
              onChange={handleInputChange}
            />
            <Form.TextArea
              rows={2}
              name="description"
              placeholder="Description"
              value={activity.description}
              onChange={handleInputChange}
            />
            <Form.Input
              onChange={handleInputChange}
              name="category"
              placeholder="Category"
              value={activity.category}
            />
            <Form.Input
              name="date"
              type="datetime-local"
              placeholder="Date"
              value={activity.date}
              onChange={handleInputChange}
            />
            <Form.Input
              name="city"
              placeholder="City"
              value={activity.city}
              onChange={handleInputChange}
            />
            <Form.Input
              name="venue"
              placeholder="Venue"
              value={activity.venue}
              onChange={handleInputChange}
            />
            <Button
              floated="right"
              positive
              content="Cancel"
              type="submit"
              onClick={() => closeOpenForm()}
            />
            <Button
              loading={submitting}
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
