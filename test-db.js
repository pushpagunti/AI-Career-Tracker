const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://pushpagunti6_db_user:HCsQlFFwlN6guyoo@ai-career-tracker-clust.sszruo4.mongodb.net/?appName=ai-career-tracker-cluster";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

run();