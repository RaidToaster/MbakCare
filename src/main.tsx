import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import './index.css'
import Login from '@/pages/AuthPage/Login.tsx'
import Register from '@/pages/AuthPage/Register.tsx';
import HomePage from "@/pages/MainPage/HomePage.tsx";

const router = createBrowserRouter([
  {
    path: "/AuthPage",
    children: [{
      path: "login",
      element: <Login />
    },
    {
      path: "register",
      element: <Register />
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
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
