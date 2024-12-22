import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../store'

export const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState: {
    companies: [],
    email: null,
    currentUser: {
      id: null,
      name: null,
    },
  },
  reducers: {
    setCompanies: (state, action) => {
      state.companies = action.payload
    },
    setEmail: (state, action) => {
      state.email = action.payload
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload
    },
  },
})

export const { setCompanies, setEmail, setCurrentUser } = userAuthSlice.actions

export const selectCompanies = (state: RootState) => state.userAuth.companies
export const selectEmail = (state: RootState) => state.userAuth.email
export const selectCurrentUser = (state: RootState) => state.userAuth.currentUser

export default userAuthSlice.reducer