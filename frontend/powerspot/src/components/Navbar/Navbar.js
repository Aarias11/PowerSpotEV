import React, { useState } from 'react';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import { useAuth } from '../AuthContext/AuthContext'; // Correct path to your AuthContext
import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo/PowerSpotEV Background Removed.png'
const Navbar = () => {
  const { currentUser, signout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-zinc-900 text-white shadow-lg  w-full h-[70px] z-50 px-6 md:px-28 flex justify-center items-center">
      <div className="w-full">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            {/* Logo */}
            <div className='flex items-center md:flex md:items-center'>
              <a href="/" className="flex items-center px-2 text-[26px]">
              <img className='w-16 h-16' src={Logo} />
                {/* <span className="font-bold">PowerSpot EV</span> */}
              </a>
            </div>
            {/* Primary Nav */}
            <ul className="hidden md:flex items-center space-x-1 text-white">
              <Link>
              <li className='className="py-5 px-3  hover:text-slate-400"'>Home</li>
              </Link>
              <Link to='/features'>
              <li className='className="py-5 px-3  hover:text-slate-400"'>
                Features
              </li>
              </Link>
              <Link to='/about'>
              <li className='className="py-5 px-3  hover:text-slate-400"'>About</li>
              </Link>
              
              
            </ul>
          </div>
          {/* Secondary Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {currentUser ? (
              <>
              <ul className=' list-none flex items-center gap-4'>
              <Link to='/dashboard'>
                <li>Dashboard</li>
              </Link>
              <button onClick={signout} className="px-3 py-1 bg-red-500 hover:bg-red-400 text-white rounded transition duration-300">Sign Out</button>
              </ul>
              </>
            ) : (
              <>
                <button onClick={() => setIsLoginOpen(true)} className="px-3">Login</button>
                <button onClick={() => setIsSignupOpen(true)} className="py-1 px-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 rounded transition duration-300">Signup</button>
              </>
            )}
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="mobile-menu-button">
              <svg className="w-6 h-6 text-gray-700" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`fixed inset-y-0 left-0 w-80 bg-white shadow-lg z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
          <div className="flex justify-between items-center p-4">
            <h2 className="text-xl font-bold">Menu</h2>
            <button onClick={toggleMenu} className="text-gray-700">
              <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="px-4 py-2">
            <a href="/" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-200">Home</a>
            <a href="/features" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-200">Features</a>
            <a href="/pricing" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-200">Pricing</a>
            <a href="/contact" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-200">Contact</a>
            <div className='ml-2'>
              {currentUser ? (
                <button onClick={signout} className="py-2 px-3 bg-red-500 hover:bg-red-400 text-white rounded transition duration-300">Sign Out</button>
              ) : (
                <>
                  <button onClick={() => setIsLoginOpen(true)} className="py-2 px-3">Login</button>
                  <button onClick={() => setIsSignupOpen(true)} className="py-2 px-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 rounded transition duration-300">Signup</button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
      {/* Modals */}
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <Signup isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </nav>
  );
};

export default Navbar;