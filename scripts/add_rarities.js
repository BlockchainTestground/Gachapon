const Gachapon = artifacts.require("Gachapon");

module.exports = async function(callback) {
  console.log("Init") 
  gachapon = await Gachapon.deployed()
  await gachapon.addRarityToPool("normal")
  console.log("pass")
  await gachapon.addRarityToPool("rare")
  callback()
}