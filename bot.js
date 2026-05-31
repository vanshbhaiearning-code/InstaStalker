const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs-extra");
const express = require("express");
const config = require("./config");

const bot = new TelegramBot(config.TOKEN, { polling: true });

// ================= USERS =================
let users = {};
try {
  users = fs.readJsonSync("users.json");
} catch {
  users = {};
}

function save() {
  fs.writeJsonSync("users.json", users, { spaces: 2 });
}

// ================= JOIN CHECK =================
async function isJoined(id) {
  try {
    let res = await bot.getChatMember(config.CHANNEL, id);
    return ["member", "administrator", "creator"].includes(res.status);
  } catch {
    return false;
  }
}

// ================= START =================
bot.onText(/\/start(.*)/, async (msg, match) => {
  let id = String(msg.chat.id);
  let ref = match[1] ? match[1].trim() : null;

  // USER CREATE
  if (!users[id]) {
    users[id] = {
      invites: 0,
      referredBy: null,
      verified: false,
      done: false
    };

    // ===== REFERRAL =====
    if (ref && ref !== id && users[ref]) {
      if (!users[id].referredBy) {
        users[id].referredBy = ref;

        users[ref].invites++;

        bot.sendMessage(ref,
`🎉 New Referral Joined!

🔥 Total: ${users[ref].invites}/3`);

        // UNLOCK
        if (users[ref].invites >= 3 && !users[ref].done) {
          users[ref].done = true;

          bot.sendMessage(ref,
`🎉 UNLOCKED!

👀 @user123
👀 @user456
👀 @user789`);
        }
      }
    }

    save();
  }

  // ===== UI MESSAGE =====
  if (!(await isJoined(id))) {
    return bot.sendPhoto(id,
"https://i.ibb.co/0jQ5Z6V/gift.png",
{
  caption:
`🎁 Welcome To ClaimKart Bot

⚡ Vouchers Gifts Code  
🔐 Secure Access System  
🎮 Easy To Use  

📢 Join Channel To Continue`,
  reply_markup: {
    inline_keyboard: [
      [{ text: "📢 Join Channel", url: `https://t.me/${config.CHANNEL.replace("@","")}` }],
      [{ text: "🚀 Join Updates", url: `https://t.me/${config.CHANNEL.replace("@","")}` }],
      [{ text: "✅ Verify", callback_data: "verify" }]
    ]
  }
});
  }

  users[id].verified = true;
  save();

  bot.sendMessage(id, "✅ Verified!\n\nSend username 👇");
});

// ================= VERIFY BUTTON =================
bot.on("callback_query", async (q) => {
  let id = String(q.message.chat.id);

  if (q.data === "verify") {
    if (await isJoined(id)) {
      users[id].verified = true;
      save();

      bot.sendMessage(id, "✅ Verified Successfully!\n\nSend username 👇");
    } else {
      bot.answerCallbackQuery(q.id, {
        text: "❌ Pehle channel join karo",
        show_alert: true
      });
    }
  }
});

// ================= MAIN =================
bot.on("message", (msg) => {
  let id = String(msg.chat.id);
  let text = msg.text;

  if (!text) return;
  if (!users[id] || !users[id].verified) return;
  if (text.startsWith("/")) return;

  if (!text.startsWith("@")) {
    return bot.sendMessage(id, "😏 Username bhejo like @yourname");
  }

  let link = `https://t.me/${config.BOT_USERNAME}?start=${id}`;

  bot.sendMessage(id,
`🔥 1 Secret Admirer  
👀 2 Hidden Stalkers  

🔒 Invite 3 friends to unlock

${users[id].invites}/3`,
{
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "📤 Share",
          url: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=😳 Check this bot`
        }
      ]
    ]
  }
});
});

// ================= EXPRESS =================
const app = express();

app.get("/", (req, res) => {
  res.send("Bot Running 🚀");
});

app.listen(process.env.PORT || 3000);
