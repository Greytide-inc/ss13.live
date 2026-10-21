// maptext - BYOND's maptext is a small HTML subset drawn on top of an atom's icon, in
// a box `maptext_width x maptext_height` px, anchored at the atom's bottom-left plus
// `maptext_x`/`maptext_y` (y-up, like pixel_x/pixel_y). This file has three parts:
//
//  - parseMaptext(): a PURE parser (no DOM, no canvas) turning the HTML string into a plain
//    { align, lines } structure (lines split only on explicit <br>). Testable in Node
//    (tests/draw/maptext.test.ts) with hand-worked cases.
//  - wrapMaptextDoc()/wrapMaptextLine(): a PURE word-wrap pass that further splits each <br>
//    line into as many lines as needed to fit `maptext_width`, given a caller-supplied per-character
//    measure function. Also pure/Node-testable with a fixed-width stub measurer.
//  - drawMaptext(): the canvas-only half that wraps (using real ctx.measureText), lays the lines out
//    bottom-anchored in the box (see below), and clips to it. Used by station-client.ts (the static
//    station bake) and client-scene.ts (the live scene).
//
// --- findings ----------------------------------------------------------------------------------
//
// **Word wrap (moderate-high confidence).** No live BYOND 511 reference text exists under env/byond
// (a long-standing gap -- `env/byond` is the installed BYOND *runtime* distribution,
// not source, and has no maptext docs or samples). The best evidence found is OpenDream's client
// renderer, `env/src/OpenDream/OpenDreamClient/Rendering/MapTextRenderer.cs`: its `ProcessWordWrap`
// (a direct, heavily-commented reimplementation aimed at matching real BYOND clients) wraps at word
// boundaries (space or `-`) and, if a single word is wider than the box on its own, force-splits it
// mid-word at the character where it stops fitting (see `WordWrap.NextMetrics`: `if (_wordSizePixels
// > _maxSizeX)` inserts a break inside the word). This matches the description of BYOND's
// rule exactly ("wraps at word boundaries; a word longer than the box breaks where it overflows"),
// so `wrapMaptextLine` below is a direct character-level port of that algorithm (same boundary rule,
// same force-split-when-a-lone-word-cannot-fit-even-one-line rule, same "give up wrapping further if
// not even one character fits" edge case). OpenDream is a reimplementation, not BYOND's own source,
// so this is corroborating evidence, not proof -- moderate-high confidence, not certain.
//
// **Vertical anchor: BOTTOM of the box, not the top (moderate-high confidence, and a change from
// the earlier undocumented top-anchor).** Traced through OpenDream's actual render path:
// `DreamViewOverlay.DrawIcon` (`OpenDreamClient/Rendering/DreamViewOverlay.cs` ~line 518) rents a
// render target of exactly `maptext_width x maptext_height` and calls
// `MapTextRenderer.RenderToTarget(handle, renderTarget, maptext)`. Inside `RenderToTarget`
// (`MapTextRenderer.cs`), the *content's own* wrapped height is computed first (`ProcessWordWrap`
// returns `height`, the sum of the actual line heights used -- NOT the box's fixed height), then:
// `var baseLine = new Vector2(0, height - lineHeight);` and each subsequent line does
// `baseLine.Y -= lineHeight`, so the FIRST line is drawn highest and the LAST line ends up exactly at
// local y=0. Drawing happens via `DrawingHandleWorld` (Robust's Y-up *world*-space handle, the same
// convention BYOND's own pixel_x/pixel_y use -- "up" is a larger Y), and the surrounding
// `SetTransform(CreateRenderTargetFlipMatrix(texture.Size, Vector2.Zero))` maps local y=0 to the
// BOTTOM of the render target (`FlipMatrix` negates Y, then translates by `renderTargetSize.Y`, so
// local y=0 lands at the target's bottom edge, and local y=height sits `height` px above that).
// Net effect: text is anchored to the BOTTOM of the maptext box and grows UPWARD as more lines are
// added -- a single short line sits flush with the box's bottom edge, with empty space above it, not
// below. This is a real behavioural change from the earlier code (which drew from `box.y`, the box's TOP,
// undocumented as a guess). `drawMaptext` below now starts its first line at
// `box.y + box.h - totalTextHeight` instead of `box.y`, so overflow (when wrapped content is taller
// than the box) clips off the TOP of the box, not the bottom -- matching a render target that is
// exactly `maptext_height` tall and just doesn't have room to draw the earliest lines. This is
// evidence from OpenDream's client, not a live BYOND capture -- moderate-high, not certain.
//
// BYOND 511 checked (web/reference/render-rules/): bottom anchor right; align/valign are whole-box,
// from the first text character; <div valign> works in 511; position:relative is ignored.
//
// Supported subset -- anything else falls through to plain text (the tag is dropped,
// its content is kept, unstyled):
//  - plain text
//  - <br> (and <br/>) -- explicit line break
//  - <font color="...">...</font>
//  - <span style="color:...; font-size:...; text-align:...">...</span>
//  - <b>...</b>
//  - <div align=... valign=... style=...>...</div>
//  - text-align / align / valign: whole box, taken from the first text character (see above)
//
// Font: tg's skin sets the map to Arial 7pt; drawMaptext() uses Arial (Liberation Sans, same metrics).

