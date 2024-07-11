import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase'; // Ensure the correct path to your firebase configuration
import { FaCamera, FaCar, FaUser } from 'react-icons/fa';
import { getFirestore, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

const ProfileSetup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [evCar, setEvCar] = useState('');
  const [bio, setBio] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkFirstLogin = async () => {
      const db = getFirestore();
      const user = auth.currentUser;
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && !userDoc.data().isFirstLogin) {
        navigate('/dashboard');
      }
    };

    checkFirstLogin();
  }, [navigate]);

  const handleProfilePicChange = (e) => {
    if (e.target.files[0]) {
      setProfilePic(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const db = getFirestore();
      const user = auth.currentUser;
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        profilePic,
        evCar,
        bio,
        isFirstLogin: false,
      }, { merge: true });
      navigate('/dashboard');
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Profile Setup</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <img
              src={profilePic || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border"
            />
            <label
              htmlFor="profilePic"
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer"
            >
              <FaCamera />
            </label>
            <input
              type="file"
              id="profilePic"
              className="hidden"
              accept="image/*"
              onChange={handleProfilePicChange}
            />
          </div>
          <div className="relative">
            <FaCar className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              value={evCar}
              onChange={(e) => setEvCar(e.target.value)}
              placeholder="Type of EV Car"
              className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-gray-400" />
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-400 transition duration-300"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
