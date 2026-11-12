// split-sheets - The giant icon sheets, cut into one small sheet per state. The round-end film
// (station_explosion.dmi, 6144x6144: 151 MB once unpacked, too big for most phone graphics chips) and the
// full-screen overlays (screen_full.dmi, 2880x2880: 33 MB) were loaded whole to draw one state. The build
// (tools/split-sheets.ts) writes each state as its own .dmi under icons/_split/ in web/dist, and the page
// asks for the one it draws: a look on a split sheet gets the state's own path (client-scene.ts, as the look
// arrives and when a flick() or animate() changes its state). ?split=0 turns it off (the whole sheets, as before).

/** Sheets cut per state. Their state names must be plain words (the tool checks). */
export const SPLIT_SHEETS = ["icons/effects/station_explosion.dmi", "icons/mob/screen_full.dmi"];
export const SPLIT_DIR = "icons/_split/";
const on = (globalThis as { location?: Location }).location?.search ? new URLSearchParams(location.search).get("split") !== "0" : true;
const split = new Set(on ? SPLIT_SHEETS : []);
const WORD = /^[\w-]+$/;

/** The small sheet holding `state` of `icon` (a whole sheet, or one already cut), or `icon` itself when it isn't cut.
 *  A state the sheet can't have (not a plain word: neither sheet has a "" state) gets a path that fails once and draws nothing, as before. */
export function sheetFor(icon: string, state: string): string {
	icon = wholeSheet(icon);
	if (!split.has(icon)) return icon;
	return `${SPLIT_DIR}${icon.slice("icons/".length, -".dmi".length)}/${WORD.test(state) ? state : "-none-"}.dmi`;
}

/** The whole sheet a cut sheet came from (`icon` itself when it isn't a cut one). The page falls back to it when a cut sheet
 *  fails to load (a server of the plain repo, as the test tools use, has no icons/_split/). */
export const wholeSheet = (icon: string): string => (icon.startsWith(SPLIT_DIR) ? "icons/" + icon.slice(SPLIT_DIR.length, icon.lastIndexOf("/")) + ".dmi" : icon);

/** The whole sheet's path is cut (or the path is already one of the cut ones). */
export const isSplit = (icon: string): boolean => split.has(icon) || icon.startsWith(SPLIT_DIR);

/** `a` with its icon (and its overlays' icons) pointed at the cut sheets of their states; `a` itself when none is cut. */
export function splitLook<T extends { icon: string | null; iconState: string; overlays?: { icon: string | null; iconState: string }[] }>(a: T): T {
	const cut = (o: { icon: string | null; iconState: string }) => !!o.icon && split.has(o.icon);
	if (!cut(a) && !a.overlays?.some(cut)) return a;
	const out = { ...a };
	if (cut(a)) out.icon = sheetFor(a.icon!, a.iconState);
	if (a.overlays?.some(cut)) out.overlays = a.overlays.map((o) => (cut(o) ? { ...o, icon: sheetFor(o.icon!, o.iconState) } : o));
	return out;
}
