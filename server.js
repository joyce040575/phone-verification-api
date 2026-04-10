const express = require("express");
const cors = require("cors");
require("dotenv").config();

const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(express.json());

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;

// 發送驗證碼
app.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    const result = await client.verify.v2
      .services(VERIFY_SERVICE_SID)
      .verifications.create({
        to: phone,
        channel: "sms"
      });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

// 驗證驗證碼
app.post("/verify-otp", async (req, res) => {
  try {
    const { phone, code } = req.body;

    const result = await client.verify.v2
      .services(VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: phone,
        code: code
      });

    if (result.status === "approved") {
await axios.post("https://script.google.com/macros/s/AKfycbzRP6WVw7zgw7-mrX4GT6jyVjngmzd1L4wB6Ca67h3DZONxJ9lfFI6o9rZ5j4IFbPXE/exec", {
  phone: phone,
  source: "Shop"
});
      return res.json({ success: true });
    }

    res.json({ success: false });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});