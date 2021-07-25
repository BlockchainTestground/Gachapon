import Web3 from "./web3.js";

var GACHA_CONTRACT_ABI_PATH = "./contracts/Gachapon.json"
var GAME_CONTRACT_ABI_PATH  = "./contracts/TestgroundGame.json"

function metamaskReloadCallback()
{
  window.ethereum.on('accountsChanged', (accounts) => {
    console.log("Accounts changed, realoading...")
    window.location.reload()
  })
  window.ethereum.on('networkChanged', (accounts) => {
    console.log("Network changed, realoading...")
    window.location.reload()
  })
}

const getWeb3 = async () => {
  return new Promise((resolve, reject) => {
    console.log(document.readyState)
    if(document.readyState=="complete")
    {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        metamaskReloadCallback()
        try {
          // ask user permission to access his accounts
          (async function(){
            await window.ethereum.request({ method: "eth_requestAccounts" });
          })()
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      } else {
        reject("must install MetaMask");
      }
    }else
    {
      window.addEventListener("load", async () => {
        metamaskReloadCallback()
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          try {
            // ask user permission to access his accounts
            await window.ethereum.request({ method: "eth_requestAccounts" });
            resolve(web3);
          } catch (error) {
            reject(error);
          }
        } else {
          reject("must install MetaMask");
        }
      });
    }
  });
};


function handleRevertError(message) {
  alert(message);
}

async function getRevertReason(txHash) {
  const tx = await web3.eth.getTransaction(txHash);
  await web3.eth
    .call(tx, tx.blockNumber)
    .then((result) => {
      throw Error("unlikely to happen");
    })
    .catch((revertReason) => {
      console.log(revertReason)
      var str = "" + revertReason;
      var json_reason = JSON.parse(str.substring(str.indexOf("{")));
      handleRevertError(json_reason.message);
    });
}

var gacha_contract
var game_contract

const getGachaContract = async (web3) => {
  const response = await fetch(GACHA_CONTRACT_ABI_PATH);
  const data = await response.json();
  
  const netId = await web3.eth.net.getId();
  const deployedNetwork = data.networks[netId];
  gacha_contract = new web3.eth.Contract(
    data.abi,
    deployedNetwork && deployedNetwork.address
    );
  return gacha_contract
};

const getGameContract = async (web3) => {
  const response = await fetch(GAME_CONTRACT_ABI_PATH);
  const data = await response.json();
  
  const netId = await web3.eth.net.getId();
  const deployedNetwork = data.networks[netId];
  game_contract = new web3.eth.Contract(
    data.abi,
    deployedNetwork && deployedNetwork.address
    );
  return game_contract
};

const convertToDateString = (epochTime) => {
  const date = new Date(epochTime * 1000);
  return date.toLocaleDateString("en-US");
};

const convertWeiToCrypto = (wei) => {
  const cryptoValue = web3.utils.fromWei(wei, "ether");
  return cryptoValue;
};

const convertCryptoToWei = (crypto) => {
  return web3.utils.toWei(crypto, "ether");
};

export { getWeb3, getGachaContract, getGameContract, convertWeiToCrypto, convertCryptoToWei, getRevertReason }