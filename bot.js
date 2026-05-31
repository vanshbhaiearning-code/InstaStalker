require("dotenv").config();

const { Telegraf } = require("telegraf");

const connectDB =
require("./config/db");

const User =
require("./models/User");

const forceJoin =
require("./keyboards/forceJoin");

const mainMenu =
require("./keyboards/mainMenu");

const checkJoin =
require("./utils/checkJoin");

const askAI =
require("./services/openrouter");

const bot =
new Telegraf(
process.env.BOT_TOKEN
);

connectDB();

bot.start(async (ctx) => {

let user =
await User.findOne({
userId: ctx.from.id
});

if (!user) {

await User.create({
userId: ctx.from.id,
username: ctx.from.username,
firstName: ctx.from.first_name
});

}

const joined =
await checkJoin(ctx);

if (!joined) {

return ctx.reply(
"🔒 Please Join Channel First",
forceJoin
);

}

ctx.reply(
`🚀 Welcome ${ctx.from.first_name}`,
mainMenu
);

});

bot.action(
"verify",
async (ctx) => {

const joined =
await checkJoin(ctx);

if (!joined) {

return ctx.answerCbQuery(
"❌ Join Channel First"
);

}

ctx.editMessageText(
`🚀 Welcome ${ctx.from.first_name}`,
mainMenu
);

}
);

bot.action(
"profile",
async (ctx) => {

const user =
await User.findOne({
userId: ctx.from.id
});

ctx.reply(
`👤 Profile

ID: ${user.userId}

Premium:
${user.premium ? "Yes" : "No"}

Referrals:
${user.referrals}`
);

}
);

bot.action(
"caption_ai",
async (ctx) => {

ctx.reply(
"Send reel topic"
);

bot.once(
"message",
async (msgCtx) => {

const text =
msgCtx.message.text;

const result =
await askAI(
`Create viral instagram caption for ${text}`
);

msgCtx.reply(result);

}
);

}
);

bot.launch();
