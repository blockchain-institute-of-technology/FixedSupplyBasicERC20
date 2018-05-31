pragma solidity ^0.4.21;
import 'openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract StandardERC20 is StandardToken {

	string public name;// = "StandardERC20";
    string public symbol;// = "SERC20";
    uint8 public decimals;// = 18;


  constructor(address initialAccount, uint256 initialBalance, string _name, string _symbol, uint8 decimals) public {
    balances[initialAccount] = initialBalance;
    totalSupply_ = initialBalance;
  }
}
