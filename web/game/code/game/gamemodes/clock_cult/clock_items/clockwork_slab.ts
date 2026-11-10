// Based on /tg/station's code/game/gamemodes/clock_cult/clock_items/clockwork_slab.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, add, fmt } = rt;


rt.type(8949, "/obj/item/clockwork/slab", "/obj/item/clockwork", {
	stored_components: null,
	busy: null,
	production_time: 0,
	target_component_id: null,
	no_cost: 0,
	speed_multiplier: 1,
	produces_components: 1,
	selected_scripture: "Driver",
	recollecting: 0,
	slab_ability: null,
	quickbound: null,
	maximum_quickbound: 5,
	clockwork_desc: "A link between the Celestial Derelict and the mortal plane. Contains limitless knowledge, fabricates components, and outputs a stream of information that only a trained eye can detect.\nUse the <span class='brass'>Hierophant Network</span> action button to communicate with other servants.\nClockwork slabs will only make components if held or if inside an item held by a human, and when making a component will prevent all other slabs held from making components.\nHitting a slab, a Servant with a slab, or a cache will <b>transfer</b> this slab's components into the target, the target's slab, or the global cache, respectively.",
	name: "clockwork slab",
	desc: "A strange metal tablet. A clock in the center turns around and around.",
	icon_state: "dread_ipad",
	slot_flags: 512,
	w_class: 2,
	actions_types: null,
});

// clockwork_slab.dm:11
rt.def("/obj/item/clockwork/slab/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.stored_components = rt.alist(f, ["belligerent_eye", 0, "vanguard_cogwheel", 0, "geis_capacitor", 0, "replicant_alloy", 0, "hierophant_ansible", 0]);

	this.quickbound = list(T("/datum/clockwork_scripture/ranged_ability/geis_prep"), T("/datum/clockwork_scripture/create_object/replicant"), T("/datum/clockwork_scripture/create_object/tinkerers_cache"));

	this.actions_types = list(T("/datum/action/item_action/clock/hierophant"));
	return f.dot;
});

rt.type(8950, "/obj/item/clockwork/slab/starter", "/obj/item/clockwork/slab", {
	stored_components: null,
});

// clockwork_slab.dm:27
rt.def("/obj/item/clockwork/slab/starter/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.stored_components = rt.alist(f, ["belligerent_eye", 1, "vanguard_cogwheel", 1, "geis_capacitor", 1, "replicant_alloy", 1, "hierophant_ansible", 1]);
	return f.dot;
});

rt.type(8951, "/obj/item/clockwork/slab/internal", "/obj/item/clockwork/slab", {
	quickbound: null,
	no_cost: 1,
	produces_components: 0,
	name: "scripture motor",
});

// clockwork_slab.dm:31
rt.def("/obj/item/clockwork/slab/internal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.quickbound = list();
	return f.dot;
});

rt.type(8952, "/obj/item/clockwork/slab/debug", "/obj/item/clockwork/slab", {
	speed_multiplier: 0,
	no_cost: 1,
});

// clockwork_slab.dm:40
rt.def("/obj/item/clockwork/slab/debug/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* parent_proc();
	if (is_servant_of_ratvar(user)) return f.dot;
	yield* add_servant_of_ratvar(user);
	return f.dot;
}, true);

rt.type(8953, "/obj/item/clockwork/slab/cyborg", "/obj/item/clockwork/slab", {
	clockwork_desc: "A divine link to the Celestial Derelict, allowing for limited recital of scripture.\nHitting a slab, a Servant with a slab, or a cache will <b>transfer</b> this slab's components into the target, the target's slab, or the global cache, respectively.",
	quickbound: null,
	maximum_quickbound: 6,
	actions_types: null,
});

// clockwork_slab.dm:47
rt.def("/obj/item/clockwork/slab/cyborg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.quickbound = list(T("/datum/clockwork_scripture/ranged_ability/judicial_marker"), T("/datum/clockwork_scripture/ranged_ability/linked_vanguard"), T("/datum/clockwork_scripture/create_object/tinkerers_cache"));

	this.actions_types = list();
	return f.dot;
});

rt.type(8954, "/obj/item/clockwork/slab/cyborg/engineer", "/obj/item/clockwork/slab/cyborg", {
	quickbound: null,
});

// clockwork_slab.dm:53
rt.def("/obj/item/clockwork/slab/cyborg/engineer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.quickbound = list(T("/datum/clockwork_scripture/create_object/replicant"), T("/datum/clockwork_scripture/create_object/cogscarab"), T("/datum/clockwork_scripture/create_object/soul_vessel"), T("/datum/clockwork_scripture/create_object/sigil_of_transmission"), T("/datum/clockwork_scripture/create_object/interdiction_lens"));
	return f.dot;
});

rt.type(8955, "/obj/item/clockwork/slab/cyborg/medical", "/obj/item/clockwork/slab/cyborg", {
	quickbound: null,
});

