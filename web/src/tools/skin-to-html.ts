// skin-to-html - Node script that parses `interface/skin.dmf` (BYOND's client window
// layout: windows, panes, controls with pos/size/anchors) and generates a static mock-up page at
// web/skin/index.html. Groundwork for the real skin ("skin.dmf rebuilt as HTML: map, output, statpanels,
// input bar; winset/winget/output()") -- this is layout only, no game logic, no winset/winget
// wiring. Every control keeps its DMF `id` as the generated element's `id`, so a later chunk can
// wire winset("id.prop", value) straight to it.
//
// Usage: npm run skin (regenerates web/skin/index.html; web/skin/skin.css is hand-written, not
// generated, and is left alone).
//
// Approach: skin.dmf is a flat text format with three kinds of top-level block (`macro "name"`,
// `menu "name"`, `window "name"`), each holding a list of `elem` (or `elem "id"`) sub-blocks of
// tab-indented `key = value` properties. We only render `menu` and `window` blocks; `macro` (key
// bindings) has no visual layout and is out of scope here.
//
// Layout model: each window's first elem (type MAIN, id == window name) declares that window's own
// authored size -- the "reference size" every other elem in that window's pos/size/anchor was
// authored against. A CHILD elem is BYOND's splitter control; its `left`/`right` properties name
// two other windows whose *own* non-MAIN elems get inlined into the two split panes, each pane then
// using ITS window's own MAIN size as the new reference size for its own children's anchors. This
// recursion is exactly how mainwindow -> (mapwindow | infowindow -> (statwindow / outputwindow))
// nests in the real client, and it's what this script reproduces as nested <div>s.
//
// Anchor math: BYOND's anchor1/anchor2 are percentages (0-100) of the *parent's current* size that
// pos/size stay pinned to as the parent resizes, evaluated against the reference size above. Per
// axis, with effective anchors eff1/eff2 (see effAnchor() for the "none" fallback rules):
//   left  = pos + eff1/100 * (currentParentSize - refSize)
//   width = size + (eff2-eff1)/100 * (currentParentSize - refSize)
// In CSS terms (currentParentSize == 100% of the positioned ancestor):
//   left  = calc( eff1% + (pos - eff1/100*ref)px )
//   width = calc( (eff2-eff1)% + (size - (eff2-eff1)/100*ref)px )
// This is exact for anchor1==anchor2==none (fully fixed) and anchor1==0,anchor2==100 (full stretch,
// where the ref term cancels out regardless of what ref is), which covers nearly every control in
// skin.dmf; the handful of button-bar controls anchored to non-0/100 percentages (e.g. the
// infowindow link row, each pinned to a ~16%-wide slice) get the same formula, "roughly" correct
// when the actual pane width drifts from the 640-wide reference it was authored at.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// build/dist/src/tools/skin-to-html.js -> up 4 to web/, then up 1 more to the repo root
let webDir = dirname(fileURLToPath(import.meta.url));
for (let i = 0; i < 4; i++) webDir = dirname(webDir);
const repoRoot = dirname(webDir);
const skinPath = resolve(repoRoot, "interface/skin.dmf");
const outDir = resolve(repoRoot, "web/skin");
const outPath = resolve(outDir, "index.html");

if (!existsSync(skinPath)) {
	console.error(`missing ${skinPath}`);
	process.exit(1);
}

// ---------------------------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------------------------

interface ElemBlock {
	id: string | null;
	props: Record<string, string>;
}

interface Block {
	kind: "macro" | "menu" | "window";
	name: string;
	elems: ElemBlock[];
}

