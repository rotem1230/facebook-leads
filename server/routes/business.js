const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// קבלת פרטי העסק
router.get('/info', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא' });
        }

        res.json(user.businessInfo);
    } catch (error) {
        console.error('Error fetching business info:', error);
        res.status(500).json({ message: 'שגיאה בטעינת פרטי העסק' });
    }
});

// עדכון פרטי העסק
router.put('/info', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא' });
        }

        user.businessInfo = {
            ...user.businessInfo,
            ...req.body
        };

        await user.save();
        res.json(user.businessInfo);
    } catch (error) {
        console.error('Error updating business info:', error);
        res.status(500).json({ message: 'שגיאה בעדכון פרטי העסק' });
    }
});

module.exports = router; 