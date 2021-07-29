const Gachapon = artifacts.require("Gachapon");

module.exports = async function(callback) {
  console.log("Init")
  gachapon = await Gachapon.deployed()
  await gachapon.addClassToPool("eth")
  console.log("pass")
  await gachapon.addClassToPool("doge")
  callback()
}