// From code/game/mecha/equipment/mecha_equipment.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9606, "/obj/item/mecha_parts/mecha_equipment", "/obj/item/mecha_parts", {
	equip_cooldown: 0,
	equip_ready: 1,
	energy_drain: 0,
	chassis: null,
	range: 1,
	salvageable: 1,
	selectable: 1,
	name: "mecha equipment",
	icon: rt.rsc("icons/mecha/mecha_equipment.dmi"),
	icon_state: "mecha_equip",
	force: 5,
	origin_tech: "materials=2;engineering=2",
	obj_integrity: 300,
	max_integrity: 300,
});

// /obj/item/mecha_parts/mecha_equipment/proc/update_chassis_page  (code/game/mecha/equipment/mecha_equipment.dm:22)
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/update_chassis_page", function update_chassis_page(f: Frame) {
	if (truthy(rt.sv(f, "chassis"))) {
		rt.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), "exosuit.browser", "eq_list", rt.callName(f, rt.sv(f, "chassis"), "get_equipment_list", [])]);
		rt.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), "exosuit.browser", "equipment_menu", rt.callName(f, rt.sv(f, "chassis"), "get_equipment_menu", []), "dropdowns"]);
		return 1;
	}
	return live(f.dot);
});

// /obj/item/mecha_parts/mecha_equipment/proc/update_equip_info  (code/game/mecha/equipment/mecha_equipment.dm:29)
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/update_equip_info", function update_equip_info(f: Frame) {
	if (truthy(rt.sv(f, "chassis"))) {
		rt.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), "exosuit.browser", fmt("＃", [live(f.src)]), rt.callSrc(f, "get_equip_info", [])]);
		return 1;
	}
	return live(f.dot);
});

// /obj/item/mecha_parts/mecha_equipment/proc/Destroy  (code/game/mecha/equipment/mecha_equipment.dm:35)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "chassis"))) {
		(rt.modField(f, rt.sv(f, "chassis"), "equipment", live(f.src), subtract));
		if (isEqual(rt.fv(f, "selected", rt.sv(f, "chassis")), live(f.src))) {
			rt.setFv(f, "selected", rt.sv(f, "chassis"), null);
		}
		yield* g.callName(f, live(f.src), "update_chassis_page", []);
		yield* g.callName(f, rt.sv(f, "chassis"), "occupant_message", [fmt("<span class='danger'>The ＀ is destroyed!</span>", [live(f.src)])]);
		yield* g.callName(f, rt.sv(f, "chassis"), "log_append_to_last", [fmt("＀ is destroyed.", [live(f.src)]), 1]);
		if (truthy((rt.istype(live(f.src), T("/obj/item/mecha_parts/mecha_equipment/weapon")) ? 1 : 0))) {
			rt.op(f, "OutputReference", [rt.R.field("occupant")], [rt.sv(f, "chassis"), (yield* g.call(f, P("/proc/sound"), null, [null, rt.rsc("sound/mecha/weapdestr.ogg"), "volume", 50], rt.Args.Named))], false);
		} else {
			rt.op(f, "OutputReference", [rt.R.field("occupant")], [rt.sv(f, "chassis"), (yield* g.call(f, P("/proc/sound"), null, [null, rt.rsc("sound/mecha/critdestr.ogg"), "volume", 50], rt.Args.Named))], false);
		}
		rt.setSv(f, "chassis", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/mecha_parts/mecha_equipment/proc/critfail  (code/game/mecha/equipment/mecha_equipment.dm:50)
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/critfail", function critfail(f: Frame) {
	if (!truthy(rt.sv(f, "chassis"))) return f.dot;
	rt.callSrc(f, "log_message", ["Critical failure", 1]);
	return f.dot;
});

