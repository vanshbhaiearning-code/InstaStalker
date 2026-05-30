const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs-extra");
const config = require("./config");

const bot = new TelegramBot(config.TOKEN, { polling: true });

let users = fs.readJsonSync("users.json");

// SAVE
function save() {
  fs.writeJsonSync("users.json", users, { spaces: 2 });
}

// RANDOM USERNAME
function randomUser() {
  const names = ["riya", "rahul", "aman", "sneha", "rohit", "neha"];
  return `@${names[Math.floor(Math.random()*names.length)]}_${Math.floor(Math.random()*999)}`;
}

// PROGRESS BAR
function progress(count) {
  return "█".repeat(count) + "░".repeat(3 - count);
}

// AI REPLY SYSTEM
function aiReply(text) {
  text = text.toLowerCase();

  if (text.includes("hi") || text.includes("hello"))
    return "👋 Hey! Ready to see who is secretly checking your profile? 😏";

  if (text.includes("fake"))
    return "😏 Sab log pehle aisa hi bolte hain... try karke dekho";

  if (text.includes("kaise ho"))
    return "🔥 Full active hoon! Tum batao, kisi ne profile check ki kya? 👀";

  if (text.includes("love") || text.includes("crush"))
    return "❤️ Lagta hai koi special hai... check karna chahoge? 😳";

  return "😏 Interesting... but pehle apna profile scan karo 👇";
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
  let id = msg.chat.id;
  let ref = match[1].trim();

  if (!users[id]) {
    users[id] = {
      invites: 0,
      verified: false,
      lastUsed: 0
    };

    if (ref && users[ref] && ref != id) {
      users[ref].invites++;
    }

    save();
  }

  if (!(await isJoined(id))) {
    return bot.sendMessage(id,
`🚫 Channel join karo first 👇
${config.CHANNEL}`, {
      reply_markup: {
        inline_keyboard: [[{ text: "✅ Joined", callback_data: "join" }]]
      }
    });
  }

  users[id].verified = true;
  save();

  bot.sendMessage(id,
`😳 Someone checked your profile!

Enter your username 👇`);
});

// BUTTON
bot.on("callback_query", async (q) => {
  let id = q.message.chat.id;

  if (q.data === "join") {
    if (await isJoined(id)) {
      users[id].verified = true;
      save();
      bot.sendMessage(id, "✅ Verified!\nSend username 👇");
    } else {
      bot.answerCallbackQuery(q.id, { text: "❌ Join first", show_alert: true });
    }
  }
});

// MAIN MESSAGE HANDLER
bot.on("message", (msg) => {
  let id = msg.chat.id;
  let text = msg.text;

  if (!users[id] || !users[id].verified) return;
  if (text.startsWith("/")) return;

  let user = users[id];

  // AI CHAT
  if (!text.startsWith("@")) {
    return bot.sendMessage(id, aiReply(text));
  }

  // DAILY LIMIT
  let now = Date.now();
  if (now - user.lastUsed < 86400000) {
    return bot.sendMessage(id, "⏳ Kal fir try karo");
  }

  user.lastUsed = now;
  save();

  bot.sendMessage(id, "🔍 Scanning profile...");
  setTimeout(() => bot.sendMessage(id, "📊 Analyzing data..."), 1500);
  setTimeout(() => bot.sendMessage(id, "👀 Finding hidden viewers..."), 3000);

  setTimeout(() => {
    bot.sendMessage(id,
`🔥 1 Secret Admirer  
👀 2 Hidden Stalkers  

🔒 Unlock names 👇`);

    let link = `https://t.me/${config.BOT_USERNAME}?start=${id}`;

    bot.sendMessage(id,
`Invite 3 friends:

${progress(user.invites)} (${user.invites}/3)

${link}`);
  }, 4500);
});

// UNLOCK
setInterval(() => {
  for (let id in users) {
    if (users[id].invites >= 3 && !users[id].done) {
      users[id].done = true;

      bot.sendMessage(id,
`🎉 UNLOCKED!

❤️ ${randomUser()}
👀 ${randomUser()}
👀 ${randomUser()}`);

      save();
    }
  }
}, 5000);

// REMINDER
setInterval(() => {
  for (let id in users) {
    if (!users[id].done && users[id].invites > 0) {
      bot.sendMessage(id, "⏳ Complete invites to unlock results!");
    }
  }
}, 600000);

// ADMIN
bot.onText(/\/stats/, (msg) => {
  if (msg.chat.id != config.ADMIN) return;

  bot.sendMessage(msg.chat.id,
`👥 Users: ${Object.keys(users).length}`);
});
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

// 👇 Tera existing bot code
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Bot working 🚀");
});


// ==========================
// 🔥 YE CODE Niche Add Karna
// ==========================

const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
