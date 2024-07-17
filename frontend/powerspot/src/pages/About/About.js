import React from 'react';
import { FaBolt, FaGlobe, FaLeaf } from 'react-icons/fa';
import LottieChargingAnimation from './Charging/LottieChargingAnimation';
import LottieCommunityAnimation from './Community/LottieCommunityAnimation';
import LottieSustainabilityAnimation from './Sustainability/LottieSustainabilityAnimation';

const About = () => {
  return (
    <div className="w-full min-h-screen bg-[#131313] text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-100">About PowerSpot EV</h1>
          <p className="mt-4">
            PowerEV was created to build awareness and foster a community around electric vehicles (EVs). Our goal is to provide a platform where EV users can easily find charging stations, share tips, and support each other.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className=" p-6 border border-zinc-800 rounded-lg shadow-md shadow-zinc-800 text-center">
            {/* <FaBolt size={48} className="text-yellow-500 mx-auto mb-4" /> */}
            <LottieChargingAnimation />
            <h3 className="text-2xl font-semibold text-slate-100">Real-Time Charging Station Locator</h3>
            <p className="text-slate-300/90 mt-2">
              Our app helps users locate nearby charging stations in real-time, ensuring you always have access to the power you need.
            </p>
          </div>
          <div className=" p-6 border border-zinc-800 rounded-lg shadow-md shadow-zinc-800 text-center">
            {/* <FaGlobe size={48} className="text-blue-500 mx-auto mb-4" /> */}
            <LottieCommunityAnimation className='text-white' />
            <h3 className="text-2xl font-semibold text-slate-100">Global EV Community</h3>
            <p className="text-slate-300/90 mt-2">
              Join a worldwide community of EV enthusiasts. Share your experiences, provide feedback on charging stations, and help others make the switch to electric vehicles.
            </p>
          </div>
          <div className=" p-6 border border-zinc-800 rounded-lg shadow-md shadow-zinc-800 text-center">
            {/* <FaLeaf size={48} className="text-green-500 mx-auto mb-4" /> */}
            <LottieSustainabilityAnimation />
            <h3 className="text-2xl font-semibold text-slate-100">Sustainability</h3>
            <p className="text-slate-300/90 mt-2">
              By promoting the use of electric vehicles, we aim to contribute to a cleaner, more sustainable future. Every EV on the road helps reduce our carbon footprint.
            </p>
          </div>
        </div>
        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold text-slate-100">Our Mission</h2>
          <p className="mt-4 text-slate-300/90 max-w-3xl mx-auto">
            At PowerSpot EV, we believe in the power of community and the importance of sustainability. Our mission is to make it easier for people to adopt electric vehicles by providing them with the resources and support they need. Whether you're looking for a nearby charging station or advice from other EV users, PowerSpot EV is here to help.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
