import {
  UPLOADING,
  UPLOAD_FAIL,
  UPLOAD_SUCCESS,
  GET_POSTS,
  POSTS_ERROR,
  COMMENT_ERROR,
  VIEW_POST,
  COMMENT_POSTED,
  COMMENT_DELETED,
  POST_DELETED,
  LIKE_POST,
  UNLIKE,
  POST_LOADING,
} from "../actions/types";

const initialState = {
  uploadProgress: 0,
  uploadSuccess: false,
  fileUrl: "",
  loading: true,
  posts: [],
  view: {},
  viewLoading: true,
  errors: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case UPLOADING:
      return {
        ...state,
        uploadProgress: payload,
        errors: null,
        loading: false,
      };
    case UPLOAD_FAIL: {
      return { ...state, errors: payload, loading: false };
    }
    case UPLOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        uploadSuccess: true,
        errors: null,
        uploadProgress: 0,
        fileUrl: payload.url,
        postId: payload.postId,
      };
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        fileUrl: "",
        uploadSuccess: false,
        loading: false,
      };
    case POST_DELETED:
      return {
        ...state,
        posts: state.posts.filter((post) => post.postId !== payload.postId),
        loading: false,
      };
    case COMMENT_POSTED:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.postId === payload.postId
            ? { ...post, comments: [payload, ...post.comments] }
            : { ...post }
        ),
        loading: false,
      };
    case COMMENT_DELETED:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.postId === payload.postId
            ? {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment !== payload.comment
                ),
              }
            : { ...post }
        ),
        loading: false,
      };
    case LIKE_POST:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.postId === payload.postId
            ? { ...post, likes: [payload.like, ...post.likes] }
            : { ...post }
        ),
        loading: false,
      };
    case UNLIKE:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.postId === payload.postId
            ? {
                ...post,
                likes: post.likes.filter((like) => like.id !== payload.like.id),
              }
            : { ...post }
        ),
        loading: false,
      };
    case VIEW_POST:
      return { ...state, view: payload, viewLoading: false };
    case POSTS_ERROR:
      return { ...state, loading: false, errors: payload };
    case COMMENT_ERROR:
      return { ...state, errors: payload, loading: false };
    case POST_LOADING:
      return {
        ...state,
        viewLoading: true,
      };
    default:
      return state;
  }
};