export type MaptextAlign = "left" | "center" | "right";

export interface MaptextRun {
	text: string;
	color: string | null; // CSS color string, or null = default (white, BYOND's maptext default)
	fontSize: number | null; // px, or null = default (7, the stand-in for BYOND's 7pt bitmap font)
	bold: boolean;
}

export type MaptextValign = "top" | "middle" | "bottom";

export interface MaptextDoc {
	align: MaptextAlign;
	valign: MaptextValign;
	lines: MaptextRun[][];
}

// tg's skin.dmf map element: Arial 7pt, text-color none (-> white). BYOND 511 screenshot (
// web/reference/render-rules/): 7pt Arial = 9.33px, 9px line pitch, baseline 3px above the line bottom.
const DEFAULT_FONT_PX = 7 * 96 / 72;
const PT_TO_PX = 96 / 72;
const fontOf = (run: MaptextRun) => `${run.bold ? "bold " : ""}${run.fontSize ?? DEFAULT_FONT_PX}px Arial, "Liberation Sans", sans-serif`;

/** Parses one `style="..."` attribute value into the handful of properties this subset understands.
 *  Unknown properties are ignored (fall through silently, the "anything else" rule --
 *  applied at the property level here, same as at the tag level in parseMaptext). */
function parseStyle(style: string): { color: string | null; fontSize: number | null; align: MaptextAlign | null } {
	let color: string | null = null;
	let fontSize: number | null = null;
	let align: MaptextAlign | null = null;
	for (const decl of style.split(";")) {
		const m = /^\s*([\w-]+)\s*:\s*(.+?)\s*$/.exec(decl);
		if (!m) continue;
		const [, prop, rawValue] = m;
		const value = rawValue.trim();
		if (prop === "color") color = value;
		else if (prop === "font-size") {
			const n = parseFloat(value);
			if (!Number.isNaN(n)) fontSize = value.endsWith("pt") ? n * PT_TO_PX : n;
		} else if (prop === "text-align") {
			if (value === "left" || value === "center" || value === "right") align = value;
		}
	}
	return { color, fontSize, align };
}

/** Parses one tag's attribute string for a single `name="value"`/`name='value'`/`name=value`
 *  attribute. Case-insensitive on the attribute name. */
function attr(tagBody: string, name: string): string | null {
	const re = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i");
	const m = re.exec(tagBody);
	if (!m) return null;
	return m[1] ?? m[2] ?? m[3] ?? null;
}

const ENTITIES: Record<string, string> = {
	amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
};

function decodeEntities(text: string): string {
	return text.replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (whole, ent: string) => {
		if (ent[0] === "#") {
			const code = ent[1] === "x" || ent[1] === "X" ? parseInt(ent.slice(2), 16) : parseInt(ent.slice(1), 10);
			return Number.isNaN(code) ? whole : String.fromCodePoint(code);
		}
		return ENTITIES[ent.toLowerCase()] ?? whole;
	});
}

interface StyleFrame {
	align: MaptextAlign;
	valign: MaptextValign;
	color: string | null;
	fontSize: number | null;
	bold: boolean;
}

/** Parses a BYOND maptext HTML-subset string into lines of styled runs, per this file's header.
 *  Pure function: no DOM APIs, so it's usable from a canvas renderer or a Node test alike. */
