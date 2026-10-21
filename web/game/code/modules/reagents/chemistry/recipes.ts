// From code/modules/reagents/chemistry/recipes.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2330, "/datum/chemical_reaction", "/datum", {
	name: null,
	id: null,
	required_container: null,
	required_other: 0,
	secondary: 0,
	mob_react: 0,
	required_temp: 0,
	is_cold_recipe: 0,
	mix_message: "The solution begins to bubble.",
	mix_sound: rt.rsc("sound/effects/bubbles.ogg"),
	results: null,
	required_reagents: null,
	required_catalysts: null,
});

// /datum/chemical_reaction/proc/<init>  (code/modules/reagents/chemistry/recipes.dm:4)
rt.def("/datum/chemical_reaction/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "results", rt.new_(f, T("/list"), []));
	$0 = $0;
	rt.setSv(f, "required_reagents", rt.new_(f, T("/list"), []));
	$0 = $0;
	rt.setSv(f, "required_catalysts", rt.new_(f, T("/list"), []));
	return f.dot;
});

// /datum/chemical_reaction/proc/chemical_mob_spawn  (code/modules/reagents/chemistry/recipes.dm:27)  may sleep
rt.def("/datum/chemical_reaction/proc/chemical_mob_spawn", function* chemical_mob_spawn(f: Frame, holder: Value, amount_to_spawn: Value, reaction_name: Value, mob_faction: Value) {
	let _T: Value = null, SA: Value = null, A: Value = null, _T_1: Value = null, my_area: Value = null, message: Value = null, M: Value = null, C: Value = null, i: Value = null, chosen: Value = null, spawnloc: Value = null, C_8: Value = null, j: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [holder, amount_to_spawn, reaction_name, mob_faction, _T, SA, A, _T_1, my_area, message, M, C, i, chosen, spawnloc, C_8, j, $0, $1, $2, $e];
	if (live(mob_faction) === null) {
		mob_faction = "chemicalsummon";
	}
	if (!(truthy(live(holder)) && truthy(rt.fv(f, "my_atom", live(holder))))) return f.dot;
	if ((rt.le(rt.len(f, rt.gl("chemical_mob_spawn_meancritters")), 0) || rt.le(rt.len(f, rt.gl("chemical_mob_spawn_nicecritters")), 0))) {
		_T = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/typesof"), null, [T("/mob/living/simple_animal")])));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			$0 = rt.initial(f, (SA = live(_T)), "gold_core_spawnable");
			if ($0 === 1) {
				rt.modGl("chemical_mob_spawn_meancritters", live(_T), add);
			} else if ($0 === 2) {
				rt.modGl("chemical_mob_spawn_nicecritters", live(_T), add);
			}
		}
		rt.endFor(f, 0);
	}
	A = rt.fv(f, "my_atom", live(holder));
	_T_1 = rt.getStep(f, live(A), 0);
	my_area = (yield* g.call(f, P("/proc/get_area"), null, [live(_T_1)]));
	$0 = live(reaction_name);
	$1 = rt.fv(f, "name", live(my_area));
	if (truthy(live(_T_1))) {
		$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T_1)), rt.fv(f, "y", live(_T_1)), rt.fv(f, "z", live(_T_1))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T_1)), rt.fv(f, "y", live(_T_1)), rt.fv(f, "z", live(_T_1))])]);
	} else {
		$2 = "nonexistent location";
	}
	message = fmt("A ＀ reaction has occurred in ＀ ＀", [$0, $1, fmt("＀", [$2])]);
	message = rt.modify(live(message), fmt(" (<A HREF='?_src_=vars;Vars=＃'>VV</A>)", [live(A)]), add);
	if (truthy((M = (yield* g.call(f, P("/proc/get"), null, [live(A), T("/mob")]))))) {
		message = rt.modify(live(message), fmt(" - Carried By: ＀", [fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(M)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(M)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(M)])])]), add);
	} else {
		if (truthy(rt.fv(f, "fingerprintslast", live(A)))) {
			$0 = rt.fv(f, "fingerprintslast", live(A));
		} else {
			$0 = "N/A";
		}
		message = rt.modify(live(message), fmt(" - Last Fingerprint: ＀", [$0]), add);
	}
	yield* g.call(f, P("/proc/message_admins"), null, [live(message), 0, 1]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0), rt.rsc("sound/effects/phasein.ogg"), 100, 1]);
	C = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0), null])), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		yield* g.callName(f, live(C), "flash_act", []);
	}
	rt.endFor(f, 0);
	i = null;
	i = 1;
	while (rt.le(live(i), live(amount_to_spawn))) {
		chosen = null;
		if (isEqual(live(reaction_name), "Friendly Gold Slime")) {
			chosen = rt.op(f, "PickUnweighted", [1], [rt.gl("chemical_mob_spawn_nicecritters")]);
		} else {
			chosen = rt.op(f, "PickUnweighted", [1], [rt.gl("chemical_mob_spawn_meancritters")]);
		}
		spawnloc = rt.getStep(f, rt.fv(f, "my_atom", live(holder)), 0);
		(rt.modField(f, (C_8 = (yield* g.new_(f, live(chosen), [live(spawnloc)]))), "faction", live(mob_faction), rt.bitOr));
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			j = null;
			j = 1;
			while (rt.le(live(j), (yield* g.call(f, P("/proc/rand"), null, [1, 3])))) {
				yield* g.call(f, P("/proc/step"), null, [live(C_8), rt.op(f, "PickUnweighted", [4], [1, 2, 4, 8])]);
				j = rt.inc(live(j), 1);
			}
		}
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true, { argTypes: [{ path: "/datum/reagents" }, {  }, {  }, {  }] });

