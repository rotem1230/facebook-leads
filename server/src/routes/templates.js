const express = require('express');
const router = express.Router();

// מערך זמני לשמירת התבניות
let templates = [
    { id: 1, name: 'תבנית 1', content: 'תוכן לדוגמה 1' },
    { id: 2, name: 'תבנית 2', content: 'תוכן לדוגמה 2' }
];

// קבלת כל התבניות
router.get('/', (req, res) => {
    try {
        res.json({ templates });
    } catch (error) {
        console.error('Error getting templates:', error);
        res.status(500).json({ 
            message: 'אירעה שגיאה בטעינת התבניות',
            templates: [] 
        });
    }
});

// הוספת תבנית חדשה
router.post('/', (req, res) => {
    try {
        const { name, content } = req.body;
        
        if (!name || !content) {
            return res.status(400).json({ 
                message: 'נא להזין שם ותוכן לתבנית',
                templates 
            });
        }

        // יצירת ID חדש
        const newId = templates.length > 0 ? Math.max(...templates.map(t => t.id)) + 1 : 1;

        // הוספת התבנית החדשה
        const newTemplate = { id: newId, name, content };
        templates = [...templates, newTemplate];

        console.log('Templates after add:', templates);

        res.json({ 
            message: 'התבנית נוספה בהצלחה',
            templates 
        });
    } catch (error) {
        console.error('Error adding template:', error);
        res.status(500).json({ 
            message: 'אירעה שגיאה בהוספת התבנית',
            templates 
        });
    }
});

// עדכון תבנית
router.put('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, content } = req.body;

        const templateIndex = templates.findIndex(t => t.id === id);
        if (templateIndex === -1) {
            return res.status(404).json({ 
                message: 'התבנית לא נמצאה',
                templates 
            });
        }

        templates = templates.map(t => 
            t.id === id ? { ...t, name: name || t.name, content: content || t.content } : t
        );

        console.log('Templates after update:', templates);

        res.json({ 
            message: 'התבנית עודכנה בהצלחה',
            templates 
        });
    } catch (error) {
        console.error('Error updating template:', error);
        res.status(500).json({ 
            message: 'אירעה שגיאה בעדכון התבנית',
            templates 
        });
    }
});

// מחיקת תבנית
router.delete('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        // מחיקת התבנית
        templates = templates.filter(t => t.id !== id);

        console.log('Templates after delete:', templates);

        res.json({ 
            message: 'התבנית נמחקה בהצלחה',
            templates 
        });
    } catch (error) {
        console.error('Error deleting template:', error);
        res.status(500).json({ 
            message: 'אירעה שגיאה במחיקת התבנית',
            templates 
        });
    }
});

module.exports = router; 