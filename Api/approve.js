// /api/approve.js
export default async function handler(req, res) {Welcome to Gboard clipboard, any text you copy will be saved here.
  if (req.method !== "POST") return res.status(405).end();

  const { paymentId } = req.body;

  // ←←← SAME KEY AS COMPLETE.JS
  const API_KEY = "sk_live_your_full_key_here_no_quotes_around_this_line";

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
}Welcome to Gboard clipboard, any text you copy will be saved here.Tap on a clip to paste it in the text box.Welcome to Gboard clipboard, any text you copy will be saved here.Tap on a clip to paste it in the text box.Welcome to Gboard clipboard, any text you copy will be saved here.
