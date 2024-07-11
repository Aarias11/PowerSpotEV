import React from 'react';
import { motion } from 'framer-motion';
import { IoLocation } from "react-icons/io5";

import chargingstation from '../../assets/StationInfoIcons/icons8-charging-station-64.png';
import location from '../../assets/StationInfoIcons/location.png';
import parkingstation from '../../assets/StationInfoIcons/icons8-charging-station-50.png';
import status from '../../assets/StationInfoIcons/icons8-status-30.png';
import dollar from '../../assets/StationInfoIcons/icons8-dollar-50.png';
import telephone from '../../assets/StationInfoIcons/icons8-telephone-50.png';
import daily from '../../assets/StationInfoIcons/icons8-last-24-hours-50.png';
import exactlocation from '../../assets/StationInfoIcons/icons8-location-24.png';

const Drawer = ({ isOpen, onClose, selectedStation, nearbyLocations }) => {
  return (
    <>
      <motion.div
        className="fixed inset-0 bg-gray-800 bg-opacity-75 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      ></motion.div>
      <motion.div
        className="fixed inset-y-0 left-0 w-[400px] bg-white shadow-lg z-50 overflow-y-auto"
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
      >
        <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
          <h2 className="text-xl font-bold">Station Info</h2>
          <button onClick={onClose} className="text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Charging Station Picture */}
        <div className='w-full h-[200px]'>
          <img
            src="https://images.unsplash.com/photo-1707341597123-c53bbb7e7f93?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZXYlMjBzdGF0aW9ufGVufDB8fDB8fHww"
            alt="Station"
            className="w-full h-[200px] object-cover"
          />
        </div>
        {/* Station Info Card Container */}
        <div className="w-full h-[100px] flex justify-center">
          <div className="w-[374px] h-[145px] translate-y-[-70px] bg-[#131313]/80 rounded-2xl p-4 text-white">
            {/* Card Content */}
            <div className="w-full h-full flex flex-col justify-between">
              {/* Electric Company and kW offered Container */}
              <div className="flex justify-between">
                <h4>{selectedStation?.OperatorInfo?.Title || "N/A"}</h4>
                <h4>{selectedStation?.Connections[0]?.PowerKW || "N/A"} kW</h4>
              </div>
              {/* Selected Station Container */}
              <div>
                <h2 className="text-2xl font-semibold">
                  {selectedStation?.AddressInfo?.Title}
                </h2>
              </div>
              {/* Types of Charges Container */}
              <div className="">
                <h4>
                  {selectedStation?.Connections?.map(
                    (conn) => conn.ConnectionType?.Title
                  ).join(", ")}
                </h4>
              </div>
            </div>
          </div>
        </div>
        {/* More Station Info Container */}
        <div className='w-full h-auto px-5'>
          <h3 className='font-bold'>Location Information</h3>
          {/* Address */}
          <div className='flex gap-4 items-center p-2'>
            <img className='w-5 h-5' src={location} alt="Location" />
            <span className='font-light text-[14px]'>Address: {selectedStation?.AddressInfo?.AddressLine1 || "N/A"}</span>
          </div>
          {/* Access */}
          <div className='flex gap-4 items-center p-2'>
            <img className='w-5 h-5' src={daily} alt="Access" />
            <span className='font-light text-[14px]'>Access: {selectedStation?.AddressInfo?.AccessComments || "N/A"}</span>
          </div>
          {/* Telephone */}
          <div className='flex gap-4 items-center p-2'>
            <img className='w-5 h-5' src={telephone} alt="Telephone" />
            <span className='font-light text-[14px]'>Telephone: {selectedStation?.AddressInfo?.ContactTelephone1 || "N/A"}</span>
          </div>
        </div>

        {/* Plug Info Container */}
        <div className='w-full h-auto px-5 mt-5'>
          <h3 className='font-bold'>Plug Information</h3>
          {/* Charging Type */}
          <div className='flex gap-4 items-center p-2'>
            <img className='w-5 h-5' src={parkingstation} alt="Charging Type" />
            <span className='font-light text-[14px]'>Charging Type: {selectedStation?.Connections?.map(
              (conn) => conn.ConnectionType?.Title
            ).join(", ") || "N/A"}</span>
          </div>
          {/* Price */}
          <div className='flex gap-4 items-center p-2'>
            <img className='w-5 h-5' src={dollar} alt="Price" />
            <span className='font-light text-[14px]'>Price: {selectedStation?.UsageCost || "N/A"}</span>
          </div>
          {/* Status */}
          <div className='flex gap-4 items-center p-2'>
            <img className='w-5 h-5' src={status} alt="Status" />
            <span className='font-light text-[14px]'>Status: {selectedStation?.StatusType?.Title || "N/A"}</span>
          </div>
          {/* Charging Stations */}
          <div className='flex gap-4 items-center p-2'>
            <img className='w-5 h-5' src={chargingstation} alt="Charging Stations" />
            <span className='font-light text-[14px]'>Charging Stations: {selectedStation?.Connections?.length || "N/A"}</span>
          </div>
        </div>

        {/* Nearby Locations Container */}
        <div className='w-full h-auto px-5 mt-5'>
          <h3 className='font-bold'>Nearby Locations</h3>
          {nearbyLocations.map((location, index) => (
            <div key={index} className='flex gap-4 items-center p-2'>
              <img className='w-5 h-5' src={exactlocation} alt="Nearby Location" />
              <span className='font-light text-[14px]'>Address: {location.AddressInfo.AddressLine1}</span>
              <span className='font-light text-[14px]'>{location.AddressInfo.Title}</span>
              <span className='font-light text-[14px]'>{location.Distance} miles</span>
            </div>
          ))}
        </div>

        {/* Photos */}
        <div className='w-full h-[200px] px-5 mt-5'>
          <h3 className='font-bold'>Photos</h3>
          {/* Photos Container */}
          <div className='w-full flex gap-2 overflow-x-auto flex-grow-1 pt-5'>
            {selectedStation?.MediaItems?.map((media, index) => (
              <div key={index} className='border w-[120px] h-[120px] flex-shrink-0'>
                <img src={media.ImageURL} alt={`Station Media ${index}`} className='w-full h-full object-cover' />
              </div>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className='w-full h-auto px-5 mt-5'>
          <h3 className='font-bold'>Comments</h3>
          <div className='w-full h-auto'>
            {selectedStation?.UserComments?.map((comment, index) => (
              <div key={index} className='p-2 border-b border-gray-200'>
                <p className='font-light text-[14px]'><strong>{comment.UserName}:</strong> {comment.Comment}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Drawer;
