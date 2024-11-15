# waitlist-manager

# Run Project Locally
    1. install node modules for both frontend and backend using npm install.
    2. on backend directory, please run "docer-compose up -d" to start the mongodb.
    3. On backend dirctiory, please run "npm run start:dev"
    4. On frontend directory, please run "npm run dev"

    Backend is running on PORT : 3001, frontend is running on PORT: 3000. 

# Explanation of architecure decision.

**Backend Architecture**

1. Backend(Nest.js) consists of App, Waitlist, Notification modules.
2. App module
    Init app server and socket(for real-time communication with frontend).
3. Waitlist module

    - Schema
        name: string;  
        partySize: number;  
        status: string; // 'waiting', 'ready', 'served'  
        createdAt: Date; 

    - Entrypoints
        - @Post **/waitlist/add**  
            Add party to waitlist 
        - @Get **/waitlist/getWaitList**  
            Get current waitlist 
        - @Get **/waitlist/getCheckInList**  
            Get parties which are getting service 
        - @Put **/waitlist/check-in/:id**  
            Set party status as checkIn (ready to get service) and move to checkInList from waitlist 
        - @Delete **/waitlist/:id**  
            leave party from waitlist 

    - Functions

        Main operations  
        ***AddWaitlist, checkIn, getWaitlist/getCheckInList, leaveWaitlist, completeService***

        Feature  
        ***Send updated waitlist and checkinlist everytime when party actions(add, checkin, leave)***

        ***Check first 2 parties in waitlist in every 20 seconds and notice them to get ready or check-in***

        ***If party didn't check-in in 20 seconds, remove party from waitlist***

    - Variables

        maxSeats : 10 // from requirements, hardcoded
        serviceTimePerPerson : 3s // from requirements, hardcoded
        waitQueue : List of parties waiting  
        checkInQueue : List of parties getting service 

4. Notification Module

    - Entrypoints  
        @Post **/notification/:partyId**  
            Send notification for individual party (For test)
    
    - Functions 
        - SendNotification 
        - SendWaitList 
        - SendCheckInList 
5. Unit Test

**Frontend Architecture**

1. Frontend(Next.js with App router) is mainly consists of 3 components (**WaitlistForm**, **WaitList**, **CheckInList**)

2. Notification  
    I implemented customized notification using **Notification** component.

3. DataContext  
    - Manage Every necessary data (***waitlist, checkinlist, notification***) from this context.
    - Save brower session to session storage to identify each party by tab.
    - Socket interaction with backend server