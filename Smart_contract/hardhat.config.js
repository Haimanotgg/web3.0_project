/** @type import('hardhat/config').HardhatUserConfig */

require('@nomiclabs/hardhat-waffle');
require("dotenv").config();
module.exports = {
  solidity: "0.8.18",
  networks : {
    sepolia : {
      url : "https://eth-sepolia.g.alchemy.com/v2/sxVKAxupCilZu2V2Vv11tJ2883fMavJV",
      accounts:['42a381928f67cb44e8872a38477be89c425e635e53cba5f70bab83d4499750ba']
  }
  }
};
