import React, { useEffect } from "react";
import Container from "@material-ui/core/Container";
import Post from "./Post";
import { connect } from "react-redux";
import { goToPost } from "../../actions/post";
import { withRouter } from "react-router-dom";
import Loading from "../navigation/Loading";
import { setLoading } from "../../actions/profile";
import { POST_LOADING } from "../../actions/types";

const ViewPost = ({ goToPost, postView, loading, match, user, setLoading }) => {
  useEffect(() => {
    let unsubscribe = () => {};
    goToPost(match.params.id, (func) => {
      unsubscribe = func;
    });

    return () => {
      setLoading(POST_LOADING);
      unsubscribe();
    };
  }, [match.params.id, setLoading, goToPost]);
  if (loading) {
    return (
      <div className="center">
        <Loading />
      </div>
    );
  }
  return (
    <Container className="view-container" maxWidth="lg">
      <Post
        username={postView.userId}
        postId={postView.postId}
        authorId={postView.id}
        title={postView.title}
        avatar={postView.avatar}
        fileLink={postView.fileURL}
        time={postView.timestamp}
        likes={postView.likes}
        comments={postView.comments}
        authUser={user}
        isViewActive={true}
      />
    </Container>
  );
};

const mapStateToProps = (state) => ({
  postView: state.post.view,
  loading: state.post.viewLoading,
  user: state.auth.user,
});
export default connect(mapStateToProps, { goToPost, setLoading })(
  withRouter(ViewPost)
);
