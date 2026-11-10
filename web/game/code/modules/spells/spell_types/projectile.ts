// Based on /tg/station's code/modules/spells/spell_types/projectile.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(11295, "/obj/effect/proc_holder/spell/targeted/projectile", "/obj/effect/proc_holder/spell/targeted", {
	proj_icon: rt.rsc("icons/obj/projectiles.dmi"),
	proj_icon_state: "spell",
	proj_name: "a spell projectile",
	proj_trail: 0,
	proj_trail_lifespan: 0,
	proj_trail_icon: rt.rsc("icons/obj/wizard.dmi"),
	proj_trail_icon_state: "trail",
	proj_type: "/obj/effect/proc_holder/spell/targeted",
	proj_lingering: 0,
	proj_homing: 1,
	proj_insubstantial: 0,
	proj_trigger_range: 0,
	proj_lifespan: 15,
	proj_step_delay: 1,
	name: "Projectile",
	desc: "This spell summons projectiles which try to hit the targets.",
});

// projectile.dm:26
rt.def("/obj/effect/proc_holder/spell/targeted/projectile/proc/cast", function cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null, projectile: Value = null, projectile_type: Value = null, current_loc: Value = null, i: Value = null, trail: Value = null;
	user ??= f.usr;
	this.playMagSound();
	for (target of each(targets, T("/mob/living"))) {
		rt.spawnTail(f, 0, "/obj/effect/proc_holder/spell/targeted/projectile/proc/cast: spawn at modules/spells/spell_types/projectile.dm:28", targets, user, target, projectile, projectile_type, current_loc, i, trail);
	}
	return f.dot;
});

// a spawn(0) body of /obj/effect/proc_holder/spell/targeted/projectile/proc/cast, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/effect/proc_holder/spell/targeted/projectile/proc/cast: spawn at modules/spells/spell_types/projectile.dm:28", function* (f: Frame, targets: Value, user: Value, target: Value, projectile: Value, projectile_type: Value, current_loc: Value, i: Value, trail: Value) {
	projectile = null;
	if (istext(this.proj_type)) {
		projectile_type = text2path(this.proj_type);
		projectile = (yield* new_(projectile_type, user));
	}
	if (rt.istype(this.proj_type, T("/obj/effect/proc_holder/spell"))) {
		(projectile = (yield* new_(T("/obj/effect/proc_holder/spell/targeted/trigger"), user))).linked_spells += this.proj_type;
	}
	projectile.icon = this.proj_icon;
	projectile.icon_state = this.proj_icon_state;
	yield* projectile.setDir(rt.getDir(f, target, projectile));
	projectile.name = this.proj_name;
	current_loc = user.loc;
	projectile.loc = current_loc;
	i = null;
	i = 0;
	while (i < this.proj_lifespan) {
		if (!projectile) {
			break;
		}
		if (this.proj_homing) {
			if (this.proj_insubstantial) {
				yield* projectile.setDir(rt.getDir(f, projectile, target));
				projectile.loc = get_step_to(projectile, target);
			} else {
				yield* step_to(projectile, target);
			}
		} else if (this.proj_insubstantial) {
			projectile.loc = rt.getStep(f, projectile, this.dir);
		} else {
			yield* step(projectile, this.dir);
		}
		if (!projectile) {
			break;
		}
		if (!target || !this.proj_lingering && projectile.loc == current_loc) {
			yield* qdel(projectile);
			break;
		}
		if (this.proj_trail && projectile) {
			rt.spawnTail(f, 0, "/obj/effect/proc_holder/spell/targeted/projectile/proc/cast: spawn at modules/spells/spell_types/projectile.dm:69", targets, user, target, projectile, projectile_type, current_loc, i, trail);
		}
		if (rt.isIn(f, projectile.loc, range(target.loc, this.proj_trigger_range))) {
			yield* projectile.perform(list(target), { user: user });
			break;
		}
		current_loc = projectile.loc;
		yield* sleep(this.proj_step_delay);
		i++;
	}
	if (projectile) {
		yield* qdel(projectile);
	}
	return null;
});

// a spawn(0) body of /obj/effect/proc_holder/spell/targeted/projectile/proc/cast, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/effect/proc_holder/spell/targeted/projectile/proc/cast: spawn at modules/spells/spell_types/projectile.dm:69", function* (f: Frame, targets: Value, user: Value, target: Value, projectile: Value, projectile_type: Value, current_loc: Value, i: Value, trail: Value) {
	if (projectile) {
		(trail = (yield* new_(T("/obj/effect/overlay"), projectile.loc))).icon = this.proj_trail_icon;
		trail.icon_state = this.proj_trail_icon_state;
		trail.density = 0;
		yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), trail)), this.proj_trail_lifespan, 8);
	}
	return null;
});
