// From code/game/gamemodes/clock_cult/clock_items/replica_fabricator.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8965, "/obj/item/clockwork/replica_fabricator/scarab", "/obj/item/clockwork/replica_fabricator", {
	debug: 0,
	clockwork_desc: "A cogscarab's internal fabricator. It can only be successfully used by a cogscarab and requires power to function.",
	speed_multiplier: 0.5,
	charge_rate: 50,
	name: "scarab fabricator",
	item_state: "nothing",
	w_class: 1,
});

// /obj/item/clockwork/replica_fabricator/scarab/proc/fabricate  (code/game/gamemodes/clock_cult/clock_items/replica_fabricator.dm:32)  may sleep
rt.def("/obj/item/clockwork/replica_fabricator/scarab/proc/fabricate", function* fabricate(f: Frame) {
	if ((!truthy(rt.sv(f, "debug")) && !truthy((rt.istype(live(f.args[1]), T("/mob/living/simple_animal/drone")) ? 1 : 0)))) {
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["target", "user"] });

rt.type(8967, "/obj/item/clockwork/replica_fabricator/cyborg", "/obj/item/clockwork/replica_fabricator", {
	clockwork_desc: "A cyborg's internal fabricator. It is capable of using the cyborg's power in addition to stored power.",
	name: "cyborg fabricator",
});

// /obj/item/clockwork/replica_fabricator/cyborg/proc/get_power  (code/game/gamemodes/clock_cult/clock_items/replica_fabricator.dm:46)
rt.def("/obj/item/clockwork/replica_fabricator/cyborg/proc/get_power", function get_power(f: Frame) {
	let R: Value = null, borg_power: Value = null, current_charge: Value = null;
	f.vars = () => [R, borg_power, current_charge];
	R = rt.call(f, P("/proc/get_atom_on_turf"), null, [live(f.src), T("/mob/living")]);
	borg_power = 0;
	current_charge = 0;
	if ((truthy((rt.istype(live(R), T("/mob/living/silicon/robot")) ? 1 : 0)) && truthy(rt.fv(f, "cell", live(R))))) {
		current_charge = rt.gv(f, "charge", rt.fv(f, "cell", live(R)));
		while (rt.gt(live(current_charge), 25)) {
			(current_charge = rt.modify(live(current_charge), 25, subtract));
			borg_power = rt.modify(live(borg_power), 25, add);
		}
	}
	return add(rt.callSuper(f, [], rt.Args.Same), live(borg_power));
});

// /obj/item/clockwork/replica_fabricator/cyborg/proc/get_max_power  (code/game/gamemodes/clock_cult/clock_items/replica_fabricator.dm:57)
rt.def("/obj/item/clockwork/replica_fabricator/cyborg/proc/get_max_power", function get_max_power(f: Frame) {
	let R: Value = null, cell_maxcharge: Value = null;
	f.vars = () => [R, cell_maxcharge];
	R = rt.call(f, P("/proc/get_atom_on_turf"), null, [live(f.src), T("/mob/living")]);
	cell_maxcharge = 0;
	if ((truthy((rt.istype(live(R), T("/mob/living/silicon/robot")) ? 1 : 0)) && truthy(rt.fv(f, "cell", live(R))))) {
		cell_maxcharge = rt.gv(f, "maxcharge", rt.fv(f, "cell", live(R)));
	}
	return add(rt.callSuper(f, [], rt.Args.Same), live(cell_maxcharge));
});

// /obj/item/clockwork/replica_fabricator/cyborg/proc/can_use_power  (code/game/gamemodes/clock_cult/clock_items/replica_fabricator.dm:64)
rt.def("/obj/item/clockwork/replica_fabricator/cyborg/proc/can_use_power", function can_use_power(f: Frame) {
	let R: Value = null, current_charge: Value = null;
	f.vars = () => [R, current_charge];
	if (!isEqual(live(f.args[0]), "ratvar?")) {
		R = rt.call(f, P("/proc/get_atom_on_turf"), null, [live(f.src), T("/mob/living")]);
		current_charge = 0;
		if ((truthy((rt.istype(live(R), T("/mob/living/silicon/robot")) ? 1 : 0)) && truthy(rt.fv(f, "cell", live(R))))) {
			current_charge = rt.gv(f, "charge", rt.fv(f, "cell", live(R)));
			while (rt.gt(live(f.args[0]), 0) && rt.lt(subtract(rt.sv(f, "stored_power"), live(f.args[0])), 0)) {
				(current_charge = rt.modify(live(current_charge), 25, subtract));
				(f.args[0] = rt.modify(live(f.args[0]), 25, subtract));
			}
		}
		if (rt.lt(live(current_charge), 0)) {
			return 0;
		}
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["amount"] });

// /obj/item/clockwork/replica_fabricator/cyborg/proc/modify_stored_power  (code/game/gamemodes/clock_cult/clock_items/replica_fabricator.dm:77)  may sleep
rt.def("/obj/item/clockwork/replica_fabricator/cyborg/proc/modify_stored_power", function* modify_stored_power(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (((truthy((rt.istype((R = (yield* g.call(f, P("/proc/get_atom_on_turf"), null, [live(f.src), T("/mob/living")]))), T("/mob/living/silicon/robot")) ? 1 : 0)) && truthy(rt.fv(f, "cell", live(R)))) && truthy(live(f.args[0])))) {
		if (rt.lt(live(f.args[0]), 0)) {
			while (rt.lt(live(f.args[0]), 0) && rt.lt(add(rt.sv(f, "stored_power"), live(f.args[0])), 0)) {
				yield* g.callName(f, rt.fv(f, "cell", live(R)), "use", [25]);
				f.args[0] = rt.modify(live(f.args[0]), 25, add);
			}
		} else {
			while (rt.gt(live(f.args[0]), 0) && rt.lt(add(rt.gv(f, "charge", rt.fv(f, "cell", live(R))), 25), rt.gv(f, "maxcharge", rt.fv(f, "cell", live(R))))) {
				yield* g.callName(f, rt.fv(f, "cell", live(R)), "give", [25]);
				(f.args[0] = rt.modify(live(f.args[0]), 25, subtract));
			}
		}
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["amount"] });

rt.type(8963, "/obj/item/clockwork/replica_fabricator", "/obj/item/clockwork", {
	stored_power: 0,
	max_power: 25000,
	uses_power: 1,
	repairing: null,
	recharging: null,
	speed_multiplier: 1,
	charge_rate: 25,
	charge_delay: 2,
	clockwork_desc: "A device that allows the replacing of mundane objects with Ratvarian variants. It requires power to function.",
	flags: 4,
	name: "replica fabricator",
	desc: "An odd, L-shaped device that hums with energy.",
	icon_state: "replica_fabricator",
	w_class: 3,
	force: 5,
});

// /obj/item/clockwork/replica_fabricator/proc/Initialize  (code/game/gamemodes/clock_cult/clock_items/replica_fabricator.dm:90)  may sleep
rt.def("/obj/item/clockwork/replica_fabricator/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/clockwork/replica_fabricator/proc/Destroy  (code/game/gamemodes/clock_cult/clock_items/replica_fabricator.dm:94)  may sleep
rt.def("/obj/item/clockwork/replica_fabricator/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/clockwork/replica_fabricator/proc/process  (code/game/gamemodes/clock_cult/clock_items/replica_fabricator.dm:98)  may sleep
rt.def("/obj/item/clockwork/replica_fabricator/proc/process", function* process(f: Frame) {
	let L: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [L, S, $e];
	if (!truthy(rt.sv(f, "charge_rate"))) {
		return live(f.dot);
	}
	if ((truthy((rt.istype((L = (yield* g.call(f, P("/proc/get_atom_on_turf"), null, [live(f.src), T("/mob/living")]))), T("/mob/living")) ? 1 : 0)) && truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)]))))) {
		if (truthy(rt.sv(f, "charge_delay"))) {
			rt.incSrcVar(f, "charge_delay", -1, true);
			return live(f.dot);
		}
		yield* g.srcCall(f, "modify_stored_power", rt.sv(f, "charge_rate"));
		S = null;
		rt.forList(f, 0, (yield* g.callName(f, live(L), "GetAllContents", [])), T("/obj/item/clockwork/replica_fabricator"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			if (isEqual(live(S), live(f.src))) {
				continue;
			}
			rt.setFv(f, "charge_delay", live(S), 2);
		}
		rt.endFor(f, 0);
	} else {
		rt.setSv(f, "charge_delay", 2);
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/item/clockwork/replica_fabricator/proc/ratvar_act  (code/game/gamemodes/clock_cult/clock_items/replica_fabricator.dm:116)
rt.def("/obj/item/clockwork/replica_fabricator/proc/ratvar_act", function ratvar_act(f: Frame) {
	if (truthy(rt.gl("ratvar_awakens"))) {
		rt.setSv(f, "uses_power", 0);
		rt.setSv(f, "speed_multiplier", multiply(rt.initial(f, live(f.src), "speed_multiplier"), 0.25));
	} else {
		rt.setSv(f, "uses_power", rt.initial(f, live(f.src), "uses_power"));
		rt.setSv(f, "speed_multiplier", rt.initial(f, live(f.src), "speed_multiplier"));
	}
	return f.dot;
});

// /obj/item/clockwork/replica_fabricator/proc/examine  (code/game/gamemodes/clock_cult/clock_items/replica_fabricator.dm:122)
rt.def("/obj/item/clockwork/replica_fabricator/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [$0, $1, $2, $3];
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='brass'>Can be used to replace walls, floors, tables, windows, windoors, and airlocks with Clockwork variants.</span>"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='brass'>Can construct Clockwork Walls on Clockwork Floors and deconstruct Clockwork Walls to Clockwork Floors.</span>"]);
	if (!truthy(rt.sv(f, "uses_power"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='alloy'>It can consume floor tiles, rods, metal, and plasteel for power at rates of <b>2:＀W</b>, <b>1:＀W</b>, <b>1:＀W</b>, and <b>1:＀W</b>, respectively.</span>", [25, 25, 50, 125])]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='alloy'>It can also consume brass sheets for power at a rate of <b>1:＀W</b>.</span>", [250])]);
	$0 = live(f.args[0]);
	$1 = rt.callSrc(f, "get_power", []);
	$2 = rt.callSrc(f, "get_max_power", []);
	if (truthy(rt.sv(f, "charge_rate"))) {
		$3 = fmt(", and is gaining <b>＀W</b> of power per second", [multiply(rt.sv(f, "charge_rate"), 0.5)]);
	} else {
		$3 = "";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='alloy'>It is storing <b>＀W/＀W</b> of power＀.</span>", [$1, $2, $3])]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='alloy'>Use it in-hand to produce <b>5</b> brass sheets at a cost of <b>＀W</b> power.</span>", [1250])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/clockwork/replica_fabricator/proc/attack_self  (code/game/gamemodes/clock_cult/clock_items/replica_fabricator.dm:134)  may sleep
rt.def("/obj/item/clockwork/replica_fabricator/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [user, $0, $1];
	if (!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(user)])))) return f.dot;
	if (truthy(rt.sv(f, "uses_power"))) {
		if (!truthy((yield* g.srcCall(f, "can_use_power", 1250)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ requires <b>＀W</b> of power to produce brass sheets!</span>", [live(f.src), 1250])]);
			return live(f.dot);
		}
		yield* g.srcCall(f, "modify_stored_power", -1250);
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
	yield* g.new_(f, T("/obj/item/stack/tile/brass"), [rt.fv(f, "loc", live(user)), 5]);
	$0 = live(user);
	if (truthy(rt.sv(f, "stored_power"))) {
		$1 = "some";
	} else {
		$1 = "all";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='brass'>You use ＀ of ＀'s power to produce <b>5</b> brass sheets. It now stores <b>＀W/＀W</b> of power.</span>", [$1, live(f.src), (yield* g.srcCall(f, "get_power")), (yield* g.srcCall(f, "get_max_power"))])]);
	return f.dot;
}, true);

// /obj/item/clockwork/replica_fabricator/proc/pre_attackby  (code/game/gamemodes/clock_cult/clock_items/replica_fabricator.dm:145)  may sleep
rt.def("/obj/item/clockwork/replica_fabricator/proc/pre_attackby", function* pre_attackby(f: Frame, target: Value, user: Value, params: Value) {
	f.vars = () => [target, user, params];
	if ((((!truthy(live(target)) || !truthy(live(user))) || !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(user)])))) || truthy((rt.istype(live(target), T("/obj/item/weapon/storage")) ? 1 : 0)))) {
		return 1;
	}
	return (yield* g.srcCall(f, "fabricate", live(target), live(user)));
}, true);

