import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaCog, FaSignOutAlt, FaHome, FaChargingStation, FaQuestionCircle, FaHeart } from 'react-icons/fa';
import { useAuth } from '../AuthContext/AuthContext'; // Correct path to your AuthContext
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../../firebase'; // Ensure the correct path to your firebase configuration

const Sidebar = () => {
  const { signout, currentUser } = useAuth();
  const [profilePicURL, setProfilePicURL] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const db = getFirestore();
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfilePicURL(userData.profilePic || '');
          setEmail(userData.email || '');
          setBio(userData.bio || '');
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
    <aside className="w-[80px] sm:w-[300px] h-full bg-zinc-900 text-white p-4 flex flex-col pt-24 transition-all duration-300">
      {/* User Info */}
      <div className="sm:flex sm:flex-col sm:items-center mb-6 ml-1">
        <img
          className="w-[40px] h-[40px] sm:w-[110px] sm:h-[110px] rounded-full mb-4 object-cover"
          src={profilePicURL || 'https://via.placeholder.com/110'}
          alt="User Profile"
        />
        <h2 className="hidden sm:flex sm:text-xl sm:font-bold">{currentUser.displayName || 'Username'}</h2>
        <p className="hidden sm:flex text-slate-300/90">{email || currentUser.email}</p>
        <p className="hidden sm:flex text-slate-300/90 px-6 text-center">{bio || currentUser.bio}</p>
      </div>
      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-4">
          <li>
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700 transition">
              <FaHome />
              <span className='hidden sm:flex'>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/sessions" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700 transition">
              <FaChargingStation />
              <span className='hidden sm:flex'>Charging Sessions</span>
            </Link>
          </li>
          <li>
            <Link to="/favorites" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700 transition">
              <FaHeart />
              <span className='hidden sm:flex'>Favorite Stations</span>
            </Link>
          </li>
          <li>
            <Link to="/settings" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700 transition">
              <FaCog />
              <span className='hidden sm:flex'>Settings</span>
            </Link>
          </li>
          <li>
            <Link to="/support" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700 transition">
              <FaQuestionCircle />
              <span className='hidden sm:flex'>Support</span>
            </Link>
          </li>
        </ul>
      </nav>

    </aside>
  );
};

export default Sidebar;
