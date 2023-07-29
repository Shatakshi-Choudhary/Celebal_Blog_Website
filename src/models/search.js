// routes/search.js

const express = require('express');
const router = express.Router();
const BlogPost = require('../models/Blog'); // Adjust the path based on your project structure and model location

router.get('/search', async (req, res) => {
  const { query } = req.query;

  try {
    const results = await BlogPost.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
      ],
    });

    // Render the search-results.html view with the search results
    res.render('search_results', { results });
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ success: false, message: 'An error occurred during search.' });
  }
});

module.exports = router;
