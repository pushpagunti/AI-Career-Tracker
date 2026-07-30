const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('../src/config/db');
const User = require('../src/models/User.model');


const createAdmin = async () => {

  try {

    await connectDB();

    console.log("MongoDB connected");


    const email = "test@example.com";


    const user = await User.findOne({ email });


    if (!user) {

      console.log(`User not found: ${email}`);

      process.exit(1);

    }


    user.role = "admin";

    await user.save();


    console.log(`✅ Admin role assigned to ${email}`);


    process.exit(0);


  } catch (error) {


    console.error("Create Admin Error:", error.message);


    process.exit(1);

  }

};


createAdmin();