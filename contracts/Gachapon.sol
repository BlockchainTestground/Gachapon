// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./dependencies/ERC20.sol";
import "./dependencies/ERC721.sol";
import "./dependencies/VRFConsumerBase.sol";

contract Gachapon is ERC721 {
  uint256 public pool_count;
  uint256 public token_count;
  mapping (uint256 => uint256) public token_uri_ids;
  mapping (uint256 => string) public token_pool;

  constructor() ERC721("My NFT", "NFT10") {}

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
    return token_pool[token_uri_ids[tokenId]];
  }

  function mintNFT(address to) public
  {
    token_count += 1;
    _mint(to, token_count);
    token_uri_ids[token_count] = 0;
  }
}