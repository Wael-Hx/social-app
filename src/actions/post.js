import {
  UPLOADING,
  UPLOAD_FAIL,
  UPLOAD_SUCCESS,
  GET_POSTS,
  POSTS_ERROR,
  COMMENT_POSTED,
  COMMENT_ERROR,
  COMMENT_DELETED,
  POST_DELETED,
  LIKE_POST,
  UNLIKE,
  VIEW_POST,
} from "./types";
import { db, storage } from "../firebase";
import { firestore } from "firebase/app";

export const uploadFile = (fileName, file, title, userId, userAvatar, id) => (
  dispatch
) => {
  if (!title) {
    return dispatch({
      type: UPLOAD_FAIL,
      payload: "Add title first",
    });
  }
  const uploadTask = storage.ref(`files/${fileName}`).put(file);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      let progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      dispatch({
        type: UPLOADING,
        payload: progress,
      });
    },
    (error) => {
      dispatch({
        type: UPLOAD_FAIL,
        payload: error,
      });
    },
    () => {
      storage
        .ref("files")
        .child(fileName)
        .getDownloadURL()
        .then((url) => {
          db.collection("posts")
            .add({
              timestamp: firestore.FieldValue.serverTimestamp(),
              title: title,
              fileURL: url,
              userId: userId,
              id: id,
              avatar: userAvatar,
              comments: [],
              likes: [],
            })
            .then((doc) => {
              dispatch({
                type: UPLOAD_SUCCESS,
                payload: { url, postId: doc.id },
              });
            });
        });
    }
  );
};

export const deletePost = (postId, fileUrl, history, isViewActive) => async (
  dispatch
) => {
  try {
    await Promise.all([
      db.collection("posts").doc(postId).delete(),
      storage.refFromURL(fileUrl).delete(),
    ]);
    if (!isViewActive) {
      dispatch({
        type: POST_DELETED,
        payload: { postId: postId, message: "post deleted successfully" },
      });
    } else {
      dispatch({
        type: POST_DELETED,
        payload: { postId: postId, message: "post deleted successfully" },
      });
      history.push("/");
    }
  } catch (err) {
    dispatch({
      type: POSTS_ERROR,
      payload: err.message,
    });
  }
};

// get posts realtime listener : removed to minimize db reads

export const getPosts = (setUnsubscribe) => async (dispatch) => {
  try {
    const unsubscribe = db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        let posts = [];
        snapshot.docs.forEach((doc) => {
          posts = [...posts, { ...doc.data(), postId: doc.id }];
        });
        dispatch({
          type: GET_POSTS,
          payload: posts,
        });
        setUnsubscribe(unsubscribe);
      });
  } catch (err) {
    dispatch({
      type: POSTS_ERROR,
      payload: err.message,
    });
  }
};
// get posts simple get request
export const getPostsDefault = () => async (dispatch) => {
  try {
    let posts = [];
    let queryPosts = await db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .get();
    queryPosts.docs.forEach((doc) => {
      posts = [...posts, { ...doc.data(), postId: doc.id }];
    });
    dispatch({
      type: GET_POSTS,
      payload: posts,
    });
  } catch (err) {
    dispatch({
      type: POSTS_ERROR,
      payload: err.message,
    });
  }
};
//go to post
export const goToPost = (postId, setUnsubscribe) => async (dispatch) => {
  try {
    const unsubscribe = db
      .collection("posts")
      .doc(postId)
      .onSnapshot((snapshot) => {
        dispatch({
          type: VIEW_POST,
          payload: { ...snapshot.data(), postId: postId },
        });
        setUnsubscribe(unsubscribe);
      });
  } catch (err) {
    dispatch({
      type: POSTS_ERROR,
      payload: err.message,
    });
  }
};
// comment
export const submitComment = (postId, comment, username, userId) => async (
  dispatch
) => {
  try {
    let newComment = {
      id: userId,
      timestamp: firestore.Timestamp.fromDate(new Date()),
      text: comment,
      username: username,
      postId: postId,
    };
    await db
      .collection("posts")
      .doc(postId)
      .update({ comments: firestore.FieldValue.arrayUnion(newComment) });
    dispatch({
      type: COMMENT_POSTED,
      payload: newComment,
    });
  } catch (err) {
    dispatch({
      type: COMMENT_ERROR,
      payload: err.message,
    });
  }
};

export const deleteComment = (comment, postId) => async (dispatch) => {
  try {
    await db
      .collection("posts")
      .doc(postId)
      .update({ comments: firestore.FieldValue.arrayRemove(comment) });
    dispatch({
      type: COMMENT_DELETED,
      payload: { comment, postId },
    });
  } catch (err) {
    dispatch({
      type: COMMENT_ERROR,
      payload: err.message,
    });
  }
};
// like post
export const likePost = (postId, userId, username) => async (dispatch) => {
  try {
    let like = { id: userId, name: username };
    await db
      .collection("posts")
      .doc(postId)
      .update({ likes: firestore.FieldValue.arrayUnion(like) });
    dispatch({
      type: LIKE_POST,
      payload: { postId, like },
    });
  } catch (err) {
    dispatch({
      type: POSTS_ERROR,
      payload: err.message,
    });
  }
};

export const unlikePost = (postId, like) => async (dispatch) => {
  try {
    await db
      .collection("posts")
      .doc(postId)
      .update({
        likes: firestore.FieldValue.arrayRemove(like),
      });
    dispatch({
      type: UNLIKE,
      payload: { postId, like },
    });
  } catch (err) {
    dispatch({
      type: POSTS_ERROR,
      payload: err.message,
    });
  }
};
