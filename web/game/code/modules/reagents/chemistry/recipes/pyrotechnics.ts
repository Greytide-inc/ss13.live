// From code/modules/reagents/chemistry/recipes/pyrotechnics.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2561, "/datum/chemical_reaction/reagent_explosion", "/datum/chemical_reaction", {
	strengthdiv: 10,
	modifier: 0,
	name: "Generic explosive",
	id: "reagent_explosion",
});

// /datum/chemical_reaction/reagent_explosion/proc/on_reaction  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:8)  may sleep
rt.def("/datum/chemical_reaction/reagent_explosion/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let _T: Value = null, A: Value = null, inside_msg: Value = null, M: Value = null, lastkey: Value = null, touch_msg: Value = null, toucher: Value = null, e: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [holder, created_volume, _T, A, inside_msg, M, lastkey, touch_msg, toucher, e, $0, $1, $2];
	_T = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0);
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(_T)]));
	inside_msg = null;
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.fv(f, "my_atom", live(holder))])))) {
		inside_msg = fmt(" inside ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [(M = rt.fv(f, "my_atom", live(holder)))]))]);
	}
	lastkey = rt.gv(f, "fingerprintslast", rt.fv(f, "my_atom", live(holder)));
	touch_msg = "N/A";
	if (truthy(live(lastkey))) {
		touch_msg = fmt("＀", [fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [(toucher = (yield* g.call(f, P("/proc/get_mob_by_key"), null, [live(lastkey)])))])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(toucher)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(toucher)])])]);
	}
	$0 = live(A);
	if (truthy(live(_T))) {
		$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
	} else {
		$1 = "nonexistent location";
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("Reagent explosion reaction occurred at ＀ ＀＀. Last Fingerprint: ＀.", [$0, fmt("＀", [$1]), live(inside_msg), live(touch_msg)])]);
	$0 = live(A);
	$1 = fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]);
	if (truthy(live(lastkey))) {
		$2 = live(lastkey);
	} else {
		$2 = "N/A";
	}
	yield* g.call(f, P("/proc/log_game"), null, [fmt("Reagent explosion reaction occurred at ＀ ＀. Last Fingerprint: ＀.", [$0, $1, $2])]);
	yield* g.callName(f, (e = (yield* g.new_(f, T("/datum/effect_system/reagents_explosion"), []))), "set_up", [add(rt.sv(f, "modifier"), (yield* g.call(f, P("/proc/round"), null, [divide(live(created_volume), rt.sv(f, "strengthdiv")), 1]))), live(_T), 0, 0]);
	yield* g.callName(f, live(e), "start", []);
	yield* g.callName(f, live(holder), "clear_reagents", []);
	return f.dot;
}, true);

rt.type(2562, "/datum/chemical_reaction/reagent_explosion/nitroglycerin", "/datum/chemical_reaction/reagent_explosion", {
	name: "Nitroglycerin",
	id: "nitroglycerin",
	strengthdiv: 2,
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/reagent_explosion/nitroglycerin/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:30)
rt.def("/datum/chemical_reaction/reagent_explosion/nitroglycerin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["nitroglycerin", 2]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["glycerol", 1, "facid", 1, "sacid", 1]));
	return f.dot;
});

