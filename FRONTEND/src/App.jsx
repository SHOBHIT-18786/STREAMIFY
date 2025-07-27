import React, { useState } from 'react';
import { Route, Routes } from "react-router";
import PageLoader from './components/PageLoader.jsx';
import HomePage from "./Pages/HomePage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import SignupPage from "./Pages/SignupPage.jsx";
import NotificationPage from "./Pages/NotificationPage.jsx";
import OnboardingPage from "./Pages/OnboardingPage.jsx";
import CallPage from "./Pages/CallPage.jsx";
import ChatPage from "./Pages/ChatPage.jsx";
import { Toaster, toast } from "react-hot-toast";
import { Navigate } from 'react-router';
import useAuthUser from './Hooks/useAuthUser.js';
import Layout from "./components/Layout.jsx";
import { useThemeStore } from './store/useThemeStore.js';


const App = () => {

  const { isLoading, authUser } = useAuthUser();

  const {theme,setTheme} = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route path="/" element={isAuthenticated && isOnboarded ? (
          <Layout showSidebar>
            <HomePage />
          </Layout>
          ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboard"} />)} />
        <Route path="/signup" element={<SignupPage /> } />
        <Route path="/login" element={isAuthenticated ? (
          !isOnboarded ? (<Navigate to="/onboard"/>) : (<Navigate to="/" />)
        ) : (
          <LoginPage />)
        }/>
        <Route path="/onboard" element={isAuthenticated ? (
          !isOnboarded ? (<OnboardingPage />) : (<Navigate to="/" />)
        ) : (
          <Navigate to="/login" />)
        } />
        <Route path="/notification" element={isAuthenticated ? <NotificationPage /> : <Navigate to="/login" />} />
        <Route path="/call" element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />} />
        <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </div>

  );
};

export default App;
