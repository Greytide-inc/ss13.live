// From code/modules/shuttle/special.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10309, "/obj/machinery/power/emitter/energycannon/magical", "/obj/machinery/power/emitter/energycannon", {
	active_tables: null,
	tables_required: 2,
	name: "wabbajack statue",
	desc: "Who am I? What is my purpose in life? What do I mean by who am I?",
	projectile_type: rt.typePath("/obj/item/projectile/magic/change"),
	icon: rt.rsc("icons/obj/machines/magic_emitter.dmi"),
	icon_state: "wabbajack_statue",
	icon_state_on: "wabbajack_statue_on",
	active: 0,
});

// /obj/machinery/power/emitter/energycannon/magical/proc/<init>  (code/modules/shuttle/special.dm:13)
rt.def("/obj/machinery/power/emitter/energycannon/magical/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "active_tables", rt.list());
	return f.dot;
});

// /obj/machinery/power/emitter/energycannon/magical/proc/Initialize  (code/modules/shuttle/special.dm:18)  may sleep
rt.def("/obj/machinery/power/emitter/energycannon/magical/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		rt.setSv(f, "desc", "Oh no, not again.");
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/power/emitter/energycannon/magical/proc/update_icon  (code/modules/shuttle/special.dm:25)
rt.def("/obj/machinery/power/emitter/energycannon/magical/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "active"))) {
		rt.setSv(f, "icon_state", rt.sv(f, "icon_state_on"));
	} else {
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	}
	return f.dot;
});

// /obj/machinery/power/emitter/energycannon/magical/proc/process  (code/modules/shuttle/special.dm:30)
rt.def("/obj/machinery/power/emitter/energycannon/magical/proc/process", function process(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (rt.ge(rt.len(f, rt.sv(f, "active_tables")), rt.sv(f, "tables_required"))) {
		if (!truthy(rt.sv(f, "active"))) {
			rt.callSrc(f, "visible_message", [fmt("<span class='revenboldnotice'>＀ opens its eyes.</span>", [live(f.src)])]);
		}
		rt.setSv(f, "active", 1);
	} else {
		if (truthy(rt.sv(f, "active"))) {
			rt.callSrc(f, "visible_message", [fmt("<span class='revenboldnotice'>＀ closes its eyes.</span>", [live(f.src)])]);
		}
		rt.setSv(f, "active", 0);
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
}, false, { waitfor: false });

rt.type(12191, "/obj/structure/table/abductor/wabbajack", "/obj/structure/table/abductor", {
	our_statue: null,
	sleepers: null,
	never_spoken: 1,
	verb_say: "chants",
	flags: 128,
	name: "wabbajack altar",
	desc: "Whether you're sleeping or waking, it's going to be quite chaotic.",
	obj_integrity: 1000,
	max_integrity: 1000,
});

// /obj/structure/table/abductor/wabbajack/proc/<init>  (code/modules/shuttle/special.dm:64)
rt.def("/obj/structure/table/abductor/wabbajack/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "sleepers", rt.list());
	return f.dot;
});