// clockwork_slab.dm:57
rt.def("/obj/item/clockwork/slab/cyborg/medical/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.quickbound = list(T("/datum/clockwork_scripture/ranged_ability/linked_vanguard"), T("/datum/clockwork_scripture/ranged_ability/sentinels_compromise"), T("/datum/clockwork_scripture/create_object/vitality_matrix"), T("/datum/clockwork_scripture/channeled/mending_mantra"), T("/datum/clockwork_scripture/fellowship_armory"));
	return f.dot;
});

rt.type(8956, "/obj/item/clockwork/slab/cyborg/security", "/obj/item/clockwork/slab/cyborg", {
	quickbound: null,
});

// clockwork_slab.dm:61
rt.def("/obj/item/clockwork/slab/cyborg/security/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.quickbound = list(T("/datum/clockwork_scripture/channeled/belligerent"), T("/datum/clockwork_scripture/ranged_ability/judicial_marker"), T("/datum/clockwork_scripture/channeled/taunting_tirade"), T("/datum/clockwork_scripture/channeled/volt_blaster"));
	return f.dot;
});

rt.type(8957, "/obj/item/clockwork/slab/cyborg/peacekeeper", "/obj/item/clockwork/slab/cyborg", {
	quickbound: null,
});

// clockwork_slab.dm:65
rt.def("/obj/item/clockwork/slab/cyborg/peacekeeper/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.quickbound = list(T("/datum/clockwork_scripture/channeled/belligerent"), T("/datum/clockwork_scripture/ranged_ability/judicial_marker"), T("/datum/clockwork_scripture/channeled/taunting_tirade"), T("/datum/clockwork_scripture/channeled/volt_blaster"));
	return f.dot;
});

rt.type(8958, "/obj/item/clockwork/slab/cyborg/janitor", "/obj/item/clockwork/slab/cyborg", {
	quickbound: null,
});

// clockwork_slab.dm:69
rt.def("/obj/item/clockwork/slab/cyborg/janitor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.quickbound = list(T("/datum/clockwork_scripture/create_object/replicant"), T("/datum/clockwork_scripture/create_object/sigil_of_transgression"), T("/datum/clockwork_scripture/create_object/ocular_warden"), T("/datum/clockwork_scripture/create_object/mania_motor"), T("/datum/clockwork_scripture/create_object/tinkerers_daemon"));
	return f.dot;
});

rt.type(8959, "/obj/item/clockwork/slab/cyborg/service", "/obj/item/clockwork/slab/cyborg", {
	quickbound: null,
});

// clockwork_slab.dm:73
rt.def("/obj/item/clockwork/slab/cyborg/service/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.quickbound = list(T("/datum/clockwork_scripture/create_object/replicant"), T("/datum/clockwork_scripture/create_object/tinkerers_cache"), T("/datum/clockwork_scripture/spatial_gateway"), T("/datum/clockwork_scripture/fellowship_armory"), T("/datum/clockwork_scripture/create_object/clockwork_obelisk"));
	return f.dot;
});

rt.type(8960, "/obj/item/clockwork/slab/cyborg/miner", "/obj/item/clockwork/slab/cyborg", {
	quickbound: null,
});

// clockwork_slab.dm:77
rt.def("/obj/item/clockwork/slab/cyborg/miner/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.quickbound = list(T("/datum/clockwork_scripture/ranged_ability/linked_vanguard"), T("/datum/clockwork_scripture/spatial_gateway"), T("/datum/clockwork_scripture/channeled/volt_blaster"));
	return f.dot;
});

// clockwork_slab.dm:80
rt.def("/obj/item/clockwork/slab/cyborg/proc/access_display", function* access_display(f: Frame, user: Value) {
	if (!GLOB.ratvar_awakens) {
		to_chat(user, "<span class='warning'>Use the action buttons to recite your limited set of scripture!</span>");
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// clockwork_slab.dm:86
rt.def("/obj/item/clockwork/slab/cyborg/proc/ratvar_act", function* ratvar_act(f: Frame) {
	yield* parent_proc();
	if (GLOB.ratvar_awakens) return f.dot;
	yield* GLOB.SStgui.close_uis(this);
	return f.dot;
}, true);

// clockwork_slab.dm:91
rt.def("/obj/item/clockwork/slab/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* update_slab_info(this);
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	this.production_time = rt.worldTime(f) + SLAB_PRODUCTION_TIME;
	return f.dot;
}, true);

// clockwork_slab.dm:97
rt.def("/obj/item/clockwork/slab/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	if (this.slab_ability && this.slab_ability.ranged_ability_user) {
		yield* this.slab_ability.remove_ranged_ability();
	}
	this.slab_ability = null;
	return (yield* parent_proc());
}, true);

// clockwork_slab.dm:104
rt.def("/obj/item/clockwork/slab/proc/dropped", function* dropped(f: Frame, user: Value) {
	f.dot = (yield* parent_proc());
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clockwork/slab/proc/check_on_mob"), user)), 1);
	return f.dot;
}, true);

