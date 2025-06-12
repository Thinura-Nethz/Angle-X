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
