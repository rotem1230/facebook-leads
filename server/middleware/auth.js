const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // קבלת הטוקן מה-header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // בדיקה אם אין טוקן
    if (!token) {
        return res.status(401).json({ message: 'אין הרשאה, נדרשת התחברות' });
    }

    try {
        // אימות הטוקן
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // הוספת המשתמש לבקשה
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'טוקן לא תקין' });
    }
}; 