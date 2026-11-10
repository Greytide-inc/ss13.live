// Based on /tg/station's code/game/objects/items/dehy_carp.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(9680, "/obj/item/toy/carpplushie/dehy_carp", "/obj/item/toy/carpplushie", {
	owner: null,
	owned: 0,
	mobtype: rt.typePath("/mob/living/simple_animal/hostile/carp"),
});

// dehy_carp.dm:14
rt.def("/obj/item/toy/carpplushie/dehy_carp/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.add_fingerprint(user);
	if (!this.owned) {
		to_chat(user, `<span class='notice'>You pet ${this}. You swear it looks up at you.</span>`);
		this.owner = user;
		this.owned = 1;
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// dehy_carp.dm:22
rt.def("/obj/item/toy/carpplushie/dehy_carp/proc/Swell", function* Swell(f: Frame) {
	let factions: Value = null, F: Value = null;
	this.desc = "It's growing!";
	this.visible_message(`<span class='notice'>${this} swells up!</span>`);
	this.icon = rt.rsc("icons/mob/animal.dmi");
	flick("carp_swell", this);
	yield* sleep(6);
	if (!this || !this || this.gc_destroyed) {
		return f.dot;
	}
	let M: Value = (yield* new_(this.mobtype, rt.getStep(f, this, 0)));
	if (this.owner) {
		factions = (yield* this.owner.faction.Copy());
		for (F of each(factions)) {
			if (F == "neutral") {
				factions -= F;
			}
		}
		M.faction = factions;
	}
	if (!this.owner || this.owner.faction != M.faction) {
		this.visible_message("<span class='warning'>You have a bad feeling about this.</span>");
	} else {
		this.visible_message(`<span class='notice'>The newly grown ${M.name} looks up at you with friendly eyes.</span>`);
	}
	yield* qdel(this);
	return f.dot;
}, true);
