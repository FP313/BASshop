
import sqlite3Package from 'sqlite3';
const sqlite3 = sqlite3Package.verbose();
import path  from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const dbPath = path.resolve(__dirname, '../database/BAS.db');

export const db = new sqlite3.Database(dbPath, (err)=>{
    err ? console.error('ERROR: ', err.message) : console.log('Connection successful');
});