// /datum/chemical_reaction/reagent_explosion/nitroglycerin/proc/on_reaction  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:35)  may sleep
rt.def("/datum/chemical_reaction/reagent_explosion/nitroglycerin/proc/on_reaction", function* on_reaction(f: Frame) {
	if (truthy((yield* g.callName(f, live(f.args[0]), "has_reagent", ["stabilizing_agent"])))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "remove_reagent", ["nitroglycerin", multiply(live(f.args[1]), 2)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder", "created_volume"] });

rt.type(2563, "/datum/chemical_reaction/reagent_explosion/nitroglycerin_explosion", "/datum/chemical_reaction/reagent_explosion", {
	name: "Nitroglycerin explosion",
	id: "nitroglycerin_explosion",
	required_temp: 474,
	strengthdiv: 2,
	required_reagents: null,
});

// /datum/chemical_reaction/reagent_explosion/nitroglycerin_explosion/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:43)
rt.def("/datum/chemical_reaction/reagent_explosion/nitroglycerin_explosion/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["nitroglycerin", 1]));
	return f.dot;
});

rt.type(2564, "/datum/chemical_reaction/reagent_explosion/potassium_explosion", "/datum/chemical_reaction/reagent_explosion", {
	name: "Explosion",
	id: "potassium_explosion",
	strengthdiv: 10,
	required_reagents: null,
});

// /datum/chemical_reaction/reagent_explosion/potassium_explosion/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:51)
rt.def("/datum/chemical_reaction/reagent_explosion/potassium_explosion/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["water", 1, "potassium", 1]));
	return f.dot;
});

rt.type(2565, "/datum/chemical_reaction/reagent_explosion/potassium_explosion/holyboom", "/datum/chemical_reaction/reagent_explosion/potassium_explosion", {
	name: "Holy Explosion",
	id: "holyboom",
	required_reagents: null,
});

// /datum/chemical_reaction/reagent_explosion/potassium_explosion/holyboom/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:57)
rt.def("/datum/chemical_reaction/reagent_explosion/potassium_explosion/holyboom/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["holywater", 1, "potassium", 1]));
	return f.dot;
});

// /datum/chemical_reaction/reagent_explosion/potassium_explosion/holyboom/proc/on_reaction  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:60)  may sleep
rt.def("/datum/chemical_reaction/reagent_explosion/potassium_explosion/holyboom/proc/on_reaction", function* on_reaction(f: Frame) {
	let R: Value = null, deity: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [R, deity, C, $e];
	if (rt.ge(live(f.args[1]), 150)) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0), rt.rsc("sound/effects/pray.ogg"), 80, 0, (yield* g.call(f, P("/proc/round"), null, [divide(live(f.args[1]), 48)]))]);
		rt.setSv(f, "strengthdiv", 8);
		R = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/get_hearers_in_view"), null, [7, rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)])), T("/mob/living/simple_animal/revenant"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			deity = null;
			if (truthy(rt.fv(f, "deity", rt.gl("SSreligion")))) {
				deity = rt.fv(f, "deity", rt.gl("SSreligion"));
			} else {
				deity = "Christ";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(R), fmt("<span class='userdanger'>The power of ＀ compels you!</span>", [live(deity)])]);
			yield* g.callName(f, live(R), "stun", [20]);
			yield* g.callName(f, live(R), "reveal", [100]);
			yield* g.callName(f, live(R), "adjustHealth", [50]);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/sleep"), null, [20]);
		C = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/get_hearers_in_view"), null, [(yield* g.call(f, P("/proc/round"), null, [divide(live(f.args[1]), 48), 1])), rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0)])), T("/mob/living/carbon"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(C)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(C), "<span class='userdanger'>The divine explosion sears you!</span>"]);
				yield* g.callName(f, live(C), "Knockdown", [40]);
				yield* g.callName(f, live(C), "adjust_fire_stacks", [5]);
				yield* g.callName(f, live(C), "IgniteMob", []);
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder", "created_volume"] });

rt.type(2572, "/datum/chemical_reaction/blackpowder", "/datum/chemical_reaction", {
	name: "Black Powder",
	id: "blackpowder",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/blackpowder/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:86)
rt.def("/datum/chemical_reaction/blackpowder/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["blackpowder", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["saltpetre", 1, "charcoal", 1, "sulfur", 1]));
	return f.dot;
});

rt.type(2566, "/datum/chemical_reaction/reagent_explosion/blackpowder_explosion", "/datum/chemical_reaction/reagent_explosion", {
	name: "Black Powder Kaboom",
	id: "blackpowder_explosion",
	required_temp: 474,
	strengthdiv: 6,
	modifier: 1,
	mix_message: "<span class='boldannounce'>Sparks start flying around the black powder!</span>",
	required_reagents: null,
});

// /datum/chemical_reaction/reagent_explosion/blackpowder_explosion/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:92)
rt.def("/datum/chemical_reaction/reagent_explosion/blackpowder_explosion/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["blackpowder", 1]));
	return f.dot;
});

