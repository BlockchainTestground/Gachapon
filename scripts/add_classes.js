const Gachapon = artifacts.require("Gachapon");

module.exports = async function(callback) {
  console.log("Init")
  gachapon = await Gachapon.deployed()
  console.log("Got the contract")
  await gachapon.addClassToPool("eth")
  console.log("pass")
  await gachapon.addClassToPool("doge")
  console.log("pass")
  callback()
}