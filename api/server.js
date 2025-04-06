import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import axios from "axios"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    res.status(200).send({
        message:
            "This is virtual assistant server url, please visit https://virtual-assistant-client.vercel.app",
    });
});



app.post("/", async (req, res) => {
    try {
        const options = {
            method: 'POST',
            url: 'https://api.openai.com/v1/chat/completions',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            data: {
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpfull assistant '
                    },
                    {
                        role: 'user',
                        content: req.body.input
                    }
                ],
                temperature: 0.9,
                max_tokens: 1024,
                top_p: 0.9,
                frequency_penalty: 0,
                presence_penalty: 0
            }
        };
        const response = await axios.request(options);
        const content = response.data.choices[0].message.content;
        console.log("content:", content);

        res.status(200).send({
            bot: content,
        });
    } catch (error) {
        console.log("FAILED:", req.body.input);
        console.error("error while generating result from AI", error && error.response ? error.response.data : error);
        res.status(500).send(error);
    }
});

app.listen(4000, () => console.log("Server is running on port 4000"));
