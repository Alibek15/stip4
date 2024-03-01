const mongoose = require('mongoose');
const Schema = mongoose.Schema
const QuizQuestion = new Schema({
  typeData: String,
  question: String,
  answers: [String],
  correctAnswer: Number
});

const QuizQuestionModel = mongoose.model('QuizQuestion', QuizQuestion);


const historyQuestions = [
  {
      question: "Когда состоялось Великое французское революционное восстание?",
      answers: ["1776", "1789", "1812", "1905"],
      correctAnswer: 1
  },
  {
      question: "Кто был первым президентом Соединенных Штатов Америки?",
      answers: ["Джордж Вашингтон", "Томас Джефферсон", "Авраам Линкольн", "Джон Адамс"],
      correctAnswer: 0
  },
  {
      question: "Какое событие привело к началу Первой мировой войны?",
      answers: ["Убийство архидукса Франца Фердинанда", "Октябрьская революция", "Подписание Договора о ненападении между Германией и СССР", "Завоевание Берлина французскими войсками"],
      correctAnswer: 0
  },
  {
      question: "Какой был результат Великой депрессии?",
      answers: ["Падение Берлинской стены", "Начало Второй мировой войны", "Великий экономический кризис", "Подписание Договора о Варшавском пакте"],
      correctAnswer: 2
  },
  {
      question: "Кто был правителем Древнего Рима, когда он был убит в Иды Марта?",
      answers: ["Юлий Цезарь", "Август", "Тиберий", "Нерон"],
      correctAnswer: 0
  },
];

const cosmoQuestions = [
  {
      question: "Какая планета является самой близкой к Солнцу в нашей солнечной системе?",
      answers: ["Марс", "Венера", "Земля", "Меркурий"],
      correctAnswer: 3
  },
  {
      question: "Какая из следующих планет считается красной?",
      answers: ["Марс", "Юпитер", "Сатурн", "Нептун"],
      correctAnswer: 0
  },
  {
      question: "Какая планета обладает самым большим количеством спутников в нашей солнечной системе?",
      answers: ["Юпитер", "Марс", "Земля", "Сатурн"],
      correctAnswer: 0
  },
  {
      question: "Какой космический объект считается карликовой планетой?",
      answers: ["Юпитер", "Венера", "Церера", "Сатурн"],
      correctAnswer: 2
  },
  {
      question: "Какая планета в солнечной системе обладает самой большой массой?",
      answers: ["Земля", "Юпитер", "Марс", "Венера"],
      correctAnswer: 1
  },
];

async function saveQuestions() {
  for (const questionData of historyQuestions) {
    const newQuestion = new QuizQuestionModel({ ...questionData, typeData: 'History' });
    try {
        await newQuestion.save();
        console.log("History question saved");
    } catch (err) {
        if (err.code === 11000) {
            console.log("History question already exists");
        } else {
            console.error(err);
        }
    }
  }

  for (const questionData of cosmoQuestions) {
    const newQuestion = new QuizQuestionModel({ ...questionData, typeData: 'Space' });
    try {
        await newQuestion.save();
        console.log("Space question saved");
    } catch (err) {
        if (err.code === 11000) {
            console.log("Space question already exists");
        } else {
            console.error(err);
        }
    }
  }
}

saveQuestions();

module.exports = {QuizQuestionModel, historyQuestions, cosmoQuestions};