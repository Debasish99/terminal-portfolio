const { Pool } = require('pg');

const DATABASE_URL = "postgresql://postgres:Mightguy@123@332211@db.mgkclwfialczddlykdma.supabase.co:5432/postgres";

const pool = new Pool({ connectionString: DATABASE_URL });

async function testConnection() {
  try {
    console.log('Attempting to connect to Supabase...');
    const client = await pool.connect();
    console.log('✓ Connection successful!');
    
    // Test query
    const result = await client.query('SELECT NOW()');
    console.log('✓ Query executed:', result.rows[0]);
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('✗ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
