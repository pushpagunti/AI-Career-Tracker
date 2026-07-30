const mongoose = require("mongoose");
const dns = require("dns");

// Force Node.js to use Google DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    console.log("=====================================");
    console.log("Connecting to MongoDB Atlas...");
    console.log("=====================================");

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("=====================================");
    console.log("✅ MongoDB Connected Successfully!");
    console.log("Host     :", conn.connection.host);
    console.log("Database :", conn.connection.name);
    console.log("=====================================");

    return conn;
  } catch (err) {
    console.error("=====================================");
    console.error("❌ MongoDB Connection Failed");
    console.error(err);
    console.error("=====================================");
    throw err;
  }
};

module.exports = connectDB;