// From code/game/machinery/recycler.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10814, "/obj/machinery/recycler", "/obj/machinery", {
	safety_mode: 0,
	icon_name: "grinder-o",
	blood: 0,
	eat_dir: 8,
	amount_produced: 50,
	materials: null,
	crush_damage: 1000,
	eat_victim_items: 1,
	item_recycle_sound: rt.rsc("sound/items/welder.ogg"),
	anchored: 1,
	name: "recycler",
	desc: "A large crushing machine used to recycle small items inefficiently. There are lights on the side.",
	icon: rt.rsc("icons/obj/recycling.dmi"),
	icon_state: "grinder-o0",
	layer: 4.5,
	density: 1,
});

// /obj/machinery/recycler/proc/New  (code/game/machinery/recycler.dm:22)  may sleep
rt.def("/obj/machinery/recycler/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "materials", (yield* g.new_(f, T("/datum/material_container"), [live(f.src), rt.list("$metal", "$glass", "$plasma", "$silver", "$gold", "$diamond", "$uranium", "$bananium", "$titanium")])));
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/recycler"), [null]))), "apply_default_parts", [live(f.src)]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

rt.type(6728, "/obj/item/weapon/circuitboard/machine/recycler", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Recycler (Machine Board)",
	build_path: rt.typePath("/obj/machinery/recycler"),
	origin_tech: "programming=2;engineering=2",
});

// /obj/item/weapon/circuitboard/machine/recycler/proc/<init>  (code/game/machinery/recycler.dm:32)
rt.def("/obj/item/weapon/circuitboard/machine/recycler/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1]));
	return f.dot;
});

// /obj/machinery/recycler/proc/RefreshParts  (code/game/machinery/recycler.dm:39)
rt.def("/obj/machinery/recycler/proc/RefreshParts", function RefreshParts(f: Frame) {
	let amt_made: Value = null, mat_mod: Value = null, B: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [amt_made, mat_mod, B, M, $e];
	amt_made = 0;
	mat_mod = 0;
	B = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/matter_bin"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		mat_mod = multiply(2, rt.fv(f, "rating", live(B)));
	}
	rt.endFor(f, 0);
	(mat_mod = rt.modify(live(mat_mod), 50000, multiply));
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		amt_made = multiply(12.5, rt.fv(f, "rating", live(M)));
	}
	rt.endFor(f, 0);
	rt.setFv(f, "max_amount", rt.sv(f, "materials"), live(mat_mod));
	rt.setSv(f, "amount_produced", add(rt.call(f, P("/proc/min"), null, [50, live(amt_made)]), 50));
	return f.dot;
});

// /obj/machinery/recycler/proc/examine  (code/game/machinery/recycler.dm:48)
rt.def("/obj/machinery/recycler/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		$1 = "off";
	} else {
		$1 = "on";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("The power light is ＀.", [$1])]);
	$0 = live(f.args[0]);
	if (truthy(rt.sv(f, "safety_mode"))) {
		$1 = "on";
	} else {
		$1 = "off";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("The safety-mode light is ＀.", [$1])]);
	$0 = live(f.args[0]);
	if (truthy(rt.sv(f, "emagged"))) {
		$1 = "off";
	} else {
		$1 = "on";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("The safety-sensors status light is ＀.", [$1])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/recycler/proc/power_change  (code/game/machinery/recycler.dm:54)
rt.def("/obj/machinery/recycler/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/recycler/proc/attackby  (code/game/machinery/recycler.dm:59)  may sleep
rt.def("/obj/machinery/recycler/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "grinder-oOpen", "grinder-o0", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_pry_open", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/recycler/proc/emag_act  (code/game/machinery/recycler.dm:76)
rt.def("/obj/machinery/recycler/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	rt.setSv(f, "emagged", 1);
	if (truthy(rt.sv(f, "safety_mode"))) {
		rt.setSv(f, "safety_mode", 0);
		rt.callSrc(f, "update_icon", []);
	}
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), "sparks", 75, 1, -1]);
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You use the cryptographic sequencer on the ＀.</span>", [rt.fv(f, "name", live(f.src))])]);
	return f.dot;
});

