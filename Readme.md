# Dependencies

```bash
npm install
```

# Compile

```bash
truffle compile
```

# Deploy

Create a new migration on the `./migrations/` directory following the same sequence. Create a `.secret` file and paste your mnemonic. An then:

```bash
truffle migrate --network mumbai
truffle migrate --network matic
```

# Current Deployment

Currently deployed at `0x08fE642B2adC1B156961BE2e2730B436C8b57C7a` on testnet mumbai.

# Related contracts and documentation

Rinkeby:

ERC20 Contract: `0x580Bc45A840EEba370D044d75370d1d5CBE9a5fc`

Gachapon Contract: `0xC7997c3767A8AACD8DE3c9972C6c7FDf97E9E37E`

```
npx truffle console --network rinkeby
gacha = await Gachapon.deployed()
gacha.addURIToPool("https://ipfs.io/ipfs/QmSibHP8La2HmZostakEq6sWVMs8aoQGqGuTAWfxBrtqNA")
gacha.addURIToPool("https://ipfs.io/ipfs/QmXQVhyWEGDYRX4w5XW1LFeEUgBym56PLMS23UtSG1ox5x")
```

Doge NFT URI: `https://ipfs.io/ipfs/QmSibHP8La2HmZostakEq6sWVMs8aoQGqGuTAWfxBrtqNA`

ETH NFT URI: `https://ipfs.io/ipfs/QmXQVhyWEGDYRX4w5XW1LFeEUgBym56PLMS23UtSG1ox5x`

This also uses the [Link Token Contract](https://docs.chain.link/docs/link-token-contracts/) and [Link VRF Contract](https://docs.chain.link/docs/vrf-contracts/).

* Matic:
  * Link Token: `0xb0897686c545045aFc77CF20eC7A532E3120E0F1`
  * VRF Coordinator: `0x3d2341ADb2D31f1c5530cDC622016af293177AE0`
  * Key Hash: `0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da`
  * Fee: `0.0001 LINK`
* Mumbai: 
  * Link Token: `0x326C977E6efc84E512bB9C30f76E30c160eD06FB`
  * VRF Coordinator: `0x8C7382F9D8f56b33781fE506E897a4F1e2d17255`
  * Key Hash: `0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4`
  * Fee: `0.0001 LINK`