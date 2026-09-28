import pool from './db/pool.js';

async function createTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(100) NOT NULL,
        image_url VARCHAR(500),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('Blogs table created successfully!');
  } catch (error) {
    console.error('Error creating blogs table:', error);
  } finally {
    process.exit(0);
  }
}

createTable();
