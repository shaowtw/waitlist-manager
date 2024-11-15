'use client';

import { useDataContext } from '@/context/DataContext';

const WaitList = () => {
  const { waitList, checkInParty, checkInList } = useDataContext();
  const totalCheckedInPartySize = checkInList.reduce((sum, entry) => sum + entry.partySize, 0);
  const myPartyId = sessionStorage.getItem("party_id");
  return (
    <div className="mt-8 md:mt-0 min-w-[310px] mx-auto p-4 md:p-6 bg-white shadow-lg rounded-lg min-h-[340px]">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center text-gray-900">Current Waitlist</h2>
      {waitList.map((entry, index) => (
        <div key={index} className="entry border-b border-gray-300 py-4 md:py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex-1 text-center md:text-left mx-4">
            <p className="text-base md:text-lg font-semibold text-gray-800">
              {entry.name} - Party Size: {entry.partySize} - Status: {entry.status}
            </p>
          </div>
          <div className="flex space-x-2 md:space-x-4 mt-2 md:mt-0">
            {(index === 0 && entry._id === myPartyId && totalCheckedInPartySize + entry.partySize <= 10) && (
              <button
                onClick={() => checkInParty(entry._id)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 md:px-4 rounded-lg shadow-md transition duration-300"
              >
                Check In
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WaitList;