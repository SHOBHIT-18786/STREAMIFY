import React from 'react';

const NoUsers = () => {
  return (
    <div className='card bg-base-200 p-6 text-center'>
        <h3 className='font-semibold text-lg mb-2'>No Recommendations available</h3>
        <p className='text-base-content opacity-70'>
            Check back later for new individuals..
        </p>
    </div>
  );
};

export default NoUsers;
