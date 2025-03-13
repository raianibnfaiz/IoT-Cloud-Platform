import * as React from "react";
import './index.css';
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/home/Home';
import About from "./pages/About/About";
import Root from "./root/Root";
import { Register } from "./pages/Auth/Register/Register";
import { Login } from "./pages/Auth/Login/Login";
import AuthProvider from "./context/AuthContext/AuthProvider";
import Features from "./pages/Features/Features";
import PrivateRoute from "./privateRoute/PrivateRoute";
import Profile from "./pages/Profile/Profile";
import ViewAllPurchases from "./pages/Billing/ViewAllPurchases";
import EditBillingInformation from "./pages/Billing/EditBillingInformation";
import Settings from "./pages/Settings/Settings";
import DeveloperZone from "./pages/DeveloperZone/DeveloperZone";
import Billing from "./pages/Billing/Billing";
import TemplateDetail from "./pages/Template/TemplateDetail";
import Dashboard from "./pages/Dashboard/Dashboard";
import Playground from "./pages/Playground/Playground";
import PreviewScreen from "./pages/Preview/PreviewScreen";
import Pricing from "./pages/Pricing/Pricing";
import Enterprise from "./pages/Enterprise/Enterprise";
import Developers from "./pages/Developers/Developers";
import CaseStudies from "./pages/CaseStudies/CaseStudies";
import Company from "./pages/Company/Company";
import ComingSoon from "./pages/NotFound/ComingSoon";

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
        element: 
            <Features></Features>
        
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
      {
        path: "playground",
        element: <PrivateRoute>
            <Playground></Playground>
        </PrivateRoute>,
      },
      {
        path: "playground/:templateId",
        element: <PrivateRoute>
            <Playground></Playground>
        </PrivateRoute>,
      },
      {
        path: "preview/:templateId",
        element: <PrivateRoute>
            <PreviewScreen></PreviewScreen>
        </PrivateRoute>,
      },
      {
        path: "dashboard",
        element: <PrivateRoute>
            <Dashboard></Dashboard>
        </PrivateRoute>
      },
      {
        path: "template/:templateId",
        element: <TemplateDetail />,
      },
      {
        path: "pricing",
        element: <Pricing />,
      },
      {
        path: "enterprise",
        element: <Enterprise />,
      },
      {
        path: "developers",
        element: <Developers />,
      },
      {
        path: "case-studies",
        element: <CaseStudies />,
      },
      {
        path: "company",
        element: <Company />,
      },
      {
        path: "*",
        element: <ComingSoon />,
      }
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