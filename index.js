const qrcode = require("qrcode-terminal");
const {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  makeCacheableSignalKeyStore,
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const fs = require("fs");

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

  // 🔁 Command-style reply system
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const sender = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    if (!text) return;

    const command = text.trim().toLowerCase();

    switch (command) {
      case "!hi":
        await sock.sendMessage(sender, {
          text: "👋 Hello! I'm Angle X. How can I assist you?",
        });
        break;

      case "!about":
        await sock.sendMessage(sender, {
          text: "🤖 Angle X is a WhatsApp bot built using Baileys library by Thinura.",
        });
        break;

      case "!owner":
        await sock.sendMessage(sender, {
          text: "👤 Bot Owner: Thinura\n📞 Contact: +94 77 457 1418",
        });
        break;

      case "!help":
        await sock.sendMessage(sender, {
          text:
            "📖 *Angle X Command List:*\n" +
            "• `!hi` - Say hello\n" +
            "• `!about` - Learn about the bot\n" +
            "• `!owner` - Get owner contact\n" +
            "• `!help` - Show this help menu",
        });
        break;

      default:
        if (command.startsWith("!")) {
          await sock.sendMessage(sender, {
            text: "❓ Unknown command. Type `!help` to see available commands.",
          });
        }
        break;
    }
  });
}

startBot();
