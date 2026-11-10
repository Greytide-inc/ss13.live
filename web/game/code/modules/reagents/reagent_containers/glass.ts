// Based on /tg/station's code/modules/reagents/reagent_containers/glass.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(6390, "/obj/item/weapon/reagent_containers/glass", "/obj/item/weapon/reagent_containers", {
	container_type: 4096,
	name: "glass",
	amount_per_transfer_from_this: 10,
	possible_transfer_amounts: null,
	volume: 50,
	spillable: 1,
	resistance_flags: 32,
});

// glass.dm:12
rt.def("/obj/item/weapon/reagent_containers/glass/proc/attack", function* attack(f: Frame, M: Value, user: Value, target: Value) {
	let R: Value = null, A: Value = null, fraction: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	if (!this.canconsume(M, user)) {
		return f.dot;
	}
	if (!this.spillable) {
		return f.dot;
	}
	if (!this.reagents || !this.reagents.total_volume) {
		to_chat(user, `<span class='warning'>${this} is empty!</span>`);
		return f.dot;
	}
	if (!rt.istype(M, T("/mob"))) return f.dot;
	if (user.a_intent == "harm") {
		M.visible_message(`<span class='danger'>${user} splashes the contents of ${this} onto ${M}!</span>`, `<span class='userdanger'>${user} splashes the contents of ${this} onto ${M}!</span>`);
		if (this.reagents) {
			for (A of each(this.reagents.reagent_list, T("/datum/reagent"))) {
				R += A.id + " (";
				R += num2text(A.volume) + "),";
			}
		}
		if (isturf(target) && rt.len(f, this.reagents.reagent_list) && this.thrownby) {
			add_logs(this.thrownby, target, `splashed ${english_list(this.reagents.reagent_list)}`, `at ${target}${`(${target.x},${target.y},${target.z})`}`);
			log_game(`${key_name(this.thrownby)} splashed ${english_list(this.reagents.reagent_list)} at ${`(${target.x},${target.y},${target.z})`}.`);
			$0 = key_name_admin(this.thrownby);
			$1 = english_list(this.reagents.reagent_list);
			if (target) {
				$2 = `${`(${target.x},${target.y},${target.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${target.x};Y=${target.y};Z=${target.z}'>JMP</a>)`}`;
			} else {
				$2 = "nonexistent location";
			}
			message_admins(`${$0} splashed ${$1} at ${`${$2}`}.`);
		}
		yield* this.reagents.reaction(M, TOUCH);
		add_logs(user, M, "splashed", R);
		yield* this.reagents.clear_reagents();
	} else {
		if (M != user) {
			M.visible_message(`<span class='danger'>${user} attempts to feed something to ${M}.</span>`, `<span class='userdanger'>${user} attempts to feed something to you.</span>`);
			if (!(yield* do_mob(user, M))) {
				return f.dot;
			}
			if (!this.reagents || !this.reagents.total_volume) {
				return f.dot;
			}
			M.visible_message(`<span class='danger'>${user} feeds something to ${M}.</span>`, `<span class='userdanger'>${user} feeds something to you.</span>`);
			add_logs(user, M, "fed", this.reagentlist(this));
		} else {
			to_chat(user, `<span class='notice'>You swallow a gulp of ${this}.</span>`);
		}
		fraction = min(5 / this.reagents.total_volume, 1);
		yield* this.reagents.reaction(M, INGEST, fraction);
		rt.spawnTail(f, 5, "/obj/item/weapon/reagent_containers/glass/proc/attack: spawn at modules/reagents/reagent_containers/glass.dm:52", M, user, target, R, A, fraction);
		playsound(M.loc, rt.rsc("sound/items/drink.ogg"), rand(10, 50), 1);
	}
	return f.dot;
}, true);

// a spawn(5) body of /obj/item/weapon/reagent_containers/glass/proc/attack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/reagent_containers/glass/proc/attack: spawn at modules/reagents/reagent_containers/glass.dm:52", function* (f: Frame, M: Value, user: Value, target: Value, R: Value, A: Value, fraction: Value) {
	yield* this.reagents.trans_to(M, 5);
	return null;
});

