import { action, computed, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import { hasToastId } from "react-toastify/dist/utils";
import agent from "../api/agent";
import PhotoWidgetCropper from "../common/photoUpload/PhotoWidgetCropper";
import { IPhoto, IProfile } from "../models/profile";
import { RootStore } from "./rootStore";

export default class ProfileStore {
  rootStore: RootStore;

  constructor(rootstore: RootStore) {
    this.rootStore = rootstore;
  }

  @observable profile: IProfile | null = null;
  @observable loading = true;
  @observable uploadingPhoto = false;
  @observable setMainLoading = false;

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.username === this.profile.username;
    } else {
      return false;
    }
  }

  @action loadProfile = async (username: string) => {
    this.loading = true;
    try {
      const profile = await agent.Profiles.get(username);
      console.log(profile);
      runInAction(() => {
        this.profile = profile;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.log(error);
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;
    try {
      const photo = await agent.Profiles.uploadPhoto(file);
      runInAction(() => {
        if (this.profile) {
          this.profile.images.push(photo);
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
        }
        this.uploadingPhoto = false;
      });
    } catch (error) {
      runInAction(() => {
        this.uploadingPhoto = false;
      });
      console.log(error);
      toast.error("Problem uploading Photo");
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    this.setMainLoading = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      runInAction(() => {
        this.profile!.images.find((a) => a.isMain)!.isMain = false;
        this.profile!.images.find((a) => a.id === photo.id)!.isMain = true;
        this.profile!.image = photo.url;
        this.rootStore.userStore.user!.image = photo.url;
        this.setMainLoading = false;
        // window.location.reload(false);
      });
    } catch (error) {
      toast.error("Problem setting photo as main!");
      runInAction(() => {
        this.setMainLoading = false;
      });
      // console.log(error);
    }
  };

  @action deletePhoto = async (photo: IPhoto) => {
    this.loading = true; //note this could bring errors
    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        this.profile!.images = this.profile!.images.filter(
          (a) => a.id !== photo.id
        );
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem deleting photo");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action updateProfile = async (profile: Partial<IProfile>) => {
    try {
      await agent.Profiles.updateProfile(profile);
      runInAction(() => {
        if (
          profile.displayName !== this.rootStore.userStore.user!.displayName
        ) {
          this.rootStore.userStore.user!.displayName = profile.displayName!;
        }
        this.profile = { ...this.profile!, ...profile };
      });
    } catch (error) {
      toast.error("Problem updating profile");
    }
  };
}
