var tokenContract = artifacts.require("./StandardERC20.sol");

module.exports = function(deployer) {
  deployer.deploy(tokenContract);
};
