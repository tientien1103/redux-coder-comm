import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { POSTS_PER_PAGE } from "../../app/config";
import { cloudinaryUpload } from "../../utils/cloudinary";
import { toast } from "react-toastify";

const initialState = {
  isLoading: false,
  error: null,
  postsById: {}, // postId : {}
  currentPagePosts: [], // [id, id, id,id] chỉ chứa id
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    createPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const newPost = action.payload.data;
      if (state.currentPagePosts.length % POSTS_PER_PAGE === 0)
        state.currentPagePosts.pop();
      state.postsById[newPost._id] = newPost;
      state.currentPagePosts.unshift(newPost._id);
    },
    getPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { count, posts } = action.payload.data;
      posts.forEach((post) => {
        state.postsById[post._id] = post;
        if (!state.currentPagePosts.includes(post._id))
          state.currentPagePosts.push(post._id);
      });
      state.totalPosts = count;
    },
    sendPostReactionSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { postId, reactions } = action.payload;
      state.postsById[postId].reactions = reactions;
    },
    // tranh loi don post
    resetPosts(state, action) {
      state.postsById = {};
      state.currentPagePosts = [];
    },
    deletePostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      delete state.postsById[action.payload.postId];

      state.currentPagePosts = state.currentPagePosts.filter(
        (postId) => postId !== action.payload.postId
      );
    },
    editPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { content, _id, image } = action.payload;
      state.postsById[_id].content = content;
      state.postsById[_id].image = image;
    },
  },
});

const {
  startLoading,
  hasError,
  createPostSuccess,
  getPostSuccess,
  sendPostReactionSuccess,
  resetPosts,
  deletePostSuccess,
  editPostSuccess,
} = postSlice.actions;

export const createPost =
  ({ content, image }) =>
  async (dispatch) => {
    dispatch(startLoading());
    try {
      // upload image to cloudinary
      const imageUrl = await cloudinaryUpload(image);
      const res = await apiService.post("/posts", {
        content,
        image: imageUrl,
      });
      dispatch(createPostSuccess(res.data));
    } catch (error) {
      dispatch(hasError(error.message));
    }
  };

export const getPosts =
  ({ userId, page, limit = POSTS_PER_PAGE }) =>
  async (dispatch) => {
    dispatch(startLoading());
    try {
      const params = { page, limit };
      const res = await apiService.get(`/posts/user/${userId}`, {
        params,
      });
      if (page === 1) dispatch(resetPosts());
      dispatch(getPostSuccess(res.data));
    } catch (error) {
      dispatch(hasError(error.message));
    }
  };

export const sendPostReaction =
  ({ postId, emoji }) =>
  async (dispatch) => {
    dispatch(startLoading());
    try {
      const res = await apiService.post("/reactions", {
        targetType: "Post",
        targetId: postId,
        emoji,
      });
      dispatch(
        sendPostReactionSuccess({
          postId,
          reactions: res.data.data,
        })
      );
    } catch (error) {
      dispatch(hasError(error.message));
    }
  };

export const deletePost = (postId) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const res = await apiService.delete(`/posts/${postId}`);
    dispatch(deletePostSuccess({ ...res.data.data, postId }));
    toast.success("Post deleted");
  } catch (error) {
    dispatch(hasError(error.message));
    toast.error(error.message);
  }
};

export const editPost =
  ({ postId, content, image }) =>
  async (dispatch) => {
    dispatch(startLoading());
    try {
      const imageUrl = await cloudinaryUpload(image);

      const res = await apiService.put(`/posts/${postId}`, {
        content,
        image: imageUrl,
      });
      dispatch(editPostSuccess(res.data.data));
      toast.success("Post edited");
    } catch (error) {
      dispatch(hasError(error.message));
      toast.error(error.message);
    }
  };

export default postSlice.reducer;
