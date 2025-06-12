const pino = require("pino");

// Custom logger with trace method
const logger = pino({ level: "info" });
logger.trace = logger.debug;  // alias trace to debug

const sock = makeWASocket({
  version,
  logger: logger,
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
    const sender = msg.key.remoteJid;

    if (!text) return;

    // Command-style message
    if (text.startsWith("!")) {
      const command = text.slice(1).trim().toLowerCase();

      switch (command) {
        case "hi":
          await sock.sendMessage(sender, { text: "👋 Hello! I'm Angle X. How can I assist you?" });
          break;
        case "help":
          await sock.sendMessage(sender, {
            text: `📖 *Angle X Bot Commands:*\n\n!hi - Say Hello\n!help - Show this help\n!about - Info about this bot`,
          });
          break;
        case "about":
          await sock.sendMessage(sender, {
            text: `🤖 *Angle X*\nCreated by Thinura Nethz\nGitHub: https://github.com/Thinura-Nethz/Angle-X`,
          });
          break;
        default:
          await sock.sendMessage(sender, { text: `❌ Unknown command: *${command}*` });
      }
    }
  });
}

startBot();
