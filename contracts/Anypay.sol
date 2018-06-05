pragma solidity ^0.4.21;
import 'openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
contract Anypay is StandardToken {
	string public name = "Anypay";
  	string public symbol = "ANY";
  	uint8 public decimals = 0;

    
	function Anypay() public {
		address owner = msg.sender;
		uint supply = 100;
		//uint supply = 1000000000000;
  		//address owner = 0x89287BEC6C4E79552d562DA799500884CC22a39B;
    	balances[owner] = supply;
    	totalSupply_ = supply;
  	}
}
