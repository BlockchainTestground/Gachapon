import {getWeb3, getContract, convertWeiToCrypto, convertCryptoToWei, getRevertReason} from './utils.js';

var NETWORK_ID = 137 //Matic
var TESTNET_ID = 4   //Rinkeby
//var NETWORK_ID = 80001 //Mumbai
var contract
var accounts
var balance
var onConfirmClickCallback
var maximum_bet
var minimum_bet
var bet_percentage_fee

function isConnected()
{
  return accounts != null
}

function onDisconnect() {
  document.getElementById("wallet-disconnected").style.display = "block"
  document.getElementById("wallet-connected").style.display = "none"
  document.getElementById("wallet-connected").style.display = "none"
  
  //document.getElementById("logout-button").style.display = "none"
}

var getTokenAttack = async function(token_id) {
  var attack = await contract.methods.token_attack(token_id).call()
  return attack
}

var getTokenURI = async function(token_id) {
  var uri_id = await contract.methods.token_uri_ids(token_id).call()
  var uri = await contract.methods.uri_pool(uri_id).call()
  return uri
}

var getMyBalance = async function() {
  var balance = await contract.methods.balanceOf(accounts[0]).call()
  return balance
}

var getMyTokenByIndex = async function(index) {
  var token = await contract.methods.tokenOfOwnerByIndex(accounts[0], index).call()
  return token
}

var getMyNFTs = async function (callback) {
  //docs: https://docs.opensea.io/reference#getting-assets
  const fetch = require('node-fetch');
  const url = 'https://rinkeby-api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=20&asset_contract_address=0xe540A4Cd48be4a1cD9ab24A1670A589344106C7E&owner='+accounts[0];
  const options = {method: 'GET'};

  fetch(url, options)
    .then(res => res.json())
    .then(json => callback(json))
    .catch(err => console.error('error:' + err));
}

var getBalance = async function (callback) {
  var result = await web3.eth.getBalance(accounts[0])
  callback(result)
}

function disconnectWallet() {
  accounts = null
  balance = null
  onDisconnect()
}

function setConfirmTransactionCallback(confirmClickCallback) {
  onConfirmClickCallback = confirmClickCallback
}

async function onConnect() {
  accounts = await web3.eth.getAccounts()
  maximum_bet = await contract.methods.maximum_bet().call()
  minimum_bet = await contract.methods.minimum_bet().call()
  bet_percentage_fee = await contract.methods.bet_percentage_fee().call()

  document.getElementById("my-address").innerHTML = accounts[0].substring(0, 6) + "..." + accounts[0].substring(accounts[0].length-4, accounts[0].length)
  document.getElementById("wallet-disconnected").style.display = "none"
  document.getElementById("wallet-connected").style.display = "block"

  //document.getElementById("logout-button").style.display = "block"
  document.getElementById('modal_text').innerHTML =
    "The minimum bet is " + convertWeiToCrypto(minimum_bet) +
    " Matic and the maximum bet is " +
    convertWeiToCrypto(maximum_bet) + " Matic. " +
    (bet_percentage_fee/100) + "% the prize goes to oracles fees and development team."
  document.getElementById('bet_amount').value = convertWeiToCrypto(getMinimumBet())
}

async function initContractInteraction() {
  var awaitWeb3 = async function () {
    web3 = await getWeb3();
    web3.eth.net.getId((err, netId) => {
      if (netId == NETWORK_ID || netId == TESTNET_ID) {
        document.getElementById("loading-web3").style.display = "none";
        var awaitContract = async function () {
          contract = await getContract(web3);
          var awaitAccounts = async function () {
            onConnect()
          };
          awaitAccounts();
        };
        awaitContract();
      } else {
        document.getElementById("loading-web3").style.display = "none";
        document.getElementById("wallet-disconnected").style.display = "none";
        document.getElementById("wallet-connected").style.display = "none";
        document.getElementById("wrong-network").style.display = "block";
      }
    });
  };
  awaitWeb3();
}

initContractInteraction()

