import * as React from "react";
import './index.css';
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/home/Home'; // Make sure this path is correct
import About from "./pages/About/About";
import Root from "./root/Root";
import { Register } from "./pages/Register/Register";
import { Login } from "./pages/Login/Login";
import AuthProvider from "./context/AuthContext/AuthProvider";
import Features from "./pages/Features/Features";
import PrivateRoute from "./privateRoute/PrivateRoute";
import Profile from "./pages/Profile/Profile";
import ViewAllPurchases from "./pages/Billing/ViewAllPurchases";
import EditBillingInformation from "./pages/Billing/EditBillingInformation";
import Settings from "./pages/Settings/Settings";
import DeveloperZone from "./pages/DeveloperZone/DeveloperZone";
import Billing from "./pages/Billing/Billing";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      {
        path: "/",
        element: <Home />, 
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "features",
        element: <PrivateRoute>
            <Features></Features>
        </PrivateRoute>,
      },
      {
        path: "profile",
        element: <PrivateRoute>
            <Profile></Profile>
        </PrivateRoute>,
      },
      {
        path: "billing",
        element: <PrivateRoute>
            <Billing></Billing>
        </PrivateRoute>,
      },
      {
        path: "view-all-purchases",
        element: <PrivateRoute>
            <ViewAllPurchases></ViewAllPurchases>
        </PrivateRoute>,
      },
      {
        path: "edit-billing-information",
        element: <PrivateRoute>
            <EditBillingInformation></EditBillingInformation>
        </PrivateRoute>,
      },
      {
        path: "settings",
        element: <PrivateRoute>
            <Settings></Settings>
        </PrivateRoute>,
      },
      {
        path: "developer",
        element: <PrivateRoute>
            <DeveloperZone></DeveloperZone>
        </PrivateRoute>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    
  </React.StrictMode>
);