// /datum/chemical_reaction/reagent_explosion/blackpowder_explosion/proc/on_reaction  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:99)  may sleep
rt.def("/datum/chemical_reaction/reagent_explosion/blackpowder_explosion/proc/on_reaction", function* on_reaction(f: Frame) {
	yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [50, 100]))]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder", "created_volume"] });

rt.type(2573, "/datum/chemical_reaction/thermite", "/datum/chemical_reaction", {
	name: "Thermite",
	id: "thermite",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/thermite/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:105)
rt.def("/datum/chemical_reaction/thermite/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["thermite", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["aluminium", 1, "iron", 1, "oxygen", 1]));
	return f.dot;
});

rt.type(2574, "/datum/chemical_reaction/emp_pulse", "/datum/chemical_reaction", {
	name: "EMP Pulse",
	id: "emp_pulse",
	required_reagents: null,
});

// /datum/chemical_reaction/emp_pulse/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:111)
rt.def("/datum/chemical_reaction/emp_pulse/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["uranium", 1, "iron", 1]));
	return f.dot;
});

// /datum/chemical_reaction/emp_pulse/proc/on_reaction  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:114)  may sleep
rt.def("/datum/chemical_reaction/emp_pulse/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = null;
	f.vars = () => [holder, created_volume, location];
	yield* g.call(f, P("/proc/empulse"), null, [(location = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0)), (yield* g.call(f, P("/proc/round"), null, [divide(live(created_volume), 12)])), (yield* g.call(f, P("/proc/round"), null, [divide(live(created_volume), 7)])), 1]);
	yield* g.callName(f, live(holder), "clear_reagents", []);
	return f.dot;
}, true);

rt.type(2575, "/datum/chemical_reaction/stabilizing_agent", "/datum/chemical_reaction", {
	name: "stabilizing_agent",
	id: "stabilizing_agent",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/stabilizing_agent/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:123)
rt.def("/datum/chemical_reaction/stabilizing_agent/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["stabilizing_agent", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["iron", 1, "oxygen", 1, "hydrogen", 1]));
	return f.dot;
});

rt.type(2576, "/datum/chemical_reaction/clf3", "/datum/chemical_reaction", {
	name: "Chlorine Trifluoride",
	id: "clf3",
	required_temp: 424,
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/clf3/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:129)
rt.def("/datum/chemical_reaction/clf3/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["clf3", 4]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["chlorine", 1, "fluorine", 3]));
	return f.dot;
});

// /datum/chemical_reaction/clf3/proc/on_reaction  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:134)  may sleep
rt.def("/datum/chemical_reaction/clf3/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let _T: Value = null, turf: Value = null;
	let $e: any;
	f.vars = () => [holder, created_volume, _T, turf, $e];
	_T = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0);
	turf = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(_T)])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		turf = $e;
		yield* g.new_(f, T("/obj/effect/hotspot"), [live(turf)]);
	}
	rt.endFor(f, 0);
	rt.setFv(f, "chem_temp", live(holder), 1000);
	return f.dot;
}, true);

rt.type(2567, "/datum/chemical_reaction/reagent_explosion/methsplosion", "/datum/chemical_reaction/reagent_explosion", {
	name: "Meth explosion",
	id: "methboom1",
	required_temp: 380,
	strengthdiv: 6,
	modifier: 1,
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/reagent_explosion/methsplosion/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:142)
rt.def("/datum/chemical_reaction/reagent_explosion/methsplosion/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["methboom1", 1]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["methamphetamine", 1]));
	return f.dot;
});

// /datum/chemical_reaction/reagent_explosion/methsplosion/proc/on_reaction  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:149)  may sleep
rt.def("/datum/chemical_reaction/reagent_explosion/methsplosion/proc/on_reaction", function* on_reaction(f: Frame) {
	let _T: Value = null, turf: Value = null;
	let $e: any;
	f.vars = () => [_T, turf, $e];
	_T = rt.getStep(f, rt.fv(f, "my_atom", live(f.args[0])), 0);
	turf = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(_T)])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		turf = $e;
		yield* g.new_(f, T("/obj/effect/hotspot"), [live(turf)]);
	}
	rt.endFor(f, 0);
	rt.setFv(f, "chem_temp", live(f.args[0]), 1000);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder", "created_volume"] });

