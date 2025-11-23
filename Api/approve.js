// /api/approve.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { paymentId } = req.body;

  // Your Pi App Credentials (get from https://developers.pi.network/dashboard/)
  const APP_ID = "your-app-id-here";           // ← change
  const API_KEY = const API_KEY = process.env.PI_API_KEY;;  // ← change (keep secret!)

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      res.status(200).json({ approved: true });
    } else {
      res.status(400).json({ error: "Approval failed" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
