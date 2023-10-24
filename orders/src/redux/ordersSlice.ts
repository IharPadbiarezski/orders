import { createSlice } from '@reduxjs/toolkit'

export const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        rowData: [],
    },
    reducers: {
        updateOrders: (state: any, action: any) => {
            let newRow = action.payload;
            let newRowData = [...state.rowData];
            let index = newRowData.findIndex(element => element?.id === newRow?.id);
            newRowData.splice(index, 1, newRow);
            return {
                ...state,
                rowData: newRowData
            };
        },
        addOrders: (state: any, action: any) => {
            let newRowData = [...state.rowData];
            newRowData = action.payload.concat(newRowData);
            return {
              ...state,
              rowData: newRowData,
            };
          },
    }
})


export const selectRows = (state: any) => state.orders.rowData
export const { addOrders, updateOrders } = ordersSlice.actions
export default ordersSlice.reducer