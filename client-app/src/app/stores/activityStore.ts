import { observable, action} from "mobx";
import { createContext } from "react";
import { IActivity } from "../models/activity";

class ActivityStore {
  @observable acitivities: IActivity[] = [];
  @observable loadingInitial = false;

  @action loadActivities = () => {
      this.loadingInitial = true;

  }
}

export default createContext(new ActivityStore());
