# Rayls Stress & Load Testing

This repository contains tooling and reports for running stress and load tests against the Rayls network.  
The goal is to measure baseline performance, observe behavior under congestion, and identify network or RPC bottlenecks over time.

This repo is designed to evolve into reusable infrastructure for continuous performance testing.

---

## Overview

The stress tests focus on:
- Baseline transaction throughput (TPS)
- RPC stability under sustained load
- Network behavior under calldata-heavy congestion
- Run-to-run comparison of performance metrics

All tests are currently executed against **Rayls Devnet**.

---

## Test Environment

- Network: Rayls Devnet  
- Chain ID: `123123`
- RPC Endpoint: `devnet-rpc.rayls.com`
- Tooling: Hardhat + custom Node.js scripts
- Execution Environment: Local machine (Windows)

---


---

## Stress Test Types

### 1. Baseline Transfer Test
- Sends sequential standard transactions
- Measures baseline RPC responsiveness and TPS
- Validates basic connectivity and nonce handling

### 2. Congestion / Heavy Calldata Test
- Sends transactions with large calldata payloads (e.g. 10KB)
- Uses multiple concurrent senders
- Evaluates block data handling and RPC resilience

---

## Metrics Collected

Current metrics include:
- Total transactions sent
- Test duration
- Transactions per second (TPS)
- Error count (RPC / transaction failures)
- Timestamped run data

Metrics are exported in **JSON / CSV format** to allow easy ingestion into monitoring stacks such as:
- Grafana
- Prometheus
- InfluxDB

---

## Running the Tests

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Hardhat

### Install Dependencies
```bash
npm install

Example Sender Address

Test transactions can be verified on the Rayls Devnet explorer using the following sender address:

0xc80c3e8b0a3426e04ae9307bbe81cc2326f0adf4

Author

Soms Noble
Initial stress testing and analysis
