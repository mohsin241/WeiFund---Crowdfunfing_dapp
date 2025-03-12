import React, { useState } from 'react';

function ContributeForm({ onContribute }) {
  const [contribution, setContribution] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contribution || isNaN(parseFloat(contribution)) || parseFloat(contribution) <= 0) {
      return;
    }
    
    setLoading(true);
    try {
      await onContribute(contribution);
      setContribution('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Contribute to Campaign</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="contribution" className="block text-sm font-medium text-gray-700 mb-1">
            Contribution Amount (ETH)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              step="0.0001"
              min="0.0001"
              id="contribution"
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-12 py-3 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">ETH</span>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Minimum contribution: 100 wei (0.0000000000000001 ETH)
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Contribute Now'}
        </button>
      </form>
    </div>
  );
}

export default ContributeForm;