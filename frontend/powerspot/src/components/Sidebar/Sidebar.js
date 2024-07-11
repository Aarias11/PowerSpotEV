import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaCog, FaSignOutAlt, FaHome, FaChargingStation, FaQuestionCircle, FaHeart } from 'react-icons/fa';
import { useAuth } from '../AuthContext/AuthContext'; // Correct path to your AuthContext
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../../firebase'; // Ensure the correct path to your firebase configuration

const Sidebar = () => {
  const { signout, currentUser } = useAuth();
  const [profilePic, setProfilePic] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const db = getFirestore();
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfilePic(userData.profilePic || '');
          setEmail(userData.email || '');
        }
      } catch (error) {
        console.error("Error fetching user profile: ", error);
      }
    };

    if (currentUser) {
      fetchUserProfile();
    }
  }, [currentUser]);

  return (
    <aside className="w-[300px] h-full bg-gray-800 text-white p-4 flex flex-col pt-24">
      {/* User Info */}
      <div className="flex flex-col items-center mb-6">
        <img
          className="w-[110px] h-[110px] border rounded-full mb-4 object-cover"
          src={profilePic || 'https://via.placeholder.com/110'}
          alt="User Profile"
        />
        <h2 className="text-xl font-bold">{currentUser.displayName || 'Username'}</h2>
        <p className="text-gray-400">{email || currentUser.email}</p>
      </div>
      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-4">
          <li>
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700 transition">
              <FaHome />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/sessions" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700 transition">
              <FaChargingStation />
              <span>Charging Sessions</span>
            </Link>
          </li>
          <li>
            <Link to="/favorites" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700 transition">
              <FaHeart />
              <span>Favorite Stations</span>
            </Link>
          </li>
          <li>
            <Link to="/settings" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700 transition">
              <FaCog />
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <Link to="/support" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700 transition">
              <FaQuestionCircle />
              <span>Support</span>
            </Link>
          </li>
        </ul>
      </nav>
      {/* Sign Out */}
      <div className="mt-4">
        <button
          onClick={signout}
          className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded transition"
        >
          <FaSignOutAlt />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
