require('dotenv').config()
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = 'bucket robust eager rabbit drum attitude power sight hazard cost real aim';
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
     ropsten: {
      provider: function() { 
        console.log(`https://ropsten.infura.io/${process.env.INFURA_API_KEY}`)
        return new HDWalletProvider(process.env.WALLET_MNEMONIC, `https://ropsten.infura.io/${process.env.INFURA_API_KEY}`)
      },
      gas: 1000000,
      network_id: 3
    },
    "live":{
      provider: function() {
        return new HDWalletProvider(process.env.WALLET_MNEMONIC, `https://mainnet.infura.io/${process.env.INFURA_API_KEY}`)
      },
      network_id: 1
    }
  }
};