// SPDX-License-Identifier: MIT
pragma solidity 0.8.5;

import "./dependencies/ERC20.sol";
import "./dependencies/ERC721.sol";
import "./dependencies/VRFConsumerBase.sol";

contract Gachapon is ERC721 {
  uint256 token_count;
  string[] tokenURI_pool;
  mapping (uint256 => string) private _tokenURIs;

  constructor() ERC721("GameItem", "ITM") public {
  }

  function addTokenURIToPool(string memory tokenURI) public
  {
    tokenURI_pool.push(tokenURI);
  }

  function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual
  {
    require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
    _tokenURIs[tokenId] = _tokenURI;
  }

  function mintCharacter(address player) public {
    token_count += 1;
    _mint(player, token_count);
    _tokenURIs[token_count] = tokenURI_pool[0];
  }
}