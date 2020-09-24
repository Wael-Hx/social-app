import {
  UPLOADING,
  UPLOAD_FAIL,
  UPLOAD_SUCCESS,
  GET_POSTS,
  POSTS_ERROR,
  COMMENT_ERROR,
} from "../actions/types";

const initialState = {
  uploadProgress: 0,
  uploadSuccess: false,
  fileUrl: "",
  loading: true,
  posts: [],
  errors: "",
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case UPLOADING:
      return { ...state, uploadProgress: payload, loading: false };
    case UPLOAD_FAIL: {
      return { ...state, errors: payload, loading: false };
    }
    case UPLOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        uploadSuccess: true,
        fileUrl: payload,
      };
    case GET_POSTS:
      return { ...state, posts: payload, loading: false };
    case POSTS_ERROR:
      return { ...state, loading: false, errors: payload };
    case COMMENT_ERROR:
      return { ...state, errors: payload, loading: false };

    default:
      return state;
  }
};
