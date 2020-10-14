import { isPropertyConfigurable } from "mobx/lib/internal";
import { Interface } from "readline";

export interface IProfile {
  displayName: string;
  username: string;
  bio: string;
  image: string;
  images: IPhoto[];
}

export interface IPhoto {
  id: string;
  url: string;
  isMain: boolean;
}