// glass.dm:57
rt.def("/obj/item/weapon/reagent_containers/glass/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let trans: Value = null;
	if (!proximity || !(yield* this.check_allowed_items(target, { target_self: 1 }))) {
		return f.dot;
	} else if (rt.istype(target, T("/obj/structure/reagent_dispensers"))) {
		if (target.reagents && !target.reagents.total_volume) {
			to_chat(user, `<span class='warning'>${target} is empty and can't be refilled!</span>`);
			return f.dot;
		}
		if (this.reagents.total_volume >= this.reagents.maximum_volume) {
			to_chat(user, `<span class='notice'>${this} is full.</span>`);
			return f.dot;
		}
		trans = (yield* target.reagents.trans_to(this, this.amount_per_transfer_from_this));
		to_chat(user, fmt("<span class='notice'>You fill ＀ with ＀ unit５ of the contents of ＀.</span>", [this, trans, target]));
	} else if (target.is_open_container() && target.reagents) {
		if (!this.reagents.total_volume) {
			to_chat(user, `<span class='warning'>${this} is empty!</span>`);
			return f.dot;
		}
		if (target.reagents.total_volume >= target.reagents.maximum_volume) {
			to_chat(user, `<span class='notice'>${target} is full.</span>`);
			return f.dot;
		}
		trans = (yield* this.reagents.trans_to(target, this.amount_per_transfer_from_this));
		to_chat(user, fmt("<span class='notice'>You transfer ＀ unit５ of the solution to ＀.</span>", [trans, target]));
	} else {
		if (!this.reagents.total_volume) return f.dot;
		if (user.a_intent != "harm") return f.dot;
		user.visible_message(`<span class='danger'>${user} splashes the contents of ${this} onto ${target}!</span>`, `<span class='notice'>You splash the contents of ${this} onto ${target}.</span>`);
		yield* this.reagents.reaction(target, TOUCH);
		yield* this.reagents.clear_reagents();
	}
	return f.dot;
}, true);

// glass.dm:93
rt.def("/obj/item/weapon/reagent_containers/glass/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let hotness: Value = null, added_heat: Value = null, E: Value = null;
	if (hotness = I.is_hot()) {
		added_heat = hotness / 100;
		if (this.reagents) {
			if (this.reagents.chem_temp < hotness) {
				this.reagents.chem_temp += added_heat;
				to_chat(user, `<span class='notice'>You heat ${this} with ${I}.</span>`);
				yield* this.reagents.handle_reactions();
			} else {
				to_chat(user, `<span class='warning'>${this} is already hotter than ${I}!</span>`);
			}
		}
	}
	if (rt.istype(I, T("/obj/item/weapon/reagent_containers/food/snacks/egg"))) {
		E = I;
		if (this.reagents) {
			if (this.reagents.total_volume >= this.reagents.maximum_volume) {
				to_chat(user, `<span class='notice'>${this} is full.</span>`);
			} else {
				to_chat(user, `<span class='notice'>You break ${E} in ${this}.</span>`);
				yield* this.reagents.add_reagent("eggyolk", 5);
				yield* qdel(E);
			}
			return f.dot;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(6454, "/obj/item/weapon/reagent_containers/glass/beaker", "/obj/item/weapon/reagent_containers/glass", {
	name: "beaker",
	desc: "A beaker. It can hold up to 50 units.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "beaker",
	item_state: "beaker",
	materials: null,
});

// glass.dm:123
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 500]);
	return f.dot;
});

// glass.dm:126
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.update_icon();
	return f.dot;
}, true);

// glass.dm:130
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	this.update_icon();
	return f.dot;
});

