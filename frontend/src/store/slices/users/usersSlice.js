import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

// get tests
export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.get(`/users`);
      if (res.status === 200) {
        return {
          data: res.data,
        };
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// delete test
export const deleteTest = createAsyncThunk(
  "tests/deleteTest",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.delete(`/tests/${id}`);
      if (res.status === 200) {
        return {
          id: id,
        };
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
const usersSlice = createSlice({
  name: "tests",

  initialState: {
    isLoading: false,
    error: null,
    users: [],
    operationLoading: false,
    operationError: null,
    message: "",
  },

  reducers: {
    testsOperationCompleted: (state) => {
      state.status = false;
      state.error = null;
      state.message = "";
      state.operationLoading = false;
      state.operationError = null;
    },
  },

  extraReducers: (builder) => {
    // get users
    builder
      .addCase(getUsers.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.tests = action.payload.data;
        console.log(action.payload.data);
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // delete test
    builder
      .addCase(deleteTest.pending, (state) => {
        state.operationError = null;
        state.operationLoading = true;
      })
      .addCase(deleteTest.fulfilled, (state, action) => {
        state.operationError = null;
        state.operationLoading = false;
        state.status = true;
        state.upcomingTests = state.upcomingTests.filter(
          (test) => test.id !== action.payload.id
        );
        state.message = "Test deleted successfully";
      })
      .addCase(deleteTest.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
        state.status = true;
        state.message =
          action.payload.response.data.message || "Deletion not successful";
      });
  },
});
export default usersSlice.reducer;
export const { usersOperationCompleted } = usersSlice.actions;
