'use client';

import { useState } from 'react';
import { useDataContext } from '@/context/DataContext';

const WaitlistForm = () => {
  const [name, setName] = useState('');
  const [partySize, setPartySize] = useState(1);
  const { addToWaitList, leaveWaitList, waitList} =useDataContext();
  const myPartyId = sessionStorage.getItem("party_id") ?? "";
  const myParty = waitList.find(item => item._id === myPartyId);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      addToWaitList(name, partySize); // Add the new entry to the waitlist
      setName('');
      setPartySize(1);
    } catch(error) {
      console.error('Failed to join the waitlist : ', error);
    }
  };
  return (
<form onSubmit={handleSubmit} className="transition-transform transform hover:scale-105 bg-white min-w-[310px] p-4 sm:p-6 rounded-xl shadow-lg max-w-md mx-auto">      <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4 sm:mb-6">Join Our Waitlist</h2>
      { !myParty && 
        <>
          <label className="block mb-4 sm:mb-5">
            <span className="text-gray-600 font-medium">Name:</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 sm:mt-2 block w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </label>
          <label className="block mb-4 sm:mb-5">
            <span className="text-gray-600 font-medium">Party Size:</span>
            <input
              type="number"
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
              min="1"
              max='10'
              required
              className="mt-1 sm:mt-2 block w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </label>
        </>
      }
      {!myParty ? 
        <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
          Join Waitlist
        </button> : 
        <button
          onClick={() => leaveWaitList(myPartyId)}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-md transition duration-300"
        >
          Leave Waitlist
        </button>
      }
  </form>
  );
};

export default WaitlistForm;