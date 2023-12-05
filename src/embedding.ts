import OpenAI from 'openai';
import { CONFIG } from './config/configuration';


export class EmbeddingService {
    client: OpenAI;
    constructor() {
      this.client = new OpenAI({ apiKey: CONFIG.openaiAPIKey });
    }
  
    async getEmbedding(str: string) {
      const data = await this.client.embeddings.create({
        model: 'text-embedding-ada-002',
        input: str,
      });
      return data.data[0].embedding;
    }
  }
  