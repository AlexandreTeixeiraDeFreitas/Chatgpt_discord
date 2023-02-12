import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from 'dotenv'
dotenv.config();
// import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  allowedMentions: {
    repliedUser: false,
  },});

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
  });
  const openai = new OpenAIApi(configuration);

client.on("ready", () => {
  console.log(`> ${client.user.username} is Online !!`);
});

client.on("messageCreate", async (message) => {
    if (!message.guild || message.author.bot) return;
    let ChatBotChannelId = "1074386079047762011";
    let channel = message.guild.channels.cache.get(ChatBotChannelId);
    if (!channel) return;
    if (message.channel.id === channel.id) {
      let msg = await message.reply({
        content: `Waiting ....`,
      });
      console.log(message.content);
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${message.content}`,
        temperature: 1,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        // stop: [" Human:", " AI:"],
      });
      console.log(response.data.choices);
      msg.edit({
        content: `${response.data.choices[0].text}`,
      });
    }
  });

client.login(process.env.TOKEN_BOT);