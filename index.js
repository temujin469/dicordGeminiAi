import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import express from "express";

import { Client, GatewayIntentBits, Events } from "discord.js";

const app = express();

const apiKey = process.env.API_KEY;
const discordToken = process.env.DISCORD_TOKEN;



// const commands = [
//     {
//       name: 'ping',
//       description: 'Replies with Pong!',
//     },
//   ];

//   const rest = new REST({ version: '10' }).setToken(discordToken);

//   try {
//     console.log('Started refreshing application (/) commands.');

//     await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

//     console.log('Successfully reloaded application (/) commands.');
//   } catch (error) {
//     console.error(error);
//   }

const genAi = new GoogleGenerativeAI(apiKey);

// client instance
const client = new Client({
  intents: [
    "Guilds",
    "GuildMembers",
    "GuildMessages",
    "MessageContent",
    "GuildMessageReactions",
    "GuildMessageTyping",
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const model = genAi.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  systemInstruction:
    "You are an AI avatar with a friendly and humorous personality, dedicated to assisting the Zenith community on Discord—a motivational space for inspiring and empowering cool individuals. Your role is to engage with and support members by providing uplifting, accurate, and helpful responses in Mongolian, while maintaining a positive and encouraging tone aligned with Zenith's mission to inspire greatness. In every prompt, `<@userId>` refers to the username or display name of the user. Always address the user directly using this format in your responses to make interactions personalized and engaging. For example, if the user ID is `<@763696975190818837>`, your response should include it, such as: 'Сайн байна уу, <@763696975190818837>! Өдрийн мэнд хүргэе!' Ensure your responses are warm, supportive, and aligned with the Zenith community’s motivational values. When no prior context exists, focus on the user’s current message while always addressing them by their `<@userId>` to maintain personalization.",
});

// function fileToGenerativePart(path, mimeType) {
//   return {
//     inlineData: {
//       data: Buffer.from(fs.readFileSync(path)).toString("base64"),
//       mimeType,
//     },
//   };
// }

// const imagePart = fileToGenerativePart("/path/to/image.png", "image/png");

const IGNORE_PREPIX = "!";
const CHANNELS = [
  "1315459852117479550",
  //   "1315459852117479546",
  "1324238294778773579",
];

const chat = model.startChat({
    history: [],
  });

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith(IGNORE_PREPIX)) return;

  if (
    !CHANNELS.includes(message.channelId) &&
    !message.mentions.users.has(client.user.id)
  )
    return;

  // console.log("irsen message", message);

  //   console.log(client.user);

  await message.channel.sendTyping();


  //   const result = await model
  //     .generateContent({
  //       contents: [
  //         {
  //           role: "user",
  //           parts: [
  //             {
  //               text: message.content,
  //             },
  //           ],
  //         },
  //       ],
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       message.reply("Алдаа гарлаа. temuujing duud");
  //     });

//   const userInfo = {
//     id: message.author.id,
//     username: message.author.username,
//     name: message.author.globalName,
//   };

  const prompt = `<@${JSON.stringify(message.author.id)}> ${message.content}`;

  const result = await chat.sendMessage(prompt);

  console.log(JSON.stringify(message.author.id));

  //   const history = await chat.params.history;

  //   console.log(history);

  if (!result) return;

  message.reply(result.response.text());
  console.log(result.response.text());
});

client.login(discordToken);
// run server

const PORT = process.env.PORT || 3000;

app.get("/", (req,res)=>{
    res.json("Amjilttai ajillaj baina");
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
