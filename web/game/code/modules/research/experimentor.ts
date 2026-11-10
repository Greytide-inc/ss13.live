// Based on /tg/station's code/modules/research/experimentor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(10972, "/obj/machinery/r_n_d/experimentor", "/obj/machinery/r_n_d", {
	recentlyExperimented: 0,
	trackedIan: null,
	trackedRuntime: null,
	badThingCoeff: 0,
	resetTime: 15,
	cloneMode: 0,
	cloneCount: 0,
	item_reactions: null,
	valid_items: null,
	critical_items: null,
	anchored: 1,
	use_power: 1,
	name: "１E.X.P.E.R.I-MENTOR",
	desc: "A \"replacement\" for the deconstructive analyzer with a slight tendency to catastrophically fail.",
	icon: rt.rsc("icons/obj/machines/heavy_lathe.dmi"),
	icon_state: "h_lathe",
	density: 1,
});

// experimentor.dm:33
rt.def("/obj/machinery/r_n_d/experimentor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.item_reactions = list();

	this.valid_items = list();

	this.critical_items = list();
	return f.dot;
});

// experimentor.dm:38
rt.def("/obj/machinery/r_n_d/experimentor/proc/ConvertReqString2List", function ConvertReqString2List(f: Frame, source_list: Value) {
	let O: Value = null;
	let temp_list: Value = params2list(source_list);
	for (O of each(temp_list)) {
		rt.setAt(temp_list, O, text2num(rt.index(temp_list, O)));
	}
	return temp_list;
});

// experimentor.dm:59
rt.def("/obj/machinery/r_n_d/experimentor/proc/SetTypeReactions", function SetTypeReactions(f: Frame) {
	let I: Value = null, tempCheck: Value = null;
	let probWeight: Value = 0;
	for (I of each(typesof(T("/obj/item")))) {
		if (rt.istype(I, T("/obj/item/weapon/relic"))) {
			rt.setAt(this.item_reactions, `${I}`, 7);
		} else {
			rt.setAt(this.item_reactions, `${I}`, pick(1, 2, 3, 4, 5, 6));
		}
		if (ispath(I, T("/obj/item/weapon/stock_parts")) || ispath(I, T("/obj/item/weapon/grenade/chem_grenade")) || ispath(I, T("/obj/item/weapon/kitchen"))) {
			if (rt.initial(f, (tempCheck = I), "icon_state") !== null) {
				this.valid_items += 15;
				this.valid_items += I;
				probWeight++;
			}
		}
		if (ispath(I, T("/obj/item/weapon/reagent_containers/food"))) {
			if (rt.initial(f, (tempCheck = I), "icon_state") !== null) {
				this.valid_items += rand(1, max(2, 35 - probWeight));
				this.valid_items += I;
			}
		}
		if (ispath(I, T("/obj/item/weapon/construction/rcd")) || ispath(I, T("/obj/item/weapon/grenade")) || ispath(I, T("/obj/item/device/aicard")) || ispath(I, T("/obj/item/weapon/storage/backpack/holding")) || ispath(I, T("/obj/item/slime_extract")) || ispath(I, T("/obj/item/device/onetankbomb")) || ispath(I, T("/obj/item/device/transfer_valve"))) {
			if (rt.initial(f, (tempCheck = I), "icon_state") !== null) {
				this.critical_items += I;
			}
		}
	}
	return f.dot;
});

// experimentor.dm:84
rt.def("/obj/machinery/r_n_d/experimentor/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.dot = (yield* parent_proc());
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/experimentor"), null))).apply_default_parts(this);
	this.trackedIan = rt.locateIn(f, T("/mob/living/simple_animal/pet/dog/corgi/Ian"), GLOB.mob_list);
	this.trackedRuntime = rt.locateIn(f, T("/mob/living/simple_animal/pet/cat/Runtime"), GLOB.mob_list);
	this.SetTypeReactions();
	return f.dot;
}, true);

rt.type(6781, "/obj/item/weapon/circuitboard/machine/experimentor", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "E.X.P.E.R.I-MENTOR (Machine Board)",
	build_path: rt.typePath("/obj/machinery/r_n_d/experimentor"),
	origin_tech: "magnets=1;engineering=1;programming=1;biotech=1;bluespace=2",
});

// experimentor.dm:96
rt.def("/obj/item/weapon/circuitboard/machine/experimentor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/scanning_module"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 2, T("/obj/item/weapon/stock_parts/micro_laser"), 2]);
	return f.dot;
});

// experimentor.dm:102
rt.def("/obj/machinery/r_n_d/experimentor/proc/RefreshParts", function RefreshParts(f: Frame) {
	let M: Value = null;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		if (this.resetTime > 0 && this.resetTime - M.rating >= 1) {
			this.resetTime -= M.rating;
		}
	}
	M = null;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/scanning_module"))) {
		this.badThingCoeff += M.rating * 2;
	}
	M = null;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/micro_laser"))) {
		this.badThingCoeff += M.rating;
	}
	return f.dot;
});

// experimentor.dm:112
rt.def("/obj/machinery/r_n_d/experimentor/proc/checkCircumstances", function checkCircumstances(f: Frame, O: Value) {
	let _T: Value = null;
	if (rt.istype(O, T("/obj/item/device/transfer_valve"))) {
		if (!(_T = O).tank_one || !_T.tank_two || !_T.attached_device) {
			return 0;
		}
	}
	return 1;
});