export function parseMaptext(html: string): MaptextDoc {
	// BYOND 511: one align/valign for the whole box, the one in effect at the first text char.
	let align: MaptextAlign | null = null;
	let valign: MaptextValign = "bottom";
	const lines: MaptextRun[][] = [[]];
	const stack: StyleFrame[] = [{ align: "left", valign: "bottom", color: null, fontSize: null, bold: false }];
	const currentLine = () => lines[lines.length - 1];

	const pushText = (raw: string) => {
		const text = decodeEntities(raw);
		if (text === "") return;
		const top = stack[stack.length - 1];
		if (align === null) ({ align, valign } = top);
		currentLine().push({ text, color: top.color, fontSize: top.fontSize, bold: top.bold });
	};

	// Tokenize on tags; everything between them is plain text (including literal newlines, which
	// BYOND's maptext does NOT turn into line breaks -- only <br> does -- so they're kept as spaces
	// to match how a single-line HTML string with a stray \n in the DM source would actually render).
	const tagRe = /<[^>]*>/g;
	let last = 0;
	let m: RegExpExecArray | null;
	while ((m = tagRe.exec(html)) !== null) {
		if (m.index > last) pushText(html.slice(last, m.index).replace(/\n/g, " "));
		last = tagRe.lastIndex;
		const tag = m[0];
		const body = tag.slice(1, -1).trim(); // strip < >
		const closing = body.startsWith("/");
		const nameMatch = /^\/?\s*([a-zA-Z0-9]+)/.exec(body);
		const name = nameMatch ? nameMatch[1].toLowerCase() : "";

		if (name === "br") {
			lines.push([]);
			continue;
		}
		if (name === "font" && !closing) {
			const color = attr(body, "color");
			const top = stack[stack.length - 1];
			stack.push({ ...top, color: color ?? top.color });
			continue;
		}
		if ((name === "span" || name === "div") && !closing) {
			const style = attr(body, "style");
			const top = stack[stack.length - 1];
			let next: StyleFrame = { ...top };
			const a = attr(body, "align")?.toLowerCase();
			if (a === "left" || a === "center" || a === "right") next.align = a;
			const v = attr(body, "valign")?.toLowerCase();
			if (v === "top" || v === "middle" || v === "bottom") next.valign = v;
			if (style) {
				const parsed = parseStyle(style);
				if (parsed.color !== null) next.color = parsed.color;
				if (parsed.fontSize !== null) next.fontSize = parsed.fontSize;
				if (parsed.align !== null) next.align = parsed.align;
			}
			stack.push(next);
			continue;
		}
		if (name === "b" && !closing) {
			const top = stack[stack.length - 1];
			stack.push({ ...top, bold: true });
			continue;
		}
		if ((name === "font" || name === "span" || name === "div" || name === "b") && closing) {
			if (stack.length > 1) stack.pop();
			continue;
		}
		// Any other tag (div, valign, position styling, etc.): drop the tag itself, keep going --
		// its content still comes through as plain text at the CURRENT style, the
		// "anything else is shown as its plain text" rule. Self-closing/void tags contribute nothing.
	}
	if (last < html.length) pushText(html.slice(last).replace(/\n/g, " "));

	return { align: align ?? "left", valign, lines };
}

// --- Word wrap (pure, Node-testable) ------------------------------------------------------------

interface FlatChar {
	ch: string;
	run: MaptextRun;
	w: number;
}

function isWrapBoundaryChar(ch: string): boolean {
	return ch === " " || ch === "-";
}

/** Flattens one already-<br>-split line of runs into one character per entry, each carrying its own
 *  measured width (via `measureChar`) and the styling of the run it came from. Iterates by Unicode
 *  code point (`for...of` on a string), not UTF-16 code unit, so surrogate pairs stay together. */
function flattenLine(line: MaptextRun[], measureChar: (ch: string, run: MaptextRun) => number): FlatChar[] {
	const flat: FlatChar[] = [];
	for (const run of line) {
		for (const ch of run.text) {
			flat.push({ ch, run, w: measureChar(ch, run) });
		}
	}
	return flat;
}

/** Re-groups a slice of FlatChars back into MaptextRuns, merging consecutive chars that share the
 *  same style (color/fontSize/bold) back into one run -- cosmetic (fewer ctx.font switches when
 *  drawing) but not required for correctness. */
function regroupRuns(chars: FlatChar[]): MaptextRun[] {
	const out: MaptextRun[] = [];
	for (const { ch, run } of chars) {
		const top = out[out.length - 1];
		if (top && top.color === run.color && top.fontSize === run.fontSize && top.bold === run.bold) {
			top.text += ch;
		} else {
			out.push({ text: ch, color: run.color, fontSize: run.fontSize, bold: run.bold });
		}
	}
	return out;
}

