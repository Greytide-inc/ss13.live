// all.mjs - `npm test`: runs every quick test below in turn (after tsc), prints one line each, exits 1 if any failed.
// A new test goes in this list. Slow or browser-heavy ones stay separate npm scripts (test:sw, test:restart, test:ui1,
// test:dmi-all, boot-check); tests/static/mem-budget.mjs and snap-time.mjs are browser measurements, not tests. Run from web/.
import { spawnSync } from "node:child_process";

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
	"tests/page-scripts.test.mjs",
	"tests/dm-lines-cols.test.mjs",
	"tests/plain-gen-calls.test.mjs",
	"tests/unreachable.test.mjs",
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

const failed = [];
const t0 = Date.now();
for (const t of tests) {
	const args = Array.isArray(t) ? t : [t];
	const name = args.find((a) => !a.startsWith("--"));
	const t1 = Date.now();
	const r = spawnSync(process.execPath, args, { encoding: "utf8", maxBuffer: 1 << 26 });
	const s = ((Date.now() - t1) / 1000).toFixed(1);
	if (r.status === 0) {
		console.log(`ok   ${name} (${s} s)`);
	} else {
		failed.push(name);
		console.log(`FAIL ${name} (${s} s, exit ${r.status ?? r.signal})\n${(r.stdout + r.stderr).trimEnd()}\n`);
	}
}
console.log(`\n${tests.length - failed.length}/${tests.length} ok in ${((Date.now() - t0) / 1000).toFixed(0)} s${failed.length ? `; FAILED: ${failed.join(", ")}` : ""}`);
process.exit(failed.length ? 1 : 0);