// /obj/machinery/recycler/proc/update_icon  (code/game/machinery/recycler.dm:85)
rt.def("/obj/machinery/recycler/proc/update_icon", function update_icon(f: Frame) {
	let is_powered: Value = null;
	let $0: any, $1: any;
	f.vars = () => [is_powered, $0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	is_powered = (!truthy(rt.bitAnd(rt.sv(f, "stat"), 3)) ? 1 : 0);
	if (truthy(rt.sv(f, "safety_mode"))) {
		is_powered = 0;
	}
	$0 = add(rt.sv(f, "icon_name"), fmt("＀", [live(is_powered)]));
	if (truthy(rt.sv(f, "blood"))) {
		$1 = "bld";
	} else {
		$1 = "";
	}
	rt.setSv(f, "icon_state", add($0, fmt("＀", [$1])));
	return f.dot;
});

// /obj/machinery/recycler/proc/Bump  (code/game/machinery/recycler.dm:93)  may sleep
rt.def("/obj/machinery/recycler/proc/Bump", function* Bump(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[0]))) return f.dot;
	yield* g.srcCall(f, "Bumped", live(f.args[0]));
	return f.dot;
}, true, { args: ["AM"] });

// /obj/machinery/recycler/proc/Bumped  (code/game/machinery/recycler.dm:100)  may sleep
rt.def("/obj/machinery/recycler/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	let move_dir: Value = null;
	f.vars = () => [AM, move_dir];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "anchored"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "safety_mode"))) {
		return live(f.dot);
	}
	if (!isEqual((move_dir = rt.getDir(f, rt.sv(f, "loc"), rt.fv(f, "loc", live(AM)))), rt.sv(f, "eat_dir"))) return f.dot;
	yield* g.srcCall(f, "eat", live(AM));
	return f.dot;
}, true);

// /obj/machinery/recycler/proc/eat  (code/game/machinery/recycler.dm:113)  may sleep
rt.def("/obj/machinery/recycler/proc/eat", function* eat(f: Frame, AM0: Value, sound: Value) {
	let to_eat: Value = null, items_recycled: Value = null, i: Value = null, AM: Value = null, as_head: Value = null, as_mmi: Value = null, brain_holder: Value = null;
	let $e: any;
	f.vars = () => [AM0, sound, to_eat, items_recycled, i, AM, as_head, as_mmi, brain_holder, $e];
	if (live(sound) === null) {
		sound = 1;
	}
	to_eat = null;
	if (truthy((rt.istype(live(AM0), T("/obj/item")) ? 1 : 0))) {
		to_eat = (yield* g.callName(f, live(AM0), "GetAllContents", []));
	} else {
		to_eat = rt.list(live(AM0));
	}
	items_recycled = 0;
	i = null;
	rt.forList(f, 0, live(to_eat));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		AM = live(i);
		as_head = live(AM);
		as_mmi = live(AM);
		brain_holder = ((((rt.istype(live(AM), T("/obj/item/organ/brain")) ? 1 : 0) || ((rt.istype(live(as_head), T("/obj/item/bodypart/head")) ? 1 : 0) && rt.fv(f, "brain", live(as_head)))) || ((rt.istype(live(as_mmi), T("/obj/item/device/mmi")) ? 1 : 0) && rt.fv(f, "brain", live(as_mmi)))) || (rt.istype(live(AM), T("/mob/living/brain")) ? 1 : 0));
		if ((truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0)) || truthy(live(brain_holder)))) {
			if (truthy(rt.sv(f, "emagged"))) {
				if (!truthy(live(brain_holder))) {
					yield* g.srcCall(f, "crush_living", live(AM));
				}
			} else {
				yield* g.srcCall(f, "emergency_stop", live(AM));
			}
		} else {
			if (truthy((rt.istype(live(AM), T("/obj/item")) ? 1 : 0))) {
				yield* g.srcCall(f, "recycle_item", live(AM));
				items_recycled = rt.inc(live(items_recycled), 1);
			} else {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/buzz-sigh.ogg"), 50, 0]);
				rt.setFv(f, "loc", live(AM), rt.fv(f, "loc", live(f.src)));
			}
		}
	}
	rt.endFor(f, 0);
	if (!(truthy(live(items_recycled)) && truthy(live(sound)))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.sv(f, "item_recycle_sound"), 50, 1]);
	return f.dot;
}, true);