// experimentor.dm:119
rt.def("/obj/machinery/r_n_d/experimentor/proc/Insert_Item", function* Insert_Item(f: Frame, O: Value, user: Value) {
	let temp_tech: Value = null;
	if (user.a_intent == "harm") return f.dot;
	f.dot = 1;
	if (!this.is_insertion_ready(user)) {
		return f.dot;
	}
	if (!this.checkCircumstances(O)) {
		to_chat(user, `<span class='warning'>The ${O} is not yet valid for the ${this} and must be completed!</span>`);
		return f.dot;
	}
	if (!O.origin_tech) {
		to_chat(user, "<span class='warning'>This doesn't seem to have a tech origin!</span>");
		return f.dot;
	}
	if (rt.len(f, (temp_tech = this.ConvertReqString2List(O.origin_tech))) == 0) {
		to_chat(user, "<span class='warning'>You cannot experiment on this item!</span>");
		return f.dot;
	}
	if (!(yield* user.drop_item())) {
		return f.dot;
	}
	this.loaded_item = O;
	O.loc = this;
	to_chat(user, `<span class='notice'>You add the ${O.name} to the machine.</span>`);
	flick("h_lathe_load", this);
	return f.dot;
}, true);

// experimentor.dm:143
rt.def("/obj/machinery/r_n_d/experimentor/proc/default_deconstruction_crowbar", function* default_deconstruction_crowbar(f: Frame, O: Value) {
	yield* this.ejectItem();
	yield* parent_proc(O);
	return f.dot;
}, true);

// experimentor.dm:147
rt.def("/obj/machinery/r_n_d/experimentor/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let D: Value = null, _T: Value = null, popup: Value = null;
	yield* user.set_machine(this);
	let dat: Value = "<center>";
	if (!this.linked_console) {
		dat += fmt("<b><a href='byond://?src=＃;function=search'>Scan for R&D Console</A></b><br>", [this]);
	}
	if (this.loaded_item) {
		dat += `<b>Loaded Item:</b> ${this.loaded_item}<br>`;
		dat += "<b>Technology</b>:<br>";
		D = this.ConvertReqString2List(this.loaded_item.origin_tech);
		for (_T of each(D)) {
			dat += `${_T}<br>`;
		}
		dat += "<br><br>Available tests:";
		dat += fmt("<br><b><a href='byond://?src=＃;item=＃;function=＀'>Poke</A></b>", [this, this.loaded_item, 1]);
		dat += fmt("<br><b><a href='byond://?src=＃;item=＃;function=＀;'>Irradiate</A></b>", [this, this.loaded_item, 2]);
		dat += fmt("<br><b><a href='byond://?src=＃;item=＃;function=＀'>Gas</A></b>", [this, this.loaded_item, 3]);
		dat += fmt("<br><b><a href='byond://?src=＃;item=＃;function=＀'>Burn</A></b>", [this, this.loaded_item, 4]);
		dat += fmt("<br><b><a href='byond://?src=＃;item=＃;function=＀'>Freeze</A></b>", [this, this.loaded_item, 5]);
		dat += fmt("<br><b><a href='byond://?src=＃;item=＃;function=＀'>Destroy</A></b><br>", [this, this.loaded_item, 6]);
		if (rt.istype(this.loaded_item, T("/obj/item/weapon/relic"))) {
			dat += fmt("<br><b><a href='byond://?src=＃;item=＃;function=＀'>Discover</A></b><br>", [this, this.loaded_item, 7]);
		}
		dat += fmt("<br><b><a href='byond://?src=＃;function=eject'>Eject</A>", [this]);
	} else {
		dat += "<b>Nothing loaded.</b>";
	}
	dat += fmt("<br><a href='byond://?src=＃;function=refresh'>Refresh</A><br>", [this]);
	dat += fmt("<br><a href='byond://?src=＃;close=1'>Close</A><br></center>", [this]);
	(popup = (yield* new_(T("/datum/browser"), user, "experimentor", "Experimentor", 700, 400, this))).set_content(dat);
	yield* popup.open();
	onclose(user, "experimentor");
	return f.dot;
}, true);

// experimentor.dm:178
rt.def("/obj/machinery/r_n_d/experimentor/proc/matchReaction", function matchReaction(f: Frame, matching: Value, reaction: Value) {
	let D: Value = null, tor: Value = null;
	if (D = matching) {
		if (this.item_reactions.Find(`${D.type}`)) {
			if ((tor = rt.index(this.item_reactions, `${D.type}`)) == text2num(reaction)) {
				return tor;
			} else {
				return 8;
			}
		} else {
			return 8;
		}
	} else {
		return 8;
	}
});

// experimentor.dm:193
rt.def("/obj/machinery/r_n_d/experimentor/proc/ejectItem", function* ejectItem(f: Frame, _delete: Value) {
	let type_to_make: Value = null, dropturf: Value = null;
	_delete ??= 0;
	if (!this.loaded_item) return f.dot;
	if (this.cloneMode && this.cloneCount > 0) {
		this.visible_message(`<span class='notice'>A duplicate ${this.loaded_item} pops out!</span>`);
		type_to_make = this.loaded_item.type;
		yield* new_(type_to_make, rt.getStep(f, pick(oview(1, this)), 0));
		--this.cloneCount;
		if (this.cloneCount == 0) {
			this.cloneMode = 0;
		}
		return f.dot;
	}
	if (!(dropturf = rt.getStep(f, pick(view(1, this)), 0))) {
		dropturf = rt.getStep(f, this, 0);
	}
	this.loaded_item.loc = dropturf;
	if (_delete) {
		yield* qdel(this.loaded_item);
	}
	this.loaded_item = null;
	return f.dot;
}, true);

// experimentor.dm:210
rt.def("/obj/machinery/r_n_d/experimentor/proc/throwSmoke", function* throwSmoke(f: Frame, where: Value) {
	let smoke: Value = null;
	yield* (smoke = (yield* new_(T("/datum/effect_system/smoke_spread")))).set_up(0, where);
	yield* smoke.start();
	return f.dot;
}, true);

