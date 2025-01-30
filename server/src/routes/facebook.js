const express = require('express');
const router = express.Router();

// בדיקת חיבור לפייסבוק
router.get('/connect', (req, res) => {
    res.json({ status: 'connected' });
});

// קבלת רשימת קבוצות
router.get('/groups', (req, res) => {
    res.json({
        groups: [
            { id: 1, name: 'קבוצה לדוגמה 1', lastScanned: new Date(), autoScan: true },
            { id: 2, name: 'קבוצה לדוגמה 2', lastScanned: null, autoScan: false }
        ]
    });
});

// סריקת קבוצה ספציפית
router.post('/groups/:id/scan', (req, res) => {
    res.json({ message: 'הסריקה החלה' });
});

module.exports = router; 