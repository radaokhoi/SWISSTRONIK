const hre = require("hardhat");
const { encryptDataField } = require("@swisstronik/utils");

const sendShieldedTransaction = async (signer, destination, data, value) => {
  const rpcLink = hre.network.config.url;

  const [encryptedData] = await encryptDataField(rpcLink, data);

  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  const contractAddress = "0x85a816F96E5b4EcFaA23b1ec9961E818a38f1da1"; 
  const recipientAddress = "0x3dbea9738209244B6e1ebd6A95371896b628d68A"; 

  const [signer] = await hre.ethers.getSigners();

  const contractFactory = await hre.ethers.getContractFactory("HegelNFT"); 
  const contract = contractFactory.attach(contractAddress);

  const functionName = "mint";
  const functionArgs = [recipientAddress]; 
  const txData = contract.interface.encodeFunctionData(functionName, functionArgs);

  try {
    console.log("Sending the transaction...");

    const mintTx = await sendShieldedTransaction(
      signer,
      contractAddress,
      txData,
      0
    );

    await mintTx.wait();

    console.log("Deployed successfully!");
    console.log("The receipt: ", mintTx);
  } catch (error) {
    console.error("Deployed unsuccessfully: ", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});