rt.type(2568, "/datum/chemical_reaction/reagent_explosion/methsplosion/methboom2", "/datum/chemical_reaction/reagent_explosion/methsplosion", {
	required_temp: 300,
	required_reagents: null,
	results: null,
});

// /datum/chemical_reaction/reagent_explosion/methsplosion/methboom2/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:156)
rt.def("/datum/chemical_reaction/reagent_explosion/methsplosion/methboom2/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["diethylamine", 1, "iodine", 1, "phosphorus", 1, "hydrogen", 1]));
	rt.setSv(f, "results", rt.alist(f, ["methboom1", 4]));
	return f.dot;
});

rt.type(2577, "/datum/chemical_reaction/sorium", "/datum/chemical_reaction", {
	name: "Sorium",
	id: "sorium",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/sorium/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:163)
rt.def("/datum/chemical_reaction/sorium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["sorium", 4]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["mercury", 1, "oxygen", 1, "nitrogen", 1, "carbon", 1]));
	return f.dot;
});

// /datum/chemical_reaction/sorium/proc/on_reaction  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:167)  may sleep
rt.def("/datum/chemical_reaction/sorium/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let _T: Value = null, range: Value = null;
	f.vars = () => [holder, created_volume, _T, range];
	if (truthy((yield* g.callName(f, live(holder), "has_reagent", ["stabilizing_agent"])))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(holder), "remove_reagent", ["sorium", multiply(live(created_volume), 4)]);
	_T = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0);
	range = (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [rt.op(f, "Sqrt", [], [multiply(live(created_volume), 4)]), 6]))]));
	yield* g.srcCall(f, "goonchem_vortex", live(_T), 1, live(range));
	return f.dot;
}, true);

rt.type(2578, "/datum/chemical_reaction/sorium_vortex", "/datum/chemical_reaction", {
	name: "sorium_vortex",
	id: "sorium_vortex",
	required_temp: 474,
	required_reagents: null,
});

// /datum/chemical_reaction/sorium_vortex/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:177)
rt.def("/datum/chemical_reaction/sorium_vortex/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["sorium", 1]));
	return f.dot;
});

// /datum/chemical_reaction/sorium_vortex/proc/on_reaction  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:181)  may sleep
rt.def("/datum/chemical_reaction/sorium_vortex/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let _T: Value = null, range: Value = null;
	f.vars = () => [holder, created_volume, _T, range];
	_T = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0);
	range = (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [rt.op(f, "Sqrt", [], [live(created_volume)]), 6]))]));
	yield* g.srcCall(f, "goonchem_vortex", live(_T), 1, live(range));
	return f.dot;
}, true);

rt.type(2579, "/datum/chemical_reaction/liquid_dark_matter", "/datum/chemical_reaction", {
	name: "Liquid Dark Matter",
	id: "liquid_dark_matter",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/liquid_dark_matter/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:188)
rt.def("/datum/chemical_reaction/liquid_dark_matter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["liquid_dark_matter", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["stable_plasma", 1, "radium", 1, "carbon", 1]));
	return f.dot;
});

// /datum/chemical_reaction/liquid_dark_matter/proc/on_reaction  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:192)  may sleep
rt.def("/datum/chemical_reaction/liquid_dark_matter/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let _T: Value = null, range: Value = null;
	f.vars = () => [holder, created_volume, _T, range];
	if (truthy((yield* g.callName(f, live(holder), "has_reagent", ["stabilizing_agent"])))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(holder), "remove_reagent", ["liquid_dark_matter", multiply(live(created_volume), 3)]);
	_T = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0);
	range = (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [rt.op(f, "Sqrt", [], [multiply(live(created_volume), 3)]), 6]))]));
	yield* g.srcCall(f, "goonchem_vortex", live(_T), 0, live(range));
	return f.dot;
}, true);

rt.type(2580, "/datum/chemical_reaction/ldm_vortex", "/datum/chemical_reaction", {
	name: "LDM Vortex",
	id: "ldm_vortex",
	required_temp: 474,
	required_reagents: null,
});

