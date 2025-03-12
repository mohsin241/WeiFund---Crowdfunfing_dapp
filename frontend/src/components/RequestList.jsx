import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

function RequestList({ requests, campaignDetails, isManager, onVote, onFinalize }) {
  const canFinalizeRequest = (request) => {
    return isManager && 
           !request.complete && 
           request.approvalCount > (campaignDetails.noOfContributors / 2) &&
           parseFloat(campaignDetails.raisedAmount) >= parseFloat(campaignDetails.targetGoal);
  };
  
  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Funding Requests</h2>
        <p className="text-gray-500 mb-8">No funding requests have been created yet.</p>
        {isManager && (
          <p className="text-sm text-indigo-600">
            As the campaign manager, you can create new funding requests.
          </p>
        )}
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Funding Requests</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount (ETH)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recipient
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Approvals
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id} className={request.complete ? 'bg-green-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {request.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.value}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.recipient.slice(0, 6)}...{request.recipient.slice(-4)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.approvalCount} / {campaignDetails.noOfContributors}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {request.complete ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  ) : request.approvalCount > (campaignDetails.noOfContributors / 2) ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Ready
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {!request.complete && !request.hasVoted && parseFloat(campaignDetails.userContribution) > 0 && (
                    <button
                      onClick={() => onVote(request.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Approve
                    </button>
                  )}
                  
                  {canFinalizeRequest(request) && (
                    <button
                      onClick={() => onFinalize(request.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Finalize
                    </button>
                  )}
                  
                  {request.complete && (
                    <span className="text-green-600 flex items-center justify-end">
                      <CheckCircleIcon className="h-5 w-5 mr-1" />
                      Finalized
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RequestList;