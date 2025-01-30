const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// קבלת כל מילות המפתח
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא' });
        }

        res.json({ keywords: user.businessInfo.keywords || [] });
    } catch (error) {
        console.error('Error fetching keywords:', error);
        res.status(500).json({ message: 'שגיאה בטעינת מילות המפתח' });
    }
});

// הוספת מילת מפתח
router.post('/', auth, async (req, res) => {
    try {
        const { keyword } = req.body;
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא' });
        }

        if (!user.businessInfo.keywords) {
            user.businessInfo.keywords = [];
        }

        // בדיקה אם מילת המפתח כבר קיימת
        if (user.businessInfo.keywords.includes(keyword)) {
            return res.status(400).json({ message: 'מילת מפתח זו כבר קיימת' });
        }

        user.businessInfo.keywords.push(keyword);
        await user.save();

        res.json({ keywords: user.businessInfo.keywords });
    } catch (error) {
        console.error('Error adding keyword:', error);
        res.status(500).json({ message: 'שגיאה בהוספת מילת המפתח' });
    }
});

// מחיקת מילת מפתח
router.delete('/:keyword', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא' });
        }

        const keywordToDelete = decodeURIComponent(req.params.keyword);
        
        if (!user.businessInfo.keywords) {
            return res.status(404).json({ message: 'מילת המפתח לא נמצאה' });
        }

        const keywordIndex = user.businessInfo.keywords.indexOf(keywordToDelete);
        if (keywordIndex === -1) {
            return res.status(404).json({ message: 'מילת המפתח לא נמצאה' });
        }

        user.businessInfo.keywords.splice(keywordIndex, 1);
        await user.save();

        res.json({ keywords: user.businessInfo.keywords });
    } catch (error) {
        console.error('Error deleting keyword:', error);
        res.status(500).json({ message: 'שגיאה במחיקת מילת המפתח' });
    }
});

module.exports = router; 