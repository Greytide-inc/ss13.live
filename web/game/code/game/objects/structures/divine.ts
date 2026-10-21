// From code/game/objects/structures/divine.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12728, "/obj/structure/sacrificealtar", "/obj/structure", {
	anchored: 1,
	can_buckle: 1,
	name: "sacrificial altar",
	desc: "An altar designed to perform blood sacrifice for a deity.",
	icon: rt.rsc("icons/obj/hand_of_god_structures.dmi"),
	icon_state: "sacrificealtar",
	density: 0,
});

// /obj/structure/sacrificealtar/proc/attack_hand  (code/game/objects/structures/divine.dm:11)  may sleep
rt.def("/obj/structure/sacrificealtar/proc/attack_hand", function* attack_hand(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.srcCall(f, "has_buckled_mobs")))) {
		return live(f.dot);
	}
	if (!truthy((L = rt.locateIn(f, T("/mob/living"), rt.sv(f, "buckled_mobs"))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You attempt to sacrifice ＀ by invoking the sacrificial ritual.</span>", [live(L)])]);
	yield* g.callName(f, live(L), "gib", []);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has sacrificed ＀ on the sacrifical altar.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[0])])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(L)]))])]);
	return f.dot;
}, true, { args: ["user"] });

rt.type(12729, "/obj/structure/healingfountain", "/obj/structure", {
	time_between_uses: 1800,
	last_process: 0,
	anchored: 1,
	name: "healing fountain",
	desc: "A fountain containing the waters of life.",
	icon: rt.rsc("icons/obj/hand_of_god_structures.dmi"),
	icon_state: "fountain",
	density: 1,
});

// /obj/structure/healingfountain/proc/attack_hand  (code/game/objects/structures/divine.dm:32)  may sleep
rt.def("/obj/structure/healingfountain/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (rt.gt(add(rt.sv(f, "last_process"), rt.sv(f, "time_between_uses")), rt.worldTime(f))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The fountain appears to be empty.</span>"]);
		return live(f.dot);
	}
	rt.setSv(f, "last_process", rt.worldTime(f));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The water feels warm and soothing as you touch it. The fountain immediately dries up shortly afterwards.</span>"]);
	yield* g.callName(f, rt.fv(f, "reagents", live(user)), "add_reagent", ["godblood", 20]);
	yield* g.srcCall(f, "update_icons");
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/healingfountain/proc/update_icons")])), rt.sv(f, "time_between_uses")]);
	return f.dot;
}, true);

// /obj/structure/healingfountain/proc/update_icons  (code/game/objects/structures/divine.dm:43)
rt.def("/obj/structure/healingfountain/proc/update_icons", function update_icons(f: Frame) {
	if (rt.gt(add(rt.sv(f, "last_process"), rt.sv(f, "time_between_uses")), rt.worldTime(f))) {
		rt.setSv(f, "icon_state", "fountain");
	} else {
		rt.setSv(f, "icon_state", "fountain-red");
	}
	return f.dot;
});
