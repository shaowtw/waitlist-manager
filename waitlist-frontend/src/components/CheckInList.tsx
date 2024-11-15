'use client';

import { useDataContext } from '@/context/DataContext';

const CheckInList = () => {
  const { checkInList } = useDataContext();
  return (
    <div className="bg-white min-w-[310px] p-4 sm:p-6 rounded-xl shadow-lg max-w-md mx-auto min-h-[340px]"> 
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">Current Check-In List</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {checkInList.map((entry, index) => (
          <div key={index} className="entry border-b border-gray-200 py-4 px-6 hover:bg-gray-50 transition duration-200">
            <p className="text-lg font-semibold text-gray-800">
              {entry.name} <span className="text-sm text-gray-500">- Party Size: {entry.partySize}</span>
            </p>
            <p className="text-sm text-gray-600">Status: {entry.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckInList;