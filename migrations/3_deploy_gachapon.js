const Gachapon = artifacts.require("Gachapon");

module.exports = function (deployer) {
  deployer.deploy(Gachapon);
};