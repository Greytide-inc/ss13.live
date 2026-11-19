// live-move - movement prediction for liveClientView: your own steps drawn before the server answers them, the pulled thing and swapped
// mobs with them, and the server's moves turned into glides (the camera's too). makeMovePredict(ctx) returns what liveClientView calls.

import type { BuiltAppearance } from "../appearance/appearance.js";
import type { ViewUpdate } from "../worker/client-view.js";
import type { viewStats as ViewStats } from "./client-scene.js";
import { glideAt, predGlide as predGlideAt, serverGlide, type Glide } from "./glide.js";
import { TILE_PX } from "./station-client.js";

/** What liveClientView shares with movement prediction. last is a getter: liveClientView reassigns it. */
export interface MovePredictCtx {
	apps: Map<number, BuiltAppearance>;
	glides: Map<number, Glide>;
	readonly last: ViewUpdate | null;
	viewStats: typeof ViewStats;
	glideSlow: number;
	sendStep: (dir: number) => void;
	markId: (id: number) => void;
	schedule: () => void;
}

export function makeMovePredict(ctx: MovePredictCtx) {
	const { apps, glides, viewStats, glideSlow, sendStep, markId, schedule } = ctx;
	// The camera glides with the eye. fresh: a camera glide started that no frame has drawn yet (latency)
	const cam: { glide: Glide | null; fresh: boolean } = { glide: null, fresh: false };
	let lastGlide = { ms: 0, at: -1e9 }; // the latest server glide's length and start: light fades take as long
	// Movement prediction (multiplayer only, ?predict=0 off): a direction key moves your own mob and the camera at once,
	// one tile at most ahead of the server, onto a tile the server called free (u.pred). The server's own step then takes over the glide where it
	// is; a different step, or none within the timeout (a door, a stun), glides back to where the server has the mob.
	// the page sends each step itself (sendStep, at the mob's walking pace) instead of held direction keys, and the server takes exactly
	// those (Clients.step): a key let go can't add a step the page never drew. A step is drawn ahead only when the server has finished every
	// step sent before it (u.steps counts them) or drawn ahead itself.
	// up to PRED_MAX steps drawn ahead (a ping longer than a step no longer makes every other step wait for the server), inside the
	// 7x7 square of free tiles the server sends (pred[1], bit (dy + 3) * 7 + dx + 3: 49 bits, past what << reaches). Three ahead since a Canada
	// VPN (ping ~400 ms): quick taps waited a ping with two. Steps past those go out at once all the same (up to QUEUE_MAX unanswered) and are
	// drawn as the server answers the ones before: holding them back made a run at ping > 3 steps go in bursts, 3 steps then a pause.
	const PRED_MAX = 3, QUEUE_MAX = 8;
	let stepsSent = 0, stepsDone = 0, lastSentAt = -1e9;
	// The AI eye (u.predRun = [sprint, acceleration]): AIMove moves it ceil(max(sprint, 10) / 20) tiles a step; sprint grows 0.5 a step up to 50
	// (acceleration on) and is back to 10 after half a second without a step. The server's sprint counts the steps it took; ours adds the ones
	// still unanswered. runFrom: the step sent after such a pause, until the server has taken it (its sprint is from before the pause till then).
	let run: [number, number] | null = null, runFrom = -1;
	const runTiles = (): number => {
		if (!run) return 1;
		const k = stepsSent - 1, s = !run[1] ? 10 : runFrom >= 0 && stepsDone <= runFrom ? 10 + 0.5 * (k - runFrom) : run[0] + 0.5 * (k - stepsDone);
		return Math.ceil(Math.max(10, Math.min(50, s)) / 20);
	};
	let drawnAt: number[] | null = null, jumpPrev = 0; // your mob's and the camera's drawn spots (x, y px) and the time at the last look; jumpPrev: px moved since the look before (predJumps)
	let predOn = false, pred: number[] | null = null;
	let pending: { id: number; dx: number; dy: number; tiles: number; dir: number; at: number; rest: boolean; drawn: boolean; n: number }[] = []; // steps sent and not yet answered, oldest first; the first ones (up to PRED_MAX) drawn ahead; tiles 0: a turn in place
	// A mech (u.predTurn): a key in a direction it doesn't face only turns it (domove -> mechturn), one step's time like a step. The facing is
	// that of the last step or turn sent, else the server's.
	let turnFirst = false;
	const predFree = (dx: number, dy: number): boolean => Math.abs(dx) <= PRED_MAX && Math.abs(dy) <= PRED_MAX && !!pred && Math.floor(pred[1] / 2 ** ((dy + PRED_MAX) * (2 * PRED_MAX + 1) + dx + PRED_MAX)) % 2 === 1;
	const heldDirs: number[] = []; // direction bits held down, in press order
	let tap = 0; // the last direction pressed, until a step is sent: a tap let go before the walking pace allowed a step still makes one
	let lastStepAt = -1e9, lastConfirmAt = -1e9, stepMs = 0;
	const confirmMs: number[] = []; // keypress (from standing still) to the server's step, recent
	const predTimeout = (): number => {
		const s = [...confirmMs].sort((a, b) => a - b), p = viewStats.pingRecent;
		const t = s.length ? Math.max(250, Math.min(1500, 2 * s[Math.floor(s.length * 0.9)] + 100)) : 600;
		// never before the slowest recent ping could have answered (a Japan VPN, ping 1-3.6 s: every guess used to glide back, then the step came)
		return p.length ? Math.max(t, Math.min(6000, Math.max(...p) + 300 + (stepMs || 200))) : t;
	};
	const predGlide = (old: Glide | null | undefined, tx: number, ty: number, ms: number, now: number): Glide => predGlideAt(old, tx, ty, ms, now, TILE_PX);
	// The mob's images (a speech bubble, pred[2..]) draw with the mob's own glide: a copy of it, set wherever prediction sets the mob's.
	const predImgs = (id: number): void => {
		if (!pred || pred[0] !== id) return;
		const g = glides.get(id);
		for (let i = 2; i < pred.length; i++) { if (g) glides.set(pred[i], { ...g }); else glides.delete(pred[i]); markId(pred[i]); }
	};
	// netcode 4: your mob faces the way it steps or bumps at once (/atom/movable/Move ends in setDir(direct), blocked or not). Straight steps only.
	// The page draws a copy of the server's look with the dir swapped on every layer that shares the root's (clothes, hair: overlays with no dir
	// of their own); once the server has finished that step (u.steps), its own look comes back, turned or not.
	let faced: { id: number; dir: number; server: BuiltAppearance; n: number } | null = null;
	const turned = (a: BuiltAppearance, dir: number): BuiltAppearance =>
		({ ...a, dir, overlays: a.overlays.map((o) => (o.dir === a.dir ? { ...o, dir } : o)) });
	const face = (id: number, dx: number, dy: number, n: number): void => {
		if (dx && dy) return;
		const dir = dx > 0 ? 4 : dx < 0 ? 8 : dy > 0 ? 1 : 2, server = faced?.id === id ? faced.server : apps.get(id);
		if (!server) return;
		faced = { id, dir, server, n };
		if (apps.get(id)!.dir !== dir) { apps.set(id, turned(server, dir)); viewStats.predFace++; markId(id); schedule(); }
	};
	const unface = (): void => {
		if (!faced) return;
		if (faced.server.dir === faced.dir) viewStats.predFaceOk++; else viewStats.predFaceWrong++;
		apps.set(faced.id, faced.server); markId(faced.id); schedule();
		faced = null;
	};
	// netcode 5: a pulled thing (u.pull: [id, its tile minus the mob's server tile, blocks]) follows the drawn steps by tg's rule (/mob/living/Move):
	// after the puller steps, a pulled thing now more than a tile away, or diagonal to it, moves into the tile the puller left, except on the second
	// half of a diagonal step (atoms_movable Move: vertical half first, then horizontal, then the rule runs once more for the whole step). Tiles
	// are counted from the mob's server tile, east+/north+. Its target is worked out afresh from the server's offset and the drawn steps.
	let pull: number[] | null = null, pullPred = -1; // pullPred: the id whose glide has a target we set
	const pullMove = (fx: number, fy: number, tx: number, ty: number, p: [number, number], second: boolean): void => {
		const ex = p[0] - tx, ey = p[1] - ty;
		if (Math.max(Math.abs(ex), Math.abs(ey)) > 1 || (!second && ex && ey)) { p[0] = fx; p[1] = fy; }
	};
	const pullAfter = (p: [number, number], ax: number, ay: number, dx: number, dy: number): void => {
		if (dx && dy) {
			pullMove(ax, ay, ax, ay + dy, p, false);
			pullMove(ax, ay + dy, ax + dx, ay + dy, p, true);
		}
		pullMove(ax, ay, ax + dx, ay + dy, p, false);
	};
	const predPull = (now: number, ms = stepMs || 150): void => {
		let tx = 0, ty = 0, id = -1;
		if (pred && pull) {
			id = pull[0];
			const p: [number, number] = [pull[1], pull[2]];
			let ax = 0, ay = 0;
			for (const q of pending) if (q.drawn) { pullAfter(p, ax, ay, q.dx, q.dy); ax += q.dx; ay += q.dy; }
			tx = (p[0] - pull[1]) * TILE_PX; ty = (p[1] - pull[2]) * TILE_PX;
		}
		if (pullPred >= 0 && pullPred !== id) { // no longer pulling it: back to the tile the server has it on
			const g0 = glides.get(pullPred);
			if (g0 && (g0.tx || g0.ty)) { glides.set(pullPred, predGlide(g0, 0, 0, 150, now)); markId(pullPred); schedule(); }
			pullPred = -1;
		}
		if (id < 0) return;
		const g = glides.get(id);
		if (g ? (g.tx ?? 0) === tx && (g.ty ?? 0) === ty : !tx && !ty) return;
		glides.set(id, predGlide(g, tx, ty, ms, now));
		pullPred = id;
		viewStats.predPull++;
		markId(id);
		schedule();
	};
	// Mob swap (u.swap: [id, its tile minus the mob's server tile, ...]): a straight step into a mob listed there swaps the two (/mob/living/MobBump),
	// so the page draws the step and slides that mob into the tile yours left. Where each listed mob is drawn is worked out afresh from the
	// server's offsets and the drawn steps, as for the pulled thing. Diagonal steps never swap (tg refuses them), so a listed mob blocks those.
	let swap: number[] | null = null;
	const swapPred = new Set<number>(); // ids whose glide has a target we set
	const swapsAt = (): number[][] => { const l: number[][] = []; for (let i = 0; swap && i + 2 < swap.length; i += 3) l.push([swap[i], swap[i + 1], swap[i + 2], swap[i + 1], swap[i + 2]]); return l; }; // [id, x, y, server x, server y]
	const swapIn = (sp: number[][], x: number, y: number): number[] | undefined => sp.find((e) => e[1] === x && e[2] === y);
	const swapAfter = (sp: number[][], ax: number, ay: number, dx: number, dy: number): void => { const e = swapIn(sp, ax + dx, ay + dy); if (e && !(dx && dy)) { e[1] = ax; e[2] = ay; } };
	const predSwap = (now: number, ms = stepMs || 150): void => {
		const sp = swapsAt(), want = new Map<number, [number, number]>();
		let ax = 0, ay = 0;
		for (const q of pending) if (q.drawn) { swapAfter(sp, ax, ay, q.dx, q.dy); ax += q.dx; ay += q.dy; }
		for (const [id, x, y, x0, y0] of sp) if (x !== x0 || y !== y0) want.set(id, [(x - x0) * TILE_PX, (y - y0) * TILE_PX]);
		for (const id of new Set([...swapPred, ...want.keys()])) {
			const [tx, ty] = want.get(id) ?? [0, 0], g = glides.get(id);
			if (g ? (g.tx ?? 0) === tx && (g.ty ?? 0) === ty : !tx && !ty) { if (!tx && !ty) swapPred.delete(id); continue; }
			glides.set(id, predGlide(g, tx, ty, want.has(id) ? ms : 150, now));
			if (want.has(id)) { swapPred.add(id); viewStats.predSwap++; } else swapPred.delete(id);
			markId(id);
			schedule();
		}
	};
	const predBack = (now: number): void => { // the guess was wrong: glide back to the tile the server has
		unface();
		if (!pending.length) return;
		const id = pending[0].id;
		pending = [];
		const g = glides.get(id);
		if (g) { glides.set(id, predGlide(g, 0, 0, 150, now)); markId(id); predImgs(id); }
		if (cam.glide) cam.glide = predGlide(cam.glide, 0, 0, 150, now);
		predPull(now, 150);
		predSwap(now, 150);
		schedule();
	};
	// Steps go out on a timer at the walking pace: a frame hook alone would wait for frames, and a still scene draws none.
	let stepTimer: ReturnType<typeof setTimeout> | undefined, stepHeld = false;
	const predStep = (now: number): void => {
		stepNow(now);
		clearTimeout(stepTimer);
		if (predOn && (heldDirs.length || tap)) stepTimer = setTimeout(() => predStep(performance.now()), Math.max(stepHeld ? 16 : 0, lastStepAt + (stepMs || 200) - performance.now()));
	};
	const skip = (why: string): void => { if (why !== viewStats.predSkip.last) { viewStats.predSkip.last = why; viewStats.predSkip[why] = Number(viewStats.predSkip[why] ?? 0) + 1; } };
	// Draws the sent steps not drawn yet, while fewer than PRED_MAX are drawn ahead and each lands on a tile the server called free. One that
	// doesn't leaves pending with the ones after it: unanswered and undrawn, they hold the next keys until the server has answered them.
	const drawNext = (now: number): void => {
		if (!pred) return;
		let ax = 0, ay = 0, nd = 0; // where the mob is drawn heading, from the server's tile
		const pp: [number, number] | null = pull ? [pull[1], pull[2]] : null; // and the pulled thing
		const sp = swapsAt(); // and the mobs a step swaps with
		for (const [i, q] of pending.entries()) {
			if (q.drawn) { if (pp) pullAfter(pp, ax, ay, q.dx, q.dy); swapAfter(sp, ax, ay, q.dx, q.dy); ax += q.dx; ay += q.dy; nd++; continue; }
			if (nd >= PRED_MAX || q.id !== pred[0]) return;
			if (!q.tiles) { q.drawn = true; nd++; face(q.id, q.dir & 4 ? 1 : q.dir & 8 ? -1 : 0, q.dir & 1 ? 1 : q.dir & 2 ? -1 : 0, q.n); viewStats.predTurns++; continue; } // a turn in place
			const { id, dx, dy } = q, walk = (stepMs || 150) / q.tiles; // a tile's time: an AI eye's step of several tiles takes one step's time
			if (nd && Math.max(Math.abs(ax + dx), Math.abs(ay + dy)) > PRED_MAX) return skip("far"); // AI eye steps: never more than PRED_MAX tiles ahead (the tiles sent end there)
			if (pp && pull![3] && ((pp[0] === ax + dx && pp[1] === ay + dy) || (dx && dy && ((pp[0] === ax + dx && pp[1] === ay) || (pp[0] === ax && pp[1] === ay + dy))))) return skip("pulled"); // a dense thing in the way: the server decides (swap, bump)
			let past = true; // an eye's step of several tiles: each tile on the way (a xenobio eye stops at its area's edge)
			for (let k = 1; k < q.tiles; k++) past &&= predFree(ax + Math.sign(dx) * k, ay + Math.sign(dy) * k);
			const walk1 = (x: number, y: number): boolean => predFree(x, y) && !swapIn(sp, x, y);
			const swaps = !(dx && dy) && q.tiles === 1 && !pull && !!swapIn(sp, ax + dx, ay + dy); // straight into a listed mob: the two swap
			if (!swaps && (!past || !walk1(ax + dx, ay + dy) || (dx && dy && !(walk1(ax + dx, ay) && walk1(ax, ay + dy))))) {
				if (i === nd) face(id, dx, dy, q.n); // the next step the server tries: it bumps, and Move turns the mob all the same
				pending.length = i; return skip("blocked");
			}
			viewStats.predSkip.last = "";
			// From standing still, the first step takes as long as the server's answer usually does, less the steps that may be drawn ahead after it
			// (up to 400 ms): with a ping longer than that, a step at walking speed would stand ahead waiting, then walk on (a hitch at every start).
			const ms = q.rest && !nd && confirmMs.length ? Math.max(walk, Math.min(400, [...confirmMs].sort((a, b) => a - b)[confirmMs.length >> 1] - (PRED_MAX - 1) * walk)) : walk;
			if (pp) pullAfter(pp, ax, ay, dx, dy);
			swapAfter(sp, ax, ay, dx, dy);
			ax += dx; ay += dy; nd++;
			q.drawn = true;
			face(id, dx, dy, q.n);
			glides.set(id, predGlide(glides.get(id), ax * TILE_PX, ay * TILE_PX, ms, now));
			predImgs(id);
			predPull(now, ms);
			if (swaps) predSwap(now, ms);
			cam.glide = predGlide(cam.glide, ax * TILE_PX, ay * TILE_PX, ms, now);
			cam.fresh = true;
			viewStats.predSteps++;
			markId(id);
			schedule();
		}
	};
	const stepNow = (now: number): void => {
		if (!predOn || (!heldDirs.length && !tap)) return;
		if (now < lastStepAt + (stepMs || 200)) return;
		let d = 0;
		for (const b of heldDirs) d |= b;
		if ((d & 3) === 3) d &= ~3; // as clients.ts mergeMoves: opposite keys cancel
		if ((d & 12) === 12) d &= ~12;
		if (tap && !heldDirs.includes(tap)) d = tap;
		if (!d) { tap = 0; return; }
		const ahead = stepsSent - stepsDone > pending.length && now - lastSentAt < 1000; // a step sent but not drawn is unfinished (1 s: a step message the server dropped as a flood is never counted)
		// Held, not sent: a step sent outside pending (a bump the server took, QUEUE_MAX unanswered) made every later one wait too, until the
		// keys paused for a ping (a Canada VPN: one wall bump, then 40 steps each a ping late). Held until the server answers, it goes out and is
		// drawn at once; the server still has the steps before it to walk meanwhile, so it doesn't fall behind.
		stepHeld = !!pred && !!ctx.last?.eyeTile && (ahead || pending.length >= QUEUE_MAX) && !(pending.length && pending[0].id !== pred[0]);
		if (stepHeld) return skip("held");
		tap = 0;
		sendStep(d);
		if (run && now - lastSentAt > 500) runFrom = stepsSent;
		stepsSent++; lastSentAt = now;
		const rested = now - Math.max(lastStepAt, lastConfirmAt), pace = stepMs || 200;
		lastStepAt = now - lastStepAt < pace + 50 ? lastStepAt + pace : now; // walking on: keep the server's cadence (frames would add ~8 ms a step)
		if (!pred || !ctx.last?.eyeTile) return skip("off");
		if (ahead || pending.length >= QUEUE_MAX || (pending.length && pending[0].id !== pred[0])) return skip("waiting");
		const facing = pending.length ? pending[pending.length - 1].dir : apps.get(pred[0])?.dir;
		const tiles = turnFirst && facing !== d ? 0 : runTiles(), dx = d & 4 ? tiles : d & 8 ? -tiles : 0, dy = d & 1 ? tiles : d & 2 ? -tiles : 0;
		pending.push({ id: pred[0], dx, dy, tiles, dir: d, at: now, rest: rested > 2 * (stepMs || 150), drawn: false, n: stepsSent });
		drawNext(now);
	};
	// Your mob as drawn (its server tile plus its glide), px: a frame that moves it most of a tile at once, and much more than the last, is a jump (predJumps). ?jumpprobe=1
	// also looks every 16 ms, for headless runs that draw no frames.
	const jumpProbe = (now: number): void => {
		const e = ctx.last?.eyeTile;
		if (!pred || !e) return;
		const g = glides.get(pred[0]), o = (g && glideAt(g, now)) ?? [0, 0], c = (cam.glide && glideAt(cam.glide, now)) ?? [0, 0];
		const at = [e.x * TILE_PX + o[0], e.y * TILE_PX + o[1], e.x * TILE_PX + c[0], e.y * TILE_PX + c[1], now];
		if (drawnAt && viewStats.predJumps.length < 20) {
			const dm = [at[0] - drawnAt[0], at[1] - drawnAt[1]], dc = [at[2] - drawnAt[2], at[3] - drawnAt[3]];
			const step = Math.max(...dm.map(Math.abs), ...dc.map(Math.abs));
			if (step >= 24 && step > 2 * jumpPrev + 8) // a fast mover (an AI eye, 3 tiles a tick) moves that far every look: only a sudden change counts
				viewStats.predJumps.push(`${Math.round(now)}ms (+${Math.round(now - drawnAt[4])}) mob ${dm} cam ${dc} px, glide ${g ? `${g.ox},${g.oy}->${g.tx ?? 0},${g.ty ?? 0} ${Math.round(now - g.t0)}/${Math.round(g.ms)} ms` : "none"}, cam ${cam.glide ? `${cam.glide.ox},${cam.glide.oy}->${cam.glide.tx ?? 0},${cam.glide.ty ?? 0} ${Math.round(now - cam.glide.t0)}/${Math.round(cam.glide.ms)} ms` : "none"}, drawn ahead ${pending.filter((q) => q.drawn).length} of ${pending.length}, sent-done ${stepsSent - stepsDone}`);
			jumpPrev = step;
		}
		drawnAt = at;
	};
	if (new URLSearchParams(location.search).get("jumpprobe") === "1") setInterval(() => jumpProbe(performance.now()), 16);
	/** each frame while prediction is on: a step the server never answered glides back, held keys send the next step, and the probes look */
	const frame = (now: number): void => {
		if (pending.length && now - pending[0].at > predTimeout()) { viewStats.predLate++; predBack(now); }
		predStep(now);
		jumpProbe(now);
		if (pred && pred.length > 2 && glides.has(pred[0])) {
			const at = (id: number) => { const g = glides.get(id); return (g && glideAt(g, now)) ?? [0, 0]; }, m = at(pred[0]);
			viewStats.predImgFrames++;
			for (let i = 2; i < pred.length; i++) { const b = at(pred[i]); viewStats.predImgGap = Math.max(viewStats.predImgGap, Math.abs(b[0] - m[0]) + Math.abs(b[1] - m[1])); }
		}
		if (pred && pull && glides.has(pred[0])) { // the pulled thing's distance from the mob as drawn, px (a tile = 32 when it trails)
			const at = (id: number) => { const g = glides.get(id); return (g && glideAt(g, now)) ?? [0, 0]; }, m = at(pred[0]), b = at(pull[0]);
			const gap = Math.max(Math.abs(pull[1] * TILE_PX + b[0] - m[0]), Math.abs(pull[2] * TILE_PX + b[1] - m[1]));
			viewStats.predPullFrames++;
			viewStats.predPullGap = Math.max(viewStats.predPullGap, Math.round(gap));
			if (gap > 1.5 * TILE_PX) viewStats.predPullFar++;
		}
	};
	const DIR_BITS: Record<string, number> = { NORTH: 1, SOUTH: 2, EAST: 4, WEST: 8 };
	const predictKey = (key: string, down: boolean): void => {
		predOn = true;
		const b = DIR_BITS[key];
		if (!b) return;
		const i = heldDirs.indexOf(b);
		if (i >= 0) heldDirs.splice(i, 1);
		if (down) { heldDirs.push(b); tap = b; predStep(performance.now()); }
	};
	/** an update came: a full one or a gone mob forgets the turned look */
	const forget = (u: ViewUpdate): void => {
		if (u.full) faced = null;
		if (faced && u.gone.includes(faced.id)) faced = null;
	};
	/** a new look for id came: if it is the mob drawn turned, it stays turned till the step is done */
	const newLook = (id: number, a: BuiltAppearance): void => {
		if (faced?.id === id) { faced.server = a; if (a.dir !== faced.dir) apps.set(id, turned(a, faced.dir)); } // a new look before the step is done: still turned
	};
	/** the server's lists for prediction, and how many sent steps it has finished */
	const serverState = (u: ViewUpdate, prev: ViewUpdate | null): void => {
		pred = u.pred ?? null;
		run = u.predRun ?? null;
		turnFirst = !!u.predTurn;
		pull = u.pull ?? null;
		swap = u.swap ?? null;
		if (u.full || prev?.eyeTile?.z !== u.eyeTile?.z) pending = [];
		if (u.full) stepsSent = u.steps ?? 0; // a new connection counts from 0
		stepsDone = u.steps ?? 0;
		if (faced && stepsDone >= faced.n) unface();
	};
	/** The update's moves as glides: the server taking a predicted step goes on from where it is drawn, anything else glides (or snaps) from
	 *  its old tile. Then the steps it answered make room to draw more. Returns whether anything moved. */
	const applyMoves = (u: ViewUpdate, prev: ViewUpdate | null, now: number): boolean => {
		let changed = false;
		const e = u.eyeTile, pe = prev?.eyeTile;
		const tickMs = prev && u.worldTime > prev.worldTime ? Math.max(10, (u.worldTime - prev.worldTime) * 100 / (u.merged ?? 1)) : 50; // world.time is in deciseconds; one update per tick (merged: several, held back by the server on a slow link; netcode 1: a click's at-once view has the last tick's time)
		const start = (old: Glide | null | undefined, dx: number, dy: number, size: number): Glide => serverGlide(old, dx, dy, size, now, tickMs * glideSlow, TILE_PX);
		let camSz = -1; // the glide size the camera started with in this update (an orbiting ghost moves along with its eye object: the faster of the two wins)
		const imgsOk = new Set<number>(); // the mob's images, when its predicted step was taken: they keep the mob's glide, not their own server step
		const ownFirst = pred ? [...(u.moved ?? [])].sort((a, b) => Number(b[0] === pred![0]) - Number(a[0] === pred![0])) : u.moved ?? []; // the mob before its images and riders, which the server can name first: as a step of their own, theirs restarted the camera behind the predicted one
		for (const [id, x0, y0, x1, y1, size, anim] of ownFirst) {
			const dx = x1 - x0, dy = y1 - y0;
			if (imgsOk.has(id)) continue;
			if (pull && id === pull[0] && !u.full && anim !== 0 && Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
				const g = glides.get(id);
				if (g && (g.tx || g.ty)) { // drawn ahead (netcode 5): its glide goes on from where it is, now counted from the new tile; predPull sets the target
					g.ox -= dx * TILE_PX; g.oy -= dy * TILE_PX; g.tx = (g.tx ?? 0) - dx * TILE_PX; g.ty = (g.ty ?? 0) - dy * TILE_PX;
					markId(id);
					changed = true;
					continue;
				}
			}
			if (swapPred.has(id) && !u.full && anim !== 0 && Math.abs(dx) <= 1 && Math.abs(dy) <= 1) { // swapped as drawn: as the pulled thing, the glide goes on from where it is; predSwap sets the target
				const g = glides.get(id);
				if (g) { g.ox -= dx * TILE_PX; g.oy -= dy * TILE_PX; g.tx = (g.tx ?? 0) - dx * TILE_PX; g.ty = (g.ty ?? 0) - dy * TILE_PX; markId(id); changed = true; continue; }
			}
			if (pred && id === pred[0]) { viewStats.ownMoves++; if (now - lastConfirmAt < 1000 && viewStats.ownMoveGaps.length < 2000) viewStats.ownMoveGaps.push(Math.round(now - lastConfirmAt)); lastConfirmAt = now; if (size > 0) stepMs = TILE_PX / size * 50; } // client/Move sets glide_size from the mob's move delay (32 / ticks per step)
			if (pending.length && id === pending[0].id) {
				const g = glides.get(id);
				let n = 0, sx = 0, sy = 0; // the server's move is the first n predicted steps (a merged view can bring two at once)
				for (let i = 0; i < pending.length && !n; i++) { sx += pending[i].dx; sy += pending[i].dy; if (sx === dx && sy === dy) n = i + 1; }
				const p = pending[0];
				if (p.rest) { confirmMs.push(now - p.at); if (confirmMs.length > 20) confirmMs.shift(); }
				pending = n ? pending.slice(n) : [];
				if (n && !u.full && anim !== 0 && g) { // the server took the predicted step(s): the glide goes on from where it is, now from the new tile
					viewStats.predOk += n;
					let ax = 0, ay = 0; // the steps still drawn ahead (the server can take undrawn ones too, when a merged view brings several)
					for (const q of pending) if (q.drawn) { ax += q.dx; ay += q.dy; }
					const rebase = (q: Glide) => { q.ox -= dx * TILE_PX; q.oy -= dy * TILE_PX; q.tx = ax * TILE_PX; q.ty = ay * TILE_PX; };
					rebase(g);
					for (let i = 2; i < (pred?.[0] === id ? pred.length : 0); i++) imgsOk.add(pred![i]);
					predImgs(id);
					if (cam.glide && e && pe && e.x === x1 && e.y === y1 && pe.x === x0 && pe.y === y0) rebase(cam.glide);
					if (viewStats.keyAt) viewStats.keyRecv.push(Math.round(now - viewStats.keyAt));
					markId(id);
					changed = true;
					continue;
				}
				viewStats.predWrong++;
			}
			if (u.full || anim === 0 || Math.abs(dx) > 1 || Math.abs(dy) > 1) { glides.delete(id); markId(id); continue; } // a jump, or NO_STEPS: snap
			glides.set(id, start(glides.get(id), dx, dy, size));
			lastGlide = { ms: glides.get(id)!.ms, at: now };
			markId(id);
			if (e && pe && e.z === pe.z && e.x === x1 && e.y === y1 && pe.x === x0 && pe.y === y0 && (size > 0 ? size : 4) > camSz) { camSz = size > 0 ? size : 4; cam.glide = start(cam.glide, dx, dy, size); cam.fresh = true; if (viewStats.keyAt) viewStats.keyRecv.push(Math.round(now - viewStats.keyAt)); } // the eye's mob: the camera follows it
			changed = true;
		}
		while (pending.length && !pending[0].tiles && pending[0].n <= stepsDone) pending.shift(); // turns the server has done (they move nothing)
		if (pending.length && stepsSent - stepsDone < pending.length) predBack(now); // the server finished a sent step without taking it (a bump)
		drawNext(now); // the server's answers freed room to draw more of the sent steps
		predPull(now); // the pulled thing's server step or offset changed: its target from the drawn steps again
		predSwap(now); // and the swapped mobs'
		if (pending.length) predImgs(pending[0].id); // a bubble that appeared mid-step, or whose own server step came before the mob's: it goes where the mob is drawn
		return changed;
	};
	return {
		PRED_MAX, cam, predFree, predTimeout, predictKey, frame, forget, newLook, serverState, applyMoves,
		get predOn() { return predOn; },
		get pred() { return pred; },
		get pending() { return pending; },
		get lastGlide() { return lastGlide; },
	};
}
