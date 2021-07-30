// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./dependencies/VRFConsumerBase.sol";
import "./Gachapon.sol";

contract Duels is VRFConsumerBase{
  Gachapon gachapon;
  enum State { Pending, Declined, Canceled, Accepted, ChallengerWon, ChallengedWon }
  mapping(uint256 => Challenge) public challenges;
  mapping(bytes32 => uint256) public request_challenge_id;

  //Chainlink preset variables
  address LINK_TOKEN = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;
  address VRF_COORDINATOR = 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B;
  bytes32 KEYHASH = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
  uint256 internal FEE = 0.1 ether;

  constructor(address gachapon_address)
    VRFConsumerBase(
      VRF_COORDINATOR, // VRF Coordinator
      LINK_TOKEN // LINK Token
    )
  {
    gachapon = Gachapon(gachapon_address);
  }

  uint256 challenge_count;
  struct Challenge
  {
    uint256 id;
    State state;
    uint256 challenger_token_id;
    uint256 challenged_token_id;
  }

  function createChallenge(uint256 challenger_token_id, uint256 challenged_token_id)
    public
    mustBeOwner(msg.sender, challenger_token_id)
  {
    challenge_count += 1;
    challenges[challenge_count] =
      Challenge(
        challenge_count,
        State.Pending,
        challenger_token_id,
        challenged_token_id);
  }

  function cancelChallenge(uint256 challenge_id)
    public
    mustBeOwner(msg.sender, challenges[challenge_id].challenger_token_id)
  {
    require(challenges[challenge_id].state == State.Pending);
    challenges[challenge_id].state = State.Canceled;
  }

  function declineChallenge(uint256 challenge_id)
    public
    mustBeOwner(msg.sender, challenges[challenge_id].challenged_token_id)
  {
    require(challenges[challenge_id].state == State.Pending);
    challenges[challenge_id].state = State.Declined;
  }

  function acceptChallenge(uint256 challenge_id)
    public
    mustBeOwner(msg.sender, challenges[challenge_id].challenged_token_id)
  {
    require(challenges[challenge_id].state == State.Pending);
    challenges[challenge_id].state = State.Accepted;

    bytes32 requestId = requestRandomness(
      KEYHASH, // KeyHash
      FEE // Fee
    );
    request_challenge_id[requestId] = challenge_id;
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    if(randomness %2 == 0)
    {
      challenges[request_challenge_id[requestId]].state = State.ChallengedWon;
    }else
    {
      challenges[request_challenge_id[requestId]].state = State.ChallengerWon;
    }
  }

  modifier mustBeOwner(address _address, uint256 token_id)
  {
    require(gachapon.ownerOf(token_id) == _address, "You must own the challenger token");
    _;
  }
}