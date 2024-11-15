'use client';

import { useState, useEffect } from 'react';
import { useDataContext } from '@/context/DataContext';

const Notification = () => {
  const { notification } = useDataContext();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (notification) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000); // Toast will disappear after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <>
      {showToast && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white p-4 rounded shadow-lg">
          {notification}
        </div>
      )}
    </>
  );
};

export default Notification;