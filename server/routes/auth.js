const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// הרשמה
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // בדיקה אם המשתמש קיים
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'משתמש עם אימייל זה כבר קיים' });
        }

        // יצירת משתמש חדש
        user = new User({
            email,
            password
        });

        // הצפנת הסיסמה
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // יצירת טוקן
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'שגיאת שרת' });
    }
});

// התחברות
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // בדיקה אם המשתמש קיים
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'פרטי התחברות שגויים' });
        }

        // בדיקת סיסמה
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'פרטי התחברות שגויים' });
        }

        // יצירת טוקן
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'שגיאת שרת' });
    }
});

// בדיקת טוקן
router.get('/verify', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ message: 'שגיאת שרת' });
    }
});

module.exports = router; 