// /obj/machinery/recycler/proc/recycle_item  (code/game/machinery/recycler.dm:142)  may sleep
rt.def("/obj/machinery/recycler/proc/recycle_item", function* recycle_item(f: Frame, I: Value) {
	let material_amount: Value = null;
	f.vars = () => [I, material_amount];
	rt.setFv(f, "loc", live(I), rt.fv(f, "loc", live(f.src)));
	if (!truthy((material_amount = (yield* g.callName(f, rt.sv(f, "materials"), "get_item_material_amount", [live(I)]))))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "materials"), "insert_item", [null, live(I), "multiplier", divide(rt.sv(f, "amount_produced"), 100)], rt.Args.Named);
	yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
	yield* g.callName(f, rt.sv(f, "materials"), "retrieve_all", []);
	return f.dot;
}, true);

// /obj/machinery/recycler/proc/emergency_stop  (code/game/machinery/recycler.dm:154)  may sleep
rt.def("/obj/machinery/recycler/proc/emergency_stop", function* emergency_stop(f: Frame, L: Value) {
	f.vars = () => [L];
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/buzz-sigh.ogg"), 50, 0]);
	rt.setSv(f, "safety_mode", 1);
	yield* g.srcCall(f, "update_icon");
	rt.setFv(f, "loc", live(L), rt.fv(f, "loc", live(f.src)));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/recycler/proc/reboot")])), 100]);
	return f.dot;
}, true);

// /obj/machinery/recycler/proc/reboot  (code/game/machinery/recycler.dm:161)
rt.def("/obj/machinery/recycler/proc/reboot", function reboot(f: Frame) {
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/ping.ogg"), 50, 0]);
	rt.setSv(f, "safety_mode", 0);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/recycler/proc/crush_living  (code/game/machinery/recycler.dm:167)  may sleep
rt.def("/obj/machinery/recycler/proc/crush_living", function* crush_living(f: Frame, L: Value) {
	let gib: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [L, gib, I, $e];
	rt.setFv(f, "loc", live(L), rt.fv(f, "loc", live(f.src)));
	if (truthy((rt.istype(live(L), T("/mob/living/silicon")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder.ogg"), 50, 1]);
	} else {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/splat.ogg"), 50, 1]);
	}
	gib = 1;
	if (truthy((rt.istype(live(L), T("/mob/living/carbon")) ? 1 : 0))) {
		gib = 0;
		if (isEqual(rt.fv(f, "stat", live(L)), 0)) {
			yield* g.callName(f, live(L), "say", ["ARRRRRRRRRRRGH!!!"]);
		}
		yield* g.srcCall(f, "add_mob_blood", live(L));
	}
	if ((!truthy(rt.sv(f, "blood")) && !truthy((rt.istype(live(L), T("/mob/living/silicon")) ? 1 : 0)))) {
		rt.setSv(f, "blood", 1);
		yield* g.srcCall(f, "update_icon");
	}
	if (truthy(rt.sv(f, "eat_victim_items"))) {
		I = null;
		rt.forList(f, 0, (yield* g.callName(f, live(L), "get_equipped_items", [])), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if (truthy((yield* g.callName(f, live(L), "dropItemToGround", [live(I)])))) {
				yield* g.callSrc(f, "eat", [null, live(I), "sound", 0], rt.Args.Named);
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.callName(f, live(L), "Unconscious", [100]);
	if ((truthy(live(gib)) || isEqual(rt.sv(f, "emagged"), 2))) {
		yield* g.callName(f, live(L), "gib", []);
	} else {
		if (!isEqual(rt.sv(f, "emagged"), 1)) return f.dot;
		yield* g.callName(f, live(L), "adjustBruteLoss", [rt.sv(f, "crush_damage")]);
	}
	return f.dot;
}, true);
