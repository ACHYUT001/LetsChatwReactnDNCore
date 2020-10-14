import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Card, Header, Tab, Image, Button, Grid } from "semantic-ui-react";
import PhotoUploadWidget from "../../app/common/photoUpload/PhotoUploadWidget";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { RootStore, RootStoreContext } from "../../app/stores/rootStore";

const ProfilePhotos = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    isCurrentUser,
    uploadPhoto,
    uploadingPhoto,
    setMainPhoto,
    setMainLoading,
    deletePhoto,
    loading,
  } = rootStore.profileStore;

  const [addPhotoMode, setAddPhotoMode] = useState(
    isCurrentUser ? true : false
  );

  const handleUploadImage = (photo: Blob) => {
    uploadPhoto(photo).then(() => setAddPhotoMode(false));
  };

  const [target, setTarget] = useState<string | undefined>(undefined);
  const [delTarget, setDelTarget] = useState<string | undefined>(undefined);
  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header floated="left" icon="image" content="Photos" />
          {isCurrentUser && (
            <Button
              onClick={() => setAddPhotoMode(!addPhotoMode)}
              floated="right"
              basic
              content={addPhotoMode ? "Cancel" : "Add Photo"}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget
              uploadPhoto={handleUploadImage}
              loading={uploadingPhoto}
            />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile &&
                profile.images.map((photo) => (
                  <Card key={photo.id}>
                    <Image src={photo.url} />
                    {isCurrentUser && (
                      <Button.Group fluid widths={2}>
                        <Button
                          name={photo.id}
                          basic
                          positive
                          content="Set Main"
                          onClick={(event) => {
                            setMainPhoto(photo);
                            setTarget(event.currentTarget.name);
                          }}
                          loading={setMainLoading && target === photo.id}
                          disabled={photo.isMain}
                        />
                        <Button
                          name={photo.id}
                          disabled={photo.isMain}
                          basic
                          negative
                          icon="trash"
                          loading={loading && delTarget === photo.id}
                          onClick={(event) => {
                            deletePhoto(photo);
                            setDelTarget(event.currentTarget.name);
                          }}
                        />
                      </Button.Group>
                    )}
                  </Card>
                ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfilePhotos);
