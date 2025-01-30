const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// קבלת נתונים לדשבורד
router.get('/dashboard', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא' });
        }

        res.json(user.analytics);
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ message: 'שגיאה בטעינת הנתונים' });
    }
});

// עדכון נתוני אנליטיקס
router.put('/update', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא' });
        }

        // עדכון הנתונים
        user.analytics = {
            ...user.analytics,
            ...req.body
        };

        await user.save();
        res.json(user.analytics);
    } catch (error) {
        console.error('Error updating analytics:', error);
        res.status(500).json({ message: 'שגיאה בעדכון הנתונים' });
    }
});

module.exports = router; 