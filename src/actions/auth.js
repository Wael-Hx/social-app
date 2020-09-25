import { auth } from "../firebase";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  LOGOUT,
  LOGOUT_ERROR,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
} from "./types";

export const registerUser = (
  history,
  email,
  username,
  password,
  avatar
) => async (dispatch) => {
  try {
    let newUser = await auth.createUserWithEmailAndPassword(email, password);

    if (newUser) {
      await newUser.user.updateProfile({
        displayName: username,
        photoURL: avatar,
      });
      dispatch({
        type: REGISTER_SUCCESS,
      });
    } else {
      newUser = null;
    }
    history.push("/");
    dispatch(currentUser());
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
      payload: err,
    });
  }
};

export const currentUser = () => (dispatch) => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      dispatch({
        type: USER_LOADED,
        payload: {
          uid: user.uid,
          username: user.displayName,
          avatar: user.photoURL,
          phone: user.phoneNumber,
          isVerified: user.emailVerified,
          anonymous: user.isAnonymous,
          tenantId: user.tenantId,
        },
      });
    } else {
      dispatch({
        type: AUTH_ERROR,
      });
    }
  });
};

export const login = (history, email, password) => async (dispatch) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
    dispatch({
      type: LOGIN_SUCCESS,
    });
    history.push("/");
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err,
    });
  }
};

export const logout = (history) => async (dispatch) => {
  try {
    await auth.signOut();
    dispatch({
      type: LOGOUT,
    });
    history.push("/");
  } catch (err) {
    dispatch({
      type: LOGOUT_ERROR,
      payload: err.message,
    });
  }
};
