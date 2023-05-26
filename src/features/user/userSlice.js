import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";
import { cloudinaryUpload } from "../../utils/cloudinary";

const initialState = {
  isLoading: false,
  error: null,
  updatedProfile: null,
  selectedUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getUserSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.selectedUser = action.payload;
    },
    updateUserProfileSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      state.updatedProfile = action.payload;
    },
  },
});

const { startLoading, hasError, getUserSuccess, updateUserProfileSuccess } =
  userSlice.actions;

export const getUser = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const res = await apiService.get(`/users/${id}`);
    dispatch(getUserSuccess(res.data.data));
  } catch (error) {
    dispatch(hasError(error.message));
    toast.error(error.message);
  }
};

export const updateUserProfile =
  ({
    userId,
    facebookLink,
    instagramLink,
    twitterLink,
    linkedinLink,
    name,
    avatarUrl,
    coverUrl,
    aboutMe,
    city,
    country,
    company,
    jobTitle,
  }) =>
  async (dispatch) => {
    dispatch(startLoading());
    try {
      const data = {
        facebookLink,
        instagramLink,
        twitterLink,
        linkedinLink,
        name,
        coverUrl,
        aboutMe,
        city,
        country,
        company,
        jobTitle,
      };
      // kt url phải là file ko
      if (avatarUrl instanceof File) {
        const imageUrl = await cloudinaryUpload(avatarUrl);
        data.avatarUrl = imageUrl;
      }
      const res = await apiService.put(`/users/${userId}`, data);
      dispatch(updateUserProfileSuccess(res.data.data));
      toast.success("Update Profile successfully");
    } catch (error) {
      dispatch(hasError(error.message));
      toast.error(error.message);
    }
  };

export default userSlice.reducer;