// experimentor.dm:217
rt.def("/obj/machinery/r_n_d/experimentor/proc/pickWeighted", function pickWeighted(f: Frame, from: Value) {
	let probtocheck: Value = null;
	let result: Value = 0;
	let counter: Value = 1;
	while (!result) {
		if (prob((probtocheck = rt.index(from, counter)))) {
			result = 1;
			return rt.index(from, counter + 1);
		}
		if (counter + 2 < rt.len(f, from)) {
			counter = counter + 2;
		} else {
			counter = 1;
		}
	}
	return f.dot;
});

// experimentor.dm:229
rt.def("/obj/machinery/r_n_d/experimentor/proc/experiment", function* experiment(f: Frame, exp: Value, exp_on: Value) {
	let chosenchem: Value = null, m: Value = null, target: Value = null, throwing: Value = null, _T: Value = null, reagentdecal: Value = null, savedName: Value = null, newPath: Value = null, CG: Value = null, R: Value = null, smoke: Value = null, C: Value = null, start: Value = null, M: Value = null, MT: Value = null, FB: Value = null, env: Value = null, transfer_moles: Value = null, removed: Value = null, heat_capacity: Value = null, smoke_2: Value = null, material: Value = null, AM: Value = null, throwAt: Value = null, AM_3: Value = null, counter: Value = null, cast: Value = null, a: Value = null, b: Value = null, globalMalf: Value = null, m_3: Value = null;
	let $e: any;
	this.recentlyExperimented = 1;
	this.icon_state = "h_lathe_wloop";
	let criticalReaction: Value = rt.isIn(f, exp_on.type, this.critical_items) ? 1 : 0;
	if (exp == 1) {
		this.visible_message(`${this} prods at ${exp_on} with mechanical arms.`);
		if (prob(35) && criticalReaction) {
			this.visible_message(`${exp_on} is gripped in just the right way, enhancing its focus.`);
			this.badThingCoeff++;
		} else if (prob(20 - this.badThingCoeff)) {
			this.visible_message(`<span class='danger'>${this} malfunctions and destroys ${exp_on}, lashing its arms out at nearby people!</span>`);
			for (m of each(oview(1, this), T("/mob/living"))) {
				yield* m.apply_damage(15, "brute", pick("head", "chest", "groin"));
				this.investigate_log(`Experimentor dealt minor brute to ${m}.`, "experimentor");
			}
			yield* this.ejectItem(1);
		} else if (prob(35 - this.badThingCoeff)) {
			this.visible_message(`<span class='warning'>${this} malfunctions!</span>`);
			exp = 6;
		} else if (prob(50 - this.badThingCoeff)) {
			this.visible_message(`<span class='danger'>${this} malfunctions, throwing the ${exp_on}!</span>`);
			if (target = rt.locateIn(f, T("/mob/living"), oview(7, this))) {
				throwing = this.loaded_item;
				this.investigate_log(`Experimentor has thrown ${this.loaded_item} at ${target}`, "experimentor");
				yield* this.ejectItem();
				if (throwing) {
					yield* throwing.throw_at(target, 10, 1);
				}
			}
		}
	}
	if (exp == 2) {
		this.visible_message(`<span class='danger'>${this} reflects radioactive rays at ${exp_on}!</span>`);
		if (prob(35) && criticalReaction) {
			this.visible_message(`${exp_on} has activated an unknown subroutine!`);
			this.cloneMode = 1;
			this.cloneCount = this.badThingCoeff;
			this.investigate_log(`Experimentor has made a clone of ${exp_on}`, "experimentor");
			yield* this.ejectItem();
		} else if (prob(20 - this.badThingCoeff)) {
			this.visible_message(`<span class='danger'>${this} malfunctions, melting ${exp_on} and leaking radiation!</span>`);
			yield* radiation_pulse(rt.getStep(f, this, 0), 1, 1, 25, 1);
			yield* this.ejectItem(1);
		} else if (prob(35 - this.badThingCoeff)) {
			this.visible_message(`<span class='warning'>${this} malfunctions, spewing toxic waste!</span>`);
			for (_T of each(oview(1, this), T("/turf"))) {
				if (!_T.density) {
					if (prob(95)) {
						yield* (reagentdecal = (yield* new_(T("/obj/effect/decal/cleanable/greenglow"), _T))).reagents.add_reagent("radium", 7);
					}
				}
			}
		} else if (prob(50 - this.badThingCoeff)) {
			savedName = `${exp_on}`;
			yield* this.ejectItem(1);
			newPath = this.pickWeighted(this.valid_items);
			this.loaded_item = (yield* new_(newPath, this));
			this.visible_message(`<span class='warning'>${this} malfunctions, transforming ${savedName} into ${this.loaded_item}!</span>`);
			this.investigate_log(`Experimentor has transformed ${savedName} into ${this.loaded_item}`, "experimentor");
			if (rt.istype(this.loaded_item, T("/obj/item/weapon/grenade/chem_grenade"))) {
				yield* (CG = this.loaded_item).prime();
			}
			yield* this.ejectItem();
		}
	}
	if (exp == 3) {
		this.visible_message(`<span class='warning'>${this} fills its chamber with gas, ${exp_on} included.</span>`);
		if (prob(35) && criticalReaction) {
			this.visible_message(`${exp_on} achieves the perfect mix!`);
			yield* new_(T("/obj/item/stack/sheet/mineral/plasma"), rt.getStep(f, pick(oview(1, this)), 0));
		} else if (prob(20 - this.badThingCoeff)) {
			this.visible_message(`<span class='danger'>${this} destroys ${exp_on}, leaking dangerous gas!</span>`);
			chosenchem = pick("carbon", "radium", "toxin", "condensedcapsaicin", "mushroomhallucinogen", "space_drugs", "ethanol", "beepskysmash");
			(R = (yield* new_(T("/datum/reagents"), 50))).my_atom = this;
			yield* R.add_reagent(chosenchem, 50);
			this.investigate_log(`Experimentor has released ${chosenchem} smoke.`, "experimentor");
			yield* (smoke = (yield* new_(T("/datum/effect_system/smoke_spread/chem")))).set_up(R, 0, this, { silent: 1 });
			playsound(this.loc, rt.rsc("sound/effects/smoke.ogg"), 50, 1, -3);
			yield* smoke.start();
			yield* qdel(R);
			yield* this.ejectItem(1);
		} else if (prob(20 - this.badThingCoeff)) {
			this.visible_message(`<span class='danger'>${this}'s chemical chamber has sprung a leak!</span>`);
			chosenchem = pick("mutationtoxin", "nanomachines", "sacid");
			(R = (yield* new_(T("/datum/reagents"), 50))).my_atom = this;
			yield* R.add_reagent(chosenchem, 50);
			yield* (smoke = (yield* new_(T("/datum/effect_system/smoke_spread/chem")))).set_up(R, 0, this, { silent: 1 });
			playsound(this.loc, rt.rsc("sound/effects/smoke.ogg"), 50, 1, -3);
			yield* smoke.start();
			yield* qdel(R);
			yield* this.ejectItem(1);
			this.warn_admins(f.usr, `${chosenchem} smoke`);
			this.investigate_log(`Experimentor has released <font color='red'>${chosenchem}</font> smoke!`, "experimentor");
		} else if (prob(35 - this.badThingCoeff)) {
			this.visible_message(`${this} malfunctions, spewing harmless gas.`);
			yield* this.throwSmoke(this.loc);
		} else if (prob(50 - this.badThingCoeff)) {
			this.visible_message(`<span class='warning'>${this} melts ${exp_on}, ionizing the air around it!</span>`);
			yield* empulse(this.loc, 4, 6);
			this.investigate_log("Experimentor has generated an Electromagnetic Pulse.", "experimentor");
			yield* this.ejectItem(1);
		}
	}
	if (exp == 4) {
		this.visible_message(`${this} raises ${exp_on}'s temperature.`);
		if (prob(35) && criticalReaction) {
			this.visible_message(`<span class='warning'>${this}'s emergency coolant system gives off a small ding!</span>`);
			playsound(this.loc, rt.rsc("sound/machines/ding.ogg"), 50, 1);
			C = (yield* new_(T("/obj/item/weapon/reagent_containers/food/drinks/coffee"), rt.getStep(f, pick(oview(1, this)), 0)));
			chosenchem = pick("plasma", "capsaicin", "ethanol");
			yield* C.reagents.remove_any(25);
			yield* C.reagents.add_reagent(chosenchem, 50);
			C.name = "Cup of Suspicious Liquid";
			C.desc = "It has a large hazard symbol printed on the side in fading ink.";
			this.investigate_log(`Experimentor has made a cup of ${chosenchem} coffee.`, "experimentor");
		} else if (prob(20 - this.badThingCoeff)) {
			start = rt.getStep(f, this, 0);
			M = rt.locateIn(f, T("/mob/living"), view(this, 3));
			if (MT = rt.getStep(f, M, 0)) {
				this.visible_message(`<span class='danger'>${this} dangerously overheats, launching a flaming fuel orb!</span>`);
				this.investigate_log(`Experimentor has launched a <font color='red'>fireball</font> at ${M}!`, "experimentor");
				(FB = (yield* new_(T("/obj/item/projectile/magic/aoe/fireball"), start))).original = MT;
				FB.current = start;
				FB.yo = MT.y - start.y;
				FB.xo = MT.x - start.x;
				yield* FB.fire();
			}
		} else if (prob(35 - this.badThingCoeff)) {
			this.visible_message(`<span class='danger'>${this} malfunctions, melting ${exp_on} and releasing a burst of flame!</span>`);
			yield* explosion(this.loc, -1, 0, 0, 0, 0, { flame_range: 2 });
			this.investigate_log("Experimentor started a fire.", "experimentor");
			yield* this.ejectItem(1);
		} else if (prob(50 - this.badThingCoeff)) {
			this.visible_message(`<span class='warning'>${this} malfunctions, melting ${exp_on} and leaking hot air!</span>`);
			env = this.loc.return_air();
			transfer_moles = 0.25 * env.total_moles();
			if (removed = (yield* env.remove(transfer_moles))) {
				if ((heat_capacity = removed.heat_capacity()) == 0 || heat_capacity === null) {
					heat_capacity = 1;
				}
				removed.temperature = min((removed.temperature * heat_capacity + 100000) / heat_capacity, 1000);
			}
			yield* env.merge(removed);
			this.air_update_turf();
			this.investigate_log("Experimentor has released hot air.", "experimentor");
			yield* this.ejectItem(1);
		} else if (prob(50 - this.badThingCoeff)) {
			this.visible_message(`<span class='warning'>${this} malfunctions, activating its emergency coolant systems!</span>`);
			yield* this.throwSmoke(this.loc);
			m = null;
			for (m of each(oview(1, this), T("/mob/living"))) {
				yield* m.apply_damage(5, "fire", pick("head", "chest", "groin"));
				this.investigate_log(`Experimentor has dealt minor burn damage to ${m}`, "experimentor");
			}
			yield* this.ejectItem();
		}
	}
	if (exp == 5) {
		this.visible_message(`${this} lowers ${exp_on}'s temperature.`);
		if (prob(35) && criticalReaction) {
			this.visible_message(`<span class='warning'>${this}'s emergency coolant system gives off a small ding!</span>`);
			C = (yield* new_(T("/obj/item/weapon/reagent_containers/food/drinks/coffee"), rt.getStep(f, pick(oview(1, this)), 0)));
			playsound(this.loc, rt.rsc("sound/machines/ding.ogg"), 50, 1);
			chosenchem = pick("uranium", "frostoil", "ephedrine");
			yield* C.reagents.remove_any(25);
			yield* C.reagents.add_reagent(chosenchem, 50);
			C.name = "Cup of Suspicious Liquid";
			C.desc = "It has a large hazard symbol printed on the side in fading ink.";
			this.investigate_log(`Experimentor has made a cup of ${chosenchem} coffee.`, "experimentor");
		} else if (prob(20 - this.badThingCoeff)) {
			this.visible_message(`<span class='danger'>${this} malfunctions, shattering ${exp_on} and releasing a dangerous cloud of coolant!</span>`);
			(R = (yield* new_(T("/datum/reagents"), 50))).my_atom = this;
			yield* R.add_reagent("frostoil", 50);
			this.investigate_log("Experimentor has released frostoil gas.", "experimentor");
			yield* (smoke = (yield* new_(T("/datum/effect_system/smoke_spread/chem")))).set_up(R, 0, this, { silent: 1 });
			playsound(this.loc, rt.rsc("sound/effects/smoke.ogg"), 50, 1, -3);
			yield* smoke.start();
			yield* qdel(R);
			yield* this.ejectItem(1);
		} else if (prob(35 - this.badThingCoeff)) {
			this.visible_message(`<span class='warning'>${this} malfunctions, shattering ${exp_on} and leaking cold air!</span>`);
			env = this.loc.return_air();
			transfer_moles = 0.25 * env.total_moles();
			if (removed = (yield* env.remove(transfer_moles))) {
				if ((heat_capacity = removed.heat_capacity()) == 0 || heat_capacity === null) {
					heat_capacity = 1;
				}
				removed.temperature = (removed.temperature * heat_capacity - 75000) / heat_capacity;
			}
			yield* env.merge(removed);
			this.air_update_turf();
			this.investigate_log("Experimentor has released cold air.", "experimentor");
			yield* this.ejectItem(1);
		} else if (prob(50 - this.badThingCoeff)) {
			this.visible_message(`<span class='warning'>${this} malfunctions, releasing a flurry of chilly air as ${exp_on} pops out!</span>`);
			yield* (smoke_2 = (yield* new_(T("/datum/effect_system/smoke_spread")))).set_up(0, this.loc);
			yield* smoke_2.start();
			yield* this.ejectItem();
		}
	}
	if (exp == 6) {
		this.visible_message(`<span class='warning'>${exp_on} activates the crushing mechanism, ${exp_on} is destroyed!</span>`);
		if (this.linked_console.linked_lathe) {
			for (material of each(exp_on.materials)) {
				this.linked_console.linked_lathe.materials.insert_amount(min(this.linked_console.linked_lathe.materials.max_amount - this.linked_console.linked_lathe.materials.total_amount, rt.index(exp_on.materials, material)), material);
			}
		}
		if (prob(35) && criticalReaction) {
			this.visible_message(`<span class='warning'>${this}'s crushing mechanism slowly and smoothly descends, flattening the ${exp_on}!</span>`);
			yield* new_(T("/obj/item/stack/sheet/plasteel"), rt.getStep(f, pick(oview(1, this)), 0));
		} else if (prob(20 - this.badThingCoeff)) {
			this.visible_message(`<span class='danger'>${this}'s crusher goes way too many levels too high, crushing right through space-time!</span>`);
			playsound(this.loc, rt.rsc("sound/effects/supermatter.ogg"), 50, 1, -3);
			this.investigate_log("Experimentor has triggered the 'throw things' reaction.", "experimentor");
			for (AM of each(oview(7, this), T("/atom/movable"))) {
				if (!AM.anchored) {
					yield* AM.throw_at(this, 10, 1);
				}
			}
		} else if (prob(35 - this.badThingCoeff)) {
			this.visible_message(`<span class='danger'>${this}'s crusher goes one level too high, crushing right into space-time!</span>`);
			playsound(this.loc, rt.rsc("sound/effects/supermatter.ogg"), 50, 1, -3);
			this.investigate_log("Experimentor has triggered the 'minor throw things' reaction.", "experimentor");
			throwAt = list();
			for (AM_3 of each(oview(7, this), T("/atom/movable"))) {
				if (!AM_3.anchored) {
					throwAt.Add(AM_3);
				}
			}
			counter = 1;
			while (counter < rt.len(f, throwAt)) {
				yield* (cast = rt.index(throwAt, counter)).throw_at(pick(throwAt), 10, 1);
				counter++;
			}
		}
		yield* this.ejectItem(1);
	}
	if (exp == 8) {
		a = pick("rumbles", "shakes", "vibrates", "shudders");
		b = pick("crushes", "spins", "viscerates", "smashes", "insults");
		this.visible_message(`<span class='warning'>${exp_on} ${a}, and ${b}, the experiment was a failure.</span>`);
	}
	if (exp == 7) {
		this.visible_message(`${this} scans the ${exp_on}, revealing its true nature!`);
		playsound(this.loc, rt.rsc("sound/effects/supermatter.ogg"), 50, 3, -1);
		(R = this.loaded_item).reveal();
		this.investigate_log(`Experimentor has revealed a relic with <span class='danger'>${R.realProc}</span> effect.`, "experimentor");
		yield* this.ejectItem();
	}
	if (prob(20 - this.badThingCoeff) && this.loaded_item) {
		if ((globalMalf = rand(1, 100)) < 15) {
			this.visible_message(`<span class='warning'>${this}'s onboard detection system has malfunctioned!</span>`);
			rt.setAt(this.item_reactions, `${exp_on.type}`, pick(1, 2, 3, 4, 5, 6));
			yield* this.ejectItem();
		}
		if (globalMalf > 16 && globalMalf < 35) {
			this.visible_message(`<span class='warning'>${this} melts ${exp_on}, ian-izing the air around it!</span>`);
			yield* this.throwSmoke(this.loc);
			if (this.trackedIan) {
				yield* this.throwSmoke(this.trackedIan.loc);
				this.trackedIan.loc = this.loc;
				this.investigate_log("Experimentor has stolen Ian!", "experimentor");
			} else {
				yield* new_(T("/mob/living/simple_animal/pet/dog/corgi"), this.loc);
				this.investigate_log("Experimentor has spawned a new corgi.", "experimentor");
			}
			yield* this.ejectItem(1);
		}
		if (globalMalf > 36 && globalMalf < 50) {
			this.visible_message("<span class='warning'>Experimentor draws the life essence of those nearby!</span>");
			for (m_3 of each(view(4, this), T("/mob/living"))) {
				to_chat(m_3, `<span class='danger'>You feel your flesh being torn from you, mists of blood drifting to ${this}!</span>`);
				yield* m_3.apply_damage(50, "brute", "chest");
				this.investigate_log(`Experimentor has taken 50 brute a blood sacrifice from ${m_3}`, "experimentor");
			}
		}
		if (globalMalf > 51 && globalMalf < 75) {
			this.visible_message(`<span class='warning'>${this} encounters a run-time error!</span>`);
			yield* this.throwSmoke(this.loc);
			if (this.trackedRuntime) {
				yield* this.throwSmoke(this.trackedRuntime.loc);
				this.trackedRuntime.loc = this.loc;
				this.investigate_log("Experimentor has stolen Runtime!", "experimentor");
			} else {
				yield* new_(T("/mob/living/simple_animal/pet/cat"), this.loc);
				this.investigate_log("Experimentor failed to steal runtime, and instead spawned a new cat.", "experimentor");
			}
			yield* this.ejectItem(1);
		}
		if (globalMalf > 76) {
			this.visible_message(`<span class='warning'>${this} begins to smoke and hiss, shaking violently!</span>`);
			yield* this.use_power(500000);
			this.investigate_log("Experimentor has drained power from its APC", "experimentor");
		}
	}
	rt.spawnTail(f, this.resetTime, "/obj/machinery/r_n_d/experimentor/proc/experiment: spawn at modules/research/experimentor.dm:507", exp, exp_on, chosenchem, criticalReaction, m, target, throwing, _T, reagentdecal, savedName, newPath, CG, R, smoke, C, start, M, MT, FB, env, transfer_moles, removed, heat_capacity, smoke_2, material, AM, throwAt, AM_3, counter, cast, a, b, globalMalf, m_3);
	return f.dot;
}, true);

