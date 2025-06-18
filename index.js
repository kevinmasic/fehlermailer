import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/notify-error", async (req, res) => {
  const { message, timestamp } = req.body;

  const transporter = nodemailer.createTransport({
    host: "mail.gmx.net",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMX_USER,
      pass: process.env.GMX_PASS,
    },
  });

 const msg = {
  to: process.env.RECIPIENT,
  from: `"Gerätekataster Fehler" <${process.env.GMX_USER}>`,
  subject: "Fehlermeldung im Gerätekataster",
  text: `Es ist ein Fehler aufgetreten: ${errorMessage}`,
};

  try {
    await transporter.sendMail(mailOptions);
    console.log("Fehlerwarnung per Mail gesendet");
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Mail-Versandfehler:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Server läuft auf Port \${PORT}\`));
