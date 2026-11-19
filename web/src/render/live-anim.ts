// live-anim - animate(), flick() and client.pixel_x/y for liveClientView: what the server started, played on the page's clock.
// makeLiveAnim(ctx) returns what liveClientView calls. See anim.ts for the rules.

import type { BuiltAppearance } from "../appearance/appearance.js";
import type { ViewUpdate } from "../worker/client-view.js";
import type { Prepared, viewStats as ViewStats } from "./client-scene.js";
import { CLIENT_ANIM_ID, foldPixels, ObjectAnims, SMOOTH, SWITCH, type AnimValue, type StepVar } from "./anim.js";
import { buildAnimationSteps } from "../dmi/animation.js";
import { findState } from "./sprite-lookup.js";
import { isSplit, sheetFor } from "./split-sheets.js";
import type { LoadedIcon } from "./station-client.js";

/** What liveClientView shares with the animations. shown is a getter: liveClientView reassigns it. The icon store is passed in:
 *  client-scene.ts can't be imported for values (it touches the page). */
export interface LiveAnimCtx {
	host: HTMLElement;
	apps: Map<number, BuiltAppearance>;
	idx: Map<number, number | Set<number>>;
	readonly shown: Prepared | null;
	icons: Map<string, LoadedIcon>;
	failedIcons: Set<string>;
	loadOne: (path: string) => Promise<void>;
	t0: number;
	glideSlow: number;
	viewStats: typeof ViewStats;
	markId: (id: number) => void;
	schedule: () => void;
	/** every tile is built again on the next frame */
	allDirty: () => void;
}

