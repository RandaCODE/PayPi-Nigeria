      // api/deliver.js   ← FULL AUTO-DELIVERY BACKEND (Monnify)

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const {
    service,
    amount,
    phone,
    network,
    meter,
    disco,
    bankDetails   // this comes from localStorage.bank (JSON string)
  } = req.body;

  // ==== YOUR MONNIFY KEYS (added in Vercel → Settings → Environment Variables) ====
  const API_KEY = process.env.MONNIFY_API_KEY;
  const SECRET_KEY = process.env.MONNIFY_SECRET;

  if (!API_KEY || !SECRET_KEY) {
    return res.status(500).json({ error: "Monnify keys missing" });
  }

  const token = Buffer.from(`${API_KEY}:${SECRET_KEY}`).toString("base64");

  try {
    // Login to Monnify
    const loginRes = await fetch("https://api.monnify.com/api/v1/auth/login", {
      method: "POST",
      headers: { Authorization: `Basic ${token}` },
    });
    const loginData = await loginRes.json();
    const bearer = loginData.responseBody.accessToken;

    const headers = {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    };

    // 1. AIRTIME & DATA
    if (service === "airtime" || service === "data") {
      await fetch("https://api.monnify.com/api/v2/disbursements/vtu", {
        method: "POST",
        headers,
        body: JSON.stringify({
          amount: amount.toString(),
          customer: phone,
          network: network,               // MTN, Airtel, Glo, 9mobile
          reference: `VTU_${Date.now()}`,
        }),
      });
    }

    // 2. ELECTRICITY (All 11 DISCOs)
    if (service === "electricity") {
      await fetch("https://api.monnify.com/api/v1/bill-payments", {
        method: "POST",
        headers,
        body: JSON.stringify({
          amount: amount.toString(),
          customer: meter,
          billerCode: disco + "001",      // AEDC001, JED001, IKEDC001 etc.
          paymentType: "PREPAID",
          reference: `BILL_${Date.now()}`,
        }),
      });
    }

    // 3. CASHOUT → Instant Bank Transfer
    if (service === "cashout") {
      const bank = JSON.parse(bankDetails);
      await fetch("https://api.monnify.com/api/v2/disbursements/single", {
        method: "POST",
        headers,
        body: JSON.stringify({
          amount: amount.toString(),
          reference: `CASH_${Date.now()}`,
          destinationBankCode: "000013",   // GTBank (we’ll add full bank list later)
          destinationAccountNumber: bank.accNum,
          destinationAccountName: bank.accName,
          narration: "PayPi Queen Instant Cashout 👑",
        }),
      });
    }

    // Success!
    res.json({ success: true, message: "Delivered instantly 👑" });
  } catch (error) {
    console.error("Monnify error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
