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
#### **Warning** Do not use this mnemonic seed for real ETH this is just an example.
```sh 
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = 'bucket robust eager rabbit drum attitude power sight hazard cost real aim';
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      //gas: 1800000,
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
     ropsten: {
      provider: function() {
      	//0x9c76b879dceb4936b890127be7e4930ca9525db4 -> eth address
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/9IVwUjnwncMb0oQAHHIP", 0)
      },
      network_id: 3
    },
    "live":{
      network_id: 1,
      provider: function() {
        //0x9c76b879dceb4936b890127be7e4930ca9525db4 -> eth address
        return new HDWalletProvider(mnemonic, "https://mainnet.infura.io/9IVwUjnwncMb0oQAHHIP ", 0)
      }
    }
  }
};
```

We must modify our package.json file to let the truffle framework know what scripts to run

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
We are leveraging (openzepplins)[https://openzeppelin.org/ ] ERC20 Standard Token contract.  This token contract implements all of the necessary methods we need for deploying an ERC20 token.  We simply need to provide a name, symbol, initial supply, owner of initial supply, and specify the number of decimal places for each unit of our token.

```sh
pragma solidity ^0.4.21;
import 'openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
contract StandardERC20 is StandardToken {

	string public name = "StandardERC20";
    string public symbol = "SERC20";
    uint8 public decimals = 18;

    
  function StandardERC20() public {
    balances[msg.sender] = 1000000000000;
    totalSupply_ = 1000000000000;
  }
}

```


### Migration 

Truffle handles contract deployment for us.  This means that the framework will compile your solidity contracts into EVM bytecode and then launch your contract using the network you specify and then run all the tests in the test directory if you are running on a test network. Read more at https://medium.com/@blockchain101/demystifying-truffle-migrate-21afbcdf3264

### Testing 
Smart contracts must be thoroughly tested for they are immutable and often deal with real money.  

```sh 
npm test
```

Once all tests pass we can deploy on the mainnet 

### Deploying on mainnet 
```sh
truffle migrate --network live
```
 


