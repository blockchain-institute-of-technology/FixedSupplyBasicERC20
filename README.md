Creating an Standard ERC20 Token with OpenZepplin 
======

An ERC20 Token is one that follows the ERC20 interface for the the Ethereum Blockchain.  The token may include custom logic but all ERC20 tokens implement these 6 methods and 2 Events. 

**Functions**

1. totalSupply [Get the total token supply]
2. balanceOf(address _owner) constant returns (uint256 balance) [Get the account balance of another account with address _owner]
3. transfer(address _to, uint256 _value) returns (bool success) [Send _value amount of tokens to address _to]
4. transferFrom(address _from, address _to, uint256 _value) returns (bool success)[Send _value amount of tokens from address _from to address _to]
5. approve(address _spender, uint256 _value) returns (bool success) [Allow _spender to withdraw from your account, multiple times, up to the _value amount. If this function is called again it overwrites the current allowance with _value]
6. allowance(address *_owner*, address *_spender*) constant returns (uint256 remaining) [Returns the amount which _spender is still allowed to withdraw from _owner]

**Events format:**

Transfer(address indexed _from, address indexed _to, uint256 _value). [Triggered when tokens are transferred.]
Approval(address indexed _owner, address indexed _spender, uint256 _value)[Triggered whenever approve(address _spender, uint256 _value) is called.]

We will implement an ERC20 token using the truffle framework, open-zepplin solidity library and CircleCI auto-build integration

