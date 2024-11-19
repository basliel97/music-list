import postgres from 'postgres';

// Set up a PostgreSQL client pool
const db = postgres({
  host: 'aws-0-eu-central-1.pooler.supabase.com',
  port: 6543, // Default PostgreSQL port
  database: 'postgres', // Name of your database
  user: 'postgres.ccmogkklkktqptnleewv', // Replace with your Supabase username
  password: 'JuYGN5anwdoll7zx', // Replace with your Supabase password
});

export default db;
// postgresql://postgres.ccmogkklkktqptnleewv:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres