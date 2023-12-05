import fs  from 'fs';
import path from 'path';
import {saveProduct} from './db'

// import json in directory
// Usage node import.js <directory> <table>
(async function main() {
  const directory = process.argv[2];
  const table = process.argv[3]
  if (!table) {
    console.error('Please specify a table name');
    return;
  }
  const jsonsInDir = fs
  .readdirSync(directory)
  .filter((file) => path.extname(file) === '.json');
  
  for (const file of jsonsInDir) {
    try{
      const fileData = fs.readFileSync(path.join(directory, file));
      
      // change table name to import into
      await saveProduct(table, JSON.parse(fileData))} catch (err) {
        console.error(err, 'Error in file', file);
      };
    }
 
})();