// /datum/chemical_reaction/ldm_vortex/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:202)
rt.def("/datum/chemical_reaction/ldm_vortex/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["liquid_dark_matter", 1]));
	return f.dot;
});

// /datum/chemical_reaction/ldm_vortex/proc/on_reaction  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:206)  may sleep
rt.def("/datum/chemical_reaction/ldm_vortex/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let _T: Value = null, range: Value = null;
	f.vars = () => [holder, created_volume, _T, range];
	_T = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0);
	range = (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [rt.op(f, "Sqrt", [], [divide(live(created_volume), 2)]), 6]))]));
	yield* g.srcCall(f, "goonchem_vortex", live(_T), 0, live(range));
	return f.dot;
}, true);

rt.type(2581, "/datum/chemical_reaction/flash_powder", "/datum/chemical_reaction", {
	name: "Flash powder",
	id: "flash_powder",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/flash_powder/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:213)
rt.def("/datum/chemical_reaction/flash_powder/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["flash_powder", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["aluminium", 1, "potassium", 1, "sulfur", 1]));
	return f.dot;
});

// /datum/chemical_reaction/flash_powder/proc/on_reaction  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:217)  may sleep
rt.def("/datum/chemical_reaction/flash_powder/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [holder, created_volume, location, C, $e];
	if (truthy((yield* g.callName(f, live(holder), "has_reagent", ["stabilizing_agent"])))) {
		return live(f.dot);
	}
	location = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0);
	yield* g.call(f, P("/proc/do_sparks"), null, [2, 1, live(location)]);
	C = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/get_hearers_in_view"), null, [divide(live(created_volume), 3), live(location)])), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (truthy((yield* g.callName(f, live(C), "flash_act", [])))) {
			if (rt.lt((yield* g.call(f, P("/proc/get_dist"), null, [live(C), live(location)])), 4)) {
				yield* g.callName(f, live(C), "Knockdown", [60]);
			} else {
				yield* g.callName(f, live(C), "Stun", [100]);
			}
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(holder), "remove_reagent", ["flash_powder", multiply(live(created_volume), 3)]);
	return f.dot;
}, true);

rt.type(2582, "/datum/chemical_reaction/flash_powder_flash", "/datum/chemical_reaction", {
	name: "Flash powder activation",
	id: "flash_powder_flash",
	required_temp: 374,
	required_reagents: null,
});

// /datum/chemical_reaction/flash_powder_flash/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:232)
rt.def("/datum/chemical_reaction/flash_powder_flash/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["flash_powder", 1]));
	return f.dot;
});

// /datum/chemical_reaction/flash_powder_flash/proc/on_reaction  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:236)  may sleep
rt.def("/datum/chemical_reaction/flash_powder_flash/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [holder, created_volume, location, C, $e];
	location = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0);
	yield* g.call(f, P("/proc/do_sparks"), null, [2, 1, live(location)]);
	C = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/get_hearers_in_view"), null, [divide(live(created_volume), 10), live(location)])), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (truthy((yield* g.callName(f, live(C), "flash_act", [])))) {
			if (rt.lt((yield* g.call(f, P("/proc/get_dist"), null, [live(C), live(location)])), 4)) {
				yield* g.callName(f, live(C), "Knockdown", [60]);
			} else {
				yield* g.callName(f, live(C), "Stun", [100]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(2583, "/datum/chemical_reaction/smoke_powder", "/datum/chemical_reaction", {
	name: "smoke_powder",
	id: "smoke_powder",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/smoke_powder/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:248)
rt.def("/datum/chemical_reaction/smoke_powder/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["smoke_powder", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["potassium", 1, "sugar", 1, "phosphorus", 1]));
	return f.dot;
});

// /datum/chemical_reaction/smoke_powder/proc/on_reaction  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:252)  may sleep
rt.def("/datum/chemical_reaction/smoke_powder/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let smoke_radius: Value = null, location: Value = null, S: Value = null;
	f.vars = () => [holder, created_volume, smoke_radius, location, S];
	if (truthy((yield* g.callName(f, live(holder), "has_reagent", ["stabilizing_agent"])))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(holder), "remove_reagent", ["smoke_powder", multiply(live(created_volume), 3)]);
	smoke_radius = (yield* g.call(f, P("/proc/round"), null, [rt.op(f, "Sqrt", [], [multiply(live(created_volume), 1.5)]), 1]));
	location = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0);
	yield* g.callName(f, (S = (yield* g.new_(f, T("/datum/effect_system/smoke_spread/chem"), []))), "attach", [live(location)]);
	yield* g.call(f, P("/proc/playsound"), null, [live(location), rt.rsc("sound/effects/smoke.ogg"), 50, 1, -3]);
	if (truthy(live(S))) {
		yield* g.callName(f, live(S), "set_up", [live(holder), live(smoke_radius), live(location), 0]);
		yield* g.callName(f, live(S), "start", []);
	}
	if (!(truthy(live(holder)) && truthy(rt.fv(f, "my_atom", live(holder))))) return f.dot;
	yield* g.callName(f, live(holder), "clear_reagents", []);
	return f.dot;
}, true);

