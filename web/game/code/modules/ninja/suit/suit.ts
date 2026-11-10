// Based on /tg/station's code/modules/ninja/suit/suit.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7760, "/obj/item/clothing/suit/space/space_ninja", "/obj/item/clothing/suit/space", {
	affecting: null,
	cell: null,
	spark_system: null,
	reagent_list: null,
	stored_research: null,
	t_disk: null,
	energyKatana: null,
	n_hood: null,
	n_shoes: null,
	n_gloves: null,
	s_initialized: 0,
	s_coold: 0,
	s_cost: 5,
	s_acost: 25,
	s_delay: 40,
	a_transfer: 20,
	r_maxamount: 80,
	spideros: 0,
	s_active: 0,
	s_busy: 0,
	s_bombs: 10,
	a_boost: 3,
	name: "ninja suit",
	desc: "A unique, vaccum-proof suit of nano-enhanced armor designed specifically for Spider Clan assassins.",
	icon_state: "s-ninja",
	item_state: "s-ninja_suit",
	allowed: null,
	slowdown: 0,
	resistance_flags: 33,
	armor: null,
	strip_delay: 12,
	actions_types: null,
});

// suit.dm:32
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagent_list = list("omnizine", "salbutamol", "spaceacillin", "charcoal", "nutriment", "radium", "potass_iodide");

	this.stored_research = list();

	this.allowed = list(T("/obj/item/weapon/gun"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/stock_parts/cell"));
	this.armor = rt.alist(f, ["melee", 60, "bullet", 50, "laser", 30, "energy", 15, "bomb", 30, "bio", 30, "rad", 30, "fire", 100, "acid", 100]);

	this.actions_types = list(T("/datum/action/item_action/initialize_ninja_suit"), T("/datum/action/item_action/ninjasmoke"), T("/datum/action/item_action/ninjaboost"), T("/datum/action/item_action/ninjapulse"), T("/datum/action/item_action/ninjastar"), T("/datum/action/item_action/ninjanet"), T("/datum/action/item_action/ninja_sword_recall"), T("/datum/action/item_action/ninja_stealth"), T("/datum/action/item_action/toggle_glove"));
	return f.dot;
});

// suit.dm:64
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/New", function* New(f: Frame) {
	let _T: Value = null, reagent_amount: Value = null, reagent_id: Value = null;
	let $e: any;
	yield* parent_proc();
	this.spark_system = (yield* new_(T("/datum/effect_system/spark_spread")));
	yield* this.spark_system.set_up(5, 0, this);
	yield* this.spark_system.attach(this);
	this.stored_research = (yield* new_(T("/list")));
	for (_T of each(typesof(T("/datum/tech")) - T("/datum/tech"))) {
		this.stored_research += (yield* new_(_T, this));
	}
	for (reagent_id of each(this.reagent_list)) {
		reagent_amount += reagent_id == "radium" ? this.r_maxamount + this.a_boost * this.a_transfer : this.r_maxamount;
	}
	this.reagents = (yield* new_(T("/datum/reagents"), reagent_amount));
	this.reagents.my_atom = this;
	reagent_id = null;
	for (reagent_id of each(this.reagent_list)) {
		if (reagent_id == "radium") {
			yield* this.reagents.add_reagent(reagent_id, this.r_maxamount + this.a_boost * this.a_transfer);
		} else {
			yield* this.reagents.add_reagent(reagent_id, this.r_maxamount);
		}
	}
	this.cell = (yield* new_(T("/obj/item/weapon/stock_parts/cell/high")));
	this.cell.charge = 9000;
	this.cell.name = "black power cell";
	this.cell.icon_state = "bscell";
	return f.dot;
}, true);

// suit.dm:94
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/Destroy", function* Destroy(f: Frame) {
	if (this.affecting) {
		rt.op(f, "Browse", [], [this.affecting, null, "window=hack spideros"], false);
	}
	return (yield* parent_proc());
}, true);

// suit.dm:100
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/terminate", function* terminate(f: Frame) {
	yield* qdel(this.n_hood);
	yield* qdel(this.n_gloves);
	yield* qdel(this.n_shoes);
	yield* qdel(this);
	return f.dot;
}, true);

// suit.dm:108
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/randomize_param", function randomize_param(f: Frame) {
	this.s_cost = rand(1, 20);
	this.s_acost = rand(20, 100);
	this.s_delay = rand(10, 100);
	this.s_bombs = rand(5, 20);
	this.a_boost = rand(1, 7);
	return f.dot;
});

