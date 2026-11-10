// Based on /tg/station's code/modules/reagents/chemistry/recipes.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


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

// recipes.dm:4
rt.def("/datum/chemical_reaction/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.results = new_(T("/list"));

	this.required_reagents = new_(T("/list"));

	this.required_catalysts = new_(T("/list"));
	return f.dot;
});

// recipes.dm:27
rt.def("/datum/chemical_reaction/proc/chemical_mob_spawn", function* chemical_mob_spawn(f: Frame, holder: Value, amount_to_spawn: Value, reaction_name: Value, mob_faction: Value) {
	let _T: Value = null, SA: Value = null, M: Value = null, C: Value = null, chosen: Value = null, spawnloc: Value = null, C_8: Value = null, j: Value = null;
	let $2: any, $e: any;
	mob_faction ??= "chemicalsummon";
	if (!(holder && holder.my_atom)) return f.dot;
	if (rt.len(f, GLOB.chemical_mob_spawn_meancritters) <= 0 || rt.len(f, GLOB.chemical_mob_spawn_nicecritters) <= 0) {
		for (_T of each(typesof(T("/mob/living/simple_animal")))) {
			const initial_2 = rt.initial(f, (SA = _T), "gold_core_spawnable");
			if (initial_2 === 1) {
				GLOB.chemical_mob_spawn_meancritters += _T;
			} else if (initial_2 === 2) {
				GLOB.chemical_mob_spawn_nicecritters += _T;
			}
		}
	}
	let A: Value = holder.my_atom;
	let _T_1: Value = rt.getStep(f, A, 0);
	let my_area: Value = get_area(_T_1);
	let $0: any = reaction_name;
	let $1: any = my_area.name;
	if (_T_1) {
		$2 = `${`(${_T_1.x},${_T_1.y},${_T_1.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T_1.x};Y=${_T_1.y};Z=${_T_1.z}'>JMP</a>)`}`;
	} else {
		$2 = "nonexistent location";
	}
	let message: Value = `A ${$0} reaction has occurred in ${$1} ${`${$2}`}`;
	message += fmt(" (<A HREF='?_src_=vars;Vars=＃'>VV</A>)", [A]);
	if (M = get(A, T("/mob"))) {
		message += ` - Carried By: ${`${key_name_admin(M)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [M])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [M])}`}`;
	} else {
		message += ` - Last Fingerprint: ${A.fingerprintslast ? A.fingerprintslast : "N/A"}`;
	}
	message_admins(message, 0, 1);
	playsound(rt.getStep(f, holder.my_atom, 0), rt.rsc("sound/effects/phasein.ogg"), 100, 1);
	for (C of each(viewers(rt.getStep(f, holder.my_atom, 0), null), T("/mob/living/carbon"))) {
		yield* C.flash_act();
	}
	let i: Value = 1;
	while (i <= amount_to_spawn) {
		chosen = null;
		if (reaction_name == "Friendly Gold Slime") {
			chosen = pick(GLOB.chemical_mob_spawn_nicecritters);
		} else {
			chosen = pick(GLOB.chemical_mob_spawn_meancritters);
		}
		spawnloc = rt.getStep(f, holder.my_atom, 0);
		(rt.modField(f, (C_8 = (yield* new_(chosen, spawnloc))), "faction", mob_faction, rt.bitOr));
		if (prob(50)) {
			j = 1;
			while (j <= rand(1, 3)) {
				yield* step(C_8, pick(1, 2, 4, 8));
				j++;
			}
		}
		i++;
	}
	return f.dot;
}, true, { argTypes: [{ path: "/datum/reagents" }, {  }, {  }, {  }] });

// recipes.dm:68
rt.def("/datum/chemical_reaction/proc/goonchem_vortex", function* goonchem_vortex(f: Frame, _T: Value, setting_type: Value, range: Value) {
	let X: Value = null, distance: Value = null, moving_power: Value = null, throw_target: Value = null, i: Value = null;
	for (X of each(orange(range, _T), T("/atom/movable"))) {
		if (rt.istype(X, T("/obj/effect"))) {
			continue;
		}
		if (!X.anchored) {
			distance = get_dist(X, _T);
			if ((moving_power = max(range - distance, 1)) > 2) {
				if (setting_type) {
					throw_target = get_edge_target_turf(X, rt.getDir(f, X, get_step_away(X, _T)));
					yield* X.throw_at(throw_target, moving_power, 1);
				} else {
					yield* X.throw_at(_T, moving_power, 1);
				}
			} else {
				rt.spawnTail(f, 0, "/datum/chemical_reaction/proc/goonchem_vortex: spawn at modules/reagents/chemistry/recipes.dm:81", _T, setting_type, range, X, distance, moving_power, throw_target, i);
			}
		}
	}
	return f.dot;
}, true);

// a spawn(0) body of /datum/chemical_reaction/proc/goonchem_vortex, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/chemical_reaction/proc/goonchem_vortex: spawn at modules/reagents/chemistry/recipes.dm:81", function* (f: Frame, _T: Value, setting_type: Value, range: Value, X: Value, distance: Value, moving_power: Value, throw_target: Value, i: Value) {
	if (setting_type) {
		i = null;
		i = 0;
		while (i < moving_power) {
			yield* sleep(2);
			if (!(yield* step_away(X, _T))) {
				break;
			}
			i++;
		}
	} else {
		i = null;
		i = 0;
		while (i < moving_power) {
			yield* sleep(2);
			if (!(yield* step_towards(X, _T))) {
				break;
			}
			i++;
		}
	}
	return null;
});
