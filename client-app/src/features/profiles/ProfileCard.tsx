import React from "react";
import { Card, Image, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { IProfile } from "../../app/models/profile";

interface IProps {
  profile: IProfile;
}

const ProfileCard: React.FC<IProps> = ({ profile }) => {
  return (
    <Card as={Link} to={`/profile/username`}>
      <Image src={profile.image || "/assets/stock_user.png"} />
      <Card.Content>
        <Card.Header>{profile.displayName}</Card.Header>
      </Card.Content>
      <Card.Content extra>
        <div>
          <Icon name="user" />
          {profile.followerCount} Followers
        </div>
      </Card.Content>
    </Card>
  );
};

export default observer(ProfileCard);
