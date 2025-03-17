import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, RouterProvider, createBrowserRouter } from "react-router-dom";

import './index.css'
import Login from './pages/auth/Login.tsx'

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
