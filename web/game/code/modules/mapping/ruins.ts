// From code/modules/mapping/ruins.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/seedRuins  (code/modules/mapping/ruins.dm:4)  may sleep
rt.def("/proc/seedRuins", function* seedRuins(f: Frame, z_levels: Value, budget: Value, whitelist: Value, potentialRuins: Value) {
	let zl: Value = null, _T: Value = null, overall_sanity: Value = null, ruins: Value = null, ruin: Value = null, sanity: Value = null, width_border: Value = null, height_border: Value = null, z_level: Value = null, _T_7: Value = null, valid: Value = null, check: Value = null, new_area: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [z_levels, budget, whitelist, potentialRuins, zl, _T, overall_sanity, ruins, ruin, sanity, width_border, height_border, z_level, _T_7, valid, check, new_area, R, $e];
	if (live(z_levels) === null) {
		z_levels = null;
	}
	if (live(budget) === null) {
		budget = 0;
	}
	if (live(whitelist) === null) {
		whitelist = T("/area/space");
	}
	if ((!truthy(live(z_levels)) || !truthy(rt.len(f, live(z_levels))))) {
		yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", ["No Z levels provided - Not generating ruins", "code/modules/mapping/ruins.dm", 5, live(f.src), live(f.usr)])]);
		return live(f.dot);
	}
	zl = null;
	rt.forList(f, 0, live(z_levels));
	while (($e = rt.next(f, 0)) !== undefined) {
		zl = $e;
		if (!truthy((_T = rt.locate(1, 1, live(zl))))) {
			yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", [fmt("Z level ＀ does not exist - Not generating ruins", [live(zl)]), "code/modules/mapping/ruins.dm", 11, live(f.src), live(f.usr)])]);
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	overall_sanity = 100;
	ruins = (yield* g.callName(f, live(potentialRuins), "Copy", []));
	loop50: while (true) {
		if (!(rt.gt(live(budget), 0) && rt.gt(live(overall_sanity), 0))) break;
		ruin = null;
		if ((truthy(live(ruins)) && truthy(rt.len(f, live(ruins))))) {
			ruin = rt.index(live(ruins), rt.op(f, "PickUnweighted", [1], [live(ruins)]));
		} else {
			yield* g.call(f, P("/proc/log_world"), null, [fmt("Ruin loader had no ruins to pick from with ＀ left to spend.", [live(budget)])]);
			break;
		}
		if (rt.gt(rt.fv(f, "cost", live(ruin)), live(budget))) {
			overall_sanity = rt.inc(live(overall_sanity), -1);
			continue;
		}
		sanity = 100;
		while (true) {
			if (!rt.gt(live(sanity), 0)) continue loop50;
			sanity = rt.inc(live(sanity), -1);
			width_border = add(22, (yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "width", live(ruin)), 2)])));
			height_border = add(22, (yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "height", live(ruin)), 2)])));
			z_level = rt.op(f, "PickUnweighted", [1], [live(z_levels)]);
			_T_7 = rt.locate((yield* g.call(f, P("/proc/rand"), null, [live(width_border), subtract(rt.fv(f, "maxx", rt.world()), live(width_border))])), (yield* g.call(f, P("/proc/rand"), null, [live(height_border), subtract(rt.fv(f, "maxy", rt.world()), live(height_border))])), live(z_level));
			valid = 1;
			check = null;
			rt.forList(f, 0, (yield* g.callName(f, live(ruin), "get_affected_turfs", [live(_T_7), 1])), T("/turf"));
			while (($e = rt.next(f, 0)) !== undefined) {
				check = $e;
				if (!truthy(rt.op(f, "IsType", [], [(new_area = (yield* g.call(f, P("/proc/get_area"), null, [live(check)]))), live(whitelist)]))) {
					valid = 0;
					break;
				}
			}
			rt.endFor(f, 0);
			if (truthy(live(valid))) break;
		}
		yield* g.call(f, P("/proc/log_world"), null, [fmt("Ruin \"＀\" placed at (＀, ＀, ＀)", [rt.fv(f, "name", live(ruin)), rt.fv(f, "x", live(_T_7)), rt.fv(f, "y", live(_T_7)), rt.fv(f, "z", live(_T_7))])]);
		yield* g.callName(f, (R = (yield* g.new_(f, T("/obj/effect/ruin_loader"), [live(_T_7)]))), "Load", [live(ruins), live(ruin)]);
		(budget = rt.modify(live(budget), rt.fv(f, "cost", live(ruin)), subtract));
		if (!truthy(rt.fv(f, "allow_duplicates", live(ruin)))) {
			(ruins = rt.modify(live(ruins), rt.fv(f, "name", live(ruin)), subtract));
		}
	}
	if (truthy(live(overall_sanity))) return f.dot;
	yield* g.call(f, P("/proc/log_world"), null, [fmt("Ruin loader gave up with ＀ left to spend.", [live(budget)])]);
	return f.dot;
}, true);

rt.type(12079, "/obj/effect/ruin_loader", "/obj/effect", {
	name: "random ruin",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "syndballoon",
	invisibility: 0,
});

// /obj/effect/ruin_loader/proc/Load  (code/modules/mapping/ruins.dm:70)  may sleep
rt.def("/obj/effect/ruin_loader/proc/Load", function* Load(f: Frame, potentialRuins: Value, template: Value) {
	let possible_ruins: Value = null, A: Value = null, _T: Value = null, central_turf: Value = null, i: Value = null, _T_3: Value = null, monster: Value = null, plant: Value = null, ruin: Value = null;
	let $e: any;
	f.vars = () => [potentialRuins, template, possible_ruins, A, _T, central_turf, i, _T_3, monster, plant, ruin, $e];
	possible_ruins = rt.list();
	A = null;
	rt.forList(f, 0, live(potentialRuins));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (!truthy(rt.gv(f, "loaded", (_T = rt.index(live(potentialRuins), live(A)))))) {
			possible_ruins = rt.modify(live(possible_ruins), live(_T), add);
		}
	}
	rt.endFor(f, 0);
	if ((!truthy(live(template)) && truthy(rt.len(f, live(possible_ruins))))) {
		template = (yield* g.call(f, P("/proc/safepick"), null, [live(possible_ruins)]));
	}
	if (!truthy(live(template))) {
		return 0;
	}
	central_turf = rt.getStep(f, live(f.src), 0);
	i = null;
	rt.forList(f, 0, (yield* g.callName(f, live(template), "get_affected_turfs", [live(central_turf), 1])));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		_T_3 = live(i);
		monster = null;
		rt.forList(f, 1, live(_T_3), T("/mob/living/simple_animal"));
		while (($e = rt.next(f, 1)) !== undefined) {
			monster = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(monster)]);
		}
		rt.endFor(f, 1);
		plant = null;
		rt.forList(f, 1, live(_T_3), T("/obj/structure/flora/ash"));
		while (($e = rt.next(f, 1)) !== undefined) {
			plant = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(plant)]);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(template), "load", [null, live(central_turf), "centered", 1], rt.Args.Named);
	rt.incField(f, live(template), "loaded", 1, true);
	if (truthy((rt.istype((ruin = live(template)), T("/datum/map_template")) ? 1 : 0))) {
		yield* g.new_(f, T("/obj/effect/landmark/ruin"), [live(central_turf), live(ruin)]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return 1;
}, true);