// DMF quotes string-valued properties ("Chat", "mapwindow", ".winset \"...\"") but leaves
// booleans/numbers/pos/size/anchor/enum values bare (true, 0,0, 640x440, none, stretch). Strip the
// surrounding quotes and unescape \" / \\ for the quoted ones; everything else passes through.
function unquote(v: string): string {
	if (v.length >= 2 && v.startsWith('"') && v.endsWith('"')) {
		// order matters: unescape \" and \t before \\, so a literal \\t in the source isn't
		// mistaken for an escaped tab.
		return v
			.slice(1, -1)
			.replace(/\\"/g, '"')
			.replace(/\\t/g, "\t")
			.replace(/\\\\/g, "\\");
	}
	return v;
}

function parseSkin(text: string): Block[] {
	const lines = text.split(/\r?\n/);
	const blocks: Block[] = [];
	let block: Block | null = null;
	let elem: ElemBlock | null = null;

	const topLevel = /^(macro|menu|window)\s+"([^"]*)"\s*$/;
	const elemLine = /^\telem(?:\s+"([^"]*)")?\s*$/;
	const propLine = /^\t\t([^=]+?)\s*=\s*(.*)$/;

	const flushElem = () => {
		if (block && elem) block.elems.push(elem);
		elem = null;
	};
	const flushBlock = () => {
		flushElem();
		if (block) blocks.push(block);
		block = null;
	};

	for (const line of lines) {
		const top = topLevel.exec(line);
		if (top) {
			flushBlock();
			block = { kind: top[1] as Block["kind"], name: top[2], elems: [] };
			continue;
		}
		const em = elemLine.exec(line);
		if (em) {
			flushElem();
			elem = { id: em[1] && em[1].length > 0 ? em[1] : null, props: {} };
			continue;
		}
		const prop = propLine.exec(line);
		if (prop && elem) {
			elem.props[prop[1]] = unquote(prop[2]);
		}
	}
	flushBlock();
	return blocks;
}

const blocks = parseSkin(readFileSync(skinPath, "utf8"));
const windows = new Map<string, ElemBlock[]>();
let menuItems: ElemBlock[] = [];
for (const b of blocks) {
	if (b.kind === "window") windows.set(b.name, b.elems);
	else if (b.kind === "menu") menuItems = b.elems;
}

// ---------------------------------------------------------------------------------------------
// Anchor / geometry math
// ---------------------------------------------------------------------------------------------

function parsePair(s: string): [number, number] {
	const [a, b] = s.split(",").map((n) => Number(n.trim()));
	return [a, b];
}

function parseSize(s: string): [number, number] {
	const [a, b] = s.split("x").map((n) => Number(n.trim()));
	return [a, b];
}

// "none" | "x,y" -> null | [x,y]
function parseAnchor(s: string | undefined): [number, number] | null {
	if (!s || s.trim() === "none") return null;
	return parsePair(s);
}

// Effective anchor value on one axis, applying the fallback rules described in the header comment.
function effAnchors(a1: number | null, a2: number | null): [number, number] {
	if (a1 === null && a2 === null) return [0, 0];
	if (a1 === null) return [a2 as number, a2 as number];
	if (a2 === null) return [a1, a1];
	return [a1, a2];
}

interface Rect {
	left: string;
	top: string;
	width: string;
	height: string;
}

// Builds the CSS calc() rect for one elem, given the reference size of the window it was authored
// against (see header comment for the formula).
function cssRect(props: Record<string, string>, ref: [number, number]): Rect {
	const [px, py] = parsePair(props.pos ?? "0,0");
	const [sw, sh] = parseSize(props.size ?? "0x0");
	const anchor1 = parseAnchor(props.anchor1);
	const anchor2 = parseAnchor(props.anchor2);
	const [ax1, ay1] = [anchor1 ? anchor1[0] : null, anchor1 ? anchor1[1] : null];
	const [ax2, ay2] = [anchor2 ? anchor2[0] : null, anchor2 ? anchor2[1] : null];
	const [ex1, ex2] = effAnchors(ax1, ax2);
	const [ey1, ey2] = effAnchors(ay1, ay2);

	const axis = (pos: number, size: number, e1: number, e2: number, refSize: number): [string, string] => {
		const leftPct = e1;
		const leftPx = pos - (e1 / 100) * refSize;
		const widthPct = e2 - e1;
		const widthPx = size - ((e2 - e1) / 100) * refSize;
		const fmt = (px: number) => (Math.abs(px) < 1e-9 ? "0px" : `${px % 1 === 0 ? px : px.toFixed(2)}px`);
		const left = leftPct === 0 ? fmt(leftPx) : `calc(${leftPct}% + ${fmt(leftPx)})`;
		const width = widthPct === 0 ? fmt(widthPx) : `calc(${widthPct}% + ${fmt(widthPx)})`;
		return [left, width];
	};

	const [left, width] = axis(px, sw, ex1, ex2, ref[0]);
	const [top, height] = axis(py, sh, ey1, ey2, ref[1]);
	return { left, top, width, height };
}