// suit.dm:117
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/lock_suit", function* lock_suit(f: Frame, H: Value) {
	if (!rt.istype(H, T("/mob/living/carbon/human"))) {
		return 0;
	}
	if (!is_ninja(H)) {
		to_chat(H, " <B>fÄTaL ÈÈRRoR</B>: 382200-*#00CÖDE <B>RED</B>\nUNAUHORIZED USÈ DETÈCeD\nCoMMÈNCING SUB-R0UIN3 13...\nTÈRMInATING U-U-USÈR...");
		yield* H.gib();
		return 0;
	}
	if (!rt.istype(H.head, T("/obj/item/clothing/head/helmet/space/space_ninja"))) {
		to_chat(H, "<span class='userdanger'>ERROR</span>: 100113 UNABLE TO LOCATE HEAD GEAR\nABORTING...");
		return 0;
	}
	if (!rt.istype(H.shoes, T("/obj/item/clothing/shoes/space_ninja"))) {
		to_chat(H, "<span class='userdanger'>ERROR</span>: 122011 UNABLE TO LOCATE FOOT GEAR\nABORTING...");
		return 0;
	}
	if (!rt.istype(H.gloves, T("/obj/item/clothing/gloves/space_ninja"))) {
		to_chat(H, "<span class='userdanger'>ERROR</span>: 110223 UNABLE TO LOCATE HAND GEAR\nABORTING...");
		return 0;
	}
	this.affecting = H;
	(rt.modSrcVar(f, "flags", NODROP, rt.bitOr));
	this.slowdown = 0;
	this.n_hood = H.head;
	(rt.modField(f, this.n_hood, "flags", NODROP, rt.bitOr));
	this.n_shoes = H.shoes;
	(rt.modField(f, this.n_shoes, "flags", NODROP, rt.bitOr));
	this.n_shoes.slowdown--;
	this.n_gloves = H.gloves;
	(rt.modField(f, this.n_gloves, "flags", NODROP, rt.bitOr));
	return 1;
}, true);

// suit.dm:145
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/lockIcons", function lockIcons(f: Frame, H: Value) {
	this.icon_state = H.gender == "female" ? "s-ninjanf" : "s-ninjan";
	H.gloves.icon_state = "s-ninjan";
	H.gloves.item_state = "s-ninjan";
	return f.dot;
});

// suit.dm:153
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/unlock_suit", function unlock_suit(f: Frame) {
	this.affecting = null;
	(rt.modSrcVar(f, "flags", 16777213, rt.bitAnd));
	this.slowdown = 1;
	this.icon_state = "s-ninja";
	if (this.n_hood) {
		(rt.modField(f, this.n_hood, "flags", 16777213, rt.bitAnd));
	}
	if (this.n_shoes) {
		(rt.modField(f, this.n_shoes, "flags", 16777213, rt.bitAnd));
		this.n_shoes.slowdown++;
	}
	if (!this.n_gloves) return f.dot;
	this.n_gloves.icon_state = "s-ninja";
	this.n_gloves.item_state = "s-ninja";
	(rt.modField(f, this.n_gloves, "flags", 16777213, rt.bitAnd));
	this.n_gloves.candrain = 0;
	this.n_gloves.draining = 0;
	return f.dot;
});

// suit.dm:170
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.s_initialized) return f.dot;
	if (user != this.affecting) return f.dot;
	to_chat(user, `All systems operational. Current energy capacity: <B>${this.cell.charge}</B>.`);
	let $0: any = user;
	to_chat($0, `The CLOAK-tech device is <B>${this.s_active ? "active" : "inactive"}</B>.`);
	to_chat(user, fmt("There are <B>＀</B> smoke bomb５ remaining.", [this.s_bombs]));
	to_chat(user, fmt("There are <B>＀</B> adrenaline booster５ remaining.", [this.a_boost]));
	return f.dot;
}, false);

// suit.dm:179
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value, action: Value) {
	if (rt.istype(action, T("/datum/action/item_action/initialize_ninja_suit"))) {
		yield* this.toggle_on_off();
		return 1;
	}
	if (!this.s_initialized) {
		to_chat(user, "<span class='warning'><b>ERROR</b>: suit offline.  Please activate suit.</span>");
		return 0;
	}
	if (rt.istype(action, T("/datum/action/item_action/ninjasmoke"))) {
		yield* this.ninjasmoke();
		return 1;
	}
	if (rt.istype(action, T("/datum/action/item_action/ninjaboost"))) {
		yield* this.ninjaboost();
		return 1;
	}
	if (rt.istype(action, T("/datum/action/item_action/ninjapulse"))) {
		yield* this.ninjapulse();
		return 1;
	}
	if (rt.istype(action, T("/datum/action/item_action/ninjastar"))) {
		yield* this.ninjastar();
		return 1;
	}
	if (rt.istype(action, T("/datum/action/item_action/ninjanet"))) {
		yield* this.ninjanet();
		return 1;
	}
	if (rt.istype(action, T("/datum/action/item_action/ninja_sword_recall"))) {
		yield* this.ninja_sword_recall();
		return 1;
	}
	if (rt.istype(action, T("/datum/action/item_action/ninja_stealth"))) {
		yield* this.stealth();
		return 1;
	}
	if (rt.istype(action, T("/datum/action/item_action/toggle_glove"))) {
		this.n_gloves.toggledrain();
		return 1;
	}
	return 0;
}, true);