// /obj/item/clockwork/replica_fabricator/proc/modify_stored_power  (code/game/gamemodes/clock_cult/clock_items/replica_fabricator.dm:156)
rt.def("/obj/item/clockwork/replica_fabricator/proc/modify_stored_power", function modify_stored_power(f: Frame, amount: Value) {
	rt.setSv(f, "stored_power", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "stored_power"), live(amount)), rt.sv(f, "max_power")])]));
	return 1;
});

// /obj/item/clockwork/replica_fabricator/proc/can_use_power  (code/game/gamemodes/clock_cult/clock_items/replica_fabricator.dm:160)
rt.def("/obj/item/clockwork/replica_fabricator/proc/can_use_power", function can_use_power(f: Frame, amount: Value) {
	if (isEqual(live(amount), "ratvar?")) {
		if ((truthy(rt.gl("ratvar_awakens")) || !truthy(rt.sv(f, "uses_power")))) {
			return 1;
		} else {
			return 0;
		}
	}
	if (rt.lt(subtract(rt.sv(f, "stored_power"), live(amount)), 0)) {
		return 0;
	}
	if (rt.gt(subtract(rt.sv(f, "stored_power"), live(amount)), rt.sv(f, "max_power"))) {
		return 0;
	}
	return 1;
});

// /obj/item/clockwork/replica_fabricator/proc/fabricate  (code/game/gamemodes/clock_cult/clock_items/replica_fabricator.dm:173)  may sleep
rt.def("/obj/item/clockwork/replica_fabricator/proc/fabricate", function* fabricate(f: Frame, target: Value, user: Value, silent: Value, no_table_check: Value) {
	let fabrication_values: Value = null, Y: Value = null, target_type: Value = null, A: Value = null, new_thing_type: Value = null, _T: Value = null, A_4: Value = null;
	f.vars = () => [target, user, silent, no_table_check, fabrication_values, Y, target_type, A, new_thing_type, _T, A_4];
	if ((!truthy(live(target)) || !truthy(live(user)))) {
		return 0;
	}
	if (truthy(rt.sv(f, "repairing"))) {
		if (!truthy(live(silent))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You are currently repairing ＀ with ＀!</span>", [rt.sv(f, "repairing"), live(f.src)])]);
		}
		return 0;
	}
	if (truthy(rt.sv(f, "recharging"))) {
		if (!truthy(live(silent))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You are currently recharging ＀ from the ＀!</span>", [live(f.src), rt.fv(f, "sigil_name", rt.sv(f, "recharging"))])]);
		}
		return 0;
	}
	if (!truthy((rt.istype((fabrication_values = (yield* g.callName(f, live(target), "fabrication_vals", [live(user), live(f.src), live(silent)]))), T("/list")) ? 1 : 0))) {
		if (!isEqual(live(fabrication_values), 1)) {
			if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [live(target)])))) {
				return (yield* g.srcCall(f, "fabricate", rt.getStep(f, live(target), 0), live(user), live(no_table_check)));
			}
			if (!truthy(live(silent))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ cannot be fabricated!</span>", [live(target)])]);
			}
			if (!truthy(live(no_table_check))) {
				return 1;
			}
		}
		return 0;
	}
	if (truthy((yield* g.srcCall(f, "can_use_power", "ratvar?")))) {
		rt.setAt(live(fabrication_values), "power_cost", 0);
	}
	if ((!truthy((Y = rt.getStep(f, live(user), 0))) || (((!isEqual(rt.fv(f, "z", live(Y)), 2) && !isEqual(rt.fv(f, "z", live(Y)), 1)) && !isEqual(rt.fv(f, "z", live(Y)), 5)) && !isEqual(rt.fv(f, "z", live(Y)), 5)))) {
		(rt.modAt(live(fabrication_values), "operation_time", 2, multiply));
		if (rt.gt(rt.at(live(fabrication_values), "power_cost"), 0)) {
			(rt.modAt(live(fabrication_values), "power_cost", 2, multiply));
		}
	}
	target_type = rt.fv(f, "type", live(target));
	if (!truthy((yield* g.srcCall(f, "fabricate_checks", live(fabrication_values), live(target), live(target_type), live(user), live(silent))))) {
		return 0;
	}
	(rt.modAt(live(fabrication_values), "operation_time", rt.sv(f, "speed_multiplier"), multiply));
	yield* g.call(f, P("/proc/playsound"), null, [live(target), rt.rsc("sound/machines/click.ogg"), 50, 1]);
	if (truthy(rt.at(live(fabrication_values), "operation_time"))) {
		if (!truthy(live(silent))) {
			if (truthy((A = rt.at(live(fabrication_values), "new_obj_type")))) {
				yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀'s ＀ starts ripping ＀ apart!</span>", [live(user), rt.sv(f, "name"), live(target)]), fmt("<span class='brass'>You start fabricating ＇！ from ＀...</span>", [rt.initial(f, live(A), "name"), live(target)])]);
			} else {
				yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀'s ＀ starts consuming ＀!</span>", [live(user), rt.sv(f, "name"), live(target)]), fmt("<span class='brass'>Your ＀ starts consuming ＀...</span>", [rt.sv(f, "name"), live(target)])]);
			}
		}
		if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, rt.at(live(fabrication_values), "operation_time"), "target", live(target), "extra_checks", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clockwork/replica_fabricator/proc/fabricate_checks"), live(fabrication_values), live(target), live(target_type), live(user), 1]))], rt.Args.Named)))) {
			return 0;
		}
		if (!truthy(live(silent))) {
			if (truthy((A = rt.at(live(fabrication_values), "new_obj_type")))) {
				yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀'s ＀ replaces ＀ with ＇！!</span>", [live(user), rt.sv(f, "name"), live(target), rt.initial(f, live(A), "name")]), fmt("<span class='brass'>You fabricate ＇！ from ＀.</span>", [rt.initial(f, live(A), "name"), live(target)])]);
			} else {
				yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀'s ＀ consumes ＀!</span>", [live(user), rt.sv(f, "name"), live(target)]), fmt("<span class='brass'>Your ＀ consumes ＀.</span>", [rt.sv(f, "name"), live(target)])]);
			}
		}
	} else {
		if (!truthy(live(silent))) {
			if (truthy((A = rt.at(live(fabrication_values), "new_obj_type")))) {
				yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀'s ＀ rips apart ＀, replacing it with ＇！!</span>", [live(user), rt.sv(f, "name"), live(target), rt.initial(f, live(A), "name")]), fmt("<span class='brass'>You fabricate ＇！ from ＀.</span>", [rt.initial(f, live(A), "name"), live(target)])]);
			} else {
				yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀'s ＀ rapidly consumes ＀!</span>", [live(user), rt.sv(f, "name"), live(target)]), fmt("<span class='brass'>Your ＀ consumes ＀.</span>", [rt.sv(f, "name"), live(target)])]);
			}
		}
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(target), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
	new_thing_type = rt.at(live(fabrication_values), "new_obj_type");
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [live(target)])))) {
		yield* g.callName(f, (_T = live(target)), "ChangeTurf", [live(new_thing_type)]);
	} else {
		if (truthy(live(new_thing_type))) {
			if (truthy(rt.at(live(fabrication_values), "dir_in_new"))) {
				yield* g.new_(f, live(new_thing_type), [rt.getStep(f, live(target), 0), rt.at(live(fabrication_values), "spawn_dir")]);
			} else {
				yield* g.callName(f, (A_4 = (yield* g.new_(f, live(new_thing_type), [rt.getStep(f, live(target), 0)]))), "setDir", [rt.at(live(fabrication_values), "spawn_dir")]);
			}
		}
		if (!truthy(rt.at(live(fabrication_values), "no_target_deletion"))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(target)]);
		}
	}
	yield* g.srcCall(f, "modify_stored_power", rt.neg(rt.at(live(fabrication_values), "power_cost")));
	if (truthy(live(no_table_check))) {
		return 1;
	}
	return 0;
}, true, { argTypes: [{ path: "/atom" }, { type: 8, path: "/mob/living" }, {  }, {  }] });

