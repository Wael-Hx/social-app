import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { getPosts } from "../../actions/post";
import { connect } from "react-redux";
import Container from "@material-ui/core/Container";
import "./home.css";
import Post from "./Post";
import Loading from "../navigation/Loading";
import { Avatar } from "@material-ui/core";
import AddPhotoAlternateOutlinedIcon from "@material-ui/icons/AddPhotoAlternateOutlined";
import { Link } from "react-router-dom";

const Home = ({ getPosts, posts, loading, authUser: { authState, user } }) => {
  useEffect(() => {
    console.log("useeffect");
    let unsubscribe = () => {};
    getPosts((func) => {
      unsubscribe = func;
    });
    return () => unsubscribe();
  }, [getPosts]);
  if (loading) {
    return <Loading />;
  }
  const linkStyles = {
    textDecoration: "none",
    color: "inherit",
    cursor: "pointer",
    marginLeft: "auto",
  };
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
              style={{ width: "55px", height: "55px" }}
              alt={user?.username}
              src={user?.avatar}
            />
            <h3> {user?.username} </h3>
            {authState ? (
              <Link style={linkStyles} to="/add">
                <AddPhotoAlternateOutlinedIcon style={{ cursor: "pointer" }} />
              </Link>
            ) : (
              <Link style={{ ...linkStyles, marginLeft: "10px" }} to="/auth">
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
  getPosts: PropTypes.func.isRequired,
  posts: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  authUser: PropTypes.object.isRequired,
};

const mapStatetoProps = (state) => ({
  getPosts: PropTypes.func.isRequired,
  posts: state.post.posts,
  loading: state.post.loading,
  authUser: state.auth,
});
export default connect(mapStatetoProps, { getPosts })(Home);
