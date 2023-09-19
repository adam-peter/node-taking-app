import { getDb, saveDb, insertDb } from "./db.js";

/*
newNote(note, tags) - create new note 
getAllNotes()
findNotes(filter) - returns array of notes that match with the filter
removeNote(id) - first find the note, copy the id, then paste it when removing
removeAllNotes()
*/

export const newNote = async (note, tags) => {
  const newNote = {
    id: Date.now(),
    content: note,
    tags,
  };

  await insertDb(newNote);
  return newNote;
};

export const getAllNotes = async () => {
  const { notes } = await getDb();
  return notes;
};

export const findNotes = async (filter) => {
  const { notes } = await getDb();

  return notes.filter((note) =>
    note.content.toLowerCase().includes(filter.toLowerCase())
  );
};

export const removeNote = async (id) => {
  const { notes } = await getDb();
  const match = notes.find((note) => note.id === id);

  if (match) {
    const newNotes = notes.filter((note) => note.id !== id);
    await saveDb({ notes: newNotes });
    return id;
  }
};

export const removeAllNotes = () => saveDb({ notes: [] });
