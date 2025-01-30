const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const supabase = createClient(config.supabaseUrl, config.supabaseKey);

// קבלת פרטי העסק
router.get('/', async (req, res) => {
    try {
        const { data } = await supabase
            .from('users')
            .select('business_info')
            .limit(1);

        const defaultInfo = {
            name: '',
            description: '',
            website: '',
            phone: '',
            keywords: []
        };

        const businessInfo = data?.[0]?.business_info || defaultInfo;
        res.json({ businessInfo });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'שגיאה בקבלת פרטי העסק' });
    }
});

// עדכון פרטי העסק
router.post('/', async (req, res) => {
    try {
        const { name, description, website, phone, keywords } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'שם העסק הוא שדה חובה' });
        }

        const businessInfo = {
            name: name.trim(),
            description: description ? description.trim() : '',
            website: website ? website.trim() : '',
            phone: phone ? phone.trim() : '',
            keywords: keywords || []
        };

        const { data: users } = await supabase
            .from('users')
            .select('id')
            .limit(1);

        if (!users?.length) {
            return res.status(404).json({ message: 'לא נמצאו משתמשים במערכת' });
        }

        const { data } = await supabase
            .from('users')
            .update({ business_info: businessInfo })
            .eq('id', users[0].id)
            .select()
            .single();

        res.json({
            message: 'פרטי העסק נשמרו בהצלחה',
            businessInfo: data.business_info
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'שגיאה בשמירת פרטי העסק' });
    }
});

module.exports = router;