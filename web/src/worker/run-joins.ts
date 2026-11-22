// run-joins - the players of boot-worker.ts's tick loop, moved out of run(): the first player's way in (lobby, ?join, ?roundstart),
// players who come and go while the round runs, late joins, the ?second test aid, and the log lines of where the first player is.
// makeJoins(ctx) keeps the player records; step() runs once per tick, before the views are sent.

import type { VM } from "../vm/interpreter.js";
import { DMList, DMObject, live } from "../vm/objects.js";
import { refOf } from "../vm/refs.js";
import { isTruthy, stringify, type Value } from "../vm/value.js";
import { ViewDiffer } from "./client-view.js";
import { mouseSeen, type Player } from "./input.js";
import { holdLobby, releaseLobby, readyAtRoundStart, restoreJobPrefs } from "./test-aids.js";
import type { Joins } from "./joins.js";
import type { Pace } from "./pace.js";
import type { StartMsg } from "./messages.js";

/** What run() shares with the joins. The getters read run()'s live variables; startScenario starts the scenario script at the spawn. */
export interface JoinsCtx {
	opts: StartMsg;
	vm: VM;
	log: (line: string) => void;
	post: (m: unknown) => void;
	secs: () => string;
	playerKey: string;
	joinJob: string;
	lobbyMode: boolean;
	roundstartJoin: boolean;
	wantGender: string;
	pace: Pace;
	scenarioText: string | null | undefined;
	joins: () => Joins;
	readonly ticks: number;
	readonly initDone: boolean;
	readonly roundStart: { ms: number; ticks: number } | null;
	startScenario: (mobPath: string) => void;
}

