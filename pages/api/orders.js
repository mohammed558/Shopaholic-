import { getOrdersForUser } from "../../lib/database";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Fetch order history for the logged-in user
    try {
      const userId = req.query.userId; // Assume userId is passed as a query parameter
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const orders = await getOrdersForUser(userId); // Fetch orders for the user
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}