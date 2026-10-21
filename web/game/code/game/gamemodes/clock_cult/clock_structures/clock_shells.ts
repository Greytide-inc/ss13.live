// From code/game/gamemodes/clock_cult/clock_structures/clock_shells.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12158, "/obj/structure/destructible/clockwork/shell", "/obj/structure/destructible/clockwork", {
	mobtype: rt.typePath("/mob/living/simple_animal/hostile/clockwork"),
	spawn_message: " is an error and you should yell at whoever spawned this shell.",
	construction_value: 0,
	anchored: 0,
	density: 0,
	resistance_flags: 99,
});

// /obj/structure/destructible/clockwork/shell/proc/attackby  (code/game/gamemodes/clock_cult/clock_structures/clock_shells.dm:11)  may sleep
rt.def("/obj/structure/destructible/clockwork/shell/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null, A: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [S, A, $0, $1, $2];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/mmi/posibrain/soul_vessel")) ? 1 : 0))) {
		if (!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[1])])))) {
			yield* g.callSuper(f, [], rt.Args.Same);
			return 0;
		}
		if (!truthy(rt.gv(f, "brainmob", (S = live(f.args[0]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is inactive! Turn it on or capture a mind first.</span>", [live(S)])]);
			return 0;
		}
		if ((truthy(rt.fv(f, "brainmob", live(S))) && (!truthy(rt.gv(f, "client", rt.fv(f, "brainmob", live(S)))) || !truthy(rt.gv(f, "mind", rt.fv(f, "brainmob", live(S))))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀'s trapped consciousness appears inactive!</span>", [live(S)])]);
			return 0;
		}
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ places ＀ in ＀, where it fuses to the shell.</span>", [live(f.args[1]), live(S), live(f.src)]), fmt("<span class='brass'>You place ＀ in ＀, fusing it to the shell.</span>", [live(S), live(f.src)])]);
		yield* g.callName(f, (A = (yield* g.new_(f, rt.sv(f, "mobtype"), [rt.getStep(f, live(f.src), 0)]))), "visible_message", [fmt("<span class='brass'>＀＀</span>", [live(f.src), rt.sv(f, "spawn_message")])]);
		yield* g.callName(f, rt.gv(f, "mind", rt.fv(f, "brainmob", live(S))), "transfer_to", [live(A)]);
		$0 = live(A);
		$1 = null;
		if (truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.fv(f, "name", live(A)), rt.initial(f, live(A), "name")])))) {
			$2 = fmt("＀", [rt.initial(f, live(A), "name")]);
		} else {
			$2 = fmt("＀", [rt.fv(f, "name", live(A))]);
		}
		yield* g.callName(f, $0, "fully_replace_character_name", [$1, fmt("＀ (＀)", [$2, rt.gv(f, "name", rt.fv(f, "brainmob", live(S)))])]);
		yield* g.callName(f, live(f.args[1]), "drop_item", []);
		yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return 1;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });
