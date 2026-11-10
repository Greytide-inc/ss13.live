// Based on /tg/station's code/modules/reagents/reagent_containers/borghydro.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(6508, "/obj/item/weapon/reagent_containers/borghypo", "/obj/item/weapon/reagent_containers", {
	mode: 1,
	charge_cost: 50,
	charge_tick: 0,
	recharge_time: 5,
	bypass_protection: 0,
	reagent_list: null,
	reagent_ids: null,
	accepts_reagent_upgrades: 1,
	modes: null,
	amount_per_transfer_from_this: 5,
	volume: 30,
	possible_transfer_amounts: null,
	name: "cyborg hypospray",
	desc: "An advanced chemical synthesizer and injection system, designed for heavy-duty medical equipment.",
	icon: rt.rsc("icons/obj/syringe.dmi"),
	item_state: "hypo",
	icon_state: "borghypo",
});

// borghydro.dm:19
rt.def("/obj/item/weapon/reagent_containers/borghypo/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_transfer_amounts = list();

	this.reagent_list = list();
	this.reagent_ids = list("dexalin", "kelotane", "bicaridine", "antitoxin", "epinephrine", "spaceacillin", "salglu_solution");

	this.modes = list();
	return f.dot;
});

// borghydro.dm:34
rt.def("/obj/item/weapon/reagent_containers/borghypo/proc/Initialize", function* Initialize(f: Frame) {
	let R: Value = null;
	f.dot = (yield* parent_proc());
	for (R of each(this.reagent_ids)) {
		yield* this.add_reagent(R);
	}
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// borghydro.dm:43
rt.def("/obj/item/weapon/reagent_containers/borghypo/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return (yield* parent_proc());
}, true);

// borghydro.dm:48
rt.def("/obj/item/weapon/reagent_containers/borghypo/proc/process", function* process(f: Frame) {
	this.charge_tick++;
	if (this.charge_tick >= this.recharge_time) {
		yield* this.regenerate_reagents();
		this.charge_tick = 0;
	}
	return 1;
}, true, { waitfor: false });

// borghydro.dm:66
rt.def("/obj/item/weapon/reagent_containers/borghypo/proc/add_reagent", function* add_reagent(f: Frame, reagent: Value) {
	let RG: Value = null, R: Value = null;
	(rt.modSrcVar(f, "reagent_ids", reagent, rt.bitOr));
	(RG = (yield* new_(T("/datum/reagents"), 30))).my_atom = this;
	this.reagent_list += RG;
	yield* (R = rt.index(this.reagent_list, rt.len(f, this.reagent_list))).add_reagent(reagent, 30);
	rt.setAt(this.modes, reagent, rt.len(f, this.modes) + 1);
	return f.dot;
}, true);

// borghydro.dm:77
rt.def("/obj/item/weapon/reagent_containers/borghypo/proc/regenerate_reagents", function* regenerate_reagents(f: Frame) {
	let R: Value = null, i: Value = null, RG: Value = null;
	let $e: any;
	if (!rt.istype(this.loc, T("/mob/living/silicon/robot"))) return f.dot;
	if (!((R = this.loc) && R.cell)) return f.dot;
	rt.forRange(f, 0, 1, rt.len(f, this.reagent_ids), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if ((RG = rt.index(this.reagent_list, i)).total_volume < RG.maximum_volume) {
			yield* R.cell.use(this.charge_cost);
			yield* RG.add_reagent(rt.index(this.reagent_ids, i), 5);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// borghydro.dm:87
rt.def("/obj/item/weapon/reagent_containers/borghypo/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let R: Value = null, fraction: Value = null, trans: Value = null, RG: Value = null;
	if (!(R = rt.index(this.reagent_list, this.mode)).total_volume) {
		to_chat(user, "<span class='notice'>The injector is empty.</span>");
		return f.dot;
	}
	if (!rt.istype(M, T("/mob/living/carbon"))) {
		return f.dot;
	}
	if (R.total_volume && (yield* M.can_inject(user, 1, user.zone_selected, this.bypass_protection))) {
		to_chat(M, "<span class='warning'>You feel a tiny prick!</span>");
		to_chat(user, `<span class='notice'>You inject ${M} with the injector.</span>`);
		fraction = min(this.amount_per_transfer_from_this / R.total_volume, 1);
		yield* R.reaction(M, INJECT, fraction);
		if (M.reagents) {
			trans = (yield* R.trans_to(M, this.amount_per_transfer_from_this));
			to_chat(user, fmt("<span class='notice'>＀ unit５ injected.  ＀ unit５ remaining.</span>", [trans, R.total_volume]));
		}
	}
	let injected: Value = list();
	for (RG of each(R.reagent_list, T("/datum/reagent"))) {
		injected += RG.name;
	}
	add_logs(user, M, "injected", this, `(CHEMICALS: ${english_list(injected)})`);
	return f.dot;
}, true);

// borghydro.dm:108
rt.def("/obj/item/weapon/reagent_containers/borghypo/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let chosen_reagent: Value = null;
	if (!(chosen_reagent = rt.index(this.modes, (yield* g.op(f, "Prompt", [1], [null, null, "What reagent do you want to dispense?", user, this.reagent_ids]))))) {
		return f.dot;
	}
	this.mode = chosen_reagent;
	playsound(this.loc, rt.rsc("sound/effects/pop.ogg"), 50, 0);
	let R: Value = rt.index(GLOB.chemical_reagents_list, rt.index(this.reagent_ids, this.mode));
	to_chat(user, `<span class='notice'>${this} is now dispensing '${R.name}'.</span>`);
	return f.dot;
}, true);

// borghydro.dm:118
rt.def("/obj/item/weapon/reagent_containers/borghypo/proc/examine", function examine(f: Frame, user: Value) {
	f.usr = user;
	parent_proc();
	this.DescribeContents();
	return f.dot;
}, false);

// borghydro.dm:125
rt.def("/obj/item/weapon/reagent_containers/borghypo/proc/DescribeContents", function DescribeContents(f: Frame) {
	let RS: Value = null, R: Value = null;
	let empty: Value = 1;
	for (RS of each(this.reagent_list, T("/datum/reagents"))) {
		if (R = rt.locateIn(f, T("/datum/reagent"), RS.reagent_list)) {
			to_chat(f.usr, fmt("<span class='notice'>It currently has ＀ unit５ of ＀ stored.</span>", [R.volume, R.name]));
			empty = 0;
		}
	}
	if (!empty) return f.dot;
	to_chat(f.usr, "<span class='warning'>It is currently empty! Allow some time for the internal syntheszier to produce more.</span>");
	return f.dot;
});

rt.type(6511, "/obj/item/weapon/reagent_containers/borghypo/borgshaker", "/obj/item/weapon/reagent_containers/borghypo", {
	possible_transfer_amounts: null,
	charge_cost: 20,
	recharge_time: 3,
	accepts_reagent_upgrades: 0,
	reagent_ids: null,
	name: "cyborg shaker",
	desc: "An advanced drink synthesizer and mixer.",
	icon: rt.rsc("icons/obj/drinks.dmi"),
	icon_state: "shaker",
});

// borghydro.dm:168
rt.def("/obj/item/weapon/reagent_containers/borghypo/borgshaker/proc/regenerate_reagents", function* regenerate_reagents(f: Frame) {
	let R: Value = null, i: Value = null, valueofi: Value = null, RG: Value = null;
	if (!rt.istype(this.loc, T("/mob/living/silicon/robot"))) return f.dot;
	if (!((R = this.loc) && R.cell)) return f.dot;
	for (i of each(this.modes)) {
		valueofi = rt.index(this.modes, i);
		if ((RG = rt.index(this.reagent_list, valueofi)).total_volume < RG.maximum_volume) {
			yield* R.cell.use(this.charge_cost);
			yield* RG.add_reagent(rt.index(this.reagent_ids, valueofi), 5);
		}
	}
	return f.dot;
}, true);

// borghydro.dm:179
rt.def("/obj/item/weapon/reagent_containers/borghypo/borgshaker/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let R: Value = null, trans: Value = null;
	if (!proximity) {
		return f.dot;
	} else {
		if (!(target.is_open_container() && target.reagents)) return f.dot;
		if (!(R = rt.index(this.reagent_list, this.mode)).total_volume) {
			to_chat(user, `<span class='warning'>${this} is currently out of this ingredient! Please allow some time for the synthesizer to produce more.</span>`);
			return f.dot;
		}
		if (target.reagents.total_volume >= target.reagents.maximum_volume) {
			to_chat(user, `<span class='notice'>${target} is full.</span>`);
			return f.dot;
		}
		trans = (yield* R.trans_to(target, this.amount_per_transfer_from_this));
		to_chat(user, fmt("<span class='notice'>You transfer ＀ unit５ of the solution to ＀.</span>", [trans, target]));
	}
	return f.dot;
}, true);

// borghydro.dm:197
rt.def("/obj/item/weapon/reagent_containers/borghypo/borgshaker/proc/DescribeContents", function DescribeContents(f: Frame) {
	let R: Value = null;
	let empty: Value = 1;
	let RS: Value = rt.index(this.reagent_list, this.mode);
	if (R = rt.locateIn(f, T("/datum/reagent"), RS.reagent_list)) {
		to_chat(f.usr, fmt("<span class='notice'>It currently has ＀ unit５ of ＀ stored.</span>", [R.volume, R.name]));
		empty = 0;
	}
	if (!empty) return f.dot;
	to_chat(f.usr, "<span class='warning'>It is currently empty! Please allow some time for the synthesizer to produce more.</span>");
	return f.dot;
});

rt.type(6512, "/obj/item/weapon/reagent_containers/borghypo/borgshaker/hacked", "/obj/item/weapon/reagent_containers/borghypo/borgshaker", {
	possible_transfer_amounts: null,
	charge_cost: 20,
	recharge_time: 3,
	accepts_reagent_upgrades: 0,
	reagent_ids: null,
	name: "cyborg shaker",
	desc: "Will mix drinks that knock them dead.",
	icon: rt.rsc("icons/obj/drinks.dmi"),
	icon_state: "threemileislandglass",
});

// borghydro.dm:217
rt.def("/obj/item/weapon/reagent_containers/borghypo/borgshaker/hacked/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_transfer_amounts = list(5, 10, 20);

	this.reagent_ids = list("beer2");
	return f.dot;
});

rt.type(6515, "/obj/item/weapon/reagent_containers/borghypo/epi", "/obj/item/weapon/reagent_containers/borghypo", {
	reagent_ids: null,
	accepts_reagent_upgrades: 0,
	name: "epinephrine injector",
	desc: "An advanced chemical synthesizer and injection system, designed to stabilize patients..",
});

// borghydro.dm:234
rt.def("/obj/item/weapon/reagent_containers/borghypo/epi/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagent_ids = list("epinephrine");
	return f.dot;
});
