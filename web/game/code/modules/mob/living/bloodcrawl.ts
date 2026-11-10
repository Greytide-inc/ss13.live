// Based on /tg/station's code/modules/mob/living/bloodcrawl.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11949, "/obj/effect/dummy/slaughter", "/obj/effect/dummy", {
	canmove: 1,
	anchored: 1,
	name: "water",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "nothing",
	density: 0,
	invisibility: 60,
	resistance_flags: 51,
});

// bloodcrawl.dm:12
rt.def("/obj/effect/dummy/slaughter/proc/relaymove", function* relaymove(f: Frame, user: Value, direction: Value) {
	yield* this.forceMove(rt.getStep(f, this, direction));
	return f.dot;
}, true);

// bloodcrawl.dm:25
rt.def("/mob/living/proc/phaseout", function* phaseout(f: Frame, B: Value) {
	let C: Value = null, I: Value = null, B1: Value = null, B2: Value = null;
	if (rt.istype(this, T("/mob/living/carbon"))) {
		C = this;
		for (I of each(C.held_items, T("/obj/item"))) {
			to_chat(C, "<span class='warning'>You may not hold items while blood crawling!</span>");
			return 0;
		}
		B1 = (yield* new_(T("/obj/item/weapon/bloodcrawl"), C));
		B2 = (yield* new_(T("/obj/item/weapon/bloodcrawl"), C));
		B1.icon_state = "bloodhand_left";
		B2.icon_state = "bloodhand_right";
		yield* C.put_in_hands(B1);
		yield* C.put_in_hands(B2);
		yield* C.regenerate_icons();
	}
	this.notransform = 1;
	rt.spawnTail(f, 0, "/mob/living/proc/phaseout: spawn at modules/mob/living/bloodcrawl.dm:41", B, C, I, B1, B2);
	return 1;
}, true);

// a spawn(0) body of /mob/living/proc/phaseout, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/proc/phaseout: spawn at modules/mob/living/bloodcrawl.dm:41", function* (f: Frame, B: Value, C: Value, I: Value, B1: Value, B2: Value) {
	yield* this.bloodpool_sink(B);
	this.notransform = 0;
	return null;
});

// bloodcrawl.dm:47
rt.def("/mob/living/proc/bloodpool_sink", function* bloodpool_sink(f: Frame, B: Value) {
	let success: Value = null;
	let mobloc: Value = rt.getStep(f, this.loc, 0);
	this.visible_message(`<span class='warning'>${this} sinks into the pool of blood!</span>`);
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/magic/enter_blood.ogg"), 100, 1, -1);
	let holder: Value = (yield* new_(T("/obj/effect/dummy/slaughter"), mobloc));
	yield* this.ExtinguishMob();
	let pullee: Value = this.pulling;
	this.holder = holder;
	yield* this.forceMove(holder);
	if (!pullee || this.bloodcrawl != BLOODCRAWL_EAT) {
		return f.dot;
	}
	if (!rt.istype(pullee, T("/mob/living"))) {
		return f.dot;
	}
	let victim: Value = pullee;
	let kidnapped: Value = 0;
	if (victim.stat == 0) {
		this.visible_message(`<span class='warning'>${victim} kicks free of the blood pool just before entering it!</span>`, null, "<span class='notice'>You hear splashing and struggling.</span>");
	} else if (victim.reagents && victim.reagents.has_reagent("demonsblood")) {
		this.visible_message(`<span class='warning'>Something prevents ${victim} from entering the pool!</span>`, `<span class='warning'>A strange force is blocking ${victim} from entering!</span>`, "<span class='notice'>You hear a splash and a thud.</span>");
	} else {
		yield* victim.forceMove(this);
		yield* victim.emote("scream");
		this.visible_message(`<span class='warning'><b>${this} drags ${victim} into the pool of blood!</b></span>`, null, "<span class='notice'>You hear a splash.</span>");
		kidnapped = 1;
	}
	if (kidnapped) {
		if (!(success = (yield* this.bloodcrawl_consume(victim)))) {
			to_chat(this, "<span class='danger'>You happily devour... nothing? Your meal vanished at some point!</span>");
		}
	}
	return 1;
}, true);

