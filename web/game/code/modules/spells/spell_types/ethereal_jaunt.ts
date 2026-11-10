// Based on /tg/station's code/modules/spells/spell_types/ethereal_jaunt.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(11292, "/obj/effect/proc_holder/spell/targeted/ethereal_jaunt", "/obj/effect/proc_holder/spell/targeted", {
	jaunt_duration: 50,
	jaunt_in_time: 5,
	jaunt_in_type: rt.typePath("/obj/effect/temp_visual/wizard"),
	jaunt_out_type: rt.typePath("/obj/effect/temp_visual/wizard/out"),
	include_user: 1,
	name: "Ethereal Jaunt",
	desc: "This spell creates your ethereal form, temporarily making you invisible and able to pass through walls.",
	school: "transmutation",
	charge_max: 300,
	clothes_req: 1,
	invocation: "none",
	invocation_type: "none",
	range: -1,
	cooldown_min: 100,
	nonabstract_req: 1,
	action_icon_state: "jaunt",
});

// ethereal_jaunt.dm:21
rt.def("/obj/effect/proc_holder/spell/targeted/ethereal_jaunt/proc/cast", function cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null;
	user ??= f.usr;
	playsound(rt.getStep(f, user, 0), rt.rsc("sound/magic/ethereal_enter.ogg"), 50, 1, -1);
	for (target of each(targets, T("/mob/living"))) {
		ImmediateInvokeAsync(this, P("/obj/effect/proc_holder/spell/targeted/ethereal_jaunt/proc/do_jaunt"), target);
	}
	return f.dot;
});

// ethereal_jaunt.dm:26
rt.def("/obj/effect/proc_holder/spell/targeted/ethereal_jaunt/proc/do_jaunt", function* do_jaunt(f: Frame, target: Value) {
	let direction: Value = null, _T: Value = null;
	target.notransform = 1;
	let mobloc: Value = rt.getStep(f, target, 0);
	let holder: Value = (yield* new_(T("/obj/effect/dummy/spell_jaunt"), mobloc));
	yield* new_(this.jaunt_out_type, mobloc, target.dir);
	yield* target.ExtinguishMob();
	if (target.buckled) {
		yield* target.buckled.unbuckle_mob(target, { force: 1 });
	}
	if (target.pulledby) {
		yield* target.pulledby.stop_pulling();
	}
	yield* target.stop_pulling();
	if (target.has_buckled_mobs()) {
		yield* target.unbuckle_all_mobs({ force: 1 });
	}
	target.loc = holder;
	yield* target.reset_perspective(holder);
	target.notransform = 0;
	this.jaunt_steam(mobloc);
	yield* sleep(this.jaunt_duration);
	if (target.loc != holder) {
		yield* qdel(holder);
		return f.dot;
	}
	this.jaunt_steam((mobloc = rt.getStep(f, target.loc, 0)));
	target.canmove = 0;
	holder.reappearing = 1;
	playsound(rt.getStep(f, target, 0), rt.rsc("sound/magic/ethereal_exit.ogg"), 50, 1, -1);
	yield* sleep(25 - this.jaunt_in_time);
	yield* new_(this.jaunt_in_type, mobloc, target.dir);
	yield* sleep(this.jaunt_in_time);
	yield* qdel(holder);
	if (!target || target.gc_destroyed) return f.dot;
	if (mobloc.density) {
		for (direction of each(GLOB.alldirs)) {
			if (_T = rt.getStep(f, mobloc, direction)) {
				if (yield* target.Move(_T)) {
					break;
				}
			}
		}
	}
	target.canmove = 1;
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }] });

// ethereal_jaunt.dm:67
rt.def("/obj/effect/proc_holder/spell/targeted/ethereal_jaunt/proc/jaunt_steam", function jaunt_steam(f: Frame, mobloc: Value) {
	let steam: Value = null;
	(steam = new_(T("/datum/effect_system/steam_spread"))).set_up(10, 0, mobloc);
	steam.start();
	return f.dot;
});

rt.type(11950, "/obj/effect/dummy/spell_jaunt", "/obj/effect/dummy", {
	canmove: 1,
	reappearing: 0,
	anchored: 1,
	name: "water",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "nothing",
	density: 0,
	invisibility: 60,
	resistance_flags: 51,
});

// ethereal_jaunt.dm:84
rt.def("/obj/effect/dummy/spell_jaunt/proc/Destroy", function* Destroy(f: Frame) {
	let AM: Value = null;
	for (AM of each(this, T("/atom/movable"))) {
		yield* AM.forceMove(rt.getStep(f, this, 0));
	}
	return (yield* parent_proc());
}, true);

// ethereal_jaunt.dm:89
rt.def("/obj/effect/dummy/spell_jaunt/proc/relaymove", function relaymove(f: Frame, user: Value, direction: Value) {
	if (!this.canmove || this.reappearing || !direction) {
		return f.dot;
	}
	let newLoc: Value = rt.getStep(f, this, direction);
	this.setDir(direction);
	if (!rt.bitAnd(newLoc.flags, 1)) {
		this.loc = newLoc;
	} else {
		to_chat(user, "<span class='warning'>Some strange aura is blocking the way!</span>");
	}
	this.canmove = 0;
	rt.spawnTail(f, 2, "/obj/effect/dummy/spell_jaunt/proc/relaymove: spawn at modules/spells/spell_types/ethereal_jaunt.dm:97", user, direction, newLoc);
	return f.dot;
});

// a spawn(2) body of /obj/effect/dummy/spell_jaunt/proc/relaymove, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/effect/dummy/spell_jaunt/proc/relaymove: spawn at modules/spells/spell_types/ethereal_jaunt.dm:97", function* (f: Frame, user: Value, direction: Value, newLoc: Value) {
	this.canmove = 1;
	return null;
});
