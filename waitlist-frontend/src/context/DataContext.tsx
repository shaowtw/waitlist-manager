"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io } from 'socket.io-client'; 

export interface PartyType {
    _id: string; 
    name: string; 
    partySize: number; 
    status: string
}

interface DataContextProps {
    waitList: PartyType[];
    checkInList: PartyType[];
    notification: string;
    sessionId: string;
    refreshData: () => void;
    addToWaitList: (_n: string, _s: number) => Promise<void>;
    checkInParty: (_id: string) => Promise<void>;
    leaveWaitList: (_id: string) => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);
const party_id = sessionStorage.getItem("party_id");

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [waitList, setWaitList] = useState<PartyType[]>([]);
    const [checkInList, setCheckInList] = useState<PartyType[]>([]);
    const [notification, setNotification] = useState('');
    const [sessionId, setSessionId] = useState('');

    useEffect(() => {
        const socket = io('http://localhost:3001'); // Connect to the server

        socket.on('waitlist', (updatedWaitList: { data: PartyType[] }) => {
            setWaitList(updatedWaitList.data);
        });

        socket.on('checkinList', (updatedCheckInList: { data: PartyType[] }) => {
            setCheckInList(updatedCheckInList.data);
        });

        socket.on('notification', (data : {partyId: string, partyName: string, type: boolean, message: string}) => {
            if(data.partyId === party_id){
                setNotification(`${data.partyName} : ${data.message}`);
            }
        });

        refreshData();

        return () => {
            socket.disconnect(); // Clean up the socket connection on component unmount
        };
    }, []);

    const addToWaitList = async (name: string, partySize: number) => {

        try {
            const response = await fetch('http://localhost:3001/waitlist/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, partySize }),
          });
          const party = await response.json();
          if(response.ok) {
            setSessionId(party._id)
            sessionStorage.setItem('party_id', party._id);
            }
        } catch (error) {
            console.log("Error while adding WaitList : ", error);
        }
    };

    const checkInParty = async (partyId: string) => {
        try {
            const response = await fetch(`http://localhost:3001/waitlist/check-in/${partyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if(response.ok) {
                sessionStorage.setItem("party_id", "")
            }
        } catch (error) {
            console.error("Error while checking in party: ", error);
        }
    };

    const leaveWaitList = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:3001/waitlist/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                sessionStorage.setItem("party_id", "")
            } else {
                console.error('Failed to leave the waitlist');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    const getWaitListData = async () => {
        try {
            const response = await fetch('http://localhost:3001/waitlist/getWaitList', {
              cache: 'no-store',
            });
            const data = await response.json();
            if(response.ok){
                setWaitList(data);
            }
        } catch (error) {
            console.error('Error fetching waitlist data:', error);
        }
    }

    const getCheckInListData = async () => {
        try {
            const response = await fetch('http://localhost:3001/waitlist/getCheckInList', {
              cache: 'no-store',
            });
            const data = await response.json();
            if(response.ok) {
                setCheckInList(data);
            }
        } catch (error) {
            console.error('Error fetching Checkin List data:', error);
        }
    }

    const refreshData = async () => {
        getWaitListData();
        getCheckInListData();
    }

    return (
        <DataContext.Provider 
            value={{ 
                waitList, 
                checkInList,
                notification,
                sessionId,
                refreshData, 
                addToWaitList, 
                checkInParty, 
                leaveWaitList 
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useDataContext must be used within a DataProvider');
    }
    return context;
};