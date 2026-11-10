// Based on /tg/station's code/modules/mining/equipment/lazarus_injector.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7528, "/obj/item/weapon/lazarus_injector", "/obj/item/weapon", {
	loaded: 1,
	malfunctioning: 0,
	revive_type: 1,
	throw_speed: 3,
	throw_range: 5,
	name: "lazarus injector",
	desc: "An injector with a cocktail of nanomachines and chemicals, this device can seemingly raise animals from the dead, making them become friendly to the user. Unfortunately, the process is useless on higher forms of life and incredibly costly, so these were hidden in storage until an executive thought they'd be great motivation for some of their employees.",
	icon: rt.rsc("icons/obj/syringe.dmi"),
	icon_state: "lazarus_hypo",
	item_state: "hypo",
	throwforce: 0,
	w_class: 2,
	origin_tech: "biotech=4;magnets=6",
});

// lazarus_injector.dm:18
rt.def("/obj/item/weapon/lazarus_injector/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value) {
	let M: Value = null, H: Value = null;
	if (!this.loaded) {
		return f.dot;
	}
	if (!(rt.istype(target, T("/mob/living")) && proximity_flag)) return f.dot;
	if (rt.istype(target, T("/mob/living/simple_animal"))) {
		if ((M = target).sentience_type != this.revive_type) {
			to_chat(user, `<span class='info'>${this} does not work on this sort of creature.</span>`);
			return f.dot;
		}
		if (M.stat == 2) {
			M.faction = list("neutral");
			yield* M.revive({ full_heal: 1, admin_revive: 1 });
			if (rt.istype(target, T("/mob/living/simple_animal/hostile"))) {
				H = M;
				if (this.malfunctioning) {
					(rt.modField(f, H, "faction", list("lazarus", fmt("＃", [user])), rt.bitOr));
					H.robust_searching = 1;
					H.friends += user;
					H.attack_same = 1;
					log_game(`${user} has revived hostile mob ${target} with a malfunctioning lazarus injector`);
				} else {
					H.attack_same = 0;
				}
			}
			this.loaded = 0;
			user.visible_message(`<span class='notice'>${user} injects ${M} with ${this}, reviving it.</span>`);
			playsound(this, rt.rsc("sound/effects/refill.ogg"), 50, 1);
			this.icon_state = "lazarus_empty";
			return f.dot;
		} else {
			to_chat(user, `<span class='info'>${this} is only effective on the dead.</span>`);
			return f.dot;
		}
	} else {
		to_chat(user, `<span class='info'>${this} is only effective on lesser beings.</span>`);
		return f.dot;
	}
}, true);

// lazarus_injector.dm:53
rt.def("/obj/item/weapon/lazarus_injector/proc/emp_act", function emp_act(f: Frame) {
	if (this.malfunctioning) return f.dot;
	this.malfunctioning = 1;
	return f.dot;
});

// lazarus_injector.dm:57
rt.def("/obj/item/weapon/lazarus_injector/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.loaded) {
		to_chat(user, `<span class='info'>${this} is empty.</span>`);
	}
	if (!this.malfunctioning) return f.dot;
	to_chat(user, `<span class='info'>The display on ${this} seems to be flickering.</span>`);
	return f.dot;
}, false);
