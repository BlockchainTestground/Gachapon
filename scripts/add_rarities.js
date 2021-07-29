gachapon = await Gachapon.deployed()

await gachapon.addRarityToPool("normal")
await gachapon.addRarityToPool("rare")