/** Word-wraps a single already-<br>-split line to fit `maxWidth`, per this file's header: breaks at
 *  word boundaries (space or `-`); a single word wider than `maxWidth` on its own is force-split
 *  mid-word at the character where it stops fitting. A direct character-level port of OpenDream's
 *  `MapTextRenderer.WordWrap` (see header). `measureChar(ch, run)` returns that character's pixel
 *  width in its run's font -- pure, so tests can pass a fixed-width stub instead of a real canvas
 *  context. Returns one or more output lines (never zero, even for an empty input line). */
export function wrapMaptextLine(line: MaptextRun[], maxWidth: number, measureChar: (ch: string, run: MaptextRun) => number): MaptextRun[][] {
	if (maxWidth <= 0 || line.length === 0) return [line];
	const flat = flattenLine(line, measureChar);
	if (flat.length === 0) return [line];

	const breaks: number[] = []; // insert a line break BEFORE flat[index], for each index here
	let posX = 0;
	let wordSizePx = 0;
	let wordStartIndex: number | null = 0;
	let lastCh = "A"; // seed as a non-boundary char, matching WordWrap's own seed
	let forceSplitStart: number | null = null;
	let forceSplitWordSizeAtStart = 0;
	let gaveUp = false;

	for (let i = 0; i < flat.length; i++) {
		const { ch, w } = flat[i];
		if (isWrapBoundaryChar(lastCh) || isWrapBoundaryChar(ch)) {
			// Word boundary: the word just before it is now known in full.
			if (posX > maxWidth && lastCh !== " ") {
				if (wordStartIndex !== null) {
					breaks.push(wordStartIndex);
					posX = wordSizePx;
				}
			}
			wordSizePx = 0;
			wordStartIndex = i;
			forceSplitStart = null;
		}
		const oldWordSize = wordSizePx;
		wordSizePx += w;
		posX += w;
		if (posX > maxWidth) {
			if (forceSplitStart === null) {
				forceSplitStart = i;
				forceSplitWordSizeAtStart = oldWordSize;
			}
			if (wordSizePx > maxWidth) {
				if (forceSplitWordSizeAtStart === 0) {
					// Not even a single character fits on its own line -- give up wrapping the rest
					// of this line, same as OpenDream's `abort` case.
					gaveUp = true;
					break;
				}
				breaks.push(forceSplitStart);
				wordSizePx -= forceSplitWordSizeAtStart;
				wordStartIndex = null;
				posX = wordSizePx;
				forceSplitStart = null;
			}
		}
		lastCh = ch;
	}
	if (!gaveUp && posX > maxWidth && wordStartIndex !== null) {
		breaks.push(wordStartIndex);
	}

	if (breaks.length === 0) return [line];
	const out: MaptextRun[][] = [];
	let start = 0;
	for (const b of breaks) {
		out.push(regroupRuns(flat.slice(start, b)));
		start = b;
	}
	out.push(regroupRuns(flat.slice(start)));
	return out;
}

/** Word-wraps every line of a parsed maptext doc (see wrapMaptextLine); `align` passes through
 *  unchanged (wrapping doesn't affect box-wide alignment). */
export function wrapMaptextDoc(doc: MaptextDoc, maxWidth: number, measureChar: (ch: string, run: MaptextRun) => number): MaptextDoc {
	const lines: MaptextRun[][] = [];
	for (const line of doc.lines) lines.push(...wrapMaptextLine(line, maxWidth, measureChar));
	return { align: doc.align, valign: doc.valign, lines };
}

// --- Canvas drawing ---------------------------------------------------------------------------

export interface MaptextBox {
	maptext: string | null;
	maptextWidth: number;
	maptextHeight: number;
	maptextX: number;
	maptextY: number;
}

/** Where the maptext box sits on the tile-local canvas: same anchoring convention as the icon
 *  itself (drawLayer in station-client.ts) -- bottom-left of the atom's own tile footprint, plus
 *  maptext_x/maptext_y (y-up, so maptext_y is SUBTRACTED to move the box up on screen). `tileSize`
 *  is the tile's own pixel height (32, TILE_PX) -- the box's bottom-left starts at the tile's
 *  bottom-left corner by default (maptext_x=0, maptext_y=0, matching the default 32x32 box sitting
 *  exactly over one tile cell, same footprint as a standard icon). */