// /obj/structure/table/abductor/wabbajack/proc/Initialize  (code/modules/shuttle/special.dm:69)
rt.def("/obj/structure/table/abductor/wabbajack/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, false, { args: ["mapload"] });

// /obj/structure/table/abductor/wabbajack/proc/Destroy  (code/modules/shuttle/special.dm:73)  may sleep
rt.def("/obj/structure/table/abductor/wabbajack/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/structure/table/abductor/wabbajack/proc/process  (code/modules/shuttle/special.dm:77)  may sleep
rt.def("/obj/structure/table/abductor/wabbajack/proc/process", function* process(f: Frame) {
	let area: Value = null, M: Value = null, _T: Value = null, found: Value = null, C: Value = null, i: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [area, M, _T, found, C, i, L, $e];
	area = (yield* g.call(f, P("/proc/orange"), null, [4, live(f.src)]));
	if (!truthy(rt.sv(f, "our_statue"))) {
		M = null;
		rt.forList(f, 0, live(area), T("/obj/machinery/power/emitter/energycannon/magical"));
		if (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			rt.setSv(f, "our_statue", live(M));
		}
		rt.endFor(f, 0);
	}
	if (!truthy(rt.sv(f, "our_statue"))) {
		rt.setSv(f, "name", fmt("inert ＀", [rt.sv(f, "name")]));
		return live(f.dot);
	} else {
		rt.setSv(f, "name", rt.initial(f, live(f.src), "name"));
	}
	_T = rt.getStep(f, live(f.src), 0);
	found = rt.list();
	C = null;
	rt.forList(f, 0, live(_T), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (!isEqual(rt.fv(f, "stat", live(C)), 2)) {
			found = rt.modify(live(found), live(C), add);
		}
	}
	rt.endFor(f, 0);
	i = null;
	rt.forList(f, 0, subtract(live(found), rt.sv(f, "sleepers")));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.callName(f, (L = live(i)), "add_atom_colour", ["#800080", 2]);
		yield* g.callName(f, live(L), "visible_message", [fmt("<span class='revennotice'>A strange purple glow wraps itself around ＀ as ＀ suddenly fall＀ unconscious.</span>", [live(L), (yield* g.callName(f, live(L), "p_they", [])), (yield* g.callName(f, live(L), "p_s", []))]), fmt("<span class='revendanger'>＀</span>", [rt.sv(f, "desc")])]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/table/abductor/wabbajack/proc/sleeper_dreams"), live(L)])), 100]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forList(f, 0, live(found));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.callName(f, (L = live(i)), "SetSleeping", [200]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forList(f, 0, subtract(rt.sv(f, "sleepers"), live(found)));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.callName(f, (L = live(i)), "remove_atom_colour", [2, "#800080"]);
		yield* g.callName(f, live(L), "visible_message", [fmt("<span class='revennotice'>The glow from ＀ fades away.</span>", [live(L)])]);
		yield* g.callName(f, live(L), "grab_ghost", []);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "sleepers", live(found));
	if (truthy(rt.len(f, rt.sv(f, "sleepers")))) {
		(rt.modField(f, rt.sv(f, "our_statue"), "active_tables", live(f.src), rt.bitOr));
		if ((truthy(rt.sv(f, "never_spoken")) || truthy(rt.op(f, "Prob", [], [5])))) {
			yield* g.srcCall(f, "say", rt.sv(f, "desc"));
			rt.setSv(f, "never_spoken", 0);
		}
	} else {
		(rt.modField(f, rt.sv(f, "our_statue"), "active_tables", live(f.src), subtract));
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/structure/table/abductor/wabbajack/proc/sleeper_dreams  (code/modules/shuttle/special.dm:128)  may sleep
rt.def("/obj/structure/table/abductor/wabbajack/proc/sleeper_dreams", function* sleeper_dreams(f: Frame, sleeper: Value) {
	f.vars = () => [sleeper];
	if (!truthy((rt.isIn(f, live(sleeper), rt.sv(f, "sleepers")) ? 1 : 0))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(sleeper), "<span class='revennotice'>While you slumber, you have the strangest dream, like you can see yourself from the outside.</span>"]);
	yield* g.callName(f, live(sleeper), "ghostize", [1]);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }] });

rt.type(4848, "/mob/living/simple_animal/drone/snowflake/bardrone", "/mob/living/simple_animal/drone/snowflake", {
	seeStatic: 0,
	laws: "1. Serve drinks.\n2. Talk to patrons.\n3. Don't get messed up in their affairs.",
	initial_language_holder: rt.typePath("/datum/language_holder/universal"),
	name: "Bardrone",
	desc: "A barkeeping drone, an indestructible robot built to tend bars.",
	status_flags: 4096,
	unique_name: 0,
});

// /mob/living/simple_animal/drone/snowflake/bardrone/proc/Initialize  (code/modules/shuttle/special.dm:153)  may sleep
rt.def("/mob/living/simple_animal/drone/snowflake/bardrone/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	(rt.modField(f, rt.sv(f, "access_card"), "access", 110, rt.bitOr));
	return f.dot;
}, true);

rt.type(4949, "/mob/living/simple_animal/hostile/alien/maid/barmaid", "/mob/living/simple_animal/hostile/alien/maid", {
	pass_flags: 1,
	initial_language_holder: rt.typePath("/datum/language_holder/universal"),
	gold_core_spawnable: 0,
	name: "Barmaid",
	desc: "A barmaid, a maiden found in a bar.",
	status_flags: 4096,
	unique_name: 0,
	AIStatus: 3,
	stop_automated_movement: 1,
});

// /mob/living/simple_animal/hostile/alien/maid/barmaid/proc/Initialize  (code/modules/shuttle/special.dm:168)  may sleep
rt.def("/mob/living/simple_animal/hostile/alien/maid/barmaid/proc/Initialize", function* Initialize(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "access_card", (yield* g.new_(f, T("/obj/item/weapon/card/id"), [live(f.src)])));
	C = (yield* g.new_(f, T("/datum/job/captain"), []));
	rt.setFv(f, "access", rt.sv(f, "access_card"), (yield* g.callName(f, live(C), "get_access", [])));
	(rt.modField(f, rt.sv(f, "access_card"), "access", 110, rt.bitOr));
	(rt.modField(f, rt.sv(f, "access_card"), "flags", 2, rt.bitOr));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/alien/maid/barmaid/proc/Destroy  (code/modules/shuttle/special.dm:176)  may sleep
rt.def("/mob/living/simple_animal/hostile/alien/maid/barmaid/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "access_card")]);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

rt.type(12201, "/obj/structure/table/wood/bar", "/obj/structure/table/wood", {
	boot_dir: 1,
	flags: 128,
	resistance_flags: 35,
	obj_integrity: 1000,
	max_integrity: 1000,
});

// /obj/structure/table/wood/bar/proc/Crossed  (code/modules/shuttle/special.dm:191)  may sleep
rt.def("/obj/structure/table/wood/bar/proc/Crossed", function* Crossed(f: Frame) {
	let M: Value = null, throwtarget: Value = null;
	f.vars = () => [M, throwtarget];
	if ((truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0)) && !truthy((yield* g.srcCall(f, "is_barstaff", live(f.args[0])))))) {
		M = live(f.args[0]);
		throwtarget = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(f.src), rt.sv(f, "boot_dir")]));
		yield* g.callName(f, live(M), "Knockdown", [40]);
		yield* g.callName(f, live(M), "throw_at", [live(throwtarget), 5, 1, live(f.src)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='notice'>No climbing on the bar please.</span>"]);
	} else {
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["AM"] });

// /obj/structure/table/wood/bar/proc/shuttleRotate  (code/modules/shuttle/special.dm:202)  may sleep
rt.def("/obj/structure/table/wood/bar/proc/shuttleRotate", function* shuttleRotate(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "boot_dir", (yield* g.call(f, P("/proc/angle2dir"), null, [add(live(f.args[0]), (yield* g.call(f, P("/proc/dir2angle"), null, [rt.sv(f, "boot_dir")])))])));
	return f.dot;
}, true, { args: ["rotation"] });

