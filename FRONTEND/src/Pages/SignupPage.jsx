import React from "react";
import {useState} from "react";
import {ShipWheelIcon} from "lucide-react";
import {Link} from "react-router";
import {signup} from "../lib/Api.js";
import {useMutation} from "@tanstack/react-query";
import {useQueryClient} from "@tanstack/react-query";

const SignupPage = () => {
  const [signupData,setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {mutate:signupmutation,isPending,error} = useMutation({
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({queryKey:["authUser"]}),
  });

  const handleSignup = (e) => {
    e.preventDefault();
    signupmutation(signupData);
  }

  return (
    <div className="h-screen flex items items-center justify-center p-4 sm:p-6 md:p-10" data-theme="forest">
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-bas-100 rounded-xl shadow-lg overflow-hidden">
        {/*Left side of Signup page...*/}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">

        <div className="mb-4 flex items-center justify-start gap-2">
          <ShipWheelIcon className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            Streamify
          </span>
        </div>

        {error && (
          <div className="alert alert-error mb-4"> 
            <span>{error.response.data.message}</span>
          </div>
        )}   

        <div className="w-full">
          <form onSubmit={handleSignup}>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Create an Account
                </h2>
                <p className="text-sm opacity-70">
                  Join Streamify and start interacting with anyone around the world...
                </p>
              </div>

              <div className="space-y-3">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Enter your Name</span>
                  </label>
                  <input 
                     type="text"
                     placeholder="Rohan Awasthi"
                     className="input input-bordered w-full"
                     value={signupData.name}
                     onChange={(e) => setSignupData({...signupData,name:e.target.value})}
                     required
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Enter your Email</span>
                  </label>
                  <input 
                     type="email"
                     placeholder="rohanawasthi012@gmail.com"
                     className="input input-bordered w-full"
                     value={signupData.email}
                     onChange={(e) => setSignupData({...signupData,email:e.target.value})}
                     required
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Create a Password</span>
                  </label>
                  <input 
                     type="password"
                     placeholder="******"
                     className="input input-bordered w-full"
                     value={signupData.password}
                     onChange={(e) => setSignupData({...signupData,password:e.target.value})}
                     required
                  />
                  <p className="text-xs opacity-70 mt-2">
                    Password must contain atleast 6 characters....
                  </p>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-2">
                    <input type="checkbox" className="checkbox-sm" required/>
                    <span className="text-xs leading-tight">
                      I agree to the{" "}
                      <span className="text-primary hover:underline">
                        terms of services
                      </span> and{" "}
                      <span className="text-primary hover:underline">
                        privacy policy
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              <button className="btn btn-primary w-full type=submit">
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                      Loading...
                  </>
                ) : ("Create Account")}
              </button>

              <div className="text-center mt-4">
                <p className="text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                      Sign in
                  </Link>
                </p>
              </div>
        
            </div>
          </form>
        </div>

        </div>

        {/*Right side of Signup page...*/}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto ">
              <img src="/Video call-i.png" alt="Language Connection illustration" className="w-full h-full" />
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Connect with people worldwide
              </h2>
              <p className="opacity-70">
                Start conversations,make friends and learn various languages with others...
              </p>
            </div>
          </div>
        </div>

      </div>  

    </div>
  )
}

export default SignupPage;
