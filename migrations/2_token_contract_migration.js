var tokenContract = artifacts.require("./Anypay.sol");

module.exports = function(deployer) {
  deployer.deploy(tokenContract);
};