// clockwork_slab.dm:108
rt.def("/obj/item/clockwork/slab/proc/check_on_mob", function* check_on_mob(f: Frame, user: Value) {
	if (!(user && !rt.isIn(f, this, user.held_items) && this.slab_ability && this.slab_ability.ranged_ability_user)) return f.dot;
	yield* this.slab_ability.remove_ranged_ability();
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// clockwork_slab.dm:113
rt.def("/obj/item/clockwork/slab/proc/process", function* process(f: Frame) {
	let M: Value = null, L: Value = null, component_to_generate: Value = null, S: Value = null;
	if (!this.produces_components) {
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
		return f.dot;
	}
	if (this.production_time > rt.worldTime(f)) {
		return f.dot;
	}
	let servants: Value = 0;
	let production_slowdown: Value = 0;
	for (M of each(GLOB.living_mob_list, T("/mob/living"))) {
		if (is_servant_of_ratvar(M) && (rt.istype(M, T("/mob/living/carbon/human")) || rt.istype(M, T("/mob/living/silicon")))) {
			servants++;
		}
	}
	if (servants > SCRIPT_SERVANT_REQ) {
		servants -= SCRIPT_SERVANT_REQ;
		production_slowdown = min(SLAB_SERVANT_SLOWDOWN * servants, SLAB_SLOWDOWN_MAXIMUM);
	}
	this.production_time = rt.worldTime(f) + SLAB_PRODUCTION_TIME + production_slowdown;
	if (!(rt.istype((L = get_atom_on_turf(this, T("/mob/living"))), T("/mob/living")) && can_recite_scripture(L))) return f.dot;
	if (!(component_to_generate = this.target_component_id)) {
		component_to_generate = get_weighted_component_id(this);
	}
	rt.incAt(this.stored_components, component_to_generate, 1, true);
	yield* update_slab_info(this);
	for (S of each(L.GetAllContents(), T("/obj/item/clockwork/slab"))) {
		if (S == this) {
			continue;
		}
		S.production_time = this.production_time + 50;
	}
	to_chat(L, `<span class='warning'>Your slab cl${pick("ank", "ink", "unk", "ang")}s as it produces a </span><span class='${get_component_span(component_to_generate)}'>component</span><span class='warning'>.</span>`);
	return f.dot;
}, true, { waitfor: false });

// clockwork_slab.dm:142
rt.def("/obj/item/clockwork/slab/proc/examine", function examine(f: Frame, user: Value) {
	let i: Value = null, quickbind_slot: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	parent_proc();
	if (!(is_servant_of_ratvar(user) || rt.istype(user, T("/mob/dead/observer")))) return f.dot;
	if (rt.length(this.quickbound)) {
		rt.forRange(f, 0, 1, rt.len(f, this.quickbound), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (!rt.index(this.quickbound, i)) {
				continue;
			}
			quickbind_slot = rt.index(this.quickbound, i);
			to_chat(user, `<b>Quickbind</b> button: <span class='${get_component_span(rt.initial(f, quickbind_slot, "primary_component"))}'>${rt.initial(f, quickbind_slot, "name")}</span>.`);
		}
		rt.endFor(f, 0);
	}
	if (GLOB.clockwork_caches) {
		to_chat(user, "<b>Stored components (with global cache):</b>");
		i = null;
		for (i of each(this.stored_components)) {
			$0 = user;
			$1 = get_component_span(i);
			$2 = get_component_name(i);
			if (i != "replicant_alloy") {
				$3 = "s";
			} else {
				$3 = "";
			}
			to_chat($0, `<span class='${$1}_small'><i>${$2}${$3}:</i> <b>${rt.index(this.stored_components, i)}</b> (<b>${rt.index(this.stored_components, i) + rt.index(GLOB.clockwork_component_cache, i)}</b>)</span>`);
		}
	} else {
		to_chat(user, "<b>Stored components:</b>");
		i = null;
		for (i of each(this.stored_components)) {
			$0 = user;
			$1 = get_component_span(i);
			$2 = get_component_name(i);
			if (i != "replicant_alloy") {
				$3 = "s";
			} else {
				$3 = "";
			}
			to_chat($0, `<span class='${$1}_small'><i>${$2}${$3}:</i> <b>${rt.index(this.stored_components, i)}</b></span>`);
		}
	}
	return f.dot;
}, false);

// clockwork_slab.dm:162
rt.def("/obj/item/clockwork/slab/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	let targetslab: Value = null, highest_component_amount: Value = null, S: Value = null, totalcomponents: Value = null, i: Value = null, i_2: Value = null;
	if (is_servant_of_ratvar(user) && is_servant_of_ratvar(target)) {
		highest_component_amount = 0;
		for (S of each(target.GetAllContents(), T("/obj/item/clockwork/slab"))) {
			if (!rt.istype(S, T("/obj/item/clockwork/slab/internal"))) {
				totalcomponents = 0;
				i = null;
				for (i of each(S.stored_components)) {
					totalcomponents += rt.index(S.stored_components, i);
				}
				if (!targetslab || totalcomponents > highest_component_amount) {
					highest_component_amount = totalcomponents;
					targetslab = S;
				}
			}
		}
		if (targetslab) {
			if (targetslab == this) {
				to_chat(user, "<span class='heavy_brass'>\"You can't transfer components into your own slab, idiot.\"</span>");
			} else {
				for (i_2 of each(this.stored_components)) {
					rt.modAt(targetslab.stored_components, i_2, rt.index(this.stored_components, i_2), add);
					rt.setAt(this.stored_components, i_2, 0);
				}
				yield* update_slab_info(targetslab);
				yield* update_slab_info(this);
				user.visible_message(`<span class='notice'>${user} empties ${this} into ${target}'s ${targetslab.name}.</span>`, `<span class='notice'>You transfer your slab's components into ${target}'s ${targetslab.name}.</span>`);
			}
		} else {
			to_chat(user, `<span class='warning'>${target} has no slabs to transfer components to.</span>`);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// clockwork_slab.dm:190
rt.def("/obj/item/clockwork/slab/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let C: Value = null, S: Value = null, needs_update: Value = null, i: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $e: any;
	let ratvarian: Value = is_servant_of_ratvar(user);
	if (rt.istype(I, T("/obj/item/clockwork/component")) && ratvarian) {
		if (!(C = I).component_id) {
			return 0;
		}
		$0 = user;
		$1 = `<span class='notice'>${user} inserts ${C} into ${this}.</span>`;
		$2 = C;
		$3 = this;
		if (GLOB.clockwork_caches) {
			$4 = ", where it is added to the global cache";
		} else {
			$4 = "";
		}
		$0.visible_message($1, `<span class='notice'>You insert ${$2} into ${$3}${$4}.</span>`);
		if (GLOB.clockwork_caches) {
			rt.incAt(GLOB.clockwork_component_cache, C.component_id, 1, true);
			yield* update_slab_info();
		} else {
			rt.incAt(this.stored_components, C.component_id, 1, true);
			yield* update_slab_info(this);
		}
		yield* user.drop_item();
		yield* qdel(C);
		return 1;
	} else if (rt.istype(I, T("/obj/item/clockwork/slab")) && ratvarian) {
		S = I;
		needs_update = 0;
		for (i of each(this.stored_components)) {
			rt.modAt(this.stored_components, i, rt.index(S.stored_components, i), add);
			rt.setAt(S.stored_components, i, 0);
			if (rt.index(S.stored_components, i)) {
				needs_update = 1;
			}
		}
		if (needs_update) {
			yield* update_slab_info(this);
			yield* update_slab_info(S);
		}
		user.visible_message(`<span class='notice'>${user} empties ${this} into ${S}.</span>`, `<span class='notice'>You transfer your slab's components into ${S}.</span>`);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// clockwork_slab.dm:223
rt.def("/obj/item/clockwork/slab/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value, action: Value) {
	let Q: Value = null;
	if (rt.istype(action, T("/datum/action/item_action/clock/hierophant"))) {
		yield* this.show_hierophant(user);
	} else {
		if (!rt.istype(action, T("/datum/action/item_action/clock/quickbind"))) return f.dot;
		Q = action;
		yield* this.recite_scripture(rt.index(this.quickbound, Q.scripture_index), user, 0);
	}
	return f.dot;
}, true);

// clockwork_slab.dm:230
rt.def("/obj/item/clockwork/slab/proc/show_hierophant", function* show_hierophant(f: Frame, user: Value) {
	let message: Value = null;
	if (!user.can_speak_vocal()) {
		to_chat(user, "<span class='warning'>You cannot speak into the slab!</span>");
		return 0;
	}
	if (!(message = (yield* stripped_input(user, "Enter a message to send to your fellow servants.", "Hierophant"))) || !user || !user.canUseTopic(this) || !user.can_speak_vocal()) {
		return 0;
	}
	yield* clockwork_say(user, text2ratvar(`Servants, hear my words. ${html_decode(message)}`), 1);
	titled_hierophant_message(user, message);
	return 1;
}, true);

// clockwork_slab.dm:242
rt.def("/obj/item/clockwork/slab/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (iscultist(user)) {
		to_chat(user, "<span class='heavy_brass'>\"You reek of blood. You've got a lot of nerve to even look at that slab.\"</span>");
		user.visible_message(`<span class='warning'>A sizzling sound comes from ${user}'s hands!</span>`, `<span class='userdanger'>${this} suddenly grows extremely hot in your hands!</span>`);
		playsound(rt.getStep(f, user, 0), rt.rsc("sound/weapons/sear.ogg"), 50, 1);
		yield* user.drop_item();
		yield* user.emote("scream");
		yield* user.apply_damage(5, "fire", "l_arm");
		yield* user.apply_damage(5, "fire", "r_arm");
		return 0;
	}
	if (!is_servant_of_ratvar(user)) {
		to_chat(user, `<span class='warning'>The information on ${this}'s display shifts rapidly. After a moment, your head begins to pound, and you tear your eyes away.</span>`);
		user.confused += 5;
		user.dizziness += 5;
		return 0;
	}
	if (this.busy) {
		to_chat(user, `<span class='warning'>${this} refuses to work, displaying the message: "${this.busy}!"</span>`);
		return 0;
	}
	if (!can_recite_scripture(user)) {
		to_chat(user, `<span class='nezbere'>${this} hums fitfully in your hands, but doesn't seem to do anything...</span>`);
		return 0;
	}
	yield* this.access_display(user);
	return f.dot;
}, true);

// clockwork_slab.dm:265
rt.def("/obj/item/clockwork/slab/proc/access_display", function* access_display(f: Frame, user: Value) {
	if (!is_servant_of_ratvar(user)) {
		return 0;
	}
	yield* this.ui_interact(user);
	return 1;
}, true);

// clockwork_slab.dm:271
rt.def("/obj/item/clockwork/slab/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.inventory_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	(ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "clockwork_slab", this.name, 800, 420, master_ui, state))).set_autoupdate(0);
	ui.set_style("clockwork");
	yield* ui.open();
	return f.dot;
}, true);

// clockwork_slab.dm:279
rt.def("/obj/item/clockwork/slab/proc/recite_scripture", function* recite_scripture(f: Frame, scripture: Value, user: Value) {
	let initial_tier: Value = null, scripture_to_recite: Value = null;
	if (!scripture || !user || !user.canUseTopic(this) || !can_recite_scripture(user)) {
		return 0;
	}
	if (user.get_active_held_item() != this) {
		to_chat(user, "<span class='warning'>You need to hold the slab in your active hand to recite scripture!</span>");
		return 0;
	}
	if ((initial_tier = rt.initial(f, scripture, "tier")) != "Peripheral") {
		if (!GLOB.ratvar_awakens && !this.no_cost && !rt.index(GLOB.SSticker.scripture_states, initial_tier)) {
			to_chat(user, "<span class='warning'>That scripture is not unlocked, and cannot be recited!</span>");
			return 0;
		}
	}
	(scripture_to_recite = (yield* new_(scripture))).slab = this;
	scripture_to_recite.invoker = user;
	yield* scripture_to_recite.run_scripture();
	return 1;
}, true, { argTypes: [{ path: "/datum/clockwork_scripture" }, { type: 8, path: "/mob/living" }] });

// clockwork_slab.dm:297
rt.def("/obj/item/clockwork/slab/proc/recollection", function recollection(f: Frame) {
	let i: Value = null, servants: Value = null, production_time: Value = null, M: Value = null, production_text_addon: Value = null, production_text: Value = null, i_5: Value = null, quickbind_slot: Value = null;
	let $e: any;
	let textlist: Value = list("If you're seeing this, file a bug report.");
	if (GLOB.ratvar_awakens) {
		textlist = list("<font color=#BE8700 size=3><b>");
		rt.forRange(f, 0, 1, 100, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			textlist += "HONOR RATVAR ";
		}
		rt.endFor(f, 0);
		textlist += "</b></font>";
	} else {
		servants = 0;
		production_time = SLAB_PRODUCTION_TIME;
		for (M of each(GLOB.living_mob_list, T("/mob/living"))) {
			if (is_servant_of_ratvar(M) && (rt.istype(M, T("/mob/living/carbon/human")) || rt.istype(M, T("/mob/living/silicon")))) {
				servants++;
			}
		}
		if (servants > SCRIPT_SERVANT_REQ) {
			servants -= SCRIPT_SERVANT_REQ;
			production_time += min(SLAB_SERVANT_SLOWDOWN * servants, SLAB_SLOWDOWN_MAXIMUM);
		}
		production_text_addon = "";
		if (production_time != 1800) {
			production_text_addon = `, which increases for each human or silicon servant above <b>${SCRIPT_SERVANT_REQ}</b>`;
		}
		production_time = production_time / 600;
		if (round(production_time)) {
			production_text = list(fmt("<b>＀ minute５", [round(production_time)]));
		}
		if (production_time != round(production_time)) {
			production_time -= round(production_time);
			production_time *= 60;
			if (!rt.length(production_text)) {
				production_text = list(fmt("<b>＀ second５", [round(production_time, 1)]));
			} else {
				production_text += fmt(" and ＀ second５", [round(production_time, 1)]);
			}
		}
		production_text += "</b>";
		textlist = list(`<font color=#BE8700 size=3><b><center>Chetr nyy hagehguf-naq-ubabe Ratvar.</center></b></font><br>First and foremost, you serve Ratvar, the Clockwork Justicar, in any ways he sees fit. This is with no regard to your personal well-being, and you would do well to think of the larger scale of things than your life. Ratvar wishes retribution upon those that trapped him in Reebe - the Nar-Sian cultists - and you are to help him obtain it.<br><br>Ratvar, being trapped in Reebe, the Celestial Derelict, cannot directly affect the mortal plane. However, links, such as this Clockwork Slab, can be created to draw <b><font color=#BE8700>Components</font></b>, fragments of the Justicar, from Reebe, and those Components can be used to draw power and material from Reebe through arcane chants known as <b><font color=#BE8700>Scripture</font></b>.<br><br>One component of a random type is made in this slab every ${(production_text = (production_text += production_text_addon).Join())}.<br><font color=#BE8700>Components</font> are stored either within slabs, where they can only be accessed by that slab, or in the Global Cache accessed by Tinkerer's Caches, which all slabs can draw from to recite scripture.<br>There are five types of component, and in general, <font color=#6E001A>Belligerent Eyes</font> are aggressive and judgemental, <font color=#1E8CE1>Vanguard Cogwheels</font> are defensive and repairing, <font color=#AF0AAF>Geis Capacitors</font> are for conversion and control, <font color=#5A6068>Replicant Alloy</font> is for construction and fuel, and <font color=#DAAA18>Hierophant Ansibles</font> are for transmission and power, though in combination their effects become more nuanced.<br><br>There are also four tiers of <font color=#BE8700>Scripture</font>; <font color=#BE8700>${"Driver"}</font>, <font color=#BE8700>${"Script"}</font>, <font color=#BE8700>${"Application"}</font>, and <font color=#BE8700>${"Judgement"}</font>.<br>Each tier has additional requirements, including Servants, Tinkerer's Caches, and <b>Construction Value</b>(<b>CV</b>). Construction Value is gained by creating structures or converting the station, and everything too large to hold will grant some amount of it.<br><br>This would be a massive amount of information to try and keep track of, but all Servants have the <b><font color=#BE8700>Global Records</font></b> alert, which appears in the top right.<br>Mousing over that alert will display Servants, Caches, CV, and other information, such as the tiers of scripture that are unlocked.<br><br>On that note, <font color=#BE8700>Scripture</font> is recited through <b><font color=#BE8700>Recital</font></b>, the first and most important function of the slab, which also allows <b>Quickbinding</b> scripture.<br>All scripture requires some amount of <font color=#BE8700>Components</font> to recite, and only the weakest scripture does not consume any components when recited.<br>However, weak is relative when it comes to scripture; even the 'weakest' could be enough to dominate a station in the hands of cunning Servants, and higher tiers of scripture are even stronger in the right hands.<br><br>Some effects of scripture include granting the invoker a temporary complete immunity to stuns, summoning a turret that can attack anything that sets eyes on it, or even binding a powerful guardian to the invoker.<br>However, the most important scripture is <font color=#AF0AAF>Geis</font>, which allows you to convert heathens with relative ease.<br><br>The second function of the clockwork slab is <b><font color=#BE8700>Recollection</font></b>, which will display this guide.<br><br>The remaining functions are several buttons in the top left while holding the slab.<br>From left to right, they are:<br><b><font color=#DAAA18>Hierophant Network</font></b>, which allows communication to other Servants.<br>`);
		if (rt.length(this.quickbound)) {
			rt.forRange(f, 0, 1, this.maximum_quickbound, 1);
			while (($e = rt.next(f, 0)) !== undefined) {
				i_5 = $e;
				if (rt.length(this.quickbound) < i_5 || !rt.index(this.quickbound, i_5)) {
					textlist += "A <b>Quickbind</b> slot, currently set to <b><font color=#BE8700>Nothing</font></b>.<br>";
				} else {
					textlist += `A <b>Quickbind</b> slot, currently set to <b><font color=${get_component_color_bright(rt.initial(f, (quickbind_slot = rt.index(this.quickbound, i_5)), "primary_component"))}>${rt.initial(f, quickbind_slot, "name")}</font></b>.<br>`;
				}
			}
			rt.endFor(f, 0);
		}
		textlist += "<br>Examine the slab or swap to Recital to check the number of components it has available.<br><br><font color=#BE8700 size=3><b><center>Purge all untruths and honor Ratvar.</center></b></font>";
	}
	return textlist.Join();
});

// clockwork_slab.dm:382
rt.def("/obj/item/clockwork/slab/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let data: Value = null, i: Value = null, s: Value = null, S: Value = null, scripture_color: Value = null, temp_info: Value = null, found: Value = null, costs_components: Value = null, i_8: Value = null, really_temp_data: Value = null, i_9: Value = null;
	let $e: any;
	rt.setAt((data = list()), "components", (yield* this.stored_components.Copy()));
	let temp_data: Value = list("<font color=#B18B25>");
	for (i of each(rt.at(data, "components"))) {
		temp_data += `<font color=${get_component_color_bright(i)}>${get_component_acronym(i)} <b>${rt.index(rt.at(data, "components"), i)}</b></font>`;
		if (i != "hierophant_ansible") {
			temp_data += " ";
		} else {
			temp_data += " (";
		}
	}
	if (GLOB.clockwork_caches) {
		i = null;
		for (i of each(GLOB.clockwork_component_cache)) {
			temp_data += `<font color=${get_component_color_bright(i)}>${get_component_acronym(i)} <b>${rt.index(rt.at(data, "components"), i) + rt.index(GLOB.clockwork_component_cache, i)}</b></font>`;
			if (i != "hierophant_ansible") {
				temp_data += " ";
			}
		}
	} else {
		temp_data += "<b>NONE</b>";
	}
	temp_data = (temp_data += ")</font>").Join();
	rt.setAt(data, "components", temp_data);
	if (this.selected_scripture === "Driver") {
		rt.setAt(data, "tier_info", "<font color=#B18B25><b>These scriptures are permenantly unlocked.</b></font>");
	} else if (this.selected_scripture === "Script") {
		if (rt.index(GLOB.SSticker.scripture_states, "Script")) {
			rt.setAt(data, "tier_info", "<font color=#B18B25><b>These scriptures are permenantly unlocked.</b></font>");
		} else {
			rt.setAt(data, "tier_info", `<font color=#B18B25><i>These scriptures require at least <b>${SCRIPT_SERVANT_REQ}</b> Servants and <b>${SCRIPT_CACHE_REQ}</b> Tinkerer's Cache.</i></font>`);
		}
	} else if (this.selected_scripture === "Application") {
		if (rt.index(GLOB.SSticker.scripture_states, "Application")) {
			rt.setAt(data, "tier_info", "<font color=#B18B25><b>These scriptures are permenantly unlocked.</b></font>");
		} else {
			rt.setAt(data, "tier_info", `<font color=#B18B25><i>These scriptures require at least <b>${APPLICATION_SERVANT_REQ}</b> Servants, <b>${APPLICATION_CACHE_REQ}</b> Tinkerer's Caches, and <b>${APPLICATION_CV_REQ}CV</b>.</i></font>`);
		}
	} else if (this.selected_scripture === "Judgement") {
		if (rt.index(GLOB.SSticker.scripture_states, "Judgement")) {
			rt.setAt(data, "tier_info", "<font color=#B18B25><b>This scripture is permenantly unlocked.</b></font>");
		} else {
			rt.setAt(data, "tier_info", `<font color=#B18B25><i>This scripture requires at least <b>${JUDGEMENT_SERVANT_REQ}</b> Servants, <b>${JUDGEMENT_CACHE_REQ}</b> Tinkerer's Caches, and <b>${JUDGEMENT_CV_REQ}CV</b>.<br>In addition, there may not be any active non-Servant AIs.</i></font>`);
		}
	}
	rt.setAt(data, "selected", this.selected_scripture);
	rt.setAt(data, "target_comp", "<font color=#B18B25>NONE</font>");
	if (this.target_component_id) {
		rt.setAt(data, "target_comp", `<font color=${get_component_color_bright(this.target_component_id)}>${get_component_acronym(this.target_component_id)}</font>`);
	}
	yield* generate_all_scripture();
	rt.setAt(data, "scripture", list());
	for (s of each(GLOB.all_scripture)) {
		if ((S = rt.index(GLOB.all_scripture, s)).tier == this.selected_scripture) {
			scripture_color = get_component_color_bright(S.primary_component);
			temp_info = rt.alist(f, ["name", `<font color=${scripture_color}><b>${S.name}</b></font>`, "descname", `<font color=${scripture_color}>(${S.descname})</font>`, "tip", `${S.desc}\n${S.usage_tip}`, "required", rt.alist(f, ["belligerent_eye", 0, "vanguard_cogwheel", 0, "geis_capacitor", 0, "replicant_alloy", 0, "hierophant_ansible", 0]), "type", `${S.type}`, "quickbind", S.quickbind]);
			if (found = this.quickbound.Find(S.type)) {
				rt.setAt(temp_info, "bound", `<b>${found}</b>`);
			}
			if (S.invokers_required > 1) {
				rt.setAt(temp_info, "invokers", `<font color=#B18B25>Invokers: <b>${S.invokers_required}</b></font>`);
			}
			costs_components = 0;
			i_8 = null;
			for (i_8 of each(S.consumed_components)) {
				if (rt.index(S.consumed_components, i_8)) {
					rt.modAt(rt.at(temp_info, "required"), i_8, rt.index(S.consumed_components, i_8), add);
					costs_components = 1;
				}
			}
			if (costs_components) {
				really_temp_data = list(": ");
				i_9 = null;
				for (i_9 of each(rt.at(temp_info, "required"))) {
					if (rt.index(rt.at(temp_info, "required"), i_9)) {
						really_temp_data += `<font color=${get_component_color_bright(i_9)}>${get_component_acronym(i_9)} <b>${rt.index(rt.at(temp_info, "required"), i_9)}</b></font> `;
					}
				}
				really_temp_data = really_temp_data.Join();
				rt.setAt(temp_info, "required", really_temp_data);
			} else {
				rt.setAt(temp_info, "required", "");
			}
			rt.modAt(data, "scripture", list(temp_info), add);
		}
	}
	rt.setAt(data, "recollection", this.recollecting);
	if (this.recollecting) {
		rt.setAt(data, "rec_text", this.recollection());
	}
	return data;
}, true);

// clockwork_slab.dm:466
rt.def("/obj/item/clockwork/slab/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let components: Value = null, i: Value = null, cache_components: Value = null, input_component: Value = null, path: Value = null, found_index: Value = null, target_index: Value = null, S: Value = null;
	let $e: any;
	if (action === "toggle") {
		this.recollecting = (!this.recollecting ? 1 : 0);
	} else if (action === "recite") {
		yield* ImmediateInvokeAsync(this, P("/obj/item/clockwork/slab/proc/recite_scripture"), text2path(rt.at(params, "category")), f.usr, 0);
	} else if (action === "select") {
		this.selected_scripture = rt.at(params, "category");
	} else if (action === "component") {
		components = list("Random Components");
		for (i of each(GLOB.clockwork_component_cache)) {
			cache_components = 0;
			if (GLOB.clockwork_caches) {
				cache_components = rt.index(GLOB.clockwork_component_cache, i);
			}
			rt.setAt(components, `${get_component_name(i)} ${cache_components + rt.index(this.stored_components, i)}`, i);
		}
		if ((input_component = (yield* g.op(f, "Prompt", [1], [null, null, "Target Component", "Choose a component type.", components]))) && !(yield* parent_proc())) {
			this.target_component_id = rt.index(components, input_component);
		}
	} else if (action === "bind") {
		path = text2path(rt.at(params, "category"));
		if (found_index = this.quickbound.Find(path)) {
			if (rt.length(this.quickbound) == found_index) {
				this.quickbound -= path;
			} else {
				rt.setAt(this.quickbound, found_index, null);
			}
			yield* this.update_quickbind();
		} else if (isnum((target_index = (yield* g.op(f, "Prompt", [33], [null, null, "Input", `Position of ${rt.initial(f, path, "name")}, 1 to ${this.maximum_quickbound}?`, null])))) && target_index > 0 && target_index <= this.maximum_quickbound && !(yield* parent_proc())) {
			if (rt.length(this.quickbound) >= target_index) {
				S = rt.index(this.quickbound, target_index);
			}
			if (S != path) {
				yield* this.quickbind_to_slot(path, target_index);
			}
		}
	}
	return 1;
}, true);

// clockwork_slab.dm:503
rt.def("/obj/item/clockwork/slab/proc/quickbind_to_slot", function* quickbind_to_slot(f: Frame, scripture: Value, index: Value) {
	let quickbind_slot: Value = null;
	if (!ispath(scripture) || !scripture || rt.isIn(f, scripture, this.quickbound)) {
		return f.dot;
	}
	while (rt.length(this.quickbound) < index) {
		this.quickbound += null;
	}
	if ((quickbind_slot = rt.index(GLOB.all_scripture, rt.index(this.quickbound, index))) && !quickbind_slot.quickbind) {
		return f.dot;
	}
	rt.setAt(this.quickbound, index, scripture);
	yield* this.update_quickbind();
	return f.dot;
}, true);

// clockwork_slab.dm:514
rt.def("/obj/item/clockwork/slab/proc/update_quickbind", function* update_quickbind(f: Frame) {
	let Q: Value = null, i: Value = null, Q_1: Value = null, quickbind_slot: Value = null, temp_desc: Value = null, c: Value = null;
	let $e: any;
	for (Q of each(this.actions, T("/datum/action/item_action/clock/quickbind"))) {
		yield* qdel(Q);
	}
	if (!rt.length(this.quickbound)) return f.dot;
	rt.forRange(f, 0, 1, rt.len(f, this.quickbound), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!rt.index(this.quickbound, i)) {
			continue;
		}
		(Q_1 = (yield* new_(T("/datum/action/item_action/clock/quickbind"), this))).scripture_index = i;
		quickbind_slot = rt.index(GLOB.all_scripture, rt.index(this.quickbound, i));
		Q_1.name = `${quickbind_slot.name} (${Q_1.scripture_index})`;
		temp_desc = list();
		c = null;
		for (c of each(quickbind_slot.consumed_components)) {
			if (rt.index(quickbind_slot.consumed_components, c)) {
				temp_desc += `<font color=${get_component_color_bright(c)}>${get_component_acronym(c)} <b>${rt.index(quickbind_slot.consumed_components, c)}</b></font> `;
			}
		}
		if (rt.length(temp_desc)) {
			temp_desc += "<br>";
		}
		temp_desc += `${quickbind_slot.quickbind_desc}`;
		Q_1.desc = temp_desc.Join();
		Q_1.button_icon_state = quickbind_slot.name;
		yield* Q_1.UpdateButtonIcon();
		if (rt.istype(this.loc, T("/mob/living"))) {
			yield* Q_1.Grant(this.loc);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
