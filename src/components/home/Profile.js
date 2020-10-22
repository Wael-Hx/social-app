import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getProfile } from "../../actions/profile";
import Loading from "../navigation/Loading";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import { Link } from "react-router-dom";
import "./profile.css";
import SettingsList from "../navigation/SettingsList";
import UploadBtn from "../navigation/UploadBtn";

const Profile = ({
  getProfile,
  authUser,
  profile: { loading, profileData, updatedAvatarLink },
  match,
  location: { state },
}) => {
  useEffect(() => {
    console.log("user profile");
    getProfile(match.params.id);
  }, [getProfile, match.params.id]);
  const linkStyles = {
    textDecoration: "none",
    color: "inherit",
    cursor: "pointer",
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <Container
      className="profile-container"
      style={{ marginTop: "100px" }}
      maxWidth="lg"
    >
      <div className="profile">
        <Avatar
          style={{ width: "100px", height: "100px" }}
          src={updatedAvatarLink ? updatedAvatarLink : state.avatar}
          alt={state.username}
        />
        {authUser.user?.uid === match.params.id ? <UploadBtn /> : null}
        <div>
          <h2>{state.username}</h2>
          {authUser.user?.uid === match.params.id ? <SettingsList /> : null}
        </div>
      </div>
      <hr />
      <div className="gallerie">
        {profileData.map((post) => {
          return (
            <Link
              key={post.postId}
              style={linkStyles}
              to={`/post/${post.postId}`}
            >
              <div
                style={
                  loading
                    ? {
                        backgroundColor: "silver",
                        width: "360px",
                        height: "210px",
                      }
                    : {
                        backgroundImage: `url(${post.fileURL})`,
                        backgroundSize: "100% 100%",
                        backgroundColor: "none",
                        width: "360px",
                        height: "210px",
                      }
                }
              ></div>
            </Link>
          );
        })}
      </div>
    </Container>
  );
};

Profile.propTypes = {
  getProfile: PropTypes.func.isRequired,
  authUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  authUser: state.auth,
  profile: state.profile,
});
export default connect(mapStateToProps, { getProfile })(Profile);
