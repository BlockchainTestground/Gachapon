import Phaser from "phaser";
import dragonBones from "./external/dragonBones";
import { roll,
  isConnected,
  disconnectWallet,
  setConfirmTransactionCallback,
  getPlayerRequestId,
  getContractBalance,
  getLinkBalance,
  getGame,
  convertWeiToCrypto,
  convertCryptoToWei,
  getTokenAttack,
  getMyNFTs,
  getBalance,
  getMaximumBet,
  getMinimumBet,
  mintNFT
} from "./blockchain/contract_interaction";
import animationTrigger from './AnimationTriggers';
const Result = {
  Pending: 0,
  PlayerWon: 1,
  PlayerLost: 2
}

var CANVAS_WIDTH = 1080
var CANVAS_HEIGHT = 1080

const config = {
  type: Phaser.AUTO,
  parent: "phaser_canvas",
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  dom: {
    createContainer: true
  },
  plugins: {
    scene: [
      { key: "DragonBones", plugin: dragonBones.phaser.plugin.DragonBonesScenePlugin, mapping: "dragonbone" } // setup DB plugin
    ]
  },
  transparent: true,
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics:{
    default: 'arcade',
    arcade: { debug: false }
  }
};

const game = new Phaser.Game(config);
var balance_text
var current_request_id = null
var arm
var arm2
var coins_to_emit = 0
var coin_emission_frequency = 5
var last_coin_emission_time = 0
var coins = []
var is_steam_active = false
var steam_emission_frequency = 70
var last_steam_emission_time = 0
var max_concurrent_steam = 20
var steams = []
var _this
var normal_toast_just_ejected = false
var burn_toast_just_ejected = false
var you_win_image
var you_lose_image

var waiting_for_oracle = false
var my_asset_count = 0

// Audio
var place_bet
var wating_confirmation
var wating_oracle
var you_win_sound
var you_lose_sound

function preload() {

  var loading_text = this.make.text({
    x: CANVAS_WIDTH/4,
    y: CANVAS_HEIGHT/4,
    text: 'Loading...',
    style: {
        font: '40px monospace',
        fill: '#000'
    }
  });
  loading_text.setOrigin(0.5, 0.5);

  this.load.image('steam', './src/assets/steam.png')
  this.load.image('token_holder', './src/assets/token_holder.png')
  this.load.image('you_win', './src/assets/you_win.png')
  this.load.image('you_lose', './src/assets/you_lose.png')
  this.load.spritesheet('coin', './src/assets/bread_coin_resized.png', { frameWidth: 37, frameHeight: 45 });

  this.load.audio("place_bet", ["./src/assets/audio/place_bet.wav"]);
  this.load.audio("wating_confirmation", ["./src/assets/audio/wating_confirmation.wav"]);
  this.load.audio("wating_oracle", ["./src/assets/audio/wating_oracle.wav"]);
  this.load.audio("you_win", ["./src/assets/audio/you_win.mp3"]);
  this.load.audio("you_lose", ["./src/assets/audio/you_lose.wav"]);

  this.load.dragonbone(
      animationTrigger.throne.name,
      "src/assets/DragonBonesFiles/Throne/Throne_tex.png",
      "src/assets/DragonBonesFiles/Throne/Throne_tex.json",
      "src/assets/DragonBonesFiles/Throne/Throne_ske.json",
  );

  this.load.dragonbone(
    animationTrigger.toaster.name,
    "src/assets/DragonBonesFiles/OracleToaster/Toaster_tex.png",
    "src/assets/DragonBonesFiles/OracleToaster/Toaster_tex.json",
    "src/assets/DragonBonesFiles/OracleToaster/Toaster_ske.json",
  );

  this.load.on('complete', function () {
    loading_text.visible = false
    console.log("phaser preload complete")
  });
}

