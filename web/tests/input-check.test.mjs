// input-check.test - ps-security: the messages a real page sends pass the shape check; junk, oversized and forged-proc ones don't.
import assert from "node:assert/strict";
import { inputOk, MAX_TEXT, INPUT_TYPES, linkCommandOk } from "../build/dist/src/worker/input-check.js";

const click = { type: "click", id: 12, x: 100, y: 120, dbl: false, control: "mapwindow.map", params: "icon-x=16;icon-y=16;left=1" };
const good = [
	{ type: "key", key: "CTRL+B", down: true }, { type: "key", key: "NORTH", down: false, player: "alice" },
	{ type: "command", text: 'say "hi"' }, { type: "command", text: "hi", speech: 'say "hi"' }, { type: "typing", on: true },
	{ type: "answer", id: 3, value: "text" }, { type: "answer", id: 3, value: 2 }, { type: "answer", id: 3, value: null },
	{ type: "statpanel", name: "Status" }, { type: "statclick", idx: 0 }, { type: "topic", href: "byond://?src=[0x2000001];a=1" }, { type: "winclose", name: "paper12" },
	click, { ...click, id: null, x: null, y: null }, { type: "menu", one: undefined, x: 1, y: 2, sx: 300.5, sy: 200, click }, { type: "menu", one: 7, x: 1, y: 2, sx: 3, sy: 4, click },
	{ type: "menupick", id: 1, a: 0, v: 2 }, { type: "mouse", proc: "MouseDown", id: 5, x: 1, y: 2, control: "mapwindow.map", params: "" },
	{ type: "mouse", proc: "MouseDrop", id: 5, x: null, y: null, over: null, ox: 3, oy: 4, control: "mapwindow.map", params: "" }, { type: "mouse", proc: "MouseWheel", id: 5, x: 1, y: 2, dx: 0, dy: -120, control: "mapwindow.map", params: "" },
	{ type: "resync" }, { type: "bugstate" },
];
for (const m of good) assert.ok(inputOk(m), `should pass: ${JSON.stringify(m)}`);
const bad = [
	null, 42, "key", [], {}, { type: {} }, { type: "start" }, { type: "connect", key: "x" }, { type: "toString" }, { type: "__proto__" },
	{ type: "key" }, { type: "key", key: 1, down: true }, { type: "key", key: "A", down: 1 }, { type: "key", key: "A".repeat(41), down: true },
	{ type: "command", text: null }, { type: "command", text: "x".repeat(MAX_TEXT + 1) }, { type: "command", text: "x", speech: {} }, { type: "command", text: "x", player: {} },
	{ type: "answer", id: "1", value: "x" }, { type: "answer", id: 1, value: {} }, { type: "answer", id: 1, value: Infinity }, { type: "answer", id: -1, value: null },
	{ type: "statpanel", name: {} }, { type: "statclick", idx: 0.5 }, { type: "topic", href: [] }, { type: "winclose" },
	{ ...click, id: "12" }, { ...click, x: 1e308 }, { ...click, x: "1" }, { ...click, params: "p".repeat(2000) }, { ...click, dbl: "yes" },
	{ type: "menu", x: 1, y: 2, sx: 3, sy: 4 }, { type: "menu", x: 1, y: 2, sx: 3, sy: 4, click: [] }, { type: "menu", x: 1, y: 2, sx: 3, sy: 4, click: { ...click, id: {} } },
	{ type: "menupick", id: 1, a: -1, v: 0 }, { type: "mouse", proc: "gib", id: 5, x: 1, y: 2 }, { type: "mouse", proc: "Del", id: 5 }, { type: "mouse", proc: "constructor", id: 5 }, { type: "mouse", id: 5 },
	{ type: "mouse", proc: "MouseDrop", id: 5, over: "6" },
];
for (const m of bad) assert.ok(!inputOk(m), `should be refused: ${JSON.stringify(m)?.slice(0, 80)}`);
// a byond://winset link's command= runs as whoever clicks it: only tgui's close button sends one
assert.ok(linkCommandOk("uiclose [0x2000123]"));
for (const cmd of [".quit", "ooc hi", "uiclose [0x2000123];ooc hi", "uiclose [0x2000123]\nooc hi", "uiclose", "Uiclose x", " adminhelp"]) assert.ok(!linkCommandOk(cmd), `link command refused: ${cmd}`);
// every type tools/server.mjs forwards has a check, and nothing else does
const src = (await import("node:fs")).readFileSync(new URL("../tools/server.mjs", import.meta.url), "utf8");
const forward = JSON.parse(src.match(/const FORWARD = new Set\((\[[^\]]*\])\)/)[1]);
assert.deepEqual([...forward].sort(), [...INPUT_TYPES].sort());
console.log(`input-check: ${good.length} real messages pass, ${bad.length} bad ones refused, ${forward.length} forwarded types all checked`);
