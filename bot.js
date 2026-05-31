require("dotenv").config();

const { Telegraf } = require("telegraf");
const mongoose = require("mongoose");

const bot = new Telegraf(process.env.BOT_TOKEN);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Mongo Connected"))
.catch(console.error);

bot.start(async (ctx) => {

const keyboard = {
reply_markup: {
inline_keyboard: [
[
{ text: "🚀 Instagram Toolkit", callback_data: "toolkit" }
],
[
{ text: "🤖 AI Tools", callback_data: "ai" }
],
[
{ text: "👤 Profile", callback_data: "profile" }
],
[
{ text: "⭐ Premium", callback_data: "premium" }
]
]
}
};

ctx.reply(
`🔥 Welcome ${ctx.from.first_name}

Instagram Toolkit + AI Bot`,
keyboard
);

});

bot.action("toolkit", async (ctx) => {

ctx.editMessageText(
`🚀 Instagram Toolkit

📥 Reel Downloader
📸 Story Downloader
🖼 DP Downloader
📝 Caption Generator
#️⃣ Hashtag Generator`
);

});

bot.action("ai", async (ctx) => {

ctx.editMessageText(
`🤖 AI Tools

✨ Viral Caption AI
🔥 Reel Idea AI
👤 Bio AI
📅 Content Planner`
);

});

bot.action("profile", async (ctx) => {

ctx.editMessageText(
`👤 Profile

ID: ${ctx.from.id}
Name: ${ctx.from.first_name}`
);

});

bot.action("premium", async (ctx) => {

ctx.editMessageText(
`⭐ Premium Plans

Unlimited AI
Unlimited Downloads
Premium Features`
);

});

bot.launch();
