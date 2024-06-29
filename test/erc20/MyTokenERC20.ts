import { expect } from "chai";
import { ethers } from "hardhat";

import { MyTokenERC20, MyTokenERC20__factory } from "../../types";

describe("MyTokenERC20", function () {
  let myToken: MyTokenERC20;
  let deployer: string;
  let addr1: string;
  let addr2: string;

  before(async function () {
    const signers = await ethers.getSigners();
    deployer = signers[0].address;
    addr1 = signers[1].address;
    addr2 = signers[2].address;

    const Token = (await ethers.getContractFactory("MyTokenERC20")) as MyTokenERC20__factory;
    myToken = (await Token.deploy("MyToken", "MTK", "1000")) as MyTokenERC20;

    const mytoken_address = await myToken.getAddress();
  });

  it("토큰 이름과 심볼을 확인합니다.", async function () {
    expect(await myToken.name()).to.equal("MyToken");
    expect(await myToken.symbol()).to.equal("MTK");
  });

  it("초기 공급량을 확인합니다.", async function () {
    const deployerBalance = await myToken.balanceOf(deployer);
    expect(await myToken.totalSupply()).to.equal(deployerBalance);
  });

  it("토큰 전송을 테스트합니다.", async function () {
    await myToken.transfer(addr1, "1");
    const addr1Balance = await myToken.balanceOf(addr1);
    expect(addr1Balance).to.equal("1");

    const deployerBalance = await myToken.balanceOf(deployer);
    expect(deployerBalance).to.equal("999");
  });

  it("토큰 전송을 허용합니다.", async function () {
    await myToken.approve(addr2, "500");
    const allowance = await myToken.allowance(deployer, addr2);
    expect(allowance).to.equal("500");
  });

  it("허용된 토큰을 전송합니다.", async function () {
    // addr2가 deployer로부터 addr1에게 100 토큰을 전송합니다.
    const initialBalance = await myToken.balanceOf(addr1);
    await myToken.connect(await ethers.getSigner(addr2)).transferFrom(deployer, addr1, "100");
    const finalBalance = await myToken.balanceOf(addr1);
    expect(finalBalance).to.equal(initialBalance + BigInt("100"));
  });

  it("허용된 토큰을 초과하여 전송할 수 없습니다.", async function () {
    // addr2가 deployer로부터 addr1에게 600 토큰을 전송 시도 (실패해야 함)
    await expect(
      myToken.connect(await ethers.getSigner(addr2)).transferFrom(deployer, addr1, "600"),
    ).to.be.revertedWith("ERC20: insufficient allowance");
  });

  it("잔액 조회를 테스트합니다.", async function () {
    const deployerBalance = await myToken.balanceOf(deployer);
    const addr1Balance = await myToken.balanceOf(addr1);
    const addr2Balance = await myToken.balanceOf(addr2);

    console.log("Deployer 잔액:", ethers.formatUnits(deployerBalance, 18));
    console.log("Addr1 잔액:", ethers.formatUnits(addr1Balance, 18));
    console.log("Addr2 잔액:", ethers.formatUnits(addr2Balance, 18));

    expect(deployerBalance).to.equal("899");
    expect(addr1Balance).to.equal("101");
    expect(addr2Balance).to.equal("0");
  });
});
