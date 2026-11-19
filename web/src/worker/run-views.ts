// run-views - each tick's view updates and output for every joined player, moved out of boot-worker.ts's run().

import type { VM } from "../vm/interpreter.js";
import { zIconsMs } from "./client-view.js";
import { buildClientView } from "./client-view-dump.js";
import type { StartMsg } from "./boot-worker.js";
import type { Player } from "./input.js";
import type { makeRunStats } from "./run-stats.js";
import type { loadWorld } from "./load-world.js";

type World = Awaited<ReturnType<typeof loadWorld>>;
/** What run() shares with the views. lastCheck (when the last ?check view went) is kept here between ticks. */
export interface ViewsCtx {
	opts: StartMsg;
	vm: VM;
	log: (line: string) => void;
	post: (m: unknown) => void;
	players: Player[];
	resyncRequested: Set<string>;
	fixIcons: World["fixIcons"];
	fixAppIcons: World["fixAppIcons"];
	live_: ReturnType<typeof makeRunStats>["live_"];
	lastCheck: number;
}

export function sendViews(ctx: ViewsCtx): void {
	const { opts, vm, log, post, players, resyncRequested, fixIcons, fixAppIcons, live_ } = ctx;
	const evs = vm.animLog ? vm.animLog.slice() : null; // each player's differ drains the animation log: give each the same events
	for (const P of players) {
		if (!P.joined) continue;
		const ts = performance.now(); // per player: the live line's "view updates at X ms each" is one player's view
		if (evs) { vm.animLog!.length = 0; for (const e of evs) if (!P.animSeen?.has(e)) vm.animLog!.push(e); }
		P.animSeen = undefined;
		const differ = P.differ, isFirst = P === players[0];
		const rs = resyncRequested.has(P.ckey) || (isFirst && resyncRequested.has(""));
		const update = differ.update(vm, rs, P.client);
		if (update.full && update.seq > 1) log(`[vm-boot] full view resent (page resync) at world.time ${vm.sched.time}`);
		resyncRequested.delete(P.ckey); if (isFirst) resyncRequested.delete("");
		const first = update.seq === 1;
		const rtUses = first && vm.runtimeIcons.size ? [...JSON.stringify(update.apps).matchAll(/"icon":"([^"]+)"/g)].map((m) => m[1]).filter((i) => vm.runtimeIcons.has(i)) : [];
		if (vm.runtimeIcons.size) fixAppIcons(update.apps);
		const tb = performance.now();
		if (P.outLines.length) { post({ type: "output", player: P.ckey, lines: P.outLines }); P.outLines = []; }
		post({ type: "view", player: P.ckey, update });
		P.views++;
		const tp = performance.now();
		live_.snaps++;
		live_.snapMs += tp - ts;
		live_.buildMs += tb - ts;
		live_.postMs += tp - tb;
		if (live_.snaps % 20 === 1) live_.bytes += JSON.stringify(update).length * 20; // measurement only: 1 update in 20, scaled (the average stays meaningful)
		if (opts.check && tp - ctx.lastCheck >= 2000) {
			ctx.lastCheck = tp;
			const view = buildClientView(vm);
			if (vm.runtimeIcons.size) fixIcons(view as unknown as Record<string, unknown>);
			post({ type: "viewcheck", view });
		}
		if (first)
			log(`[vm-boot] first view update (full, ${update.apps.length} appearances, ${update.tiles.length} tiles): ${rtUses.length} runtime-built icon uses${update.icons ? `; ${update.icons.length} icon sheets on the z level listed for preload in ${zIconsMs} ms` : ""}${rtUses.length ? ` (${[...new Set(rtUses)].join(", ")}; sent as blob: .dmi URLs)` : ""}`);
	}
}