// /obj/item/mecha_parts/mecha_equipment/proc/get_equip_info  (code/game/mecha/equipment/mecha_equipment.dm:53)
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/get_equip_info", function get_equip_info(f: Frame) {
	let txt: Value = null;
	let $0: any;
	f.vars = () => [txt, $0];
	if (!truthy(rt.sv(f, "chassis"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "equip_ready"))) {
		$0 = "#0f0";
	} else {
		$0 = "#f00";
	}
	txt = fmt("<span style=\"color:＀;\">*</span>&nbsp;", [$0]);
	if (isEqual(rt.fv(f, "selected", rt.sv(f, "chassis")), live(f.src))) {
		txt = rt.modify(live(txt), fmt("<b>＀</b>", [rt.fv(f, "name", live(f.src))]), add);
	} else {
		if (truthy(rt.sv(f, "selectable"))) {
			txt = rt.modify(live(txt), fmt("<a href='?src=＃;select_equip=＃'>＀</a>", [rt.sv(f, "chassis"), live(f.src), rt.fv(f, "name", live(f.src))]), add);
		} else {
			txt = rt.modify(live(txt), fmt("＀", [rt.fv(f, "name", live(f.src))]), add);
		}
	}
	return live(txt);
});

// /obj/item/mecha_parts/mecha_equipment/proc/is_ranged  (code/game/mecha/equipment/mecha_equipment.dm:65)
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/is_ranged", function is_ranged(f: Frame) {
	return rt.bitAnd(rt.sv(f, "range"), 2);
});

// /obj/item/mecha_parts/mecha_equipment/proc/is_melee  (code/game/mecha/equipment/mecha_equipment.dm:68)
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/is_melee", function is_melee(f: Frame) {
	return rt.bitAnd(rt.sv(f, "range"), 1);
});

// /obj/item/mecha_parts/mecha_equipment/proc/action_checks  (code/game/mecha/equipment/mecha_equipment.dm:72)
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/action_checks", function action_checks(f: Frame, target: Value) {
	if (!truthy(live(target))) {
		return 0;
	}
	if (!truthy(rt.sv(f, "chassis"))) {
		return 0;
	}
	if (!truthy(rt.sv(f, "equip_ready"))) {
		return 0;
	}
	if (truthy(rt.sv(f, "crit_fail"))) {
		return 0;
	}
	if ((truthy(rt.sv(f, "energy_drain")) && !truthy(rt.callName(f, rt.sv(f, "chassis"), "has_charge", [rt.sv(f, "energy_drain")])))) {
		return 0;
	}
	return 1;
});

// /obj/item/mecha_parts/mecha_equipment/proc/start_cooldown  (code/game/mecha/equipment/mecha_equipment.dm:88)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/start_cooldown", function* start_cooldown(f: Frame) {
	yield* g.srcCall(f, "set_ready_state", 0);
	yield* g.callName(f, rt.sv(f, "chassis"), "use_power", [rt.sv(f, "energy_drain")]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/mecha_parts/mecha_equipment/proc/set_ready_state"), 1])), rt.sv(f, "equip_cooldown")]);
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/proc/do_after_cooldown  (code/game/mecha/equipment/mecha_equipment.dm:93)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/do_after_cooldown", function* do_after_cooldown(f: Frame, target: Value) {
	let C: Value = null;
	f.vars = () => [target, C];
	if (!truthy(rt.sv(f, "chassis"))) {
		return live(f.dot);
	}
	C = rt.fv(f, "loc", rt.sv(f, "chassis"));
	yield* g.srcCall(f, "set_ready_state", 0);
	yield* g.callName(f, rt.sv(f, "chassis"), "use_power", [rt.sv(f, "energy_drain")]);
	f.dot = (yield* g.call(f, P("/proc/do_after"), null, [null, rt.fv(f, "occupant", rt.sv(f, "chassis")), null, rt.sv(f, "equip_cooldown"), "target", live(target)], rt.Args.Named));
	yield* g.srcCall(f, "set_ready_state", 1);
	if (!((!truthy(rt.sv(f, "chassis")) || !isEqual(rt.fv(f, "loc", rt.sv(f, "chassis")), live(C))) || !isEqual(live(f.src), rt.fv(f, "selected", rt.sv(f, "chassis"))))) return f.dot;
	return 0;
}, true);

