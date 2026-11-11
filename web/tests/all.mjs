// all.mjs - `npm test`: runs every quick test below (after tsc), up to 8 at once, prints one line each in list order, exits 1 if any failed.
// TEST_JOBS=1 npm test runs them one by one (TEST_JOBS=N: N at once). A test still running after TEST_TIMEOUT seconds (default 120;
// the slowest takes ~15) is killed and fails: one froze for 20 min on Node 24 (2026-11-11) and held up the whole run. A test in ALONE runs by itself after the rest (it measures real time).
// A new test goes in this list. Slow or browser-heavy ones stay separate npm scripts (test:sw, test:restart, test:ui1,
// test:dmi-all, boot-check); tests/static/mem-budget.mjs and snap-time.mjs are browser measurements, not tests. Run from web/.
import { spawn } from "node:child_process";
import os from "node:os";

const WS = "--experimental-websocket";
const tests = [
	"build/dist/tests/run.js",
	"build/dist/tests/scenario-parse.test.js",
	"build/dist/tests/input-kind.test.js",
	"build/dist/tests/savefile/export-text.test.js",
	"build/dist/tests/view-marks/view-marks.test.js",
	"build/dist/tests/sight-shadow/sight-shadow.test.js",
	"build/dist/tests/sight-pop-in/sight-pop-in.test.js",
	"build/dist/tests/skin/winset-params.test.js",
	"build/dist/tests/popups/preview-png.test.js",
	"build/dist/tests/static/title-screen.test.js",
	"tests/static/menubar.test.mjs",
	"tests/static/sound.test.mjs",
	"tests/static/popup-focus.test.mjs",
	"tests/static/popup-refresh.test.mjs",
	"tests/static/diagonal.test.mjs",
	"tests/static/saybox.test.mjs",
	"tests/static/join.test.mjs",
	"tests/static/chatfilter.test.mjs",
	[WS, "tests/static/csp.test.mjs"],
	[WS, "tests/static/lobby-art.test.mjs"],
	"tests/static/lobby-menu.test.mjs",
	"tests/page-scripts.test.mjs",
	"tests/plain-gen-calls.test.mjs",
	"tests/dt-life.test.mjs",
	"tests/dt-rules.test.mjs",
	"tests/dt-props.test.mjs",
	"tests/dt-calls.test.mjs",
	"tests/dt-vars.test.mjs",
	"tests/unreachable.test.mjs",
	"tests/name-check.test.mjs",
	"tests/pb-spellings.test.mjs",
	"tests/sleep0.test.mjs",
	"tests/waitfor0.test.mjs",
	"tests/error-lines.test.mjs",
	"tests/pace.test.mjs",
	"tests/tick-wait.test.mjs",
	"tests/view-merge.test.mjs",
	"tests/carried-light.test.mjs",
	"tests/glide.test.mjs",
	"tests/view-pack.test.mjs",
	"tests/jitter-buffer.test.mjs",
	"tests/static/statusdisplay.test.mjs",
	"tests/input-check.test.mjs",
	"tests/server-http.test.mjs",
	"tests/server-private.test.mjs",
	"tests/server-bans.test.mjs",
	"tests/server-saves-broken.test.mjs",
	"tests/public-export-guard.test.mjs",
	"tests/bugstate-to.test.mjs",
	"tests/static/pixi-no-eval.test.mjs",
	// drawing, icons, appearances (were only in test:draw / test:dmi / test:appearance / test:screen-loc)
	"build/dist/tests/draw/draw.test.js",
	"build/dist/tests/draw/byond-transform.test.js",
	"build/dist/tests/draw/maptext.test.js",
	"build/dist/tests/draw/anim.test.js",
	"build/dist/tests/draw/inherit.test.js",
	"build/dist/tests/draw/hit-test.test.js",
	"build/dist/tests/draw/sprite-lookup.test.js",
	"build/dist/tests/draw/door-anim.test.js",
	"build/dist/tests/draw/widescreen.test.js",
	"build/dist/tests/draw/hud-zoom.test.js",
	"build/dist/tests/draw/dirty-scene.test.js",
	"build/dist/tests/draw/light-fade.test.js",
	"build/dist/tests/draw/carried-walk.test.js",
	"build/dist/tests/draw/put-down.test.js",
	"build/dist/tests/draw/mech-turn.test.js",
	"build/dist/tests/draw/mob-swap.test.js",
	"build/dist/tests/draw/rider-cam.test.js",
	"build/dist/tests/draw/chunk-index.test.js",
	"build/dist/tests/draw/inc-place.test.js",
	"build/dist/tests/draw/inc-chunk.test.js",
	"build/dist/tests/draw/screen-loc.test.js",
	"build/dist/tests/dmi/dmi.test.js",
	"build/dist/tests/dmi/animation.test.js",
	"build/dist/tests/appearance/appearance.test.js",
	"build/dist/src/vfs/vfs.test.js",
	"build/dist/src/vfs/persist.test.js",
	"build/dist/tests/compare-logs/compare-logs.test.js",
	// tgui windows against fixtures (last: the slowest)
	[WS, "tools/tgui-quick.mjs", "stack-3sheets", "communications_console-purchase", "mecha_fabricator-parts", "autolathe-category", "pda-main", "pda-messenger", "pda-bots", "pda-chat", "pda-messages"],
];

