// ignition/modules/WeiFund.js
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TARGETGOAL = ethers.parseEther("10")// 10000wei 
const DEADLINE = 2* 60 * 60; // 

const WeiFundModule = buildModule("weifund", (m) => {
  const weiFund = m.contract("weifund", [TARGETGOAL, DEADLINE]);
  
  return { weiFund };
});

module.exports = WeiFundModule;