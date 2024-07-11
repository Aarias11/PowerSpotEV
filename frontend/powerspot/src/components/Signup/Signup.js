import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { FaUser, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import signuppicture from '../../assets/AuthPics/signuppicture.jpg';
import Apple from '../../assets/AuthPics/Apple.png';
import Googleicon from '../../assets/AuthPics/Googleicon.png';

const Signup = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}
      <div className="flex">
        <div className="w-[50%] h-[490px]">
          <img className="w-full h-full opacity-80" src={signuppicture} alt="Signup" />
        </div>
        <div className="w-[50%] h-[490px] flex items-center justify-center">
          <div className="w-full max-w-sm p-4">
            <h2 className="text-xl font-bold mb-4 text-white text-center">Signup</h2>
            {/* Signup Form */}
            <form onSubmit={handleSignup} className="space-y-4">
                {/* Username */}
              <div className="mb-4 relative">
                <label className="block text-white ml-4 text-[12px]">Username</label>
                <input
                  type="text"
                  value={username}
                  placeholder="john.doe11"
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-[40px] pl-5 py-2 border rounded-full bg-[#02151F] text-white text-[12px]"
                  required
                />
                <FaUser className="absolute top-7 right-5 text-white" />
              </div>
              {/* Email */}
              <div className="mb-4 relative">
                <label className="block text-white ml-4 text-[12px]">Email</label>
                <input
                  type="email"
                  value={email}
                  placeholder="john.doe@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[40px] pl-5 py-2 border rounded-full bg-[#02151F] text-white text-[12px]"
                  required
                />
                <FaEnvelope className="absolute top-7 right-5  text-white" />
              </div>
              {/* Password */}
              <div className="mb-4 relative">
                <label className="block text-white ml-4 text-[12px]">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="*********"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[40px] pl-5 py-2 border rounded-full bg-[#02151F] text-white text-[12px]"
                  required
                />
                <div className="absolute top-7 right-5  text-white cursor-pointer" onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              <button type="submit" className="bg-blue-500 text-white py-2 rounded-lg w-full h-[40px]">
                Signup
              </button>
            </form>
            <div className="w-full mt-5 flex gap-2">
              <div className="w-[45%] border-t mt-2"></div>
              <span className="text-white text-[12px] translate-y-[-2px]">or</span>
              <div className="w-[45%] border-t mt-2"></div>
            </div>
            <div className="w-full flex flex-col justify-center items-center gap-4 mt-5 relative">
              <button
                className="w-[200px] h-[40px] border rounded-full text-white text-[12px] flex justify-center items-center gap-4"
                onClick={handleGoogleSignup}
              >
                <img className="w-5 h-5" src={Googleicon} alt="Google" />
                Signup with Google
              </button>
              <button className="w-[200px] h-[40px] border rounded-full text-black bg-white text-[12px] flex justify-center items-center gap-4">
                <img className="w-5 h-5" src={Apple} alt="Apple" />
                Signup with Apple
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Signup;
