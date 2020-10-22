import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  LOGOUT,
  LOGOUT_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  AUTH_ERROR,
  USER_DELETED,
  AVATAR_UP_SUCCESS,
} from "../actions/types";

const initialState = {
  authState: false,
  loading: true,
  user: null,
  errors: { code: "", message: "" },
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return { ...state, authState: true, user: payload, loading: false };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return { ...state, authState: true, loading: false };
    case REGISTER_FAIL:
      return { ...state, errors: payload, loading: false };
    case AVATAR_UP_SUCCESS:
      return {
        ...state,
        user: { ...state.user, avatar: payload },
        loading: false,
      };
    case USER_DELETED:
    case LOGOUT:
      return { ...state, authState: false, user: null, loading: false };
    case LOGOUT_ERROR:
      return { ...state, authState: false, errors: payload, loading: false };
    case LOGIN_FAIL:
      return { ...state, errors: payload, user: null, loading: false };
    case AUTH_ERROR:
      return { ...state, user: null, loading: false };
    default:
      return state;
  }
}
