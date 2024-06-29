import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { MyTokenERC721, MyTokenERC721__factory } from "../types";

// ERC721 배포 task
task("deploy-erc721", "ERC721 토큰 컨트랙트를 배포합니다.")
  .addParam("name", "토큰의 이름")
  .addParam("symbol", "토큰의 심볼")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { deployer } = await hre.getNamedAccounts();
    const { deploy } = hre.deployments;

    const deployment = await deploy("MyTokenERC721", {
      from: deployer,
      args: [taskArguments.name, taskArguments.symbol],
      log: true,
    });

    const MyTokenERC721 = (await hre.ethers.getContractFactory("MyTokenERC721")) as MyTokenERC721__factory;
    const token = MyTokenERC721.attach(deployment.address);

    console.log(`ERC721 토큰 배포됨: `, deployment.address);
  });

// ERC721 민팅 task
task("mint-erc721", "ERC721 토큰을 민팅합니다.")
  .addParam("contract", "배포된 ERC721 컨트랙트의 주소")
  .addParam("to", "NFT를 받을 주소")
  .addParam("uri", "NFT의 메타데이터 URI")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const signers = await hre.ethers.getSigners();
    const minter = signers[0];

    const MyTokenERC721 = (await hre.ethers.getContractFactory("MyTokenERC721")) as MyTokenERC721__factory;
    const token = MyTokenERC721.attach(taskArguments.contract) as MyTokenERC721;

    const tx = await token.connect(minter).mintNFT(taskArguments.to, taskArguments.uri);
    await tx.wait();

    console.log(`${taskArguments.to} 주소로 NFT를 민팅했습니다. URI: ${taskArguments.uri}`);
  });

// ERC721 전송 task (transferFrom)
task("transferFrom-erc721", "ERC721 토큰을 전송합니다 (transferFrom).")
  .addParam("contract", "배포된 ERC721 컨트랙트의 주소")
  .addParam("from", "NFT를 전송할 주소")
  .addParam("to", "NFT를 받을 주소")
  .addParam("tokenId", "전송할 NFT의 토큰 ID")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const signers = await hre.ethers.getSigners();
    const sender = signers[0];

    const MyTokenERC721 = (await hre.ethers.getContractFactory("MyTokenERC721")) as MyTokenERC721__factory;
    const token = MyTokenERC721.attach(taskArguments.contract) as MyTokenERC721;

    const tx = await token.connect(sender).transferFrom(taskArguments.from, taskArguments.to, taskArguments.tokenId);
    await tx.wait();

    console.log(`토큰 ID ${taskArguments.tokenId}를 ${taskArguments.from}에서 ${taskArguments.to}로 전송했습니다.`);
  });

// ERC721 승인 task (approve)
task("approve-erc721", "특정 주소에 ERC721 토큰 전송 권한을 부여합니다.")
  .addParam("contract", "배포된 ERC721 컨트랙트의 주소")
  .addParam("to", "승인할 주소")
  .addParam("tokenId", "승인할 NFT의 토큰 ID")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const signers = await hre.ethers.getSigners();
    const owner = signers[0];

    const MyTokenERC721 = (await hre.ethers.getContractFactory("MyTokenERC721")) as MyTokenERC721__factory;
    const token = MyTokenERC721.attach(taskArguments.contract) as MyTokenERC721;

    const tx = await token.connect(owner).approve(taskArguments.to, taskArguments.tokenId);
    await tx.wait();

    console.log(`토큰 ID ${taskArguments.tokenId}에 대해 ${taskArguments.to} 주소에 전송 권한을 부여했습니다.`);
  });

// ERC721 승인된 주소 확인 task (getApproved)
task("getApproved-erc721", "특정 토큰 ID에 대한 승인된 주소를 확인합니다.")
  .addParam("contract", "배포된 ERC721 컨트랙트의 주소")
  .addParam("tokenId", "확인할 NFT의 토큰 ID")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const MyTokenERC721 = (await hre.ethers.getContractFactory("MyTokenERC721")) as MyTokenERC721__factory;
    const token = MyTokenERC721.attach(taskArguments.contract) as MyTokenERC721;

    const approvedAddress = await token.getApproved(taskArguments.tokenId);

    console.log(`토큰 ID ${taskArguments.tokenId}에 대해 승인된 주소: ${approvedAddress}`);
  });

// ERC721 모든 토큰에 대한 승인 task (setApprovalForAll)
task("setApprovalForAll-erc721", "모든 토큰에 대한 전송 권한을 승인합니다.")
  .addParam("contract", "배포된 ERC721 컨트랙트의 주소")
  .addParam("operator", "승인할 운영자 주소")
  .addParam("approved", "승인 여부 (true/false)")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const signers = await hre.ethers.getSigners();
    const owner = signers[0];

    const MyTokenERC721 = (await hre.ethers.getContractFactory("MyTokenERC721")) as MyTokenERC721__factory;
    const token = MyTokenERC721.attach(taskArguments.contract) as MyTokenERC721;

    const tx = await token.connect(owner).setApprovalForAll(taskArguments.operator, taskArguments.approved === "true");
    await tx.wait();

    console.log(
      `모든 토큰에 대해 ${taskArguments.operator} 주소에 대한 승인 여부를 ${taskArguments.approved}로 설정했습니다.`,
    );
  });

// ERC721 모든 토큰에 대한 승인 여부 확인 task (isApprovedForAll)
task("isApprovedForAll-erc721", "모든 토큰에 대해 승인된 운영자 여부를 확인합니다.")
  .addParam("contract", "배포된 ERC721 컨트랙트의 주소")
  .addParam("owner", "토큰 소유자 주소")
  .addParam("operator", "운영자 주소")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const MyTokenERC721 = (await hre.ethers.getContractFactory("MyTokenERC721")) as MyTokenERC721__factory;
    const token = MyTokenERC721.attach(taskArguments.contract) as MyTokenERC721;

    const isApproved = await token.isApprovedForAll(taskArguments.owner, taskArguments.operator);

    console.log(
      `토큰 소유자 ${taskArguments.owner}에 대해 ${taskArguments.operator} 주소가 승인된 운영자인지 여부: ${isApproved}`,
    );
  });

export {};
