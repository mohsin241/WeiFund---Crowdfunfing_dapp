import React from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/solid';

function Dashboard({ campaignDetails, isManager, handleRefund }) {
  const isDeadlinePassed = () => {
    return Date.now() > campaignDetails.deadlineTimestamp * 1000;
  };
  
  const isGoalReached = () => {
    return parseFloat(campaignDetails.raisedAmount) >= parseFloat(campaignDetails.targetGoal);
  };
  
  const isRefundEligible = () => {
    return isDeadlinePassed() && !isGoalReached() && parseFloat(campaignDetails.userContribution) > 0;
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Campaign Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-indigo-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg text-gray-700 font-medium">Funding Progress</h3>
                <div className="mt-2 mb-4">
                  <div className="text-3xl font-bold text-indigo-700">
                    {campaignDetails.raisedAmount} ETH
                    <span className="text-base text-gray-500 ml-2">/ {campaignDetails.targetGoal} ETH</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 md:mt-0">
                {isGoalReached() ? (
                  <div className="flex items-center text-emerald-600">
                    <CheckCircleIcon className="h-5 w-5 mr-1" />
                    <span className="font-medium">Goal Reached!</span>
                  </div>
                ) : isDeadlinePassed() ? (
                  <div className="flex items-center text-red-600">
                    <XCircleIcon className="h-5 w-5 mr-1" />
                    <span className="font-medium">Campaign Failed</span>
                  </div>
                ) : (
                  <div className="flex items-center text-blue-600">
                    <ClockIcon className="h-5 w-5 mr-1" />
                    <span className="font-medium">Campaign Active</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-2 mb-1 flex justify-between text-xs text-gray-500">
              <span>0 ETH</span>
              <span>{campaignDetails.targetGoal} ETH</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full" 
                style={{ 
                  width: `${Math.min(100, (parseFloat(campaignDetails.raisedAmount) / parseFloat(campaignDetails.targetGoal)) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Campaign Details</h3>
          <ul className="space-y-3">
            <li className="flex justify-between items-center">
              <span className="text-gray-600">Target Goal:</span>
              <span className="font-medium">{campaignDetails.targetGoal} ETH</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-600">Deadline:</span>
              <span className="font-medium">{campaignDetails.deadline}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-600">Contract Balance:</span>
              <span className="font-medium">{campaignDetails.balance} ETH</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${isDeadlinePassed() ? (isGoalReached() ? 'text-emerald-600' : 'text-red-600') : 'text-blue-600'}`}>
                {isDeadlinePassed() ? (isGoalReached() ? 'Successful' : 'Failed') : 'Active'}
              </span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Your Information</h3>
          <ul className="space-y-3">
            <li className="flex justify-between items-center">
              <span className="text-gray-600">Your Contribution:</span>
              <span className="font-medium">{campaignDetails.userContribution} ETH</span>
            </li>
            <li className="flex items-center space-x-2">
              <UserGroupIcon className="h-5 w-5 text-indigo-500" />
              <span className="text-gray-600">Total Contributors:</span>
              <span className="font-medium">{campaignDetails.noOfContributors}</span>
            </li>
          </ul>
          
          {isRefundEligible() && (
            <div className="mt-6">
              <button
                onClick={handleRefund}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
              >
                Get Refund
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Campaign goal was not reached. You can claim a refund of your contribution.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;