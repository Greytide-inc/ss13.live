// From code/modules/power/rtg.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10317, "/obj/machinery/power/rtg", "/obj/machinery/power", {
	power_gen: 1000,
	board_path: rt.typePath("/obj/item/weapon/circuitboard/machine/rtg"),
	irradiate: 1,
	anchored: 1,
	can_buckle: 1,
	buckle_lying: 0,
	buckle_requires_restraints: 1,
	name: "radioisotope thermoelectric generator",
	desc: "A simple nuclear power generator, used in small outposts to reliably provide power for decades.",
	icon: rt.rsc("icons/obj/power.dmi"),
	icon_state: "rtg",
	density: 1,
	use_power: 0,
});

// /obj/machinery/power/rtg/proc/New  (code/modules/power/rtg.dm:23)  may sleep
rt.def("/obj/machinery/power/rtg/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, rt.sv(f, "board_path"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6767, "/obj/item/weapon/circuitboard/machine/rtg", "/obj/item/weapon/circuitboard/machine", {
	name: "RTG (Machine Board)",
	build_path: rt.typePath("/obj/machinery/power/rtg"),
	origin_tech: "programming=2;materials=4;powerstorage=3;engineering=2",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/rtg/proc/<init>  (code/modules/power/rtg.dm:31)
rt.def("/obj/item/weapon/circuitboard/machine/rtg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/stack/cable_coil"), 5, T("/obj/item/weapon/stock_parts/capacitor"), 1, T("/obj/item/stack/sheet/mineral/uranium"), 10]));
	return f.dot;
});

// /obj/machinery/power/rtg/proc/Initialize  (code/modules/power/rtg.dm:37)  may sleep
rt.def("/obj/machinery/power/rtg/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "connect_to_network");
	return f.dot;
}, true);

// /obj/machinery/power/rtg/proc/process  (code/modules/power/rtg.dm:41)  may sleep
rt.def("/obj/machinery/power/rtg/proc/process", function* process(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "add_avail", rt.sv(f, "power_gen"));
	if (!(truthy(rt.sv(f, "panel_open")) && truthy(rt.sv(f, "irradiate")))) return f.dot;
	yield* g.call(f, P("/proc/radiation_pulse"), null, [rt.getStep(f, live(f.src), 0), 2, 3, 6]);
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/power/rtg/proc/RefreshParts  (code/modules/power/rtg.dm:48)
rt.def("/obj/machinery/power/rtg/proc/RefreshParts", function RefreshParts(f: Frame) {
	let part_level: Value = null, SP: Value = null;
	let $e: any;
	f.vars = () => [part_level, SP, $e];
	part_level = 0;
	SP = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SP = $e;
		part_level = rt.modify(live(part_level), rt.fv(f, "rating", live(SP)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "power_gen", multiply(rt.initial(f, live(f.src), "power_gen"), live(part_level)));
	return f.dot;
});

// /obj/machinery/power/rtg/proc/attackby  (code/modules/power/rtg.dm:54)  may sleep
rt.def("/obj/machinery/power/rtg/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	} else {
		if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), fmt("＀-open", [rt.initial(f, live(f.src), "icon_state")]), rt.initial(f, live(f.src), "icon_state"), live(f.args[0]))))) {
			return live(f.dot);
		} else {
			if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
				return live(f.dot);
			}
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/power/rtg/proc/attack_hand  (code/modules/power/rtg.dm:63)  may sleep
rt.def("/obj/machinery/power/rtg/proc/attack_hand", function* attack_hand(f: Frame) {
	if ((isEqual(rt.fv(f, "a_intent", live(f.args[0])), "grab") && truthy((yield* g.callSrc(f, "user_buckle_mob", [null, rt.fv(f, "pulling", live(f.args[0])), null, live(f.args[0]), "check_loc", 0], rt.Args.Named))))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

rt.type(6768, "/obj/item/weapon/circuitboard/machine/rtg/advanced", "/obj/item/weapon/circuitboard/machine/rtg", {
	name: "Advanced RTG (Machine Board)",
	build_path: rt.typePath("/obj/machinery/power/rtg/advanced"),
	origin_tech: "programming=3;materials=5;powerstorage=4;engineering=3;plasmatech=3",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/rtg/advanced/proc/<init>  (code/modules/power/rtg.dm:77)
rt.def("/obj/item/weapon/circuitboard/machine/rtg/advanced/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/stack/cable_coil"), 5, T("/obj/item/weapon/stock_parts/capacitor"), 1, T("/obj/item/weapon/stock_parts/micro_laser"), 1, T("/obj/item/stack/sheet/mineral/uranium"), 10, T("/obj/item/stack/sheet/mineral/plasma"), 5]));
	return f.dot;
});

