const express = require('express');
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Auth routes are working!' });
});

router.post('/register', async (req, res) => {
    console.log('Register request received:', req.body);
    try {
        const { email, password } = req.body;
        console.log('Processing registration for:', email);

        // בדיקה בסיסית של הנתונים
        if (!email || !password) {
            console.log('Missing required fields');
            return res.status(400).json({ 
                message: 'חסרים שדות חובה'
            });
        }

        // כרגע נחזיר תשובה פשוטה
        console.log('Registration successful for:', email);
        res.status(200).json({ 
            message: 'משתמש נרשם בהצלחה',
            token: 'dummy-token',
            email
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: error.message || 'אירעה שגיאה בהרשמה'
        });
    }
});

router.post('/login', async (req, res) => {
    console.log('Login request received:', req.body);
    try {
        const { email, password } = req.body;
        console.log('Processing login for:', email);

        // בדיקה בסיסית של הנתונים
        if (!email || !password) {
            console.log('Missing required fields');
            return res.status(400).json({ 
                message: 'חסרים שדות חובה'
            });
        }

        // כרגע נחזיר תשובה פשוטה
        console.log('Login successful for:', email);
        res.status(200).json({ 
            message: 'התחברת בהצלחה',
            token: 'dummy-token',
            email
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: error.message || 'אירעה שגיאה בהתחברות'
        });
    }
});

module.exports = router; 