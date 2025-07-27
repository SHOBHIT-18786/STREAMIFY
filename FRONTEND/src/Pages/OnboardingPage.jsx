import React, { useState } from 'react';
import useAuthUser from '../Hooks/useAuthUser.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { LoaderIcon } from 'react-hot-toast';
import { completeOnboarding } from '../lib/Api.js';
import { CameraIcon } from 'lucide-react';
import { ShuffleIcon } from 'lucide-react';
import { LANGUAGES } from '../constants/index.js';
import { MapPinIcon } from 'lucide-react';
import { ShipWheelIcon } from 'lucide-react';

const OnboardingPage = () => {

  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    name: authUser?.name || "",
    bio: authUser?.bio || "",
    nativelang: authUser?.nativelang || "",
    learninglang: authUser?.learninglang || "",
    profilePic: authUser?.profilePic || "",
    location: authUser?.location || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Onboarded Successfully...");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError: (error) => {
      toast.error(error.response.data.message);
    },

  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({...formState, profilePic: randomAvatar});
    toast.success("Random avatar generated!!");
  };

  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
        <div className='card-body p-6 sm:p-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>
            Complete Your Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className='flex flex-col items-center justify-center space-y-4'>
              <div className='size-32 rounded-full bg-base-300 overflow-hidden'>
                {formState.profilePic ? (
                  <img src={formState.profilePic} alt="Profile Preview" className='w-full h-full object-cover' />
                ) : (
                  <div className='flex items-center justify-center h-full'>
                    <CameraIcon className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className='flex items-center gap-2'>
                <button type='button' onClick={handleRandomAvatar} className="btn btn-primary">
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>
            <div className="form-control ">
              <label className="label">
                <span className="label-text">Your Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Your Name"
              />
            </div>
            <div className="form-control ">
              <label className="label">
                <span className="label-text">Your Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea textarea-bordered h-24 "
                placeholder="Define yourself to others..."
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>
                    Your Native Language
                  </span>
                </label>
                <select
                  name="nativelang"
                  value={formState.nativelang}
                  onChange={(e) => setFormState({ ...formState, nativelang: e.target.value })}
                  className='select select-bordered w-full'
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>
                    Your Learning Language
                  </span>
                </label>
                <select
                  name="learninglang"
                  value={formState.learninglang}
                  onChange={(e) => setFormState({ ...formState, learninglang: e.target.value })}
                  className='select select-bordered w-full'
                >
                  <option value="">Select language you are learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>
                  Location
                </span>
              </label>
              <div className='relative'>
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-100" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className='input input-bordered w-full pl-10'
                  placeholder='City, Country'
                />
              </div>
            </div>
            <div></div>
            <button className='btn btn-primary w-full' disabled={isPending} type="submit">
              {!isPending ? (
                <>
                  <ShipWheelIcon className='size-5 mr-2' />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className='animate-spin size-5 mr-2' />
                  Onboarding....
                </>
              )}
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}

export default OnboardingPage;