function refSizeOf(winName: string): [number, number] {
	const elems = windows.get(winName);
	const main = elems?.find((e) => e.props.type === "MAIN");
	if (!main) return [640, 480];
	return parseSize(main.props.size ?? "640x480");
}

// ---------------------------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------------------------

function esc(s: string): string {
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// BYOND colors are already valid CSS hex (#rrggbb); "none" means "don't override, use CSS default".
function colorStyle(prop: string, cssProp: string, props: Record<string, string>): string {
	const v = props[prop];
	if (!v || v === "none") return "";
	return `${cssProp}: ${v};`;
}

const skippedTypes = new Set<string>();

function renderElem(id: string | null, props: Record<string, string>, ref: [number, number]): string {
	const type = props.type ?? "";
	const rect = cssRect(props, ref);
	const posStyle = `position:absolute; left:${rect.left}; top:${rect.top}; width:${rect.width}; height:${rect.height};`;
	const idAttr = id ? ` id="${esc(id)}"` : "";
	const visStyle = props["is-visible"] === "false" ? " display:none;" : "";
	const disabledAttr = props["is-disabled"] === "true" ? " disabled" : "";
	const extra = [colorStyle("text-color", "color", props), colorStyle("background-color", "background-color", props)].join(" ");
	const title = `DMF id: ${id ?? "(none)"} — type ${type}`;

	switch (type) {
		case "INPUT": {
			const val = props.command ? esc(props.command) : "";
			return `<input${idAttr} class="ctl ctl-input" type="text" value="${val}" title="${esc(title)}" style="${posStyle}${visStyle} ${extra}"${disabledAttr}>`;
		}
		case "BUTTON": {
			const text = props.text ? esc(props.text) : "";
			return `<button${idAttr} class="ctl ctl-button" type="button" title="${esc(title)}" style="${posStyle}${visStyle} ${extra}"${disabledAttr}>${text}</button>`;
		}
		case "OUTPUT": {
			return `<div${idAttr} class="ctl ctl-output" title="${esc(title)}" style="${posStyle}${visStyle} ${extra}"><div class="placeholder">chat / game text output (id: ${esc(id ?? "")})</div></div>`;
		}
		case "BROWSER": {
			return `<div${idAttr} class="ctl ctl-browser" title="${esc(title)}" style="${posStyle}${visStyle} ${extra}"><div class="placeholder">browser panel (id: ${esc(id ?? "")})</div></div>`;
		}
		case "MAP": {
			return `<div${idAttr} class="ctl ctl-map" title="${esc(title)}" style="${posStyle}${visStyle} ${extra}"><div class="placeholder">map viewport (id: ${esc(id ?? "")})</div></div>`;
		}
		case "INFO": {
			return `<div${idAttr} class="ctl ctl-statpanel" title="${esc(title)}" style="${posStyle}${visStyle} ${extra}">
				<div class="statpanel-tabs"><span class="tab active">Status</span><span class="tab">MC</span></div>
				<div class="statpanel-body placeholder">stat panel (id: ${esc(id ?? "")}) — tabs/content set at runtime</div>
			</div>`;
		}
		case "CHILD": {
			const isVert = props["is-vert"] === "true";
			const leftWin = props.left ?? "";
			const rightWin = props.right ?? "";
			const splitter = Number(props.splitter ?? "50");
			const paneA = leftWin ? renderWindowInto(leftWin) : "";
			const paneB = rightWin ? renderWindowInto(rightWin) : "";
			return `<div${idAttr} class="ctl ctl-split ${isVert ? "split-row" : "split-col"}" title="${esc(title)}" style="${posStyle}${visStyle}">
				<div class="split-pane" style="flex-basis:${splitter}%;">${paneA}</div>
				<div class="split-divider"></div>
				<div class="split-pane" style="flex-basis:${100 - splitter}%;">${paneB}</div>
			</div>`;
		}
		case "MAIN":
			return ""; // handled by the caller (window frame / reference size), not rendered as its own box
		default:
			skippedTypes.add(type || "(blank)");
			return `<div${idAttr} class="ctl ctl-unknown" title="${esc(title)}" style="${posStyle}${visStyle}">unhandled control type "${esc(type)}" (id: ${esc(id ?? "")})</div>`;
	}
}

// Renders every non-MAIN elem of `winName` into a position:relative wrapper, using that window's
// own declared MAIN size as the reference size for its children's anchor math.
function renderWindowInto(winName: string): string {
	const elems = windows.get(winName);
	if (!elems) return `<div class="ctl-missing">missing window "${esc(winName)}"</div>`;
	const ref = refSizeOf(winName);
	const parts = elems.filter((e) => e.props.type !== "MAIN").map((e) => renderElem(e.id, e.props, ref));
	return `<div class="window-body" data-window="${esc(winName)}">${parts.join("\n")}</div>`;
}

function renderMenu(items: ElemBlock[]): string {
	// Items with category="" are top-level menu triggers (File, Help); items with a non-empty
	// category belong under that trigger, in file order, until the next top-level item.
	const top: { label: string; id: string | null; children: ElemBlock[] }[] = [];
	for (const item of items) {
		const category = item.props.category ?? "";
		if (category === "") {
			top.push({ label: item.props.name ?? "", id: item.id, children: [] });
		} else {
			const parent = top.find((t) => t.label === category);
			if (parent) parent.children.push(item);
		}
	}
	const menuHtml = top
		.map((t) => {
			const children = t.children
				.map((c) => {
					const name = c.props.name ?? "";
					if (name === "") return `<hr>`;
					const idAttr = c.id ? ` id="${esc(c.id)}"` : "";
					const label = name.replace(/&/g, "").split("\t")[0]; // strip mnemonic '&' and trailing "\tHotkey"
					const hotkey = name.includes("\t") ? name.split("\t")[1] : "";
					return `<div${idAttr} class="menu-item" title="command: ${esc(c.props.command ?? "")}">${esc(label)}${hotkey ? `<span class="hotkey">${esc(hotkey)}</span>` : ""}</div>`;
				})
				.join("\n");
			const label = (t.label ?? "").replace(/&/g, "");
			return `<div class="menu-trigger">${esc(label)}<div class="menu-dropdown">${children}</div></div>`;
		})
		.join("\n");
	return `<nav class="menubar">${menuHtml}</nav>`;
}

// ---------------------------------------------------------------------------------------------
// Top-level assembly: mainwindow is the outer frame.
// ---------------------------------------------------------------------------------------------

const mainElems = windows.get("mainwindow");
if (!mainElems) {
	console.error('missing window "mainwindow" in skin.dmf');
	process.exit(1);
}
const mainRef = refSizeOf("mainwindow");
const mainBody = mainElems
	.filter((e) => e.props.type !== "MAIN")
	.map((e) => renderElem(e.id, e.props, mainRef))
	.join("\n");

const menuHtml = renderMenu(menuItems);

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SS13 Classic — skin.dmf mock-up</title>
<link rel="stylesheet" href="skin.css">
</head>
<body>
<p class="notice">Generated from <code>interface/skin.dmf</code> by <code>npm run skin</code>
(<code>web/src/tools/skin-to-html.ts</code>) — layout only. Every control keeps its DMF
<code>id</code> for later <code>winset</code>/<code>winget</code> wiring. Resize the
window to see the DMF anchors respected.</p>
<div id="mainwindow" class="window-frame">
${menuHtml}
<div class="window-body" data-window="mainwindow" style="position:relative; flex:1 1 auto;">
${mainBody}
</div>
</div>
</body>
</html>
`;

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, html);
console.log(`wrote ${outPath}`);
if (skippedTypes.size > 0) {
	console.log(`skipped/unhandled control types: ${[...skippedTypes].join(", ")}`);
} else {
	console.log("no unhandled control types");
}
