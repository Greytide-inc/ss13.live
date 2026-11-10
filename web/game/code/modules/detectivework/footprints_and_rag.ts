// Based on /tg/station's code/modules/detectivework/footprints_and_rag.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(6391, "/obj/item/weapon/reagent_containers/glass/rag", "/obj/item/weapon/reagent_containers/glass", {
	flags: 4,
	container_type: 4096,
	name: "damp rag",
	desc: "For cleaning up messes, you suppose.",
	w_class: 1,
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "rag",
	amount_per_transfer_from_this: 5,
	possible_transfer_amounts: null,
	volume: 5,
	spillable: 0,
});

// footprints_and_rag.dm:18
rt.def("/obj/item/weapon/reagent_containers/glass/rag/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_transfer_amounts = list();
	return f.dot;
});

// footprints_and_rag.dm:23
rt.def("/obj/item/weapon/reagent_containers/glass/rag/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is smothering ${user.p_them()}self with ${this}! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	return 8;
});

// footprints_and_rag.dm:27
rt.def("/obj/item/weapon/reagent_containers/glass/rag/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let C: Value = null, reagentlist: Value = null;
	if (!proximity) {
		return f.dot;
	}
	if (rt.istype(A, T("/mob/living/carbon")) && A.reagents && this.reagents.total_volume) {
		C = A;
		reagentlist = pretty_string_from_reagent_list(this.reagents);
		if (user.a_intent == "harm" && !C.is_mouth_covered()) {
			yield* this.reagents.reaction(C, INGEST);
			yield* this.reagents.trans_to(C, this.reagents.total_volume);
			C.visible_message(fmt("<span class='danger'>＀ has smothered ％！ with ％！!</span>", [user, C, this]), fmt("<span class='userdanger'>＀ has smothered you with ％！!</span>", [user, this]), "<span class='italics'>You hear some struggling and muffled cries of surprise.</span>");
			log_game(`${key_name(user)} smothered ${key_name(A)} with a damp rag containing ${reagentlist}`);
			log_attack(`${key_name(user)} smothered ${key_name(A)} with a damp rag containing ${reagentlist}`);
		} else {
			yield* this.reagents.reaction(C, 1);
			yield* this.reagents.clear_reagents();
			log_game(`${key_name(user)} touched ${key_name(A)} with a damp rag containing ${reagentlist}`);
			log_attack(`${key_name(user)} touched ${key_name(A)} with a damp rag containing ${reagentlist}`);
			C.visible_message(fmt("<span class='notice'>＀ has touched ％！ with ％！.</span>", [user, C, this]));
		}
	} else if (rt.isIn(f, ((rt.istype(A, T("/atom")) ? 1 : 0) && this), user)) {
		user.visible_message(`${user} starts to wipe down ${A} with ${this}!`, `<span class='notice'>You start to wipe down ${A} with ${this}...</span>`);
		if (yield* do_after(user, 30, { target: A })) {
			user.visible_message(`${user} finishes wiping off the ${A}!`, `<span class='notice'>You finish wiping off the ${A}.</span>`);
			A.clean_blood();
			A.wash_cream();
		}
	}
	return f.dot;
}, true);
