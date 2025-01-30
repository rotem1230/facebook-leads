const supabase = require('../services/supabase');

class MessageTemplate {
    static async find(query) {
        const { data: templates, error } = await supabase
            .from('message_templates')
            .select('*')
            .match(query);

        if (error) throw error;
        return templates;
    }

    static async create(data) {
        const { data: template, error } = await supabase
            .from('message_templates')
            .insert([data])
            .select()
            .single();

        if (error) throw error;
        return template;
    }

    static async findOneAndUpdate(query, update) {
        const { data: template, error } = await supabase
            .from('message_templates')
            .update(update)
            .match(query)
            .select()
            .single();

        if (error) throw error;
        return template;
    }

    static async findOneAndDelete(query) {
        const { data: template, error } = await supabase
            .from('message_templates')
            .delete()
            .match(query)
            .select()
            .single();

        if (error) throw error;
        return template;
    }
}

module.exports = MessageTemplate; 