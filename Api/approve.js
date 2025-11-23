// /api/approve.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { paymentId } = req.body;

  // ←←← SAME KEY AS COMPLETE.JS
  const API_KEY = "sk_test_0697ec12140936d0d2cab2c0b4eb596bd25b2826305fbe04b12d25708800f998a0c052fc55dae83aac3f11cbd9f6616f2ca5648a552083fcf23c0dacb0eec42b";

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      console.log("Approved:", paymentId);
      res.status(200).json({ success: true });
    } else {
      const errorText = await response.text();
      console.error("Approve failed:", errorText);
      res.status(400).json({ error: errorText });
    }
  } catch (e) {
    console.error("Approve error:", e);
    res.status(500).json({ error: e.message });
  }
}
