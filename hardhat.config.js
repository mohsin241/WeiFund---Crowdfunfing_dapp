require("@nomicfoundation/hardhat-toolbox");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks:{
    sepolia:{
      accounts:["87dc55e16903dc18639da9e7583f641b8fd4152705da4cdf7672612d144ca248"],
      url:"https://sepolia.infura.io/v3/e33cecb12ec3492bba4f0972afcfc4fa"
    },
    hardhat: {
      chainId: 31337, // Local Hardhat network chain ID
    }
    
  },
  etherscan:{
    apiKey:{
      sepolia: "FJIJWWVKD3JTETJISH33DJ2GA3IRKQJ1IG"
    }
  }
};