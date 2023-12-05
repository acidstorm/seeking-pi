export default () => ({
  openaiAPIKey: process.env.OPENAI_API_KEY,
  huggingFaceToken: process.env.HF_TOKEN,
});

export const CONFIG = {
  openaiAPIKey: '{OPENAI_API_KEY}', // Use openai key
  MAX_CRAWL: 300,
  DB_HOST: '127.0.0.1',
  DB_USER: 'postgres',
  DB_PASSWORD: 'postgres',
  DB: 'seeking_pi',
  DB_PORT: 6432,
};
