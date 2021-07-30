const MyERC20 = artifacts.require("MyERC20");
const Gachapon = artifacts.require("Gachapon");
const Duels = artifacts.require("Duels");

module.exports = function (deployer, network, accounts) {
  deployer.then(async () => {
      await deployer.deploy(MyERC20);
      await deployer.deploy(Gachapon);
      await deployer.deploy(Duels, Gachapon.address);
  });
};