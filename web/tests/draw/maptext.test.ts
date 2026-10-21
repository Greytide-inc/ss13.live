// maptext.test.ts - pure Node tests for src/render/maptext.ts's HTML-subset parser and box-rect
// math. No DOM/canvas needed (parseMaptext/maptextBoxRect are plain functions) -- every case is
// hand-worked in a comment next to it.
//
// Usage: part of npm test (tests/all.mjs).

import { drawMaptext, parseMaptext, maptextBoxRect, wrapMaptextLine, wrapMaptextDoc, type MaptextRun } from "../../src/render/maptext.js";

let failures = 0;
function check(name: string, got: unknown, want: unknown): void {
	const g = JSON.stringify(got);
	const w = JSON.stringify(want);
	if (g === w) {
		console.log(`ok   ${name}`);
	} else {
		failures++;
		console.log(`FAIL ${name}: got ${g} want ${w}`);
	}
}

const run = (text: string, opts: Partial<MaptextRun> = {}): MaptextRun => ({
	text, color: null, fontSize: null, bold: false, ...opts,
});

// ---- plain text: no tags at all ----
check("plain text, one run, one line, left align", parseMaptext("Hello"), {
	align: "left",
	valign: "bottom",
	lines: [[run("Hello")]],
});

// ---- <br>: explicit line break, one per tag ----
check("br splits into two lines", parseMaptext("Line1<br>Line2"), {
	align: "left",
	valign: "bottom",
	lines: [[run("Line1")], [run("Line2")]],
});
check("self-closing br/> also splits", parseMaptext("A<br/>B<br />C"), {
	align: "left",
	valign: "bottom",
	lines: [[run("A")], [run("B")], [run("C")]],
});

// ---- <font color=...> ----
check("font color applies to its content only, closes cleanly", parseMaptext("<font color='red'>Hi</font> there"), {
	align: "left",
	valign: "bottom",
	lines: [[run("Hi", { color: "red" }), run(" there")]],
});
check("font color, double-quoted attribute", parseMaptext('<font color="#e36600">50%</font>'), {
	align: "left",
	valign: "bottom",
	lines: [[run("50%", { color: "#e36600" })]],
});

// ---- <span style="color:...;font-size:..."> ----
check("span style sets color and font-size together", parseMaptext('<span style="color:#ff0000;font-size:10px">Big</span>'), {
	align: "left",
	valign: "bottom",
	lines: [[run("Big", { color: "#ff0000", fontSize: 10 })]],
});
check("span style with only font-size leaves color unset", parseMaptext('<span style="font-size:12px">X</span>'), {
	align: "left",
	valign: "bottom",
	lines: [[run("X", { fontSize: 12 })]],
});

// ---- <b> ----
check("b sets bold, plain text after it is not bold", parseMaptext("<b>Bold</b>Norm"), {
	align: "left",
	valign: "bottom",
	lines: [[run("Bold", { bold: true }), run("Norm")]],
});

// ---- nesting: font inside b, b inside font ----
check("nested font+b: both properties apply to the innermost text", parseMaptext("<font color='blue'><b>B</b></font>"), {
	align: "left",
	valign: "bottom",
	lines: [[run("B", { color: "blue", bold: true })]],
});

// ---- text-align: one alignment for the whole box, taken from the first text character
// (BYOND 511 screenshots, web/reference/render-rules/) ----
check("span text-align sets box-wide alignment", parseMaptext('<span style="text-align:center">X</span>'), {
	align: "center",
	valign: "bottom",
	lines: [[run("X")]],
});
check("BYOND: first text's align wins (R1 right, L2 plain)", parseMaptext("<span style='text-align:right'>R1</span><br>L2").align, "right");
check("BYOND: first text's align wins (L1 plain, R2 right)", parseMaptext("L1<br><span style='text-align:right'>R2</span>").align, "left");
check("BYOND: first text's align wins (L then centered CC)", parseMaptext("L<span style='text-align:center'>CC</span>").align, "left");
check("BYOND: first text's align wins (C1 center, R2 right)", parseMaptext("<span style='text-align:center'>C1</span><br><span style='text-align:right'>R2</span>").align, "center");

// ---- <div align/valign>: whole box, like text-align (BYOND 511 screenshots) ----
check("div align=center centers the box", parseMaptext("<div align='center'>Hi</div>"), {
	align: "center",
	valign: "bottom",
	lines: [[run("Hi")]],
});
// A real tg maptext string (blob_mobs.dm): div align center + valign middle apply (BYOND 511 shows
// tg's HUD counters centred both ways); position:relative is ignored; the inner <font color> works.
check("real tg example: div align/valign kept, inner font color kept", parseMaptext(
	"<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='#e36600'>50%</font></div>",
), {
	align: "center",
	valign: "middle",
	lines: [[run("50%", { color: "#e36600" })]],
});

// ---- entities ----
check("HTML entities are decoded", parseMaptext("A &amp; B &lt;3"), {
	align: "left",
	valign: "bottom",
	lines: [[run("A & B <3")]],
});

// ---- empty / whitespace-only ----
check("empty string: one empty line", parseMaptext(""), { align: "left", valign: "bottom", lines: [[]] });

