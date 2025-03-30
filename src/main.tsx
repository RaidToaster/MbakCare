import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import './index.css'
import Login from '@/pages/AuthPage/Login.tsx'
import HomePage from "@/pages/MainPage/HomePage.tsx";
import CustomerRegister from "@/pages/AuthPage/CustomerRegister.tsx";
import HelperRegister from "@/pages/AuthPage/HelperRegister.tsx";
import MainRegister from "@/pages/AuthPage/MainRegister.tsx";
import Register from "@/pages/old page/Register.tsx";
import SearchPage from "@/pages/MainPage/SearchPage.tsx";

const router = createBrowserRouter([
  {
    path: "/auth",
    children: [{
      path: "login",
      element: <Login/>
    },
    {
      path: "register",
      element: <MainRegister/>
    },
    {
      path: "register-customer",
      element: <CustomerRegister/>
    },
    {
      path: "register-helper",
      element: <HelperRegister/>
    }
    ],
  },
  {
    path:"/",
    element:<HomePage/>
  },
  {
    path:"/home",
    element:<HomePage/>
  },
  {
    path:"/search",
    element:<SearchPage/>
  },
  {
    path:"/hihi",
    element:<Register/>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
