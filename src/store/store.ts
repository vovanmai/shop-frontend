import { configureStore } from '@reduxjs/toolkit'
import userAuthReducer from './user/auth/authSlice'
import appSlice from "./appSlice";

const store = configureStore({
  reducer: {
    app: appSlice,
    userAuth: userAuthReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store