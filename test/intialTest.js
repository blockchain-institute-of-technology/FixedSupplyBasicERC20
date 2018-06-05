//const assertRevert =  require('../assertRevert');
const tokenContract = artifacts.require('Anypay');


contract('StandardToken', function (accounts) {
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  //beforeEach(async function () {
    //this.token = await tokenContract.deployed()(owner, 100);
  //});

  describe("Contract deployment", function(){
    it("should put 100 StandardErc20 in the deployers account", function() {
      return tokenContract.deployed().then(function(instance) {
        return instance.balanceOf(accounts[0]);
      }).then(function(balance) {
        assert.equal(balance.valueOf(), 100, "100 wasn't in the first account");
      });
    });
    it('should have totalSupply of 100', async function () {
      return tokenContract.deployed().then(function(instance) {
        return instance.totalSupply();
      }).then(function(_totalSupply) {
        assert.equal(_totalSupply.valueOf(), 100, "100 wasn't in the first account");
        });
      });
    it('should have 0 balance of random account', async function() {
      return tokenContract.deployed().then(function(instance) {
        return instance.balanceOf(accounts[7]);
      }).then(function(balance) {

        assert.equal(balance.valueOf(), 0, "0 wasn't in the rando account");
      });
    });
    it("Should deploy with less than 2 mil gas", async () => {
        let someInstance = await tokenContract.new();
        let receipt = await web3.eth.getTransactionReceipt(someInstance.transactionHash);
        console.log("GAS USED", receipt.gasUsed );
        assert.isBelow(receipt.gasUsed, 2000000);
      });
  });

  describe('Transfer function', function(){
    it('should allow valid transfer amounts', async function() {
      const to = accounts[2];
      const sender = accounts[0]
      const amount = 10;
      var instance;
 
      return tokenContract.deployed().then( async function(_instance) {
        instance = _instance;
        await instance.transfer(to, amount, { from: sender });
        return instance.balanceOf(accounts[0]);
      }).then(function(_balance0) {
        assert.equal(_balance0.valueOf(), 90, "Sender balance should be deducted");
        return instance.balanceOf(accounts[2]);
      }).then(function(_balance2){
        assert.equal(_balance2.valueOf(), 10, "Reciever balance should be added");
      });
    });
    it('should not allow invalid transfer amounts', async function() {
      const to = accounts[3];
      const sender = accounts[0]
      const amount = 1000;
      var instance;
 
      return tokenContract.deployed().then( async function(_instance) {
        instance = _instance;
        try{
          await instance.transfer(to, amount, { from: sender });
          assert.fail('Expected revert not received');
        }
        catch(error){
          const revertFound = error.message.search('revert') >= 0;
          assert(revertFound, `Expected "revert", got ${error} instead`);
        }
        return instance.balanceOf(accounts[0]);
      }).then(function(_balance0) {
        assert.equal(_balance0.valueOf(), 90, "Sender balance should not be deducted");
        return instance.balanceOf(to);
      }).then(function(_balance2){
        assert.equal(_balance2.valueOf(), 0, "Reciever balance should not be added");
      });
    });
    it('should emit event on transfer', function() {
      const to = accounts[2];
      const sender = accounts[0]
      const amount = 10;
      return tokenContract.deployed().then(async function(instance) {
        instance = instance;
        const { logs } = await instance.transfer(to, amount, { from: sender });
        assert.equal(logs.length, 1);
        assert.equal(logs[0].event, 'Transfer');
        assert.equal(logs[0].args.from, sender);
        assert.equal(logs[0].args.to, to);
        assert(logs[0].args.value.eq(amount));
      });
    });
    it('should not allow transfer from Zero address', async function(){
      return tokenContract.deployed().then(async function(instance) { 
        const to = ZERO_ADDRESS;
        try{
          await instance.transfer(to, 1000, { from: accounts[0] });
          assert.fail('Expected revert not received');
        }
        catch(error){
          const revertFound = error.message.search('revert') >= 0;
          assert(revertFound, `Expected "revert", got ${error} instead`);
        }
      });
    });
  });
  describe('Approval functionality', function(){
    it('should emit event upon approval', function(){
      const spender = accounts[1];
      const amount = 10;
      return tokenContract.deployed().then(async function(instance) {
        const { logs } = await instance.approve(spender, amount, { from: accounts[0]});
        assert.equal(logs.length, 1);
        assert.equal(logs[0].event, 'Approval');
        assert.equal(logs[0].args.owner, accounts[0]);
        assert.equal(logs[0].args.spender, spender);
        assert(logs[0].args.value.eq(amount));
      });
    });
    it('should increase allowance of spender, testing when no approved amount before', async function() {
      var owner = accounts[0];
      var spender = accounts[1];
      const amount = 10;
      return tokenContract.deployed().then( async function(instance) {
        await instance.approve(spender, amount, { from: owner });
        const allowance = await instance.allowance(owner, spender);
        assert.equal(allowance, amount);
        });
    });
    it('should change allowance of spender, testing when there was approved amount before', async function() {
      var owner = accounts[0];
      var spender = accounts[1];
      const amount = 10;
      return tokenContract.deployed().then( async function(instance) {
        await instance.approve(spender, amount, { from: owner });
        const allowance = await instance.allowance(owner, spender);
        assert.equal(allowance, amount);
      
        const newAllowance = 5;
        await instance.approve(spender, newAllowance, { from: owner });
        const allowance1 = await instance.allowance(owner, spender);
        assert.equal(allowance1, newAllowance);
        });
      });
    });
  describe('transferFrom', function () {
    describe('when owner has enough balance', function(){
      it('should transfers the requested amount', async function () {
      const spender = accounts[4];
      const owner = accounts[0];
      const to = accounts[1];
      const amount = 10;
      return tokenContract.new().then( async function(instance){
        const spender = accounts[4];
        const owner = accounts[0];
        const to = accounts[1];
        const amount = 10;
        await instance.approve(spender, amount, { from: owner });
        await instance.transferFrom(owner, to, amount, { from: spender });
        const senderBalance = await instance.balanceOf(owner);
        assert.equal(senderBalance.valueOf(), 90);
        const recipientBalance = await instance.balanceOf(to);
        assert.equal(recipientBalance.valueOf(), amount);
      });
      });
      it('decreases the spender allowance', async function () {
      const spender = accounts[4];
      const owner = accounts[0];
      const to = accounts[1];
      const amount = 10;
      return tokenContract.new().then( async function(instance) {
        await instance.approve(spender, 10, { from: owner });
        await instance.transferFrom(owner, to, amount, { from: spender });
        const allowance = await instance.allowance(owner, spender);
        assert(allowance.eq(0));
      });
      });
      it('emits a transfer event', async function () {
      const spender = accounts[4];
      const owner = accounts[0];
      const to = accounts[1];
      const amount = 10;
      return tokenContract.new().then( async function(instance) {
        await instance.approve(spender, 10, { from: owner });
          const { logs } = await instance.transferFrom(owner, to, amount, { from: spender });
          assert.equal(logs.length, 1);
          assert.equal(logs[0].event, 'Transfer');
          assert.equal(logs[0].args.from, owner);
          assert.equal(logs[0].args.to, to);
          assert(logs[0].args.value.eq(amount));
        });
      });
      });
    describe('when owner does not have enough balance', function(){
      it('should revert transaction', async function(){
        const spender = accounts[4];
        const owner = accounts[0];
        const to = accounts[1];
        const amount = 101;
        return tokenContract.new().then( async function(instance) {
          await instance.approve(spender, amount, { from: owner });
          try{
            await instance.transferFrom(owner, to, amount, { from: spender });
            assert.fail('Expected revert not received');
          }
          catch(error){
            const revertFound = error.message.search('revert') >= 0;
            assert(revertFound, `Expected "revert", got ${error} instead`);
          }
        });
      });
    });
    describe('when the spender does not have enough approved balance', async function(){
      it('should revert transaction', async function(){
        const spender = accounts[4];
        const owner = accounts[0];
        const to = accounts[1];
        const amount = 101;
        return tokenContract.new().then( async function(instance) {
            await instance.approve(spender, 1, { from: owner });
            try{
              await instance.transferFrom(owner, to, amount, { from: spender });
              assert.fail('Expected revert not received');
            }
            catch(error){
              const revertFound = error.message.search('revert') >= 0;
              assert(revertFound, `Expected "revert", got ${error} instead`);
            }
        });
      });
    });
    describe('when the recipient is the zero address', function () {
      const amount = 100;
      const spender = accounts[4];
      const owner = accounts[0];
      const to = ZERO_ADDRESS;
      var instance;
      it('should revert', async function(){
        const amount = 100;
        const to = ZERO_ADDRESS;
        return tokenContract.new().then( async function(instance) {
          await instance.approve(spender, amount, { from: owner });
          try{
            await instance.transferFrom(owner, to, amount, { from: spender });
            assert.fail('Expected revert not received');
          }
          catch(error){
            const revertFound = error.message.search('revert') >= 0;
            assert(revertFound, `Expected "revert", got ${error} instead`);
          }
        });
      });
    });
  });
});