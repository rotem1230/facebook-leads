const config = {
    port: process.env.PORT || 5001,
    supabaseUrl: process.env.SUPABASE_URL || 'your_supabase_url',
    supabaseKey: process.env.SUPABASE_ANON_KEY || 'your_supabase_key',
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    nodeEnv: process.env.NODE_ENV || 'development'
};

module.exports = config; 