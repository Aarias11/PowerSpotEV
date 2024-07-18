import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { auth, db } from '../../firebase';
import { doc, getDoc, collection, getDocs, query, where, deleteDoc, setDoc } from 'firebase/firestore';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Loading from '../Loading/Loading';
import { Link } from 'react-router-dom';
import { CiLocationArrow1 } from "react-icons/ci";
import { RiChargingPile2Line } from "react-icons/ri";
import { GrStatusInfo } from "react-icons/gr";
import { IoCheckmarkCircle } from "react-icons/io5";

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState({});
  const [favoriteStations, setFavoriteStations] = useState([]);
  const [lastSignInTime, setLastSignInTime] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserInfo(data);
          setLastSignInTime(user.metadata.lastSignInTime);
          fetchFavoriteStations(user.uid);
        }
      }
    };

    const fetchFavoriteStations = async (userId) => {
      try {
        const favoritesCollectionRef = collection(db, 'favorites');
        const q = query(favoritesCollectionRef, where("userId", "==", userId));
        const favoriteStationsSnapshot = await getDocs(q);

        const favoriteStationsData = favoriteStationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFavoriteStations(favoriteStationsData);
      } catch (error) {
        console.error("Error fetching favorite stations: ", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleToggleFavorite = async (stationId) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const stationDocRef = doc(db, 'favorites', `${user.uid}_${stationId}`);
      const stationDocSnap = await getDoc(stationDocRef);

      if (stationDocSnap.exists()) {
        await deleteDoc(stationDocRef);
        setFavoriteStations(favoriteStations.filter(station => station.stationId !== stationId));
      } else {
        await setDoc(stationDocRef, {
          userId: user.uid,
          stationId,
          isFavorite: true
        });
        setFavoriteStations([...favoriteStations, { userId: user.uid, stationId, isFavorite: true }]);
      }
    } catch (error) {
      console.error("Error toggling favorite status: ", error);
    }
  };

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="flex h-screen bg-zinc-800 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="shadow-lg p-4 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <section className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold">Welcome, {userInfo.username || 'User'}!</h2>
            <p className="mt-2 text-slate-300/90">Last login time: {lastSignInTime}</p>
            <p className="mt-2 text-slate-300/90">You have {userInfo.chargingSessions || 0} charging sessions this month.</p>
          </section>
          <section className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-zinc-900/90 p-6 rounded-lg shadow-lg">
              <h2 className="text-lg md:text-xl font-bold text-slate-300">Profile Info</h2>
              <p className="text-slate-300/90 mt-2">Username: {userInfo.username || 'N/A'}</p>
              <p className="text-slate-300/90">Email: {userInfo.email || 'N/A'}</p>
              <p className="text-slate-300/90">EV Car: {userInfo.evCar || 'N/A'}</p>
              <Link to='/profile-setup'>
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">Edit Profile</button>
              </Link>
            </div>
            <div className="bg-zinc-900/90 p-6 rounded-lg shadow-lg">
              <h2 className="text-lg md:text-xl font-bold text-slate-300">Favorite Stations</h2>
              {favoriteStations.length > 0 ? (
                <div className="relative">
                  <button onClick={scrollLeft} className="absolute w-10 h-10 left-[-20px] top-1/2 transform -translate-y-1/2 bg-blue-500/50 hover:bg-blue-700/80 text-white p-2 rounded-full shadow-lg z-50">
                    &lt;
                  </button>
                  <div ref={scrollContainerRef} className="flex overflow-x-scroll space-x-4">
                    {favoriteStations.map((station, index) => (
                      <div key={index} className="min-w-[250px] md:min-w-[300px] bg-zinc-800 p-4 rounded-lg shadow-lg flex-shrink-0 relative">
                        <h3 className="text-lg font-bold">{station.operatorTitle || 'Unnamed Station'}</h3>
                        <p className='flex gap-2 items-center'><CiLocationArrow1 className='translate-y-[-3px]' /> {station.address || 'No address available'}</p>
                        <p className='flex gap-2 items-center'><RiChargingPile2Line className='translate-y-[-3px]' /> {station.powerKW || 'N/A'} kW</p>
                        <p className='flex gap-2 items-center'><GrStatusInfo className='translate-y-[-3px]' /> Status: {station.status || 'N/A'} <IoCheckmarkCircle className='text-green-600 translate-y-[-3px]' /></p>
                        <button 
                          onClick={() => handleToggleFavorite(station.stationId)} 
                          className="absolute top-4 right-4 text-red-600 bg-transparent border-none"
                        >
                          {station.isFavorite ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={scrollRight} className="absolute w-10 h-10 right-[-20px] top-1/2 transform -translate-y-1/2 bg-blue-500/50 hover:bg-blue-700/80 text-white p-2 rounded-full shadow-lg">
                    &gt;
                  </button>
                </div>
              ) : (
                <p className="text-slate-300/90">No favorite stations added.</p>
              )}
            </div>
          </section>
          <section className="mb-6">
            <div className="bg-zinc-900/90 p-6 rounded-lg shadow-lg">
              <h2 className="text-lg md:text-xl font-bold text-slate-300">Settings</h2>
              {/* Settings options */}
            </div>
          </section>
          <section className="mb-6">
            <div className="bg-zinc-900/90 p-6 rounded-lg shadow-lg">
              <h2 className="text-lg md:text-xl font-bold text-slate-300">Support</h2>
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