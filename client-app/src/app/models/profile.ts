import { isPropertyConfigurable } from "mobx/lib/internal";
import { Interface } from "readline";

export interface IProfile {
  displayName: string;
  username: string;
  bio: string;
  image: string;
  images: IPhoto[];
  following: boolean;
  followerCount: number;
  followingCount: number;
}

export interface IPhoto {
  id: string;
  url: string;
  isMain: boolean;
}
