import React from 'react';
import { truncateAddress } from "../assets/utils";

function Header({ account, isManager, activeTab, setActiveTab }) {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="flex flex-col">
              <h1 className="text-3xl font-extrabold">WeiFund</h1>
              <p className="text-indigo-200">Decentralized Crowdfunding Platform</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="px-4 py-2 bg-indigo-700 bg-opacity-50 rounded-lg flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-400 mr-2 animate-pulse"></div>
              <span className="text-sm font-medium">{truncateAddress(account)}</span>
            </div>
            
            {isManager && (
              <div className="px-3 py-1 bg-indigo-800 rounded-md text-xs font-semibold">
                Campaign Manager
              </div>
            )}
          </div>
        </div>
        
        <nav className="mt-6">
          <ul className="flex space-x-1 overflow-x-auto pb-1">
            <li>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-t-lg font-medium transition ${
                  activeTab === 'dashboard' 
                    ? 'bg-white text-indigo-700' 
                    : 'text-indigo-100 hover:bg-indigo-500'
                }`}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-4 py-2 rounded-t-lg font-medium transition ${
                  activeTab === 'requests' 
                    ? 'bg-white text-indigo-700' 
                    : 'text-indigo-100 hover:bg-indigo-500'
                }`}
              >
                Funding Requests
              </button>
            </li>
            {isManager && (
              <li>
                <button
                  onClick={() => setActiveTab('createRequest')}
                  className={`px-4 py-2 rounded-t-lg font-medium transition ${
                    activeTab === 'createRequest' 
                      ? 'bg-white text-indigo-700' 
                      : 'text-indigo-100 hover:bg-indigo-500'
                  }`}
                >
                  Create Request
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
