import fs from "fs/promises";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL('..', import.meta.url));
const DB_PATH = `${__dirname}/db.json`;

export const getDb = async () => {
  const db = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(db);
}

export const saveDb = async (db) => {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2)); //arguments are for formatting
  return db;
}

export const insertDb = async (note) => {
  const db = await getDb();
  db.notes.push(note);
  await saveDb(db);
  return note;
}