rt.type(2584, "/datum/chemical_reaction/smoke_powder_smoke", "/datum/chemical_reaction", {
	name: "smoke_powder_smoke",
	id: "smoke_powder_smoke",
	required_temp: 374,
	secondary: 1,
	mob_react: 1,
	required_reagents: null,
});

// /datum/chemical_reaction/smoke_powder_smoke/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:269)
rt.def("/datum/chemical_reaction/smoke_powder_smoke/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["smoke_powder", 1]));
	return f.dot;
});

// /datum/chemical_reaction/smoke_powder_smoke/proc/on_reaction  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:275)  may sleep
rt.def("/datum/chemical_reaction/smoke_powder_smoke/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = null, smoke_radius: Value = null, S: Value = null;
	f.vars = () => [holder, created_volume, location, smoke_radius, S];
	location = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0);
	smoke_radius = (yield* g.call(f, P("/proc/round"), null, [rt.op(f, "Sqrt", [], [divide(live(created_volume), 2)]), 1]));
	yield* g.callName(f, (S = (yield* g.new_(f, T("/datum/effect_system/smoke_spread/chem"), []))), "attach", [live(location)]);
	yield* g.call(f, P("/proc/playsound"), null, [live(location), rt.rsc("sound/effects/smoke.ogg"), 50, 1, -3]);
	if (truthy(live(S))) {
		yield* g.callName(f, live(S), "set_up", [live(holder), live(smoke_radius), live(location), 0]);
		yield* g.callName(f, live(S), "start", []);
	}
	if (!(truthy(live(holder)) && truthy(rt.fv(f, "my_atom", live(holder))))) return f.dot;
	yield* g.callName(f, live(holder), "clear_reagents", []);
	return f.dot;
}, true);

rt.type(2585, "/datum/chemical_reaction/sonic_powder", "/datum/chemical_reaction", {
	name: "sonic_powder",
	id: "sonic_powder",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/sonic_powder/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:289)
rt.def("/datum/chemical_reaction/sonic_powder/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["sonic_powder", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["oxygen", 1, "cola", 1, "phosphorus", 1]));
	return f.dot;
});

// /datum/chemical_reaction/sonic_powder/proc/on_reaction  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:293)  may sleep
rt.def("/datum/chemical_reaction/sonic_powder/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [holder, created_volume, location, C, $e];
	if (truthy((yield* g.callName(f, live(holder), "has_reagent", ["stabilizing_agent"])))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(holder), "remove_reagent", ["sonic_powder", multiply(live(created_volume), 3)]);
	yield* g.call(f, P("/proc/playsound"), null, [(location = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0)), rt.rsc("sound/effects/bang.ogg"), 25, 1]);
	C = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/get_hearers_in_view"), null, [divide(live(created_volume), 3), live(location)])), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		yield* g.callName(f, live(C), "soundbang_act", [1, 100, (yield* g.call(f, P("/proc/rand"), null, [0, 5]))]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(2586, "/datum/chemical_reaction/sonic_powder_deafen", "/datum/chemical_reaction", {
	name: "sonic_powder_deafen",
	id: "sonic_powder_deafen",
	required_temp: 374,
	required_reagents: null,
});

