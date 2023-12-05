import {search} from './db'
import { EmbeddingService } from './embedding';


// search for products
// Usage node recall.js 'search'
(async function main() {
    const embeddingService = new EmbeddingService()
    const embedding = await embeddingService.getEmbedding(process.argv[2])
    try{
      
      const products = await search(embedding)
      console.log(JSON.stringify(products, undefined, 2))
    } catch (err) {
      };
    
})();




