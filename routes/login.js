const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('login', { error: null});
});

// Middleware to attach user to request if logged in
router.use(async (req, res, next) => {
    if (req.session.userId) {
      req.user = await User.findById(req.session.userId);
    }
    next();
  });
// Login post route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            // Store user ID and username in session
            req.session.userId = user._id;
            req.session.email = user.email;
            req.session.isAdmin = user.adminStatus; // Store admin status in session

            //if user is admin, redirect to admin page
            if (user.adminStatus) {
                res.redirect('/admin')
            } else {
                res.redirect('/main');
            }
        }else{
            res.render('login', { error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});
module.exports = router;