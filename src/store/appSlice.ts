import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from './store'

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    theme: {
    },
    router: null,
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = {...state.theme, ...action.payload}
    },
    setRouter: (state, action) => {
      state.router = action.payload
    },
  },
})

export const { setTheme, setRouter } = appSlice.actions

export const getTheme = (state: RootState) => state.app.theme
export const getRouter = (state: RootState) => state.app.router

export default appSlice.reducer