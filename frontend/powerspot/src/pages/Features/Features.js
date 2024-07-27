import React, { useState, useEffect } from "react";
import LottieAnimation from "./LottieAnimation";
import { FaRocket, FaShieldAlt, FaUsers } from 'react-icons/fa';
import Loading from "../Loading/Loading";

function Features() {
  const [ isLoading, setIsLoading ] =  useState(true)


  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="w-full min-h-screen bg-[#131313] text-slate-300 px-6 md:px-28 flex justify-center items-center">
      {/* Container */}
      <div className="w-full h-full flex flex-col-reverse items-center justify-center md:flex-row  mb-16">
        {/* Left Side */}
        <div className="md:w-[50%] w-full flex flex-col justify-center p-2 space-y-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold ">Our Amazing Features</h1>
            <p className="mt-2 text-white">Explore the unique features that make our application stand out.</p>
          </header>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="text-blue-500">
                <FaRocket size={30} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-slate-300">Real-Time Charging Station Locator</h3>
                <p className="text-slate-300/90 mt-1 text-[18px]">The PowerEV App provides an intuitive map interface that allows users to locate nearby charging stations in real-time. The app uses OpenChargeMap and Google Maps APIs to display up-to-date information on the availability, status, and types of chargers available at each station.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-green-500">
                <FaShieldAlt size={30} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-slate-300">Favorite Stations and Trip Planning</h3>
                <p className="text-slate-300/90 mt-1 text-[18px]">Users can save their favorite charging stations for quick access and plan their trips with integrated route suggestions. The app allows users to mark stations they prefer or frequently use, and it can suggest optimized routes that include these stations along the way.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-red-500">
                <FaUsers size={30} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-slate-300">Building a Helpful EV Community</h3>
                <p className="text-slate-300/90 mt-1 text-[18px]">Join a community of EV users to share tips, provide feedback on charging stations, and support each other in the transition to electric vehicles.</p>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side - Animation */}
        <div className="md:w-[50%] w-full h-full flex justify-center items-center">
          <LottieAnimation />
        </div>
      </div>
    </div>
  );
}

export default Features;
