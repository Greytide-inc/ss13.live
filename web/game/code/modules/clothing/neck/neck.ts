// From code/modules/clothing/neck/neck.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8600, "/obj/item/clothing/neck/stethoscope", "/obj/item/clothing/neck", {
	name: "stethoscope",
	desc: "An outdated medical apparatus for listening to the sounds of the human body. It also makes you look like you know what you're doing.",
	icon_state: "stethoscope",
	item_color: "stethoscope",
});

// /obj/item/clothing/neck/stethoscope/proc/attack  (code/modules/clothing/neck/neck.dm:38)  may sleep
rt.def("/obj/item/clothing/neck/stethoscope/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let body_part: Value = null, heart_strength: Value = null, lung_strength: Value = null, heart: Value = null, lungs: Value = null, diagnosis: Value = null;
	let $0: any;
	f.vars = () => [M, user, body_part, heart_strength, lung_strength, heart, lungs, diagnosis, $0];
	if ((truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0)))) {
		if (isEqual(rt.fv(f, "a_intent", live(user)), "help")) {
			body_part = (yield* g.call(f, P("/proc/parse_zone"), null, [rt.fv(f, "zone_selected", live(user))]));
			heart_strength = "<span class='danger'>no</span>";
			lung_strength = "<span class='danger'>no</span>";
			heart = (yield* g.callName(f, live(M), "getorganslot", ["heart"]));
			lungs = (yield* g.callName(f, live(M), "getorganslot", ["lungs"]));
			if (!(isEqual(rt.fv(f, "stat", live(M)), 2) || truthy(rt.bitAnd(rt.fv(f, "status_flags", live(M)), 8192)))) {
				if ((truthy(live(heart)) && truthy((rt.istype(live(heart), T("/obj/item/organ/heart")) ? 1 : 0)))) {
					heart_strength = "<span class='danger'>an unstable</span>";
					if (truthy(rt.fv(f, "beating", live(heart)))) {
						heart_strength = "a healthy";
					}
				}
				if ((truthy(live(lungs)) && truthy((rt.istype(live(lungs), T("/obj/item/organ/lungs")) ? 1 : 0)))) {
					lung_strength = "<span class='danger'>strained</span>";
					if (!(truthy(rt.fv(f, "failed_last_breath", live(M))) || truthy(rt.fv(f, "losebreath", live(M))))) {
						lung_strength = "healthy";
					}
				}
			}
			if (isEqual(live(body_part), "chest")) {
				$0 = fmt("You hear ＀ pulse and ＀ respiration.", [live(heart_strength), live(lung_strength)]);
			} else {
				$0 = fmt("You faintly hear ＀ pulse.", [live(heart_strength)]);
			}
			diagnosis = $0;
			yield* g.callName(f, live(user), "visible_message", [fmt("＀ places ＀ against ＀'s ＀ and listens attentively.", [live(user), live(f.src), live(M), live(body_part)]), fmt("<span class='notice'>You place ＀ against ＀'s ＀. ＀</span>", [live(f.src), live(M), live(body_part), live(diagnosis)])]);
			return live(f.dot);
		}
	}
	return (yield* g.callSuper(f, [live(M), live(user)]));
}, true);

rt.type(8615, "/obj/item/clothing/neck/petcollar", "/obj/item/clothing/neck", {
	tagname: null,
	name: "pet collar",
	desc: "It's for pets. Though you probably could wear it yourself, you'd doubtless be the subject of ridicule.",
	icon_state: "petcollar",
	item_color: "petcollar",
});

// /obj/item/clothing/neck/petcollar/proc/attack_self  (code/modules/clothing/neck/neck.dm:153)  may sleep
rt.def("/obj/item/clothing/neck/petcollar/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	rt.setSv(f, "tagname", (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [3], ["Spot", "Name your new pet", "Would you like to change the name on the tag?", live(user), null]))])), 1, 42])));
	rt.setSv(f, "name", fmt("＀ - ＀", [rt.initial(f, live(f.src), "name"), rt.sv(f, "tagname")]));
	return f.dot;
}, true);
