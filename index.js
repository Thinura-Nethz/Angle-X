const qrcode = require('qrcode-terminal');
const {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  makeCacheableSignalKeyStore
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const fs = require("fs");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");

  const sock = makeWASocket({
    version: await fetchLatestBaileysVersion(),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, fs),
    },
    browser: ["Ubuntu", "Chrome", "22.04.4"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("\n🔐 Scan this QR with your WhatsApp mobile app:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;

      if (reason === DisconnectReason.loggedOut) {
        console.log("❌ Bot logged out. Delete auth_info and re-authenticate.");
      } else {
        console.log("🔁 Connection closed. Reconnecting...");
        startBot();
      }
    }

    if (connection === "open") {
      console.log("✅ Angle X is connected to WhatsApp!");
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    if (text?.toLowerCase() === "hi") {
      await sock.sendMessage(msg.key.remoteJid, { text: "Hello! I'm Angle X 🤖" });
    }
  });
}

startBot();
