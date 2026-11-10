// Based on /tg/station's code/modules/mapping/ruins.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// ruins.dm:4
rt.def("/proc/seedRuins", function* seedRuins(f: Frame, z_levels: Value, budget: Value, whitelist: Value, potentialRuins: Value) {
	let zl: Value = null, _T: Value = null, ruin: Value = null, sanity: Value = null, width_border: Value = null, height_border: Value = null, z_level: Value = null, _T_7: Value = null, valid: Value = null, check: Value = null, new_area: Value = null, R: Value = null;
	budget ??= 0;
	whitelist ??= T("/area/space");
	if (!z_levels || !rt.len(f, z_levels)) {
		warning(`${"No Z levels provided - Not generating ruins"} in ${"code/modules/mapping/ruins.dm"} at line ${5} src: ${this} usr: ${f.usr}.`);
		return f.dot;
	}
	for (zl of each(z_levels)) {
		if (!(_T = rt.locate(1, 1, zl))) {
			warning(`${`Z level ${zl} does not exist - Not generating ruins`} in ${"code/modules/mapping/ruins.dm"} at line ${11} src: ${this} usr: ${f.usr}.`);
			return f.dot;
		}
	}
	let overall_sanity: Value = 100;
	let ruins: Value = (yield* potentialRuins.Copy());
	loop50: while (true) {
		if (!(budget > 0 && overall_sanity > 0)) break;
		ruin = null;
		if (ruins && rt.len(f, ruins)) {
			ruin = rt.index(ruins, pick(ruins));
		} else {
			log_world(`Ruin loader had no ruins to pick from with ${budget} left to spend.`);
			break;
		}
		if (ruin.cost > budget) {
			overall_sanity--;
			continue;
		}
		sanity = 100;
		while (true) {
			if (!(sanity > 0)) continue loop50;
			sanity--;
			width_border = 22 + round(ruin.width / 2);
			height_border = 22 + round(ruin.height / 2);
			z_level = pick(z_levels);
			_T_7 = rt.locate(rand(width_border, rt.world().maxx - width_border), rand(height_border, rt.world().maxy - height_border), z_level);
			valid = 1;
			check = null;
			for (check of each(ruin.get_affected_turfs(_T_7, 1), T("/turf"))) {
				if (!rt.op(f, "IsType", [], [(new_area = get_area(check)), whitelist])) {
					valid = 0;
					break;
				}
			}
			if (valid) break;
		}
		log_world(`Ruin "${ruin.name}" placed at (${_T_7.x}, ${_T_7.y}, ${_T_7.z})`);
		yield* (R = (yield* new_(T("/obj/effect/ruin_loader"), _T_7))).Load(ruins, ruin);
		budget -= ruin.cost;
		if (!ruin.allow_duplicates) {
			ruins -= ruin.name;
		}
	}
	if (overall_sanity) return f.dot;
	log_world(`Ruin loader gave up with ${budget} left to spend.`);
	return f.dot;
}, true);

rt.type(12079, "/obj/effect/ruin_loader", "/obj/effect", {
	name: "random ruin",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "syndballoon",
	invisibility: 0,
});

// ruins.dm:70
rt.def("/obj/effect/ruin_loader/proc/Load", function* Load(f: Frame, potentialRuins: Value, template: Value) {
	let A: Value = null, _T: Value = null, i: Value = null, _T_3: Value = null, monster: Value = null, plant: Value = null, ruin: Value = null;
	let possible_ruins: Value = list();
	for (A of each(potentialRuins)) {
		if (!(_T = rt.index(potentialRuins, A)).loaded) {
			possible_ruins += _T;
		}
	}
	if (!template && rt.len(f, possible_ruins)) {
		template = safepick(possible_ruins);
	}
	if (!template) {
		return 0;
	}
	let central_turf: Value = rt.getStep(f, this, 0);
	for (i of each(template.get_affected_turfs(central_turf, 1))) {
		_T_3 = i;
		monster = null;
		for (monster of each(_T_3, T("/mob/living/simple_animal"))) {
			yield* qdel(monster);
		}
		plant = null;
		for (plant of each(_T_3, T("/obj/structure/flora/ash"))) {
			yield* qdel(plant);
		}
	}
	yield* template.load(central_turf, { centered: 1 });
	template.loaded++;
	if (rt.istype((ruin = template), T("/datum/map_template"))) {
		yield* new_(T("/obj/effect/landmark/ruin"), central_turf, ruin);
	}
	yield* qdel(this);
	return 1;
}, true);
