const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Lead = require('../models/Lead');
const axios = require('axios');
const openai = require('../services/openai');

// בדיקת סטטוס חיבור לפייסבוק
router.get('/status', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ connected: !!user.facebookToken });
    } catch (error) {
        res.status(500).json({ message: 'שגיאת שרת' });
    }
});

// חיבור לפייסבוק
router.post('/connect', auth, async (req, res) => {
    try {
        const { accessToken, userID } = req.body;
        
        // וידוא תוקף הטוקן מול פייסבוק
        const response = await axios.get(`https://graph.facebook.com/debug_token`, {
            params: {
                input_token: accessToken,
                access_token: `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`
            }
        });

        if (!response.data.data.is_valid) {
            return res.status(400).json({ message: 'טוקן פייסבוק לא תקין' });
        }

        // שמירת הטוקן במסד הנתונים
        await User.findByIdAndUpdate(req.user.id, {
            facebookToken: accessToken,
            facebookUserId: userID
        });

        res.json({ message: 'החיבור לפייסבוק בוצע בהצלחה' });
    } catch (error) {
        console.error('Facebook connect error:', error);
        res.status(500).json({ message: 'שגיאה בחיבור לפייסבוק' });
    }
});

// ניתוק מפייסבוק
router.post('/disconnect', auth, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $unset: { facebookToken: "", facebookUserId: "" }
        });
        
        res.json({ message: 'הניתוק מפייסבוק בוצע בהצלחה' });
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בניתוק מפייסבוק' });
    }
});

// חיפוש קבוצות
router.post('/search-groups', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { keyword } = req.body;

        const response = await axios.get(`https://graph.facebook.com/v18.0/search`, {
            params: {
                q: keyword,
                type: 'group',
                limit: 25,
                fields: 'id,name,member_count',
                access_token: user.facebookToken
            }
        });

        const groups = response.data.data.map(group => ({
            id: group.id,
            name: group.name,
            memberCount: group.member_count
        }));

        res.json({ groups });
    } catch (error) {
        console.error('Error searching groups:', error);
        res.status(500).json({ message: 'שגיאה בחיפוש קבוצות' });
    }
});

// קבלת קבוצות שהמשתמש חבר בהן
router.get('/joined-groups', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        const response = await axios.get(`https://graph.facebook.com/v18.0/me/groups`, {
            params: {
                fields: 'id,name,member_count',
                access_token: user.facebookToken
            }
        });

        const groups = response.data.data.map(group => ({
            id: group.id,
            name: group.name,
            memberCount: group.member_count
        }));

        res.json({ groups });
    } catch (error) {
        console.error('Error fetching joined groups:', error);
        res.status(500).json({ message: 'שגיאה בטעינת הקבוצות' });
    }
});

// סריקת פוסטים בקבוצות
router.post('/scan-posts', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { groups } = req.body;

        const stats = [];
        for (const groupId of groups) {
            const response = await axios.get(`https://graph.facebook.com/v18.0/${groupId}/feed`, {
                params: {
                    fields: 'id,message,created_time,from',
                    limit: 100,
                    access_token: user.facebookToken
                }
            });

            const posts = response.data.data;
            let leadsFound = 0;

            for (const post of posts) {
                if (!post.message) continue;

                const isRelevant = user.businessInfo.keywords.some(keyword => 
                    post.message.toLowerCase().includes(keyword.toLowerCase())
                );

                if (isRelevant) {
                    const groupResponse = await axios.get(`https://graph.facebook.com/v18.0/${groupId}`, {
                        params: {
                            fields: 'name',
                            access_token: user.facebookToken
                        }
                    });

                    await Lead.create({
                        userId: user.id,
                        groupId,
                        groupName: groupResponse.data.name,
                        postId: post.id,
                        postUrl: `https://facebook.com/${post.id}`,
                        postContent: post.message,
                        authorName: post.from.name,
                        authorId: post.from.id,
                        matchedKeywords: user.businessInfo.keywords.filter(keyword => 
                            post.message.toLowerCase().includes(keyword.toLowerCase())
                        )
                    });

                    leadsFound++;
                }
            }

            stats.push({
                groupId,
                groupName: (await axios.get(`https://graph.facebook.com/v18.0/${groupId}`, {
                    params: {
                        fields: 'name',
                        access_token: user.facebookToken
                    }
                })).data.name,
                postsScanned: posts.length,
                leadsFound
            });

            // עדכון סטטיסטיקות
            await User.findByIdAndUpdate(user.id, {
                $inc: {
                    'analytics.groupsScanned': 1,
                    'analytics.postsScanned': posts.length,
                    'analytics.potentialLeads': leadsFound
                }
            });
        }

        res.json({ stats });
    } catch (error) {
        console.error('Error scanning posts:', error);
        res.status(500).json({ message: 'שגיאה בסריקת הפוסטים' });
    }
});

// יצירת תגובה אוטומטית
router.post('/generate-comment', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { leadId } = req.body;
        
        const lead = await Lead.findOne({ 
            _id: leadId,
            userId: user._id
        });

        if (!lead) {
            return res.status(404).json({ message: 'ליד לא נמצא' });
        }

        const comment = await openai.generateResponse(
            user.businessInfo,
            lead.postContent
        );

        res.json({ comment });
    } catch (error) {
        console.error('Error generating comment:', error);
        res.status(500).json({ message: 'שגיאה ביצירת תגובה' });
    }
});

// יצירת הודעה אוטומטית
router.post('/generate-message', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { leadId } = req.body;
        
        const lead = await Lead.findOne({ 
            _id: leadId,
            userId: user._id
        });

        if (!lead) {
            return res.status(404).json({ message: 'ליד לא נמצא' });
        }

        const message = await openai.generateMessage(
            user.businessInfo,
            lead.postContent
        );

        res.json({ message });
    } catch (error) {
        console.error('Error generating message:', error);
        res.status(500).json({ message: 'שגיאה ביצירת הודעה' });
    }
});

module.exports = router; 