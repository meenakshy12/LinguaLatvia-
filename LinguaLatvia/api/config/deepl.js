import * as deepl from "deepl-node";

import * as dotenv from "dotenv";
dotenv.config();


const deeplApiKey = process.env.DEEPL_API_KEY;
export const deeplClient = new deepl.Translator(deeplApiKey);




