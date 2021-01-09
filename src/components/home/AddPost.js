import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import Container from "@material-ui/core/Container";
import Chip from "@material-ui/core/Chip";
import { connect } from "react-redux";
import { withRouter, Link, Redirect } from "react-router-dom";
import { uploadFile } from "../../actions/post";
import Loading from "../navigation/Loading";
import { formatString } from "../../helpers";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
  chip: {
    height: "fit-content",
    padding: "5px 0",
    "& span": {
      whiteSpace: "pre-wrap",
    },
  },
}));

const font = {
  fontSize: "0.9em",
  fontFamily: "Raleway",
};

const AddPost = ({
  uploadFile,
  authState,
  upload: { uploadProgress, loading, uploadSuccess, fileUrl, postId, errors },
}) => {
  const classes = useStyles();
  const [title, setTitle] = useState("");
  const [customError, setError] = useState("");
  const [file, setFile] = useState(null);
  const handleUpload = () => {
    if (file.size / 1024 / 1024 < 1.5) {
      setError("");
      uploadFile(
        file.name,
        file,
        title.trim(),
        authState.user.username,
        authState.user.avatar,
        authState.user.uid
      );
    } else {
      setError("you are only allowed to upload images less than 1.5mb");
    }
  };

  if (authState.loading) {
    return <Loading />;
  } else if (!authState.authState) {
    return <Redirect to="/" />;
  }

  return (
    <Container disableGutters maxWidth="sm">
      <div className="upload">
        <TextField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          label="Add a description to your post"
          multiline
          variant="outlined"
          style={{
            alignSelf: "flex-start",
            minWidth: "360px",
            marginLeft: "8px",
          }}
        />
        <div
          style={
            uploadSuccess
              ? {
                  backgroundImage: `url(${fileUrl})`,
                  backgroundSize: "100% 100%",
                  backgroundColor: "none",
                }
              : { backgroundColor: "silver" }
          }
          className="img-placeholder"
        ></div>
        {loading ? (
          <progress value="0" max="100"></progress>
        ) : (
          <progress value={uploadProgress} max="100"></progress>
        )}
        <Chip
          variant="outlined"
          size="small"
          label="only Admin can create posts for the moment , you can upload but files wont be saved"
          color="primary"
          classes={{ root: classes.chip }}
        />
        {(errors || customError) && (
          <Chip
            variant="outlined"
            size="small"
            label={errors ?? "error cannot upload this file, try again later"}
            color="secondary"
          />
        )}
        <div>
          <input
            accept="image/*"
            className={classes.input}
            id="contained-button-file"
            multiple
            type="file"
            onChange={(e) =>
              e.target.files[0] ? setFile(e.target.files[0]) : setFile(null)
            }
          />
          <label htmlFor="contained-button-file">
            <Button
              style={font}
              variant="contained"
              color="default"
              component="span"
              startIcon={<FileCopyIcon />}
            >
              Select
            </Button>
          </label>
          <label htmlFor="icon-button-file"></label>
          <h2 style={font}>{file ? formatString(file.name) : null}</h2>

          <Button
            style={font}
            color="primary"
            startIcon={<CloudUploadIcon />}
            variant="contained"
            disabled={!file}
            onClick={handleUpload}
          >
            Upload
          </Button>
          <Link to={uploadSuccess ? `/post/${postId}` : "/"}>
            <Button
              style={font}
              color={uploadSuccess ? "primary" : "default"}
              endIcon={uploadSuccess && <SendIcon />}
              variant="contained"
            >
              {uploadSuccess ? "Post" : "cancel"}
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
};

AddPost.propTypes = {
  authState: PropTypes.object.isRequired,
  upload: PropTypes.object.isRequired,
  uploadFile: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  authState: state.auth,
  upload: state.post,
});

export default connect(mapStateToProps, { uploadFile })(withRouter(AddPost));
