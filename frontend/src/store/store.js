import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/auth/authSlice";
import testsSlice from "./slices/tests/testsSlice";
import questionsSlice from "./slices/tests/questionsSlice";
import usersSlice from "./slices/users/usersSlice";
const store = configureStore({
  reducer: {
    auth: authSlice,
    tests: testsSlice,
    questions: questionsSlice,
    users: usersSlice,
  },
});

export default store;
