// pages/api/user.js
import { getUserByEmail } from "../../lib/database";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const email = req.query.email;
      console.log("Incoming email query:", email);
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const user = await getUserByEmail(email);
      console.log("User fetched from database:", user);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
