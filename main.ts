// The Best Advice I Ever Got — make.fun entry (program/v1, Node 22 stdlib only).
// Deterministic: no clock, no randomness, no network, no environment-dependent
// output. The program writes exactly one fixed sentence to the output path
// given as the first argument (fallback: /output/entry.txt) and nothing else.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The entry text. Final, verbatim — do not alter a single character.
// 185 characters: specific score (6-1), a named person (Grandad), a concrete
// time (at seventeen / twenty years on), narrator as the loser, twist in the
// final clause (the notebook is full and the sulking never happened).
const ENTRY =
  "At seventeen, after I lost the final 6-1, Grandad said I could sulk only after writing down one thing I did right — twenty years on, the notebook is full and the sulking never happened.";

const outputPath =
  process.argv[2] ?? process.env.OUTPUT_PATH ?? "/output/entry.txt";

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, ENTRY, "utf8");

// Self-check: re-read what was written and verify it against the gate
// (UTF-8 text, 1-200 characters, one sentence, no trailing newline).
// Any failure is fatal (non-zero exit) so a bad output is never silent.
const written = readFileSync(outputPath, "utf8");
const failures: string[] = [];
if (written !== ENTRY) failures.push("written text differs from ENTRY");
const length = [...written].length; // code points, matching the char count
if (length < 1 || length > 200) {
  failures.push(`length ${length} is outside 1-200 characters`);
}
if (written !== written.trim()) {
  failures.push("text has leading or trailing whitespace");
}
if (written.endsWith("\n")) failures.push("text has a trailing newline");
// One sentence: exactly one period, at the very end, no other sentence
// terminator or newline inside.
if ((written.match(/\./g) ?? []).length !== 1 || !written.endsWith(".")) {
  failures.push("text is not exactly one sentence ending in a period");
}
if (written.includes("\n")) failures.push("text contains a newline");
if (failures.length > 0) {
  for (const failure of failures) console.error(`self-check failed: ${failure}`);
  process.exit(1);
}
