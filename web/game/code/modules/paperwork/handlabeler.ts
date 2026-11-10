// Based on /tg/station's code/modules/paperwork/handlabeler.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(7617, "/obj/item/weapon/hand_labeler", "/obj/item/weapon", {
	label: null,
	labels_left: 30,
	mode: 0,
	name: "hand labeler",
	desc: "A combined label printer and applicator in a portable device, designed to be easy to operate and use.",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "labeler0",
	item_state: "flight",
});

// handlabeler.dm:12
rt.def("/obj/item/weapon/hand_labeler/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	let A: Value = null, their_card: Value = null;
	user.visible_message(`<span class='suicide'>${user} is pointing ${this} at ${user.p_them()}self. ${user.p_theyre(1)} going to label ${user.p_them()}self as a suicide!</span>`);
	this.labels_left = max(this.labels_left - 1, 0);
	let old_real_name: Value = user.real_name;
	user.real_name += " (suicide)";
	for (A of each(user.GetAllContents(), T("/atom"))) {
		if (rt.istype(A, T("/obj/item/weapon/card/id"))) {
			if ((their_card = A).registered_name != old_real_name) {
				continue;
			}
			their_card.registered_name = user.real_name;
			their_card.update_label();
		}
	}
	user.mind.name += " (suicide)";
	this.mode = 1;
	this.icon_state = `labeler${this.mode}`;
	this.label = "suicide";
	return 8;
});

// handlabeler.dm:39
rt.def("/obj/item/weapon/hand_labeler/proc/afterattack", function afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	if (!proximity) {
		return f.dot;
	}
	if (!this.mode) {
		return f.dot;
	}
	if (!this.labels_left) {
		to_chat(user, "<span class='warning'>No labels left!</span>");
		return f.dot;
	}
	if (!this.label || !rt.length(this.label)) {
		to_chat(user, "<span class='warning'>No text set!</span>");
		return f.dot;
	}
	if (rt.length(A.name) + rt.length(this.label) > 64) {
		to_chat(user, "<span class='warning'>Label too big!</span>");
		return f.dot;
	}
	if (ismob(A)) {
		to_chat(user, "<span class='warning'>You can't label creatures!</span>");
		return f.dot;
	}
	user.visible_message(`${user} labels ${A} as ${this.label}.`, `<span class='notice'>You label ${A} as ${this.label}.</span>`);
	A.name = `${A.name} (${this.label})`;
	this.labels_left--;
	return f.dot;
});

// handlabeler.dm:63
rt.def("/obj/item/weapon/hand_labeler/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let str: Value = null;
	if (!user.IsAdvancedToolUser()) {
		to_chat(user, `<span class='warning'>You don't have the dexterity to use ${this}!</span>`);
		return f.dot;
	}
	this.mode = (!this.mode ? 1 : 0);
	this.icon_state = `labeler${this.mode}`;
	if (this.mode) {
		to_chat(user, `<span class='notice'>You turn on ${this}.</span>`);
		if (!(str = copytext(reject_bad_text((yield* g.op(f, "Prompt", [2], ["", "Set label", "Label text?", user, null]))), 1, 42)) || !rt.length(str)) {
			to_chat(user, "<span class='warning'>Invalid text!</span>");
			return f.dot;
		}
		this.label = str;
		to_chat(user, `<span class='notice'>You set the text to '${str}'.</span>`);
	} else {
		to_chat(user, `<span class='notice'>You turn off ${this}.</span>`);
	}
	return f.dot;
}, true);

// handlabeler.dm:81
rt.def("/obj/item/weapon/hand_labeler/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	yield* parent_proc();
	if (!rt.istype(I, T("/obj/item/hand_labeler_refill"))) return f.dot;
	to_chat(user, `<span class='notice'>You insert ${I} into ${this}.</span>`);
	yield* qdel(I);
	this.labels_left = rt.initial(f, this, "labels_left");
	return f.dot;
}, true);

rt.type(7618, "/obj/item/weapon/hand_labeler/borg", "/obj/item/weapon/hand_labeler", {
	name: "cyborg-hand labeler",
});

// handlabeler.dm:91
rt.def("/obj/item/weapon/hand_labeler/borg/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let diff: Value = null;
	yield* parent_proc(A, user, proximity);
	if (!rt.istype(user, T("/mob/living/silicon/robot"))) {
		return f.dot;
	}
	let borgy: Value = user;
	let starting_labels: Value = rt.initial(f, this, "labels_left");
	if (!(diff = starting_labels - this.labels_left)) return f.dot;
	this.labels_left = starting_labels;
	let cost: Value = diff * 50;
	if (!borgy.cell) return f.dot;
	yield* borgy.cell.use(cost);
	return f.dot;
}, true);
