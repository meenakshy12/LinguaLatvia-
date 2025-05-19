import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import axios from "axios";
import { deeplClient } from "./config/deepl.js";
import fs from "fs"; // <-- Add this at the top with other imports

dotenv.config();

const app = express();
const corsOptions = {
  origin: "https://lingua-latvia-z3rk.vercel.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Enable preflight for all routes
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message:
      "This is virtual assistant server url, please visit https://lingua-latvia-neon.vercel.app to see the app",
  });
});

app.post("/", async (req, res) => {
  try {
    console.log("🔍 Request Body:", req.body); // ✅ Log the request body

    const { input, conversationHistory = [] } = req.body;

    // Translate the latest user input to English, forcing source language to Latvian
    const result = await deeplClient.translateText(input, "LV", "en-US");
    const translatedText = result.text;
    console.log("Translated user input to English:", translatedText);

    // Build messages array for OpenAI API including system prompt and conversation history
    const messages = [
      {
        role: "system",
        content: `You are a friendly Latvian language partner named LinguaLatvia. You chat naturally with the user in an informal and friendly tone, like a native Latvian friend helping someone practice their Latvian.

The user is learning Latvian and may make grammar mistakes or write awkward sentences. Your job is to:

1. Understand what they’re trying to say (even if it’s a bit incorrect).
2. Reply with a friendly message in English (which will be translated into Latvian).
3. Gently point out and correct any grammar or sentence structure mistakes they made, if any.
4. When relevant, help the user understand Latvian declensions (like noun case changes) in a chill and simple way—just enough to explain why a word changed. Keep it casual, not technical.
5. Offer 2–3 fun or natural response **options** in Latvian that the user could choose from to keep the conversation going (e.g., simple follow-ups, casual questions, or reactions). These should be beginner-friendly and match the context.
6. Occasionally ask fun, simple **multiple choice questions** in Latvian to test the user's vocabulary or grammar. Do **not** reveal the answer right away—wait for the user's guess first, then respond with feedback.
7. **Only roleplay** specific scenarios (e.g., shopkeeper, waiter, travel agent) **if the user requests it**. When roleplaying, stay in character while still helping them learn.

Be encouraging and supportive. Make the conversation feel natural and not like a classroom. Use a casual tone, slang, emojis, or cultural references if appropriate.

Your main goals are:
- Help the user improve their Latvian.
- Casually reinforce proper usage of declensions, especially when words change as subjects or objects.
- Keep the conversation flowing like a real friend.
- **Avoid repeating the same suggestion or correction multiple times.**
- **Ensure your responses are varied and do not repeat the same sentences or phrases. Keep it fresh and engaging.**
- **Make the user feel confident and excited to keep learning.**

`,
      },
      // Include previous conversation history messages
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      // Add the latest user message with translated text
      {
        role: "user",
        content: translatedText,
      },
    ];

    const options = {
      method: "POST",
      url: "https://api.openai.com/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      data: {
        model: "gpt-4o-mini",
        messages,
        temperature: 0.9,
        max_tokens: 1024,
        top_p: 0.9,
        frequency_penalty: 0,
        presence_penalty: 0,
      },
    };

    const response = await axios.request(options);
    const content = response.data.choices[0].message.content;

    // Translate the AI response back to Latvian
    const result2 = await deeplClient.translateText(content, null, "LV");

    res.status(200).send({
      bot: {
        en: content,
        lt: result2.text,
      },
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

// app.post("/game01", async (req, res) => {
//   try {
//     const previous = req.body.data || []; // Get the previous data from the request body
//     const parseData = `Here is the list of words already provided: ${JSON.stringify(previous.map(item => item.lt))}. Do not repeat any of these.`; // Refined prompt for distinct data
//     // console.log("Previous data:", parseData); // Log the previous data

//     const messages = [
//       {
//         role: "system",
//         content: "You are a helpful assistant that provides 10 simple Latvian words and their English meanings for children. Respond only in json  format: [{lt: 'Latvian', en: 'English'}, ...].",
//       },
//       {
//         role: "system",
//         content: parseData,
//       },
//       {
//         role: "user",
//         content: "Provide 10 unique simple Latvian words with their English meanings that have not been given before.",
//       },
//     ];

//     const options = {
//       method: "POST",
//       url: "https://api.openai.com/v1/chat/completions",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//       data: {
//         model: "gpt-4o-mini",
//         messages,
//         temperature: 0.5,
//         max_tokens: 512,
//       },
//     };

//     const response = await axios.request(options);
//     const content = response.data.choices[0].message.content;
//     // console.log("content:", content); // Log the response content


//       // Remove Markdown formatting (e.g., ```json and ```) and parse as JSON
//       const tasks = JSON.parse(content.replace(/```json|```/g, "").trim());
    

//     res.status(200).send({ gameData: tasks });
//   } catch (error) {
//     console.error("Error in /game01:", error.response?.data || error.message || error);
//     res.status(500).send({ error: "Failed to generate game data." });
//   }
// });


app.post("/game01", async (req, res) => {
  const { data: previous = [], difficulty } = req.body; // Extract difficulty 
  //from request body
  // console.log(difficulty,previous)
  const parseData = `Here is the list of words already provided: ${JSON.stringify(previous.map(item => item.word))}. Do not repeat any of these.`; // Refined prompt for distinct data

  const messages = [
    {
      role: "system",
      content: `You are a helpful assistant that provides five unique Latvian words with their English meaning as clue. Focus on the difficulty level: ${difficulty}. Respond in JSON format:
[{ "word": "hello", "clue": "sveiki" }]. Ensure the words are unique and do not repeat any previously provided words.`,
    },
    {
      role: "system",
      content: parseData,
    },
    {
      role: "user",
      content: "Provide five unique Latvian words with their English meanings.",
    },
  ];

  try {
    const options = {
      method: "POST",
      url: "https://api.openai.com/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      data: {
        model: "gpt-4o-mini",
        messages,
        temperature: 0.5,
        max_tokens: 512,
      },
    };

    const completion = await axios.request(options);
    const content = completion.data.choices[0].message.content;

    // Parse the JSON response and handle errors if parsing fails
    const tasks = JSON.parse(content.replace(/```json|```/g, "").trim());

    res.json(tasks);
  } catch (error) {
    console.error("Error generating words:", error.response?.data || error.message || error);
    res.status(500).json({ error: "Failed to fetch words." });
  }
});

app.post("/game02", async (req, res) => {
  try {
    const { data: previous = [], difficulty } = req.body;
    const MIN_QUESTIONS = 10;
    const MAX_ATTEMPTS = 2; // Reduce attempts to 1 to reduce API calls and improve performance
    let allQuestions = [];
    let attempts = 0;
    let previousSentences = new Set(previous.map(q => q.sentence));

    async function fetchQuestions() {
      const parseData = `Here is the list of questions already provided: ${JSON.stringify([...previous, ...allQuestions])}. Do not repeat any of these.`;
      const messages = [
        {
          role: "system",
          content: `You are an assistant that generates Latvian vocabulary questions for children learning Latvian. Focus on the difficulty level: ${difficulty}. For higher difficulty levels, generate more complex and challenging sentences appropriate for the user's proficiency. Each question must:
- Be grammatically correct and natural Latvian.
- The missing word (the correct answer) can be at the start, middle, or end of the sentence, as long as the sentence is natural and grammatically correct.
- The adjective or verb in the sentence must agree with the correct answer in gender (masculine/feminine), number (singular/plural), and case.
- Use the correct singular or plural form as needed, and the correct gender for adjectives.
- Do NOT use accusative, genitive, or other cases for the subject—always nominative.
- Use only words and phrases that a native Latvian speaker would use with children.
- Double-check for spelling and grammar errors.
- Include a sentence with a missing word (fill-in-the-blank format).
- Provide an English translation of the sentence.
- Include three options for the missing word, all in nominative case.
- Specify the correct answer.

Examples of correct and incorrect forms:
Correct: { "sentence": "_ _ _ ir dzeltens", "options": ["citrons", "banāns", "apelsīns"], "correctAnswer": "citrons" }
Incorrect: { "sentence": "_ _ _ ir dzeltens", "options": ["citronu", "banānu", "apelsīnu"], "correctAnswer": "citronu" } // Wrong case

Correct: { "sentence": "_ _ _ ir balta", "options": ["ola", "sniegs", "zieds"], "correctAnswer": "ola" }
Incorrect: { "sentence": "_ _ _ ir balts", "options": ["olas", "sniegs", "zieds"], "correctAnswer": "olas" } // Wrong number/gender

Before returning your response, carefully review each sentence and option for correct Latvian grammar, spelling, and natural usage. Do not use direct or literal translations from English if they sound unnatural in Latvian.

Respond in this JSON format:
[
  {
    "sentence": "_ _ _ ir liela",
    "translation": "The house is big",
    "options": ["māja", "auto", "skola"],
    "correctAnswer": "māja"
  },
  ...
]

Ensure:
1. The questions are unique and do not repeat any previously provided data.
2. The options are relevant to the sentence.
3. The correct answer is accurate.
4. All Latvian is natural and error-free.
${parseData}`,
        },
        {
          role: "user",
          content: `Provide at least 50 unique Latvian vocabulary questions in the specified format.
- Each question must be grammatically correct and natural Latvian.
- The missing word (the correct answer) and all options must be in the nominative case (not accusative, genitive, dative, etc.).
- The adjective or verb in the sentence must agree with the correct answer in gender (masculine/feminine), number (singular/plural), and case.
- Do not repeat any sentence, options, or correct answers.
- Only return an array of 50 objects in the required JSON format.
- Double-check that all correct answers and options are in nominative case. For example, use "ķiploks" (nominative) not "ķiploku" (accusative/genitive).
- Double-check that adjectives match the noun in gender and number. For example, "balts sniegs" (masculine singular), "balta ola" (feminine singular), "balti sniegi" (masculine plural), "baltas olas" (feminine plural).
- Do not use direct or literal translations from English if they sound unnatural in Latvian.
- Example of correct: { "sentence": "_ _ _ ir dzeltens", "options": ["citrons", "banāns", "apelsīns"], "correctAnswer": "citrons" }
- Example of incorrect: { "sentence": "_ _ _ ir dzeltens", "options": ["citronu", "banānu", "apelsīnu"], "correctAnswer": "citronu" } // Wrong case
- Example of incorrect: { "sentence": "_ _ _ ir balts", "options": ["olas", "sniegs", "zieds"], "correctAnswer": "olas" } // Wrong number/gender
`,
        },
      ];

      const options = {
        method: "POST",
        url: "https://api.openai.com/v1/chat/completions",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        data: {
          model: "gpt-4o-mini",
          messages,
          temperature: 0.7,
          max_tokens: 4096,
        },
      };

      const response = await axios.request(options);
      const content = response.data.choices[0].message.content;

      // Validate and parse the JSON response
      let questions;
      try {
        const cleanedContent = content.replace(/```json|```/g, "").trim();
        const arrayMatch = cleanedContent.match(/\[[\s\S]*\]/);
        if (!arrayMatch) throw new Error("No JSON array found in AI response.");
        questions = JSON.parse(arrayMatch[0]);
        if (!Array.isArray(questions) || questions.some(q => !q.sentence || !q.translation || !q.options || !q.correctAnswer)) {
          throw new Error("Invalid response format");
        }
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        return res.status(500).send({ error: "Failed to parse AI response." });
      }

      // --- Enhanced post-processing for nominative, agreement, naturalness, plausibility ---

      // Latvian nominative endings (not exhaustive, but covers most common nouns)
      const nominativeEndings = [
        "s", "š", "a", "e", "i", "u", "o", "as", "es", "is", "us", "ei", "ai", "ie", "os", "us"
      ];
      function isLikelyNominative(word) {
        return nominativeEndings.some(ending => word.toLowerCase().endsWith(ending));
      }
      // Simple gender/number guessers
      function isLikelyPlural(word) {
        return /i$|as$|es$|us$|os$/.test(word);
      }
      function isLikelyFeminine(word) {
        return /a$|e$|as$|es$/.test(word);
      }
      function isLikelyMasculine(word) {
        return /s$|š$|is$|us$/.test(word);
      }
      // Check adjective/noun agreement (very basic, for most common cases)
      function adjectiveEndingMatches(noun, adjective) {
        if (isLikelyPlural(noun)) return /i$|as$|es$|ie$|os$|us$/.test(adjective);
        if (isLikelyFeminine(noun)) return /a$|as$|es$|e$/.test(adjective);
        if (isLikelyMasculine(noun)) return /s$|š$|is$|us$/.test(adjective);
        return true;
      }
      // Plausibility: all options should be nouns, not adjectives/verbs, and not the same word
      function isValidLatvianWord(word) {
        return /^[a-zāčēģīķļņōŗšķūž]+$/i.test(word);
      }
      function isLikelyNoun(word) {
        // crude: nouns usually have these endings in nominative
        return isLikelyNominative(word);
      }
      // Remove options that are not plausible
      function plausibleOptions(options, correctAnswer) {
        return options.filter(opt =>
          isValidLatvianWord(opt) &&
          isLikelyNoun(opt) &&
          opt !== correctAnswer
        );
      }
      // Remove questions with unnatural or literal translations
      function isNaturalTranslation(q) {
        // crude: translation should not contain untranslated Latvian words
        return !q.translation.match(/[āčēģīķļņōŗšķūž]/i);
      }

      // Enhanced filter
      questions = questions.filter(q => {
        // All options and correctAnswer must be nominative, plausible, and unique
        if (!isLikelyNominative(q.correctAnswer)) return false;
        if (!q.options.every(isLikelyNominative)) return false;
        if (!q.options.every(isValidLatvianWord)) return false;
        if (!adjectiveEndingMatches(q.correctAnswer, q.sentence.trim().split(" ").pop())) return false;
        if (!isNaturalTranslation(q)) return false;
        // All options should be plausible nouns and not all the same
        const plausible = plausibleOptions(q.options, q.correctAnswer);
        if (plausible.length < 2) return false;
        return true;
      });

      // Remove questions already seen
      questions = questions.filter(q => !previousSentences.has(q.sentence));

      // Remove duplicate sentences in this batch
      const uniqueQuestions = [];
      const uniqueSentences = new Set();
      questions.forEach(q => {
        if (!uniqueSentences.has(q.sentence)) {
          uniqueQuestions.push(q);
          uniqueSentences.add(q.sentence);
        }
      });

      // --- END enhanced post-processing ---

      console.log("AI filtered questions (after post-processing):", uniqueQuestions);

      return uniqueQuestions;
    }

    while (allQuestions.length < MIN_QUESTIONS && attempts < MAX_ATTEMPTS) {
      attempts++;
      const newQuestions = await fetchQuestions();
      if (!Array.isArray(newQuestions)) {
        throw new Error("AI did not return an array of questions.");
      }
      newQuestions.forEach(q => {
        if (!allQuestions.some(existing => existing.sentence === q.sentence)) {
          allQuestions.push(q);
        }
      });
      previousSentences = new Set([...previousSentences, ...allQuestions.map(q => q.sentence)]);
    }

    console.log("AI filtered questions (after post-processing):", allQuestions);

    // Shuffle options for each question so the correct answer is not always first
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    allQuestions.forEach((question) => {
      const options = question.options;
      const correctAnswer = question.correctAnswer;
      // Shuffle options
      shuffleArray(options);
      // Update correctAnswer to new position
      const newIndex = options.findIndex((opt) => opt === correctAnswer);
      // Set correctAnswer to the option string at newIndex (already correct)
      question.correctAnswer = options[newIndex];
      // Additionally, ensure the adjective in sentence agrees with correctAnswer in gender/number
      // Fix adjective agreement in sentence if needed
      const sentenceWords = question.sentence.split(" ");
      // The adjective is the last word in the sentence
      const adjective = sentenceWords[sentenceWords.length - 1];
      // Simple fix for common adjective endings based on correctAnswer ending
      const correctAnswerWord = correctAnswer.toLowerCase();
      if (correctAnswerWord.endsWith("a")) {
        // Feminine singular adjective ending
        if (!adjective.endsWith("a")) {
          sentenceWords[sentenceWords.length - 1] = adjective.replace(/.$/, "a");
        }
      } else if (correctAnswerWord.endsWith("i") || correctAnswerWord.endsWith("es") || correctAnswerWord.endsWith("as")) {
        // Feminine plural adjective ending
        if (!adjective.endsWith("as") && !adjective.endsWith("es")) {
          sentenceWords[sentenceWords.length - 1] = adjective.replace(/.$/, "as");
        }
      } else if (correctAnswerWord.endsWith("s") || correctAnswerWord.endsWith("š") || correctAnswerWord.endsWith("is") || correctAnswerWord.endsWith("us")) {
        // Masculine singular adjective ending
        if (!adjective.endsWith("s")) {
          sentenceWords[sentenceWords.length - 1] = adjective.replace(/.$/, "s");
        }
      } else {
        // Default no change
      }
      question.sentence = sentenceWords.join(" ");
    });

    // Translate the English translations in the questions to proper English using DeepL
    for (let i = 0; i < allQuestions.length; i++) {
      try {
        const translationResult = await deeplClient.translateText(
          allQuestions[i].translation,
          "LV",
          "en-US"
        );
        allQuestions[i].translation = translationResult.text;
      } catch (translationError) {
        console.error("Error translating question translation:", translationError);
        // Keep original translation if error occurs
      }
    }

    // Save questions to a file for debugging/logging
    fs.writeFileSync(
      "./game02_questions.json",
      JSON.stringify(allQuestions, null, 2),
      "utf-8"
    );

    res.status(200).send({ gameData: allQuestions.slice(0, MIN_QUESTIONS) });
  } catch (error) {
    console.error("Error in /game02:", error.response?.data || error.message || error);
    if (!res.headersSent) {
      res.status(500).send({ error: "Failed to generate game data." });
    }
  }
});

app.post("/game03", async (req, res) => {
  try {
    const { data: previous = [], difficulty } = req.body; // Extract difficulty 
    // from request body
    // console.log(difficulty,previous)
    const parseData = `Here is the list of translations already provided: ${JSON.stringify(previous)}. Do not repeat any of these.`;

    const messages = [
      {
        role: "system",
        content: `You are a helpful assistant that translates simple English words or phrases into Latvian. Focus on the difficulty level: ${difficulty}. Respond in JSON format with 4 items like this format and two extra options to confuse the user: 
{
  "matchQ": [
    { "question": "...", "answer": "..." },
    ...
  ],
  "extraOption": ["...", "..."]
}. Ensure the translations are unique and do not repeat any previously provided data.`,
      },
      {
        role: "system",
        content: parseData,
      },
      {
        role: "user",
        content: "Provide 4 unique English to Latvian translations with two extra options.",
      },
    ];

    const options = {
      method: "POST",
      url: "https://api.openai.com/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      data: {
        model: "gpt-4o-mini",
        messages,
        temperature: 0.5,
        max_tokens: 1024,
      },
    };

    const response = await axios.request(options);
    let content = response.data.choices[0].message.content;

    // Parse the JSON response and handle the st
    // ructure
    content = content.replace(/```json|```/g, "").trim();
    const parsedContent = JSON.parse(content);
    const matchQ = parsedContent.matchQ || [];
    const extraOption = parsedContent.extraOption || [];

    res.status(200).send({ gameData: matchQ, extraOption });
  } catch (error) {
    console.error("Error in /game03:", error.response?.data || error);
    res.status(500).send({ error: "Failed to generate game data." });
  }
});

app.listen(4000, () => console.log("Server is running."));
