

const express = require('express');
const router = express.Router();
const User = require('../../model/User');
const { Types: { ObjectId } } = require('mongoose');
const News = require('../../model/newsModel');

// GET 
router.get('/', async (req, res) => {
    try {
      
        const news = await News.find();
        const isAdmin = req.session.isAdmin;
        if (req.session && isAdmin) {
            const users = await User.find({});
           
            res.render('manage/adminPanel', { users, isAdmin, news });
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET 
router.get('/:id', async (req, res) => {
    try {
        const new1 = await News.findById(req.params.id);
        if (!new1) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.json(new1);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST 
router.post('/', async (req, res) => {
    try {
        const NewsNameRussian = req.body.NewsNameRussian;
        const NewsNameEnglish = req.body.NewsNameEnglish;
        const NewsDescriptionRussian = req.body.NewsDescriptionRussian;
        const NewsDescriptionEnglish = req.body.NewsDescriptionEnglish;
        const NewsImage1 = req.body.NewsImage1;
        const NewsImage2 = req.body.NewsImage2;
        const NewsImage3 = req.body.NewsImage3;

        const news2 = new News({
            names: {
                russian: NewsNameRussian,
                english: NewsNameEnglish
            },
            descriptions: {
                russian: NewsDescriptionRussian,
                english: NewsDescriptionEnglish
            },
            images: [NewsImage1, NewsImage2, NewsImage3]
        });
        await news2.save();
        res.redirect('/adminPanel');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT 
router.put('/:id', async (req, res) => {
    try {
        const news3 = await News.findById(req.params.id);
        if (req.body.names && req.body.names.english && req.body.names.russian != null) {
            news3.names = req.body.names;
        }
        if (req.body.descriptions && req.body.descriptions.english && req.body.descriptions.russian != null) {
            news3.descriptions = req.body.descriptions;
        }
        if (req.body.images != null) {
            news3.images = req.body.images;
        }
        const updatedNews = await news3.save();
        res.json(updatedNews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(req.params.id, { "timestamps.deleted": new Date() }, { new: true });
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }
        await res.news.deleteOne();
        res.redirect('/manage/adminPanel');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
