// Based on /tg/station's code/modules/reagents/reagent_containers/pill.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(6528, "/obj/item/weapon/reagent_containers/pill", "/obj/item/weapon/reagent_containers", {
	apply_type: 2,
	apply_method: "swallow",
	roundstart: 0,
	self_delay: 0,
	possible_transfer_amounts: null,
	volume: 50,
	name: "pill",
	desc: "A tablet or capsule.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "pill",
	item_state: "pill",
});

// pill.dm:7
rt.def("/obj/item/weapon/reagent_containers/pill/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_transfer_amounts = list();
	return f.dot;
});

// pill.dm:15
rt.def("/obj/item/weapon/reagent_containers/pill/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!this.icon_state) {
		this.icon_state = `pill${rand(1, 20)}`;
	}
	if (!(this.reagents.total_volume && this.roundstart)) return f.dot;
	this.name += ` (${this.reagents.total_volume}u)`;
	return f.dot;
}, true);

// pill.dm:27
rt.def("/obj/item/weapon/reagent_containers/pill/proc/attack", function* attack(f: Frame, M: Value, user: Value, def_zone: Value) {
	if (!this.canconsume(M, user)) {
		return 0;
	}
	if (M == user) {
		M.visible_message(`<span class='notice'>${user} attempts to ${this.apply_method} ${this}.</span>`);
		if (this.self_delay) {
			if (!(yield* do_mob(user, M, this.self_delay))) {
				return 0;
			}
		}
		to_chat(M, `<span class='notice'>You ${this.apply_method} ${this}.</span>`);
	} else {
		M.visible_message(`<span class='danger'>${user} attempts to force ${M} to ${this.apply_method} ${this}.</span>`, `<span class='userdanger'>${user} attempts to force ${M} to ${this.apply_method} ${this}.</span>`);
		if (!(yield* do_mob(user, M))) {
			return 0;
		}
		M.visible_message(`<span class='danger'>${user} forces ${M} to ${this.apply_method} ${this}.</span>`, `<span class='userdanger'>${user} forces ${M} to ${this.apply_method} ${this}.</span>`);
	}
	add_logs(user, M, "fed", this.reagentlist(this));
	if (this.reagents.total_volume) {
		yield* this.reagents.reaction(M, this.apply_type);
		yield* this.reagents.trans_to(M, this.reagents.total_volume);
	}
	yield* qdel(this);
	return 1;
}, true);

// pill.dm:55
rt.def("/obj/item/weapon/reagent_containers/pill/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let O: Value = null;
	if (!proximity) {
		return f.dot;
	}
	if (!(target.is_open_container() != 0 && target.reagents)) return f.dot;
	if (!target.reagents.total_volume) {
		to_chat(user, `<span class='warning'>${target} is empty! There's nothing to dissolve ${this} in.</span>`);
		return f.dot;
	}
	to_chat(user, `<span class='notice'>You dissolve ${this} in ${target}.</span>`);
	for (O of each(viewers(2, user), T("/mob"))) {
		to_chat(O, `<span class='warning'>${user} slips something into ${target}!</span>`);
	}
	yield* this.reagents.trans_to(target, this.reagents.total_volume);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(6532, "/obj/item/weapon/reagent_containers/pill/tox", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "toxins pill",
	desc: "Highly toxic.",
	icon_state: "pill5",
});

// pill.dm:70
rt.def("/obj/item/weapon/reagent_containers/pill/tox/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["toxin", 50]);
	return f.dot;
});

rt.type(6533, "/obj/item/weapon/reagent_containers/pill/cyanide", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "cyanide pill",
	desc: "Don't swallow this.",
	icon_state: "pill5",
});

// pill.dm:76
rt.def("/obj/item/weapon/reagent_containers/pill/cyanide/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["cyanide", 50]);
	return f.dot;
});

rt.type(6534, "/obj/item/weapon/reagent_containers/pill/adminordrazine", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "adminordrazine pill",
	desc: "It's magic. We don't have to explain it.",
	icon_state: "pill16",
});