// /obj/item/clockwork/replica_fabricator/proc/fabricate_checks  (code/game/gamemodes/clock_cult/clock_items/replica_fabricator.dm:264)
rt.def("/obj/item/clockwork/replica_fabricator/proc/fabricate_checks", function fabricate_checks(f: Frame, fabrication_values: Value, target: Value, expected_type: Value, user: Value, silent: Value) {
	let A: Value = null;
	f.vars = () => [A];
	if (((!truthy((rt.istype(live(fabrication_values), T("/list")) ? 1 : 0)) || (!truthy(live(target)) || truthy(rt.fv(f, "gc_destroyed", live(target))))) || (!truthy(live(user)) || truthy(rt.fv(f, "gc_destroyed", live(user)))))) {
		return 0;
	}
	if ((truthy(rt.sv(f, "repairing")) || truthy(rt.sv(f, "recharging")))) {
		return 0;
	}
	if (!isEqual(rt.fv(f, "type", live(target)), live(expected_type))) {
		return 0;
	}
	if (truthy(rt.callSrc(f, "can_use_power", ["ratvar?"]))) {
		rt.setAt(live(fabrication_values), "power_cost", 0);
	}
	if (!truthy(rt.callSrc(f, "can_use_power", [rt.at(live(fabrication_values), "power_cost")]))) {
		if (rt.lt(subtract(rt.sv(f, "stored_power"), rt.at(live(fabrication_values), "power_cost")), 0)) {
			if (!truthy(live(silent))) {
				if (truthy((A = rt.at(live(fabrication_values), "new_obj_type")))) {
					rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You need <b>＀W</b> power to fabricate ＇！ from ＀!</span>", [rt.at(live(fabrication_values), "power_cost"), rt.initial(f, live(A), "name"), live(target)])]);
				}
			}
		} else {
			if (rt.gt(subtract(rt.sv(f, "stored_power"), rt.at(live(fabrication_values), "power_cost")), rt.sv(f, "max_power"))) {
				if (!truthy(live(silent))) {
					if (truthy((A = rt.at(live(fabrication_values), "new_obj_type")))) {
						rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>Your ＀ contains too much power to fabricate ＇！ from ＀!</span>", [rt.sv(f, "name"), rt.initial(f, live(A), "name"), live(target)])]);
					} else {
						rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>Your ＀ contains too much power to consume ＀!</span>", [rt.sv(f, "name"), live(target)])]);
					}
				}
			}
		}
		return 0;
	}
	return 1;
}, false, { argTypes: [{ path: "/list" }, { path: "/atom" }, {  }, { type: 8, path: "/mob" }, {  }] });