function create() {
  _this = this

  this.sound.pauseOnBlur = false;
  
  this.add.image(
    25 + this.textures.get("token_holder").getSourceImage().width/2,
    25 + this.textures.get("token_holder").getSourceImage().height/2,
    'token_holder')

  balance_text = this.add.text(90, 45, 'Loading balance', { fontFamily: 'Arial, sans-serif', color: "#fff" });
/*
  arm2 = this.add.armature("Armature", animationTrigger.throne.name);
  arm2.x = 400;
  arm2.y = 300;
  arm2.animation.play(animationTrigger.throne.animations.throne_idle);

  arm = this.add.armature("Armature", animationTrigger.toaster.name);
  console.log(dragonBones.EventObject)
  arm.addDBEventListener(dragonBones.EventObject.LOOP_COMPLETE, animationLoopCompleteCallback, this);
  arm.x = 400;
  arm.y = 375;
  arm.animation.play(animationTrigger.toaster.animations.idle);

  setConfirmTransactionCallback(() =>
  {
    wating_confirmation.play()
    arm.animation.play(animationTrigger.toaster.animations.tx_init)
  })
  this.anims.create({
    key: 'coin_animation',
    frameRate: 7,
    frames: _this.anims.generateFrameNumbers("coin", { start: 0, end: 11 }),
    repeat: -1
  });

  this.anims.create({
    key: 'coin_animation_one_time',
    frameRate: 50,
    frames: _this.anims.generateFrameNumbers("coin", { start: 0, end: 11 }),
    repeat: false
  });

  place_bet = this.sound.add("place_bet", { loop: false });
  wating_confirmation = this.sound.add("wating_confirmation", { loop: false });
  wating_oracle = this.sound.add("wating_oracle", { loop: false });
  you_win_sound = this.sound.add("you_win", { loop: false });
  you_lose_sound = this.sound.add("you_lose", { loop: false });

  you_win_image = this.add.image(
    400,
    100,
    'you_win')
  you_win_image.visible = false
  
  you_lose_image = this.add.image(
    400,
    100,
    'you_lose')
  you_lose_image.visible = false
*/
}

function emitCoins(_coins_to_emit, _coin_emission_frequency)
{
  coins_to_emit = _coins_to_emit
  coin_emission_frequency = _coin_emission_frequency
}

function update(time, delta) {
  if(coins_to_emit > 0)
  {
    if(time - last_coin_emission_time > coin_emission_frequency)
    {
      last_coin_emission_time = time
      emitCoin()
      coins_to_emit -= 1
    }
  }

  for(var i=0; i<coins.length; i++)
  {
    if(coins[i].x < 110
      || coins[i].y < 110)
    {
      destroyCoin(0)
    }
  }

  if(coins.length == 140)
  {
    destroyCoin(0)
  }

  if(is_steam_active && time - last_steam_emission_time > steam_emission_frequency)
  {
    last_steam_emission_time = time
    emitSteam()
  }

  if(steams.length == max_concurrent_steam)
  {
    steams[0].destroy()
    steams.shift()
  }
}

function destroyCoin(coin_index)
{
  let sprite = _this.physics.add.sprite(coins[coin_index].x, coins[coin_index].y,"coin");
  sprite.play('coin_animation_one_time');
  sprite.on('animationcomplete', function (x) {
    sprite.destroy()
  });

  coins[coin_index].destroy()
  coins.shift()
}

function emitCoin()
{
  var random_velocoty_x = Math.floor(Math.random() * 600)
  var random_velocity_y = Math.floor(Math.random() * 600)

  var random_x = 350 + Math.floor(Math.random() * 100)
  var random_y = 350 + Math.floor(Math.random() * 100)

  let sprite = _this.physics.add.sprite(random_x, random_y,"coin");

  sprite.setVelocityX(random_velocoty_x);
  sprite.setVelocityY(random_velocity_y);
  sprite.setGravityX(-200 - random_velocoty_x);
  sprite.setGravityY(-200 - random_velocity_y);

  sprite.play('coin_animation');

  coins.push(sprite)
}

function emitSteam()
{
  var random_velocity_y = Math.floor(Math.random() * 50)

  var random_x = 350 + Math.floor(Math.random() * 100)

  let sprite=_this.physics.add.sprite(random_x, 300,"steam");

  sprite.setVelocityX(0);
  sprite.setVelocityY(-random_velocity_y);
  sprite.setGravityX(0);
  sprite.setGravityY(-200 - random_velocity_y);

  steams.push(sprite)
}

function animationLoopCompleteCallback(event)
{
  switch(event.animationState.name) {
    case animationTrigger.toaster.animations.set_bet:
      arm.animation.play(animationTrigger.toaster.animations.set_bet_loop);
      break;
    case animationTrigger.toaster.animations.tx_init:
      arm.animation.play(animationTrigger.toaster.animations.tx_loop);
      break;
    case animationTrigger.toaster.animations.oracle_init:
      arm.animation.play(animationTrigger.toaster.animations.oracle_loop);
      is_steam_active = true
      break;
    case animationTrigger.toaster.animations.eject_normal_toast:
      arm.animation.play(animationTrigger.toaster.animations.eject_normal_toast_loop);
      break;
    case animationTrigger.toaster.animations.eject_burn_toast:
      arm.animation.play(animationTrigger.toaster.animations.eject_burn_toast_loop);
      break;
    case animationTrigger.toaster.animations.discard_normal:
      arm.animation.play(animationTrigger.toaster.animations.set_bet);
      break;
    case animationTrigger.toaster.animations.discard_burn:
      arm.animation.play(animationTrigger.toaster.animations.set_bet);
      break;
  }
}