// bloodcrawl.dm:91
rt.def("/mob/living/proc/bloodcrawl_consume", function* bloodcrawl_consume(f: Frame, victim: Value) {
	let sound: Value = null, SD: Value = null, i: Value = null, found_bloodpool: Value = null, target: Value = null;
	let $e: any;
	to_chat(this, `<span class='danger'>You begin to feast on ${victim}. You can not move while you are doing this.</span>`);
	if (rt.istype(this, T("/mob/living/simple_animal/slaughter"))) {
		sound = (SD = this).feast_sound;
	} else {
		sound = rt.rsc("sound/magic/demon_consume.ogg");
	}
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		playsound(rt.getStep(f, this, 0), sound, 100, 1);
		yield* sleep(30);
	}
	rt.endFor(f, 0);
	if (!victim) {
		return 0;
	}
	if (victim.reagents && victim.reagents.has_reagent("devilskiss")) {
		to_chat(this, "<span class='warning'><b>AAH! THEIR FLESH! IT BURNS!</b></span>");
		yield* this.adjustBruteLoss(25);
		found_bloodpool = 0;
		for (target of each(range(1, rt.getStep(f, victim, 0)), T("/obj/effect/decal/cleanable"))) {
			if (target.can_bloodcrawl_in()) {
				yield* victim.forceMove(rt.getStep(f, target, 0));
				victim.visible_message(`<span class='warning'>${target} violently expels ${victim}!</span>`);
				victim.exit_blood_effect(target);
				found_bloodpool = 1;
			}
		}
		if (!found_bloodpool) {
			yield* victim.forceMove(rt.getStep(f, victim, 0));
			victim.visible_message(`<span class='warning'>${victim} appears from nowhere, covered in blood!</span>`);
			victim.exit_blood_effect();
		}
		return 1;
	}
	to_chat(this, `<span class='danger'>You devour ${victim}. Your health is fully restored.</span>`);
	yield* this.revive({ full_heal: 1 });
	yield* victim.adjustBruteLoss(1000);
	yield* victim.death();
	yield* this.bloodcrawl_swallow(victim);
	return 1;
}, true);

// bloodcrawl.dm:135
rt.def("/mob/living/proc/bloodcrawl_swallow", function* bloodcrawl_swallow(f: Frame, victim: Value) {
	yield* qdel(victim);
	return f.dot;
}, true);

// bloodcrawl.dm:144
rt.def("/mob/living/proc/exit_blood_effect", function exit_blood_effect(f: Frame, B: Value) {
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/magic/exit_blood.ogg"), 100, 1, -1);
	let newcolor: Value = "#950a0a";
	if (rt.istype(B, T("/obj/effect/decal/cleanable/xenoblood"))) {
		newcolor = "#2bba00";
	}
	this.add_atom_colour(newcolor, TEMPORARY_COLOUR_PRIORITY);
	rt.spawnTail(f, 30, "/mob/living/proc/exit_blood_effect: spawn at modules/mob/living/bloodcrawl.dm:151", B, newcolor);
	return f.dot;
});

// a spawn(30) body of /mob/living/proc/exit_blood_effect, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/proc/exit_blood_effect: spawn at modules/mob/living/bloodcrawl.dm:151", function* (f: Frame, B: Value, newcolor: Value) {
	this.remove_atom_colour(2, newcolor);
	return null;
});

// bloodcrawl.dm:155
rt.def("/mob/living/proc/phasein", function* phasein(f: Frame, B: Value) {
	let C: Value = null, BC: Value = null;
	if (this.notransform) {
		to_chat(this, "<span class='warning'>Finish eating first!</span>");
		return 0;
	}
	B.visible_message(`<span class='warning'>${B} starts to bubble...</span>`);
	if (!(yield* do_after(this, 20, { target: B }))) {
		return f.dot;
	}
	if (!B) {
		return f.dot;
	}
	this.loc = B.loc;
	this.client.eye = this;
	this.visible_message(`<span class='warning'><B>${this} rises out of the pool of blood!</B>`);
	this.exit_blood_effect(B);
	if (rt.istype(this, T("/mob/living/carbon"))) {
		C = this;
		for (BC of each(C, T("/obj/item/weapon/bloodcrawl"))) {
			BC.flags = null;
			yield* qdel(BC);
		}
	}
	yield* qdel(this.holder);
	this.holder = null;
	return 1;
}, true);