export function makeLiveAnim(ctx: LiveAnimCtx) {
	const { host, apps, idx, icons, failedIcons, loadOne, t0, glideSlow, viewStats, markId, schedule } = ctx;
	const anims = new Map<number, ObjectAnims>();
	const flicks = new Map<number, { state: string; t0: number; ms: number }>();
	// animating: objects whose animation or flick was still running when the scene last looked (liveClientView resets and reads it)
	const self = { animating: 0, anims, flicks, animNow: null as never as (id: number, a: BuiltAppearance, now: number) => BuiltAppearance };
	const animNow = (id: number, a: BuiltAppearance, now: number): BuiltAppearance => {
		let out = a;
		const oa = anims.get(id);
		if (oa) {
			const vals = oa.values(now);
			if (!oa.seqs.length) anims.delete(id); else self.animating++;
			if (vals.size) {
				out = { ...a };
				for (const [n, v] of vals) {
					const f = SMOOTH[n] ?? SWITCH[n];
					if (f) (out as unknown as Record<string, AnimValue>)[f] = f === "iconState" ? (typeof v === "string" ? v : "") : v;
				}
				foldPixels(out, vals);
			}
		}
		const fl = flicks.get(id);
		if (fl) {
			if (now - fl.t0 >= fl.ms) flicks.delete(id);
			else { self.animating++; out = { ...out, iconState: fl.state, flickT0: (fl.t0 - t0) / 100 }; viewStats.flickFrames++; }
		}
		if (out !== a && out.icon && out.iconState !== a.iconState && isSplit(out.icon)) out.icon = sheetFor(out.icon, out.iconState); // out is a copy here
		return out;
	};
	// client.pixel_x/pixel_y (+ animate(client) steps, id CLIENT_ANIM_ID in anims): shifts the whole map pane, screen objects too
	// (BYOND's map control scrolls as one; the skin background shows at the edge). The view moves by +pixel_x, so the picture moves by -pixel_x; y is up.
	let clientOff: [number, number] = [0, 0], appliedOff = "0,0";
	const clientOffNow = (now: number): [number, number] => {
		const oa = anims.get(CLIENT_ANIM_ID);
		if (!oa) return clientOff;
		const vals = oa.values(now);
		if (!oa.seqs.length) anims.delete(CLIENT_ANIM_ID); else self.animating++;
		return [(vals.get("pixel_x") as number | undefined) ?? clientOff[0], (vals.get("pixel_y") as number | undefined) ?? clientOff[1]];
	};
	const applyOff = (o: [number, number]): void => {
		const key = `${o[0]},${o[1]}`;
		if (key === appliedOff) return;
		appliedOff = key;
		viewStats.shakeApplied++; viewStats.shakeMax = Math.max(viewStats.shakeMax, Math.abs(o[0]), Math.abs(o[1]));
		const cv = host.querySelector("canvas");
		if (!cv) return;
		const vw = ctx.shown?.canvasW ?? cv.width; // the VIEW's width in px: the canvas itself may be smaller (drawn at screen size)
		const k = vw > 0 ? cv.clientWidth / vw : 1;
		cv.style.transform = o[0] || o[1] ? `translate(${-o[0] * k}px, ${o[1] * k}px)` : "";
		host.style.overflow = o[0] || o[1] ? "hidden" : "";
	};
	// Probe for pixel-diff runs: puts n animations of each kind on map objects (long ones, so a pdDiff sees them mid-way): flick() to a state with frames,
	// animate() of alpha + pixel_x, and an icon_state swap (what a door opening does). Returns what it used.
	(viewStats as Record<string, unknown>).animInject = (n: number): string[] => {
		const out: string[] = [], at = performance.now();
		let f = 0, a = 0, w = 0;
		for (const [id, ap] of apps) {
			if (!idx.has(id) || !ap.icon) continue;
			const ic = icons.get(ap.icon);
			if (!ic) continue;
			const st = ic.dmi.states.find((x) => x.name !== ap.iconState && x.frames > 1 && x.name);
			const sw = ic.dmi.states.find((x) => x.name !== ap.iconState && x.name);
			if (f < n && st) { flicks.set(id, { state: st.name, t0: at, ms: 600000 }); markId(id); out.push(`flick ${id} ${ap.icon} ${st.name}`); f++; }
			else if (a < n) { let oa = anims.get(id); if (!oa) anims.set(id, (oa = new ObjectAnims())); oa.step(at, true, 600000, 0, 0, 0, [["alpha", ap.alpha ?? 255, 90], ["pixel_x", 0, 12]] as StepVar[]); markId(id); out.push(`animate ${id} ${ap.icon} ${ap.iconState}`); a++; }
			else if (w < n && sw) { apps.set(id, { ...ap, iconState: sw.name }); markId(id); out.push(`swap ${id} ${ap.icon} ${ap.iconState}->${sw.name}`); w++; }
			if (f >= n && a >= n && w >= n) break;
		}
		ctx.allDirty();
		return out;
	};
	// Probe for pixel-diff runs: what applyOff does for offset (ox, oy), as the CSS transform and the canvas/view sizes it was worked out from; puts the real offset back.
	(viewStats as Record<string, unknown>).shakeProbe = (ox: number, oy: number): unknown => {
		const cv = host.querySelector("canvas");
		if (!cv) return null;
		const back = appliedOff.split(",").map(Number) as [number, number];
		appliedOff = ""; applyOff([ox, oy]);
		const out = { transform: cv.style.transform, canvasW: cv.width, viewW: ctx.shown?.canvasW ?? null, clientW: cv.clientWidth, expectPx: ctx.shown ? -ox * cv.clientWidth / ctx.shown.canvasW : null };
		appliedOff = ""; applyOff(back);
		return out;
	};
	/** the update's client offset: a full one starts from none */
	const serverOff = (u: ViewUpdate): void => {
		if (u.full) { anims.clear(); flicks.clear(); clientOff = [0, 0]; }
		if (u.off) clientOff = u.off;
	};
	/** the update's animate() and flick() calls: whether there were any */
	const events = (u: ViewUpdate): boolean => {
		let animEv = false;
		if (!u.full || u.seq === 1) for (const ev of u.anims ?? []) { // animate()/flick()
			const at = performance.now();
			if (ev[0] === "f") {
				const a = apps.get(ev[1]), fi = a?.icon ? sheetFor(a.icon, ev[2]) : "", st = fi ? icons.get(fi) && findState(icons.get(fi)!.dmi, ev[2]) : null;
				viewStats.animEvents++; animEv = true;
				if (a && !st && isSplit(fi) && !failedIcons.has(fi)) { // the flick's state is a cut sheet not loaded yet: it plays from the start once it is
					const [, id, state] = ev;
					void loadOne(fi).then(() => {
						const s = icons.get(fi) && findState(icons.get(fi)!.dmi, state);
						if (!s || !apps.has(id)) return;
						flicks.set(id, { state, t0: performance.now(), ms: buildAnimationSteps(s.frames, s.delay, s.rewind).reduce((n, x) => n + x.delay, 0) * 100 });
						markId(id); schedule();
					});
					continue;
				}
				if (viewStats.animLog.length < 200) viewStats.animLog.push(`${ev[1]} flick ${ev[2]} ${a ? (st ? "ok" : "nostate " + a.icon) : "noapp"}`);
				if (a && st) flicks.set(ev[1], { state: ev[2], t0: at, ms: buildAnimationSteps(st.frames, st.delay, st.rewind).reduce((n, x) => n + x.delay, 0) * 100 });
				continue;
			}
			const [, id, fresh, time, loop, easing, flags, vars] = ev;
			if (id !== CLIENT_ANIM_ID && !apps.has(id)) continue;
			let oa = anims.get(id);
			if (!oa) anims.set(id, (oa = new ObjectAnims()));
			oa.step(at, fresh === 1, time * glideSlow, loop, easing, flags, vars.filter((v) => v[0] in SMOOTH || v[0] in SWITCH) as StepVar[]);
			viewStats.animEvents++;
			if (viewStats.animLog.length < 200) viewStats.animLog.push(`${id} ${vars.map((v) => v[0]).join(",")} ${time}ds e${easing} l${loop}`);
			animEv = true;
		}
		return animEv;
	};
	self.animNow = animNow;
	return Object.assign(self, { clientOffNow, applyOff, serverOff, events, get clientOff() { return clientOff; } });
}
