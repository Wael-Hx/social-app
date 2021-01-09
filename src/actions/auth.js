import { auth, db, storage } from "../firebase";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  LOGOUT,
  LOGOUT_ERROR,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  PROFILE_ERROR,
  USER_DELETED,
  AVATAR_UP,
  AVATAR_UP_FAIL,
  AVATAR_UP_SUCCESS,
} from "./types";

export const registerUser = (history, email, username, password) => async (
  dispatch
) => {
  try {
    if (!username) {
      return dispatch({
        type: REGISTER_FAIL,
        payload: { code: "username", message: "a username is required" },
      });
    }

    const queryUser = await db.collection("profiles").doc(username).get();
    console.log(queryUser);
    if (queryUser.exists) {
      return dispatch({
        type: REGISTER_FAIL,
        payload: { code: "username", message: "username taken" },
      });
    }

    let newUser = await auth.createUserWithEmailAndPassword(email, password);

    if (newUser) {
      await Promise.all([
        newUser.user.updateProfile({
          displayName: username,
        }),
        db.collection("profiles").doc(username).set({
          userId: newUser.user.uid,
          avatar: "",
          username,
        }),
      ]);
      /*  newUser.user.sendEmailVerification(); */
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

export const logout = (history, redirected) => async (dispatch) => {
  try {
    await auth.signOut();
    dispatch({
      type: LOGOUT,
    });
    redirected ? history.push("/auth") : history.push("/");
  } catch (err) {
    dispatch({
      type: LOGOUT_ERROR,
      payload: err.message,
    });
  }
};
//update user
export const updateUser = (newAvatar, avatarName, username) => (dispatch) => {
  const uploadTask = storage.ref(`avatars/${avatarName}`).put(newAvatar);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      let progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      dispatch({
        type: AVATAR_UP,
        payload: progress,
      });
    },
    (error) => {
      dispatch({
        type: AVATAR_UP_FAIL,
        payload: error,
      });
    },
    () => {
      storage
        .ref("avatars")
        .child(avatarName)
        .getDownloadURL()
        .then((url) => {
          auth.currentUser.updateProfile({
            photoURL: url,
          });
          db.collection("profiles").doc(username).set(
            {
              avatar: url,
            },
            { merge: true }
          );
          dispatch({
            type: AVATAR_UP_SUCCESS,
            payload: url,
          });
        });
    }
  );
};

//delete user

export const deleteAccount = (history, redirected) => async (dispatch) => {
  try {
    let user = auth.currentUser;
    await user.delete();
    dispatch({
      type: USER_DELETED,
    });
    history.push("/");
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: err.message,
    });
    dispatch(logout(history, redirected));
  }
};
