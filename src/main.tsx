import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, RouterProvider, createBrowserRouter } from "react-router-dom";

import './index.css'
import Login from './pages/auth/Login.tsx'
import Register from './pages/auth/Register.tsx';

const router = createBrowserRouter([
  {
    path: "/auth",
    children: [{
      path: "login",
      element: <Login />
    },
    {
      path: "register",
      element: <Register />
    }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
