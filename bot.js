const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs-extra");
const express = require("express");
const config = require("./config");

if (!config.TOKEN) {
  console.log("❌ TOKEN missing");
  process.exit(1);
}

const bot = new TelegramBot(config.TOKEN, { polling: true });

// ================= USERS =================
let users = {};
try {
  users = fs.readJsonSync("users.json");
} catch {
  users = {};
}

// SAVE
function save() {
  fs.writeJsonSync("users.json", users, { spaces: 2 });
}

// RANDOM USERNAME
function randomUser() {
  const names = ["riya", "rahul", "aman", "sneha", "rohit", "neha"];
  return `@${names[Math.floor(Math.random()*names.length)]}_${Math.floor(Math.random()*999)}`;
}

// PROGRESS
function progress(count) {
  return "█".repeat(count) + "░".repeat(3 - count);
}

// AI REPLY
function aiReply(text) {
  text = text.toLowerCase();

  if (text.includes("hi") || text.includes("hello"))
    return "👋 Hey! Ready to see who is checking your profile? 😏";

  if (text.includes("fake"))
    return "😏 Try karke dekho bro";

  return "😏 Interesting... pehle username bhejo 👇";
}

// JOIN CHECK
async function isJoined(id) {
  try {
    let m = await bot.getChatMember(config.CHANNEL, id);
    return ["member","administrator","creator"].includes(m.status);
  } catch {
    return false;
  }
}

// START
bot.onText(/\/start(.*)/, async (msg, match) => {
  let id = String(msg.chat.id); // 🔥 string me convert (important)
  let ref = match[1] ? match[1].trim() : null;

  // agar pehli baar user aa raha hai
  if (!users[id]) {
    users[id] = {
      invites: 0,
      referredBy: null,
      verified: false,
      lastUsed: 0,
      done: false
    };

    // ✅ REFERRAL LOGIC
    if (ref && ref !== id && users[ref]) {

      // 🔥 duplicate refer block
      if (!users[id].referredBy) {

        users[id].referredBy = ref;

        users[ref].invites += 1;

        // 🎉 referrer ko notify
        bot.sendMessage(ref,
`🎉 New user joined from your link!

🔥 Total invites: ${users[ref].invites}/3`);

        // 🔥 INSTANT UNLOCK
        if (users[ref].invites >= 3 && !users[ref].done) {
          users[ref].done = true;

          bot.sendMessage(ref,
`🎉 CONGRATS! UNLOCKED 🔥

❤️ ${randomUser()}
👀 ${randomUser()}
👀 ${randomUser()}`);
        }

        save();
      }
    }

    save();
  }

  // ================= JOIN CHECK =================
  if (!(await isJoined(id))) {
    return bot.sendMessage(id,
`🚫 Channel join karo first 👇
${config.CHANNEL}`, {
      reply_markup: {
        inline_keyboard: [[
          { text: "✅ Joined", callback_data: "join" }
        ]]
      }
    });
  }

  users[id].verified = true;
  save();

  bot.sendMessage(id,
`😳 Someone checked your profile!

Username bhejo 👇`);
});

// BUTTON
bot.on("callback_query", async (q) => {
  let id = q.message.chat.id;

  if (q.data === "join") {
    if (await isJoined(id)) {
      users[id].verified = true;
      save();
      bot.sendMessage(id, "✅ Verified! Username bhejo 👇");
    } else {
      bot.answerCallbackQuery(q.id, { text: "❌ Join first", show_alert: true });
    }
  }
});

// MESSAGE
bot.on("message", (msg) => {
  let id = msg.chat.id;
  let text = msg.text;

  if (!text) return;
  if (!users[id] || !users[id].verified) return;
  if (text.startsWith("/")) return;

  let user = users[id];

  if (!text.startsWith("@")) {
    return bot.sendMessage(id, aiReply(text));
  }

  let now = Date.now();
  if (now - user.lastUsed < 86400000) {
    return bot.sendMessage(id, "⏳ Kal try karo");
  }

  user.lastUsed = now;
  save();

  bot.sendMessage(id, "🔍 Scanning...");
  setTimeout(() => bot.sendMessage(id, "📊 Analyzing..."), 1500);
  setTimeout(() => bot.sendMessage(id, "👀 Finding viewers..."), 3000);

setTimeout(() => {
  let link = `https://t.me/${config.BOT_USERNAME}?start=${id}`;

  bot.sendMessage(id,
`🔥 1 Secret Admirer  
👀 2 Hidden Stalkers  

🔒 Unlock by inviting 3 friends 👇

${progress(user.invites)} (${user.invites}/3)`,
{
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "📤 Share Link",
          url: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=😳 Check who viewed your profile!`
        }
      ],
      [
        {
          text: "📲 Share on WhatsApp",
          url: `https://wa.me/?text=${encodeURIComponent("😳 Check who viewed your profile! " + link)}`
        }
      ]
    ]
  }
});
}, 4500);
});

// UNLOCK
setInterval(() => {
  for (let id in users) {
    if (users[id].invites >= 3 && !users[id].done) {
  users[id].done = true;

  bot.sendMessage(id,
`🎉 CONGRATS! UNLOCKED 🔥

❤️ ${randomUser()}
👀 ${randomUser()}
👀 ${randomUser()}

😏 More results tomorrow!`);

  save();
    }

      bot.sendMessage(id,
`🎉 UNLOCKED!

❤️ ${randomUser()}
👀 ${randomUser()}
👀 ${randomUser()}`);

      save();
    }
  }
}, 5000);

// ================= EXPRESS (Render fix) =================
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
