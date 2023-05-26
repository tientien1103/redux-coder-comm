import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { COMMENTS_PER_POST } from "../../app/config";
import { toast } from "react-toastify";

const initialState = {
  isLoading: false,
  error: null,
  commentsById: {}, //commentId : {data}
  commentsByPost: {}, // chỉ lưu id
  currentPageByPost: {},
  totalCommentsByPost: {},
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    createCommentSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },
    getCommentsSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { comments, postId, page, count } = action.payload;
      comments.forEach(
        (comment) => (state.commentsById[comment._id] = comment)
      );

      state.commentsByPost[postId] = comments
        .map((comment) => comment._id)
        .reverse();
      state.totalCommentsByPost[postId] = count;
      state.currentPageByPost[postId] = page;
    },
    sendCommentReactionSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { commentId, reactions } = action.payload;
      state.commentsById[commentId].reactions = reactions;
    },
    deleteCommentSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { post } = action.payload;
      delete state.commentsById[action.payload.commentId];

      state.commentsByPost[post] = state.commentsByPost[post]?.filter(
        (comment_id) => comment_id !== action.payload.commentId
      );

      state.totalCommentsByPost[post] -= 1; //state.commentsByPost[post].length;
    },
  },
});
const {
  startLoading,
  hasError,
  createCommentSuccess,
  getCommentsSuccess,
  sendCommentReactionSuccess,
  deleteCommentSuccess,
} = commentSlice.actions;
export const createComment =
  ({ postId, content }) =>
  async (dispatch) => {
    dispatch(startLoading());
    try {
      const res = await apiService.post("/comments", {
        content,
        postId,
      });
      dispatch(createCommentSuccess(res.data));
      dispatch(getComments({ postId }));
    } catch (error) {
      dispatch(hasError(error.message));
    }
  };

export const getComments =
  ({ postId, page = 1, limit = COMMENTS_PER_POST }) =>
  async (dispatch) => {
    dispatch(startLoading());
    try {
      const params = { page: page, limit: limit };
      const res = await apiService.get(`/posts/${postId}/comments`, {
        params,
      });
      dispatch(getCommentsSuccess({ ...res.data.data, postId, page }));
    } catch (error) {
      dispatch(hasError(error.message));
    }
  };

export const sendCommentReaction =
  ({ commentId, emoji }) =>
  async (dispatch) => {
    dispatch(startLoading());
    try {
      const res = await apiService.post("/reactions", {
        targetType: "Comment",
        targetId: commentId,
        emoji,
      });
      dispatch(
        sendCommentReactionSuccess({
          commentId,
          reactions: res.data.data,
        })
      );
    } catch (error) {
      dispatch(hasError(error.message));
    }
  };
export const deleteComment = (commentId) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const res = await apiService.delete(`/comments/${commentId}`);
    dispatch(deleteCommentSuccess({ ...res.data.data, commentId }));

    toast.success("Comment deleted");
  } catch (error) {
    dispatch(hasError(error.message));
    toast.error(error.message);
  }
};
export default commentSlice.reducer;
