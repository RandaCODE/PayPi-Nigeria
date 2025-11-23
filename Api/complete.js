// /api/complete.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { paymentId, txid } = req.body;

  // ←←← PUT YOUR REAL KEY HERE (copy from Validation-key.txt) ↓↓↓
  const API_KEY = 0697ec12140936d0d2cab2c0b4eb596bd25b2826305fbe04b12d25708800f998a0c052fc55dae83aac3f11cbd9f6616f2ca5648a552083fcf23c0dacb0eec42b;

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
      console.log("Payment completed!", paymentId, txid);
      res.status(200).json({ success: true });
    } else {
      const errorText = await response.text();
      console.error("Complete failed:", errorText);
      res.status(400).json({ error: errorText });
    }
  } catch (e) {
    console.error("Complete error:", e);
    res.status(500).json({ error: e.message });
  }
}