export function makeJoins(ctx: JoinsCtx) {
	const { opts, vm, log, post, secs, playerKey, joinJob, lobbyMode, roundstartJoin, wantGender, pace, scenarioText } = ctx;
	let joinAt = Infinity, spawned = false, autojoined = false, lobbyPaced = false, savedJobPrefs: Record<string, Value> | null = null, lastMouseVars = "", mouseVarLogs = 0;
	let joinTick: number | null = null, genderClickAt = -1, lastPos = "", lastState = "";
	// one record per connected player. Input names its player by ckey (none = the first); output is routed by the ckey the engine tags it with.
	const players: Player[] = [];
	const early = new Map<string, string[]>(); // text sent to a client while it connects, before its record exists
	const addPlayer = (key: string, client: DMObject): Player => {
		const differ = new ViewDiffer({ dirty: opts.dirty !== false }); // ?dirty=0: the old full scan every update
		differ.logView = (m) => log(m);
		differ.logAnim = (m) => log(`[vm-boot] anim ${m}`);
		const p: Player = { ckey: stringify(client.getVar("ckey")), key, client, differ, outLines: early.get(stringify(client.getVar("ckey"))) ?? [], joined: false, views: 0, outCount: 0 };
		players.push(p);
		return p;
	};
	const playerOf = (ck?: string): Player | undefined => (ck ? players.find((p) => p.ckey === ck.toLowerCase().replace(/[^a-z0-9@]/g, "")) : players[0]);
	const by = (ck?: string) => (ck ? ` by ${ck}` : ""); // the end of every per-input log line: whose input it was
	const lateJoin: { P: Player; job: string; near?: boolean; at: number }[] = [];
	let secondAt = -1, secondJoinTick = -1, secondP: Player | null = null, lastPlayersLog = Date.now(); // mp1 test aid (?second=KEY[&secondjob=JOB]): a second client
	const firstC = (): DMObject => players[0]?.client as DMObject; // the test aids below act on the first player
	const isJoined = () => ctx.joins().open;
	/** The first player is refused or left before joining: later players come in, with real time and no held lobby. */
	const firstGone = (why: string) => {
		ctx.joins().firstGone(); joinTick = null;
		if (lobbyMode || roundstartJoin) { lobbyPaced = true; pace.wall = Date.now(); pace.tick = vm.sched.tick; }
		if (roundstartJoin) releaseLobby(vm);
		log(`[vm-boot] first player ${playerKey} ${why}: later players come in without them, world.time ${vm.sched.time}`);
	};
	const step = () => {
		if (lobbyMode && ctx.joins().mode === "waiting" && ctx.initDone) { // the player arrives in the lobby; real time runs from here
			const fm = ctx.joins().firstArrives(), c = fm === "setup" ? vm.clients.connect(playerKey, { address: opts.playerAddress }) : null;
			vm.animLog = [];
			if (fm === "gone") firstGone("left before the world was ready");
			else log(`[vm-boot] client ${playerKey} ${c ? `connected, mob ${(c.getVar("mob") as DMObject | null)?.type?.path ?? "null"}` : "refused"} at ${secs()} s wall, world.time ${vm.sched.time} (lobby)`);
			if (!c && fm === "setup") firstGone("was refused");
			if (c) {
				addPlayer(playerKey, c).joined = true;
				ctx.joins().firstIn(); lobbyPaced = true; pace.wall = Date.now(); pace.tick = vm.sched.tick;
				const gi = vm.tree.globalNames.indexOf("SSticker"), tk = gi >= 0 ? live(vm.globals[gi]) : null;
				if (tk instanceof DMObject && opts.lobbySeconds) { tk.setVar("start_at", vm.sched.time + opts.lobbySeconds * 10); if (tk.getVar("timeLeft") != null) tk.setVar("timeLeft", opts.lobbySeconds * 10); }
				post({ type: "milestone", name: "lobby", s: Number(secs()) });
			}
		}
		if (opts.autojoin && lobbyMode && ctx.joins().mode === "in" && !spawned && !autojoined && ctx.roundStart !== null && ctx.ticks >= (ctx.roundStart as { ticks: number }).ticks + 20) {
			// Test aid: ?autojoin=JOB clicks the lobby's late-join link for JOB (the Topic the "Join Game!" window's job link sends)
			autojoined = true;
			const c = firstC();
			if (c) { vm.clients.topic(c, `src=${refOf(c.getVar("mob"))};SelectedJob=${opts.autojoin}`); log(`[vm-boot] autojoin: late-join link for ${opts.autojoin} clicked at world.time ${vm.sched.time}`); }
		}
		if (joinJob && ctx.joins().mode === "waiting" && (roundstartJoin ? ctx.initDone : ctx.roundStart !== null)) {
			const fm = ctx.joins().firstArrives(), c = fm === "setup" ? vm.clients.connect(playerKey, { address: opts.playerAddress }) : null;
			vm.animLog = []; // record animate()/flick() from now on (the view differ drains it)
			if (fm === "gone") firstGone("left before the world was ready");
			else log(`[vm-boot] client ${playerKey} ${c ? `connected, mob ${(c.getVar("mob") as DMObject | null)?.type?.path ?? "null"}` : "refused"} at ${secs()} s wall, world.time ${vm.sched.time}`);
			if (c) { addPlayer(playerKey, c); joinTick = ctx.ticks + 20; if (roundstartJoin) holdLobby(vm); } // hold the lobby countdown until the player is Ready
			else if (fm === "setup") firstGone("was refused");
		}
		if (joinTick !== null && ctx.ticks >= joinTick) {
			const c = firstC();
			const prefs = live(c.getVar("prefs"));
			if (genderClickAt < 0 && prefs instanceof DMObject && prefs.getVar("gender") !== wantGender) {
				genderClickAt = ctx.ticks;
				vm.clients.topic(c, "_src_=prefs;preference=gender");
				log(`[vm-boot] gender link clicked: now ${String(prefs.getVar("gender"))}`);
			}
			// the gender click's ShowChoices can sleep in CHECK_TICK (update_preview_icon). Joining
			// before it finishes hard-deletes the new_player (mob/Destroy: QDEL_HINT_HARDDEL), so the resumed
			// ShowChoices reads user.key on null. Wait for client/Topic to clear `inprefs` (at most 200 ticks).
			if (genderClickAt >= 0 && isTruthy(c.getVar("inprefs")) && ctx.ticks < genderClickAt + 200) joinTick = ctx.ticks + 1;
			else {
				if (genderClickAt >= 0) log(`[vm-boot] gender topic finished after ${ctx.ticks - genderClickAt} ticks`);
				joinTick = null;
				if (roundstartJoin && prefs instanceof DMObject) {
					savedJobPrefs = readyAtRoundStart(vm, c, joinJob); // the saved choices come back once you've spawned
					log(`[vm-boot] ready as ${joinJob} (round start join) at ${secs()} s wall, world.time ${vm.sched.time}`);
				} else {
					joinAt = ctx.ticks;
					vm.clients.topic(c, `src=${refOf(c.getVar("mob"))};SelectedJob=${joinJob}`);
					const mob = live(c.getVar("mob"));
					log(`[vm-boot] joined as ${joinJob}: mob ${mob instanceof DMObject ? mob.type.path : "null"} gender ${mob instanceof DMObject ? String(mob.getVar("gender")) : "?"} at ${secs()} s wall, world.time ${vm.sched.time}`);
					post({ type: "milestone", name: "joined", s: Number(secs()) });
				}
				ctx.joins().firstIn(); players[0]!.joined = true;
			}
		}
		// Multiplayer: players that connect and leave while the round runs (tools/server.mjs sends connect / disconnect per WebSocket)
		for (const ck of ctx.joins().takeCancelled()) { vm.clients.send(ck, { type: "disconnect" }); log(`[vm-boot] client ${ck} left before coming in: not connected`); }
		for (const ck of ctx.joins().takeLeaving()) {
			const P = players.find((x) => x.ckey === ck);
			if (!P) continue;
			const wasFirst = P === players[0] && ctx.joins().mode === "setup"; // left in the join wait
			players.splice(players.indexOf(P), 1); vm.clients.drop(P.client); log(`[vm-boot] client ${P.key} disconnected (mob stays), ${players.length} players left`);
			if (wasFirst) firstGone("left before joining");
		}
		for (const { key, job, near, address, ckey: ck } of ctx.joins().takeArrivals()) {
			if (players.some((x) => x.ckey === ck)) { log(`[vm-boot] client ${key} refused: already connected`); continue; }
			const c2 = vm.clients.connect(key, { address });
			log(`[vm-boot] client ${key} ${c2 ? `connected, mob ${(c2.getVar("mob") as DMObject | null)?.type?.path ?? "null"}` : "refused"} at ${secs()} s wall, world.time ${vm.sched.time}`);
			// no job (server --lobby): stays in the lobby; a player back in their old body (client/New finds the mob with their key) doesn't join again
			if (c2) { const P = addPlayer(key, c2), m = live(c2.getVar("mob")); P.joined = true; if (job && m instanceof DMObject && m.type.path === "/mob/dead/new_player") lateJoin.push({ P, job, near, at: ctx.ticks + 20 }); }
		}
		for (let i = lateJoin.length - 1; i >= 0; i--) { // the late-join link of tg's Join Game window, once the round runs
			const { P, job, near, at } = lateJoin[i]!;
			if (ctx.roundStart === null || ctx.ticks < at) continue;
			lateJoin.splice(i, 1);
			if (!players.includes(P)) continue;
			vm.clients.topic(P.client, `src=${refOf(P.client.getVar("mob"))};SelectedJob=${job}`);
			const mob = live(P.client.getVar("mob"));
			if (near && mob instanceof DMObject && players[0] && players[0] !== P) { // test aid (server --spawn-near): put the new mob on the first player's tile
				const fm = mob.type.procs.get("forceMove"), tl = live(vm.getField(live(players[0].client.getVar("mob")) as DMObject, "loc"));
				if (fm && tl) vm.call(fm, [tl], mob, mob);
			}
			log(`[vm-boot] client ${P.key} late-joined as ${job}: mob ${mob instanceof DMObject ? mob.type.path : "null"} at ${secs()} s wall, world.time ${vm.sched.time}`);
		}
		if (opts.second) { // mp1 test aid: ?second=KEY connects a second client 60 ticks after the first one joined, which late-joins as ?secondjob (default Assistant) 20 ticks later
			if (isJoined() && secondAt < 0) secondAt = ctx.ticks + 60;
			if (secondAt >= 0 && !secondP && ctx.ticks >= secondAt) {
				const c2 = vm.clients.connect(opts.second);
				log(`[vm-boot] second client ${opts.second} ${c2 ? `connected, mob ${(c2.getVar("mob") as DMObject | null)?.type?.path ?? "null"}` : "refused"} at ${secs()} s wall, world.time ${vm.sched.time}`);
				if (c2) { secondP = addPlayer(opts.second, c2); secondP.joined = true; secondJoinTick = ctx.ticks + 20; } else secondAt = Infinity;
			}
			if (secondP && secondJoinTick >= 0 && ctx.ticks >= secondJoinTick) {
				secondJoinTick = -1;
				const c2 = secondP.client, job = opts.secondJob ?? "Assistant";
				vm.clients.topic(c2, `src=${refOf(c2.getVar("mob"))};SelectedJob=${job}`);
				const mob2 = live(c2.getVar("mob"));
				log(`[vm-boot] second client ${opts.second} late-joined as ${job}: mob ${mob2 instanceof DMObject ? mob2.type.path : "null"} at ${secs()} s wall, world.time ${vm.sched.time}`);
			}
			if (Date.now() - lastPlayersLog >= 5000) {
				lastPlayersLog = Date.now();
				log(`[vm-boot] players: ${players.map((p) => `${p.ckey} mob ${(live(p.client.getVar("mob")) as DMObject | null)?.type?.path ?? "null"} views ${p.views} output ${p.outCount}`).join(" | ")}`);
			}
		}
		if (isJoined() && players.length && Object.keys(mouseSeen).length) { // what tg's client/MouseMove and MouseDrag stored (autoclick.dm), the first few changes
			const cl = firstC(), mo = live(cl?.getVar("mouseObject")), ml = live(cl?.getVar("mouseLocation"));
			const ms = `mouseParams ${stringify(cl?.getVar("mouseParams"))} mouseObject ${mo instanceof DMObject ? mo.type.path : "-"} mouseLocation ${ml instanceof DMObject ? ml.type.path : "-"}`;
			if (ms !== lastMouseVars && mouseVarLogs++ < 8) log(`[vm-boot] client ${(lastMouseVars = ms)}, world.time ${vm.sched.time}`);
		}
		if (isJoined()) {
			// Where the player is, whenever it changes (the walking check reads these lines).
			const mob = live(firstC()?.getVar("mob"));
			if ((lobbyMode || roundstartJoin) && !spawned && mob instanceof DMObject && !mob.type.path.includes("new_player")) {
				spawned = true; joinAt = ctx.ticks; post({ type: "milestone", name: "joined", s: Number(secs()) }); log(`[vm-boot] spawned: mob ${mob.type.path} at ${secs()} s wall, world.time ${vm.sched.time}`);
				if (savedJobPrefs) { restoreJobPrefs(firstC(), savedJobPrefs); savedJobPrefs = null; }
				if (scenarioText) ctx.startScenario(mob.type.path);
			}
			if (mob instanceof DMObject) {
				const pos = `${vm.getField(mob, "x")},${vm.getField(mob, "y")},${vm.getField(mob, "z")} dir ${vm.getField(mob, "dir")}${live(vm.getField(mob, "buckled")) ? " buckled" : ""}`;
				if (pos !== lastPos) log(`[vm-boot] player at ${(lastPos = pos)}, world.time ${vm.sched.time}`);
				// intent and active hand, where a HUD click shows up.
				const st = `a_intent ${String(vm.getField(mob, "a_intent"))}, active hand ${String(vm.getField(mob, "active_hand_index"))}${(() => { const h = live(mob.getVar("held_items")); return h instanceof DMList ? `, hands [${h.items.map((i) => { const o = live(i); return o instanceof DMObject ? stringify(o.getVar("name")) : "-"; }).join(", ")}]` : ""; })()}`;
				if (st !== lastState) log(`[vm-boot] player state ${(lastState = st)}, world.time ${vm.sched.time}`);
			}
		}
	};
	return { players, early, addPlayer, playerOf, by, firstC, isJoined, step, get joinAt() { return joinAt; }, get lobbyPaced() { return lobbyPaced; } };
}
