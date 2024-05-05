import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
  id: string;
  token: string;
  username: string;
}

const initialState: AuthState = {
  id: '',
  token: '',
  username: ''
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setID: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setID, setToken, setUsername } = authSlice.actions

export default authSlice.reducer