// The lobby title-screen menu (worker/lobby-menu.js): tg's playersetup window html -> menu items, in a fixed order, the current
// ready choice marked; the Lobby stat lines -> the line under the menu.
import assert from "node:assert";
import { menuItems, statLine } from "../../worker/lobby-menu.js";
const S = "byond://?src=[0x3000001]";
const pre = (st) => `<head></head><body><center><p><a href='${S};show_preferences=1'>Setup Character</a></p>${st}</center></body>`;

// before the round: tg writes [ Not Ready(bold) | Ready | Observe ] in an order that depends on the state; the menu doesn't move
const a = menuItems(pre(`<p>[ <b>Not Ready</b> | <a href='${S};ready=1'>Ready</a> | <a href='${S};ready=2'>Observe</a> ]</p>`));
assert.deepStrictEqual(a.map((i) => i.label), ["READY", "NOT READY", "OBSERVE", "SETUP CHARACTER"]);
assert.deepStrictEqual(a.map((i) => !!i.current), [false, true, false, false]);
assert.strictEqual(a[0].href, `${S};ready=1`);
assert.strictEqual(a[1].href, null); // the current choice is not a link in tg's html either
const b = menuItems(pre(`<p>[ <a href='${S};ready=1'>Ready</a> | <a href='${S};ready=0'>Not Ready</a> | <b> Observe </b> ]</p>`));
assert.deepStrictEqual(b.map((i) => i.label + (i.current ? "*" : "")), ["READY", "NOT READY", "OBSERVE*", "SETUP CHARACTER"]);

// round running: join first, then manifest, observe, character
const c = menuItems(pre(`<p><a href='${S};manifest=1'>View the Crew Manifest</a></p><p><a href='${S};late_join=1'>Join Game!</a></p><p><a href='${S};ready=2'>Observe</a></p>`));
assert.deepStrictEqual(c.map((i) => i.label), ["JOIN GAME", "CREW MANIFEST", "OBSERVE", "SETUP CHARACTER"]);
assert.strictEqual(c[0].href, `${S};late_join=1`);
assert.ok(c[0].join);

// a link the menu doesn't know (a poll, a later tg change) still shows, after the known ones
const d = menuItems(pre(`<p><a href='${S};showpoll=1'>Show Player Polls</a></p>`));
assert.deepStrictEqual(d.map((i) => i.label), ["SETUP CHARACTER", "SHOW PLAYER POLLS"]);
// entities in labels come out as text
assert.strictEqual(menuItems(`<a href='?x'>Tom &amp; Jerry</a>`)[0].label, "TOM & JERRY");

// the Lobby stat tab -> one line
assert.strictEqual(statLine([["Game Mode:", "Secret"], ["Map:", "Box Station"], ["Time To Start:", "97s"], ["Players:", "7"]]), "STARTS IN 1:37 · 7 PLAYERS");
assert.strictEqual(statLine([["Game Mode:", "Secret"], ["Map:", "Box Station"], ["Time To Start:", "DELAYED"], ["Players:", "1"]]), "START DELAYED · 1 PLAYER");
assert.strictEqual(statLine([["Game Mode:", "Secret"], ["Map:", "Box Station"]]), "BOX STATION · ROUND IN PROGRESS");
assert.strictEqual(statLine([]), "");
console.log("lobby-menu ok");
