// the menu bar parses skin.dmf's `menu "menu"` into File/Help with the items tg defines; splitter clamping keeps panes open.
import { readFileSync } from "node:fs";
import assert from "node:assert";
import { resolve } from "node:path";
import { parseMenu, menuTree, splitLabel } from "../../worker/menubar.js";
import { clampPercent } from "../../worker/splitter.js";

const dmf = readFileSync(resolve(process.cwd(), "..", "interface/skin.dmf"), "utf8");
const tree = menuTree(parseMenu(dmf));
assert.deepStrictEqual(tree.map((t) => t.text), ["File", "Help"]);
assert.deepStrictEqual(tree.map((t) => t.key), ["f", "h"]);
const file = tree[0].children;
assert.deepStrictEqual(file.map((c) => c.sep ? "-" : c.text), ["Quick screenshot", "Save screenshot as...", "-", "Reconnect", "Quit"]);
assert.strictEqual(file[0].shortcut, "F2"); assert.strictEqual(file[1].shortcut, "Shift+F2");
assert.strictEqual(file[0].command, ".screenshot auto"); assert.strictEqual(file[1].command, ".screenshot");
assert.strictEqual(file[4].shortcut, "Alt-F4");
assert.deepStrictEqual(tree[1].children.map((c) => [c.text, c.command]), [["Admin Help", "adminhelp"], ["Hotkeys", "hotkeys-help"], ["Source code (Github)", "github"], ["Show screentips", "toggle-screentips"], ["Show runechat", "toggle-runechat"], ["Widescreen", "toggle-widescreen"]]);
const ws = tree[1].children.find((c) => c.id === "widescreen"); assert.ok(ws.canCheck && ws.checked && ws.id === "widescreen"); // checkable, on by default
const st = tree[1].children.find((c) => c.id === "screentips"); assert.ok(st.canCheck && st.checked && st.id === "screentips"); // checkable, on by default
assert.deepStrictEqual(splitLabel("&Save as\tF2"), { text: "Save as", key: "s", at: 0, shortcut: "F2" });
assert.strictEqual(splitLabel("a && b").text, "a & b");
assert.strictEqual(clampPercent(0, 1000, 60), 6); assert.strictEqual(clampPercent(100, 1000, 60), 94); assert.strictEqual(clampPercent(40, 1000, 60), 40);
console.log("menubar: ok");
