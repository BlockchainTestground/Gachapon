// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./dependencies/ERC20.sol";
import "./dependencies/ERC721.sol";
import "./dependencies/VRFConsumerBase.sol";

contract Gachapon is ERC721, VRFConsumerBase {
  uint256 public token_count;
  mapping (uint256 => uint256) public token_uri_ids;
  mapping (bytes32 => address) public request_address;
  string[] public uri_pool;

  //Chainlink preset variables
  uint256 internal FEE = 0.1 ether;
  address VRF_COORDINATOR = 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B;
  address LINK_TOKEN = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;
  bytes32 KEYHASH = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;

  constructor()
    ERC721("My NFT", "NFT10") 
    VRFConsumerBase(
      VRF_COORDINATOR, // VRF Coordinator
      LINK_TOKEN // LINK Token
    ){}

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
    return uri_pool[token_uri_ids[tokenId]];
  }

  function addURIToPool(string memory uri) public {
    uri_pool.push(uri);
  }

  function setURIInPool(uint256 id, string memory uri) public {
    uri_pool[id] = uri;
  }

  function mintNFT(address to) public
  {
    require(LINK.balanceOf(address(this)) >= FEE, "Not enough LINK - fill contract with faucet");

    bytes32 requestId = requestRandomness(
      KEYHASH, // KeyHash
      FEE // Fee
    );
    request_address[requestId] = to;
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    token_count += 1;
    _mint(request_address[requestId], token_count);
    token_uri_ids[token_count] = randomness % uri_pool.length;
  }
}