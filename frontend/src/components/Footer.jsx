import React from 'react';
  
function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-white">WeiFund</h3>
            <p className="text-sm">Decentralized Crowdfunding on Ethereum</p>
          </div>
          
          <div className="text-sm">
            &copy; {new Date().getFullYear()} WeiFund. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
