const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

const sendShieldedQuery = async (provider, destination, data) => {
  const rpcLink = hre.network.config.url;

  const [encryptedData, usedEncryptionKey] = await encryptDataField(rpcLink, data);

  const response = await provider.call({
    to: destination,
    data: encryptedData,
  });

  return await decryptNodeResponse(rpcLink, response, usedEncryptionKey);
};

async function main() {
  const contractAddress = "0x85a816F96E5b4EcFaA23b1ec9961E818a38f1da1";

  const [signer] = await hre.ethers.getSigners();

  const contractFactory = await hre.ethers.getContractFactory("HegelNFT"); 
  const contract = contractFactory.attach(contractAddress);

  const functionName = "balanceOf";
  const functionArgs = ["0x3dbea9738209244B6e1ebd6A95371896b628d68A"];
  const responseMessage = await sendShieldedQuery(signer.provider, contractAddress, contract.interface.encodeFunctionData(functionName, functionArgs));

  console.log("Your balance:", contract.interface.decodeFunctionResult(functionName, responseMessage)[0].toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});