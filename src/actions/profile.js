import { GET_PROFILE, PROFILE_ERROR } from "./types";
import { db } from "../firebase";

export const getProfile = (userId) => async (dispatch) => {
  try {
    let userPosts = [];
    let queryPosts = await db
      .collection("posts")
      .where("userId", "==", userId)
      .orderBy("timestamp", "desc")
      .get();

    let profile = await db.collection("profiles").doc(userId).get();

    queryPosts.docs.forEach((doc) => {
      userPosts = [...userPosts, { ...doc.data(), postId: doc.id }];
    });
    dispatch({
      type: GET_PROFILE,
      payload: {
        profile: profile.data(),
        userPosts,
      },
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: err.message,
    });
  }
};

export const setLoading = (actionType) => (dispatch) => {
  dispatch({
    type: actionType,
  });
};
