import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface User {
    name:string;
    email: string;
    phone:string;
    password:string;
}
  
interface AuthState {
  hasSignedUp: boolean;
  user: User | null;
}

const initialState: AuthState = {
  hasSignedUp: false,
  user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      signUp: (state, action: PayloadAction<User>) => {
        state.hasSignedUp = true;
        state.user = action.payload;
        //console.log("value:", state.hasSignedUp);
      },
      login: (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      },
      resetPass:(state, action: PayloadAction<User>)=>{
        state.user = action.payload;
       // console.log("changed password:", state.user.password);
      }
    },
  });
  
export const { signUp, login, resetPass } = authSlice.actions;
export default authSlice.reducer;
  