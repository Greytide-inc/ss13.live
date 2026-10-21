// From code/game/objects/items/weapons/tanks/tanks.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7446, "/obj/item/weapon/tank", "/obj/item/weapon", {
	air_contents: null,
	distribute_pressure: 101.325,
	integrity: 3,
	volume: 70,
	flags: 64,
	pressure_resistance: 506.625,
	throw_speed: 1,
	throw_range: 4,
	name: "tank",
	icon: rt.rsc("icons/obj/tank.dmi"),
	slot_flags: 1024,
	hitsound: rt.rsc("sound/weapons/smash.ogg"),
	force: 5,
	throwforce: 10,
	actions_types: null,
	armor: null,
});

// /obj/item/weapon/tank/proc/<init>  (code/game/objects/items/weapons/tanks/tanks.dm:12)
rt.def("/obj/item/weapon/tank/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/set_internals")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 10, "bio", 0, "rad", 0, "fire", 80, "acid", 30]));
	return f.dot;
});

// /obj/item/weapon/tank/proc/ui_action_click  (code/game/objects/items/weapons/tanks/tanks.dm:20)  may sleep
rt.def("/obj/item/weapon/tank/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "toggle_internals", live(user));
	return f.dot;
}, true);

// /obj/item/weapon/tank/proc/toggle_internals  (code/game/objects/items/weapons/tanks/tanks.dm:23)  may sleep
rt.def("/obj/item/weapon/tank/proc/toggle_internals", function* toggle_internals(f: Frame, user: Value) {
	let H: Value = null;
	f.vars = () => [user, H];
	if (!truthy((rt.istype((H = live(user)), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "internal", live(H)), live(f.src))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='notice'>You close ＀ valve.</span>", [live(f.src)])]);
		rt.setFv(f, "internal", live(H), null);
		yield* g.callName(f, live(H), "update_internals_hud_icon", [0]);
	} else {
		if (!truthy((yield* g.callName(f, live(H), "getorganslot", ["breathing_tube"])))) {
			if (!truthy(rt.fv(f, "wear_mask", live(H)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='warning'>You need a mask!</span>"]);
				return live(f.dot);
			}
			if (truthy(rt.gv(f, "mask_adjusted", rt.fv(f, "wear_mask", live(H))))) {
				yield* g.callName(f, rt.fv(f, "wear_mask", live(H)), "adjustmask", [live(H)]);
			}
			if (!truthy(rt.bitAnd(rt.gv(f, "flags", rt.fv(f, "wear_mask", live(H))), 8))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='warning'>＀ can't use ＀!</span>", [rt.fv(f, "wear_mask", live(H)), live(f.src)])]);
				return live(f.dot);
			}
		}
		if (truthy(rt.fv(f, "internal", live(H)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='notice'>You switch your internals to ＀.</span>", [live(f.src)])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='notice'>You open ＀ valve.</span>", [live(f.src)])]);
		}
		rt.setFv(f, "internal", live(H), live(f.src));
		yield* g.callName(f, live(H), "update_internals_hud_icon", [1]);
	}
	yield* g.callName(f, live(H), "update_action_buttons_icon", []);
	return f.dot;
}, true);

// /obj/item/weapon/tank/proc/New  (code/game/objects/items/weapons/tanks/tanks.dm:52)  may sleep
rt.def("/obj/item/weapon/tank/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "air_contents", (yield* g.new_(f, T("/datum/gas_mixture"), [rt.sv(f, "volume")])));
	rt.setFv(f, "temperature", rt.sv(f, "air_contents"), 293.1499938964844);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/weapon/tank/proc/Destroy  (code/game/objects/items/weapons/tanks/tanks.dm:61)  may sleep
rt.def("/obj/item/weapon/tank/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "air_contents"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "air_contents")]);
	}
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/weapon/tank/proc/examine  (code/game/objects/items/weapons/tanks/tanks.dm:67)
rt.def("/obj/item/weapon/tank/proc/examine", function examine(f: Frame) {
	let icon: Value = null, celsius_temperature: Value = null, descriptive: Value = null;
	f.vars = () => [icon, celsius_temperature, descriptive];
	icon = live(f.src);
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(rt.fv(f, "loc", live(f.src)), T("/obj/item/assembly")) ? 1 : 0))) {
		icon = rt.fv(f, "loc", live(f.src));
	}
	if (!rt.le(rt.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[0])]), 1)) {
		if (isEqual(live(icon), live(f.src))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>If you want any more information you'll need to get closer.</span>"]);
		}
		return live(f.dot);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>The pressure gauge reads ＀ kPa.</span>", [rt.callName(f, rt.fv(f, "air_contents", live(f.src)), "return_pressure", [])])]);
	celsius_temperature = subtract(rt.gv(f, "temperature", rt.fv(f, "air_contents", live(f.src))), 273.1499938964844);
	descriptive = null;
	if (rt.lt(live(celsius_temperature), 20)) {
		descriptive = "cold";
	} else {
		if (rt.lt(live(celsius_temperature), 40)) {
			descriptive = "room temperature";
		} else {
			if (rt.lt(live(celsius_temperature), 80)) {
				descriptive = "lukewarm";
			} else {
				if (rt.lt(live(celsius_temperature), 100)) {
					descriptive = "warm";
				} else {
					if (rt.lt(live(celsius_temperature), 300)) {
						descriptive = "hot";
					} else {
						descriptive = "furiously hot";
					}
				}
			}
		}
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>It feels ＀.</span>", [live(descriptive)])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/tank/proc/blob_act  (code/game/objects/items/weapons/tanks/tanks.dm:96)  may sleep
rt.def("/obj/item/weapon/tank/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	let location: Value = null;
	f.vars = () => [B, location];
	if (!(truthy(live(B)) && isEqual(rt.fv(f, "loc", live(B)), rt.sv(f, "loc")))) return f.dot;
	if (!truthy((location = rt.getStep(f, live(f.src), 0)))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	if (truthy(rt.sv(f, "air_contents"))) {
		yield* g.callName(f, live(location), "assume_air", [rt.sv(f, "air_contents")]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/tank/proc/deconstruct  (code/game/objects/items/weapons/tanks/tanks.dm:107)  may sleep
rt.def("/obj/item/weapon/tank/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let _T: Value = null;
	f.vars = () => [disassembled, _T];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(live(disassembled))) {
		if (truthy((_T = rt.getStep(f, live(f.src), 0)))) {
			yield* g.callName(f, live(_T), "assume_air", [rt.sv(f, "air_contents")]);
			yield* g.srcCall(f, "air_update_turf");
		}
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/spray.ogg"), 10, 1, -3]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/tank/proc/suicide_act  (code/game/objects/items/weapons/tanks/tanks.dm:116)  may sleep
rt.def("/obj/item/weapon/tank/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let H: Value = null, W: Value = null;
	let $e: any;
	f.vars = () => [user, H, W, $e];
	H = live(user);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is putting ＀'s valve to ＀ lips! It looks like ＀ trying to commit suicide!</span>", [live(user), live(f.src), (yield* g.callName(f, live(user), "p_their", [])), (yield* g.callName(f, live(user), "p_theyre", []))])]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/spray.ogg"), 10, 1, -3]);
	if (((!(!truthy(live(H)) || truthy(rt.fv(f, "gc_destroyed", live(H)))) && truthy(rt.sv(f, "air_contents"))) && rt.ge((yield* g.callName(f, rt.sv(f, "air_contents"), "return_pressure", [])), 1000))) {
		W = null;
		rt.forList(f, 0, live(H), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			W = $e;
			yield* g.callName(f, live(H), "dropItemToGround", [live(W)]);
			if (truthy(rt.op(f, "Prob", [], [50]))) {
				yield* g.call(f, P("/proc/step"), null, [live(W), rt.op(f, "PickUnweighted", [1], [rt.gl("alldirs")])]);
			}
		}
		rt.endFor(f, 0);
		(rt.modField(f, live(H), "status_flags", 16384, rt.bitOr));
		rt.setFv(f, "bleed_rate", live(H), 5);
		yield* g.callName(f, live(H), "gib_animation", []);
		yield* g.call(f, P("/proc/sleep"), null, [3]);
		yield* g.callName(f, live(H), "adjustBruteLoss", [1000]);
		yield* g.callName(f, live(H), "spawn_gibs", []);
		yield* g.callName(f, live(H), "spill_organs", []);
		yield* g.callName(f, live(H), "spread_bodyparts", []);
	}
	return 1;
}, true);

// /obj/item/weapon/tank/proc/attackby  (code/game/objects/items/weapons/tanks/tanks.dm:136)  may sleep
rt.def("/obj/item/weapon/tank/proc/attackby", function* attackby(f: Frame) {
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/device/analyzer")) ? 1 : 0)) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.args[1]), live(f.src)])), 1))) {
		yield* g.srcCall(f, "atmosanalyzer_scan", rt.sv(f, "air_contents"), live(f.args[1]));
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/assembly_holder")) ? 1 : 0))) {
			yield* g.srcCall(f, "bomb_assemble", live(f.args[0]), live(f.args[1]));
		} else {
			f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/tank/proc/ui_interact  (code/game/objects/items/weapons/tanks/tanks.dm:147)  may sleep
rt.def("/obj/item/weapon/tank/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("hands_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "tanks", rt.sv(f, "name"), 420, 200, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/item/weapon/tank/proc/ui_data  (code/game/objects/items/weapons/tanks/tanks.dm:153)
rt.def("/obj/item/weapon/tank/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, C: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [data, C, $0, $1, $2];
	$0 = (data = rt.list());
	$1 = "tankPressure";
	if (truthy(rt.callName(f, rt.sv(f, "air_contents"), "return_pressure", []))) {
		$2 = rt.callName(f, rt.sv(f, "air_contents"), "return_pressure", []);
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, rt.call(f, P("/proc/round"), null, [$2]));
	$0 = live(data);
	$1 = "releasePressure";
	if (truthy(rt.sv(f, "distribute_pressure"))) {
		$2 = rt.sv(f, "distribute_pressure");
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, rt.call(f, P("/proc/round"), null, [$2]));
	rt.setAt(live(data), "defaultReleasePressure", rt.call(f, P("/proc/round"), null, [16]));
	rt.setAt(live(data), "minReleasePressure", rt.call(f, P("/proc/round"), null, [0]));
	rt.setAt(live(data), "maxReleasePressure", rt.call(f, P("/proc/round"), null, [303.9749755859375]));
	if (!truthy((rt.istype((C = live(user)), T("/mob/living/carbon")) ? 1 : 0))) {
		C = rt.fv(f, "loc", rt.sv(f, "loc"));
	}
	if (!truthy((rt.istype(live(C), T("/mob/living/carbon")) ? 1 : 0))) {
		return live(data);
	}
	if (isEqual(rt.fv(f, "internal", live(C)), live(f.src))) {
		rt.setAt(live(data), "connected", 1);
	}
	return live(data);
});

// /obj/item/weapon/tank/proc/ui_act  (code/game/objects/items/weapons/tanks/tanks.dm:172)  may sleep
rt.def("/obj/item/weapon/tank/proc/ui_act", function* ui_act(f: Frame) {
	let pressure: Value = null;
	let $0: any;
	f.vars = () => [pressure, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "pressure") {
		if (isEqual((pressure = rt.at(live(f.args[1]), "pressure")), "reset")) {
			pressure = 16;
			f.dot = 1;
		} else {
			if (isEqual(live(pressure), "min")) {
				pressure = 0;
				f.dot = 1;
			} else {
				if (isEqual(live(pressure), "max")) {
					pressure = 303.9749755859375;
					f.dot = 1;
				} else {
					if (isEqual(live(pressure), "input")) {
						if (((pressure = (yield* g.op(f, "Prompt", [33], [null, rt.sv(f, "distribute_pressure"), rt.sv(f, "name"), fmt("New release pressure (＀-＀ kPa):", [0, 303.9749755859375]), null]))) !== null && !truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
							f.dot = 1;
						}
					} else {
						if ((yield* g.call(f, P("/proc/text2num"), null, [live(pressure)])) !== null) {
							pressure = (yield* g.call(f, P("/proc/text2num"), null, [live(pressure)]));
							f.dot = 1;
						}
					}
				}
			}
		}
		if (!truthy(live(f.dot))) return f.dot;
		rt.setSv(f, "distribute_pressure", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/round"), null, [live(pressure)])), 303.9749755859375]))])));
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/item/weapon/tank/proc/remove_air  (code/game/objects/items/weapons/tanks/tanks.dm:197)  may sleep
rt.def("/obj/item/weapon/tank/proc/remove_air", function* remove_air(f: Frame, amount: Value) {
	f.vars = () => [amount];
	return (yield* g.callName(f, rt.sv(f, "air_contents"), "remove", [live(amount)]));
}, true);

// /obj/item/weapon/tank/proc/assume_air  (code/game/objects/items/weapons/tanks/tanks.dm:203)  may sleep
rt.def("/obj/item/weapon/tank/proc/assume_air", function* assume_air(f: Frame, giver: Value) {
	f.vars = () => [giver];
	yield* g.callName(f, rt.sv(f, "air_contents"), "merge", [live(giver)]);
	yield* g.srcCall(f, "check_status");
	return 1;
}, true);

// /obj/item/weapon/tank/proc/remove_air_volume  (code/game/objects/items/weapons/tanks/tanks.dm:209)  may sleep
rt.def("/obj/item/weapon/tank/proc/remove_air_volume", function* remove_air_volume(f: Frame, volume_to_return: Value) {
	let tank_pressure: Value = null, moles_needed: Value = null;
	f.vars = () => [volume_to_return, tank_pressure, moles_needed];
	if (!truthy(rt.sv(f, "air_contents"))) {
		return null;
	}
	if (rt.lt((tank_pressure = (yield* g.callName(f, rt.sv(f, "air_contents"), "return_pressure", []))), rt.sv(f, "distribute_pressure"))) {
		rt.setSv(f, "distribute_pressure", live(tank_pressure));
	}
	return (yield* g.srcCall(f, "remove_air", (moles_needed = divide(multiply(rt.sv(f, "distribute_pressure"), live(volume_to_return)), multiply(8.3100004196167, rt.fv(f, "temperature", rt.sv(f, "air_contents")))))));
}, true);

// /obj/item/weapon/tank/proc/process  (code/game/objects/items/weapons/tanks/tanks.dm:222)  may sleep
rt.def("/obj/item/weapon/tank/proc/process", function* process(f: Frame) {
	yield* g.callName(f, rt.sv(f, "air_contents"), "react", []);
	yield* g.srcCall(f, "check_status");
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/tank/proc/check_status  (code/game/objects/items/weapons/tanks/tanks.dm:229)  may sleep
rt.def("/obj/item/weapon/tank/proc/check_status", function* check_status(f: Frame) {
	let pressure: Value = null, range: Value = null, epicenter: Value = null, _T: Value = null, leaked_gas: Value = null;
	f.vars = () => [pressure, range, epicenter, _T, leaked_gas];
	if (!truthy(rt.sv(f, "air_contents"))) {
		return 0;
	}
	if (rt.gt((pressure = (yield* g.callName(f, rt.sv(f, "air_contents"), "return_pressure", []))), 4053)) {
		if (!truthy((rt.istype(rt.fv(f, "loc", live(f.src)), T("/obj/item/device/transfer_valve")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("Explosive tank rupture! Last key to touch the tank was ＀.", [rt.fv(f, "fingerprintslast", live(f.src))])]);
			yield* g.call(f, P("/proc/log_game"), null, [fmt("Explosive tank rupture! Last key to touch the tank was ＀.", [rt.fv(f, "fingerprintslast", live(f.src))])]);
		}
		yield* g.callName(f, rt.sv(f, "air_contents"), "react", []);
		yield* g.callName(f, rt.sv(f, "air_contents"), "react", []);
		yield* g.callName(f, rt.sv(f, "air_contents"), "react", []);
		pressure = (yield* g.callName(f, rt.sv(f, "air_contents"), "return_pressure", []));
		range = divide(subtract(live(pressure), 4053), 607.949951171875);
		yield* g.call(f, P("/proc/explosion"), null, [(epicenter = rt.getStep(f, rt.sv(f, "loc"), 0)), (yield* g.call(f, P("/proc/round"), null, [multiply(live(range), 0.25)])), (yield* g.call(f, P("/proc/round"), null, [multiply(live(range), 0.5)])), (yield* g.call(f, P("/proc/round"), null, [live(range)])), (yield* g.call(f, P("/proc/round"), null, [multiply(live(range), 1.5)]))]);
		if (truthy((rt.istype(rt.fv(f, "loc", live(f.src)), T("/obj/item/device/transfer_valve")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "loc", live(f.src))]);
		} else {
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	} else {
		if (rt.gt(live(pressure), 3546.375)) {
			if (rt.le(rt.sv(f, "integrity"), 0)) {
				if (!truthy((_T = rt.getStep(f, live(f.src), 0)))) {
					return live(f.dot);
				}
				yield* g.callName(f, live(_T), "assume_air", [rt.sv(f, "air_contents")]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/spray.ogg"), 10, 1, -3]);
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			} else {
				rt.incSrcVar(f, "integrity", -1, true);
			}
		} else {
			if (rt.gt(live(pressure), 3039.75)) {
				if (rt.le(rt.sv(f, "integrity"), 0)) {
					if (!truthy((_T = rt.getStep(f, live(f.src), 0)))) {
						return live(f.dot);
					}
					leaked_gas = (yield* g.callName(f, rt.sv(f, "air_contents"), "remove_ratio", [0.25]));
					yield* g.callName(f, live(_T), "assume_air", [live(leaked_gas)]);
				} else {
					rt.incSrcVar(f, "integrity", -1, true);
				}
			} else {
				if (!rt.lt(rt.sv(f, "integrity"), 3)) return f.dot;
				rt.incSrcVar(f, "integrity", 1, true);
			}
		}
	}
	return f.dot;
}, true);
