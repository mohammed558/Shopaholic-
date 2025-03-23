// lib/database.js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

const uri = process.env.MONGODB_URI; // Ensure your .env file has MONGO_URI defined
if (!uri) {
  throw new Error("Missing MONGO_URI in environment variables");
}

const client = new MongoClient(uri); // Define the client here

export async function getUserByEmail(email) {
  try {
    await client.connect();
    const database = client.db("shopaholic");
    const usersCollection = database.collection("users");
    console.log("Looking for user with email:", email); // Debug log

    const user = await usersCollection.findOne({ email });
    console.log("User found:", user); // Debug log
    return user;
  } catch (error) {
    console.error("Database error:", error); // Log database error
    throw error;
  } finally {
    await client.close();
  }
}
