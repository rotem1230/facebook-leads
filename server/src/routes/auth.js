const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { supabase } = require('../lib/supabase');

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

router.post('/facebook', async (req, res) => {
  try {
    const { accessToken } = req.body;
    
    // בדוק את תקינות הטוקן מול פייסבוק
    const response = await axios.get(`https://graph.facebook.com/me?access_token=${accessToken}`);
    
    if (!response.data.id) {
      return res.status(401).json({ message: 'Invalid Facebook token' });
    }

    // בדוק אם המשתמש קיים או צור חדש
    let { data: users } = await supabase
      .from('users')
      .select('*')
      .eq('facebook_id', response.data.id);

    let user = users?.[0];

    if (!user) {
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{
          facebook_id: response.data.id,
          name: response.data.name,
          email: response.data.email
        }])
        .select()
        .single();

      if (error) throw error;
      user = newUser;
    }

    // צור טוקן JWT
    const token = jwt.sign(
      { userId: user.id },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Facebook auth error:', error);
    res.status(500).json({ message: 'שגיאה באימות מול פייסבוק' });
  }
});

module.exports = router; 