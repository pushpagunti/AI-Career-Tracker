require('dotenv').config();

const dns = require('dns');
const mongoose = require('mongoose');

// Use Google's DNS servers
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function testConnection() {
  try {
    console.log('=====================================');
    console.log('Testing MongoDB Atlas Connection...');
    console.log('=====================================');

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ Connected Successfully!');
    console.log('Host      :', conn.connection.host);
    console.log('Database  :', conn.connection.name);
    console.log('=====================================');

    await mongoose.disconnect();

    console.log('Disconnected successfully.');
    process.exit(0);
  } catch (error) {
    console.log('=====================================');
    console.log('❌ Connection Failed');
    console.error(error);
    console.log('=====================================');
    process.exit(1);
  }
}

testConnection();