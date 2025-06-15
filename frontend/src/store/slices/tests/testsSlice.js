import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

// const cookie = new Cookies();
// get tests
export const getTests = createAsyncThunk(
  "tests/getTests",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.get(`/tests`);
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
// get finished tests
export const getTeacherTestResults = createAsyncThunk(
  "tests/getTeacherTestResults",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.get(`/tests/results`);
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
// get teacher test results
export const getTeacherTestResultsDetails = createAsyncThunk(
  "tests/getTeacherTestResultsDetails",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.get(`/tests/results/${params}`);
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
//get student test result
export const getStudentTestResults = createAsyncThunk(
  "tests/getStudentTestResults",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.get(`/student/tests/results`);
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
// create Test
export const createTest = createAsyncThunk(
  "tests/createTest",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.post(`/tests`, params);
      if (res.status === 201) {
        return {
          data: res.data,
        };
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const tsetsSlice = createSlice({
  name: "tests",

  initialState: {
    isLoading: false,
    error: null,
    tests: [],
    finshedtests: [],
    teacherResults: {},
    studentResults: [],
    status: false,
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
    // get tests
    builder
      .addCase(getTests.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(getTests.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.tests = action.payload.data.exams;
      })
      .addCase(getTests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
    //get finished tests
    builder
      .addCase(getTeacherTestResults.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(getTeacherTestResults.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.finshedtests = action.payload.data;
      })
      .addCase(getTeacherTestResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
    // get teacher test results details
    builder
      .addCase(getTeacherTestResultsDetails.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(getTeacherTestResultsDetails.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.teacherResults = action.payload.data;
      })
      .addCase(getTeacherTestResultsDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
    // get student test results
    builder
      .addCase(getStudentTestResults.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(getStudentTestResults.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.studentResults = action.payload.data.results;
      })
      .addCase(getStudentTestResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
    // create test
    builder
      .addCase(createTest.pending, (state) => {
        state.operationError = null;
        state.operationLoading = true;
      })
      .addCase(createTest.fulfilled, (state) => {
        state.operationError = null;
        state.operationLoading = false;
        state.status = true;
        state.message = "The test has been created successfully";
      })
      .addCase(createTest.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
        state.status = true;
        state.message = "There is an error please try again letter";
      });
  },
});
export default tsetsSlice.reducer;
export const { testsOperationCompleted } = tsetsSlice.actions;
