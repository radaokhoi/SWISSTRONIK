const hre = require("hardhat");

async function main() {
  const contract = await hre.ethers.deployContract("HegelNFT");

  await contract.waitForDeployment();

  console.log(`HegelNFT contract deployed to ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
