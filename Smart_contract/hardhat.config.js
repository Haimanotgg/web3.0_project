/** @type import('hardhat/config').HardhatUserConfig */

require('@nomiclabs/hardhat-waffle');
require("dotenv").config();
module.exports = {
  solidity: "0.8.18",
  networks : {
    sepolia : {
      url : "https://eth-sepolia.g.alchemy.com/v2/sxVKAxupCilZu2V2Vv11tJ2883fMavJV",
      accounts:['']
  }
  }
};
