import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import "./App.css";
import Orders from "./pages/Orders/Orders";
import AddOrder from "./pages/AddOrder/AddOrder";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "/",
        element: <Orders />,
      },
      {
        path: "/order",
        element: <AddOrder />,
      },
    ],
  },
  {
    path: "/",
    element: <Orders />,
  },
  {
    path: "/order",
    element: <AddOrder />,
  },
]);

function App() {
  return (
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

export default App;
