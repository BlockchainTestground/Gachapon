const Gachapon = artifacts.require("Gachapon");

module.exports = async function(callback) {
  console.log("Init")
  gachapon = await Gachapon.deployed()
  await gachapon.addURIToPool("https://ipfs.io/ipfs/QmSYSQtp1CbtQJMYFEi79xyP8w6EKjL1o8QMskAEeQe17c", "eth", "normal", 5)
  await gachapon.addURIToPool("https://ipfs.io/ipfs/QmQQN9CopBcKtFdwwe1jPVHdec9LB65ZoqkWCU82DmUXXd", "eth", "normal", 6)
  await gachapon.addURIToPool("https://ipfs.io/ipfs/QmYw2sc4Rpf2L2VXWCNmCWVAAqb8QMU4DUCKp51yvgVeMC", "eth", "normal", 7)
  await gachapon.addURIToPool("https://ipfs.io/ipfs/QmeCdxhtJsrXWaTzNNe7W43usdPgVVVXmkfe9cgabTF4Nr", "eth", "normal", 8)
  await gachapon.addURIToPool("https://ipfs.io/ipfs/QmePhNkHCM4XFmTEz7mvY28Z9SjgjK9ZaxZNdnqBL8cUjo", "eth", "normal", 9)
  await gachapon.addURIToPool("https://ipfs.io/ipfs/QmPEtUL1cijtpDqq2qDQvkf84Pn7n1FjWFJ27Md5coK1Hy", "eth", "normal", 10)

  console.log("pass")
  
  await gachapon.addURIToPool("https://ipfs.io/ipfs/QmQdxxSXDwUjGpTxAR1iKyQ5mVb6cjjXoKJHJMUXsL4oVS", "eth", "rare", 5)
  await gachapon.addURIToPool("https://ipfs.io/ipfs/QmPqdKXZaXwQdhN3uZzVPjkduvCgv5WiYpktAsFyddLXTS", "eth", "rare", 6)
  await gachapon.addURIToPool("https://ipfs.io/ipfs/QmU9BQ56X67Ewhmq2rq8XU53R48acJ9iDs4ufJNnSF3yGN", "eth", "rare", 7)
  await gachapon.addURIToPool("https://ipfs.io/ipfs/QmYHB2bPLHNoBe2aKoTvyFYYjQvNt5F7ureDmv6d6uDxcu", "eth", "rare", 8)
  await gachapon.addURIToPool("https://ipfs.io/ipfs/QmUqgGCcrZC17HDNqV6hDcnyofaV9RHVd1smmBmBuZbpZC", "eth", "rare", 9)
  await gachapon.addURIToPool("https://ipfs.io/ipfs/QmZ6M5UEEGKFEXgGG3Xgjkf68GGD71wkJvCQgsNfmPpPAs", "eth", "rare", 10)

  console.log("pass")
  
  await gachapon.addURIToPool("https://ipfs.io/ipfs/QmRF3qDZa6iQ38kWMWocjNgtCLU4XeukN1BKcWv3Zo3rrH", "doge", "normal", 5)
  await gachapon.addURIToPool("https://ipfs.io/ipfs/QmWtSQffzVxcBVw2GcK3rYrs1aKxueYgnJgqHfpNKVUN5j", "doge", "normal", 6)
  await gachapon.addURIToPool("https://ipfs.io/ipfs/QmdLTAWxNaUfko49kgBmYCeHRCRuYpwoVp1CdWFXWPjcRJ", "doge", "normal", 7)
  await gachapon.addURIToPool("https://ipfs.io/ipfs/QmRdMjZwUjPGHeoosxzDDxNMZnw3JPB6qMB6YXhqDPFW34", "doge", "normal", 8)
  await gachapon.addURIToPool("https://ipfs.io/ipfs/QmSqeKFyYTsyPFejMxZ9FR6nDorXeDznEz2WwbyaizN3Sj", "doge", "normal", 9)
  await gachapon.addURIToPool("https://ipfs.io/ipfs/QmdcvdqA843PsfNGapXrSD6mx7rfGU2M2rtX4bB6w4wCe8", "doge", "normal", 10)

  console.log("pass")
  
  await gachapon.addURIToPool("https://ipfs.io/ipfs/QmXq2mc4YdHTB7DAvWfkJJQFZzDoHcC3rQecwyryuEzzTF", "doge", "rare", 5)
  await gachapon.addURIToPool("https://ipfs.io/ipfs/QmShuv8ZnUYtRqajnZQ7VrjiY2PKY6BJr526oJPnujsVhk", "doge", "rare", 6)
  await gachapon.addURIToPool("https://ipfs.io/ipfs/QmePbPGYcGxLJtBZJAVbDuVTbt5qrGRwyZJSz8R7Edws2k", "doge", "rare", 7)
  await gachapon.addURIToPool("https://ipfs.io/ipfs/QmZiyNF3GN9DiufAFkh7EQKmAvjUKvVxp3tgKj6bau3nGe", "doge", "rare", 8)
  await gachapon.addURIToPool("https://ipfs.io/ipfs/QmXBhhzURTv8w3RBwFEr7JoVRut44R44Cg3K1KrG9qimuv", "doge", "rare", 9)
  await gachapon.addURIToPool("https://ipfs.io/ipfs/Qmb4rWcjWdK5tzytw6bLS4vNrJaw2i2niKJBSJ4Qnm5Jev", "doge", "rare", 10)
  callback()
}