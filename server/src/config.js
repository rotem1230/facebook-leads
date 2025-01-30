require('dotenv').config();

const config = {
    port: process.env.PORT || 5001,
    supabaseUrl: process.env.SUPABASE_URL || 'https://bfqmzcdwzkwuzlzzgdjz.supabase.co',
    supabaseKey: process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmcW16Y2R3emt3dXpsenpnZGp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyMTE4NzcsImV4cCI6MjA1Mzc4Nzg3N30.kSb7B05euKq95ab4RrlBWlSlu_la6q9-dU3Bja3rPlI',
    jwtSecret: process.env.JWT_SECRET || 'Ok63r2mmM4OQ9wstkXZ8KqwXwlu5UZuUPlhsHa1t6dNg3dus4cZj0gxiGsO6FLzpw6NZCI3mX7xM9fDuhmrcsA==',
    nodeEnv: process.env.NODE_ENV || 'development'
};

module.exports = config;
