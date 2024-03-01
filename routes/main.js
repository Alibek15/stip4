// main.js
const express = require("express");
const fetch = require('cross-fetch');
const router = express.Router();
const { Types: { ObjectId } } = require("mongoose");
const News = require("../model/newsModel");

async function getExchangeRates() {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    const rates = data.rates;
    const currencies = Object.keys(rates).slice(0, 5); // get the first 5 currencies
    return currencies.map(currency => ({currency, rate: rates[currency]}));
}

router.get("/", async (req, res) => {
  try {
    const news = await News.find();
    const exchangeRates = await getExchangeRates();
    res.render("main", { news, lang: "english", exchangeRates, user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// router get change language
router.get("/ru", async (req, res) => {
  try {
    const news = await News.find();
    const exchangeRates = await getExchangeRates();
    res.render("main", { news, lang: "russian", exchangeRates, user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;