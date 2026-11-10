// Based on /tg/station's code/datums/diseases/wizarditis.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(971, "/datum/disease/wizarditis", "/datum/disease", {
	name: "Wizarditis",
	max_stages: 4,
	spread_text: "Airborne",
	cure_text: "The Manly Dorf",
	cures: null,
	cure_chance: 100,
	agent: "Rincewindus Vulgaris",
	disease_flags: 7,
	permeability_mod: 0.75,
	desc: "Some speculate that this virus is the cause of the Space Wizard Federation's existence. Subjects affected show the signs of mental retardation, yelling obscure sentences or total gibberish. On late stages subjects sometime express the feelings of inner power, and, cite, 'the ability to control the forces of cosmos themselves!' A gulp of strong, manly spirits usually reverts them to normal, humanlike, condition.",
	severity: "Harmful",
	viable_mobtypes: null,
	required_organs: null,
});

// wizarditis.dm:6
rt.def("/datum/disease/wizarditis/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("manlydorf");

	this.viable_mobtypes = list(T("/mob/living/carbon/human"));

	this.required_organs = list(T("/obj/item/bodypart/head"));
	return f.dot;
});

// wizarditis.dm:27
rt.def("/datum/disease/wizarditis/proc/stage_act", function* stage_act(f: Frame) {
	yield* parent_proc();
	if (this.stage === 2) {
		if (prob(1) && prob(50)) {
			yield* this.affected_mob.say(pick("You shall not pass!", "Expeliarmus!", "By Merlins beard!", "Feel the power of the Dark Side!"));
		}
		if (prob(1) && prob(50)) {
			to_chat(this.affected_mob, `<span class='danger'>You feel ${pick("that you don't have enough mana", "that the winds of magic are gone", "an urge to summon familiar")}.</span>`);
		}
	} else if (this.stage === 3) {
		if (prob(1) && prob(50)) {
			yield* this.affected_mob.say(pick("NEC CANTIO!", "AULIE OXIN FIERA!", "STI KALY!", "TARCOL MINTI ZHERI!"));
		}
		if (prob(1) && prob(50)) {
			to_chat(this.affected_mob, `<span class='danger'>You feel ${pick("the magic bubbling in your veins", "that this location gives you a +1 to INT", "an urge to summon familiar")}.</span>`);
		}
	} else if (this.stage === 4) {
		if (prob(1)) {
			yield* this.affected_mob.say(pick("NEC CANTIO!", "AULIE OXIN FIERA!", "STI KALY!", "EI NATH!"));
			return f.dot;
		}
		if (prob(1) && prob(50)) {
			to_chat(this.affected_mob, `<span class='danger'>You feel ${pick("the tidal wave of raw power building inside", "that this location gives you a +2 to INT and +1 to WIS", "an urge to teleport")}.</span>`);
			yield* this.spawn_wizard_clothes(50);
		}
		if (prob(1) && prob(1)) {
			yield* this.teleport();
		}
	}
	return f.dot;
}, true);

// wizarditis.dm:58
rt.def("/datum/disease/wizarditis/proc/spawn_wizard_clothes", function* spawn_wizard_clothes(f: Frame, chance: Value) {
	let H: Value = null, S: Value = null;
	chance ??= 0;
	if (rt.istype(this.affected_mob, T("/mob/living/carbon/human"))) {
		H = this.affected_mob;
		if (prob(chance)) {
			if (!rt.istype(H.head, T("/obj/item/clothing/head/wizard"))) {
				if (!(yield* H.dropItemToGround(H.head))) {
					yield* qdel(H.head);
				}
				yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/head/wizard"), H)), slot_head);
			}
			return f.dot;
		}
		if (prob(chance)) {
			if (!rt.istype(H.wear_suit, T("/obj/item/clothing/suit/wizrobe"))) {
				if (!(yield* H.dropItemToGround(H.wear_suit))) {
					yield* qdel(H.wear_suit);
				}
				yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/suit/wizrobe"), H)), slot_wear_suit);
			}
			return f.dot;
		}
		if (prob(chance)) {
			if (!rt.istype(H.shoes, T("/obj/item/clothing/shoes/sandal/magic"))) {
				if (!(yield* H.dropItemToGround(H.shoes))) {
					yield* qdel(H.shoes);
				}
			}
			yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/sandal/magic"), H)), slot_shoes);
			return f.dot;
		}
	} else {
		H = this.affected_mob;
		if (!prob(chance)) return f.dot;
		S = (yield* new_(T("/obj/item/weapon/staff"), H));
		if (yield* H.put_in_hands(S)) return f.dot;
		yield* qdel(S);
	}
	return f.dot;
}, true);

// wizarditis.dm:87
rt.def("/datum/disease/wizarditis/proc/teleport", function* teleport(f: Frame) {
	let S: Value = null, _T: Value = null, clear: Value = null, O: Value = null;
	let theareas: Value = get_areas_in_range(80, this.affected_mob);
	for (S of each(theareas, T("/area/space"))) {
		theareas -= S;
	}
	if (!theareas || !rt.len(f, theareas)) {
		return f.dot;
	}
	let thearea: Value = pick(theareas);
	let L: Value = list();
	for (_T of each(get_area_turfs(thearea.type), T("/turf"))) {
		if (_T.z != this.affected_mob.z) {
			continue;
		}
		if (_T.name == "space") {
			continue;
		}
		if (!_T.density) {
			clear = 1;
			O = null;
			for (O of each(_T, T("/obj"))) {
				if (O.density) {
					clear = 0;
					break;
				}
			}
			if (clear) {
				L += _T;
			}
		}
	}
	if (!L) {
		return f.dot;
	}
	yield* this.affected_mob.say(`SCYAR NILA ${uppertext(thearea.name)}!`);
	this.affected_mob.loc = pick(L);
	return f.dot;
}, true);
