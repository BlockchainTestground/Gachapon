// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./dependencies/VRFConsumerBase.sol";
import "./Gachapon.sol";

contract TestgroundGame {
  uint256[] leaderboard;
  Gachapon gachapon = Gachapon(0x033339A9BcdeCE1Fc33ef019a1ba3598d6983De9);

  function swap(uint256 index1, uint256 index2) internal
  {
    uint256 temp = leaderboard[index1];
    leaderboard[index1] = leaderboard[index2];
    leaderboard[index2] = temp;
  }

  function challenge(uint256 challenger_index, uint256 challenged_index)
    public
    mustBeOwner(leaderboard[challenger_index])
  {
    swap(challenger_index, challenged_index);
  }

  function signUp(uint256 token_id)
    public
    mustBeOwner(token_id)
  {
    leaderboard.push(token_id);
  }

  modifier mustBeOwner(uint256 token_id)
  {
    require(gachapon.ownerOf(token_id) == msg.sender, "You must own the challenger token");
    _;
  }
}