// glass.dm:133
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/proc/update_icon", function update_icon(f: Frame) {
	let percent: Value = null;
	this.cut_overlays();
	if (!this.reagents.total_volume) return f.dot;
	let filling: Value = mutable_appearance(rt.rsc("icons/obj/reagentfillings.dmi"), `${this.icon_state}10`);
	const subject = (percent = round(this.reagents.total_volume / this.volume * 100));
	if (rt.inRange(subject, 0, 9)) {
		filling.icon_state = `${this.icon_state}-10`;
	} else if (rt.inRange(subject, 10, 24)) {
		filling.icon_state = `${this.icon_state}10`;
	} else if (rt.inRange(subject, 25, 49)) {
		filling.icon_state = `${this.icon_state}25`;
	} else if (rt.inRange(subject, 50, 74)) {
		filling.icon_state = `${this.icon_state}50`;
	} else if (rt.inRange(subject, 75, 79)) {
		filling.icon_state = `${this.icon_state}75`;
	} else if (rt.inRange(subject, 80, 90)) {
		filling.icon_state = `${this.icon_state}80`;
	} else if (rt.inRange(subject, 91, 1e+31)) {
		filling.icon_state = `${this.icon_state}100`;
	}
	filling.color = mix_color_from_reagents(this.reagents.reagent_list);
	this.add_overlay(filling);
	return f.dot;
});

rt.type(6456, "/obj/item/weapon/reagent_containers/glass/beaker/large", "/obj/item/weapon/reagent_containers/glass/beaker", {
	flags: 4096,
	name: "large beaker",
	desc: "A large beaker. Can hold up to 100 units.",
	icon_state: "beakerlarge",
	materials: null,
	volume: 100,
	amount_per_transfer_from_this: 10,
	possible_transfer_amounts: null,
});

// glass.dm:168
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 2500]);
	this.possible_transfer_amounts = list(5, 10, 15, 20, 25, 30, 50, 100);
	return f.dot;
});

rt.type(6486, "/obj/item/weapon/reagent_containers/glass/beaker/noreact", "/obj/item/weapon/reagent_containers/glass/beaker", {
	flags: 4096,
	name: "cryostasis beaker",
	desc: "A cryostasis beaker that allows for chemical storage without reactions. Can hold up to 50 units.",
	icon_state: "beakernoreact",
	materials: null,
	volume: 50,
	amount_per_transfer_from_this: 10,
	origin_tech: "materials=2;engineering=3;plasmatech=3",
});

// glass.dm:179
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/noreact/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 3000]);
	return f.dot;
});

// glass.dm:186
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/noreact/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.reagents.set_reacting(0);
	return f.dot;
}, true);

rt.type(6487, "/obj/item/weapon/reagent_containers/glass/beaker/bluespace", "/obj/item/weapon/reagent_containers/glass/beaker", {
	flags: 4096,
	name: "bluespace beaker",
	desc: "A bluespace beaker, powered by experimental bluespace technology and Element Cuban combined with the Compound Pete. Can hold up to 300 units.",
	icon_state: "beakerbluespace",
	materials: null,
	volume: 300,
	amount_per_transfer_from_this: 10,
	possible_transfer_amounts: null,
	origin_tech: "bluespace=5;materials=4;plasmatech=4",
});

// glass.dm:195
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/bluespace/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 3000]);
	this.possible_transfer_amounts = list(5, 10, 15, 20, 25, 30, 50, 100, 300);
	return f.dot;
});

rt.type(6488, "/obj/item/weapon/reagent_containers/glass/beaker/cryoxadone", "/obj/item/weapon/reagent_containers/glass/beaker", {
	list_reagents: null,
});

// glass.dm:203
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/cryoxadone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["cryoxadone", 30]);
	return f.dot;
});

rt.type(6489, "/obj/item/weapon/reagent_containers/glass/beaker/sulphuric", "/obj/item/weapon/reagent_containers/glass/beaker", {
	list_reagents: null,
});

// glass.dm:206
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/sulphuric/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["sacid", 50]);
	return f.dot;
});

rt.type(6490, "/obj/item/weapon/reagent_containers/glass/beaker/slime", "/obj/item/weapon/reagent_containers/glass/beaker", {
	list_reagents: null,
});

// glass.dm:209
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/slime/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["slimejelly", 50]);
	return f.dot;
});

rt.type(6457, "/obj/item/weapon/reagent_containers/glass/beaker/large/styptic", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "styptic reserve tank",
	list_reagents: null,
});