// pill.dm:82
rt.def("/obj/item/weapon/reagent_containers/pill/adminordrazine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["adminordrazine", 50]);
	return f.dot;
});

rt.type(6535, "/obj/item/weapon/reagent_containers/pill/morphine", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "morphine pill",
	desc: "Commonly used to treat insomnia.",
	icon_state: "pill8",
});

// pill.dm:88
rt.def("/obj/item/weapon/reagent_containers/pill/morphine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["morphine", 30]);
	return f.dot;
});

rt.type(6536, "/obj/item/weapon/reagent_containers/pill/stimulant", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "stimulant pill",
	desc: "Often taken by overworked employees, athletes, and the inebriated. You'll snap to attention immediately!",
	icon_state: "pill19",
});

// pill.dm:94
rt.def("/obj/item/weapon/reagent_containers/pill/stimulant/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["ephedrine", 10, "antihol", 10, "coffee", 30]);
	return f.dot;
});

rt.type(6537, "/obj/item/weapon/reagent_containers/pill/salbutamol", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "salbutamol pill",
	desc: "Used to treat oxygen deprivation.",
	icon_state: "pill16",
});

// pill.dm:100
rt.def("/obj/item/weapon/reagent_containers/pill/salbutamol/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["salbutamol", 30]);
	return f.dot;
});

rt.type(6538, "/obj/item/weapon/reagent_containers/pill/charcoal", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "charcoal pill",
	desc: "Neutralizes many common toxins.",
	icon_state: "pill17",
});

// pill.dm:106
rt.def("/obj/item/weapon/reagent_containers/pill/charcoal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["charcoal", 10]);
	return f.dot;
});

rt.type(6539, "/obj/item/weapon/reagent_containers/pill/epinephrine", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "epinephrine pill",
	desc: "Used to stabilize patients.",
	icon_state: "pill5",
});

// pill.dm:112
rt.def("/obj/item/weapon/reagent_containers/pill/epinephrine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["epinephrine", 15]);
	return f.dot;
});

rt.type(6540, "/obj/item/weapon/reagent_containers/pill/mannitol", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "mannitol pill",
	desc: "Used to treat brain damage.",
	icon_state: "pill17",
});

// pill.dm:118
rt.def("/obj/item/weapon/reagent_containers/pill/mannitol/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["mannitol", 50]);
	return f.dot;
});

rt.type(6541, "/obj/item/weapon/reagent_containers/pill/mutadone", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "mutadone pill",
	desc: "Used to treat genetic damage.",
	icon_state: "pill20",
});

// pill.dm:124
rt.def("/obj/item/weapon/reagent_containers/pill/mutadone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["mutadone", 50]);
	return f.dot;
});

rt.type(6542, "/obj/item/weapon/reagent_containers/pill/salicyclic", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "salicylic acid pill",
	desc: "Used to dull pain.",
	icon_state: "pill9",
});

// pill.dm:130
rt.def("/obj/item/weapon/reagent_containers/pill/salicyclic/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["sal_acid", 24]);
	return f.dot;
});

rt.type(6543, "/obj/item/weapon/reagent_containers/pill/oxandrolone", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "oxandrolone pill",
	desc: "Used to stimulate burn healing.",
	icon_state: "pill11",
});

// pill.dm:136
rt.def("/obj/item/weapon/reagent_containers/pill/oxandrolone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["oxandrolone", 24]);
	return f.dot;
});

rt.type(6544, "/obj/item/weapon/reagent_containers/pill/insulin", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "insulin pill",
	desc: "Handles hyperglycaemic coma.",
	icon_state: "pill18",
});

// pill.dm:143
rt.def("/obj/item/weapon/reagent_containers/pill/insulin/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["insulin", 50]);
	return f.dot;
});

rt.type(6545, "/obj/item/weapon/reagent_containers/pill/shadowtoxin", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	name: "black pill",
	desc: "I wouldn't eat this if I were you.",
	icon_state: "pill9",
	color: "#454545",
});

// pill.dm:151
rt.def("/obj/item/weapon/reagent_containers/pill/shadowtoxin/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["shadowmutationtoxin", 1]);
	return f.dot;
});
