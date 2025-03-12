import React from 'react';
  
  function LoadingSpinner({ message = "Loading..." }) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    );
  }
  
  export default LoadingSpinner;