rt.type(6718, "/obj/item/weapon/circuitboard/machine/abductor/core", "/obj/item/weapon/circuitboard/machine/abductor", {
	req_components: null,
	def_components: null,
	name: "alien board (Void Core)",
	build_path: rt.typePath("/obj/machinery/power/rtg/abductor"),
	origin_tech: "programming=5;abductor=5;powerstorage=8;engineering=8",
});

// /obj/item/weapon/circuitboard/machine/abductor/core/proc/<init>  (code/modules/power/rtg.dm:105)
rt.def("/obj/item/weapon/circuitboard/machine/abductor/core/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/capacitor"), 1, T("/obj/item/weapon/stock_parts/micro_laser"), 1, T("/obj/item/weapon/stock_parts/cell/infinite/abductor"), 1]));
	$0 = $0;
	rt.setSv(f, "def_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/capacitor"), T("/obj/item/weapon/stock_parts/capacitor/quadratic"), T("/obj/item/weapon/stock_parts/micro_laser"), T("/obj/item/weapon/stock_parts/micro_laser/quadultra")]));
	return f.dot;
});

rt.type(10319, "/obj/machinery/power/rtg/abductor", "/obj/machinery/power/rtg", {
	going_kaboom: 0,
	board_path: rt.typePath("/obj/item/weapon/circuitboard/machine/abductor/core"),
	power_gen: 20000,
	irradiate: 0,
	can_buckle: 0,
	name: "Void Core",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "core",
	desc: "An alien power source that produces energy seemingly out of nowhere.",
	pixel_y: 7,
});

// /obj/machinery/power/rtg/abductor/proc/overload  (code/modules/power/rtg.dm:117)  may sleep
rt.def("/obj/machinery/power/rtg/abductor/proc/overload", function* overload(f: Frame) {
	if (truthy(rt.sv(f, "going_kaboom"))) {
		return live(f.dot);
	}
	rt.setSv(f, "going_kaboom", 1);
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＄！ lets out an shower of sparks as it starts to lose stability!</span>", [live(f.src)]), "<span class='italics'>You hear a loud electrical crack!</span>");
	yield* g.call(f, P("/proc/playsound"), null, [null, rt.fv(f, "loc", live(f.src)), null, rt.rsc("sound/magic/lightningshock.ogg"), null, 100, null, 1, "extrarange", 5], rt.Args.Named);
	yield* g.call(f, P("/proc/tesla_zap"), null, [live(f.src), 5, multiply(rt.sv(f, "power_gen"), 0.05000000074505806)]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/explosion"), rt.getStep(f, live(f.src), 0), 2, 3, 4, 8])), 100]);
	return f.dot;
}, true);

// /obj/machinery/power/rtg/abductor/proc/bullet_act  (code/modules/power/rtg.dm:124)  may sleep
rt.def("/obj/machinery/power/rtg/abductor/proc/bullet_act", function* bullet_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(((!truthy(rt.sv(f, "going_kaboom")) && truthy((rt.istype(live(f.args[0]), T("/obj/item/projectile")) ? 1 : 0))) && !truthy(rt.fv(f, "nodamage", live(f.args[0])))) && (isEqual(rt.fv(f, "damage_type", live(f.args[0])), "fire") || isEqual(rt.fv(f, "damage_type", live(f.args[0])), "brute")))) return f.dot;
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ triggered an Abductor Core explosion via projectile.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [rt.fv(f, "firer", live(f.args[0]))]))])]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ triggered an Abductor Core explosion via projectile.", [(yield* g.call(f, P("/proc/key_name"), null, [rt.fv(f, "firer", live(f.args[0]))]))])]);
	yield* g.srcCall(f, "overload");
	return f.dot;
}, true, { args: ["Proj"] });

// /obj/machinery/power/rtg/abductor/proc/blob_act  (code/modules/power/rtg.dm:131)  may sleep
rt.def("/obj/machinery/power/rtg/abductor/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	f.vars = () => [B];
	yield* g.srcCall(f, "overload");
	return f.dot;
}, true);

// /obj/machinery/power/rtg/abductor/proc/ex_act  (code/modules/power/rtg.dm:135)  may sleep
rt.def("/obj/machinery/power/rtg/abductor/proc/ex_act", function* ex_act(f: Frame) {
	if (truthy(rt.sv(f, "going_kaboom"))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		yield* g.srcCall(f, "overload");
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/power/rtg/abductor/proc/fire_act  (code/modules/power/rtg.dm:140)  may sleep
rt.def("/obj/machinery/power/rtg/abductor/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	f.vars = () => [exposed_temperature, exposed_volume];
	yield* g.srcCall(f, "overload");
	return f.dot;
}, true);

// /obj/machinery/power/rtg/abductor/proc/tesla_act  (code/modules/power/rtg.dm:143)  may sleep
rt.def("/obj/machinery/power/rtg/abductor/proc/tesla_act", function* tesla_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "overload");
	return f.dot;
}, true);
