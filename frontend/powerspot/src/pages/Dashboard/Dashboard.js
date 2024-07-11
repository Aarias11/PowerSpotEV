import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col mt-20">
        
        <main className="flex-1 p-6 overflow-y-auto">
          <section className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Welcome, [Username]!</h2>
            <p className="mt-2 text-gray-600">You have [X] charging sessions this month.</p>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">Profile Info</h2>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-700">Name: [User Name]</p>
              <p className="text-gray-700">Email: [User Email]</p>
              <p className="text-gray-700">Phone: [User Phone]</p>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">Edit Profile</button>
            </div>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Charging Sessions</h2>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              {/* List of recent sessions */}
            </div>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">Favorite Stations</h2>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              {/* List of favorite stations */}
            </div>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">Settings</h2>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              {/* Settings options */}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
