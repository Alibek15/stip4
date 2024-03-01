const express = require('express');
const router = express.Router();
const {QuizQuestionModel} = require('../model/quiz');

router.get('/', async (req, res) => {
    const historyQuestions = await QuizQuestionModel.find({typeData: 'History' }).limit(5);
    res.render('quiz', { questions: historyQuestions, user: req.user}); 
});

router.get('/quizSpace', async (req, res) => {
  try {
      const spaceQuestions = await QuizQuestionModel.find({ typeData: 'Space' }).limit(5);
      res.render('quizSpace', { questions: spaceQuestions, user: req.user});
  } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
  }
});



module.exports = router;