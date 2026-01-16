const hre = require("hardhat");
const client = require("prom-client");
const express = require("express");

// -------------------------
// PROMETHEUS METRICS SETUP
// -------------------------
// Clear register to avoid "Metric already exists" errors if you re-run quickly
client.register.clear();

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics(); // Collects CPU/Memory usage

// METRIC 1: Total Transactions Sent (Counter)
const txCounter = new client.Counter({
  name: "stress_tx_sent_total",
  help: "Total number of transactions sent successfully"
});

// METRIC 2: Real-time TPS (Gauge)
const tpsGauge = new client.Gauge({
  name: "stress_tps",
  help: "Real-time Transactions Per Second"
});

// METRIC 3: Errors (Counter)
const errorCounter = new client.Counter({
  name: "stress_errors_total",
  help: "Total failed transactions"
});

// Start the Metrics Server inside this script
const app = express();
const PORT = 9100; 

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// Force binding to 127.0.0.1 (IPv4) to avoid Windows localhost issues
app.listen(PORT, "127.0.0.1", () => {
  console.log(`📊 Prometheus Metrics Server running at http://127.0.0.1:${PORT}/metrics`);
});

// -------------------------
// HEAVY CALDATA STRESS TEST
// -------------------------
async function main() {
  const [sender] = await hre.ethers.getSigners();
  
  console.log("------------------------------------------");
  console.log("🔥 STARTING HEAVY CALDATA ATTACK + METRICS");
  console.log(`👤 Sender: ${sender.address}`);
  console.log("------------------------------------------");

  const TOTAL_TXS = 2000;
  const BATCH_SIZE = 50; 
  const JUNK_DATA = "0x" + "11".repeat(5000); // 10KB Payload

  let nonce = await hre.ethers.provider.getTransactionCount(sender.address);
  let txCount = 0;
  let startTime = Date.now();

  console.log(`💣 Firing ${TOTAL_TXS} HEAVY transactions...`);

  while (txCount < TOTAL_TXS) {
    let txPromises = [];
    const batchStartTime = Date.now();

    for (let i = 0; i < BATCH_SIZE && txCount < TOTAL_TXS; i++) {
      const tx = {
        to: sender.address,
        value: 0,
        nonce: nonce++,
        data: JUNK_DATA,
        gasLimit: 500000, 
      };

      txPromises.push(
        sender.sendTransaction(tx)
          .then(() => txCounter.inc())
          .catch((err) => errorCounter.inc())
      );
      txCount++;
    }

    try {
      await Promise.all(txPromises);
      
      // Calculate TPS safely
      let batchDuration = (Date.now() - batchStartTime) / 1000;
      if (batchDuration <= 0) batchDuration = 0.001; 

      const instantTPS = BATCH_SIZE / batchDuration;
      
      // Update Prometheus
      tpsGauge.set(instantTPS); 
      
      // Log to console so we KNOW data exists
      process.stdout.write(` [TPS: ${instantTPS.toFixed(1)}] `); 

    } catch (err) {
      // --- UPDATED ERROR LOGGING ---
      console.error("\n⚠️  Batch Error Details:", err.message || err);
      
      console.log("❌ Batch failed, resetting nonce...");
      nonce = await hre.ethers.provider.getTransactionCount(sender.address);
    }
  }

  const duration = (Date.now() - startTime) / 1000;
  console.log("\n\n------------------------------------------");
  console.log(`✅ ATTACK COMPLETE`);
  console.log(`📊 Sent ${txCount} FAT transactions in ${duration.toFixed(2)}s`);
  console.log(`⚡ Avg Speed: ${(txCount / duration).toFixed(2)} TPS`);
  console.log("------------------------------------------");

  console.log("💤 SCRIPT SLEEPING FOR 5 MINUTES...");
  console.log("👉 GO TO GRAFANA NOW AND REFRESH DASHBOARD (Last 5 minutes)!");
  await new Promise(r => setTimeout(r, 300000)); // 5 mins
  console.log("🛑 Exiting.");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});