// predict-hud - the page's own HUD predictions (netcode 2 and 3): toggles, intent, hand swap and thrown-item hiding, moved out of liveClientView.
// makePredictHud(ctx) returns what liveClientView calls; movement prediction stays in client-scene.ts.

import type { BuiltAppearance } from "../appearance/appearance.js";
import type { viewStats as ViewStats } from "./client-scene.js";

/** What liveClientView shares with the HUD predictions. screen is a getter: liveClientView reassigns it. */
export interface PredictHudCtx {
	apps: Map<number, BuiltAppearance>;
	readonly screen: [number, string, unknown][];
	viewStats: typeof ViewStats;
	schedule: () => void;
}

export const PREDICT_HIDE_MS = 1500;

export function makePredictHud(ctx: PredictHudCtx) {
	const { apps, viewStats, schedule } = ctx;
	// netcode 2: your own HUD toggles at once. The page flips the look the game's Click procs would (throw mode, walk/run, intent, which hand is active);
	// the server sends those objects again after the click (boot-worker HUD_TOGGLE), so a click it refused puts the old look back.
	let hudHint: { ia: string[]; iq: number } = { ia: [], iq: 0 };
	const FLIP: Record<string, Record<string, string>> = {
		"/obj/screen/throw_catch": { act_throw_off: "act_throw_on", act_throw_on: "act_throw_off" },
		"/obj/screen/mov_intent": { running: "walking", walking: "running" },
	};
	const hidden = new Map<number, number>(); // netcode 3: screen objects the page hides until the server answers (id -> when)
	const put = (i: number, na: BuiltAppearance) => { apps.set(i, na); viewStats.predToggle++; schedule(); };
	const isHand = (t: string) => t.startsWith("/obj/screen/inventory/hand");
	const predictClick = (id: number, params: string): void => {
		const type = ctx.screen.find((s) => s[0] === id)?.[1], a = apps.get(id);
		if (!type || !a) return;
		const flip = FLIP[type];
		if (flip) { if (flip[a.iconState]) put(id, { ...a, iconState: flip[a.iconState] }); return; }
		if (type.startsWith("/obj/screen/act_intent")) { // a_intent_change: the quarter clicked (human icon, preference on) or the next intent
			const ia = hudHint.ia, n = ia.length;
			if (!n) return;
			let next: string | undefined;
			if (type === "/obj/screen/act_intent/segmented" && hudHint.iq) {
				const x = /icon-x=(\d+)/.exec(params), y = /icon-y=(\d+)/.exec(params);
				if (!x || !y) return;
				const l = +x[1] <= 16, d = +y[1] <= 16;
				next = l ? (d ? "harm" : "help") : (d ? "grab" : "disarm");
				if (!ia.includes(next)) return;
			} else {
				const at = (ia.indexOf(a.iconState) + 1 || 1) + 1;
				next = ia[(at > n ? 1 : at) - 1];
			}
			if (next && next !== a.iconState) put(id, { ...a, iconState: next });
			return;
		}
		if (type === "/obj/screen/swap_hand" || isHand(type)) swapHands(isHand(type) ? id : null);
	};
	// netcode 3: a plain click on the map with throw mode on throws what the active hand holds (ClickOn: in_throw_mode -> throw_item, which first
	// switches throw mode off). The held item is hidden and the throw icon flips off; the server sends the item's look again after such a click
	// (boot-worker), so a refused throw (next_move, incapacitated, nodrop) shows it back; a thrown one is gone from the screen list.
	const predictThrow = (): void => {
		const th = ctx.screen.find((s) => s[1] === "/obj/screen/throw_catch"), ta = th && apps.get(th[0]);
		if (!th || !ta || ta.iconState !== "act_throw_on") return;
		put(th[0], { ...ta, iconState: "act_throw_off" });
		const hand = ctx.screen.find((s) => isHand(s[1]) && apps.get(s[0])?.overlays.some((o) => o.iconState === "hand_active"));
		const item = hand && hand[2] != null && ctx.screen.find((s) => !s[1].startsWith("/obj/screen") && s[2] === hand[2] && apps.has(s[0]));
		if (!item) return;
		hidden.set(item[0], performance.now());
		viewStats.predThrow++;
		schedule();
	};
	/** The other hand becomes the active one (two hands only). `onlyTo`: a click on a hand slot swaps only when it is the inactive one (a click on the active hand uses what it holds). */
	const swapHands = (onlyTo: number | null): void => {
		const hands = ctx.screen.filter((s) => isHand(s[1]) && apps.has(s[0]));
		if (hands.length !== 2) return;
		const active = (i: number) => apps.get(i)!.overlays.find((o) => o.iconState === "hand_active");
		const from = hands.find((h) => active(h[0])), to = hands.find((h) => h !== from);
		if (!from || !to || active(to[0]) || (onlyTo !== null && onlyTo !== to[0])) return;
		const mark = active(from[0])!, fa = apps.get(from[0])!, ta = apps.get(to[0])!;
		apps.set(from[0], { ...fa, overlays: fa.overlays.filter((o) => o !== mark) });
		apps.set(to[0], { ...ta, overlays: [...ta.overlays, mark].sort((p, q) => p.plane - q.plane || p.layer - q.layer) });
		viewStats.predToggle += 2;
		schedule();
	};
	return { predictClick, predictThrow, swapHands, hidden, setHudHint: (h: { ia: string[]; iq: number }) => { hudHint = h; } };
}
