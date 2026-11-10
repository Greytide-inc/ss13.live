// Based on /tg/station's code/modules/clothing/neck/neck.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(8600, "/obj/item/clothing/neck/stethoscope", "/obj/item/clothing/neck", {
	name: "stethoscope",
	desc: "An outdated medical apparatus for listening to the sounds of the human body. It also makes you look like you know what you're doing.",
	icon_state: "stethoscope",
	item_color: "stethoscope",
});

// neck.dm:38
rt.def("/obj/item/clothing/neck/stethoscope/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let body_part: Value = null, heart_strength: Value = null, lung_strength: Value = null, heart: Value = null, lungs: Value = null, diagnosis: Value = null;
	let $0: any;
	if (rt.istype(M, T("/mob/living/carbon/human")) && rt.istype(user, T("/mob/living"))) {
		if (user.a_intent == "help") {
			body_part = parse_zone(user.zone_selected);
			heart_strength = "<span class='danger'>no</span>";
			lung_strength = "<span class='danger'>no</span>";
			heart = M.getorganslot("heart");
			lungs = M.getorganslot("lungs");
			if (!(M.stat == 2 || rt.bitAnd(M.status_flags, FAKEDEATH))) {
				if (heart && rt.istype(heart, T("/obj/item/organ/heart"))) {
					heart_strength = "<span class='danger'>an unstable</span>";
					if (heart.beating) {
						heart_strength = "a healthy";
					}
				}
				if (lungs && rt.istype(lungs, T("/obj/item/organ/lungs"))) {
					lung_strength = "<span class='danger'>strained</span>";
					if (!(M.failed_last_breath || M.losebreath)) {
						lung_strength = "healthy";
					}
				}
			}
			if (body_part == "chest") {
				$0 = `You hear ${heart_strength} pulse and ${lung_strength} respiration.`;
			} else {
				$0 = `You faintly hear ${heart_strength} pulse.`;
			}
			diagnosis = $0;
			user.visible_message(`${user} places ${this} against ${M}'s ${body_part} and listens attentively.`, `<span class='notice'>You place ${this} against ${M}'s ${body_part}. ${diagnosis}</span>`);
			return f.dot;
		}
	}
	return (yield* parent_proc(M, user));
}, true);

rt.type(8615, "/obj/item/clothing/neck/petcollar", "/obj/item/clothing/neck", {
	tagname: null,
	name: "pet collar",
	desc: "It's for pets. Though you probably could wear it yourself, you'd doubtless be the subject of ridicule.",
	icon_state: "petcollar",
	item_color: "petcollar",
});

// neck.dm:153
rt.def("/obj/item/clothing/neck/petcollar/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	this.tagname = copytext(sanitize((yield* g.op(f, "Prompt", [3], ["Spot", "Name your new pet", "Would you like to change the name on the tag?", user, null]))), 1, 42);
	this.name = `${rt.initial(f, this, "name")} - ${this.tagname}`;
	return f.dot;
}, true);
