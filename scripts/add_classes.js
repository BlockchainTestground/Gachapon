async function asyncCall(callback) {
  console.log("1wx")
  gachapon = await Gachapon.deployed()
  console.log("2")
  await gachapon.addClassToPool("eth")
  console.log("3")
  await gachapon.addClassToPool("doge")
}

module.exports = async function(callback) {
  callback.then((x) => {
    console.log(123)
  })
}