import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { auth, db } from '../../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import Loading from '../Loading/Loading';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState({});
  const [favoriteStations, setFavoriteStations] = useState([]);
  const [lastSignInTime, setLastSignInTime] = useState('');
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000)
  }, [])

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          console.log("User data:", data);
          setUserInfo(data);

          // Set last sign-in time
          setLastSignInTime(user.metadata.lastSignInTime);

          // Fetch favorite stations
          fetchFavoriteStations(user.uid);
        } else {
          console.error("No such document!");
        }
      } else {
        console.error("No user signed in");
      }
    };

    const fetchFavoriteStations = async (userId) => {
      try {
        const favoritesCollectionRef = collection(db, 'favorites', userId, 'stations');
        const favoriteStationsSnapshot = await getDocs(favoritesCollectionRef);
        
        if (favoriteStationsSnapshot.empty) {
          console.log("No favorite stations found for the user");
          setFavoriteStations([]);
          return;
        }

        const favoriteStationsIds = favoriteStationsSnapshot.docs.map(doc => doc.data().stationId);

        if (favoriteStationsIds.length === 0) {
          console.log("No favorite stations found for the user");
          setFavoriteStations([]);
          return;
        }

        const favoriteStationPromises = favoriteStationsIds.map(async (stationId) => {
          const stationDocRef = doc(db, 'stations', stationId.toString());
          const stationDocSnap = await getDoc(stationDocRef);
          if (stationDocSnap.exists()) {
            console.log("Fetched station data:", stationDocSnap.data());
            return { id: stationId, ...stationDocSnap.data() };
          }
          console.log("No station found for ID:", stationId);
          return null;
        });

        const fetchedStations = await Promise.all(favoriteStationPromises);
        const validStations = fetchedStations.filter(station => station !== null);
        console.log("Fetched favorite stations:", validStations);
        setFavoriteStations(validStations);
        console.log(validStations)
      } catch (error) {
        console.error("Error fetching favorite stations: ", error);
      }
    };

    fetchUserInfo();
  }, []);

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="flex h-screen bg-zinc-800 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className=" shadow-lg p-4 text-white">
          <h1 className="text-3xl font-bold ">Dashboard</h1>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <section className="mb-6">
            <h2 className="text-2xl font-bold ">Welcome, {userInfo.displayName || 'User'}!</h2>
            <p className="mt-2 text-slate-300/90">Last login time: {lastSignInTime}</p>
            <p className="mt-2 text-slate-300/90">You have {userInfo.chargingSessions || 0} charging sessions this month.</p>
          </section>
          <section className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900/90 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-slate-300">Profile Info</h2>
              <p className="text-slate-300/90 mt-2">Username: {userInfo.name || 'N/A'}</p>
              <p className="text-slate-300/90">Email: {userInfo.email || 'N/A'}</p>
              <p className="text-slate-300/90">EV Car: {userInfo.evCar || 'N/A'}</p>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">Edit Profile</button>
            </div>
            <div className="bg-zinc-900/90 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-slate-300">Favorite Stations</h2>
              {favoriteStations.length > 0 ? (
                <ul>
                  {favoriteStations.map((station) => (
                    <li key={station.id} className="text-slate-300/90 mb-4">
                      <h3 className="text-lg font-bold">{station.AddressInfo?.Title || 'Unnamed Station'}</h3>
                      <p>{station.AddressInfo?.AddressLine1 || 'No address available'}</p>
                      <p>{station.Connections[0]?.PowerKW || 'N/A'} kW</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-300/90">No favorite stations added.</p>
              )}
            </div>
          </section>
          <section className="mb-6">
            <div className="bg-zinc-900/90 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-slate-300">Recent Charging Sessions</h2>
              {/* List of recent sessions */}
            </div>
          </section>
          <section className="mb-6">
            <div className="bg-zinc-900/90 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-slate-300">Statistics</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className=" p-4 rounded-lg text-center">
                  <h3 className="text-lg font-bold text-slate-300">Total Sessions</h3>
                  <p className="text-blue-600 text-2xl">{userInfo.totalSessions || 0}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg text-center">
                  <h3 className="text-lg font-bold text-green-800">Energy Used (kWh)</h3>
                  <p className="text-green-600 text-2xl">{userInfo.energyUsed || 0}</p>
                </div>
              </div>
            </div>
          </section>
          <section className="mb-6">
            <div className="bg-zinc-900/90 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-slate-300">Settings</h2>
              {/* Settings options */}
            </div>
          </section>
          <section className="mb-6">
            <div className="bg-zinc-900/90 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-slate-300">Support</h2>
              <p className="text-slate-300/90 mt-2">If you have any issues or need help, please contact our support team.</p>
              <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg">Contact Support</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;