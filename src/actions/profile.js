import { GET_PROFILE, PROFILE_ERROR } from "./types";
import { db } from "../firebase";

export const getProfile = (userId) => async (dispatch) => {
  try {
    let userPosts = [];
    let queryPosts = await db
      .collection("posts")
      .where("id", "==", userId)
      .orderBy("timestamp", "desc")
      .get();
    queryPosts.docs.forEach((doc) => {
      userPosts = [...userPosts, { ...doc.data(), postId: doc.id }];
    });
    dispatch({
      type: GET_PROFILE,
      payload: userPosts,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: err.message,
    });
  }
};