// /obj/item/clockwork/replica_fabricator/proc/fabricator_repair_checks  (code/game/gamemodes/clock_cult/clock_items/replica_fabricator.dm:290)
rt.def("/obj/item/clockwork/replica_fabricator/proc/fabricator_repair_checks", function fabricator_repair_checks(f: Frame, repair_values: Value, target: Value, user: Value, silent: Value) {
	let L: Value = null, C: Value = null, O: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any;
	f.vars = () => [L, C, O, $0, $1, $2, $3, $4];
	if (((!truthy((rt.istype(live(repair_values), T("/list")) ? 1 : 0)) || (!truthy(live(target)) || truthy(rt.fv(f, "gc_destroyed", live(target))))) || (!truthy(live(user)) || truthy(rt.fv(f, "gc_destroyed", live(user)))))) {
		return 0;
	}
	if (truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0))) {
		if (!truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [(L = live(target))]))) {
			if (!truthy(live(silent))) {
				rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ does not serve Ratvar!</span>", [live(L)])]);
			}
			return 0;
		}
		if ((rt.ge(rt.fv(f, "health", live(L)), rt.fv(f, "maxHealth", live(L))) || truthy(rt.bitAnd(rt.fv(f, "flags", live(L)), 4096)))) {
			if (!truthy(live(silent))) {
				$0 = live(user);
				if (isEqual(live(L), live(user))) {
					$1 = "You are";
				} else {
					$1 = fmt("＀ is", [live(L)]);
				}
				rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='warning'>＀ at maximum health!</span>", [$1])]);
			}
			return 0;
		}
		rt.setAt(live(repair_values), "amount_to_heal", subtract(rt.fv(f, "maxHealth", live(L)), rt.fv(f, "health", live(L))));
	} else {
		if (truthy((rt.istype(live(target), T("/obj")) ? 1 : 0))) {
			if (truthy((rt.istype(live(target), T("/obj/structure/destructible/clockwork")) ? 1 : 0))) {
				if (!truthy(rt.gv(f, "can_be_repaired", (C = live(target))))) {
					if (!truthy(live(silent))) {
						rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ cannot be repaired!</span>", [live(C)])]);
					}
					return 0;
				}
			}
			if (rt.ge(rt.gv(f, "obj_integrity", (O = live(target))), rt.fv(f, "max_integrity", live(O)))) {
				if (!truthy(live(silent))) {
					rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is at maximum integrity!</span>", [live(O)])]);
				}
				return 0;
			}
			rt.setAt(live(repair_values), "amount_to_heal", subtract(rt.fv(f, "max_integrity", live(O)), rt.fv(f, "obj_integrity", live(O))));
		} else {
			return 0;
		}
	}
	if (rt.le(rt.at(live(repair_values), "amount_to_heal"), 0)) {
		return 0;
	}
	rt.setAt(live(repair_values), "healing_for_cycle", rt.call(f, P("/proc/min"), null, [rt.at(live(repair_values), "amount_to_heal"), 4]));
	rt.setAt(live(repair_values), "power_required", rt.call(f, P("/proc/round"), null, [multiply(rt.at(live(repair_values), "healing_for_cycle"), 25), 25]));
	if ((!truthy(rt.callSrc(f, "can_use_power", ["ratvar?"])) && !truthy(rt.callSrc(f, "can_use_power", [rt.at(live(repair_values), "power_required")])))) {
		if (!truthy(live(silent))) {
			$0 = live(user);
			$1 = rt.at(live(repair_values), "power_required");
			if (isEqual(live(target), live(user))) {
				$2 = "g yourself";
			} else {
				$2 = fmt("g ＀", [live(target)]);
			}
			$3 = rt.call(f, P("/proc/round"), null, [multiply(rt.at(live(repair_values), "amount_to_heal"), 25), 25]);
			if (isEqual(live(target), live(user))) {
				$4 = "yourself";
			} else {
				$4 = fmt("＀", [rt.callName(f, live(target), "p_them", [])]);
			}
			rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='warning'>You need at least <b>＀W</b> power to start repairin＀, and at least <b>＀W</b> to fully repair ＀!</span>", [$1, $2, $3, $4])]);
		}
		return 0;
	}
	return 1;
}, false, { argTypes: [{ path: "/list" }, { path: "/atom" }, { type: 8, path: "/mob" }, {  }] });