function setStatusText(text, is_error)
{
  document.getElementById('status').innerHTML = text
  if(is_error)
    document.getElementById("status").style.color = "#FF0000";
  else
    document.getElementById("status").style.color = "#000000";
}


async function show(nft_asset) {
  var my_nfts_div = document.getElementById('my_nfts');
  var elem = document.createElement("img")
  elem.src = nft_asset.image_thumbnail_url
  my_nfts_div.appendChild(elem)
  var attack = await getTokenAttack(nft_asset.token_id)
  console.log(attack)
  my_nfts_div.innerHTML += '<br/>Attack: ' + attack;
}

function onGetMyNFTs()
{
  setStatusText("Getting assets", false)
  getMyNFTs((json) => {
    if(json.assets.length != my_asset_count)
    {
      setStatusText("New asset found!", false)
      my_asset_count = json.assets.length
      waiting_for_oracle = false
    }
    console.log(json.assets)
    console.log(json.assets.length)
    document.getElementById('my_nfts').innerHTML = ""
    for(var i=0; i<json.assets.length; i++)
    {
      show(json.assets[i])
    }
    setStatusText("Assets retrieved", false)
  });
}

function onRoll(selection)
{
  place_bet.play()
  you_win_image.visible = false
  you_lose_image.visible = false
  document.getElementById("waiting_tx_loader").style.display = "block"
  setStatusText("Waiting confirmation...", false)
  
  if(normal_toast_just_ejected)
    arm.animation.play(animationTrigger.toaster.animations.discard_normal)
  else if(burn_toast_just_ejected)
    arm.animation.play(animationTrigger.toaster.animations.discard_burn)
  else
    arm.animation.play(animationTrigger.toaster.animations.set_bet)
  
  roll(selection, document.getElementById('bet_amount').value, (success) => {
    if(!success)
    {
      document.getElementById("waiting_tx_loader").style.display = "none"
      document.getElementById("waiting_oracle_loader").style.display = "none"
      setStatusText("Error: Could not complete transaction", true)
      return
    }
    wating_oracle.play()
    document.getElementById("waiting_tx_loader").style.display = "none"
    document.getElementById("waiting_oracle_loader").style.display = "block"
    setStatusText("Waiting for oracle...", false)
    arm.animation.play(animationTrigger.toaster.animations.oracle_init);
    getPlayerRequestId((request_id) => {
      current_request_id = request_id
      console.log(current_request_id)
    });
  });
}

function onMintNFT()
{
  setStatusText("Waiting confirmationn...", false)

  mintNFT((success) => {
    if(!success)
    {
      setStatusText("Error: Could not complete transaction", true)
      return
    }
    setStatusText("Waiting for oraclee...", false)
    waiting_for_oracle = true
  });
}

function poll() {
  console.log("polling...")
  if(waiting_for_oracle)
  {
  }
  onGetMyNFTs()

  if(isConnected())
  {
    getBalance((balance) => {
      balance_text.text = Number(convertWeiToCrypto(balance)).toFixed(3) + " Matic"
    });
  }
  /*
  getContractBalance((balance) => {
    console.log("Contract balance: " + balance)
  });

  getLinkBalance((balance) => {
    console.log("Link balance: " + balance)
  });
  */
}

var display_click_count_poller = setInterval(poll,1000)

function _disconnectWallet() {
  disconnectWallet()
}

function onAClicked() {
  onRoll("0")
}

function onBClicked() {
  onRoll("1")
}

function onMaxClicked() {
  document.getElementById('bet_amount').value = convertWeiToCrypto(getMaximumBet())
}

function onMinClicked() {
  document.getElementById('bet_amount').value = convertWeiToCrypto(getMinimumBet())
}

window._disconnectWallet = _disconnectWallet;
window.onMintNFT = onMintNFT;
window.onGetMyNFTs = onGetMyNFTs;
window.onAClicked = onAClicked;
window.onBClicked = onBClicked;
window.onMaxClicked = onMaxClicked;
window.onMinClicked = onMinClicked;

// Modal handlers
var container = document.getElementById('container');
var rules_modal_card = document.getElementById('rules_modal_card');
var rules_button = document.getElementById('rules_button');