import {
  GET_PROFILE,
  PROFILE_ERROR,
  AVATAR_UP_SUCCESS,
  AVATAR_UP_FAIL,
  AVATAR_UP,
  PROFILE_LOADING,
} from "../actions/types";

const initialState = {
  loading: true,
  userDetails: {},
  profileData: [],
  uploadProgress: 0,
  uploadSuccess: false,
  updatedAvatarLink: "",
  error: "",
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case PROFILE_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_PROFILE:
      return {
        ...state,
        uploadSuccess: false,
        userDetails: payload.profile,
        profileData: payload.userPosts,
        loading: false,
      };
    case AVATAR_UP:
      return {
        ...state,
        uploadProgress: payload,
        uploadSuccess: false,
        loading: false,
      };
    case AVATAR_UP_SUCCESS:
      return {
        ...state,
        uploadProgress: 0,
        uploadSuccess: true,
        updatedAvatarLink: payload,
        userDetails: { ...state.userDetails, avatar: payload },
        loading: false,
      };
    case AVATAR_UP_FAIL:
    case PROFILE_ERROR:
      return { ...state, error: payload, loading: false };
    default:
      return state;
  }
};
