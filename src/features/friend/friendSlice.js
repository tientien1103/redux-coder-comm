import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";

const initialState = {
  isLoading: false,
  error: null,
  currentPageUsers: [], //[userId]
  usersById: {}, //quản lí dữ liệu user
  totalPage: 1,
  totalUsers: 0,
  // tab: 'string'   // => friends || requests|| add_friend || sent_requests
};

const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;

      state.currentPageUsers = [];
      state.usersById = {};
      state.totalUsers = 0;
    },
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { users, count, totalPages } = action.payload;
      users.forEach((user) => (state.usersById[user._id] = user));
      state.currentPageUsers = users.map((user) => user._id);
      state.totalPage = totalPages;
      state.totalUsers = count;
    },
    sendFriendRequestSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { targetUserId, ...friendship } = action.payload;
      state.usersById[targetUserId].friendship = friendship;
    },
    declineRequestSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { targetUserId, ...friendship } = action.payload;
      state.usersById[targetUserId].friendship = friendship;
    },
    acceptRequestSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { targetUserId, ...friendship } = action.payload;
      state.usersById[targetUserId].friendship = friendship;
    },
    cancelRequestSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { targetUserId } = action.payload;
      state.usersById[targetUserId].friendship = null;
    },
    removeFriendSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { targetUserId } = action.payload;
      state.usersById[targetUserId].friendship = null;
    },
    getFriendsSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { users, count, totalPages } = action.payload;
      users.forEach((user) => (state.usersById[user._id] = user));
      state.currentPageUsers = users.map((user) => user._id);
      state.totalPage = totalPages;
      state.totalUsers = count;
    },
    getFriendSuccessRequests(state, action) {
      state.isLoading = false;
      state.error = null;

      const { users, count, totalPages } = action.payload;
      users.forEach((user) => (state.usersById[user._id] = user));
      state.currentPageUsers = users.map((user) => user._id);
      state.totalPage = totalPages;
      state.totalUsers = count;
    },
    getSentSuccessRequests(state, action) {
      state.isLoading = false;
      state.error = null;

      // if(action.payload.tab !== state.tab){
      //   state.currentPageUsers = users
      // state.tab = action.payload.tab
      // const newUsersById = {}
      // users.forEach((user) => (newUsersById[user._id] = user));
      // state.usersById = newUsersById
      // }

      const { users, count, totalPages } = action.payload;
      users.forEach((user) => (state.usersById[user._id] = user));
      state.currentPageUsers = users.map((user) => user._id);
      state.totalPage = totalPages;
      state.totalUsers = count;
    },
  },
});
const {
  startLoading,
  hasError,
  getUsersSuccess,
  sendFriendRequestSuccess,
  declineRequestSuccess,
  acceptRequestSuccess,
  cancelRequestSuccess,
  removeFriendSuccess,
  getFriendsSuccess,
  getFriendSuccessRequests,
  getSentSuccessRequests,
} = friendSlice.actions;

export const getUsers =
  ({ filterName, page = 1, limit = 12 }) =>
  async (dispatch) => {
    dispatch(startLoading());
    try {
      const params = { page, limit };
      if (filterName) params.name = filterName;
      const res = await apiService.get("/users", { params });
      dispatch(getUsersSuccess(res.data.data));
    } catch (error) {
      dispatch(hasError(error.message));
    }
  };

export const getFriends =
  ({ filterName, page = 1, limit = 12 }) =>
  async (dispatch) => {
    dispatch(startLoading());
    try {
      const params = { page, limit };
      if (filterName) params.name = filterName;
      const res = await apiService.get("/friends", { params });
      dispatch(getFriendsSuccess(res.data.data));
    } catch (error) {
      dispatch(hasError(error.message));
    }
  };

export const getFriendRequests =
  ({ filterName, page = 1, limit = 12 }) =>
  async (dispatch) => {
    dispatch(startLoading());
    try {
      const params = { page, limit };
      if (filterName) params.name = filterName;
      const res = await apiService.get("/friends/requests/incoming", {
        params,
      });
      dispatch(getFriendSuccessRequests(res.data.data));
    } catch (error) {
      dispatch(hasError(error.message));
    }
  };

export const sendFriendRequest = (targetUserId) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const res = await apiService.post("/friends/requests", {
      to: targetUserId,
    });
    dispatch(sendFriendRequestSuccess({ ...res.data.data, targetUserId }));
    toast.success("Request sent");
  } catch (error) {
    dispatch(hasError(error.message));
    toast.error(error.message);
  }
};

export const declineRequest = (targetUserId) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const res = await apiService.put(`/friends/requests/${targetUserId}`, {
      status: "declined",
    });
    dispatch(declineRequestSuccess({ ...res.data.data, targetUserId }));
    toast.success("Request declined");
  } catch (error) {
    dispatch(hasError(error.message));
    toast.error(error.message);
  }
};
export const acceptRequest = (targetUserId) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const res = await apiService.put(`/friends/requests/${targetUserId}`, {
      status: "accepted",
    });
    dispatch(acceptRequestSuccess({ ...res.data.data, targetUserId }));
    toast.success("Request accepted");
  } catch (error) {
    dispatch(hasError(error.message));
    toast.error(error.message);
  }
};

export const cancelRequest = (targetUserId) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const res = await apiService.delete(`/friends/requests/${targetUserId}`);
    dispatch(cancelRequestSuccess({ ...res.data.data, targetUserId }));
    toast.success("Request cancelled");
  } catch (error) {
    dispatch(hasError(error.message));
    toast.error(error.message);
  }
};
export const removeFriend = (targetUserId) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const res = await apiService.delete(`/friends/${targetUserId}`);
    dispatch(removeFriendSuccess({ ...res.data.data, targetUserId }));
    toast.success("Friend remove");
  } catch (error) {
    dispatch(hasError(error.message));
    toast.error(error.message);
  }
};

export const getSentRequests =
  ({ filterName, page = 1, limit = 12 }) =>
  async (dispatch) => {
    dispatch(startLoading());
    try {
      const params = { page, limit };
      if (filterName) params.name = filterName;
      const res = await apiService.get("/friends/requests/outgoing", {
        params,
      });
      dispatch(getSentSuccessRequests(res.data.data));
    } catch (error) {
      dispatch(hasError(error.message));
      toast.error(error.message);
    }
  };

export default friendSlice.reducer;
