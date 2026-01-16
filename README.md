# ⚡ Rayls Network Stress Tester & Monitor

A robust load-testing suite designed to evaluate the performance, stability, and throughput limits of the Rayls Blockchain Network (L1). 

This project simulates high-volume traffic using "Heavy Caldata" payloads to stress both the execution layer and the mempool, while providing real-time observability through a custom **Prometheus + Grafana** pipeline.

![License](https://img.shields.io/badge/license-MIT-blue)
![Hardhat](https://img.shields.io/badge/built%20with-Hardhat-yellow)
![Monitoring](https://img.shields.io/badge/monitoring-Prometheus%20%2B%20Grafana-orange)

---

## 🚀 Key Features

* **Heavy Payload Attack:** Sends 10KB of junk data per transaction to saturate node execution limits.
* **Real-Time Metrics:** Exposes a local Prometheus endpoint (`:9100`) to track TPS, Total Transactions, and Error Rates.
* **Auto-Recovery:** Script automatically detects `Nonce too low` errors and re-syncs with the network to maintain continuous load.
* **Visual Dashboard:** Includes a pre-built Grafana JSON template for instant visualization.

---

## 🛠️ Prerequisites

Before running the test, ensure you have the following installed:

1.  **Node.js** (v16+)
2.  **Grafana** (Running locally on `:3000`)
3.  **Prometheus** (The executable is required, see setup below)

---

## ⚙️ Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/somsnoble/rayls-stress-test.git](https://github.com/somsnoble/rayls-stress-test.git)
    cd rayls-stress-test
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Prometheus:**
    * Download [Prometheus](https://prometheus.io/download/) for your OS.
    * Extract `prometheus.exe` (Windows) or the binary (Mac/Linux) into the root folder of this project.
    * *(Note: The executable is git-ignored to keep the repo light.)*

---

## 🏃‍♂️ How to Run the Stress Test

This pipeline requires **two separate terminals** running simultaneously.

### Step 1: Start the Monitoring Engine (Terminal 1)
This starts the Prometheus scraper which listens to the script.

```bash
# Windows
.\prometheus.exe --config.file=prometheus.yml

# Mac/Linux
./prometheus --config.file=prometheus.yml

Step 2: Launch the Attack (Terminal 2)
This starts the Hardhat script that generates transactions and exposes metrics on port 9100.

npx hardhat run scripts/stress.js --network rayls

Setting up the Dashboard (Grafana)
Open Grafana at http://localhost:3000.

Add Data Source:

Select Prometheus.

URL: http://localhost:9090.

Click Save & Test.

Import Dashboard:

Go to Dashboards > Import.

Click Upload JSON file.

Select dashboards/rayls_stress_dashboard.json from this project folder.

Click Load.

You will now see real-time charts for:

✅ Live TPS (Transactions Per Second)

📈 Total Transactions Sent

🚨 Network Error Rates (Saturation indicators)

⚠️ Troubleshooting
"Address already in use: 9100"

Cause: The previous script didn't close properly.

Fix: Open Task Manager/Activity Monitor and kill any running node processes.

"Nonce too low"

Cause: The network is processing transactions slower than the script is sending them.

Fix: The script handles this automatically by resetting the nonce. No action needed.

"Target actively refused connection"

Cause: You started Prometheus (Step 1) but forgot to start the script (Step 2).

Fix: Run scripts/stress.js.

📜 License
This project is for internal testing and development purposes.