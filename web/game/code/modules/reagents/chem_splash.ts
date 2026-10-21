// From code/modules/reagents/chem_splash.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/chem_splash  (code/modules/reagents/chem_splash.dm:9)  may sleep
rt.def("/proc/chem_splash", function* chem_splash(f: Frame, epicenter: Value, affected_range: Value, reactants: Value, extra_heat: Value, threatscale: Value, adminlog: Value) {
	let has_reagents: Value = null, total_reagents: Value = null, R: Value = null, splash_holder: Value = null, total_temp: Value = null, R_4: Value = null, steam: Value = null, viewable: Value = null, accessible: Value = null, i: Value = null, turflist: Value = null, _T: Value = null, thing: Value = null, NT: Value = null, reactable: Value = null, _T_8: Value = null, A: Value = null, thing_8: Value = null, distance: Value = null, fraction: Value = null;
	let $e: any;
	f.vars = () => [epicenter, affected_range, reactants, extra_heat, threatscale, adminlog, has_reagents, total_reagents, R, splash_holder, total_temp, R_4, steam, viewable, accessible, i, turflist, _T, thing, NT, reactable, _T_8, A, thing_8, distance, fraction, $e];
	if (live(affected_range) === null) {
		affected_range = 3;
	}
	if (live(reactants) === null) {
		reactants = rt.list();
	}
	if (live(extra_heat) === null) {
		extra_heat = 0;
	}
	if (live(threatscale) === null) {
		threatscale = 1;
	}
	if (live(adminlog) === null) {
		adminlog = 1;
	}
	if (((!truthy((yield* g.call(f, P("/proc/isturf"), null, [live(epicenter)]))) || !truthy(rt.len(f, live(reactants)))) || rt.le(live(threatscale), 0))) {
		return live(f.dot);
	}
	has_reagents = null;
	total_reagents = null;
	R = null;
	rt.forList(f, 0, live(reactants), T("/datum/reagents"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (truthy(rt.fv(f, "total_volume", live(R)))) {
			has_reagents = 1;
			total_reagents = rt.modify(live(total_reagents), rt.fv(f, "total_volume", live(R)), add);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(has_reagents))) {
		return live(f.dot);
	}
	rt.setFv(f, "my_atom", (splash_holder = (yield* g.new_(f, T("/datum/reagents"), [multiply(live(total_reagents), live(threatscale))]))), live(epicenter));
	total_temp = 0;
	R_4 = null;
	rt.forList(f, 0, live(reactants), T("/datum/reagents"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R_4 = $e;
		yield* g.callName(f, live(R_4), "trans_to", [live(splash_holder), rt.fv(f, "total_volume", live(R_4)), live(threatscale), 1, 1]);
		total_temp = rt.modify(live(total_temp), rt.fv(f, "chem_temp", live(R_4)), add);
	}
	rt.endFor(f, 0);
	rt.setFv(f, "chem_temp", live(splash_holder), add(divide(live(total_temp), rt.len(f, live(reactants))), live(extra_heat)));
	yield* g.callName(f, live(splash_holder), "handle_reactions", []);
	if ((truthy(rt.fv(f, "total_volume", live(splash_holder))) && rt.ge(live(affected_range), 0))) {
		yield* g.callName(f, (steam = (yield* g.new_(f, T("/datum/effect_system/steam_spread"), []))), "set_up", [10, 0, live(epicenter)]);
		yield* g.callName(f, live(steam), "attach", [live(epicenter)]);
		yield* g.callName(f, live(steam), "start", []);
		viewable = (yield* g.call(f, P("/proc/view"), null, [live(affected_range), live(epicenter)]));
		accessible = rt.list(live(epicenter));
		i = null;
		i = 1;
		while (rt.le(live(i), live(affected_range))) {
			turflist = rt.list();
			_T = null;
			rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/orange"), null, [live(i), live(epicenter)])), (yield* g.call(f, P("/proc/orange"), null, [subtract(live(i), 1), live(epicenter)]))), T("/turf"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_T = $e;
				(turflist = rt.modify(live(turflist), live(_T), rt.bitOr));
			}
			rt.endFor(f, 0);
			_T = null;
			rt.forList(f, 0, live(turflist), T("/turf"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_T = $e;
				if ((!truthy((rt.isIn(f, rt.getDir(f, live(_T), live(epicenter)), rt.gl("cardinal")) ? 1 : 0)) && isEqual(rt.op(f, "Abs", [], [subtract(rt.fv(f, "x", live(_T)), rt.fv(f, "x", live(epicenter)))]), rt.op(f, "Abs", [], [subtract(rt.fv(f, "y", live(_T)), rt.fv(f, "y", live(epicenter)))])))) {
					yield* g.callName(f, live(turflist), "Remove", [live(_T)]);
					yield* g.callName(f, live(turflist), "Add", [live(_T)]);
				}
			}
			rt.endFor(f, 0);
			_T = null;
			rt.forList(f, 0, live(turflist), T("/turf"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_T = $e;
				if (truthy(rt.index(live(accessible), live(_T)))) {
					continue;
				}
				thing = null;
				rt.forList(f, 1, (yield* g.callName(f, live(_T), "GetAtmosAdjacentTurfs", ["alldir", 1], rt.Args.Named)));
				while (($e = rt.next(f, 1)) !== undefined) {
					thing = $e;
					if (!truthy((rt.isIn(f, (NT = live(thing)), live(accessible)) ? 1 : 0))) {
						continue;
					}
					if (!truthy((rt.isIn(f, rt.getDir(f, live(_T), live(NT)), rt.gl("cardinal")) ? 1 : 0))) {
						continue;
					}
					rt.setAt(live(accessible), live(_T), 1);
					break;
				}
				rt.endFor(f, 1);
			}
			rt.endFor(f, 0);
			i = rt.inc(live(i), 1);
		}
		reactable = live(accessible);
		_T_8 = null;
		rt.forList(f, 0, live(accessible), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T_8 = $e;
			A = null;
			rt.forList(f, 1, (yield* g.callName(f, live(_T_8), "GetAllContents", [])), T("/atom"));
			while (($e = rt.next(f, 1)) !== undefined) {
				A = $e;
				if (!truthy((rt.isIn(f, live(A), live(viewable)) ? 1 : 0))) {
					continue;
				}
				(reactable = rt.modify(live(reactable), live(A), rt.bitOr));
			}
			rt.endFor(f, 1);
			if (rt.ge(live(extra_heat), 300)) {
				yield* g.callName(f, live(_T_8), "hotspot_expose", [multiply(live(extra_heat), 2), 5]);
			}
		}
		rt.endFor(f, 0);
		if (!truthy(rt.len(f, live(reactable)))) {
			return live(f.dot);
		}
		thing_8 = null;
		rt.forList(f, 0, live(reactable));
		while (($e = rt.next(f, 0)) !== undefined) {
			thing_8 = $e;
			A = live(thing_8);
			distance = (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/get_dist"), null, [live(A), live(epicenter)]))]));
			fraction = divide(0.5, rt.power(2, live(distance)));
			yield* g.callName(f, live(splash_holder), "reaction", [live(A), 1, live(fraction)]);
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(splash_holder)]);
	return 1;
}, true);
