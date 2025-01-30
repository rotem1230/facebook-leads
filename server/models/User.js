const supabase = require('../services/supabase');

class User {
    static async findById(id) {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return user;
    }

    static async findOne(query) {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .match(query)
            .single();

        if (error) throw error;
        return user;
    }

    static async findByIdAndUpdate(id, update) {
        const { data: user, error } = await supabase
            .from('users')
            .update(update)
            .match({ id })
            .select()
            .single();

        if (error) throw error;
        return user;
    }
}

module.exports = User; 