// a spawn(rt.srcVarI(f, $ic[171])) body of /obj/machinery/r_n_d/experimentor/proc/experiment, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/r_n_d/experimentor/proc/experiment: spawn at modules/research/experimentor.dm:507", function* (f: Frame, exp: Value, exp_on: Value, chosenchem: Value, criticalReaction: Value, m: Value, target: Value, throwing: Value, _T: Value, reagentdecal: Value, savedName: Value, newPath: Value, CG: Value, R: Value, smoke: Value, C: Value, start: Value, M: Value, MT: Value, FB: Value, env: Value, transfer_moles: Value, removed: Value, heat_capacity: Value, smoke_2: Value, material: Value, AM: Value, throwAt: Value, AM_3: Value, counter: Value, cast: Value, a: Value, b: Value, globalMalf: Value, m_3: Value) {
	this.icon_state = "h_lathe";
	this.recentlyExperimented = 0;
	return null;
});

// experimentor.dm:512
rt.def("/obj/machinery/r_n_d/experimentor/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let D: Value = null, dotype: Value = null, temp_tech: Value = null, _T: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	let scantype: Value = rt.at(href_list, "function");
	let process: Value = rt.locateIn(f, rt.at(href_list, "item"), this);
	if (rt.at(href_list, "close")) {
		rt.op(f, "Browse", [], [f.usr, null, "window=experimentor"], false);
		return f.dot;
	} else if (scantype == "search") {
		if (D = rt.locateIn(f, T("/obj/machinery/computer/rdconsole"), oview(3, this))) {
			this.linked_console = D;
		}
	} else if (scantype == "eject") {
		yield* this.ejectItem();
	} else if (scantype == "refresh") {
		yield* this.updateUsrDialog();
	} else {
		if (this.recentlyExperimented) {
			to_chat(f.usr, `<span class='warning'>${this} has been used too recently!</span>`);
			return f.dot;
		} else if (!this.loaded_item) {
			yield* this.updateUsrDialog();
			to_chat(f.usr, `<span class='warning'>${this} is not currently loaded!</span>`);
			return f.dot;
		} else if (!process || process != this.loaded_item) {
			yield* this.updateUsrDialog();
			to_chat(f.usr, `<span class='danger'>Interface failure detected in ${this}. Please try again.</span>`);
			return f.dot;
		}
		if (text2num(scantype) == 7) {
			dotype = 7;
		} else {
			dotype = this.matchReaction(process, scantype);
		}
		yield* this.experiment(dotype, process);
		yield* this.use_power(750);
		if (dotype != 8) {
			if (process && process.origin_tech) {
				temp_tech = this.ConvertReqString2List(process.origin_tech);
				for (_T of each(temp_tech)) {
					this.linked_console.files.UpdateTech(_T, rt.index(temp_tech, _T));
				}
			}
		}
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// experimentor.dm:559
rt.def("/obj/machinery/r_n_d/experimentor/proc/warn_admins", function warn_admins(f: Frame, user: Value, ReactionName: Value) {
	let $2: any;
	let _T: Value = rt.getStep(f, this, 0);
	let $0: any = ReactionName;
	let $1: any = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
	if (_T) {
		$2 = `${`(${_T.x},${_T.y},${_T.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`;
	} else {
		$2 = "nonexistent location";
	}
	message_admins(`Experimentor reaction: ${$0} generated by ${$1} at ${`${$2}`}`, 0, 1);
	log_game(`Experimentor reaction: ${ReactionName} generated by ${key_name(user)} in (${_T.x},${_T.y},${_T.z})`);
	return f.dot;
});

rt.type(7646, "/obj/item/weapon/relic", "/obj/item/weapon", {
	realName: "defined object",
	revealed: 0,
	realProc: null,
	cooldownMax: 60,
	cooldown: null,
	name: "strange object",
	desc: "What mysteries could this hold?",
	icon: rt.rsc("icons/obj/assemblies.dmi"),
	origin_tech: "combat=1;plasmatech=1;powerstorage=1;materials=1",
});

// experimentor.dm:594
rt.def("/obj/item/weapon/relic/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.icon_state = pick("shock_kit", "armor-igniter-analyzer", "infra-igniter0", "infra-igniter1", "radio-multitool", "prox-radio1", "radio-radio", "timer-multitool0", "radio-igniter-tank");
	this.realName = `${pick("broken", "twisted", "spun", "improved", "silly", "regular", "badly made")} ${pick("device", "object", "toy", "illegal tech", "weapon")}`;
	return f.dot;
}, true);

// experimentor.dm:603
rt.def("/obj/item/weapon/relic/proc/reveal", function reveal(f: Frame) {
	if (this.revealed) {
		return f.dot;
	}
	this.revealed = 1;
	this.name = this.realName;
	this.cooldownMax = rand(60, 300);
	this.realProc = pick("teleport", "explode", "rapidDupe", "petSpray", "flash", "clean", "corgicannon");
	this.origin_tech = pick(`engineering=${rand(2, 5)}`, `magnets=${rand(2, 5)}`, `plasmatech=${rand(2, 5)}`, `programming=${rand(2, 5)}`, `powerstorage=${rand(2, 5)}`);
	return f.dot;
});

// experimentor.dm:611
rt.def("/obj/item/weapon/relic/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (this.revealed) {
		if (this.cooldown) {
			to_chat(user, `<span class='warning'>${this} does not react!</span>`);
			return f.dot;
		} else if (this.loc == user) {
			this.cooldown = 1;
			yield* g.callDyn(f, this, this.realProc, [user]);
			rt.spawnTail(f, this.cooldownMax, "/obj/item/weapon/relic/proc/attack_self: spawn at modules/research/experimentor.dm:616", user);
		}
	} else {
		to_chat(user, "<span class='notice'>You aren't quite sure what to do with this yet.</span>");
	}
	return f.dot;
}, true);

// a spawn(rt.srcVarI(f, $ic[205])) body of /obj/item/weapon/relic/proc/attack_self, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/relic/proc/attack_self: spawn at modules/research/experimentor.dm:616", function* (f: Frame, user: Value) {
	this.cooldown = 0;
	return null;
});

// experimentor.dm:624
rt.def("/obj/item/weapon/relic/proc/throwSmoke", function* throwSmoke(f: Frame, where: Value) {
	let smoke: Value = null;
	yield* (smoke = (yield* new_(T("/datum/effect_system/smoke_spread")))).set_up(0, rt.getStep(f, where, 0));
	yield* smoke.start();
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }] });

// experimentor.dm:629
rt.def("/obj/item/weapon/relic/proc/corgicannon", function* corgicannon(f: Frame, user: Value) {
	let C: Value = null;
	playsound(this.loc, "sparks", rand(25, 50), 1);
	yield* (C = (yield* new_(T("/mob/living/simple_animal/pet/dog/corgi"), rt.getStep(f, user, 0)))).throw_at(pick(oview(10, user)), 10, rand(3, 8), { callback: (yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/relic/proc/throwSmoke"), C)) });
	this.warn_admins(user, "Corgi Cannon", 0);
	return f.dot;
}, true);

// experimentor.dm:635
rt.def("/obj/item/weapon/relic/proc/clean", function* clean(f: Frame, user: Value) {
	let CL: Value = null;
	playsound(this.loc, "sparks", rand(25, 50), 1);
	yield* (CL = (yield* new_(T("/obj/item/weapon/grenade/chem_grenade/cleaner"), rt.getStep(f, user, 0)))).prime();
	this.warn_admins(user, "Smoke", 0);
	return f.dot;
}, true);

// experimentor.dm:641
rt.def("/obj/item/weapon/relic/proc/flash", function* flash(f: Frame, user: Value) {
	let CB: Value = null;
	playsound(this.loc, "sparks", rand(25, 50), 1);
	yield* (CB = (yield* new_(T("/obj/item/weapon/grenade/flashbang"), user.loc))).prime();
	this.warn_admins(user, "Flash");
	return f.dot;
}, true);

// experimentor.dm:647
rt.def("/obj/item/weapon/relic/proc/petSpray", function* petSpray(f: Frame, user: Value) {
	let message: Value = null, mobType: Value = null;
	this.visible_message((message = `<span class='danger'>${this} begans to shake, and in the distance the sound of rampaging animals arises!</span>`));
	to_chat(user, message);
	let animals: Value = rand(1, 25);
	let valid_animals: Value = list(T("/mob/living/simple_animal/parrot"), T("/mob/living/simple_animal/butterfly"), T("/mob/living/simple_animal/pet/cat"), T("/mob/living/simple_animal/pet/dog/corgi"), T("/mob/living/simple_animal/crab"), T("/mob/living/simple_animal/pet/fox"), T("/mob/living/simple_animal/hostile/lizard"), T("/mob/living/simple_animal/mouse"), T("/mob/living/simple_animal/pet/dog/pug"), T("/mob/living/simple_animal/hostile/bear"), T("/mob/living/simple_animal/hostile/poison/bees"), T("/mob/living/simple_animal/hostile/carp"));
	let counter: Value = 1;
	while (counter < animals) {
		mobType = pick(valid_animals);
		yield* new_(mobType, rt.getStep(f, this, 0));
		counter++;
	}
	this.warn_admins(user, "Mass Mob Spawn");
	if (!prob(60)) return f.dot;
	to_chat(user, `<span class='warning'>${this} falls apart!</span>`);
	yield* qdel(this);
	return f.dot;
}, true);

// experimentor.dm:662
rt.def("/obj/item/weapon/relic/proc/rapidDupe", function* rapidDupe(f: Frame, user: Value) {
	let R: Value = null;
	this.audible_message(`${this} emits a loud pop!`);
	let dupes: Value = list();
	let max: Value = rand(5, 10);
	let counter: Value = 1;
	while (counter < max) {
		(R = (yield* new_(this.type, rt.getStep(f, this, 0)))).name = this.name;
		R.desc = this.desc;
		R.realName = this.realName;
		R.realProc = this.realProc;
		R.revealed = 1;
		(dupes = rt.modify(dupes, R, rt.bitOr));
		yield* R.throw_at(pick(oview(7, rt.getStep(f, this, 0))), 10, 1);
		counter++;
	}
	counter = 0;
	rt.spawnTail(f, rand(10, 100), "/obj/item/weapon/relic/proc/rapidDupe: spawn at modules/research/experimentor.dm:674", user, dupes, counter, max, R);
	this.warn_admins(user, "Rapid duplicator", 0);
	return f.dot;
}, true);

// a spawn((yield* g.call(f, P("/proc/rand"), null, [10, 100]))) body of /obj/item/weapon/relic/proc/rapidDupe, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/relic/proc/rapidDupe: spawn at modules/research/experimentor.dm:674", function* (f: Frame, user: Value, dupes: Value, counter: Value, max: Value, R: Value) {
	counter = 1;
	while (counter <= rt.len(f, dupes)) {
		yield* qdel((R = rt.index(dupes, counter)));
		counter++;
	}
	return null;
});

// experimentor.dm:683
rt.def("/obj/item/weapon/relic/proc/explode", function explode(f: Frame, user: Value) {
	to_chat(user, `<span class='danger'>${this} begins to heat up!</span>`);
	rt.spawnTail(f, rand(35, 100), "/obj/item/weapon/relic/proc/explode: spawn at modules/research/experimentor.dm:683", user);
	return f.dot;
});

// a spawn(rt.call(f, P("/proc/rand"), null, [35, 100])) body of /obj/item/weapon/relic/proc/explode, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/relic/proc/explode: spawn at modules/research/experimentor.dm:683", function* (f: Frame, user: Value) {
	if (this.loc == user) {
		this.visible_message(`<span class='notice'>The ${this}'s top opens, releasing a powerful blast!</span>`);
		yield* explosion(user.loc, -1, rand(1, 5), rand(1, 5), rand(1, 5), rand(1, 5), { flame_range: 2 });
		this.warn_admins(user, "Explosion");
		yield* qdel(this);
	}
	return null;
});

// experimentor.dm:692
rt.def("/obj/item/weapon/relic/proc/teleport", function teleport(f: Frame, user: Value) {
	let userturf: Value = null;
	to_chat(user, `<span class='notice'>The ${this} begins to vibrate!</span>`);
	rt.spawnTail(f, rand(10, 30), "/obj/item/weapon/relic/proc/teleport: spawn at modules/research/experimentor.dm:692", user, userturf);
	return f.dot;
});

// a spawn(rt.call(f, P("/proc/rand"), null, [10, 30])) body of /obj/item/weapon/relic/proc/teleport, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/relic/proc/teleport: spawn at modules/research/experimentor.dm:692", function* (f: Frame, user: Value, userturf: Value) {
	userturf = rt.getStep(f, user, 0);
	if (this.loc == user && userturf.z != 1) {
		this.visible_message(`<span class='notice'>The ${this} twists and bends, relocating itself!</span>`);
		yield* this.throwSmoke(userturf);
		yield* do_teleport(user, userturf, 8, { asoundin: rt.rsc("sound/effects/phasein.ogg") });
		yield* this.throwSmoke(rt.getStep(f, user, 0));
		this.warn_admins(user, "Teleport", 0);
	}
	return null;
});

// experimentor.dm:704
rt.def("/obj/item/weapon/relic/proc/warn_admins", function warn_admins(f: Frame, user: Value, RelicType: Value, priority: Value) {
	let $0: any, $1: any, $2: any;
	priority ??= 1;
	let _T: Value = rt.getStep(f, this, 0);
	let log_msg: Value = `${RelicType} relic used by ${key_name(user)} in (${_T.x},${_T.y},${_T.z})`;
	if (priority) {
		$0 = RelicType;
		$1 = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
		if (_T) {
			$2 = `${`(${_T.x},${_T.y},${_T.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`;
		} else {
			$2 = "nonexistent location";
		}
		message_admins(`${$0} relic activated by ${$1} in ${`${$2}`}`, 0, 1);
	}
	log_game(log_msg);
	this.investigate_log(log_msg, "experimentor");
	return f.dot;
});
