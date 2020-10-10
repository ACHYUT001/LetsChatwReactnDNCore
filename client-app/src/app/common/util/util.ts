import { IActivity, IAttendee } from "../../models/activity";
import { IUser } from "../../models/user";

export const setActivityProps = (activity: IActivity, user: IUser) => {
  activity.date = activity.date.split(".")[0].replace("T", " ");
  activity.isGoing = activity.attendees.some(
    (a) => a.username === user.username
  );
  activity.isHost = activity.attendees.some(
    (a) => a.username === user.username && a.isHost
  );

  return activity;
};

export const createAttendee = (user: IUser): IAttendee => {
  return {
    displayName: user.displayName,
    isHost: false,
    username: user.username,
    image: user.image!,
  };
};