// ---- maptextBoxRect: default box sits over the tile's own 32x32 footprint (bottom-left anchored,
// like a standard icon), maptext_x/y shift it (y-up, so maptext_y is subtracted from the y axis) ----
check("default box (x=0,y=0,32x32) sits exactly over the tile", maptextBoxRect(
	{ maptext: "x", maptextWidth: 32, maptextHeight: 32, maptextX: 0, maptextY: 0 }, 100, 200, 32,
), { x: 100, y: 200, w: 32, h: 32 });
check("maptext_y > 0 moves the box UP (y-up, subtracted from screen y)", maptextBoxRect(
	{ maptext: "x", maptextWidth: 32, maptextHeight: 32, maptextX: 0, maptextY: 10 }, 100, 200, 32,
), { x: 100, y: 190, w: 32, h: 32 });
check("maptext_x > 0 moves the box right", maptextBoxRect(
	{ maptext: "x", maptextWidth: 32, maptextHeight: 32, maptextX: 5, maptextY: 0 }, 100, 200, 32,
), { x: 105, y: 200, w: 32, h: 32 });
check("a taller box (maptext_height=64) extends upward from the tile's bottom", maptextBoxRect(
	{ maptext: "x", maptextWidth: 32, maptextHeight: 64, maptextX: 0, maptextY: 0 }, 100, 200, 32,
), { x: 100, y: 168, w: 32, h: 64 });

// ---- wrapMaptextLine / wrapMaptextDoc: word wrap, pure, measured with a fixed-width stub so
// this runs in Node with no canvas. Each stub gives every character (including space) the SAME
// width, so the wrap points below are hand-worked arithmetic, not font metrics. ----

const uniform = (w: number) => () => w; // every char (any run) is `w` px wide, per the stub above

// maxWidth=3, 1px/char: "ab cd" -> boundary at the space doesn't overflow yet (posX==3, not >3), so
// the break only lands once 'c' pushes posX to 4 -- landing exactly at the space->'c' boundary index,
// so the trailing space stays attached to the first output line (worked by hand in the file header).
check("word wrap: breaks at the boundary once the word after it overflows", wrapMaptextLine(
	[run("ab cd")], 3, uniform(1),
), [[run("ab ")], [run("cd")]]);

// maxWidth=2, one unbroken word "abcd": no boundaries at all, so it's a pure force-split every 2
// characters (mirrors OpenDream's WordWrap.NextMetrics splitting mid-word).
check("word wrap: force-splits an unbroken word with no boundaries", wrapMaptextLine(
	[run("abcd")], 2, uniform(1),
), [[run("ab")], [run("cd")]]);

// maxWidth=1, "ab": each character exactly fills a line on its own.
check("word wrap: one char per line when maxWidth exactly fits one", wrapMaptextLine(
	[run("ab")], 1, uniform(1),
), [[run("a")], [run("b")]]);

// A single character wider than maxWidth on its own: OpenDream's "abort" case -- give up wrapping
// and let it overflow unbroken, rather than emit an empty line.
check("word wrap: gives up (no break) when even one character can't fit", wrapMaptextLine(
	[run("a")], 3, uniform(5),
), [[run("a")]]);

// maxWidth<=0 and an empty line are both passed through unchanged.
check("word wrap: maxWidth<=0 passes the line through unchanged", wrapMaptextLine(
	[run("ab")], 0, uniform(1),
), [[run("ab")]]);
check("word wrap: an empty line passes through unchanged", wrapMaptextLine([], 10, uniform(1)), [[]]);

check("div valign alone does not set align (\\b in attr)", parseMaptext("<div valign='middle'>VM</div>").align, "left");
check("div valign=middle", parseMaptext("<div valign='middle'>VM</div>").valign, "middle");

// wrapMaptextDoc wraps EVERY <br>-split line independently and keeps `align`.
check("wrapMaptextDoc wraps each <br> line separately, keeps align", wrapMaptextDoc(
	{ align: "center", valign: "middle", lines: [[run("abcd")], [run("ef")]] }, 2, uniform(1),
), { align: "center", valign: "middle", lines: [[run("ab")], [run("cd")], [run("ef")]] });

// a style with text-shadow draws a black 1 px outline (4 offset copies) under each run; plain maptext draws one copy.
{
	const fake = () => { const calls: [string, number, number][] = []; let fill = ""; const ctx: any = { save() {}, restore() {}, beginPath() {}, rect() {}, clip() {}, measureText: (t: string) => ({ width: t.length * 5 }), fillText(t: string, x: number, y: number) { calls.push([fill, x, y]); }, set fillStyle(v: string) { fill = v; }, get fillStyle() { return fill; } }; return { ctx, calls }; };
	const box = { maptextX: 0, maptextY: 0, maptextWidth: 64, maptextHeight: 16 };
	const plain = fake(); drawMaptext(plain.ctx, { ...box, maptext: "<div style='color:#fff'>hi</div>" } as any, 0, 0, 32);
	const shadowed = fake(); drawMaptext(shadowed.ctx, { ...box, maptext: "<div style='color:#fff;text-shadow:1px 1px 1px #000;'>hi</div>" } as any, 0, 0, 32);
	check("maptext without text-shadow draws once", plain.calls.length, 1);
	check("maptext with text-shadow draws 4 black copies then the text", [shadowed.calls.length, shadowed.calls.slice(0, 4).every((c) => c[0] === "#000000"), shadowed.calls[4][0]], [5, true, "#fff"]);
}

console.log(failures === 0 ? "\nALL MAPTEXT TESTS PASSED" : `\n${failures} maptext test failure(s)`);
if (failures) process.exitCode = 1;
