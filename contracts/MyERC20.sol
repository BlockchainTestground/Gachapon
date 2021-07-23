// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./dependencies/ERC20.sol";

contract MyERC20 is ERC20 {
  constructor () ERC20("My Token", "TKN10") {
    _mint(msg.sender, 1000 ether);
  }

  function burn(uint256 amount) public {
      _burn(msg.sender, amount);
  }

  function mint(uint256 amount) public {
    _mint(msg.sender, amount);
  }
}