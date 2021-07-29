const Gachapon = artifacts.require("Gachapon");

module.exports = async function(callback) {
  gachapon = await Gachapon.deployed()
  await gachapon.addRarityToPool("normal")
  await gachapon.addRarityToPool("rare")
  callback()
}