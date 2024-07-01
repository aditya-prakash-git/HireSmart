const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

const createChatSession = () => {
  const chat = model.startChat({
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
  });

  return {
    sendMessage: async (message) => {
      try {
        const result = await chat.sendMessage(message);
        return result.response;
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    },
  };
};

export default createChatSession;