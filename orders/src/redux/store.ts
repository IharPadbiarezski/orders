import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "./orderSlice";
import ordersReducer from "./ordersSlice";
import goodsReducer from "./goodsSlice";
import clientsReducer from "./clientsSlice";

export const store = configureStore({
  reducer: {
    order: orderReducer,
    orders: ordersReducer,
    clients: clientsReducer,
    goods: goodsReducer,
  },
});
