import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One autocorrect fail, one line. The intended text was "I'll be there in
// a sec" to my boss; autocorrect swapped a single letter and sent "sex".
// The joke lands on first read because the slip is one letter, the wrong
// word is wildly inappropriate for a boss, and the punchline is the
// consequence: a meeting with HR.
const ENTRY =
  "I texted my boss this morning 'I'll be there in a sec' — autocorrect sent 'I'll be there in a sex' and now I'm in a meeting with HR.";

const MAX_CHARS = 199;
const EXPECTED_CHARS = 132;
const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

function guard(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`entry is ${chars} characters, must be 1 to ${MAX_CHARS}`);
  }
  if (chars !== EXPECTED_CHARS) {
    throw new Error(`entry is ${chars} characters, expected ${EXPECTED_CHARS}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  const lines = text.split("\n");
  if (lines.length !== 1) {
    throw new Error(`entry must be exactly one line, got ${lines.length}`);
  }
  if (!text.includes("'I'll be there in a sec'") || !text.includes("'I'll be there in a sex'")) {
    throw new Error("entry must carry both halves of the sec/sex slip");
  }
}

function main(): void {
  guard(ENTRY);
  // Create /output if needed; never delete the output directory itself.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, ENTRY, "utf8");
  // Verify the write landed byte-identical, with no trailing newline.
  const written = readFileSync(OUT_FILE, "utf8");
  if (written !== ENTRY) {
    throw new Error("entry.txt does not match the entry line");
  }
  if (!Buffer.from(written, "utf8").equals(Buffer.from(ENTRY, "utf8"))) {
    throw new Error("entry.txt bytes do not match the entry line");
  }
  console.log(`${[...written].length} chars, 1 line:`);
  console.log(written);
}

main();
