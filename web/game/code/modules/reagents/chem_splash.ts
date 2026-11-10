// Based on /tg/station's code/modules/reagents/chem_splash.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// chem_splash.dm:9
rt.def("/proc/chem_splash", function* chem_splash(f: Frame, epicenter: Value, affected_range: Value, reactants: Value, extra_heat: Value, threatscale: Value, adminlog: Value) {
	let has_reagents: Value = null, total_reagents: Value = null, R: Value = null, splash_holder: Value = null, R_4: Value = null, steam: Value = null, viewable: Value = null, accessible: Value = null, i: Value = null, turflist: Value = null, _T: Value = null, thing: Value = null, NT: Value = null, reactable: Value = null, _T_8: Value = null, A: Value = null, thing_8: Value = null, distance: Value = null, fraction: Value = null;
	affected_range ??= 3;
	reactants ??= list();
	extra_heat ??= 0;
	threatscale ??= 1;
	adminlog ??= 1;
	if (!isturf(epicenter) || !rt.len(f, reactants) || threatscale <= 0) {
		return f.dot;
	}
	for (R of each(reactants, T("/datum/reagents"))) {
		if (R.total_volume) {
			has_reagents = 1;
			total_reagents += R.total_volume;
		}
	}
	if (!has_reagents) {
		return f.dot;
	}
	(splash_holder = (yield* new_(T("/datum/reagents"), total_reagents * threatscale))).my_atom = epicenter;
	let total_temp: Value = 0;
	for (R_4 of each(reactants, T("/datum/reagents"))) {
		yield* R_4.trans_to(splash_holder, R_4.total_volume, threatscale, 1, 1);
		total_temp += R_4.chem_temp;
	}
	splash_holder.chem_temp = total_temp / rt.len(f, reactants) + extra_heat;
	yield* splash_holder.handle_reactions();
	if (splash_holder.total_volume && affected_range >= 0) {
		yield* (steam = (yield* new_(T("/datum/effect_system/steam_spread")))).set_up(10, 0, epicenter);
		yield* steam.attach(epicenter);
		yield* steam.start();
		viewable = view(affected_range, epicenter);
		accessible = list(epicenter);
		i = 1;
		while (i <= affected_range) {
			turflist = list();
			_T = null;
			for (_T of each(orange(i, epicenter) - orange(i - 1, epicenter), T("/turf"))) {
				(turflist = rt.modify(turflist, _T, rt.bitOr));
			}
			_T = null;
			for (_T of each(turflist, T("/turf"))) {
				if (!rt.isIn(f, rt.getDir(f, _T, epicenter), GLOB.cardinal) && rt.op(f, "Abs", [], [_T.x - epicenter.x]) == rt.op(f, "Abs", [], [_T.y - epicenter.y])) {
					yield* turflist.Remove(_T);
					turflist.Add(_T);
				}
			}
			_T = null;
			for (_T of each(turflist, T("/turf"))) {
				if (rt.index(accessible, _T)) {
					continue;
				}
				thing = null;
				for (thing of each((yield* _T.GetAtmosAdjacentTurfs({ alldir: 1 })))) {
					if (!rt.isIn(f, (NT = thing), accessible)) {
						continue;
					}
					if (!rt.isIn(f, rt.getDir(f, _T, NT), GLOB.cardinal)) {
						continue;
					}
					rt.setAt(accessible, _T, 1);
					break;
				}
			}
			i++;
		}
		reactable = accessible;
		for (_T_8 of each(accessible, T("/turf"))) {
			A = null;
			for (A of each(_T_8.GetAllContents(), T("/atom"))) {
				if (!rt.isIn(f, A, viewable)) {
					continue;
				}
				(reactable = rt.modify(reactable, A, rt.bitOr));
			}
			if (extra_heat >= 300) {
				yield* _T_8.hotspot_expose(extra_heat * 2, 5);
			}
		}
		if (!rt.len(f, reactable)) {
			return f.dot;
		}
		for (thing_8 of each(reactable)) {
			A = thing_8;
			distance = max(1, get_dist(A, epicenter));
			fraction = 0.5 / 2 ** distance;
			yield* splash_holder.reaction(A, TOUCH, fraction);
		}
	}
	yield* qdel(splash_holder);
	return 1;
}, true);
