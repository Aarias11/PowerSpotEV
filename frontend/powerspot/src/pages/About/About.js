import React, { useState, useEffect } from 'react';
import { FaBolt, FaGlobe, FaLeaf } from 'react-icons/fa';
import LottieChargingAnimation from './Charging/LottieChargingAnimation';
import LottieCommunityAnimation from './Community/LottieCommunityAnimation';
import LottieSustainabilityAnimation from './Sustainability/LottieSustainabilityAnimation';
import Loading from '../Loading/Loading';

const About = () => {
  const [ isLoading, setIsLoading ] = useState(true)

  useEffect(() => {
    setTimeout(() => [
      setIsLoading(false)
    ], 500)
  }, [])

  if (isLoading) {
    return <Loading />
  }



  return (
    <div className="w-full min-h-screen bg-[#131313] text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12 "> 
          <h1 className="text-4xl font-bold text-[#5ba4ee] text-center">About PowerSpot EV</h1>
          <div className='w-full flex justify-center'>
          <p className="mt-4 w-[60%] ">
            PowerEV was created to build awareness and foster a community around electric vehicles (EVs). Our goal is to provide a platform where EV users can easily find charging stations, share tips, and support each other.
          </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className=" p-6 border border-zinc-800 rounded-lg shadow-md shadow-zinc-800 text-center">
            <LottieChargingAnimation />
            <h3 className="text-2xl font-semibold text-slate-100">Real-Time Charging Station Locator</h3>
            <p className="text-slate-300/90 mt-2 text-left">
              Our app helps users locate nearby charging stations in real-time, ensuring you always have access to the power you need.
            </p>
          </div>
          <div className=" p-6 border border-zinc-800 rounded-lg shadow-md shadow-zinc-800 text-center">
            {/* <FaGlobe size={48} className="text-blue-500 mx-auto mb-4" /> */}
            <LottieCommunityAnimation className='text-white' />
            <h3 className="text-2xl font-semibold text-slate-100">Global EV Community</h3>
            <p className="text-slate-300/90 mt-2 text-left">
              Join a worldwide community of EV enthusiasts. Share your experiences and provide feedback on charging stations.
            </p>
          </div>
          <div className=" p-6 border border-zinc-800 rounded-lg shadow-md shadow-zinc-800 text-center">
            {/* <FaLeaf size={48} className="text-green-500 mx-auto mb-4" /> */}
            <div className='translate-y-[30px]'>
            <LottieSustainabilityAnimation />
            </div>
            <h3 className="text-2xl font-semibold text-slate-100 mt-12">Sustainability</h3>
            <p className="text-slate-300/90 mt-2 text-left">
              By promoting the use of electric vehicles, we aim to contribute to a cleaner, more sustainable future.
            </p>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-[#5ba4ee] text-center">Our Mission</h2>
          <p className="mt-4 text-slate-300/90 max-w-3xl mx-auto w-[57%]">
            At PowerSpot EV, we believe in the power of community and the importance of sustainability. Our mission is to make it easier for people to adopt electric vehicles by providing them with the resources and support they need. Whether you're looking for a nearby charging station or advice from other EV users, PowerSpot EV is here to help.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
