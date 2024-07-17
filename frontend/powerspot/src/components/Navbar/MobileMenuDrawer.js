import React from 'react'
import { Link } from 'react-router-dom'

function MobileMenuDrawer({ isOpen, toggleMenu, setIsLoginOpen, setIsSignupOpen }) {
  return (
    <div className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`fixed inset-y-0 left-0 w-80 bg-white shadow-lg z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
            <div className='flex justify-between items-center p-4'>
                <h2 className='text-xl font-bold text-black'>Menu</h2>
                <button className='text-gray-700'
                onClick={toggleMenu}>
                    <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
                </button>
            </div>
            {/* Mobile Navigation */}
            <nav className='px-4 py-2'>
                <Link to='/'>
                <span className='px-3 '>Home</span>
                </Link>
                {/* Logout and SignUp buttons*/}
                <div className='flex flex-col gap-4'>
                <button onClick={() => setIsLoginOpen(true)} className="py-5 px-3">Login</button>
                <button onClick={() => setIsSignupOpen(true)} className="py-2 px-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 rounded transition duration-300">Signup</button>
                </div>
            </nav>
        </div>
    </div>
  )
}

export default MobileMenuDrawer