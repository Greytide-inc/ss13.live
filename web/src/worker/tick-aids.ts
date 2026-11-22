// tick-aids - the per-tick test aids of the boot worker (?ride=1, ?lie=1, ?tgui=..., ?setup=... and friends), moved out of run().
// makeTickAids(ctx) builds them; step() runs them once per tick, after the player has joined. The tgui aid is in tick-aids-tgui.ts, the rest in tick-aids-scenes.ts.

import type { VM } from "../vm/interpreter.js";
import type { DMObject } from "../vm/objects.js";
import type { StartMsg } from "./messages.js";
import { makeCrew, makeGoto, makeLie, makeRide, makeSetup, makeShake, makeShoot } from "./tick-aids-scenes.js";
import { newTguiState, tguiFollow, tguiFresh, tguiOpen } from "./tick-aids-tgui.js";

/** What run() shares with the aids. The getters read run()'s live variables; freshAsk is also written. */
export interface TickAidsCtx {
	opts: StartMsg;
	vm: VM;
	log: (line: string) => void;
	post: (m: unknown) => void;
	firstC: () => DMObject;
	players: { client: unknown }[];
	readonly joinAt: number;
	readonly ticks: number;
	freshAsk: { id: string; tgui?: string; tguiSet?: string; tguiWatch?: string } | null;
}

export function makeTickAids(ctx: TickAidsCtx) {
	const T = newTguiState(), ride = makeRide(ctx), crew = makeCrew(ctx), shoot = makeShoot(ctx), shake = makeShake(ctx), go = makeGoto(ctx), setup = makeSetup(ctx), lie = makeLie(ctx);
	return { step() { // the same order as before the split
		ride();
		tguiFollow(ctx, T);
		if (ctx.freshAsk !== null) { const ask = ctx.freshAsk; ctx.freshAsk = null; tguiFresh(ctx, T, ask); }
		tguiOpen(ctx, T);
		crew(); shoot(); shake(); go(); setup(); lie();
	} };
}
