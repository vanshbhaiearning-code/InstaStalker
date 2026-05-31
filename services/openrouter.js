const axios = require("axios");

async function askAI(prompt) {

const res = await axios.post(
"https://openrouter.ai/api/v1/chat/completions",
{
model: "openai/gpt-4o-mini",
messages: [
{
role: "user",
content: prompt
}
]
},
{
headers: {
Authorization:
`Bearer ${process.env.OPENROUTER_API_KEY}`,
"Content-Type": "application/json"
}
}
);

return res.data.choices[0].message.content;

}

module.exports = askAI;
