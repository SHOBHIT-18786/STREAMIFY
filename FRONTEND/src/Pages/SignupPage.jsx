import React from 'react';
import { useState } from 'react';
import {ShipWheelIcon} from "lucide-react";

const SignupPage = () => {
  const [signupData,setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSignup = (e) => {
    e.preventDefault()
  }

  return (
    <div className="h-screen flex items items-center justify-center p-4 sm:p-6 md:p-10" data-theme="forest">
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-bas-100 rounded-xl shadow-lg overflow-hidden">

        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">

        <div className="mb-4 flex items-center justify-start gap-2">
          <ShipWheelIcon className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            Streamify
          </span>
        </div>

        </div>

      </div>  

    </div>
  )
}

export default SignupPage;