var mintNFT = async function (callback) {
  await contract.methods
    .mintNFT(accounts[0])
    .send({ from: accounts[0], gas: 400000 })
    .on('transactionHash', function(hash){
      console.log("transactionHash")
      onConfirmClickCallback()
    })
    .on('receipt', function(receipt){
      console.log("receipt")
      callback(true)
    })
    .on('confirmation', function(confirmationNumber, receipt){
      console.log("confirmation")
    })
    .on('error', function(error, receipt) {
      console.log("error")
      callback(false)
      //getRevertReason(receipt.transactionHash);
      //document.getElementById('status').innerHTML = "Error: Transaction reverted"
    }).catch((revertReason) => {
      //getRevertReason(revertReason.receipt.transactionHash);
    });
}

var roll = async function (selection, amount, callback) {
  await contract.methods
    .roll(selection)
    .send({ from: accounts[0], gas: 400000, value: convertCryptoToWei(amount) })
    .on('transactionHash', function(hash){
      console.log("transactionHash")
      onConfirmClickCallback()
    })
    .on('receipt', function(receipt){
      console.log("receipt")
      callback(true)
    })
    .on('confirmation', function(confirmationNumber, receipt){
      console.log("confirmation")
    })
    .on('error', function(error, receipt) {
      console.log("error")
      callback(false)
      //getRevertReason(receipt.transactionHash);
      //document.getElementById('status').innerHTML = "Error: Transaction reverted"
    }).catch((revertReason) => {
      //getRevertReason(revertReason.receipt.transactionHash);
    });
}

var getPlayerRequestId = async function (callback) {
  var result = await contract.methods
  .player_request_id(accounts[0]).call()
  callback(result)
}

var getContractBalance = async function (callback) {
  var result = await web3.eth.getBalance(contract.options.address)
  console.log(contract.options.address)
  callback(result)
}

var getLinkBalance = async function (callback) {
  var result = await contract.methods
  .getLinkBalance().call()
  callback(result)
}

var getGame = async function (request_id, callback) {
  var result = await contract.methods
    .games(request_id).call()
  callback(result)
}

function getMaximumBet() {
  return maximum_bet
}

function getMinimumBet() {
  return minimum_bet
}

function getBetPercentageFee() {
  return bet_percentage_fee
}

async function loadNavbar() {
  const contentDiv = document.getElementById("navbar");
  contentDiv.innerHTML = await (await fetch("./html/navbar.html")).text()

  container.addEventListener("click", function () {
    document.getElementById('rules_modal').classList.remove('is-active')
  }, false);
  rules_modal_card.addEventListener("click", function (ev) {
    ev.stopPropagation();
  }, false);
  rules_button.addEventListener("click", function (ev) {
    document.getElementById('rules_modal').classList.add('is-active')
    ev.stopPropagation();
  }, false);

  // Dropdowns in navbar
  var $dropdowns = getAll('.navbar-item.has-dropdown:not(.is-hoverable)');

  if ($dropdowns.length > 0) {
    $dropdowns.forEach(function ($el) {
      $el.addEventListener('click', function (event) {
        event.stopPropagation();
        $el.classList.toggle('is-active');
      });
    });

    document.addEventListener('click', function (event) {
      closeDropdowns();
    });
  }

  function closeDropdowns() {
    $dropdowns.forEach(function ($el) {
      $el.classList.remove('is-active');
    });
  }

  // Close dropdowns if ESC pressed
  document.addEventListener('keydown', function (event) {
    var e = event || window.event;
    if (e.keyCode === 27) {
      closeDropdowns();
    }
  });

  // Toggles
  var $burgers = getAll('.burger');
  if ($burgers.length > 0) {
    $burgers.forEach(function ($el) {
      $el.addEventListener('click', function () {
        var target = $el.dataset.target;
        var $target = document.getElementById(target);
        $el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }

  // Functions
  function getAll(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
  }
}

loadNavbar()

export {
  isConnected,
  roll,
  disconnectWallet,
  setConfirmTransactionCallback,
  getPlayerRequestId,
  getContractBalance,
  getLinkBalance,
  getGame,
  convertWeiToCrypto,
  convertCryptoToWei,
  getTokenAttack,
  getTokenURI,
  getMyNFTs,
  getMyBalance,
  getMyTokenByIndex,
  getBalance,
  getMaximumBet,
  getMinimumBet,
  getBetPercentageFee,
  mintNFT
}