// glass.dm:213
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/styptic/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["styptic_powder", 50]);
	return f.dot;
});

rt.type(6458, "/obj/item/weapon/reagent_containers/glass/beaker/large/silver_sulfadiazine", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "silver sulfadiazine reserve tank",
	list_reagents: null,
});

// glass.dm:217
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/silver_sulfadiazine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["silver_sulfadiazine", 50]);
	return f.dot;
});

rt.type(6459, "/obj/item/weapon/reagent_containers/glass/beaker/large/charcoal", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "antitoxin reserve tank",
	list_reagents: null,
});

// glass.dm:221
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/charcoal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["charcoal", 50]);
	return f.dot;
});

rt.type(6460, "/obj/item/weapon/reagent_containers/glass/beaker/large/epinephrine", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "epinephrine reserve tank",
	list_reagents: null,
});

// glass.dm:225
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/epinephrine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["epinephrine", 50]);
	return f.dot;
});

rt.type(6491, "/obj/item/weapon/reagent_containers/glass/beaker/synthflesh", "/obj/item/weapon/reagent_containers/glass/beaker", {
	list_reagents: null,
});

// glass.dm:228
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/synthflesh/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["synthflesh", 50]);
	return f.dot;
});

rt.type(6496, "/obj/item/weapon/reagent_containers/glass/bucket", "/obj/item/weapon/reagent_containers/glass", {
	flags: 4096,
	name: "bucket",
	desc: "It's a bucket.",
	icon: rt.rsc("icons/obj/janitor.dmi"),
	icon_state: "bucket",
	item_state: "bucket",
	materials: null,
	w_class: 3,
	amount_per_transfer_from_this: 20,
	possible_transfer_amounts: null,
	volume: 70,
	flags_inv: 256,
	slot_flags: 64,
	resistance_flags: 0,
	armor: null,
	slot_equipment_priority: null,
});

// glass.dm:236
rt.def("/obj/item/weapon/reagent_containers/glass/bucket/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 200]);
	this.possible_transfer_amounts = list(10, 15, 20, 25, 30, 50, 70);
	this.armor = rt.alist(f, ["melee", 10, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 75, "acid", 50]);
	this.slot_equipment_priority = list(1, 6, 14, 13, 2, 11, 10, 12, 9, 7, 8, 5, 17, 15, 16, 20);
	return f.dot;
});

// glass.dm:258
rt.def("/obj/item/weapon/reagent_containers/glass/bucket/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (rt.istype(O, T("/obj/item/weapon/mop"))) {
		if (this.reagents.total_volume < 1) {
			to_chat(user, `<span class='warning'>${this} is out of water!</span>`);
		} else {
			yield* this.reagents.trans_to(O, 5);
			to_chat(user, `<span class='notice'>You wet ${O} in ${this}.</span>`);
			playsound(this.loc, rt.rsc("sound/effects/slosh.ogg"), 25, 1);
		}
	} else if (rt.istype(O, T("/obj/item/device/assembly/prox_sensor"))) {
		to_chat(user, `<span class='notice'>You add ${O} to ${this}.</span>`);
		yield* qdel(O);
		yield* qdel(this);
		yield* user.put_in_hands((yield* new_(T("/obj/item/weapon/bucket_sensor"))));
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// glass.dm:274
rt.def("/obj/item/weapon/reagent_containers/glass/bucket/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	yield* parent_proc();
	if (!(slot == slot_head && this.reagents.total_volume)) return f.dot;
	to_chat(user, `<span class='userdanger'>${this}'s contents spill all over you!</span>`);
	yield* this.reagents.reaction(user, TOUCH);
	yield* this.reagents.clear_reagents();
	return f.dot;
}, true);

