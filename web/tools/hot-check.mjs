#!/usr/bin/env node
// hot-check - Checks tools/hot.mjs on a real server: an edited proc body is loaded into the running world and takes effect, and an edit that needs a restart is refused.
// Usage (from web/): node tools/hot-check.mjs --dist build/NAME-dist [--port 8796]      exit 0 = every check passed (~1.5 min: one world start)
// Build the dist first:  npm run build:static -- --dist build/NAME-dist --no-snapshot
// It starts its own server.mjs --hot, joins as Alpha and has her speak; between sentences it loads edited copies of two game files
// (written to build/hot/, the real files are not touched): a plain proc (say_quote), a sleeping one (say_verb), a file with a new
// var (must be refused), a proc that raises a runtime error (the log must name its line), then the real files again (speech back to normal).
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import { WebSocket } from "ws";

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const dist = opt("--dist", null), port = Number(opt("--port", "8796")), logFile = "build/hot-check.log";
if (!dist) { console.error("usage: node tools/hot-check.mjs --dist build/NAME-dist [--port 8796]"); process.exit(2); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const say = (s) => console.log(`[hot-check] ${s}`);
const fails = [];
const check = (ok, what) => { say(`${ok ? "ok  " : "FAIL"} ${what}`); if (!ok) fails.push(what); };
const up = () => new Promise((res) => { const r = http.request({ host: "127.0.0.1", port, path: "/", method: "HEAD" }, (x) => { x.resume(); res(x.statusCode === 200); }); r.on("error", () => res(false)); r.end(); });

// An edited copy of a game file: `from` must be there exactly once.
fs.mkdirSync("build/hot", { recursive: true });
const edited = (rel, from, to) => {
	const text = fs.readFileSync(`game/${rel}`, "utf8"), n = text.split(from).length - 1, out = `build/hot/check-${rel.replace(/\W/g, "_")}.ts`;
	if (n !== 1) { check(false, `game/${rel} holds the text this check edits exactly once (${n}): ${from.slice(0, 60)}`); return null; }
	fs.writeFileSync(out, text.replace(from, to));
	return `${rel}=${out}`;
};
const hot = (...files) => { const r = spawnSync(process.execPath, ["tools/hot.mjs", "--port", String(port), ...files], { encoding: "utf8" }); return { code: r.status, text: (r.stdout + r.stderr).trim() }; };

const srv = spawn(process.execPath, ["tools/server.mjs", "--dist", dist, "--port", String(port), "--log", logFile, "--seconds", "400", "--hot"], { stdio: "ignore" });
let A = null;
try {
	for (let i = 0; i < 60 && !(await up()); i++) await sleep(500);
	const chat = [];
	let views = 0;
	A = new WebSocket(`ws://127.0.0.1:${port}`);
	A.on("open", () => A.send(JSON.stringify({ type: "hello", player: "Alpha" })));
	A.on("error", () => {});
	A.on("message", (d) => {
		let m; try { m = JSON.parse(String(d)); } catch { return; }
		if (m.type === "output") for (const l of m.lines) chat.push(String(l).replace(/<[^>]*>/g, ""));
		if (m.type === "view") views++;
	});
	for (let i = 0; i < 600 && views < 5; i++) await sleep(200);
	check(views >= 5, `Alpha is in the game (${views} views)`);
	await sleep(8000); // in her body
	const speak = async (words) => {
		const at = chat.length;
		A.send(JSON.stringify({ type: "command", text: `say ${words}` }));
		for (let i = 0; i < 50; i++) { await sleep(100); const l = chat.slice(at).find((x) => x.toLowerCase().includes(words)); if (l) return l; }
		return "(nothing heard)";
	};

	let l = await speak("hot one");
	check(/says, "hot one"/i.test(l), `before any swap, speech is tg's own: ${l}`);

	const e1 = edited("code/game/say.ts", 'return fmt("＀, \\"＀\\"", [rt.callSrc(f, "say_mod"', 'return fmt("＀ HOTSWAP, \\"＀\\"", [rt.callSrc(f, "say_mod"');
	if (e1) {
		const r = hot(e1);
		check(r.code === 0 && /1 changed \(\/atom\/movable\/proc\/say_quote\)/.test(r.text), `a plain proc's new body is loaded (exit ${r.code}): ${r.text.slice(0, 200)}`);
		l = await speak("hot two");
		check(/says HOTSWAP, "hot two"/i.test(l), `the next sentence runs the new say_quote: ${l}`);
	}
	const e2 = edited("code/modules/mob/say.ts", 'yield* g.callName(f, live(f.usr), "say", [live(message)]);', 'yield* g.callName(f, live(f.usr), "say", [add("gen ", live(message))]);');
	if (e2) {
		const r = hot(e2);
		check(r.code === 0 && /1 changed \(\/mob\/verb\/say_verb\)/.test(r.text), `a sleeping proc's new body is loaded (exit ${r.code}): ${r.text.slice(0, 200)}`);
		l = await speak("hot three");
		check(/says HOTSWAP, "gen hot three"/i.test(l), `the next sentence runs both new procs: ${l}`);
	}
	const e3 = edited("code/game/machinery/autolathe.ts", "\toperating: 0,\n", "\toperating: 0,\n\thot_check_var: 0,\n");
	if (e3) {
		const r = hot(e3);
		check(r.code === 2 && /needs a rebuild and restart/.test(r.text), `a file with a new var is refused (exit ${r.code}): ${r.text.slice(0, 160)}`);
	}
	const e4 = edited("code/game/say.ts", 'return fmt("＀, \\"＀\\"", [rt.callSrc(f, "say_mod"', 'rt.callName(f, null, "hot_check_runtime", []); return fmt("＀, \\"＀\\"", [rt.callSrc(f, "say_mod"');
	if (e4) {
		const r = hot(e4), line = fs.readFileSync("game/code/game/say.ts", "utf8").split("\n").findIndex((x) => x.includes('return fmt("＀, \\"＀\\"", [rt.callSrc(f, "say_mod"')) + 1;
		await speak("hot oops");
		await sleep(500);
		const err = fs.readFileSync(logFile, "utf8").split("\n").filter((x) => /hot_check_runtime/.test(x));
		check(r.code === 0 && err.some((x) => x.includes(`game/code/game/say.ts:${line} (hot-loaded)`)), `a runtime error in loaded code names its game file and line (say.ts:${line}): ${(err[0] ?? "(no such log line)").slice(0, 260)}`);
	}
	const r = hot("game/code/game/say.ts", "game/code/modules/mob/say.ts");
	check(r.code === 0, `the real files load again (exit ${r.code}): ${r.text.slice(0, 200)}`);
	l = await speak("hot four");
	check(/says, "hot four"/i.test(l), `speech is tg's own again: ${l}`);

	const text = fs.readFileSync(logFile, "utf8");
	const bad = text.split("\n").filter((x) => /\[vm-boot\] (runtime|VM gap):|FATAL|worker thread error/.test(x) && !/Initalize_Atmos|hot_check_runtime/.test(x));
	check(bad.length === 0, `no runtime or worker error in the server log (${bad.length}${bad.length ? `: ${bad[0].slice(0, 200)}` : ""})`);
	check((text.match(/\[vm-boot\] hot: /g) ?? []).length === 5, `the server logged each swap (${(text.match(/\[vm-boot\] hot: /g) ?? []).length} "hot:" lines, 5 expected)`);
} finally {
	try { A?.close(); } catch {}
	srv.kill();
	for (const f of fs.readdirSync("build/hot")) if (f.startsWith("check-")) fs.rmSync(`build/hot/${f}`);
}
say(fails.length ? `${fails.length} FAILED` : "all passed");
process.exit(fails.length ? 1 : 0);
