// From code/game/objects/structures/dresser.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12730, "/obj/structure/dresser", "/obj/structure", {
	anchored: 1,
	name: "dresser",
	desc: "A nicely-crafted wooden dresser. It's filled with lots of undies.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "dresser",
	density: 1,
});

// /obj/structure/dresser/proc/attackby  (code/game/objects/structures/dresser.dm:10)  may sleep
rt.def("/obj/structure/dresser/proc/attackby", function* attackby(f: Frame, _P: Value, user: Value, params: Value) {
	let $0: any, $1: any;
	f.vars = () => [_P, user, params, $0, $1];
	if (!truthy((rt.istype(live(_P), T("/obj/item/weapon/wrench")) ? 1 : 0))) return f.dot;
	$0 = live(user);
	if (truthy(rt.sv(f, "anchored"))) {
		$1 = "unwrench";
	} else {
		$1 = "wrench";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You begin to ＀ ＀.</span>", [$1, live(f.src)])]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(_P)), 50, 1]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 20, "target", live(f.src)], rt.Args.Named)))) return f.dot;
	$0 = live(user);
	if (truthy(rt.sv(f, "anchored"))) {
		$1 = "unwrench";
	} else {
		$1 = "wrench";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You successfully ＀ ＀.</span>", [$1, live(f.src)])]);
	rt.setSv(f, "anchored", (!truthy(rt.sv(f, "anchored")) ? 1 : 0));
	return f.dot;
}, true);

// /obj/structure/dresser/proc/deconstruct  (code/game/objects/structures/dresser.dm:18)  may sleep
rt.def("/obj/structure/dresser/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	yield* g.new_(f, T("/obj/item/stack/sheet/mineral/wood"), [rt.getStep(f, live(f.src), 0), 10]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/dresser/proc/attack_hand  (code/game/objects/structures/dresser.dm:22)  may sleep
rt.def("/obj/structure/dresser/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let H: Value = null, choice: Value = null, new_undies: Value = null, new_undershirt: Value = null, new_socks: Value = null;
	let $0: any;
	f.vars = () => [user, H, choice, new_undies, new_undershirt, new_socks, $0];
	if (!truthy((yield* g.srcCall(f, "Adjacent", live(user))))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	if (((truthy(rt.gv(f, "dna", (H = live(user)))) && truthy(rt.gv(f, "species", rt.fv(f, "dna", live(H))))) && truthy((rt.isIn(f, 26, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You are not capable of wearing underwear.</span>"]);
		return live(f.dot);
	}
	choice = (yield* g.op(f, "Prompt", [1], [null, "Changing", "Underwear, Undershirt, or Socks?", live(user), rt.list("Underwear", "Undershirt", "Socks")]));
	if (!truthy((yield* g.srcCall(f, "Adjacent", live(user))))) {
		return live(f.dot);
	}
	$0 = live(choice);
	if ($0 === "Underwear") {
		if (truthy((new_undies = (yield* g.op(f, "Prompt", [1], [null, "Changing", "Select your underwear", live(user), rt.gl("underwear_list")]))))) {
			rt.setFv(f, "underwear", live(H), live(new_undies));
		}
	} else if ($0 === "Undershirt") {
		if (truthy((new_undershirt = (yield* g.op(f, "Prompt", [1], [null, "Changing", "Select your undershirt", live(user), rt.gl("undershirt_list")]))))) {
			rt.setFv(f, "undershirt", live(H), live(new_undershirt));
		}
	} else if ($0 === "Socks") {
		if (truthy((new_socks = (yield* g.op(f, "Prompt", [1], [null, "Changing", "Select your socks", live(user), rt.gl("socks_list")]))))) {
			rt.setFv(f, "socks", live(H), live(new_socks));
		}
	}
	yield* g.srcCall(f, "add_fingerprint", live(H));
	yield* g.callName(f, live(H), "update_body", []);
	return f.dot;
}, true);
