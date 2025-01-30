const express = require('express');
const router = express.Router();

// מערך זמני לשמירת מילות המפתח - נתחיל עם מערך ריק
let keywords = [];

// קבלת כל מילות המפתח
router.get('/', (req, res) => {
    try {
        res.json({ keywords });
    } catch (error) {
        console.error('Error getting keywords:', error);
        res.status(500).json({ 
            message: 'אירעה שגיאה בטעינת מילות המפתח',
            keywords: [] 
        });
    }
});

// הוספת מילת מפתח
router.post('/', (req, res) => {
    try {
        const { keyword } = req.body;
        
        if (!keyword || typeof keyword !== 'string') {
            return res.status(400).json({ 
                message: 'נא להזין מילת מפתח תקינה',
                keywords 
            });
        }

        // בדיקה אם המילה כבר קיימת
        if (keywords.includes(keyword)) {
            return res.status(400).json({ 
                message: 'מילת המפתח כבר קיימת',
                keywords 
            });
        }

        // הוספת המילה החדשה בלבד
        keywords = [...keywords, keyword];

        console.log('Keywords after add:', keywords);

        res.json({ 
            message: 'מילת המפתח נוספה בהצלחה',
            keywords 
        });
    } catch (error) {
        console.error('Error adding keyword:', error);
        res.status(500).json({ 
            message: 'אירעה שגיאה בהוספת מילת המפתח',
            keywords 
        });
    }
});

// מחיקת מילת מפתח
router.delete('/:keyword', (req, res) => {
    try {
        const keywordToDelete = decodeURIComponent(req.params.keyword);
        
        // מחיקת המילה
        keywords = keywords.filter(k => k !== keywordToDelete);

        console.log('Keywords after delete:', keywords);

        res.json({ 
            message: 'מילת המפתח נמחקה בהצלחה',
            keywords 
        });
    } catch (error) {
        console.error('Error deleting keyword:', error);
        res.status(500).json({ 
            message: 'אירעה שגיאה במחיקת מילת המפתח',
            keywords 
        });
    }
});

module.exports = router; 