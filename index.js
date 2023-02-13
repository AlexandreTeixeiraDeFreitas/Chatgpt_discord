import { Client, GatewayIntentBits } from "discord.js";
import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import { Configuration, OpenAIApi } from "openai";
const app = express();
app.use(express.json());
app.get("/", async (req, res) => {
  return res.status(200).json({ success: true, message: "bienvenue sur le chatbox" });
});
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  allowedMentions: {
    repliedUser: false
  }
});
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY
});
const openai = new OpenAIApi(configuration);
client.on("ready", () => {
  console.log(`> ${client.user.username} is Online !!`);
});
client.on("messageCreate", async message => {
  if (!message.guild || message.author.bot) return;
  let chatBotChannelId = process.env.ID_SALON;
  let channel = message.guild.channels.cache.get(chatBotChannelId);
  if (!channel) return;
  if (message.channel.id === channel.id) {
    let msg = await message.reply({ content: `Waiting ....` });
    console.log(message.content);
      try {
        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `${message.content}`,
          temperature: 1,
          max_tokens: 2000,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0.1
        });
        console.log(response.data.choices[0].text);
        msg.edit({ content: `${response.data.choices[0].text}` });
      } catch (error) {
        console.error(error);
        msg.edit({ content: "Une erreur s'est produite lors de la réponse du bot." });
      }
  }
});
client.login(process.env.TOKEN_BOT);
