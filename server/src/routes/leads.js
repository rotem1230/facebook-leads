const express = require('express');
const router = express.Router();

// קבלת כל הלידים
router.get('/', (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        const leads = [
            { id: 1, name: 'ליד 1', source: 'קבוצה 1', date: new Date() },
            { id: 2, name: 'ליד 2', source: 'קבוצה 2', date: new Date() }
        ];

        res.json({
            leads,
            page,
            limit,
            total: leads.length
        });
    } catch (error) {
        console.error('Error in leads route:', error);
        res.status(500).json({ 
            message: 'אירעה שגיאה בטעינת הלידים',
            leads: [] 
        });
    }
});

module.exports = router; 