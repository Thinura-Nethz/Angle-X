// index.js

const path = require("path");
const fs = require("fs");
const qrcode = require("qrcode-terminal");
const {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  makeCacheableSignalKeyStore,
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const { createCanvas } = require("canvas");

async function generateImage() {
  const width = 400;
  const height = 200;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // White background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Draw green check mark
  ctx.strokeStyle = "#228B22"; // ForestGreen
  ctx.lineWidth = 15;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(100, 120);
  ctx.lineTo(140, 160);
  ctx.lineTo(280, 50);
  ctx.stroke();

  // Add text
  ctx.fillStyle = "#000000";
  ctx.font = "20px Arial";
  ctx.fillText("Successfully Connected to WhatsApp", 20, 140);

  // Save to file
  const buffer = canvas.toBuffer("image/png");
  const filePath = path.join(__dirname, "connected.png");
  fs.writeFileSync(filePath, buffer);
  console.log("Image generated:", filePath);
  return filePath;
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");

  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, fs),
    },
    browser: ["Ubuntu", "Chrome", "22.04.4"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("\n🔐 Scan this QR with your WhatsApp mobile app:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;

      if (reason === DisconnectReason.loggedOut) {
        console.log(
          "❌ Bot logged out. Delete auth_info folder and re-authenticate."
        );
      } else {
        console.log("🔁 Connection closed. Reconnecting...");
        startBot();
      }
    }

    if (connection === "open") {
      console.log("✅ Successfully Connected to WhatsApp!");

      const jid = "94774571418@s.whatsapp.net"; // target WhatsApp number

      // Generate image
      const imagePath = await generateImage();

      // Send image with caption
      await sock.sendMessage(jid, {
        image: { url: imagePath },
        caption: "✅ Successfully Connected to WhatsApp!",
      });
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const text =
      msg.message.conversation || msg.message.extendedTextMessage?.text;
    if (text?.toLowerCase() === "hi") {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "Hello! I'm Angle X 🤖",
      });
    }
  });
}

startBot();
