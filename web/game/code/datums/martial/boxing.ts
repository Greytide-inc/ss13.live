// Based on /tg/station's code/datums/martial/boxing.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(568, "/datum/martial_art/boxing", "/datum/martial_art", {
	name: "Boxing",
});

// boxing.dm:5
rt.def("/datum/martial_art/boxing/proc/disarm_act", function disarm_act(f: Frame, A: Value, D: Value) {
	to_chat(A, "<span class='warning'>Can't disarm while boxing!</span>");
	return 1;
});

// boxing.dm:9
rt.def("/datum/martial_art/boxing/proc/grab_act", function grab_act(f: Frame, A: Value, D: Value) {
	to_chat(A, "<span class='warning'>Can't grab while boxing!</span>");
	return 1;
});

// boxing.dm:14
rt.def("/datum/martial_art/boxing/proc/harm_act", function* harm_act(f: Frame, A: Value, D: Value) {
	let damage: Value = null, knockout_prob: Value = null;
	yield* A.do_attack_animation(D, "punch");
	let atk_verb: Value = pick("left hook", "right hook", "straight punch");
	if (!(damage = rand(5, 8) + A.dna.species.punchdamagelow)) {
		playsound(D.loc, A.dna.species.miss_sound, 25, 1, -1);
		D.visible_message(`<span class='warning'>${A} has attempted to ${atk_verb} ${D}!</span>`, `<span class='userdanger'>${A} has attempted to ${atk_verb} ${D}!</span>`, null, 3);
		add_logs(A, D, "attempted to hit", atk_verb);
		return 0;
	}
	let affecting: Value = D.get_bodypart(ran_zone(A.zone_selected));
	let armor_block: Value = D.run_armor_check(affecting, "melee");
	playsound(D.loc, A.dna.species.attack_sound, 25, 1, -1);
	D.visible_message(`<span class='danger'>${A} has ${atk_verb}ed ${D}!</span>`, `<span class='userdanger'>${A} has ${atk_verb}ed ${D}!</span>`, null, 3);
	yield* D.apply_damage(damage, "stamina", affecting, armor_block);
	add_logs(A, D, "punched (boxing) ");
	if (D.getStaminaLoss() > 50) {
		knockout_prob = D.getStaminaLoss() + rand(-15, 15);
		if (D.stat != 2 && prob(knockout_prob)) {
			D.visible_message(`<span class='danger'>${A} has knocked ${D} out with a haymaker!</span>`, `<span class='userdanger'>${A} has knocked ${D} out with a haymaker!</span>`);
			yield* D.apply_effect(200, "knockdown", armor_block);
			yield* D.SetSleeping(100);
			yield* D.forcesay(GLOB.hit_appends);
			add_logs(A, D, "knocked out (boxing) ");
		} else if (D.lying) {
			yield* D.forcesay(GLOB.hit_appends);
		}
	}
	return 1;
}, true);

rt.type(7654, "/obj/item/clothing/gloves/boxing", "/obj/item/clothing/gloves", {
	style: null,
	name: "boxing gloves",
	desc: "Because you really needed another excuse to punch your crewmates.",
	icon_state: "boxing",
	item_state: "boxing",
	equip_delay_other: 60,
	species_exception: null,
});

// boxing.dm:51
rt.def("/obj/item/clothing/gloves/boxing/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.style = new_(T("/datum/martial_art/boxing"));

	this.species_exception = list(T("/datum/species/golem"));
	return f.dot;
});

// boxing.dm:54
rt.def("/obj/item/clothing/gloves/boxing/proc/equipped", function equipped(f: Frame, user: Value, slot: Value) {
	let H: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (slot == slot_gloves) {
		H = user;
		this.style.teach(H, 1);
	}
	return f.dot;
});

// boxing.dm:62
rt.def("/obj/item/clothing/gloves/boxing/proc/dropped", function dropped(f: Frame, user: Value) {
	let H: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if ((H = user).get_item_by_slot(slot_gloves) == this) {
		this.style.remove(H);
	}
	return f.dot;
});
