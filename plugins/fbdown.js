const { cmd, commands } = require("../command");
const getFbVideoInfo = require("fb-downloader-scrapper");

cmd(
  {
    pattern: "fb",
    alias: ["facebook"],
    react: "💀",
    desc: "Download Facebook Video",
    category: "download",
    filename: __filename,
  },
  async (
    angle,
    mek,
    m,
    {
      from,
      quoted,
      body,
      isCmd,
      command,
      args,
      q,
      isGroup,
      sender,
      senderNumber,
      botNumber2,
      botNumber,
      pushname,
      isMe,
      isOwner,
      groupMetadata,
      groupName,
      participants,
      groupAdmins,
      isBotAdmins,
      isAdmins,
      reply,
    }
  ) => {
    try {
      if (!q) return reply("*Please provide a valid Facebook video URL!* 😑");

      // Validate the Facebook URL format
      const fbRegex = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/.+/;
      if (!fbRegex.test(q))
        return reply("*Invalid Facebook URL! Please check and try again.* 🌚");

      // Fetch video details
      reply("*Downloading your video...* ❤️");

      const result = await getFbVideoInfo(q);

      if (!result || (!result.sd && !result.hd)) {
        return reply("*Failed to download video. Please try again later.* 🌚");
      }

      const { title, sd, hd } = result;

      // Prepare and send the message with video details
      let desc = `
*❤️ ANGLE-X FB VIDEO DOWNLOADER ❤️*

👻 *Quality*: ${hd ? "HD Available" : "SD Only"}

Developer- Thinura_Nethz
        `;
      await angle.sendMessage(
        from,
        {
          image: {
            url: "https://raw.githubusercontent.com/Thinura-Nethz/bot-img/refs/heads/main/ChatGPT%20Image%20Jun%2013%2C%202025%2C%2004_35_42%20PM.png",
          },
          caption: desc,
        },
        { quoted: mek }
      );
      // Send the video if available
      if (hd) {
        await angle.sendMessage(
          from,
          { video: { url: hd }, caption: "----------HD VIDEO----------" },
          { quoted: mek }
        );
        await angle.sendMessage(
          from,
          { video: { url: sd }, caption: "----------SD VIDEO----------" },
          { quoted: mek }
        );
      } else if (sd) {
        await angle.sendMessage(
          from,
          { video: { url: sd }, caption: "----------SD VIDEO----------" },
          { quoted: mek }
        );
      } else {
        return reply("*No downloadable video found!* 👎");
      }

      return reply("*Thanks for using AngleX* ❤️");
    } catch (e) {
      console.error(e);
      reply(`*Error:* ${e.message || e}`);
    }
  }
);
