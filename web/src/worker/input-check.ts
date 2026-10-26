// input-check - ps-security: the shape check for every input message a player's page can send (the types tools/server.mjs forwards).
// A player on the internet can send anything, so each field is checked for type and size before a handler sees it; a message that
// doesn't fit is dropped whole. What a real page sends always fits (worker/index.html, popups.js, ctxmenu.js).

/** The mouse procs a "mouse" message may name: it is run as that proc on the client or the object, so nothing else may get through. */
export const MOUSE_PROCS = new Set(["MouseDown", "MouseUp", "MouseDrop", "MouseDrag", "MouseMove", "MouseEntered", "MouseExited", "MouseWheel"]);
/** The longest text a player sends in one go: tg's longest input is a book page (MAX_BOOK_MESSAGE_LEN, 9216). */
export const MAX_TEXT = 16384;
const MAX_NAME = 128, MAX_PARAMS = 1024, MAX_COORD = 100000;

type Rec = Record<string, unknown>;
const str = (v: unknown, max: number): v is string => typeof v === "string" && v.length <= max;
const optStr = (v: unknown, max: number) => v === undefined || str(v, max);
const bool = (v: unknown) => v === undefined || typeof v === "boolean";
const id = (v: unknown): v is number => typeof v === "number" && Number.isInteger(v) && v >= 0 && v <= 0x7fffffff;
const idOrNull = (v: unknown) => v === null || id(v);
const num = (v: unknown) => typeof v === "number" && Number.isFinite(v) && Math.abs(v) <= MAX_COORD;
const coord = (v: unknown) => v === null || v === undefined || num(v);
const clickOk = (m: Rec) => idOrNull(m.id) && coord(m.x) && coord(m.y) && bool(m.dbl) && optStr(m.control, MAX_NAME) && optStr(m.params, MAX_PARAMS);

const CHECKS: Record<string, (m: Rec) => boolean> = {
	key: (m) => str(m.key, 40) && typeof m.down === "boolean",
	step: (m) => [1, 2, 4, 8, 5, 6, 9, 10].includes(m.dir as number),
	command: (m) => str(m.text, MAX_TEXT) && optStr(m.speech, MAX_TEXT),
	typing: (m) => typeof m.on === "boolean",
	answer: (m) => id(m.id) && (m.value === null || str(m.value, MAX_TEXT) || (typeof m.value === "number" && Number.isFinite(m.value))),
	statpanel: (m) => str(m.name, MAX_NAME),
	statclick: (m) => id(m.idx),
	topic: (m) => str(m.href, MAX_TEXT),
	winclose: (m) => str(m.name, MAX_NAME),
	click: clickOk,
	menu: (m) => (m.one === undefined || id(m.one)) && coord(m.x) && coord(m.y) && coord(m.sx) && coord(m.sy) && typeof m.click === "object" && m.click !== null && !Array.isArray(m.click) && clickOk(m.click as Rec),
	menupick: (m) => id(m.id) && id(m.a) && id(m.v),
	mouse: (m) => typeof m.proc === "string" && MOUSE_PROCS.has(m.proc) && clickOk(m) && (m.over === undefined || idOrNull(m.over)) && coord(m.ox) && coord(m.oy) && coord(m.dx) && coord(m.dy),
	resync: () => true,
	bugstate: () => true,
};

/** True if `m` is a well-formed input message of one of the player types. `player` (who sent it) is the host's to set, not checked here. */
export function inputOk(m: unknown): boolean {
	if (typeof m !== "object" || m === null || Array.isArray(m)) return false;
	const type = (m as Rec).type;
	if (typeof type !== "string" || !Object.hasOwn(CHECKS, type)) return false;
	const pl = (m as Rec).player;
	return (pl === undefined || str(pl, 64)) && CHECKS[type](m as Rec);
}
/** A byond://winset link's command= runs as whoever clicks it (admin verbs too), so a link that slipped into chat or a popup could act
 * for them: only tgui's close button sends one (`uiclose [0x...]`), and only that runs. Security review 2026-10-25 #3. */
export const linkCommandOk = (cmd: string): boolean => /^uiclose \[0x[0-9a-f]+\]$/i.test(cmd);
/** The message types inputOk knows: a player's page may send these and no others. */
export const INPUT_TYPES = Object.keys(CHECKS);