// glass.dm:281
rt.def("/obj/item/weapon/reagent_containers/glass/bucket/proc/equip_to_best_slot", function* equip_to_best_slot(f: Frame, M: Value) {
	let index: Value = null;
	if (this.reagents.total_volume) {
		index = this.slot_equipment_priority.Find(slot_head);
		yield* this.slot_equipment_priority.Remove(slot_head);
		f.dot = (yield* parent_proc());
		yield* this.slot_equipment_priority.Insert(index, slot_head);
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

rt.type(6492, "/obj/item/weapon/reagent_containers/glass/beaker/waterbottle", "/obj/item/weapon/reagent_containers/glass/beaker", {
	name: "bottle of water",
	desc: "A bottle of water filled at an old Earth bottling facility,",
	icon: rt.rsc("icons/obj/drinks.dmi"),
	icon_state: "smallbottle",
	item_state: "bottle",
	list_reagents: null,
	materials: null,
	volume: 50,
	amount_per_transfer_from_this: 10,
	origin_tech: null,
});

// glass.dm:295
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/waterbottle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["water", 49.5, "fluorine", 0.5]);
	this.materials = rt.alist(f, ["$glass", 0]);
	return f.dot;
});

rt.type(6493, "/obj/item/weapon/reagent_containers/glass/beaker/waterbottle/empty", "/obj/item/weapon/reagent_containers/glass/beaker/waterbottle", {
	list_reagents: null,
});

// glass.dm:302
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/waterbottle/empty/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = list();
	return f.dot;
});

rt.type(6494, "/obj/item/weapon/reagent_containers/glass/beaker/waterbottle/large", "/obj/item/weapon/reagent_containers/glass/beaker/waterbottle", {
	desc: "A fresh commercial-sized bottle of water.",
	icon_state: "largebottle",
	materials: null,
	list_reagents: null,
	volume: 100,
	amount_per_transfer_from_this: 20,
});

// glass.dm:307
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/waterbottle/large/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 0]);
	this.list_reagents = rt.alist(f, ["water", 100]);
	return f.dot;
});

rt.type(6495, "/obj/item/weapon/reagent_containers/glass/beaker/waterbottle/large/empty", "/obj/item/weapon/reagent_containers/glass/beaker/waterbottle/large", {
	list_reagents: null,
});

// glass.dm:313
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/waterbottle/large/empty/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = list();
	return f.dot;
});

rt.type(6461, "/obj/item/weapon/reagent_containers/glass/beaker/large/hydrogen", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "hydrogen",
	list_reagents: null,
});

// glass.dm:317
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/hydrogen/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["hydrogen", 50]);
	return f.dot;
});

rt.type(6462, "/obj/item/weapon/reagent_containers/glass/beaker/large/lithium", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "lithium",
	list_reagents: null,
});

// glass.dm:321
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/lithium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["lithium", 50]);
	return f.dot;
});

rt.type(6463, "/obj/item/weapon/reagent_containers/glass/beaker/large/carbon", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "carbon",
	list_reagents: null,
});

// glass.dm:325
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/carbon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["carbon", 50]);
	return f.dot;
});

rt.type(6464, "/obj/item/weapon/reagent_containers/glass/beaker/large/nitrogen", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "nitrogen",
	list_reagents: null,
});

// glass.dm:329
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/nitrogen/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["nitrogen", 50]);
	return f.dot;
});

rt.type(6465, "/obj/item/weapon/reagent_containers/glass/beaker/large/oxygen", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "oxygen",
	list_reagents: null,
});

// glass.dm:333
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/oxygen/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["oxygen", 50]);
	return f.dot;
});

rt.type(6466, "/obj/item/weapon/reagent_containers/glass/beaker/large/fluorine", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "fluorine",
	list_reagents: null,
});

// glass.dm:337
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/fluorine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["fluorine", 50]);
	return f.dot;
});

rt.type(6467, "/obj/item/weapon/reagent_containers/glass/beaker/large/sodium", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "sodium",
	list_reagents: null,
});

// glass.dm:341
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/sodium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["sodium", 50]);
	return f.dot;
});

rt.type(6468, "/obj/item/weapon/reagent_containers/glass/beaker/large/aluminium", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "aluminium",
	list_reagents: null,
});

// glass.dm:345
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/aluminium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["aluminium", 50]);
	return f.dot;
});

rt.type(6469, "/obj/item/weapon/reagent_containers/glass/beaker/large/silicon", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "silicon",
	list_reagents: null,
});

