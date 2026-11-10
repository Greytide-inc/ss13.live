// Based on /tg/station's code/modules/mob/living/carbon/human/species_types/jellypeople.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, fmt } = rt;


rt.type(4101, "/datum/species/jelly", "/datum/species", {
	regenerate_limbs: null,
	name: "Xenobiological Jelly Entity",
	id: "jelly",
	default_color: "00FF90",
	say_mod: "chirps",
	species_traits: null,
	exotic_blood: "slimejelly",
	damage_overlay_type: "",
	meat: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/slime"),
});

// jellypeople.dm:15
rt.def("/datum/species/jelly/proc/on_species_loss", function* on_species_loss(f: Frame, C: Value) {
	if (this.regenerate_limbs) {
		yield* this.regenerate_limbs.Remove(C);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// jellypeople.dm:19
rt.def("/datum/species/jelly/proc/on_species_gain", function* on_species_gain(f: Frame, C: Value, old_species: Value) {
	yield* parent_proc();
	if (!rt.istype(C, T("/mob/living/carbon/human"))) return f.dot;
	this.regenerate_limbs = (yield* new_(T("/datum/action/innate/regenerate_limbs")));
	yield* this.regenerate_limbs.Grant(C);
	return f.dot;
}, true);

// jellypeople.dm:25
rt.def("/datum/species/jelly/proc/spec_life", function* spec_life(f: Frame, H: Value) {
	if (H.stat == 2) {
		return f.dot;
	}
	if (!H.blood_volume) {
		H.blood_volume += 5;
		yield* H.adjustBruteLoss(5);
		to_chat(H, "<span class='danger'>You feel empty!</span>");
	}
	if (H.blood_volume < BLOOD_VOLUME_NORMAL) {
		if (H.nutrition >= NUTRITION_LEVEL_STARVING) {
			H.blood_volume += 3;
			H.nutrition -= 2.5;
		}
	}
	if (H.blood_volume < BLOOD_VOLUME_OKAY) {
		if (prob(5)) {
			to_chat(H, "<span class='danger'>You feel drained!</span>");
		}
	}
	if (H.blood_volume < BLOOD_VOLUME_BAD) {
		yield* this.Cannibalize_Body(H);
	}
	yield* H.update_action_buttons_icon();
	return f.dot;
}, true);

// jellypeople.dm:44
rt.def("/datum/species/jelly/proc/Cannibalize_Body", function* Cannibalize_Body(f: Frame, H: Value) {
	let consumed_limb: Value = null;
	let limbs_to_consume: Value = list("r_arm", "l_arm", "r_leg", "l_leg") - H.get_missing_limbs();
	if (!rt.len(f, limbs_to_consume)) {
		H.losebreath++;
		return f.dot;
	}
	if (H.get_num_legs()) {
		limbs_to_consume -= list("r_arm", "l_arm");
	}
	yield* (consumed_limb = H.get_bodypart(pick(limbs_to_consume))).drop_limb();
	to_chat(H, `<span class='userdanger'>Your ${consumed_limb} is drawn back into your body, unable to maintain its shape!</span>`);
	yield* qdel(consumed_limb);
	H.blood_volume += 20;
	return f.dot;
}, true);

rt.type(152, "/datum/action/innate/regenerate_limbs", "/datum/action/innate", {
	name: "Regenerate Limbs",
	check_flags: 8,
	button_icon_state: "slimeheal",
	background_icon_state: "bg_alien",
});

// jellypeople.dm:64
rt.def("/datum/action/innate/regenerate_limbs/proc/IsAvailable", function IsAvailable(f: Frame) {
	let limbs_to_heal: Value = null;
	if (!parent_proc()) return f.dot;
	let H: Value = this.owner;
	if (rt.len(f, (limbs_to_heal = H.get_missing_limbs())) < 1) {
		return 0;
	}
	if (H.blood_volume >= 376) {
		return 1;
	}
	return 0;
});

// jellypeople.dm:74
rt.def("/datum/action/innate/regenerate_limbs/proc/Activate", function* Activate(f: Frame) {
	let limbs_to_heal: Value = null, healed_limb: Value = null;
	let $1: any;
	let H: Value = this.owner;
	if (rt.len(f, (limbs_to_heal = H.get_missing_limbs())) < 1) {
		to_chat(H, "<span class='notice'>You feel intact enough as it is.</span>");
		return f.dot;
	}
	let $0: any = H;
	if (rt.len(f, limbs_to_heal) >= 2) {
		$1 = "limbs";
	} else {
		$1 = "limb";
	}
	to_chat($0, `<span class='notice'>You focus intently on your missing ${$1}...</span>`);
	if (H.blood_volume >= 40 * rt.len(f, limbs_to_heal) + BLOOD_VOLUME_OKAY) {
		yield* H.regenerate_limbs();
		H.blood_volume -= 40 * rt.len(f, limbs_to_heal);
		to_chat(H, "<span class='notice'>...and after a moment you finish reforming!</span>");
		return f.dot;
	} else if (H.blood_volume >= 40) {
		while (H.blood_volume >= 376) {
			healed_limb = pick(limbs_to_heal);
			yield* H.regenerate_limb(healed_limb);
			limbs_to_heal -= healed_limb;
			H.blood_volume -= 40;
		}
		to_chat(H, "<span class='warning'>...but there is not enough of you to fix everything! You must attain more mass to heal completely!</span>");
		return f.dot;
	}
	to_chat(H, "<span class='warning'>...but there is not enough of you to go around! You must attain more mass to heal!</span>");
	return f.dot;
}, true);

rt.type(4102, "/datum/species/jelly/slime", "/datum/species/jelly", {
	slime_split: null,
	bodies: null,
	swap_body: null,
	name: "Slimeperson",
	id: "slime",
	default_color: "00FFFF",
	species_traits: null,
	say_mod: "says",
	hair_color: "mutcolor",
	hair_alpha: 150,
	burnmod: 0.5,
	coldmod: 2,
	heatmod: 0.5,
	ignored_by: null,
});

// jellypeople.dm:106
rt.def("/datum/species/jelly/slime/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.species_traits = list(1, 4, 2, 3, 12, 14, 24);

	this.ignored_by = list(T("/mob/living/simple_animal/slime"));
	return f.dot;
});

// jellypeople.dm:116
rt.def("/datum/species/jelly/slime/proc/on_species_loss", function* on_species_loss(f: Frame, C: Value) {
	if (this.slime_split) {
		yield* this.slime_split.Remove(C);
	}
	if (this.swap_body) {
		yield* this.swap_body.Remove(C);
	}
	this.bodies -= C;
	this.bodies = null;
	C.faction -= "slime";
	C.blood_volume = min(C.blood_volume, 560);
	yield* parent_proc();
	return f.dot;
}, true);

// jellypeople.dm:127
rt.def("/datum/species/jelly/slime/proc/on_species_gain", function* on_species_gain(f: Frame, C: Value, old_species: Value) {
	yield* parent_proc();
	if (rt.istype(C, T("/mob/living/carbon/human"))) {
		this.slime_split = (yield* new_(T("/datum/action/innate/split_body")));
		yield* this.slime_split.Grant(C);
		this.swap_body = (yield* new_(T("/datum/action/innate/swap_body")));
		yield* this.swap_body.Grant(C);
		if (!this.bodies || !rt.len(f, this.bodies)) {
			this.bodies = list(C);
		} else {
			(rt.modSrcVar(f, "bodies", C, rt.bitOr));
		}
	}
	(rt.modField(f, C, "faction", "slime", rt.bitOr));
	return f.dot;
}, true);

// jellypeople.dm:142
rt.def("/datum/species/jelly/slime/proc/spec_life", function* spec_life(f: Frame, H: Value) {
	if (H.blood_volume >= BLOOD_VOLUME_SLIME_SPLIT) {
		if (prob(5)) {
			to_chat(H, "<span class='notice'>You feel very bloated!</span>");
		}
	} else if (H.nutrition >= NUTRITION_LEVEL_WELL_FED) {
		H.blood_volume += 3;
		H.nutrition -= 2.5;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(153, "/datum/action/innate/split_body", "/datum/action/innate", {
	name: "Split Body",
	check_flags: 8,
	button_icon_state: "slimesplit",
	background_icon_state: "bg_alien",
});

// jellypeople.dm:158
rt.def("/datum/action/innate/split_body/proc/IsAvailable", function IsAvailable(f: Frame) {
	let H: Value = null;
	if (!parent_proc()) return f.dot;
	if ((H = this.owner).blood_volume >= BLOOD_VOLUME_SLIME_SPLIT) {
		return 1;
	}
	return 0;
});

// jellypeople.dm:165
rt.def("/datum/action/innate/split_body/proc/Activate", function* Activate(f: Frame) {
	let H: Value = null;
	if (!is_species((H = this.owner), T("/datum/species/jelly/slime"))) {
		return f.dot;
	}
	if (!H.dna || !H.dna.species) {
		return f.dot;
	}
	H.visible_message(`<span class='notice'>${this.owner} gains a look of concentration while standing perfectly still.</span>`, "<span class='notice'>You focus intently on moving your body while standing perfectly still...</span>");
	H.notransform = 1;
	if (yield* do_after(this.owner, { delay: 60, needhand: 0, target: this.owner, progress: 1 })) {
		if (H.blood_volume >= BLOOD_VOLUME_SLIME_SPLIT) {
			yield* this.make_dupe();
		} else {
			to_chat(H, "<span class='warning'>...but there is not enough of you to go around! You must attain more mass to split!</span>");
		}
	} else {
		to_chat(H, "<span class='warning'>...but fail to stand perfectly still!</span>");
	}
	H.notransform = 0;
	return f.dot;
}, true);

// jellypeople.dm:187
rt.def("/datum/action/innate/split_body/proc/make_dupe", function* make_dupe(f: Frame) {
	let H: Value = null, spare: Value = null, origin_datum: Value = null, spare_datum: Value = null;
	if (!(H = this.owner).dna || !H.dna.species) {
		return f.dot;
	}
	(spare = (yield* new_(T("/mob/living/carbon/human"), H.loc))).underwear = "Nude";
	yield* H.dna.transfer_identity(spare, { transfer_SE: 1 });
	rt.setAt(spare.dna.features, "mcolor", pick("FFFFFF", "7F7F7F", "7FFF7F", "7F7FFF", "FF7F7F", "7FFFFF", "FF7FFF", "FFFF7F"));
	spare.real_name = spare.dna.real_name;
	spare.name = spare.dna.real_name;
	yield* spare.updateappearance({ mutcolor_update: 1 });
	yield* spare.domutcheck();
	yield* spare.Move(rt.getStep(f, H.loc, pick(1, 2, 4, 8)));
	H.blood_volume = BLOOD_VOLUME_SAFE;
	H.notransform = 0;
	(rt.modField(f, (origin_datum = H.dna.species), "bodies", spare, rt.bitOr));
	(spare_datum = spare.dna.species).bodies = origin_datum.bodies;
	yield* H.mind.transfer_to(spare);
	spare.visible_message(`<span class='warning'>${H} distorts as a new body "steps out" of them.</span>`, "<span class='notice'>...and after a moment of disorentation, you're besides yourself!</span>");
	return f.dot;
}, true);

rt.type(154, "/datum/action/innate/swap_body", "/datum/action/innate", {
	name: "Swap Body",
	check_flags: 8,
	button_icon_state: "slimeswap",
	background_icon_state: "bg_alien",
});

// jellypeople.dm:224
rt.def("/datum/action/innate/swap_body/proc/Activate", function* Activate(f: Frame) {
	if (!is_species(this.owner, T("/datum/species/jelly/slime"))) {
		to_chat(this.owner, "<span class='warning'>You are not a slimeperson.</span>");
		yield* this.Remove(this.owner);
	} else {
		yield* this.ui_interact(this.owner);
	}
	return f.dot;
}, true);

// jellypeople.dm:232
rt.def("/datum/action/innate/swap_body/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.conscious_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "slime_swap_body", this.name, 400, 400, master_ui, state))).open();
	return f.dot;
}, true);

// jellypeople.dm:238
rt.def("/datum/action/innate/swap_body/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let H: Value = null, data: Value = null, b: Value = null, body: Value = null, L: Value = null, A: Value = null, stat: Value = null, current: Value = null, is_conscious: Value = null, button: Value = null;
	let $e: any;
	if (!is_species((H = this.owner), T("/datum/species/jelly/slime"))) {
		return f.dot;
	}
	let SS: Value = H.dna.species;
	rt.setAt((data = list()), "bodies", list());
	for (b of each(SS.bodies)) {
		if (!(body = b) || !body || body.gc_destroyed || !is_species(body, T("/datum/species/jelly/slime"))) {
			SS.bodies -= b;
			continue;
		}
		rt.setAt((L = list()), "htmlcolor", `#${rt.index(body.dna.features, "mcolor")}`);
		A = get_area(body);
		rt.setAt(L, "area", A.name);
		stat = "error";
		if (body.stat === 0) {
			stat = "Conscious";
		} else if (body.stat === 1) {
			stat = "Unconscious";
		} else if (body.stat === 2) {
			stat = "Dead";
		}
		current = body.mind;
		is_conscious = (body.stat == 0 ? 1 : 0);
		rt.setAt(L, "status", stat);
		rt.setAt(L, "exoticblood", body.blood_volume);
		rt.setAt(L, "name", body.name);
		rt.setAt(L, "ref", fmt("＃", [body]));
		rt.setAt(L, "is_current", current);
		button = null;
		if (current) {
			button = "selected";
		} else if (is_conscious) {
			button = null;
		} else {
			button = "disabled";
		}
		rt.setAt(L, "swap_button_state", button);
		rt.setAt(L, "swappable", ((!current ? 1 : 0) && is_conscious));
		rt.modAt(data, "bodies", list(L), add);
	}
	return data;
});

// jellypeople.dm:289
rt.def("/datum/action/innate/swap_body/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let M: Value = null, L: Value = null, selected: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	let H: Value = this.owner;
	if (!is_species(this.owner, T("/datum/species/jelly/slime"))) {
		return f.dot;
	}
	let SS: Value = H.dna.species;
	for (L of each(SS.bodies, T("/mob/living"))) {
		if (L.mind && L.mind.active) {
			M = L.mind;
		}
	}
	if (!M) {
		return f.dot;
	}
	if (!is_species(M.current, T("/datum/species/jelly/slime"))) {
		return f.dot;
	}
	if (action === "swap") {
		if (!rt.isIn(f, (selected = rt.locateIn(f, rt.at(params, "ref"), rt.world())), SS.bodies)) {
			return f.dot;
		}
		if (!selected || !selected || selected.gc_destroyed || !is_species(selected, T("/datum/species/jelly/slime"))) {
			SS.bodies -= selected;
			return f.dot;
		}
		if (M.current == selected) {
			return f.dot;
		}
		if (selected.stat != 0) {
			return f.dot;
		}
		yield* this.swap_to_dupe(M, selected);
	}
	return f.dot;
}, true);

// jellypeople.dm:321
rt.def("/datum/action/innate/swap_body/proc/swap_to_dupe", function* swap_to_dupe(f: Frame, M: Value, dupe: Value) {
	M.current.visible_message(`<span class='notice'>${M.current} stops moving and starts staring vacantly into space.</span>`, "<span class='notice'>You stop moving this body...</span>");
	yield* M.transfer_to(dupe);
	dupe.visible_message(`<span class='notice'>${dupe} blinks and looks around.</span>`, "<span class='notice'>...and move this one instead.</span>");
	return f.dot;
}, true);