const ALONE = new Set(["tests/tick-wait.test.mjs"]);
// started first (output order is unchanged): the longest ones, so none begins last and holds up the end
const FIRST = ["tests/server-private.test.mjs", "tests/static/csp.test.mjs", "tests/static/lobby-art.test.mjs", "build/dist/tests/sight-shadow/sight-shadow.test.js", "tools/tgui-quick.mjs"];
const LIMIT = 1000 * (Number(process.env.TEST_TIMEOUT) || 120);
const JOBS = Math.max(1, Number(process.env.TEST_JOBS) || Math.min(8, os.availableParallelism()));

const run = (args) => new Promise((done) => {
	const t1 = Date.now(), out = [];
	const p = spawn(process.execPath, args, { stdio: ["ignore", "pipe", "pipe"] });
	p.stdout.on("data", (d) => out.push(d));
	p.stderr.on("data", (d) => out.push(d));
	const timer = setTimeout(() => { out.push(Buffer.from(`(timed out: still running after ${LIMIT / 1000} s, killed)\n`)); p.kill("SIGKILL"); }, LIMIT);
	p.on("close", (code, signal) => clearTimeout(timer) ?? done({ code, signal, out: Buffer.concat(out).toString("utf8"), s: ((Date.now() - t1) / 1000).toFixed(1) }));
});

const failed = [];
const t0 = Date.now();
const jobs = tests.map((t) => { const args = Array.isArray(t) ? t : [t]; return { args, name: args.find((a) => !a.startsWith("--")) }; });
const results = new Array(jobs.length);
const waiting = [];
for (let i = 0; i < jobs.length; i++) results[i] = new Promise((r) => (waiting[i] = r));
let shown = 0;
const show = async () => { // print finished results in list order
	for (; shown < jobs.length; shown++) {
		const r = await results[shown], { name } = jobs[shown];
		if (r.code === 0) console.log(`ok   ${name} (${r.s} s)`);
		else {
			failed.push(name);
			console.log(`FAIL ${name} (${r.s} s, exit ${r.code ?? r.signal})\n${r.out.trimEnd()}\n`);
		}
	}
};
const printer = show();
const side = jobs.map((j, i) => i).filter((i) => !ALONE.has(jobs[i].name));
side.sort((a, b) => (FIRST.includes(jobs[a].name) ? 0 : 1) - (FIRST.includes(jobs[b].name) ? 0 : 1) || a - b);
let next = 0;
await Promise.all(Array.from({ length: JOBS }, async () => {
	while (next < side.length) { const i = side[next++]; waiting[i](await run(jobs[i].args)); }
}));
for (let i = 0; i < jobs.length; i++) if (ALONE.has(jobs[i].name)) waiting[i](await run(jobs[i].args));
await printer;
console.log(`\n${tests.length - failed.length}/${tests.length} ok in ${((Date.now() - t0) / 1000).toFixed(0)} s${failed.length ? `; FAILED: ${failed.join(", ")}` : ""}`);
process.exit(failed.length ? 1 : 0);
