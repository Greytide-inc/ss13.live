// bugstate-to.test - security step 6: an F9 state report goes back to whoever asked, never to everyone (the server sends a message
// with no player to all), even when the sender isn't a joined player yet.
import assert from "node:assert/strict";
import { installInput, onBugState } from "../build/dist/src/worker/input.js";

const posts = [], players = [{ ckey: "host", joined: true, client: null }];
const vm = { sched: { time: 0, tick: 0, sleeping: 0 }, map: { atoms: new Map() }, clients: {} };
installInput({ opts: {}, vm, log() {}, post: (m) => posts.push(m), inLog() {}, cutAt: (n) => n, logLevel: "normal", players, early: new Map(), by: () => "",
	playerOf: (ck) => (ck ? players.find((p) => p.ckey === ck.toLowerCase()) : players[0]), pixels: new Map(), fetchPixels: async () => null, normPath: (p) => p,
	fixIcons() {}, resyncRequested: new Set(), lateWakes: [], joined: true, idle: false });
onBugState("Newcomer"); // connected to the server, not in the game's player list yet
onBugState(undefined); // single-player page: the one player
onBugState("host");
assert.deepEqual(posts.map((m) => [m.type, m.player]), [["bugstate", "Newcomer"], ["bugstate", "host"], ["bugstate", "host"]]);
console.log("bugstate-to: a not-yet-joined sender's report is addressed to that sender");
