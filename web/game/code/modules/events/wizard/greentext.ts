// From code/modules/events/wizard/greentext.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(342, "/datum/round_event/wizard/greentext", "/datum/round_event/wizard", {});

// /datum/round_event/wizard/greentext/proc/start  (code/modules/events/wizard/greentext.dm:10)  may sleep
rt.def("/datum/round_event/wizard/greentext/proc/start", function* start(f: Frame) {
	let holder_canadates: Value = null, M: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [holder_canadates, M, H, $e];
	holder_canadates = (yield* g.callName(f, rt.gl("player_list"), "Copy", []));
	M = null;
	rt.forList(f, 0, live(holder_canadates), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (!truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
			(holder_canadates = rt.modify(live(holder_canadates), live(M), subtract));
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(holder_canadates))) {
		return 0;
	}
	yield* g.new_(f, T("/obj/item/weapon/greentext"), [rt.gv(f, "loc", (H = rt.op(f, "PickUnweighted", [1], [live(holder_canadates)])))]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<font color='green'>The mythical greentext appear at your feet! Pick it up if you dare...</font>"]);
	return f.dot;
}, true);

rt.type(7483, "/obj/item/weapon/greentext", "/obj/item/weapon", {
	last_holder: null,
	new_holder: null,
	color_altered_mobs: null,
	quiet: 0,
	name: "greentext",
	desc: "No one knows what this massive tome does, but it feels <i><font color='green'>desirable</font></i> all the same...",
	w_class: 4,
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "greentext",
	resistance_flags: 34,
});

// /obj/item/weapon/greentext/proc/<init>  (code/modules/events/wizard/greentext.dm:30)
rt.def("/obj/item/weapon/greentext/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "color_altered_mobs", rt.list());
	return f.dot;
});

// /obj/item/weapon/greentext/proc/New  (code/modules/events/wizard/greentext.dm:35)  may sleep
rt.def("/obj/item/weapon/greentext/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	(rt.modGl("poi_list", live(f.src), rt.bitOr));
	return f.dot;
}, true);

// /obj/item/weapon/greentext/proc/equipped  (code/modules/events/wizard/greentext.dm:39)  may sleep
rt.def("/obj/item/weapon/greentext/proc/equipped", function* equipped(f: Frame) {
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<font color='green'>So long as you leave this place with greentext in hand you know will be happy...</font>"]);
	if ((truthy(rt.fv(f, "mind", live(f.args[0]))) && rt.gt(rt.getLen(f, rt.gv(f, "objectives", rt.fv(f, "mind", live(f.args[0])))), 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>... so long as you still perform your other objectives that is!</span>"]);
	}
	rt.setSv(f, "new_holder", live(f.args[0]));
	if (!truthy(rt.sv(f, "last_holder"))) {
		rt.setSv(f, "last_holder", live(f.args[0]));
	}
	if (!truthy((rt.isIn(f, live(f.args[0]), rt.sv(f, "color_altered_mobs")) ? 1 : 0))) {
		rt.modSrcVar(f, "color_altered_mobs", live(f.args[0]), add);
	}
	yield* g.callName(f, live(f.args[0]), "add_atom_colour", ["#00FF00", 1]);
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/greentext/proc/dropped  (code/modules/events/wizard/greentext.dm:52)  may sleep
rt.def("/obj/item/weapon/greentext/proc/dropped", function* dropped(f: Frame) {
	if (truthy((rt.isIn(f, live(f.args[0]), rt.sv(f, "color_altered_mobs")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>A sudden wave of failure washes over you...</span>"]);
		yield* g.callName(f, live(f.args[0]), "add_atom_colour", ["#FF0000", 1]);
	}
	rt.setSv(f, "last_holder", null);
	rt.setSv(f, "new_holder", null);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/greentext/proc/process  (code/modules/events/wizard/greentext.dm:61)  may sleep
rt.def("/obj/item/weapon/greentext/proc/process", function* process(f: Frame) {
	let O: Value = null;
	f.vars = () => [O];
	if ((truthy(rt.sv(f, "new_holder")) && isEqual(rt.fv(f, "z", rt.sv(f, "new_holder")), 1))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "new_holder"), "<font color='green'>At last it feels like victory is assured!</font>"]);
		if (!truthy((rt.isIn(f, rt.sv(f, "new_holder"), rt.gv(f, "traitors", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
			rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "traitors", rt.fv(f, "mind", rt.sv(f, "new_holder")), add);
		}
		rt.setFv(f, "special_role", rt.fv(f, "mind", rt.sv(f, "new_holder")), "winner");
		rt.setFv(f, "completed", (O = (yield* g.new_(f, T("/datum/objective"), ["Succeed"]))), 1);
		rt.setFv(f, "owner", live(O), rt.fv(f, "mind", rt.sv(f, "new_holder")));
		rt.modField(f, rt.fv(f, "mind", rt.sv(f, "new_holder")), "objectives", live(O), add);
		yield* g.callName(f, rt.sv(f, "new_holder"), "log_message", ["<font color='green'>Won with greentext!!!</font>", "Attack log"]);
		(rt.modSrcVar(f, "color_altered_mobs", rt.sv(f, "new_holder"), subtract));
		(rt.modSrcVar(f, "resistance_flags", 8, rt.bitOr));
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	if (!(truthy(rt.sv(f, "last_holder")) && !isEqual(rt.sv(f, "last_holder"), rt.sv(f, "new_holder")))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "last_holder"), "<span class='warning'>A sudden wave of failure washes over you...</span>"]);
	yield* g.callName(f, rt.sv(f, "last_holder"), "add_atom_colour", ["#FF0000", 1]);
	rt.setSv(f, "last_holder", rt.sv(f, "new_holder"));
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/greentext/proc/Destroy  (code/modules/events/wizard/greentext.dm:81)  may sleep
rt.def("/obj/item/weapon/greentext/proc/Destroy", function* Destroy(f: Frame) {
	let M: Value = null, message: Value = null;
	let $e: any;
	f.vars = () => [M, message, $e];
	if ((!truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 8)) && !truthy(live(f.args[0])))) {
		return 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, rt.gl("poi_list"), "Remove", [live(f.src)]);
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		message = "<span class='warning'>A dark temptation has passed from this world";
		if (truthy((rt.isIn(f, live(M), rt.sv(f, "color_altered_mobs")) ? 1 : 0))) {
			message = rt.modify(live(message), " and you're finally able to forgive yourself", add);
			if ((isEqual(rt.fv(f, "color", live(M)), "#FF0000") || isEqual(rt.fv(f, "color", live(M)), "#00FF00"))) {
				yield* g.callName(f, live(M), "remove_atom_colour", [1]);
			}
		}
		message = rt.modify(live(message), "...</span>", add);
		if (!truthy(rt.sv(f, "quiet"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), live(message)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["force"] });
