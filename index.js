import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: "mail.gmx.net",
  port: 587,
  secure: false, // TLS wird über STARTTLS aktiviert
  auth: {
    user: process.env.GMX_USER,
    pass: process.env.GMX_PASS,
  },
});

app.post("/send-error", async (req, res) => {
  const errorMessage = req.body.error || "Kein Fehler angegeben";

  const msg = {
    to: process.env.RECIPIENT,
    from: `"Gerätekataster Fehler" <${process.env.GMX_USER}>`,
    subject: "Fehlermeldung im Gerätekataster",
    text: `Es ist ein Fehler aufgetreten: ${errorMessage}`,
  };

  try {
    await transporter.sendMail(msg);
    res.status(200).send("Fehlermeldung gesendet.");
  } catch (err) {
    console.error("Fehler beim Senden der E-Mail:", err);
    res.status(500).send("Fehler beim Senden der E-Mail.");
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
