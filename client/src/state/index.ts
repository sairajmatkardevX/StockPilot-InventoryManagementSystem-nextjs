import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GlobalState {
  isSidebarCollapsed: boolean;
  
}

const initialState: GlobalState = {
  isSidebarCollapsed: false,
 
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
   
  },
});

export const { setIsSidebarCollapsed } = globalSlice.actions; 
export default globalSlice.reducer;