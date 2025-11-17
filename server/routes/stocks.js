const express = require("express");
const axios = require("axios");
const router = express.Router();

// Your Twelve Data API Key
const API_KEY = "1b9bfcacd0a94a2ba2a386be8f603d88";

// NSE Index Symbols (Correct Twelve Data Format)
const INDEX_LIST = {
  nifty: "^NSEI",
  sensex: "^BSESN",
  bankNifty: "^NSEBANK",
};

// Fetch function
async function fetchIndex(symbol) {
  try {
    const url = `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${API_KEY}`;
    const { data } = await axios.get(url);

    if (data.status === "error") return null;
    return parseFloat(data.price);
  } catch {
    return null;
  }
}

// GET → /api/stocks/live
router.get("/live", async (req, res) => {
  try {
    const nifty = await fetchIndex(INDEX_LIST.nifty);
    const sensex = await fetchIndex(INDEX_LIST.sensex);
    const bankNifty = await fetchIndex(INDEX_LIST.bankNifty);

    res.json({
      success: true,
      nifty,
      sensex,
      bankNifty,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Server Error while fetching data",
    });
  }
});

module.exports = router;