// /obj/structure/table/wood/bar/proc/is_barstaff  (code/modules/shuttle/special.dm:207)
rt.def("/obj/structure/table/wood/bar/proc/is_barstaff", function is_barstaff(f: Frame, user: Value) {
	let H: Value = null, ID: Value = null;
	f.vars = () => [H, ID];
	f.dot = 0;
	if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if ((truthy(rt.gv(f, "mind", (H = live(user)))) && isEqual(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(H))), "Bartender"))) {
			return 1;
		}
	}
	if (!(truthy((ID = rt.callName(f, live(user), "get_idcard", []))) && truthy((rt.isIn(f, 110, rt.fv(f, "access", live(ID))) ? 1 : 0)))) return f.dot;
	return 1;
});

rt.type(11816, "/obj/effect/forcefield/luxury_shuttle", "/obj/effect/forcefield", {
	threshold: 500,
}, { global: { approved_passengers: 780 } });

// /obj/effect/forcefield/luxury_shuttle/proc/CanPass  (code/modules/shuttle/special.dm:223)  may sleep
rt.def("/obj/effect/forcefield/luxury_shuttle/proc/CanPass", function* CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	let total_cash: Value = null, counted_money: Value = null, C: Value = null, S: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [mover, target, height, total_cash, counted_money, C, S, I, $e];
	if (live(height) === null) {
		height = 0;
	}
	if (truthy((rt.isIn(f, live(mover), rt.gl("approved_passengers")) ? 1 : 0))) {
		return 1;
	}
	if (!truthy((rt.istype(live(mover), T("/mob/living")) ? 1 : 0))) {
		return 0;
	}
	total_cash = 0;
	counted_money = rt.list();
	C = null;
	rt.forList(f, 0, (yield* g.callName(f, live(mover), "GetAllContents", [])), T("/obj/item/weapon/coin"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		total_cash = rt.modify(live(total_cash), rt.fv(f, "value", live(C)), add);
		counted_money = rt.modify(live(counted_money), live(C), add);
		if (rt.ge(live(total_cash), rt.sv(f, "threshold"))) {
			break;
		}
	}
	rt.endFor(f, 0);
	S = null;
	rt.forList(f, 0, (yield* g.callName(f, live(mover), "GetAllContents", [])), T("/obj/item/stack/spacecash"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		total_cash = rt.modify(live(total_cash), multiply(rt.fv(f, "value", live(S)), rt.fv(f, "amount", live(S))), add);
		counted_money = rt.modify(live(counted_money), live(S), add);
		if (rt.ge(live(total_cash), rt.sv(f, "threshold"))) {
			break;
		}
	}
	rt.endFor(f, 0);
	if (rt.ge(live(total_cash), rt.sv(f, "threshold"))) {
		I = null;
		rt.forList(f, 0, live(counted_money), T("/obj"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/to_chat"), null, [live(mover), "Thank you for your payment! Please enjoy your flight."]);
		rt.modGl("approved_passengers", live(mover), add);
		return 1;
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(mover), "You don't have enough money to enter the main shuttle. You'll have to fly coach."]);
		return 0;
	}
	return f.dot;
}, true);

rt.type(11772, "/obj/effect/decal/hammerandsickle", "/obj/effect/decal", {
	name: "hammer and sickle",
	desc: "Communism powerful force.",
	icon: rt.rsc("icons/effects/96x96.dmi"),
	icon_state: "communist",
	layer: 2.04,
	pixel_x: -32,
	pixel_y: -32,
});

// /obj/effect/decal/hammerandsickle/proc/shuttleRotate  (code/modules/shuttle/special.dm:269)
rt.def("/obj/effect/decal/hammerandsickle/proc/shuttleRotate", function shuttleRotate(f: Frame, rotation: Value) {
	rt.callSrc(f, "setDir", [rt.call(f, P("/proc/angle2dir"), null, [add(live(rotation), rt.call(f, P("/proc/dir2angle"), null, [rt.sv(f, "dir")]))])]);
	return f.dot;
});
