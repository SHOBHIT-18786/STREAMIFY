import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { getUserFriends, getRecommendedUsers, getSentFriendRequests, sendFriendRequest } from "../lib/Api.js"
import { Link } from 'react-router';
import { CheckCircleIcon, UserPlusIcon, UsersIcon } from 'lucide-react';
import FriendCard from "../components/FriendCard.jsx"
import NoFriend from "../components/NoFriend.jsx"
import NoUsers from '../components/NoUsers.jsx';
import { MapPinIcon } from 'lucide-react';
import { getLanguageFlag } from '../components/FriendCard.jsx';

const HomePage = () => {

  const queryClient = useQueryClient();
  const [sentRequests, setSentRequests] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends
  })

  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers
  })

  const { data: sentFriendRequests } = useQuery({
    queryKey: ["sentFriendRequests"],
    queryFn: getSentFriendRequests
  })

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sentFriendRequests"] })
  });

  useEffect(() => {
    const RequestIds = new Set()
    if (sentFriendRequests && sentFriendRequests.length > 0) {
      sentFriendRequests.forEach((req) => {
        RequestIds.add(req.id)
      })
      setSentRequests(RequestIds)
    }
  }, [sentFriendRequests]
  )

  return (
    <div className='min-h-screen bg-base-100'>
      <div className='p-4 sm:p-6 lg:p-8 '>

        <div className='container mx-auto space-y-10'>

          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <h2 className='text-2xl sm:text-3xl font-bol tracking-tight'>Your Friends</h2>
            <Link to="/notification" className="btn btn-outline btn-sm">
              <UsersIcon className="mr-2 size-4" />
              Friend Requests
            </Link>
          </div>

          {loadingFriends ? (
            <div className='flex justify-center py-12'>
              <span className='loading loading-spinner loading-lg' />
            </div>
          ) : friends.length === 0 ? (
            <NoFriend />
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
              {friends.map((friend) => {
                <FriendCard key={friend._id} friend={friend} />
              })}
            </div>
          )}

          <section>

            <div className='mb-6 sm:mb-8'>
              <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                <div>
                  <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>
                    Meet New Individuals
                  </h2>
                  <p className='opacity-70'>
                    Discover perfect matchups for your profile
                  </p>
                </div>
              </div>
            </div>

            {loadingUsers ? (
              <div className='flex justify-center py-12'>
                <span className='loading loading-spinner loading-lg' />
              </div>
            ) : users.length === 0 ? (
              <NoUsers />
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {users.map((user) => {
                  const hasRequestBeenSent = sentRequests.has(user._id);

                  return (
                    <div key={user._id} className='card bg-base-200 hover:shadow-lg transition-all duration-300'>
                      <div className='card-body p-5 space-y-4'>
                        <div className='flex items-center gap-3'>
                          <div className='avatar size-16 rounded-full'>
                            <img src={user.profilePic} alt={user.name} />
                          </div>
                          <div>
                            <h3 className='font-semibold text-lg'>{user.name}</h3>
                            {user.location && (
                              <div className='flex items-center text-xs opacity-70 mt-1'>
                                <MapPinIcon className='size-3 mr-1' />
                                {user.location}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className='flex flex-wrap gap-1.5 mb-3'>
                          <span className='badge badge-secondary text-xs'>
                            {getLanguageFlag(user.nativelang)}
                            Native:{capitalize(user.nativelang)}
                          </span>
                          <span className='badge badge-secondary text-xs'>
                            {getLanguageFlag(user.learninglang)}
                            Learning:{capitalize(user.learninglang)}
                          </span>
                        </div>

                        {user.bio && <p className='text-sm opacity-70'>{user.bio}</p>}

                        <button className={`btn w-full mt-2 ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"}`} onClick={() => sendRequestMutation(user._id)} disabled={hasRequestBeenSent || isPending}>
                          {hasRequestBeenSent ? (
                            <>
                              <CheckCircleIcon className='size-4 mr-2' />
                              Request Sent
                            </>
                          ) : (
                            <>
                              <UserPlusIcon className='size-4 mr-2' />
                              Send Friend Request
                            </>
                          )}
                        </button>

                      </div>
                    </div>
                  )

                })}
              </div>
            )}

          </section>

        </div>

      </div>
    </div>
  )
}

export default HomePage;

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