// /datum/chemical_reaction/proc/goonchem_vortex  (code/modules/reagents/chemistry/recipes.dm:68)  may sleep
rt.def("/datum/chemical_reaction/proc/goonchem_vortex", function* goonchem_vortex(f: Frame, _T: Value, setting_type: Value, range: Value) {
	let X: Value = null, distance: Value = null, moving_power: Value = null, throw_target: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [_T, setting_type, range, X, distance, moving_power, throw_target, i, $e];
	X = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [live(range), live(_T)])), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (truthy((rt.istype(live(X), T("/obj/effect")) ? 1 : 0))) {
			continue;
		}
		if (!truthy(rt.fv(f, "anchored", live(X)))) {
			distance = (yield* g.call(f, P("/proc/get_dist"), null, [live(X), live(_T)]));
			if (rt.gt((moving_power = (yield* g.call(f, P("/proc/max"), null, [subtract(live(range), live(distance)), 1]))), 2)) {
				if (truthy(live(setting_type))) {
					throw_target = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(X), rt.getDir(f, live(X), (yield* g.call(f, P("/proc/get_step_away"), null, [live(X), live(_T)])))]));
					yield* g.callName(f, live(X), "throw_at", [live(throw_target), live(moving_power), 1]);
				} else {
					yield* g.callName(f, live(X), "throw_at", [live(_T), live(moving_power), 1]);
				}
			} else {
				rt.spawnTail(f, 0, "/datum/chemical_reaction/proc/goonchem_vortex: spawn at modules/reagents/chemistry/recipes.dm:81", _T, setting_type, range, X, distance, moving_power, throw_target, i);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// a spawn(0) body of /datum/chemical_reaction/proc/goonchem_vortex, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/chemical_reaction/proc/goonchem_vortex: spawn at modules/reagents/chemistry/recipes.dm:81", function* (f: Frame, _T: Value, setting_type: Value, range: Value, X: Value, distance: Value, moving_power: Value, throw_target: Value, i: Value) {
	f.vars = () => [_T, setting_type, range, X, distance, moving_power, throw_target, i];
	if (truthy(live(setting_type))) {
		i = null;
		i = 0;
		while (rt.lt(live(i), live(moving_power))) {
			yield* g.call(f, P("/proc/sleep"), null, [2]);
			if (!truthy((yield* g.call(f, P("/proc/step_away"), null, [live(X), live(_T)])))) {
				break;
			}
			i = rt.inc(live(i), 1);
		}
	} else {
		i = null;
		i = 0;
		while (rt.lt(live(i), live(moving_power))) {
			yield* g.call(f, P("/proc/sleep"), null, [2]);
			if (!truthy((yield* g.call(f, P("/proc/step_towards"), null, [live(X), live(_T)])))) {
				break;
			}
			i = rt.inc(live(i), 1);
		}
	}
	return null;
});
