// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./dependencies/ERC20.sol";
import "./dependencies/ERC721.sol";
import "./dependencies/ERC721Enumerable.sol";
import "./dependencies/VRFConsumerBase.sol";

contract Gachapon is ERC721, ERC721Enumerable, VRFConsumerBase {
  uint MAXIMUM_ATTACK = 10;
  uint256 public token_count;
  mapping (bytes32 => address) public request_address;
  string[] public class_pool;
  string[] public rarity_pool;
  mapping (string => mapping (string => mapping (uint => string))) uri_pool; // maps Class->Rarity->Atk
  mapping (uint256 => string) public token_class;
  mapping (uint256 => string) public token_rarity;
  mapping (uint256 => uint) public token_attack;

  //Chainlink preset variables
  address LINK_TOKEN = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;
  address VRF_COORDINATOR = 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B;
  bytes32 KEYHASH = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
  uint256 internal FEE = 0.1 ether;

  constructor()
    ERC721("My NFT", "NFT10") 
    VRFConsumerBase(
      VRF_COORDINATOR, // VRF Coordinator
      LINK_TOKEN // LINK Token
    ){}

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
    return uri_pool[token_class[tokenId]][token_rarity[tokenId]][token_attack[tokenId]];
  }

  function addURIToPool(string memory uri, string memory class, string memory rarity, uint attack) public {
    uri_pool[class][rarity][attack] = uri;
  }

  function addClassToPool(string memory class) public {
    class_pool.push(class);
  }

  function addRarityToPool(string memory rarity) public {
    rarity_pool.push(rarity);
  }

  function setURIInPool(string memory uri, string memory class, string memory rarity, uint256 attack) public {
    uri_pool[class][rarity][attack] = uri;
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
    uint256 randomness1 = uint256(keccak256(abi.encode(randomness, 0)));
    uint256 randomness2 = uint256(keccak256(abi.encode(randomness, 1)));
    uint256 randomness3 = uint256(keccak256(abi.encode(randomness, 1)));

    string memory class = class_pool[randomness1 % class_pool.length];
    string memory rarity = rarity_pool[randomness2 % rarity_pool.length];
    uint256 attack = (randomness3 % MAXIMUM_ATTACK) + 5;

    token_class[token_count] = class;
    token_rarity[token_count] = rarity;
    token_attack[token_count] = attack;
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
  {
      return super.supportsInterface(interfaceId);
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    override(ERC721, ERC721Enumerable)
  {
    super._beforeTokenTransfer(from, to, tokenId);
  }
}