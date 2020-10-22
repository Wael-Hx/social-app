import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { connect } from "react-redux";
import { updateUser } from "../../actions/auth";
import Loading from "./Loading";

const useStyles = makeStyles((theme) => ({
  iconContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
}));

const UploadBtn = ({ updateUser, uploading, uploadSuccess }) => {
  const [newAvatar, setAvatar] = useState(null);
  const classes = useStyles();
  const handleAvatarUpdate = () => {
    updateUser(newAvatar, newAvatar.name);
  };
  return (
    <div className={classes.iconContainer}>
      <input
        accept="image/*"
        className={classes.input}
        id="icon-button-file"
        type="file"
        onChange={(e) =>
          e.target.files[0] ? setAvatar(e.target.files[0]) : setAvatar(null)
        }
      />
      <label htmlFor="icon-button-file">
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="span"
        >
          <PhotoCamera />
        </IconButton>
      </label>
      {newAvatar && (
        <IconButton onClick={handleAvatarUpdate}>
          <CloudUploadOutlinedIcon />
        </IconButton>
      )}
      {uploading > 0 && !uploadSuccess ? (
        <Loading />
      ) : uploadSuccess ? (
        <CheckCircleIcon style={{ color: "green" }} />
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  uploading: state.profile.uploadProgress,
  uploadSuccess: state.profile.uploadSuccess,
});

export default connect(mapStateToProps, { updateUser })(UploadBtn);
