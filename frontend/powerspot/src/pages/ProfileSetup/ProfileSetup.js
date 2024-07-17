import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaCar, FaUser, FaEnvelope, FaEdit } from 'react-icons/fa';
import { getAuth, updateProfile, updateEmail } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProfileSetup = () => {
  const [profilePic, setProfilePic] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [evCar, setEvCar] = useState('');
  const [bio, setBio] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const storage = getStorage();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const db = getFirestore();
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfilePic(userData.profilePic || '');
          setUsername(userData.username || '');
          setEmail(userData.email || user.email);
          setEvCar(userData.evCar || '');
          setBio(userData.bio || '');
        }
      }
    };

    fetchUserProfile();
  }, [auth.currentUser]);

  const handleProfilePicChange = (e) => {
    if (e.target.files[0]) {
      setProfilePicFile(e.target.files[0]);
      setProfilePic(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const user = auth.currentUser;
      let photoURL = profilePic;

      if (profilePicFile) {
        const storageRef = ref(storage, `profile_pics/${user.uid}/${profilePicFile.name}`);
        const snapshot = await uploadBytes(storageRef, profilePicFile);
        photoURL = await getDownloadURL(snapshot.ref);
      }

      await updateProfile(user, {
        displayName: username,
        photoURL,
      });

      if (email !== user.email) {
        await updateEmail(user, email);
      }

      const db = getFirestore();
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        username,
        email,
        evCar,
        bio,
        profilePic: photoURL,
      }, { merge: true });

      navigate('/dashboard');
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
    setUploading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#131313]">
      <div className="bg-zinc-900 p-6 rounded-lg shadow-lg shadow-zinc-700/40 w-full max-w-md text-slate-300">
        <h2 className="text-2xl font-bold mb-4 text-center">Profile Setup</h2>
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
            <FaUser className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full pl-10 pr-4 py-2 border rounded-full bg-zinc-900 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2 border rounded-full bg-zinc-900 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="relative">
            <FaCar className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              value={evCar}
              onChange={(e) => setEvCar(e.target.value)}
              placeholder="Type of EV Car"
              className="w-full pl-10 pr-4 py-2 border rounded-full bg-zinc-900 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="relative">
            <FaEdit className="absolute top-3 left-3 text-gray-400" />
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-zinc-900 focus:outline-none focus:border-blue-500"
              rows="3"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-400 transition duration-300"
            disabled={uploading}
          >
            {uploading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;