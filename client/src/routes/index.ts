import React from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/Forgot-Password";
import SignUp from "@/pages/SignUp";

const routes: RouteObject[] = [
  {
    path: "/",
    element: React.createElement(App),
    children: [
      {
        path: "",
        element: React.createElement(Home),
      },
      {
        path: "login",
        element: React.createElement(Login),
      },
      {
        path: "sign-up",
        element: React.createElement(SignUp),
      },
      {
        path: "forgot-password",
        element: React.createElement(ForgotPassword),
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
