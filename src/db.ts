import {Client} from 'pg';
import {toSql} from 'pgvector/pg';
import { CONFIG } from './config/configuration';

const client = new Client({
  host: CONFIG.DB_HOST,
  user: CONFIG.DB_USER,
  password: CONFIG.DB_PASSWORD,
  database: CONFIG.DB,
  port: CONFIG.DB_PORT
});

let connected = false;
export const saveProduct = async (tablename: string, {
  title,
  url,
  subtitle,
  price,
  description,
  embedding,
}) => {
  if (connected !== true) {
    await client.connect();
    connected = true;
  }

  // TODO !! remove sql injection potential 
  await client.query(
    `INSERT INTO ${tablename} (title, subtitle, url, description, description_embedding, price) VALUES ($1, $2, $3,$4, $5, $6)`,
    [
      title,
      subtitle,
      url,
      description,
      toSql(embedding),
      price,
    ],
  );
};

export const search = async (searchEmbedding) => {
  if (connected !== true) {
    await client.connect();
    connected = true;
  }
  try {
    // Fetch similar products via euclidean distance <->.
    // Try out cosine similarity <=>
    const data = await client.query(
      `SELECT concat(p.title, ' ', p.subtitle) as "title", p.url, p.description_embedding from products p ORDER BY description_embedding <-> $1 LIMIT 5`,
      [toSql(searchEmbedding)],
    );
    const rows = [...data.rows];
    const products = [];
    for (const row of data.rows) {
      const { description_embedding, ...rest } = row;
      const competitors = await getCompetitorProduct(description_embedding);
      products.push({
        ...rest,
        competitors,
      });
    }
    return products
  } catch (err) {
    console.error(err);
  }
};

export const getCompetitorProduct = async (searchEmbedding) => {
  if (connected !== true) {
    await client.connect();
    connected = true;
  }
  try {
    const data = await client.query(
      `SELECT concat(p.title, ' ', p.subtitle) as "title", p.url, p.price from ct p ORDER BY description_embedding <=> $1 LIMIT 2`,
      [searchEmbedding],
    );
    return data.rows
  } catch (err) {
    console.error(err);
  }
};
