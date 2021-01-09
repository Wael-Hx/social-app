import React, { useState } from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ShareIcon from "@material-ui/icons/Share";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import Comment from "./Comment";
import BackspaceOutlinedIcon from "@material-ui/icons/BackspaceOutlined";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import FavoriteOutlinedIcon from "@material-ui/icons/FavoriteOutlined";
import { connect } from "react-redux";
import {
  deleteComment,
  deletePost,
  likePost,
  unlikePost,
} from "../../actions/post";
import { Link, withRouter } from "react-router-dom";
import { relativeTime } from "../../helpers";

const Post = ({
  isViewActive,
  authorId,
  comments,
  postId,
  authUser,
  avatar,
  username,
  fileLink,
  title,
  time,
  likes,
  loggedInUser: { authState, user },
  deleteComment,
  deletePost,
  likePost,
  unlikePost,
  history,
}) => {
  const commentStyle = {
    display: "flex",
    alignItems: "center",
    marginLeft: "7px",
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLike = () => {
    if (!authState) {
      console.log("login first");
    } else {
      let likeStatus = likes.some((like) => like.id === user.uid);

      likeStatus
        ? unlikePost(postId, { id: user.uid, name: user.username })
        : likePost(postId, user.uid, user.username);
    }
  };
  const userAction = () => {
    handleClose();
    deletePost(postId, fileLink, history, isViewActive);
  };

  return (
    <article className={isViewActive ? "post post-container" : "post"}>
      <div className={isViewActive ? "post-main-view" : "post-main"}>
        <div className="user-info">
          <Avatar
            component={Link}
            to={`/${username}`}
            src={avatar}
            alt={username}
          />
          <Link to={`/${username}`}>
            <h3>{username}</h3>
          </Link>
          <div style={{ marginLeft: "auto" }}>
            <Button
              style={{ padding: "5px", minWidth: "fit-content" }}
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {!isViewActive && (
                <Link to={`/post/${postId}`}>
                  <MenuItem onClick={handleClose}>Go to Post</MenuItem>
                </Link>
              )}

              {authorId === authUser?.uid ? (
                <MenuItem onClick={userAction}>Delete</MenuItem>
              ) : null}
            </Menu>
          </div>
        </div>

        <Link to={`/post/${postId}`}>
          <img className="post-img" loading="lazy" src={fileLink} alt="post" />
        </Link>

        <div className="post-actions">
          <IconButton onClick={handleLike} style={{ padding: "0" }}>
            {!authState && null}
            {likes.some((like) => like.id === user?.uid) ? (
              <FavoriteOutlinedIcon style={{ color: "#AE1D60" }} />
            ) : (
              <FavoriteBorderIcon fontSize="default" />
            )}
          </IconButton>
          <Link to={`/post/${postId}`}>
            <IconButton style={{ padding: "0" }}>
              <ChatBubbleOutlineIcon fontSize="default" />
            </IconButton>
          </Link>
          <IconButton style={{ padding: "0" }}>
            <ShareIcon fontSize="default" />
          </IconButton>
          <span> {relativeTime(time.seconds)}</span>
        </div>
      </div>
      <div
        className={
          isViewActive ? "comments-container-view" : "comments-container"
        }
      >
        <h4 style={{ marginBottom: "10px" }}>
          <strong>{username} :</strong> {title}
        </h4>
        <div>
          {comments.map((comment, index) => (
            <h4 style={commentStyle} key={index}>
              <strong style={{ marginRight: "5px" }}>{comment.username}</strong>
              {comment.text}
              {!authState
                ? null
                : user?.uid === comment.id && (
                    <BackspaceOutlinedIcon
                      fontSize="inherit"
                      style={{
                        cursor: "pointer",
                        marginLeft: "auto",
                        alignSelf: "flex-end",
                      }}
                      onClick={() => deleteComment(comment, postId)}
                    />
                  )}
            </h4>
          ))}
        </div>
        {authState && (
          <Comment
            postId={postId}
            username={authUser?.username}
            userId={authUser?.uid}
          />
        )}
      </div>
    </article>
  );
};
Post.propTypes = {
  comments: PropTypes.array.isRequired,
  likes: PropTypes.array.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  loggedInUser: state.auth,
});
export default connect(mapStateToProps, {
  deleteComment,
  deletePost,
  likePost,
  unlikePost,
})(withRouter(Post));
