import React from 'react';
import {Route,Routes} from "react-router";
import HomePage from "./Pages/HomePage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import SignupPage from "./Pages/SignupPage.jsx";
import NotificationPage from "./Pages/NotificationPage.jsx";
import OnboardingPage from "./Pages/OnboardingPage.jsx";
import CallPage from "./Pages/CallPage.jsx";
import ChatPage from "./Pages/ChatPage.jsx";
import {Toaster,toast} from "react-hot-toast";
import { useEffect,useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Axios } from './lib/axios.js';
import { Navigate } from 'react-router';

const App = () => {
  const {data:authData,isLoading,error} = useQuery({
    queryKey : ["authUser"],
    queryFn: async () => {
      const res = await Axios.get("/auth/me");
      return res.data;
    },
    retry : false,
  });
  const authUser = authData?.user;

  return  (
  <div className="h-screen" data-theme="night">
    <Routes>
       <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
       <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
       <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
       <Route path="/onboard" element={authUser ? <OnboardingPage /> : <Navigate to="/login" />} />
       <Route path="/notification" element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
       <Route path="/call" element={authUser ? <CallPage /> : <Navigate to="/login" />} />
       <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
    </Routes>

    <Toaster />
  </div>

  );
};

export default App;
