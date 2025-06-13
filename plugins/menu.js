const { readEnv } = require("../lib/database");
const { cmd, commands } = require("../command");

cmd(
  {
    pattern: "menu",
    alise: ["getmenu"],
    react:"📜",
    desc: "get cmd list",
    category: "main",
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
      const config = await readEnv();
      let menu = {
        main: "",
        download: "",
        group: "",
        owner: "",
        convert: "",
        search: "",
      };

      for (let i = 0; i < commands.length; i++) {
        if (commands[i].pattern && !commands[i].dontAddCommandList) {
          menu[
            commands[i].category
          ] += `${config.PREFIX}${commands[i].pattern}\n`;
        }
      }

      let madeMenu = `👋 *Hello ${pushname}* *I'M AngleX Whatsapp Bot now i'm Ready to Assist You*


| *MAIN COMMANDS* |
    ▫️.alive 👀
    ▫️.menu 📜
    ▫️.ai <text> 😇
    ▫️.system ⚡
    ▫️.owner 🙄
| *DOWNLOAD COMMANDS* |
    ▫️.song <text> 🎶
    ▫️.video <text> 🎬 
    ▫️.fb <link> 📘
| *GROUP COMMANDS* |
${menu.group}
| *OWNER COMMANDS* |
    ▫️.restart 🔁
    ▫️.update ↪⏯
| *CONVERT COMMANDS* |
    ▫️.sticker <reply img> 💨
    ▫️.img <reply sticker> 🏷
    ▫️.tr <lang><text> 🧬
    ▫️.tts <text> ❄
| *SEARCH COMMANDS* |
${menu.search}


🥶Developer-Thinura_Nethz🥶

> ANGLE-X MENU MSG
`;
      await angle.sendMessage(
        from,
        {
          image: {
            url: "https://raw.githubusercontent.com/Thinura-Nethz/bot-img/refs/heads/main/ChatGPT%20Image%20Jun%2013%2C%202025%2C%2004_35_42%20PM.png",
          },
          caption: madeMenu,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.log(e);
      reply(`${e}`);
    }
  }
);
