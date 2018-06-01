pragma solidity ^0.4.21;
import 'openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract StandardERC20 is StandardToken {

	string public name;// = "StandardERC20";
    string public symbol;// = "SERC20";
    uint8 public decimals;// = 18;


  function StandardERC20() public {
    balances[msg.sender] = 100;
    totalSupply_ = 100;
  }
}
