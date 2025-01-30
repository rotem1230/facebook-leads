const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const supabase = createClient(config.supabaseUrl, config.supabaseKey);

// קבלת פרטי העסק
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .single();

        if (error) throw error;

        // אם אין נתונים, החזר אובייקט ריק
        const businessInfo = data || {
            name: '',
            description: '',
            phone: '',
            email: '',
            website: '',
            address: ''
        };

        res.json({ businessInfo });
    } catch (error) {
        console.error('Error getting business info:', error);
        res.status(500).json({ message: 'שגיאה בקבלת פרטי העסק' });
    }
});

// עדכון פרטי העסק
router.post('/', async (req, res) => {
    try {
        const { name, description, phone, email, website, address } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'שם העסק הוא שדה חובה' });
        }

        const businessInfo = {
            name: name.trim(),
            description: description ? description.trim() : '',
            phone: phone ? phone.trim() : '',
            email: email ? email.trim() : '',
            website: website ? website.trim() : '',
            address: address ? address.trim() : ''
        };

        // עדכן או צור רשומה (upsert)
        const { data, error } = await supabase
            .from('businesses')
            .upsert(businessInfo)
            .select()
            .single();

        if (error) throw error;

        res.json({
            message: 'פרטי העסק נשמרו בהצלחה',
            businessInfo: data
        });
    } catch (error) {
        console.error('Error saving business info:', error);
        res.status(500).json({ message: 'שגיאה בשמירת פרטי העסק' });
    }
});

module.exports = router;