export function maptextBoxRect(a: MaptextBox, originX: number, originY: number, tileSize: number): { x: number; y: number; w: number; h: number } {
	const x = originX + a.maptextX;
	const bottom = originY + tileSize - a.maptextY;
	const y = bottom - a.maptextHeight;
	return { x, y, w: a.maptextWidth, h: a.maptextHeight };
}

/** Measures one character's pixel width in its run's font, via a real canvas context (switches
 *  `ctx.font` per call, so it's for use inside drawMaptext only -- tests use a cheap stub instead,
 *  since wrapMaptextLine itself is pure). */
function measureCharOnCanvas(ctx: CanvasRenderingContext2D, ch: string, run: MaptextRun): number {
	ctx.font = fontOf(run);
	return ctx.measureText(ch).width;
}

/** Draws one atom/overlay's maptext (if it has any set), word-wrapped and clipped to its box, and
 *  anchored to the box's BOTTOM (see this file's header "Vertical anchor" finding) -- a single short
 *  line sits flush with the box's bottom edge; if wrapped content is taller than the box, the
 *  earliest lines are what gets clipped off (at the top), not the latest. `originX`/`originY` are the
 *  tile's own top-left in the destination canvas (same convention as drawLayer); `tileSize` is
 *  normally TILE_PX (32) -- passed explicitly so this module has no station-client.ts import. */
const OUTLINE_OFFSETS: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

export function drawMaptext(ctx: CanvasRenderingContext2D, a: MaptextBox, originX: number, originY: number, tileSize: number): void {
	if (!a.maptext) return;
	const parsed = parseMaptext(a.maptext);
	const outlined = a.maptext.includes("text-shadow");
	const box = maptextBoxRect(a, originX, originY, tileSize);
	if (box.w <= 0 || box.h <= 0) return;
	const doc = wrapMaptextDoc(parsed, box.w, (ch, run) => measureCharOnCanvas(ctx, ch, run));

	ctx.save();
	ctx.beginPath();
	ctx.rect(box.x, box.y, box.w, box.h);
	ctx.clip();
	ctx.textBaseline = "alphabetic";

	// ponytail: pitch = round(px), baseline 0.3*px above the line bottom; measured only at 7pt.
	const pxOf = (line: MaptextRun[]) => Math.max(...line.map((r) => r.fontSize ?? DEFAULT_FONT_PX), DEFAULT_FONT_PX);
	const lineHeightOf = (line: MaptextRun[]) => Math.round(pxOf(line));
	const totalHeight = doc.lines.reduce((sum, line) => sum + lineHeightOf(line), 0);
	// bottom-anchored by default (grows upward, overflow clips at the top); <div valign> moves it.
	let y = doc.valign === "top" ? box.y : doc.valign === "middle" ? box.y + (box.h - totalHeight) / 2 : box.y + box.h - totalHeight;
	y = Math.round(y);
	for (const line of doc.lines) {
		const lineHeight = lineHeightOf(line);
		const baseline = y + lineHeight - Math.round(pxOf(line) * 0.3);
		if (line.length === 0) {
			y += lineHeight;
			continue;
		}
		// Measure the whole line (each run in its own font) to place it per `doc.align`.
		let totalWidth = 0;
		const widths: number[] = [];
		for (const run of line) {
			ctx.font = fontOf(run);
			const w = ctx.measureText(run.text).width;
			widths.push(w);
			totalWidth += w;
		}
		let x = box.x;
		if (doc.align === "center") x = box.x + (box.w - totalWidth) / 2;
		else if (doc.align === "right") x = box.x + box.w - totalWidth;
		for (let i = 0; i < line.length; i++) {
			const run = line[i];
			ctx.font = fontOf(run);
			if (outlined) { // a style with text-shadow gets a 1 px black outline, so runechat reads on light and dark floors
				ctx.fillStyle = "#000000";
				for (const [dx, dy] of OUTLINE_OFFSETS) ctx.fillText(run.text, Math.round(x) + dx, baseline + dy);
			}
			ctx.fillStyle = run.color ?? "#ffffff";
			ctx.fillText(run.text, Math.round(x), baseline);
			x += widths[i];
		}
		y += lineHeight;
	}
	ctx.restore();
}