// /obj/item/mecha_parts/mecha_equipment/proc/can_attach  (code/game/mecha/equipment/mecha_equipment.dm:105)
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/can_attach", function can_attach(f: Frame, M: Value) {
	if (!rt.lt(rt.getLen(f, rt.fv(f, "equipment", live(M))), rt.fv(f, "max_equip", live(M)))) return f.dot;
	return 1;
});

// /obj/item/mecha_parts/mecha_equipment/proc/attach  (code/game/mecha/equipment/mecha_equipment.dm:110)
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/attach", function attach(f: Frame, M: Value) {
	rt.modField(f, live(M), "equipment", live(f.src), add);
	rt.setSv(f, "chassis", live(M));
	rt.setFv(f, "loc", live(f.src), live(M));
	rt.callName(f, live(M), "log_message", [fmt("＀ initialized.", [live(f.src)])]);
	if ((!truthy(rt.fv(f, "selected", live(M))) && truthy(rt.sv(f, "selectable")))) {
		rt.setFv(f, "selected", live(M), live(f.src));
	}
	rt.callName(f, live(f.src), "update_chassis_page", []);
	return live(f.dot);
});

// /obj/item/mecha_parts/mecha_equipment/proc/detach  (code/game/mecha/equipment/mecha_equipment.dm:119)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/detach", function* detach(f: Frame, moveto: Value) {
	f.vars = () => [moveto];
	if (live(moveto) === null) {
		moveto = null;
	}
	moveto = (live(moveto) || rt.getStep(f, rt.sv(f, "chassis"), 0));
	if (truthy((yield* g.callName(f, live(f.src), "Move", [live(moveto)])))) {
		(rt.modField(f, rt.sv(f, "chassis"), "equipment", live(f.src), subtract));
		if (isEqual(rt.fv(f, "selected", rt.sv(f, "chassis")), live(f.src))) {
			rt.setFv(f, "selected", rt.sv(f, "chassis"), null);
		}
		yield* g.srcCall(f, "update_chassis_page");
		yield* g.callName(f, rt.sv(f, "chassis"), "log_message", [fmt("＀ removed from equipment.", [live(f.src)])]);
		rt.setSv(f, "chassis", null);
		yield* g.srcCall(f, "set_ready_state", 1);
	}
	return live(f.dot);
}, true);

// /obj/item/mecha_parts/mecha_equipment/proc/Topic  (code/game/mecha/equipment/mecha_equipment.dm:132)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	f.vars = () => [href, href_list];
	if (!truthy(rt.at(live(href_list), "detach"))) return f.dot;
	// Only the mech's pilot may detach its equipment (the href could name any equipment from anywhere).
	if (!isEqual(rt.gv(f, "occupant", rt.sv(f, "chassis")), live(f.usr))) return f.dot;
	yield* g.srcCall(f, "detach");
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/proc/set_ready_state  (code/game/mecha/equipment/mecha_equipment.dm:136)
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/set_ready_state", function set_ready_state(f: Frame, state: Value) {
	rt.setSv(f, "equip_ready", live(state));
	if (truthy(rt.sv(f, "chassis"))) {
		rt.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), "exosuit.browser", fmt("＃", [live(f.src)]), rt.callName(f, live(f.src), "get_equip_info", [])]);
	}
	return live(f.dot);
});

// /obj/item/mecha_parts/mecha_equipment/proc/occupant_message  (code/game/mecha/equipment/mecha_equipment.dm:143)
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/occupant_message", function occupant_message(f: Frame, message: Value) {
	if (truthy(rt.sv(f, "chassis"))) {
		rt.callName(f, rt.sv(f, "chassis"), "occupant_message", [fmt("＀ ＀", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(message)])]);
	}
	return live(f.dot);
});

// /obj/item/mecha_parts/mecha_equipment/proc/log_message  (code/game/mecha/equipment/mecha_equipment.dm:148)
rt.def("/obj/item/mecha_parts/mecha_equipment/proc/log_message", function log_message(f: Frame, message: Value) {
	if (truthy(rt.sv(f, "chassis"))) {
		rt.callName(f, rt.sv(f, "chassis"), "log_message", [fmt("<i>＀:</i> ＀", [live(f.src), live(message)])]);
	}
	return live(f.dot);
});
