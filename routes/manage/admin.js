const express = require('express');
const router = express.Router();
const User = require('../../model/User');
const bcrypt = require('bcrypt');
const { Types: { ObjectId } } = require('mongoose');

router.get('/', async (req, res) => {
    try{
        const isAdmin = req.session.isAdmin;
        if (req.session && isAdmin) {
            const users = await User.find({});
            // Render admin page with list of users
            res.render('manage/admin', { users, isAdmin, user: req.user});
        } else {
            res.redirect('/');
        }
    }catch(err){
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/add', async (req, res) => {
    const { username, email, password } = req.body; // Added email

    try {        
        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.send('Username or email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into database
        await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.redirect('/admin');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/edit/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.render('manage/edit', { user, isAdmin: req.session.isAdmin});
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/edit/:id', async (req, res) => {
    const userId = req.params.id;
    const { username, email, password } = req.body; // Added email

    try {
        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user in database
        await User.updateOne({ _id: new ObjectId(userId) }, { $set: { username, email, password : hashedPassword } }); // Added email

        res.redirect('/admin');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/delete/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Delete user from the user table
        await User.deleteOne({ _id: new ObjectId(userId) });

        res.redirect('/admin');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;