// /obj/item/clockwork/replica_fabricator/proc/sigil_charge_checks  (code/game/gamemodes/clock_cult/clock_items/replica_fabricator.dm:331)
rt.def("/obj/item/clockwork/replica_fabricator/proc/sigil_charge_checks", function sigil_charge_checks(f: Frame, charge_values: Value, sigil: Value, user: Value, silent: Value) {
	if (((!truthy((rt.istype(live(charge_values), T("/list")) ? 1 : 0)) || (!truthy(live(sigil)) || truthy(rt.fv(f, "gc_destroyed", live(sigil))))) || (!truthy(live(user)) || truthy(rt.fv(f, "gc_destroyed", live(user)))))) {
		return 0;
	}
	if (truthy(rt.callSrc(f, "can_use_power", ["ratvar?"]))) {
		return 0;
	}
	rt.setAt(live(charge_values), "power_gain", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [rt.fv(f, "power_charge", live(sigil)), 1000])]));
	if (!truthy(rt.at(live(charge_values), "power_gain"))) {
		if (!truthy(live(silent))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀ contains no power!</span>", [rt.fv(f, "sigil_name", live(sigil))])]);
		}
		return 0;
	}
	if (rt.gt(add(rt.sv(f, "stored_power"), rt.at(live(charge_values), "power_gain")), rt.sv(f, "max_power"))) {
		if (!truthy(live(silent))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>Your ＀ contains too much power to charge from the ＀!</span>", [rt.sv(f, "name"), rt.fv(f, "sigil_name", live(sigil))])]);
		}
		return 0;
	}
	return 1;
}, false, { argTypes: [{ path: "/list" }, { type: 4, path: "/obj/effect/clockwork/sigil/transmission" }, { type: 8, path: "/mob" }, {  }] });
