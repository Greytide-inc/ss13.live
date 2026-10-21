// restart.ts - fixture for the round-restart section (tests/engine-sections.ts runRestartCheck): the DM tests/dm/restart.dm.
import { rt, setG, G } from "./lib.js";
import type { Frame, Value } from "./lib.js";
const { T, P, g, live, add } = rt;

rt.globals([["rs_keep", null], ["rs_after_reboot", 0]]);

rt.def("/proc/qdel", function qdel(f: Frame, D: Value) {
	rt.del(f, live(D));
	return f.dot;
});

// built in, as in BYOND (the DM test program gets it from the compiler)
rt.def("/world/proc/Reboot", undefined, false, { args: ["Reason"] });

rt.type("/obj/rs_pet", "/obj", { age: 0 });

rt.def("/obj/rs_pet/proc/New", function New(f: Frame) {
	let S: Value = null;
	rt.callSuper(f, [], rt.Args.Same);
	S = rt.new_(f, T("/savefile"), ["data/npc_saves/RsPet.sav"]);
	rt.setSrcVar(f, "age", rt.input(f, rt.R.index, null, [live(S), "age"]));
	if (rt.srcVar(f, "age") === null) {
		rt.setSrcVar(f, "age", 0);
		rt.op(f, "OutputReference", [rt.R.index], [live(S), "age", 0], false);
	}
	return f.dot;
});

rt.def("/proc/rs_init", function rs_init(f: Frame) {
	rt.new_(f, T("/obj/rs_pet"), [rt.locate(2, 2, 1)]);
	setG("rs_keep", rt.new_(f, T("/savefile"), ["data/npc_saves/RsKeep.sav"]));
	rt.op(f, "OutputReference", [rt.R.index], [live(G("rs_keep")), "who", "build"], false);
	return f.dot;
});

rt.def("/proc/rs_round_end", function rs_round_end(f: Frame) {
	let P_: Value = null, S: Value = null;
	P_ = rt.locateIn(f, T("/obj/rs_pet"), rt.world());
	S = rt.new_(f, T("/savefile"), ["data/npc_saves/RsPet.sav"]);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "age", add(rt.get(f, live(P_), "age"), 1)], false);
	rt.callName(f, rt.world(), "Reboot", ["Round ended."]);
	setG("rs_after_reboot", 1);
	return f.dot;
});

rt.def("/proc/rs_pets", function rs_pets(f: Frame) {
	const L = rt.list();
	rt.forList(f, 0, rt.world(), T("/obj/rs_pet"));
	for (let p = rt.next(f, 0); p !== undefined; p = rt.next(f, 0)) {
		L.push(rt.fmt("＀,＀:＀", [rt.get(f, live(p), "x"), rt.get(f, live(p), "y"), rt.get(f, live(p), "age")]));
	}
	rt.endFor(f, 0);
	return rt.call(f, P("/proc/jointext"), null, [L, " "]);
});

rt.def("/proc/rs_player_keep", function rs_player_keep(f: Frame) {
	rt.op(f, "OutputReference", [rt.R.index], [live(G("rs_keep")), "who", "player"], false);
	return f.dot;
});

rt.def("/proc/rs_keep_who", function rs_keep_who(f: Frame) {
	const S = rt.new_(f, T("/savefile"), ["data/npc_saves/RsKeep.sav"]);
	return rt.input(f, rt.R.index, null, [live(S), "who"]);
});
