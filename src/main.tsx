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
import UserProfile from "@/pages/ProfilePage/UserProfile.tsx";
import TaskPage from "@/pages/MainPage/TaskPage.tsx";
import ContractCreationPage from "@/pages/ContractPage/ContractCreationPage.tsx";
import ContractDetailPage from "@/pages/ContractPage/ContractDetailPage.tsx";
import ContractManagementPage from "@/pages/ContractPage/ContractManagementPage.tsx";
import PaymentSummaryPage from "@/pages/MainPage/PaymentSummaryPage.tsx";
import ProfilePage from "@/pages/ProfilePage/ProfilePage.tsx";
import EditTaskPage from "@/pages/MainPage/EditTaskPage.tsx";
import ViewInboxPage from "@/pages/InboxPage/ViewInboxPage.tsx";
import InboxDetailPage from "@/pages/InboxPage/InboxDetailPage.tsx";
import LevelPage from "@/pages/ProfilePage/LevelPage.tsx";
import NotFoundPage from "@/pages/AuthPage/NotFoundPage.tsx";
import { AuthProvider } from './lib/auth-context';
import { ToastProvider } from './components/InfoComponent/Toast';
import SearchCustomerPage from './pages/MainPage/SearchCustomerPage';
import CustomerProfile from './pages/ProfilePage/CustomerProfile';

const router = createBrowserRouter([
  {
    path: "/auth",
    children: [{
      path: "login",
      element: <Login />
    },
    {
      path: "register",
      element: <MainRegister />
    },
    {
      path: "register-customer",
      element: <CustomerRegister />
    },
    {
      path: "register-helper",
      element: <HelperRegister />
    }
    ],
  },
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/home",
    element: <HomePage />
  },
  {
    path: "/search",
    element: <SearchPage />
  },
  {
    path: "/search-customer",
    element: <SearchCustomerPage />
  },
  {
    path: "/profile",
    element: <ProfilePage />
  },
  {
    path: "/profile/level",
    element: <LevelPage />
  },
  {
    path: "/helper-profile/:id",
    element: <UserProfile />
  },
  {
    path: "/customer-profile/:id",
    element: <CustomerProfile />
  },
  {
    path: "/hihi",
    element: <Register />
  },
  {
    path: "/task",
    children: [
      {
        path: "view",
        element: <TaskPage />
      },
      {
        path: "edit",
        element: <EditTaskPage />
      }

    ]
  },
  {
    path: "/contract",
    children: [
      {
        path: "create",
        element: <ContractCreationPage />
      },
      {
        path: "detail",
        element: <ContractDetailPage />
      },
      {
        path: "manage",
        element: <ContractManagementPage />
      }
    ]
  },
  {
    path: "/inbox",
    children: [
      {
        path: "view",
        element: <ViewInboxPage />
      },
      {
        path: "detail/:id",
        element: <InboxDetailPage />
      }
    ]
  },
  {
    path: '/payment-summary',
    element: <PaymentSummaryPage />
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
)
