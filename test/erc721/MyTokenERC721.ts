import { expect } from "chai";
import { ethers } from "hardhat";

import { MyTokenERC721, MyTokenERC721__factory } from "../../types";

describe("MyTokenERC721", function () {
  let myToken: MyTokenERC721;
  let deployer: string;
  let addr1: string;
  let addr2: string;

  before(async function () {
    const signers = await ethers.getSigners();
    deployer = signers[0].address;
    addr1 = signers[1].address;
    addr2 = signers[2].address;

    const Token = await ethers.getContractFactory("MyTokenERC721");
    myToken = await Token.deploy("MyToken", "MTK");
    const mytoken_address = await myToken.getAddress();
  });

  it("토큰 이름과 심볼을 확인합니다.", async function () {
    expect(await myToken.name()).to.equal("MyToken");
    expect(await myToken.symbol()).to.equal("MTK");
  });

  it("NFT를 민팅합니다.", async function () {
    const tokenURI = "https://mytoken.com/token/1";
    const tx = await myToken.mintNFT(addr1, tokenURI);
    await tx.wait();

    const ownerOfToken = await myToken.ownerOf(1);
    const tokenURIStored = await myToken.tokenURI(1);

    expect(ownerOfToken).to.equal(addr1);
    expect(tokenURIStored).to.equal(tokenURI);
  });

  it("NFT를 전송합니다 (transferFrom).", async function () {
    await myToken.connect(await ethers.getSigner(addr2)).approve(deployer, 1);
    await myToken.connect(await ethers.getSigner(deployer)).transferFrom(addr2, addr1, 1);

    const ownerOfToken = await myToken.ownerOf(1);
    expect(ownerOfToken).to.equal(addr1);
  });

  it("NFT 전송 권한을 승인합니다 (approve).", async function () {
    await myToken.connect(await ethers.getSigner(addr1)).approve(addr2, 1);
    const approvedAddress = await myToken.getApproved(1);
    expect(approvedAddress).to.equal(addr2);
  });

  it("모든 NFT 전송 권한을 승인합니다 (setApprovalForAll).", async function () {
    await myToken.connect(await ethers.getSigner(addr1)).setApprovalForAll(addr2, true);
    const isApproved = await myToken.isApprovedForAll(addr1, addr2);
    expect(isApproved).to.be.true;
  });

  it("잔액을 조회합니다 (balanceOf).", async function () {
    const balance = await myToken.balanceOf(addr1);
    expect(balance).to.equal(1);
  });

  it("인터페이스 지원을 확인합니다 (supportsInterface).", async function () {
    const isSupported = await myToken.supportsInterface("0x80ac58cd"); // ERC721 인터페이스 ID
    expect(isSupported).to.be.true;
  });
});
