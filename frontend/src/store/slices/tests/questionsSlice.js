import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

// get questions
export const getQuestions = createAsyncThunk(
  "questions/getQuestions",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.get(`tests/${params}`);
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

const questionsSlice = createSlice({
  name: "questions",

  initialState: {
    isLoading: false,
    error: null,
    questionsData: {
      testName: "",
      questions: [],
    },
    status: false,
    message: "",
  },

  reducers: {
    questionsOperationCompleted: (state) => {
      state.status = false;
      state.error = null;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    // get questions
    builder
      .addCase(getQuestions.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(getQuestions.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.questionsData = action.payload.data.exam;
      })
      .addCase(getQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});
export default questionsSlice.reducer;
export const { questionsOperationCompleted } = questionsSlice.actions;
