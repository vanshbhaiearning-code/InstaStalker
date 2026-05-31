module.exports = async (ctx) => {

const member =
await ctx.telegram.getChatMember(
process.env.CHANNEL_USERNAME,
ctx.from.id
);

return [
"member",
"administrator",
"creator"
].includes(member.status);

};
