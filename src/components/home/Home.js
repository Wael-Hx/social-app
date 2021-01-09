import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { getPostsDefault } from "../../actions/post";
import { connect } from "react-redux";
import Container from "@material-ui/core/Container";
import "./home.css";
import Post from "./Post";
import Loading from "../navigation/Loading";
import { Avatar } from "@material-ui/core";
import AddPhotoAlternateOutlinedIcon from "@material-ui/icons/AddPhotoAlternateOutlined";
import { Link } from "react-router-dom";

const Home = ({
  getPostsDefault,
  posts,
  loading,
  authUser: { authState, user },
}) => {
  /*
  removed to minimize firestore db reads
  useEffect(() => {
    console.log("useeffect");
    let unsubscribe = () => {};
    getPosts((func) => {
      unsubscribe = func;
    });
    return () => unsubscribe();
  }, [getPosts]); */

  useEffect(() => {
    console.log("get posts effect");
    getPostsDefault();
  }, [getPostsDefault]);
  if (loading) {
    return <Loading />;
  }

  return (
    <Container disableGutters maxWidth="md">
      <main>
        <section className="posts">
          {posts.map((post) => {
            return (
              <Post
                key={post.postId}
                postId={post.postId}
                authUser={user}
                authorId={post.id}
                avatar={post.avatar}
                username={post.userId}
                title={post.title}
                fileLink={post.fileURL}
                time={post.timestamp}
                comments={post.comments}
                likes={post.likes}
              />
            );
          })}
        </section>
        <div className="user">
          <div>
            <Avatar
              component={user ? Link : "div"}
              to={`/${user?.username}`}
              style={{ width: "55px", height: "55px" }}
              alt={user?.username}
              src={user?.avatar}
            />
            <Link to={`/${user?.username}`}>
              <h3> {user?.username} </h3>
            </Link>
            {authState ? (
              <Link style={{ marginLeft: "auto" }} to="/add">
                <AddPhotoAlternateOutlinedIcon className="link" />
              </Link>
            ) : (
              <Link style={{ marginLeft: "10px" }} to="/auth">
                <h3>Sign In</h3>
              </Link>
            )}
          </div>
          <h4>
            This is a work in progress. <br />
            not enough data to generate recomendations.
          </h4>
        </div>
      </main>
    </Container>
  );
};

Home.porpTypes = {
  posts: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  authUser: PropTypes.object.isRequired,
  toggleView: PropTypes.bool.isRequired,
};

const mapStatetoProps = (state) => ({
  getPostsDefault: PropTypes.func.isRequired,
  posts: state.post.posts,
  loading: state.post.loading,
  toggleView: state.post.toggleView,
  authUser: state.auth,
});
export default connect(mapStatetoProps, { getPostsDefault })(Home);
