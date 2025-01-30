const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Lead = require('../models/Lead');
const User = require('../models/User');

// קבלת כל הלידים
router.get('/', auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const leads = await Lead.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({ leads });
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ message: 'שגיאה בטעינת הלידים' });
    }
});

// הוספת תגובה לליד
router.post('/:id/comment', auth, async (req, res) => {
    try {
        const lead = await Lead.findOne({ 
            _id: req.params.id,
            userId: req.user.id
        });

        if (!lead) {
            return res.status(404).json({ message: 'ליד לא נמצא' });
        }

        lead.comment = {
            content: req.body.content,
            timestamp: new Date(),
            status: 'נשלח'
        };
        lead.status = 'נשלחה תגובה';

        await lead.save();

        // עדכון סטטיסטיקות
        await User.findByIdAndUpdate(req.user.id, {
            $inc: { 'analytics.commentsPosted': 1 }
        });

        res.json(lead);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'שגיאה בהוספת התגובה' });
    }
});

// מחיקת תגובה מליד
router.delete('/:id/comment', auth, async (req, res) => {
    try {
        const lead = await Lead.findOne({ 
            _id: req.params.id,
            userId: req.user.id
        });

        if (!lead) {
            return res.status(404).json({ message: 'ליד לא נמצא' });
        }

        lead.comment = null;
        lead.status = 'חדש';
        await lead.save();

        // עדכון סטטיסטיקות
        await User.findByIdAndUpdate(req.user.id, {
            $inc: { 'analytics.commentsPosted': -1 }
        });

        res.json(lead);
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'שגיאה במחיקת התגובה' });
    }
});

// שליחת הודעה לליד
router.post('/:id/message', auth, async (req, res) => {
    try {
        const lead = await Lead.findOne({ 
            _id: req.params.id,
            userId: req.user.id
        });

        if (!lead) {
            return res.status(404).json({ message: 'ליד לא נמצא' });
        }

        lead.message = {
            content: req.body.content,
            timestamp: new Date(),
            status: 'בתור'
        };
        lead.status = 'נשלחה הודעה';

        await lead.save();

        res.json(lead);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'שגיאה בשליחת ההודעה' });
    }
});

module.exports = router; 