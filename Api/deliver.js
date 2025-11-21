// api/deliver.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { service, amount, phone, network, meter, disco, bankDetails } = req.body;

  // Your Monnify keys (we'll add them safely in step 6)
  const API_KEY = process.env.MONNIFY_API_KEY;
  const SECRET_KEY = process.env.MONNIFY_SECRET;

  const token = Buffer.from(`${API_KEY}:${SECRET_KEY}`).toString('base64');

  try {
    const login = await fetch("https://api.monnify.com/api/v1/auth/login/", {
      method: "POST",
      headers: { Authorization: `Basic ${token}` }
    });
    const { responseBody } = await login.json();
    const bearer = responseBody.accessToken;

    if (service === "airtime" || service === "data") {
      await fetch("https://api.monnify.com/api/v2/disbursements/vtu", {
        method: "POST",
        headers: { Authorization: `Bearer ${bearer}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount.toString(),
          customer: phone,
          network: network,
          reference: "PAYPI"+Date.now()
        })
      });
    }

    if (service === "electricity") {
      await fetch("https://api.monnify.com/api/v1/bill-payments", {
        method: "POST",
        headers: { Authorization: `Bearer ${bearer}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount.toString(),
          customer: meter,
          paymentType: "PREPAID",
          billerCode: disco === "JED" ? "JED001" : disco + "001", // works for all
          reference: "BILL"+Date.now()
        })
      });
    }

    if (service === "cashout") {
      const bank = JSON.parse(bankDetails);
      await fetch("https://api.monnify.com/api/v2/disbursements/single", {
        method: "POST",
        headers: { Authorization: `Bearer ${bearer}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount.toString(),
          reference: "CASH"+Date.now(),
          destinationBankCode: "000013", // GTB example (we’ll upgrade later)
          destinationAccountNumber: bank.accNum,
          destinationAccountName: bank.accName,
          narration: "PayPi Queen Instant Cashout"
        })
      });
    }

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed" });
  }
}
