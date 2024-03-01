const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const nytimesApiKey = process.env.NYTIMES_API_KEY;
const nytimesBaseUrl = 'https://api.nytimes.com';
router.get("/", async (req, res) => {
  try {
    const nytimesResponse = await axios.get(`${nytimesBaseUrl}/svc/mostpopular/v2/emailed/7.json?api-key=${nytimesApiKey}`);
    const articles = nytimesResponse.data.results;

    // Extract all articles' title, abstract, URL, image, and publish date
    const articlesData = articles.map(article => {
      return {
        title: article.title,
        abstract: article.abstract,
        url: article.url,
        published_date: article.published_date || 'Not available',
        image: article.media && article.media.length > 0 && article.media[0]["media-metadata"] && article.media[0]["media-metadata"].length > 0
          ? article.media[0]["media-metadata"][0].url
          : null,
        
      };
    });

    res.render("nytimes", { articles: articlesData, lang: "english" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;