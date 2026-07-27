import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn(
    "[OpenAI] Not configured. Set OPENAI_API_KEY in server/.env"
  );
}

const openai = apiKey
  ? new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    })
  : null;

function getClient(): OpenAI {
  if (!openai) {
    throw new Error(
      "OpenAI not configured. Set OPENAI_API_KEY in server/.env"
    );
  }
  return openai;
}

export { getClient as default };
