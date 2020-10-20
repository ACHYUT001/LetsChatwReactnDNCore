import axios, { AxiosResponse } from "axios";
import { stat } from "fs";

import { toast } from "react-toastify";
import { history } from "../..";

import { IActivity, IActivityEnvelope } from "../models/activity";
import { IPhoto, IProfile } from "../models/profile";
import { IUser, IUserFormValues } from "../models/user";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// const rootStore = useContext(RootStoreContext);

axios.interceptors.response.use(undefined, (error) => {
  if (error.message === "Network Error" && !error.response) {
    toast.error("Network Error - make sure api is running :D");
  }

  const { status, data, config, headers } = error.response;

  if (status === 404) {
    history.push("/notfound");
  }

  if (
    status === 401 &&
    headers["www-authenticate"].split(",")[0] === `Bearer error="invalid_token"`
  ) {
    console.log(error.response);
    window.localStorage.removeItem("jwt");
    history.push("/");
    toast.info("Session expired, please login again");
  }

  if (
    status === 400 &&
    config.method === "get" &&
    data.errors.hasOwnProperty("id")
  ) {
    history.push("/notfound");
  }

  if (status === 500) {
    toast.error("Server Error-check terminal for more info!");
  }

  throw error.response;
});

axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("jwt");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const responseBody = (response: AxiosResponse) => response.data;

export const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => {
      resolve(response);
    }, ms)
  );

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  del: (url: string) => axios.delete(url).then(responseBody),
  postForm: (url: string, file: Blob) => {
    let formData = new FormData();
    formData.append("File", file);
    return axios
      .post(url, formData, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody);
  },
};

const Activities = {
  list: (params: URLSearchParams): Promise<IActivityEnvelope> =>
    axios.get("/activities", { params: params }).then(responseBody),
  detail: (id: string) => requests.get(`/activities/${id}`),
  create: (activity: IActivity) => requests.post("/activities", activity),
  update: (activity: IActivity) =>
    requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del(`/activities/${id}`),
  attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
  unattend: (id: string) => requests.del(`/activities/${id}/attend`),
};

//Request for user object
// const Profiles = {
//   get: (username: string): Promise<IProfile> =>
//     requests.get(`/profile/${username}`),
//   updateProfile: (profile: Partial<IProfile>) =>
//     requests.put("/profile", profile),
// };
const User = {
  current: (): Promise<IUser> => requests.get("/user"),
  login: (user: IUserFormValues): Promise<IUser> =>
    requests.post("/user/login", user),
  register: (user: IUserFormValues): Promise<IUser> =>
    requests.post("/user/register", user),
};

const Profiles = {
  get: (username: string): Promise<IProfile> =>
    requests.get(`/profile/${username}`),
  uploadPhoto: (photo: Blob): Promise<IPhoto> =>
    requests.postForm("/photos", photo),
  setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
  deletePhoto: (id: string) => requests.del(`/photos/${id}`),
  updateProfile: (profile: Partial<IProfile>) =>
    requests.put("/profile", profile),
  follow: (username: string) =>
    requests.post(`/profile/${username}/follow`, {}),
  unfollow: (username: string) => requests.del(`/profile/${username}/follow`),
  listFollowings: (username: string, predicate: string) =>
    requests.get(`/profile/${username}/follow?predicate=${predicate}`),
  listActivities: (username: string, predicate: string) =>
    requests.get(`/profile/${username}/activities?predicate=${predicate}`),
};

export default {
  Activities,
  User,
  Profiles,
};
