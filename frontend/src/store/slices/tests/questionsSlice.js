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
// Submit Answers
export const submitAnswers = createAsyncThunk(
  "questions/submitAnswers",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.post(
        `/tests/answer/${params.id}`,
        params.result ?? []
      );
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
    submitIsLoading: false,
    submitError: null,
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
      state.submitError = null;
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
    // Submit Answers
    builder
      .addCase(submitAnswers.pending, (state) => {
        state.submitError = null;
        state.submitIsLoading = true;
      })
      .addCase(submitAnswers.fulfilled, (state) => {
        state.submitError = null;
        state.submitIsLoading = false;
        state.status = true;
        state.message = "Answers submited successfully";
      })
      .addCase(submitAnswers.rejected, (state, action) => {
        state.submitIsLoading = false;
        state.submitError = action.payload;
        state.status = true;
        state.message = "There is an error please try again letter";
      });
  },
});
export default questionsSlice.reducer;
export const { questionsOperationCompleted } = questionsSlice.actions;
