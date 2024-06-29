import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const tokenName = "MyToken";
  const tokenSymbol = "MTK";
  const initialSupply = hre.ethers.parseUnits("1000000", 18).toString();

  const token = await deploy("MyTokenERC20", {
    from: deployer,
    args: [tokenName, tokenSymbol, initialSupply],
    log: true,
  });

  console.log(`ERC20 토큰 배포됨: `, token.address);
};

export default func;
func.id = "deploy_my_token"; // id는 재실행을 방지하기 위해 필요합니다.
func.tags = ["MyTokenERC20"];
