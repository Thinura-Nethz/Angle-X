const { cmd, commands } = require("../command");
const yts = require("yt-search");
const { ytmp4 } = require("@vreden/youtube_scraper");

cmd(
  {
    pattern: "video",
    react: "🎬",
    desc: "Download Video",
    category: "download",
    filename: __filename,
  },
  async (
    robin,
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
      if (!q) return reply("*PLEASE PROVIDE LINK OR VIDEO NAME* 😑");

      // Search for the video
      const search = await yts(q);
      const data = search.videos[0];
      const url = data.url;

      // Song metadata description
      let desc = `
*ANGLE-X VIDEO DOWNLOADER*

👻 *Title* : ${data.title}
👻 *Description* : ${data.description}
👻 *Time* : ${data.timestamp}
👻 *Ago* : ${data.ago}
👻 *Views* : ${data.views}
👻 *Url* : ${data.url}


*Uploading Your Video....📤
Developer- *Thinura_Nethz*
`;

      // Send metadata thumbnail message
      await robin.sendMessage(
        from,
        { image: { url: data.thumbnail }, caption: desc },
        { quoted: mek }
      );

      // Download the audio using @vreden/youtube_scraper
      const quality = "128"; // Default quality
      const songData = await ytmp4(url, quality);

      // Validate song duration (limit: 30 minutes)
      let durationParts = data.timestamp.split(":").map(Number);
      let totalSeconds =
        durationParts.length === 3
          ? durationParts[0] * 3600 + durationParts[1] * 60 + durationParts[2]
          : durationParts[0] * 60 + durationParts[1];

      if (totalSeconds > 1800) {
        return reply("⏱️ video limit is 30 minitues");
      }


      // Send as a document (optional)
      await robin.sendMessage(
        from,
        {
          document: { url: songData.download.url },
          mimetype: "video/mp4",
          fileName: `${data.title}.mp4`,
          caption: "Developer- Thinura_Nethz",
        },
        { quoted: mek }
      );

      return reply("*Thanks for using AngleX* ❤️");
    } catch (e) {
      console.log(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