// /datum/chemical_reaction/sonic_powder_deafen/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:304)
rt.def("/datum/chemical_reaction/sonic_powder_deafen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["sonic_powder", 1]));
	return f.dot;
});

// /datum/chemical_reaction/sonic_powder_deafen/proc/on_reaction  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:308)  may sleep
rt.def("/datum/chemical_reaction/sonic_powder_deafen/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let location: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [holder, created_volume, location, C, $e];
	yield* g.call(f, P("/proc/playsound"), null, [(location = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0)), rt.rsc("sound/effects/bang.ogg"), 25, 1]);
	C = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/get_hearers_in_view"), null, [divide(live(created_volume), 10), live(location)])), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		yield* g.callName(f, live(C), "soundbang_act", [1, 100, (yield* g.call(f, P("/proc/rand"), null, [0, 5]))]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(2587, "/datum/chemical_reaction/phlogiston", "/datum/chemical_reaction", {
	name: "phlogiston",
	id: "phlogiston",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/phlogiston/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:316)
rt.def("/datum/chemical_reaction/phlogiston/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["phlogiston", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["phosphorus", 1, "sacid", 1, "stable_plasma", 1]));
	return f.dot;
});

// /datum/chemical_reaction/phlogiston/proc/on_reaction  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:320)  may sleep
rt.def("/datum/chemical_reaction/phlogiston/proc/on_reaction", function* on_reaction(f: Frame, holder: Value, created_volume: Value) {
	let _T: Value = null;
	f.vars = () => [holder, created_volume, _T];
	if (truthy((yield* g.callName(f, live(holder), "has_reagent", ["stabilizing_agent"])))) {
		return live(f.dot);
	}
	if (truthy((rt.istype((_T = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0)), T("/turf/open")) ? 1 : 0))) {
		yield* g.callName(f, live(_T), "atmos_spawn_air", [fmt("plasma=＀;TEMP=1000", [live(created_volume)])]);
	}
	yield* g.callName(f, live(holder), "clear_reagents", []);
	return live(f.dot);
}, true);

rt.type(2588, "/datum/chemical_reaction/napalm", "/datum/chemical_reaction", {
	name: "Napalm",
	id: "napalm",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/napalm/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:331)
rt.def("/datum/chemical_reaction/napalm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["napalm", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["oil", 1, "welding_fuel", 1, "ethanol", 1]));
	return f.dot;
});

rt.type(2589, "/datum/chemical_reaction/cryostylane", "/datum/chemical_reaction", {
	name: "cryostylane",
	id: "cryostylane",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/cryostylane/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:337)
rt.def("/datum/chemical_reaction/cryostylane/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["cryostylane", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["water", 1, "stable_plasma", 1, "nitrogen", 1]));
	return f.dot;
});

// /datum/chemical_reaction/cryostylane/proc/on_reaction  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:341)
rt.def("/datum/chemical_reaction/cryostylane/proc/on_reaction", function on_reaction(f: Frame, holder: Value, created_volume: Value) {
	rt.setFv(f, "chem_temp", live(holder), 20);
	return live(f.dot);
});

rt.type(2590, "/datum/chemical_reaction/pyrosium", "/datum/chemical_reaction", {
	name: "pyrosium",
	id: "pyrosium",
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/pyrosium/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:348)
rt.def("/datum/chemical_reaction/pyrosium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["pyrosium", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["stable_plasma", 1, "radium", 1, "phosphorus", 1]));
	return f.dot;
});

// /datum/chemical_reaction/pyrosium/proc/on_reaction  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:352)
rt.def("/datum/chemical_reaction/pyrosium/proc/on_reaction", function on_reaction(f: Frame, holder: Value, created_volume: Value) {
	rt.setFv(f, "chem_temp", live(holder), 20);
	return live(f.dot);
});

rt.type(2591, "/datum/chemical_reaction/teslium", "/datum/chemical_reaction", {
	name: "Teslium",
	id: "teslium",
	mix_message: "<span class='danger'>A jet of sparks flies from the mixture as it merges into a flickering slurry.</span>",
	required_temp: 400,
	results: null,
	required_reagents: null,
});

