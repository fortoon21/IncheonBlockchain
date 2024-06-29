import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { MyTokenERC20, MyTokenERC20__factory } from "../types";

// ERC20 배포 task
task("deploy-erc20", "ERC20 토큰 컨트랙트를 배포합니다.")
  .addParam("name", "토큰의 이름")
  .addParam("symbol", "토큰의 심볼")
  .addParam("supply", "초기 토큰 공급량 (ether 단위)")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { deployer } = await hre.getNamedAccounts();
    const { deploy } = hre.deployments;

    const initialSupply = hre.ethers.parseUnits(taskArguments.supply, 18);

    const deployment = await deploy("MyTokenERC20", {
      from: deployer,
      args: [taskArguments.name, taskArguments.symbol, initialSupply],
      log: true,
    });

    const MyTokenERC20 = (await hre.ethers.getContractFactory("MyTokenERC20")) as MyTokenERC20__factory;
    const token = MyTokenERC20.attach(deployment.address);

    console.log(`ERC20 토큰 배포됨: `, deployment.address);
  });

// ERC20 전송 task
task("transfer-erc20", "ERC20 토큰을 전송합니다.")
  .addParam("contract", "배포된 ERC20 컨트랙트의 주소")
  .addParam("to", "토큰을 전송할 주소")
  .addParam("amount", "전송할 토큰의 양 (ether 단위)")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const signers = await hre.ethers.getSigners();
    const sender = signers[0];

    const MyTokenERC20 = (await hre.ethers.getContractFactory("MyTokenERC20")) as MyTokenERC20__factory;
    const token = MyTokenERC20.attach(taskArguments.contract) as MyTokenERC20;

    const amount = hre.ethers.parseUnits(taskArguments.amount, 18);
    const tx = await token.connect(sender).transfer(taskArguments.to, amount);

    await tx.wait();

    console.log(`${taskArguments.to}에게 ${taskArguments.amount} 토큰을 전송했습니다.`);
  });

// ERC20 잔액 조회 task
task("balance-of", "특정 주소의 잔액을 조회합니다.")
  .addParam("contract", "배포된 ERC20 컨트랙트의 주소")
  .addParam("account", "잔액을 조회할 주소")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const MyTokenERC20 = (await hre.ethers.getContractFactory("MyTokenERC20")) as MyTokenERC20__factory;
    const token = MyTokenERC20.attach(taskArguments.contract) as MyTokenERC20;

    const balance = await token.balanceOf(taskArguments.account);

    console.log(`${taskArguments.account}의 잔액:`, hre.ethers.formatUnits(balance, 18));
  });

// ERC20 승인 task
task("approve", "특정 주소에 ERC20 토큰 전송 권한을 부여합니다.")
  .addParam("contract", "배포된 ERC20 컨트랙트의 주소")
  .addParam("spender", "토큰을 전송할 수 있는 권한을 부여받을 주소")
  .addParam("amount", "승인할 토큰의 양 (ether 단위)")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const signers = await hre.ethers.getSigners();
    const owner = signers[0];

    const MyTokenERC20 = (await hre.ethers.getContractFactory("MyTokenERC20")) as MyTokenERC20__factory;
    const token = MyTokenERC20.attach(taskArguments.contract) as MyTokenERC20;

    const amount = hre.ethers.parseUnits(taskArguments.amount, 18);
    const tx = await token.connect(owner).approve(taskArguments.spender, amount);

    await tx.wait();

    console.log(`${taskArguments.spender}에게 ${taskArguments.amount} 토큰 전송 권한을 부여했습니다.`);
  });

// ERC20 승인된 잔액 조회 task
task("allowance", "특정 주소에 승인된 토큰의 양을 조회합니다.")
  .addParam("contract", "배포된 ERC20 컨트랙트의 주소")
  .addParam("owner", "토큰의 소유자 주소")
  .addParam("spender", "토큰을 전송할 수 있는 권한을 부여받은 주소")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const MyTokenERC20 = (await hre.ethers.getContractFactory("MyTokenERC20")) as MyTokenERC20__factory;
    const token = MyTokenERC20.attach(taskArguments.contract) as MyTokenERC20;

    const allowance = await token.allowance(taskArguments.owner, taskArguments.spender);

    console.log(
      `${taskArguments.spender}가 ${taskArguments.owner}로부터 승인받은 토큰의 양:`,
      hre.ethers.formatUnits(allowance, 18),
    );
  });

// ERC20 전송 권한을 사용하여 토큰 전송 task
task("transfer-from", "승인된 토큰을 전송합니다.")
  .addParam("contract", "배포된 ERC20 컨트랙트의 주소")
  .addParam("from", "토큰을 전송할 주소")
  .addParam("to", "토큰을 받을 주소")
  .addParam("amount", "전송할 토큰의 양 (ether 단위)")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const signers = await hre.ethers.getSigners();
    const spender = signers[0];

    const MyTokenERC20 = (await hre.ethers.getContractFactory("MyTokenERC20")) as MyTokenERC20__factory;
    const token = MyTokenERC20.attach(taskArguments.contract) as MyTokenERC20;

    const amount = hre.ethers.parseUnits(taskArguments.amount, 18);
    const tx = await token.connect(spender).transferFrom(taskArguments.from, taskArguments.to, amount);

    await tx.wait();

    console.log(`${taskArguments.from}로부터 ${taskArguments.to}에게 ${taskArguments.amount} 토큰을 전송했습니다.`);
  });

export {};
