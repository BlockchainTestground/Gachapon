// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./dependencies/VRFConsumerBase.sol";
import "./dependencies/ERC721.sol";

contract TestgroundGame is ERC721, VRFConsumerBase {
  using Strings for uint256;
  mapping (uint256 => string) private _tokenURIs;
  mapping (uint256 => string) private uploaded_tokens_uris;
  uint256 token_count = 0;
  mapping (uint256 => address) private kittyIndexToOwner;

  string public logger = "init";

  string private _baseURIextended = "https://ipfs.io/ipfs/";

  // Link stuff
  bytes32 internal keyHash;
  uint256 internal fee;
  mapping(bytes32 => address) public requestIdToMsgSender;
  mapping(bytes32 => uint256) public requestIdToRandomNumber;

  constructor()
    ERC721("MyNFTT", "SBLL")
    VRFConsumerBase(0x8C7382F9D8f56b33781fE506E897a4F1e2d17255, 0x326C977E6efc84E512bB9C30f76E30c160eD06FB)
  {
    keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
    fee = 0.0001 * 10 ** 18;
    uploaded_tokens_uris[0] = "Qma2bapGWk2r9Rky9YDx2VvVcVRKX5DJGEK1G4qdBiYKqV";
    uploaded_tokens_uris[1] = "Qmc4WxJaHHDNerXoCo1KboJf9443NBDQJrznnTbvN5aR8t";
    uploaded_tokens_uris[2] = "QmNuXoCpiDnPHxLzensKzfgxhnCLtogp4NbyBt3Gihn4dM";
    uploaded_tokens_uris[3] = "QmacxXB4y8YLArpkBgEKQDAeXeyAcRR2JapoowzKMAJAiA";

    logger = "constructor";
  }
  
  function setBaseURI(string memory baseURI_) external {
    _baseURIextended = baseURI_;
  }

  function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
    require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
    _tokenURIs[tokenId] = _tokenURI;
  }
  
  function _baseURI() internal view virtual override returns (string memory) {
    return _baseURIextended;
  }
  
  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

    string memory _tokenURI = _tokenURIs[tokenId];
    string memory base = _baseURI();

    // If there is no base URI, return the token URI.
    if (bytes(base).length == 0) {
      return _tokenURI;
    }
    // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
    if (bytes(_tokenURI).length > 0) {
      return string(abi.encodePacked(base, _tokenURI));
    }
    // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
    return string(abi.encodePacked(base, tokenId.toString()));
  }

  function triggerGacha(uint256 userProvidedSeed) public returns (bytes32 _requestId) {
    require(LINK.balanceOf(address(this)) > fee, "Not enough LINK - fill contract with faucet");
    bytes32 requestId = requestRandomness(keyHash, fee, userProvidedSeed);
    requestIdToMsgSender[requestId] = msg.sender;

    logger = "gacha";
    return requestId;
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    requestIdToRandomNumber[requestId] = randomness;

    token_count += 1;
    _mint(requestIdToMsgSender[requestId], token_count);
    _setTokenURI(token_count, uploaded_tokens_uris[randomness%4]);

    kittyIndexToOwner[token_count] == requestIdToMsgSender[requestId];

    logger = "full";
  }





  function tokensOfOwner(address _owner) external view returns(uint256[] memory ownerTokens) {
    uint256 tokenCount = balanceOf(_owner);

    if (tokenCount == 0) {
      // Return an empty array
      return new uint256[](0);
    } else {
      uint256[] memory result = new uint256[](tokenCount);
      uint256 totalCats = token_count;
      uint256 resultIndex = 0;

      // We count on the fact that all cats have IDs starting at 1 and increasing
      // sequentially up to the totalCat count.
      uint256 catId;

      for (catId = 1; catId <= totalCats; catId++) {
        if (kittyIndexToOwner[catId] == _owner) {
          result[resultIndex] = catId;
          resultIndex++;
        }
      }

      return result;
    }
  }
}