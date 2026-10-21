// From code/modules/awaymissions/mission_code/stationCollision.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11522, "/obj/effect/landmark/sc_bible_spawner", "/obj/effect/landmark", {
	name: "Safecode hint spawner",
});

// /obj/effect/landmark/sc_bible_spawner/proc/New  (code/modules/awaymissions/mission_code/stationCollision.dm:26)  may sleep
rt.def("/obj/effect/landmark/sc_bible_spawner/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	rt.setFv(f, "name", (B = (yield* g.new_(f, T("/obj/item/weapon/storage/book/bible/booze"), [rt.fv(f, "loc", live(f.src))]))), "The Holy book of the Geometer");
	rt.setFv(f, "deity_name", live(B), "Narsie");
	rt.setFv(f, "icon_state", live(B), "melted");
	rt.setFv(f, "item_state", live(B), "melted");
	yield* g.new_(f, T("/obj/item/weapon/paper/sc_safehint_paper_bible"), [live(B)]);
	yield* g.new_(f, T("/obj/item/weapon/pen"), [live(B)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(5216, "/obj/item/weapon/gun/ballistic/automatic/c20r/sc_c20r", "/obj/item/weapon/gun/ballistic/automatic/c20r", {});

// /obj/item/weapon/gun/ballistic/automatic/c20r/sc_c20r/proc/Initialize  (code/modules/awaymissions/mission_code/stationCollision.dm:50)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/automatic/c20r/sc_c20r/proc/Initialize", function* Initialize(f: Frame) {
	let ammo: Value = null;
	let $e: any;
	f.vars = () => [ammo, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	ammo = null;
	rt.forList(f, 0, rt.fv(f, "stored_ammo", rt.sv(f, "magazine")));
	while (($e = rt.next(f, 0)) !== undefined) {
		ammo = $e;
		if (truthy(rt.op(f, "Prob", [], [95]))) {
			(rt.modField(f, rt.sv(f, "magazine"), "stored_ammo", live(ammo), subtract));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5249, "/obj/item/weapon/gun/ballistic/shotgun/sc_pump", "/obj/item/weapon/gun/ballistic/shotgun", {});

// /obj/item/weapon/gun/ballistic/shotgun/sc_pump/proc/Initialize  (code/modules/awaymissions/mission_code/stationCollision.dm:59)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/shotgun/sc_pump/proc/Initialize", function* Initialize(f: Frame) {
	let ammo: Value = null;
	let $e: any;
	f.vars = () => [ammo, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	ammo = null;
	rt.forList(f, 0, rt.fv(f, "stored_ammo", rt.sv(f, "magazine")));
	while (($e = rt.next(f, 0)) !== undefined) {
		ammo = $e;
		if (truthy(rt.op(f, "Prob", [], [95]))) {
			(rt.modField(f, rt.sv(f, "magazine"), "stored_ammo", live(ammo), subtract));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/controller/global_vars/proc/InitGlobalsc_safecode1  (code/modules/awaymissions/mission_code/stationCollision.dm:75)
rt.def("/datum/controller/global_vars/proc/InitGlobalsc_safecode1", function InitGlobalsc_safecode1(f: Frame) {
	rt.setGl("sc_safecode1", fmt("＀", [rt.call(f, P("/proc/rand"), null, [0, 9])]));
	rt.modSrcVar(f, "gvars_datum_init_order", "sc_safecode1", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsc_safecode2  (code/modules/awaymissions/mission_code/stationCollision.dm:76)
rt.def("/datum/controller/global_vars/proc/InitGlobalsc_safecode2", function InitGlobalsc_safecode2(f: Frame) {
	rt.setGl("sc_safecode2", fmt("＀", [rt.call(f, P("/proc/rand"), null, [0, 9])]));
	rt.modSrcVar(f, "gvars_datum_init_order", "sc_safecode2", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsc_safecode3  (code/modules/awaymissions/mission_code/stationCollision.dm:77)
rt.def("/datum/controller/global_vars/proc/InitGlobalsc_safecode3", function InitGlobalsc_safecode3(f: Frame) {
	rt.setGl("sc_safecode3", fmt("＀", [rt.call(f, P("/proc/rand"), null, [0, 9])]));
	rt.modSrcVar(f, "gvars_datum_init_order", "sc_safecode3", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsc_safecode4  (code/modules/awaymissions/mission_code/stationCollision.dm:78)
rt.def("/datum/controller/global_vars/proc/InitGlobalsc_safecode4", function InitGlobalsc_safecode4(f: Frame) {
	rt.setGl("sc_safecode4", fmt("＀", [rt.call(f, P("/proc/rand"), null, [0, 9])]));
	rt.modSrcVar(f, "gvars_datum_init_order", "sc_safecode4", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsc_safecode5  (code/modules/awaymissions/mission_code/stationCollision.dm:79)
rt.def("/datum/controller/global_vars/proc/InitGlobalsc_safecode5", function InitGlobalsc_safecode5(f: Frame) {
	rt.setGl("sc_safecode5", fmt("＀", [rt.call(f, P("/proc/rand"), null, [0, 9])]));
	rt.modSrcVar(f, "gvars_datum_init_order", "sc_safecode5", add);
	return f.dot;
});

rt.type(6600, "/obj/item/weapon/paper/sc_safehint_paper_prison", "/obj/item/weapon/paper", {
	name: "smudged paper",
});

// /obj/item/weapon/paper/sc_safehint_paper_prison/proc/New  (code/modules/awaymissions/mission_code/stationCollision.dm:86)
rt.def("/obj/item/weapon/paper/sc_safehint_paper_prison/proc/New", function New(f: Frame) {
	rt.setSv(f, "info", fmt("<i>The ink is smudged, you can only make out a couple numbers:</i> '＀**＀*'", [rt.gl("sc_safecode1"), rt.gl("sc_safecode4")]));
	return f.dot;
});

rt.type(6601, "/obj/item/weapon/paper/sc_safehint_paper_hydro", "/obj/item/weapon/paper", {
	name: "shredded paper",
});

// /obj/item/weapon/paper/sc_safehint_paper_hydro/proc/New  (code/modules/awaymissions/mission_code/stationCollision.dm:91)
rt.def("/obj/item/weapon/paper/sc_safehint_paper_hydro/proc/New", function New(f: Frame) {
	rt.setSv(f, "info", fmt("<i>Although the paper is shredded, you can clearly see the number:</i> '＀'", [rt.gl("sc_safecode2")]));
	return f.dot;
});

rt.type(6603, "/obj/item/weapon/paper/sc_safehint_paper_bible", "/obj/item/weapon/paper", {
	name: "hidden paper",
});

// /obj/item/weapon/paper/sc_safehint_paper_bible/proc/New  (code/modules/awaymissions/mission_code/stationCollision.dm:101)
rt.def("/obj/item/weapon/paper/sc_safehint_paper_bible/proc/New", function New(f: Frame) {
	rt.setSv(f, "info", fmt("<i>It would appear that the pen hidden with the paper had leaked ink over the paper.\n\t\t\tHowever you can make out the last three digits:</i>'＀＀＀'\n\t\t\t", [rt.gl("sc_safecode3"), rt.gl("sc_safecode4"), rt.gl("sc_safecode5")]));
	return f.dot;
});

rt.type(5587, "/obj/item/weapon/storage/secure/safe/sc_ssafe", "/obj/item/weapon/storage/secure/safe", {
	name: "Captain's secure safe",
});

// /obj/item/weapon/storage/secure/safe/sc_ssafe/proc/New  (code/modules/awaymissions/mission_code/stationCollision.dm:125)  may sleep
rt.def("/obj/item/weapon/storage/secure/safe/sc_ssafe/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "l_code", fmt("＀＀＀＀＀", [rt.gl("sc_safecode1"), rt.gl("sc_safecode2"), rt.gl("sc_safecode3"), rt.gl("sc_safecode4"), rt.gl("sc_safecode5")]));
	rt.setSv(f, "l_set", 1);
	yield* g.new_(f, T("/obj/item/weapon/gun/energy/mindflayer"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/soulstone"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/space/hardsuit/cult"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/ore/diamond"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(13038, "/obj/singularity/narsie/sc_Narsie", "/obj/singularity/narsie", {
	uneatable: null,
	desc: "Your body becomes weak and your feel your mind slipping away as you try to comprehend what you know can't be possible.",
	move_self: 0,
	grav_pull: 0,
});

// /obj/singularity/narsie/sc_Narsie/proc/<init>  (code/modules/awaymissions/mission_code/stationCollision.dm:141)
rt.def("/obj/singularity/narsie/sc_Narsie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "uneatable", rt.list(T("/turf/open/space"), T("/obj/effect/overlay"), T("/mob/living/simple_animal/hostile/construct")));
	return f.dot;
});

// /obj/singularity/narsie/sc_Narsie/proc/process  (code/modules/awaymissions/mission_code/stationCollision.dm:147)  may sleep
rt.def("/obj/singularity/narsie/sc_Narsie/proc/process", function* process(f: Frame) {
	yield* g.srcCall(f, "eat");
	if (!truthy(rt.op(f, "Prob", [], [25]))) return f.dot;
	yield* g.srcCall(f, "mezzer");
	return f.dot;
}, true, { waitfor: false });

// /obj/singularity/narsie/sc_Narsie/proc/consume  (code/modules/awaymissions/mission_code/stationCollision.dm:152)  may sleep
rt.def("/obj/singularity/narsie/sc_Narsie/proc/consume", function* consume(f: Frame, A: Value) {
	let L: Value = null, O: Value = null, _T: Value = null, O_1: Value = null;
	let $e: any;
	f.vars = () => [A, L, O, _T, O_1, $e];
	if (truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(A), rt.sv(f, "uneatable")])))) {
		return 0;
	}
	if (truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
		yield* g.callName(f, (L = live(A)), "gib", []);
	} else {
		if (truthy((rt.istype(live(A), T("/obj")) ? 1 : 0))) {
			yield* g.callName(f, (O = live(A)), "ex_act", [1]);
			if (truthy(live(O))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
			}
		} else {
			if (truthy((yield* g.call(f, P("/proc/isturf"), null, [live(A)])))) {
				if (truthy(rt.gv(f, "intact", (_T = live(A))))) {
					O_1 = null;
					rt.forList(f, 0, rt.fv(f, "contents", live(_T)), T("/obj"));
					while (($e = rt.next(f, 0)) !== undefined) {
						O_1 = $e;
						if (!isEqual(rt.fv(f, "level", live(O_1)), 1)) {
							continue;
						}
						if (isEqual(rt.fv(f, "invisibility", live(O_1)), 100)) {
							yield* g.callName(f, live(f.src), "consume", [live(O_1)]);
						}
					}
					rt.endFor(f, 0);
				}
				yield* g.callName(f, live(_T), "ChangeTurf", [T("/turf/open/space")]);
			}
		}
	}
	return live(f.dot);
}, true);
