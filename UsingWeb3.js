var Web3 = require('Web3')
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/9IVwUjnwncMb0oQAHHIP"));
web3.currentProvider

web3.eth.accounts.wallet.add(' add private key here ')
const fs = require('fs')
const Abi = JSON.parse(fs.readFileSync('contractAbi.json', 'utf8'))
const myContract = new web3.eth.Contract(Abi, '0xf78fd2bf9af56c1e26335ea3b0759c5f84ecaaa5', { from: '', gasPrice: '20000000000'})

//To get the symbol
myContract.methods.symbol().call().then(console.log).catch(console.error)

//To transfer tokens 
myContract.methods.transfer('0xA7A10e02B4A5243eFe24d651ccc6566c6dDA9506', 1).send().then(console.log).catch(console.error)