// glass.dm:349
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/silicon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["silicon", 50]);
	return f.dot;
});

rt.type(6470, "/obj/item/weapon/reagent_containers/glass/beaker/large/phosphorus", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "phosphorus",
	list_reagents: null,
});

// glass.dm:353
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/phosphorus/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["phosphorus", 50]);
	return f.dot;
});

rt.type(6471, "/obj/item/weapon/reagent_containers/glass/beaker/large/sulfur", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "sulfur",
	list_reagents: null,
});

// glass.dm:357
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/sulfur/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["sulfur", 50]);
	return f.dot;
});

rt.type(6472, "/obj/item/weapon/reagent_containers/glass/beaker/large/chlorine", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "chlorine",
	list_reagents: null,
});

// glass.dm:361
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/chlorine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["chlorine", 50]);
	return f.dot;
});

rt.type(6473, "/obj/item/weapon/reagent_containers/glass/beaker/large/potassium", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "potassium",
	list_reagents: null,
});

// glass.dm:365
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/potassium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["potassium", 50]);
	return f.dot;
});

rt.type(6474, "/obj/item/weapon/reagent_containers/glass/beaker/large/iron", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "iron",
	list_reagents: null,
});

// glass.dm:369
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/iron/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["iron", 50]);
	return f.dot;
});

rt.type(6475, "/obj/item/weapon/reagent_containers/glass/beaker/large/copper", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "copper",
	list_reagents: null,
});

// glass.dm:373
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/copper/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["copper", 50]);
	return f.dot;
});

rt.type(6476, "/obj/item/weapon/reagent_containers/glass/beaker/large/mercury", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "mercury",
	list_reagents: null,
});

// glass.dm:377
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/mercury/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["mercury", 50]);
	return f.dot;
});

rt.type(6477, "/obj/item/weapon/reagent_containers/glass/beaker/large/radium", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "radium",
	list_reagents: null,
});

// glass.dm:381
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/radium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["radium", 50]);
	return f.dot;
});

rt.type(6478, "/obj/item/weapon/reagent_containers/glass/beaker/large/water", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "water",
	list_reagents: null,
});

// glass.dm:385
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/water/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["water", 50]);
	return f.dot;
});

rt.type(6479, "/obj/item/weapon/reagent_containers/glass/beaker/large/ethanol", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "ethanol",
	list_reagents: null,
});

// glass.dm:389
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/ethanol/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["ethanol", 50]);
	return f.dot;
});

rt.type(6480, "/obj/item/weapon/reagent_containers/glass/beaker/large/sugar", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "sugar",
	list_reagents: null,
});

// glass.dm:393
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/sugar/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["sugar", 50]);
	return f.dot;
});

rt.type(6481, "/obj/item/weapon/reagent_containers/glass/beaker/large/sacid", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "sacid",
	list_reagents: null,
});

// glass.dm:397
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/sacid/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["sacid", 50]);
	return f.dot;
});

rt.type(6482, "/obj/item/weapon/reagent_containers/glass/beaker/large/welding_fuel", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "welding_fuel",
	list_reagents: null,
});

// glass.dm:401
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/welding_fuel/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["welding_fuel", 50]);
	return f.dot;
});

rt.type(6483, "/obj/item/weapon/reagent_containers/glass/beaker/large/silver", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "silver",
	list_reagents: null,
});

// glass.dm:405
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/silver/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["silver", 50]);
	return f.dot;
});

rt.type(6484, "/obj/item/weapon/reagent_containers/glass/beaker/large/iodine", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "iodine",
	list_reagents: null,
});

// glass.dm:409
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/iodine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["iodine", 50]);
	return f.dot;
});

rt.type(6485, "/obj/item/weapon/reagent_containers/glass/beaker/large/bromine", "/obj/item/weapon/reagent_containers/glass/beaker/large", {
	name: "bromine",
	list_reagents: null,
});

// glass.dm:413
rt.def("/obj/item/weapon/reagent_containers/glass/beaker/large/bromine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["bromine", 50]);
	return f.dot;
});
