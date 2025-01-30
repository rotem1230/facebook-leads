const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function generateResponse(businessInfo, postContent) {
    try {
        const prompt = `
        אתה נציג שירות מקצועי. 
        פרטי העסק: ${businessInfo.description}
        
        תוכן הפוסט: "${postContent}"
        
        אנא צור תגובה מקצועית, אישית ורלוונטית לפוסט שתכלול:
        1. התייחסות אישית לתוכן הפוסט
        2. הצעת ערך רלוונטית מהעסק
        3. הזמנה לשיחה נוספת
        
        התגובה צריכה להיות קצרה, ידידותית ומזמינה.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "אתה נציג שירות מקצועי שמגיב לפוסטים בפייסבוק. עליך לכתוב בעברית ובצורה טבעית ומקצועית."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 200
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('OpenAI API error:', error);
        throw new Error('שגיאה ביצירת תגובה אוטומטית');
    }
}

async function generateMessage(businessInfo, postContent) {
    try {
        const prompt = `
        אתה נציג שירות מקצועי. 
        פרטי העסק: ${businessInfo.description}
        
        תוכן הפוסט: "${postContent}"
        
        אנא צור הודעה פרטית מקצועית ואישית שתכלול:
        1. פנייה אישית
        2. התייחסות לתוכן הפוסט
        3. הצעת ערך ייחודית מהעסק
        4. הזמנה לשיחה או פגישה
        
        ההודעה צריכה להיות קצרה, ידידותית ולא לחוצה מדי.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "אתה נציג שירות מקצועי ששולח הודעות פרטיות בפייסבוק. עליך לכתוב בעברית ובצורה טבעית ומקצועית."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 200
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('OpenAI API error:', error);
        throw new Error('שגיאה ביצירת הודעה אוטומטית');
    }
}

module.exports = {
    generateResponse,
    generateMessage
}; 