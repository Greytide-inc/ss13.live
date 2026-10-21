// input() as color: the dialog kind is "color" (the page shows a colour picker), not "no picker here".
import assert from "node:assert";
import { inputKind } from "../src/vm/clients.js";
import { ArgType } from "../src/vm/command-line.js";

assert.strictEqual(inputKind(ArgType.Color, false), "color");
assert.strictEqual(inputKind(ArgType.Color | ArgType.Null, false), "color"); // the 257 the hair/eye prompts send
assert.strictEqual(inputKind(ArgType.File, false), null);
assert.strictEqual(inputKind(ArgType.Text, false), "text");
console.log("input-kind ok");
