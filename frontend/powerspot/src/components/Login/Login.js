import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import loginpicture from '../../assets/AuthPics/loginpicture.jpg';
import Apple from '../../assets/AuthPics/Apple.png';
import Googleicon from '../../assets/AuthPics/Googleicon.png';
import { useNavigate } from 'react-router-dom'; // useNavigate instead of useHistory
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext/AuthContext'; // Import the AuthContext

const Login = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // useNavigate hook
  const { setIsFirstLogin } = useAuth(); // Use the AuthContext

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().isFirstLogin) {
        setIsFirstLogin(true);
        navigate('/profile-setup');
      } else {
        setIsFirstLogin(false);
        navigate('/dashboard');
      }
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().isFirstLogin) {
        setIsFirstLogin(true);
        navigate('/profile-setup');
      } else {
        setIsFirstLogin(false);
        navigate('/dashboard');
      }
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
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {/* Container */}
      <div className="flex">
        {/* Left Side */}
        <div className="w-[50%] h-[490px]">
          <img className="w-full h-full opacity-80" src={loginpicture} alt="Login" />
        </div>
        {/* Right Side */}
        <div className="w-[50%] h-[490px] flex items-center justify-center">
          <div className="w-full max-w-sm p-4">
            <h2 className="text-xl font-bold mb-4 text-white text-center">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="mb-4 relative">
                <label className="block text-white ml-4 text-[12px]">Email</label>
                <input
                  type="email"
                  value={email}
                  placeholder="john.doe@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[40px] pl-5 border rounded-full bg-[#02151F] text-white text-[12px] focus:outline-none focus:border-blue-500"
                  required
                />
                <FaEnvelope className="absolute top-8 right-5 text-white" />
              </div>
              <div className="mb-4 relative">
                <label className="block text-white ml-4 text-[12px] ">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="*********"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[40px] pl-5 pt-1 border rounded-full bg-[#02151F] text-white text-[12px] focus:outline-none focus:border-blue-500"
                  required
                />
                <div
                  className="absolute top-8 right-5 text-white cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              <button type="submit" className="bg-blue-500 text-white rounded-lg w-full h-[40px]">
                Login
              </button>
            </form>
            {/* Divider */}
            <div className="w-full mt-10 flex gap-2">
              <div className="w-[45%] border-t mt-2"></div>
              <span className="text-white text-[12px] ">or</span>
              <div className="w-[45%] border-t mt-2"></div>
            </div>
            {/* Google and Apple Login */}
            <div className="w-full flex flex-col justify-center items-center gap-4 mt-10 relative">
              <button
                className="w-[200px] h-[40px] border rounded-full text-white text-[12px] flex justify-center gap-4 items-center "
                onClick={handleGoogleLogin}
              >
                <img className="w-5 h-5 translate-y-[-1px]" src={Googleicon} alt="Google" />
                Login with Google
              </button>
              {/* <button className="w-[200px] h-[40px] border rounded-full text-black bg-white text-[12px] flex justify-center items-center gap-4 pt-1">
                <img className="w-5 h-5 translate-y-[-4px]" src={Apple} alt="Apple" />
                Login with Apple
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Login;