// /datum/chemical_reaction/teslium/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:358)
rt.def("/datum/chemical_reaction/teslium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.alist(f, ["teslium", 3]));
	rt.setSv(f, "required_reagents", rt.alist(f, ["stable_plasma", 1, "silver", 1, "blackpowder", 1]));
	return f.dot;
});

rt.type(2569, "/datum/chemical_reaction/reagent_explosion/teslium_lightning", "/datum/chemical_reaction/reagent_explosion", {
	name: "Teslium Destabilization",
	id: "teslium_lightning",
	strengthdiv: 100,
	modifier: -100,
	mix_message: "<span class='boldannounce'>The teslium starts to spark as electricity arcs away from it!</span>",
	mix_sound: rt.rsc("sound/machines/defib_zap.ogg"),
	required_reagents: null,
	results: null,
});

// /datum/chemical_reaction/reagent_explosion/teslium_lightning/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:366)
rt.def("/datum/chemical_reaction/reagent_explosion/teslium_lightning/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["teslium", 1, "water", 1]));
	rt.setSv(f, "results", rt.alist(f, ["destabilized_teslium", 1]));
	return f.dot;
});

// /datum/chemical_reaction/reagent_explosion/teslium_lightning/proc/on_reaction  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:374)  may sleep
rt.def("/datum/chemical_reaction/reagent_explosion/teslium_lightning/proc/on_reaction", function* on_reaction(f: Frame) {
	let T1: Value = null, T2: Value = null, T3: Value = null;
	f.vars = () => [T1, T2, T3];
	T1 = multiply(live(f.args[1]), 20);
	T2 = multiply(live(f.args[1]), 50);
	T3 = multiply(live(f.args[1]), 120);
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	if (rt.ge(live(f.args[1]), 75)) {
		yield* g.call(f, P("/proc/tesla_zap"), null, [rt.fv(f, "my_atom", live(f.args[0])), 7, live(T1)]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "my_atom", live(f.args[0])), rt.rsc("sound/machines/defib_zap.ogg"), 50, 1]);
		yield* g.call(f, P("/proc/sleep"), null, [15]);
	}
	if (rt.ge(live(f.args[1]), 40)) {
		yield* g.call(f, P("/proc/tesla_zap"), null, [rt.fv(f, "my_atom", live(f.args[0])), 7, live(T2)]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "my_atom", live(f.args[0])), rt.rsc("sound/machines/defib_zap.ogg"), 50, 1]);
		yield* g.call(f, P("/proc/sleep"), null, [15]);
	}
	if (rt.ge(live(f.args[1]), 10)) {
		yield* g.call(f, P("/proc/tesla_zap"), null, [rt.fv(f, "my_atom", live(f.args[0])), 7, live(T3)]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "my_atom", live(f.args[0])), rt.rsc("sound/machines/defib_zap.ogg"), 50, 1]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["holder", "created_volume"] });

rt.type(2570, "/datum/chemical_reaction/reagent_explosion/teslium_lightning/heat", "/datum/chemical_reaction/reagent_explosion/teslium_lightning", {
	id: "teslium_lightning2",
	required_temp: 474,
	required_reagents: null,
});

// /datum/chemical_reaction/reagent_explosion/teslium_lightning/heat/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:394)
rt.def("/datum/chemical_reaction/reagent_explosion/teslium_lightning/heat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["teslium", 1]));
	return f.dot;
});

rt.type(2571, "/datum/chemical_reaction/reagent_explosion/nitrous_oxide", "/datum/chemical_reaction/reagent_explosion", {
	name: "N2O explosion",
	id: "n2o_explosion",
	strengthdiv: 7,
	required_temp: 575,
	modifier: 1,
	required_reagents: null,
});

// /datum/chemical_reaction/reagent_explosion/nitrous_oxide/proc/<init>  (code/modules/reagents/chemistry/recipes/pyrotechnics.dm:399)
rt.def("/datum/chemical_reaction/reagent_explosion/nitrous_oxide/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "required_reagents", rt.alist(f, ["nitrous_oxide", 1]));
	return f.dot;
});
