// https://eth-goerli.g.alchemy.com/v2/eF4scgBB-QA_Oda7Y4Gu3MW_7I4XN0dN


require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: "0.8.18",
  networks : {
    goerli : {
      url : 'https://eth-goerli.g.alchemy.com/v2/eF4scgBB-QA_Oda7Y4Gu3MW_7I4XN0dN',
      account : ['42a381928f67cb44e8872a38477be89c425e635e53cba5f70bab83d4499750ba']
  }
  }
};