### Ganache 
Ganache is a local blockchain that can be used for testing.
Download here [Truffle Download](http://truffleframework.com/ganache/)

### Truffle

To use with Truffle, first install it and initialize your project with `truffle init`.

```sh
npm install -g truffle
mkdir myproject && cd myproject
truffle init
```

### Using Infura 

To interact with the Ethereum Network you must use an Ethereum node.  For this tutorial we will rely on [Infura](https://infura.io/about), infura provides stable and reliable RPC access to Etereum APIs. Infura does not manage your private keys, which means Infura cannot sign transactions on your behalf.
However, Truffle can sign transactions through the use of its HDWalletProvider. This provider can handle the transaction signing as well as the connection to the Ethereum network. To use Infura you must [register](https://infura.io/signup) and use an Infura Access Token 

```sh
npm install truffle-hdwallet-provider
npm install dotenv
```

### Installing OpenZeppelin

After installing either Framework, to install the OpenZeppelin library, run the following in your Solidity project root directory:

```sh
npm init -y
npm install -E openzeppelin-solidity
```

### Configuration

The first thing we must do is to configure our Truffle project to connect to a network.  First for testing we want to connect to a local blockchain running on our machine with Ganache, as we continue to develop we may want to test our smart contract on an Ethereum testnet like Ropsten and finally we will want to automatically deploy to Ethereums mainnet via truffle.

In the truffle.js add these lines of code 
```sh 
require('dotenv').config()
var HDWalletProvider = require("truffle-hdwallet-provider");
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
```

It is important to keep seceret variables seceret! You do not want to publish your mnemonic seed or access tokens, to hide these we will set up enviornment variables.  In the terminal create a .env file to store your enviornment variables and then a .gitignore file so it is not added to your repo.

```sh
touch .env
touch .gitignore 
echo ".env" >> .gitignore
```

Here is a sample of what your .env should look like we are using a main net account 

```sh
# Ropsten node config

ROPSTEN_HOST = localhost
ROPSTEN_PORT = 8000
ROPSTEN_FROM_ADDRESS = 0x9c76b879dceb4936b890127be7e4930ca9525db4 
MAIN_FROM_ADDRESS = 

# Infura config

#Test account
TEST_WALLET_MNEMONIC = bucket robust eager rabbit drum attitude power sight hazard cost real aim

WALLET_MNEMONIC = 

INFURA_API_KEY = 9IVwUjnwncMb0oQAHHIP
```

```sh
{
  "name": "ls",
  "version": "1.0.0",
  "description": "",
  "main": "truffle-config.js",
  "directories": {
    "test": "test"
  },
  "scripts": {
    "test": "truffle test",
    "deploy:ropsten": "truffle migrate --network ropsten"
    "deploy:mainnet"  "truffle migrate --network live"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "openzeppelin-solidity": "^1.9.0",
    "truffle-hdwallet-provider": "0.0.5",
    "web3": "^1.0.0-beta.34"
  }
}
```

### Creating the Smart Contract
We are leveraging [openzepplins](https://openzeppelin.org/) ERC20 Standard Token contract.  This token contract implements all of the necessary methods we need for deploying an ERC20 token.  We simply need to provide a name, symbol, initial supply, owner of initial supply, and specify the number of decimal places for each unit of our token.

```sh
pragma solidity ^0.4.21;
import 'openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
contract Anypay is StandardToken {
    
    string public name = "Anypay";
    string public symbol = "ANY";
    uint8 public decimals = 0;

    function Anypay() public {
      address owner = msg.sender;
      uint supply = 100;
      balances[owner] = supply;
      totalSupply_ = supply;
    }
}

```

If you are deploying your own contract than this contract works fine, the initial supply is intialized into the msg.senders account.  Lets say you are deploying a token for a client, you will not want the intial funds to be sent to your address.  Modify the code in this way to send to any public eth adderess. NOTE this will break the truffle tests because the tests rely on being able to control the owners private key.

```sh
pragma solidity ^0.4.21;
import 'openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
contract Anypay is StandardToken {
    string public name = "Anypay";
    string public symbol = "ANY";
    uint8 public decimals = 0;

    
  function Anypay() public {
      uint supply = 1000000000000;
      address owner = 0x89287BEC6C4E79552d562DA799500884CC22a39B;
      balances[owner] = supply;
      totalSupply_ = supply;
    }
}


```


### Migration 

Truffle handles contract deployment for us.  This means that the framework will compile your solidity contracts into EVM bytecode and then launch your contract using the network you specify and then run all the tests in the test directory if you are running on a test network. Read more at https://medium.com/@blockchain101/demystifying-truffle-migrate-21afbcdf3264

Under the migrations directory add a file named **2_token_contract_migration.js**
```sh
var tokenContract = artifacts.require("./Anypay.sol");

module.exports = function(deployer) {
  deployer.deploy(tokenContract);
};

```

### Testing 
Smart contracts must be thoroughly tested for they are immutable and often deal with real money.  [Example tests](https://github.com/blockchain-institute-of-technology/FixedSupplyBasicERC20/blob/master/test/intialTest.js)
```sh 
npm test
```

### Deploying on mainnet 

```sh
npm run deploy:mainnet
```
 
### Interacting with the contract using web3

Once the contract is deployed it is open to the public to interact with.  To interact with our contract we can use the node module [web3](https://web3js.readthedocs.io/en/1.0/getting-started.html)

```sh 
npm install web3 --save
node
```

Inside the node console we will first intialize web3 with our infura provider 

```sh
var Web3 = require('Web3')
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/9IVwUjnwncMb0oQAHHIP"));
web3.currentProvider
```

Next we need to add our wallet to the web3 instance so that we can sign transactions.
```sh 
web3.eth.accounts.wallet.add(' add private key here ')
```

To talk to the contract we will have to provide the contracts ABI which stands for Abstract Binary Interface.  This is a json object that describes the funtionality of a contract. When you compile a contract with solc a contract ABI should appear in the /bin directory.  I find the easiest way to get your contracts ABI is to copy and paste the contract into the [remix compiler](https://remix.ethereum.org/) which is a in browser solidity compiler.  Under the compile tab in remix select details and it will provide a button to copy the contracts ABI to your clipboard.  I recommend then pasting the ABI to a JSON file in your root directory and then saving it.

NOTE: If your contract inherits from other contracts like Anypay.sol you will have to copy paste the inherited contracts into the remix browser.

```sh 
const Abi = JSON.parse(fs.readFileSync('contractAbi.json', 'utf8'))
const contractAddress = '0xf78fd2bf9af56c1e26335ea3b0759c5f84ecaaa5'
const myContract = new web3.eth.Contract(Abi, contractAddress, { from: '', gasPrice: '20000000000'})
```
#### Example calls

```sh
//To get the symbol
myContract.methods.symbol().call().then(console.log).catch(console.error)

//To transfer tokens 
myContract.methods.transfer('0xA7A10e02B4A5243eFe24d651ccc6566c6dDA9506', 1).send().then(console.log).catch(console.error)
```






