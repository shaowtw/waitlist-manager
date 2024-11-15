import WaitList from '@/components/WaitList';
import CheckInList from '@/components/CheckInList';
import WaitlistForm from '@/components/WaitlistForm';
import { DataProvider } from '@/context/DataContext';
import Notification from '@/components/Notification';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  return (
    <DataProvider>
      <div className="p-6 md:p-24 bg-gray-200 shadow-lg justify-center min-h-screen max-w-full overflow-x-hidden">
        <h1 className="text-5xl font-extrabold text-center text-black mb-10">Waitlist Management</h1>
        <div className="flex flex-col lg:flex-row justify-around gap-6 flex-wrap">
          <WaitlistForm />
          <WaitList />
          <CheckInList />
          {/* <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} /> */}
        </div>
      </div>
      <Notification />
    </DataProvider>
  );
};

export default Home;