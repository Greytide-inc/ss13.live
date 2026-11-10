// Based on /tg/station's code/modules/spells/spell_types/dumbfire.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(11383, "/obj/effect/proc_holder/spell/dumbfire", "/obj/effect/proc_holder/spell", {
	projectile_type: "",
	activate_on_collision: 1,
	proj_icon: rt.rsc("icons/obj/projectiles.dmi"),
	proj_icon_state: "spell",
	proj_name: "a spell projectile",
	proj_trail: 0,
	proj_trail_lifespan: 0,
	proj_trail_icon: rt.rsc("icons/obj/wizard.dmi"),
	proj_trail_icon_state: "trail",
	proj_type: "/obj/effect/proc_holder/spell",
	proj_insubstantial: 0,
	proj_trigger_range: 1,
	proj_lifespan: 100,
	proj_step_delay: 1,
});

// dumbfire.dm:25
rt.def("/obj/effect/proc_holder/spell/dumbfire/proc/choose_targets", function* choose_targets(f: Frame, user: Value) {
	let new_turf: Value = null;
	user ??= f.usr;
	let _T: Value = rt.getStep(f, user, 0);
	let i: Value = 1;
	while (i < this.range) {
		if ((new_turf = rt.getStep(f, _T, user.dir)).density) {
			break;
		}
		_T = new_turf;
		i++;
	}
	yield* this.perform(list(_T), { user: user });
	return f.dot;
}, true);

// dumbfire.dm:34
rt.def("/obj/effect/proc_holder/spell/dumbfire/proc/cast", function cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null, projectile: Value = null, projectile_type: Value = null, current_loc: Value = null, i: Value = null, L: Value = null, trail: Value = null, M: Value = null;
	user ??= f.usr;
	this.playMagSound();
	for (target of each(targets, T("/turf"))) {
		rt.spawnTail(f, 0, "/obj/effect/proc_holder/spell/dumbfire/proc/cast: spawn at modules/spells/spell_types/dumbfire.dm:36", targets, user, target, projectile, projectile_type, current_loc, i, L, trail, M);
	}
	return f.dot;
});

// a spawn(0) body of /obj/effect/proc_holder/spell/dumbfire/proc/cast, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/effect/proc_holder/spell/dumbfire/proc/cast: spawn at modules/spells/spell_types/dumbfire.dm:36", function* (f: Frame, targets: Value, user: Value, target: Value, projectile: Value, projectile_type: Value, current_loc: Value, i: Value, L: Value, trail: Value, M: Value) {
	projectile = null;
	if (istext(this.proj_type)) {
		projectile_type = text2path(this.proj_type);
		projectile = (yield* new_(projectile_type, user));
	} else if (rt.istype(this.proj_type, T("/obj/effect/proc_holder/spell"))) {
		(projectile = (yield* new_(T("/obj/effect/proc_holder/spell/targeted/trigger"), user))).linked_spells += this.proj_type;
	} else {
		projectile = (yield* new_(this.proj_type, user));
	}
	projectile.icon = this.proj_icon;
	projectile.icon_state = this.proj_icon_state;
	yield* projectile.setDir(rt.getDir(f, projectile, target));
	projectile.name = this.proj_name;
	current_loc = user.loc;
	projectile.loc = current_loc;
	i = null;
	i = 0;
	while (i < this.proj_lifespan) {
		if (!projectile) {
			break;
		}
		if (this.proj_insubstantial) {
			projectile.loc = rt.getStep(f, projectile, projectile.dir);
		} else {
			yield* step(projectile, projectile.dir);
		}
		if (projectile.loc == current_loc || i == this.proj_lifespan) {
			yield* projectile.cast(current_loc, { user: user });
			break;
		}
		if ((L = rt.locateIn(f, T("/mob/living"), range(projectile, this.proj_trigger_range) - user)) && L.stat != 2) {
			yield* projectile.cast(L.loc, { user: user });
			break;
		}
		if (this.proj_trail && projectile) {
			rt.spawnTail(f, 0, "/obj/effect/proc_holder/spell/dumbfire/proc/cast: spawn at modules/spells/spell_types/dumbfire.dm:74", targets, user, target, projectile, projectile_type, current_loc, i, L, trail, M);
		}
		current_loc = projectile.loc;
		(M = (yield* new_(T("/matrix")))).Turn(dir2angle(projectile.dir));
		projectile.transform = M;
		yield* sleep(this.proj_step_delay);
		i++;
	}
	if (projectile) {
		yield* qdel(projectile);
	}
	return null;
});

// a spawn(0) body of /obj/effect/proc_holder/spell/dumbfire/proc/cast, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/effect/proc_holder/spell/dumbfire/proc/cast: spawn at modules/spells/spell_types/dumbfire.dm:74", function* (f: Frame, targets: Value, user: Value, target: Value, projectile: Value, projectile_type: Value, current_loc: Value, i: Value, L: Value, trail: Value, M: Value) {
	if (projectile) {
		(trail = (yield* new_(T("/obj/effect/overlay"), projectile.loc))).icon = this.proj_trail_icon;
		trail.icon_state = this.proj_trail_icon_state;
		trail.density = 0;
		yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), trail)), this.proj_trail_lifespan, 8);
	}
	return null;
});
