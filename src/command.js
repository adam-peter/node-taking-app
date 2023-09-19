import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import {
  newNote,
  getAllNotes,
  findNotes,
  removeNote,
  removeAllNotes,
} from "./notes.js";

/*
- new
- all
- find
- remove
- web
- clean
*/

const listNotes = (notes) => {
  notes.forEach(({ id, content, tags }) => {
    console.log("id:\t", id);
    console.log("content:", content);
    console.log("tags:\t", tags);
    console.log();
  });
};

yargs(hideBin(process.argv))
  //.command("command", "description", formattingFunction, returnFunction)
  .command(
    "new <note>",
    "create a new note",
    (yargs) => {
      return yargs.positional("note", {
        describe: "The content of the note you want to create",
        type: "string",
      });
    },
    async (argv) => {
      const tags = argv.tags ? argv.tags.split(",") : [];
      const note = await newNote(argv.note, tags);
      console.log("Note added!", note);
    }
  )
  .option("tags", {
    alias: "t",
    type: "string",
    description: "tags to add to the note",
  })

  .command("all", "Get all notes", async (yargs) => {
    const notes = await getAllNotes();
    listNotes(notes);
  })

  .command(
    "find <filter>",
    "get matching notes",
    (yargs) => {
      return yargs.positional("filter", {
        describe:
          "The search term to filter notes by, will be applied to note.content",
        type: "string",
      });
    },
    async (argv) => {
      const notes = await getAllNotes();
      const matches = await findNotes(argv.filter);
      console.log(matches);
    }
  )

  .command(
    "remove <id>",
    "remove a note by id",
    (yargs) => {
      return yargs.positional("id", {
        type: "number",
        description: "The id of the note you want to remove",
      });
    },
    async (argv) => {
      const id = await removeNote(argv.id);
      id
        ? console.log("Removed note", id)
        : console.log(`Note with id ${argv.id} not found.`);
    }
  )

  .command(
    "web [port]",
    "launch website to see notes",
    (yargs) => {
      return yargs.positional("port", {
        describe: "port to bind on",
        default: 5000,
        type: "number",
      });
    },
    async (argv) => {}
  )

  .command(
    "clean",
    "remove all notes",
    () => {},
    async (argv) => {
      await removeAllNotes();
      console.log("All notes have been removed.");
    }
  )
  .demandCommand(1)
  .parse();
