const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const MessageTemplate = require('../models/MessageTemplate');

// קבלת כל התבניות
router.get('/', auth, async (req, res) => {
    try {
        const templates = await MessageTemplate.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        res.json({ templates });
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ message: 'שגיאה בטעינת התבניות' });
    }
});

// יצירת תבנית חדשה
router.post('/', auth, async (req, res) => {
    try {
        const { name, content, type } = req.body;
        
        const template = new MessageTemplate({
            userId: req.user.id,
            name,
            content,
            type
        });

        await template.save();
        res.status(201).json({ template });
    } catch (error) {
        console.error('Error creating template:', error);
        res.status(500).json({ message: 'שגיאה ביצירת התבנית' });
    }
});

// עדכון תבנית קיימת
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, content, type } = req.body;
        
        const template = await MessageTemplate.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { name, content, type },
            { new: true }
        );

        if (!template) {
            return res.status(404).json({ message: 'התבנית לא נמצאה' });
        }

        res.json({ template });
    } catch (error) {
        console.error('Error updating template:', error);
        res.status(500).json({ message: 'שגיאה בעדכון התבנית' });
    }
});

// מחיקת תבנית
router.delete('/:id', auth, async (req, res) => {
    try {
        const template = await MessageTemplate.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!template) {
            return res.status(404).json({ message: 'התבנית לא נמצאה' });
        }

        res.json({ message: 'התבנית נמחקה בהצלחה' });
    } catch (error) {
        console.error('Error deleting template:', error);
        res.status(500).json({ message: 'שגיאה במחיקת התבנית' });
    }
});

module.exports = router; 