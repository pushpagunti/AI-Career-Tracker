require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User.model");

const email = process.argv[2];

const makeAdmin = async () => {
  if (!email) {
    console.error("Usage: node src/scripts/makeAdmin.js user@example.com");
    process.exit(1);
  }

  try {
    await connectDB();

    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      console.error(`No user found with email: ${email}`);
      process.exit(1);
    }

    console.log(`${user.name} (${user.email}) is now an admin.`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

makeAdmin();