import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import axios from "axios";
import { deeplClient } from "./config/deepl.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message:
      "This is virtual assistant server url, please visit https://lingua-latvia.vercel.app/ to see the app",
  });
});

app.post("/", async (req, res) => {
  try {
    console.log("🔍 Request Body:", req.body); // ✅ Log the request body

    // Check if the request body is empty
    const result = await deeplClient.translateText(
      req.body.input,
      null,
      "en-US"
    ); // Updated targetLang to 'en-US'
    // console.log("result:", result); // ✅ Log the translation result
    const translatedText = result.text;
    console.log("Translated Text:", translatedText); // ✅ Log the translated text
    const options = {
      method: "POST",
      url: "https://api.openai.com/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      data: {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a friendly Latvian language partner named LinguaLatvia. You chat naturally with the user in an informal and friendly tone, like a native Latvian friend helping someone practice their Latvian.

The user is learning Latvian and may make grammar mistakes or write awkward sentences. Your job is to:

1. Understand what they’re trying to say (even if it’s a bit incorrect).
2. Reply with a friendly message in English (to be translated to Latvian).
3. Gently point out and correct any grammar or sentence structure mistakes they made, if any.
4. Optionally, explain a better way to say the sentence naturally in Latvian.

Be encouraging and supportive. Make the conversation feel natural and not like a classroom. Use casual tone, slang, or cultural references if appropriate. 

Your main goals are:
- Help the user improve their Latvian.
- Keep the conversation flowing like a real friend.
- **Avoid repeating the same suggestion or correction multiple times.**
- **Ensure your responses are varied and do not repeat the same sentences or phrases. Keep it fresh and engaging.**
`,
          },
          {
            role: "user",
            content: translatedText,
          },
        ],
        temperature: 0.9,
        max_tokens: 1024,
        top_p: 0.9,
        frequency_penalty: 0,
        presence_penalty: 0,
      },
    };
    const response = await axios.request(options);
    const content = response.data.choices[0].message.content;
    console.log("content:", content);
    //  reconvert into latvian language

    const result2 = await deeplClient.translateText(content, null, "lv"); // Updated targetLang to 'lv'
    // console.log("result:", result); // ✅ Log the translation result
    console.log("Translated Text:", result2.text); // ✅ Log the translated text
    res.status(200).send({
      bot: {
        en: content,
        lt:result2.text,
      }
    });
  } catch (error) {
    console.log("FAILED:", req.body.input);
    console.error(
      "error while generating result from AI",
      error && error.response ? error.response.data : error
    );
    res.status(500).send(error);
  }
});




app.listen(4000, () => console.log("Server is running on port 4000"));
