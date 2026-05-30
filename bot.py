import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton
import random
import time

TOKEN = "8615004462:AAF1YmbE0-NWSWPPp6Bpvpr6DpRKYoaXKAk"

bot = telebot.TeleBot(TOKEN)

CHANNEL_1 = "@latestmodsapks"
CHANNEL_2 = "@latestmodsapp"

WELCOME_IMAGE = "https://i.imgur.com/8Km9tLL.png"

flipkart_codes = [
    ("FK-82JS-91KQ", "483726"),
    ("FK-1ASD-9KLM", "817263"),
    ("FK-XX12-ZQWE", "918273")
]

amazon_codes = [
    ("AMZ-9QWE-1ZXC", "726352"),
    ("AMZ-7TYU-4BNM", "182736"),
    ("AMZ-5JKL-2POI", "918273")
]

play_codes = [
    "ABCD-EFGH-IJKL-MNOP",
    "QWER-TYUI-OPAS-DFGH",
    "ZXCV-BNMK-LQWE-RTYU"
]

# ================= START =================

@bot.message_handler(commands=['start'])
def start(message):

    keyboard = InlineKeyboardMarkup(row_width=1)

    keyboard.add(
        InlineKeyboardButton(
            "📢 Join Channel",
            url=f"https://t.me/{CHANNEL_1.replace('@','')}"
        )
    )

    keyboard.add(
        InlineKeyboardButton(
            "🚀 Join Updates",
            url=f"https://t.me/{CHANNEL_2.replace('@','')}"
        )
    )

    keyboard.add(
        InlineKeyboardButton(
            "✅ Verify Access",
            callback_data="verify"
        )
    )

    caption = """
🎁 Welcome To ClaimKart Bot

⚡  Free Gift Center
🔒 Secure Access System
🎮 Invite Freind & Get More

📢 Join Channels To Continue
"""

    bot.send_photo(
        message.chat.id,
        WELCOME_IMAGE,
        caption=caption,
        reply_markup=keyboard
    )

# ================= VERIFY =================

@bot.callback_query_handler(func=lambda call: call.data == "verify")
def verify(call):

    user_id = call.from_user.id

    try:
        ch1 = bot.get_chat_member(CHANNEL_1, user_id)
        ch2 = bot.get_chat_member(CHANNEL_2, user_id)

        if ch1.status in ['member', 'administrator', 'creator'] and ch2.status in ['member', 'administrator', 'creator']:

            msg = bot.send_message(
                call.message.chat.id,
                "🔄 Verifying User...

▓▓░░░░░░ 20%"
            )

            time.sleep(1)

            bot.edit_message_text(
                "🔄 Verifying User...

▓▓▓▓▓░░░ 60%",
                call.message.chat.id,
                msg.message_id
            )

            time.sleep(1)

            bot.edit_message_text(
                "✅ Verification Successful

▓▓▓▓▓▓▓▓ 100%",
                call.message.chat.id,
                msg.message_id
            )

            keyboard = InlineKeyboardMarkup(row_width=2)

            keyboard.add(
                InlineKeyboardButton("🎁 Get Free Codes", callback_data="gifts")
            )

            keyboard.add(
                InlineKeyboardButton("🎉 Daily Reward", callback_data="daily"),
                InlineKeyboardButton("👥 Refer & Earn", callback_data="refer")
            )

            caption = """
🎉 Verification Successful

🎁 Welcome To ClaimKart Bot

🛒 Premium Vouchers
🎮 Sample Redeem Codes
⚡ Premium Gift Center

⚠️  Verified & Secure 2024@
"""

            bot.send_photo(
                call.message.chat.id,
                WELCOME_IMAGE,
                caption=caption,
                reply_markup=keyboard
            )

        else:
            bot.answer_callback_query(
                call.id,
                "❌ Join all channels first"
            )

    except:
        bot.answer_callback_query(
            call.id,
            "⚠️ Verification Error"
        )

# ================= GIFT MENU =================

@bot.callback_query_handler(func=lambda call: call.data == "gifts")
def gifts(call):

    bot.send_message(
        call.message.chat.id,
        "🎁 Opening Gift Center..."
    )

    keyboard = InlineKeyboardMarkup(row_width=1)

    keyboard.add(
        InlineKeyboardButton("🛒 Flipkart Voucher", callback_data="flipkart")
    )

    keyboard.add(
        InlineKeyboardButton("📦 Amazon Voucher", callback_data="amazon")
    )

    keyboard.add(
        InlineKeyboardButton("🎮 Reedem Code", callback_data="play")
    )

    bot.send_photo(
        call.message.chat.id,
        WELCOME_IMAGE,
        caption="🎁 Select Gift Category",
        reply_markup=keyboard
    )

# ================= FLIPKART =================

@bot.callback_query_handler(func=lambda call: call.data == "flipkart")
def flipkart(call):

    code, pin = random.choice(flipkart_codes)

    keyboard = InlineKeyboardMarkup(row_width=2)

    keyboard.add(
        InlineKeyboardButton("🔄 Generate New", callback_data="flipkart")
    )

    text = f"""
🛒 Flipkart Voucher

━━━━━━━━━━━━━━
Code : {code}
Pin  : {pin}
━━━━━━━━━━━━━━

⚠️ Refer & Earn Big 
"""

    bot.send_message(
        call.message.chat.id,
        text,
        reply_markup=keyboard
    )

# ================= AMAZON =================

@bot.callback_query_handler(func=lambda call: call.data == "amazon")
def amazon(call):

    code, pin = random.choice(amazon_codes)

    keyboard = InlineKeyboardMarkup(row_width=2)

    keyboard.add(
        InlineKeyboardButton("🔄 Generate New", callback_data="amazon")
    )

    text = f"""
📦 Amazon Voucher

━━━━━━━━━━━━━━
Code : {code}
Pin  : {pin}
━━━━━━━━━━━━━━

⚠️ Refer & Earn Big Codes
"""

    bot.send_message(
        call.message.chat.id,
        text,
        reply_markup=keyboard
    )

# ================= PLAY STORE =================

@bot.callback_query_handler(func=lambda call: call.data == "play")
def play(call):

    code = random.choice(play_codes)

    keyboard = InlineKeyboardMarkup(row_width=2)

    keyboard.add(
        InlineKeyboardButton("🔄 Generate New", callback_data="play")
    )

    text = f"""
🎮 Redeem Code

━━━━━━━━━━━━━━
{code}
━━━━━━━━━━━━━━

⚠️ Refer & Earn Big Reedem
"""

    bot.send_message(
        call.message.chat.id,
        text,
        reply_markup=keyboard
    )

# ================= DAILY =================

@bot.callback_query_handler(func=lambda call: call.data == "daily")
def daily(call):

    bot.send_message(
        call.message.chat.id,
        "🎉 Daily Reward Claimed

💎 +10 Points Added"
    )

# ================= REFER =================

@bot.callback_query_handler(func=lambda call: call.data == "refer")
def refer(call):

    username = bot.get_me().username

    link = f"https://t.me/{username}?start={call.from_user.id}"

    bot.send_message(
        call.message.chat.id,
        f"👥 Refer Friends & Earn Points

🔗 Your Referral Link:
{link}"
    )

print("🎁 ClaimKart Bot Running...")
bot.infinity_polling()