import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { submitComment } from "../../actions/post";

const Comment = ({ submitComment, postId, username, userId }) => {
  const styles = {
    form: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      marginTop: "3px",
    },
    input: {
      padding: "15px 0 15px 15px",
      width: "inherit",
      border: " none",
      outline: "none",
      fontSize: "0.9em",
      fontFamily: "inherit",
    },
    button: {
      padding: "10px",
      backgroundColor: "inherit",
      border: "none",
      cursor: "pointer",
      outline: "none",
      color: "#009dff",
      fontWeight: "bold",
      fontFamily: "Raleway",
    },
  };

  const [comment, setComment] = useState("");
  const handleComment = (e) => {
    if (!comment) {
      e.preventDefault();
      return alert("comments cannot be empty");
    }
    e.preventDefault();
    submitComment(postId, comment, username, userId);
    setComment("");
  };
  return (
    <form onSubmit={(e) => handleComment(e)} style={styles.form}>
      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={styles.input}
        placeholder="Add a comment..."
      />
      <button type="submit" style={styles.button}>
        Post
      </button>
    </form>
  );
};

Comment.porpTypes = {
  submitComment: PropTypes.func.isRequired,
};

export default connect(null, { submitComment })(Comment);
