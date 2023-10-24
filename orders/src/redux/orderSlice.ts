import { createSlice } from '@reduxjs/toolkit'

export const orderSlice = createSlice({
    name: 'order',
    initialState: {
        id: '0',
        client: '',
        phone: '',
        comment: '',
        address: '',
        goodsPrice: 0,
        deliveryPrice: 0,
        price: 0,
        date: '',
        state: '1',
        selectedCountry: 'RU',
        mask: '+7 (999) 999-99-99',
    },
    reducers: {
        update: (state: any, action: any) => {
            state.id = action.payload.id;
            state.client = action.payload.client;
            state.countryCode = action.payload.countryCode;
            state.selectedCountry = action.payload.selectedCountry;
            state.phone = action.payload.phone;
            state.comment = action.payload.comment;
            state.address = action.payload.address;
            state.price = action.payload.price;
            state.goodsPrice = action.payload.goodsPrice;
            state.deliveryPrice = action.payload.deliveryPrice;
            state.date = action.payload.date;
            state.status = action.payload.status;
            state.mask = action.payload.mask;
        }
    }
})

export const { update } = orderSlice.actions
export default orderSlice.reducer