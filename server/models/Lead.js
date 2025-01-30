const supabase = require('../services/supabase');

class Lead {
    static async create(data) {
        const { data: lead, error } = await supabase
            .from('leads')
            .insert([data])
            .select()
            .single();

        if (error) throw error;
        return lead;
    }

    static async findOne(query) {
        const { data: lead, error } = await supabase
            .from('leads')
            .select('*')
            .match(query)
            .single();

        if (error) throw error;
        return lead;
    }

    static async find(query, select = '*') {
        const { data, error } = await supabase
            .from('leads')
            .select(select)
            .match(query);

        if (error) throw error;
        return data;
    }

    static async findByIdAndUpdate(id, update) {
        const { data: lead, error } = await supabase
            .from('leads')
            .update(update)
            .match({ id })
            .select()
            .single();

        if (error) throw error;
        return lead;
    }
}

module.exports = Lead; 