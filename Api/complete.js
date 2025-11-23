// /api/complete.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { paymentId, txid } = req.body;

  const API_KEY = "your-secret-api-key-here";  // ← same as above

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ txid })
    });

    if (response.ok) {
      const data = await response.json();
      // HERE YOU DELIVER AIRTIME / DATA / CASHOUT
      console.log("Payment completed!", data);
      res.status(200).json({ completed: true });
    } else {
      res.status(400).json({ error: "Completion failed" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
