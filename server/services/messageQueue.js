const Lead = require('../models/Lead');
const axios = require('axios');
const supabase = require('../services/supabase');

class MessageQueue {
    constructor() {
        this.isProcessing = false;
        this.retryLimit = 3;
        this.retryDelay = 5000; // 5 seconds
    }

    async processQueue() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        try {
            const { data: pendingLeads, error } = await supabase
                .from('leads')
                .select('*')
                .not('message', 'is', null)
                .eq('message->>status', 'בתור');

            if (error) throw error;

            if (!pendingLeads || pendingLeads.length === 0) {
                return;
            }

            pendingLeads.sort((a, b) => {
                const timeA = new Date(a.message?.timestamp || 0);
                const timeB = new Date(b.message?.timestamp || 0);
                return timeA - timeB;
            });

            for (const lead of pendingLeads) {
                if (!lead.message || lead.message.retries >= this.retryLimit) continue;

                try {
                    await this.sendMessage(lead);
                } catch (error) {
                    console.error(`Error sending message for lead ${lead.id}:`, error);
                    const retries = (lead.message.retries || 0) + 1;
                    
                    await Lead.findByIdAndUpdate(lead.id, {
                        message: {
                            ...lead.message,
                            retries,
                            error: error.message,
                            status: retries >= this.retryLimit ? 'נכשל' : 'בתור'
                        },
                        status: retries >= this.retryLimit ? 'נכשל' : lead.status
                    });

                    await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                }
            }
        } catch (error) {
            console.error('Error processing message queue:', error);
        } finally {
            this.isProcessing = false;
            // Schedule next check
            setTimeout(() => this.processQueue(), 10000);
        }
    }

    async sendMessage(lead) {
        if (!lead.message || !lead.message.content) {
            throw new Error('Missing message content');
        }

        try {
            await axios.post(
                `https://graph.facebook.com/v18.0/${lead.authorId}/messages`,
                {
                    message: lead.message.content,
                    access_token: lead.facebookToken
                }
            );

            await Lead.findByIdAndUpdate(lead.id, {
                message: {
                    ...lead.message,
                    status: 'נשלח'
                },
                status: 'נשלחה הודעה'
            });
        } catch (error) {
            throw new Error(`שגיאה בשליחת הודעה: ${error.message}`);
        }
    }

    start() {
        this.processQueue();
    }
}

module.exports = new MessageQueue(); 