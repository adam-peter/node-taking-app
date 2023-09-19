import { jest } from "@jest/globals";

//mocking = replacing real function with fake functions
jest.unstable_mockModule("../src/db.js", () => ({
  insertDb: jest.fn(), //jest.fn() do nothing - they are Spy functions
  getDb: jest.fn(), //they give you info on the usage of the functions
  saveDb: jest.fn(),
}));

//dynamic / async imports (must be after the mock functions are setup)
const { insertDb, getDb, saveDb } = await import("../src/db.js");
const { newNote, getAllNotes, removeNote } = await import("../src/notes.js");

//runs before each test
beforeEach(() => {
  //clearing state before running next test
  insertDb.mockClear();
  getDb.mockClear();
  saveDb.mockClear();
});

describe("CLI App", () => {
  test("newNote inserts data and returns it", async () => {
    const note = {
      id: 1,
      content: "Test note",
      tags: ["tag1", "tag2"],
    };
    insertDb.mockResolvedValue(note);

    const result = await newNote(note.content, note.tags);
    expect(result.content).toEqual(note.content);
  });

  test("getAllNotes returns all notes", async () => {
    const db = {
      notes: ["note1", "note2", "note3"],
    };
    getDb.mockResolvedValue(db);

    const result = await getAllNotes();
    expect(result).toEqual(db.notes);
  });

  test("removeNote does nothing if id is not found", async () => {
    const notes = [
      { id: 1, content: "note 1" },
      { id: 2, content: "note 2" },
      { id: 3, content: "note 3" },
    ];
    saveDb.mockResolvedValue(notes);

    const idToRemove = 4;
    const result = await removeNote(idToRemove);
    expect(result).toBeUndefined();
  });
});
