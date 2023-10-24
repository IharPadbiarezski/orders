import { createSlice } from "@reduxjs/toolkit";

export const goodsSlice = createSlice({
  name: "goods",
  initialState: {
    data: [],
  },
  reducers: {
    addGoods: (state: any, action: any) => {
      let newRowData = [...state.data];
      newRowData = action.payload.concat(newRowData);
      return {
        ...state,
        data: newRowData,
      };
    },
  },
});

export const { addGoods } = goodsSlice.actions;
export default goodsSlice.reducer;
