import React, { useEffect } from "react";
import Container from "@material-ui/core/Container";
import Post from "./Post";
import { connect } from "react-redux";
import { goToPost } from "../../actions/post";
import { withRouter } from "react-router-dom";
import Loading from "../navigation/Loading";

const ViewPost = ({ goToPost, postView, loading, match, user }) => {
  useEffect(() => {
    let unsubscribe = () => {};
    goToPost(match.params.id, (func) => {
      unsubscribe = func;
    });

    return () => {
      unsubscribe();
    };
  }, [match.params.id, goToPost]);
  if (loading) {
    return <Loading />;
  }
  if (!postView.fileURL) {
    return <Loading />;
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
export default connect(mapStateToProps, { goToPost })(withRouter(ViewPost));
