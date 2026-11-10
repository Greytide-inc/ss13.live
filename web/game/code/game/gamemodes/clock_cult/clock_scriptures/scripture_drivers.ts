// Based on /tg/station's code/game/gamemodes/clock_cult/clock_scriptures/scripture_drivers.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, add } = rt;


rt.type(1199, "/datum/clockwork_scripture/channeled/belligerent", "/datum/clockwork_scripture/channeled", {
	descname: "Channeled, Area Slowdown",
	name: "Belligerent",
	desc: "Forces all nearby non-servants to walk rather than run, doing minor damage. Chanted every two seconds for up to thirty seconds.",
	chant_invocations: null,
	chant_amount: 15,
	chant_interval: 20,
	channel_time: 20,
	usage_tip: "Useful for crowd control in a populated area and disrupting mass movement.",
	tier: "Driver",
	primary_component: "belligerent_eye",
	sort_priority: 1,
	quickbind: 1,
	quickbind_desc: "Forces nearby non-Servants to walk, doing minor damage with each chant.<br><b>Maximum 15 chants.</b>",
});

// scripture_drivers.dm:22
rt.def("/datum/clockwork_scripture/channeled/belligerent/proc/chant_effects", function* chant_effects(f: Frame, chant_number: Value) {
	let C: Value = null;
	for (C of each(hearers(7, this.invoker), T("/mob/living/carbon"))) {
		yield* C.apply_status_effect(T("/datum/status_effect/belligerent"));
	}
	return 1;
}, true);

rt.type(1212, "/datum/clockwork_scripture/create_object/judicial_visor", "/datum/clockwork_scripture/create_object", {
	descname: "Delayed Area Knockdown Glasses",
	name: "Judicial Visor",
	desc: "Forms a visor that, when worn, will grant the ability to smite an area, knocking down, muting, and damaging non-Servants.",
	invocations: null,
	channel_time: 10,
	consumed_components: null,
	whispered: 1,
	creator_message: "<span class='brass'>You form a judicial visor, which is capable of smiting the unworthy.</span>",
	usage_tip: "The visor has a thirty-second cooldown once used, and the marker it creates has a delay of 3 seconds before exploding.",
	tier: "Driver",
	space_allowed: 1,
	primary_component: "belligerent_eye",
	sort_priority: 2,
	quickbind: 1,
	quickbind_desc: "Creates a Judicial Visor, which can create a Judicial Marker at an area, knocking down, muting, and damaging non-Servants after a delay.",
	object_path: rt.typePath("/obj/item/clothing/glasses/judicial_visor"),
});

// scripture_drivers.dm:32
rt.def("/datum/clockwork_scripture/create_object/judicial_visor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.invocations = list("Grant me the flames of Engine!");
	this.consumed_components = rt.alist(f, ["belligerent_eye", 1]);
	return f.dot;
});

rt.type(1232, "/datum/clockwork_scripture/vanguard", "/datum/clockwork_scripture", {
	descname: "Self Stun Immunity",
	name: "Vanguard",
	desc: "Provides twenty seconds of stun immunity. At the end of the twenty seconds, the invoker is knocked down for the equivalent of 25% of all stuns they absorbed. Excessive absorption will cause unconsciousness.",
	invocations: null,
	channel_time: 30,
	usage_tip: "You cannot reactivate Vanguard while still shielded by it.",
	tier: "Driver",
	primary_component: "vanguard_cogwheel",
	sort_priority: 3,
	quickbind: 1,
	quickbind_desc: "Allows you to temporarily absorb stuns. All stuns absorbed will affect you when disabled.",
});

// scripture_drivers.dm:63
rt.def("/datum/clockwork_scripture/vanguard/proc/check_special_requirements", function check_special_requirements(f: Frame) {
	if (!GLOB.ratvar_awakens && rt.istype(this.invoker.stun_absorption, T("/list")) && rt.index(this.invoker.stun_absorption, "vanguard") && rt.index(rt.index(this.invoker.stun_absorption, "vanguard"), "end_time") > rt.worldTime(f)) {
		to_chat(this.invoker, "<span class='warning'>You are already shielded by a Vanguard!</span>");
		return 0;
	}
	return 1;
});

// scripture_drivers.dm:70
rt.def("/datum/clockwork_scripture/vanguard/proc/scripture_effects", function* scripture_effects(f: Frame) {
	let L: Value = null;
	if (GLOB.ratvar_awakens) {
		for (L of each(view(7, rt.getStep(f, this.invoker, 0)), T("/mob/living"))) {
			if (L.stat != 2 && is_servant_of_ratvar(L)) {
				yield* L.apply_status_effect(T("/datum/status_effect/vanguard_shield"));
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	} else {
		yield* this.invoker.apply_status_effect(T("/datum/status_effect/vanguard_shield"));
	}
	return 1;
}, true);

rt.type(1227, "/datum/clockwork_scripture/ranged_ability/sentinels_compromise", "/datum/clockwork_scripture/ranged_ability", {
	descname: "Convert Brute/Burn/Oxygen to Half Toxin",
	name: "Sentinel's Compromise",
	desc: "Charges your slab with healing power, allowing you to convert all of a target Servant's brute, burn, and oxygen damage to half as much toxin damage.",
	invocations: null,
	channel_time: 30,
	consumed_components: null,
	usage_tip: "The Compromise is very fast to invoke, and will remove holy water from the target Servant.",
	tier: "Driver",
	primary_component: "vanguard_cogwheel",
	sort_priority: 4,
	quickbind: 1,
	quickbind_desc: "Allows you to convert a Servant's brute, burn, and oxygen damage to half toxin damage.<br><b>Click your slab to disable.</b>",
	slab_icon: "compromise",
	ranged_message: "<span class='inathneq_small'><i>You charge the clockwork slab with healing power.</i>\n<b>Left-click a fellow Servant or yourself to heal!\nClick your slab to cancel.</b></span>",
	ranged_type: rt.typePath("/obj/effect/proc_holder/slab/compromise"),
});

// scripture_drivers.dm:86
rt.def("/datum/clockwork_scripture/ranged_ability/sentinels_compromise/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.invocations = list("Mend the wounds of...", "...my inferior flesh.");
	this.consumed_components = rt.alist(f, ["vanguard_cogwheel", 1]);
	return f.dot;
});

rt.type(1228, "/datum/clockwork_scripture/ranged_ability/geis_prep", "/datum/clockwork_scripture/ranged_ability", {
	descname: "Melee Convert Attack",
	name: "Geis",
	desc: "Charges your slab with divine energy, allowing you to bind a nearby heretic for conversion. This is very obvious and will make your slab visible in-hand.",
	invocations: null,
	whispered: 1,
	channel_time: 20,
	usage_tip: "Is melee range and does not penetrate mindshield implants. Much more efficient than a Sigil of Submission at low Servant amounts.",
	tier: "Driver",
	primary_component: "geis_capacitor",
	sort_priority: 5,
	quickbind: 1,
	quickbind_desc: "Allows you to bind and start converting an adjacent target non-Servant.<br><b>Click your slab to disable.</b>",
	slab_icon: "geis",
	ranged_message: "<span class='sevtug_small'><i>You charge the clockwork slab with divine energy.</i>\n<b>Left-click a target within melee range to convert!\nClick your slab to cancel.</b></span>",
	timeout_time: 100,
	ranged_type: rt.typePath("/obj/effect/proc_holder/slab/geis"),
});

// scripture_drivers.dm:123
rt.def("/datum/clockwork_scripture/ranged_ability/geis_prep/proc/run_scripture", function* run_scripture(f: Frame) {
	let M: Value = null;
	let servants: Value = 0;
	if (!GLOB.ratvar_awakens) {
		for (M of each(GLOB.living_mob_list, T("/mob/living"))) {
			if (can_recite_scripture(M, 1)) {
				servants++;
			}
		}
	}
	if (servants > SCRIPT_SERVANT_REQ) {
		this.whispered = 0;
		servants -= SCRIPT_SERVANT_REQ;
		this.channel_time = min(this.channel_time + servants * 3, 50);
	}
	return (yield* parent_proc());
}, true);

rt.type(1233, "/datum/clockwork_scripture/geis", "/datum/clockwork_scripture", {
	target: null,
	binding: null,
	name: "Geis Conversion",
	invocations: null,
	channel_time: 49,
	tier: "Peripheral",
});

// scripture_drivers.dm:143
rt.def("/datum/clockwork_scripture/geis/proc/Destroy", function* Destroy(f: Frame) {
	if (this.binding && !(!this.binding || this.binding.gc_destroyed)) {
		yield* qdel(this.binding);
	}
	return (yield* parent_proc());
}, true);

// scripture_drivers.dm:148
rt.def("/datum/clockwork_scripture/geis/proc/can_recite", function can_recite(f: Frame) {
	if (!this.target) {
		return 0;
	}
	return parent_proc();
});

// scripture_drivers.dm:154
rt.def("/datum/clockwork_scripture/geis/proc/run_scripture", function* run_scripture(f: Frame) {
	let M: Value = null;
	let servants: Value = 0;
	if (!GLOB.ratvar_awakens) {
		for (M of each(GLOB.living_mob_list, T("/mob/living"))) {
			if (can_recite_scripture(M, 1)) {
				servants++;
			}
		}
	}
	if (this.target.buckled) {
		yield* this.target.buckled.unbuckle_mob(this.target, 1);
	}
	this.binding = (yield* new_(T("/obj/structure/destructible/clockwork/geis_binding"), rt.getStep(f, this.target, 0)));
	if (servants > SCRIPT_SERVANT_REQ) {
		servants -= SCRIPT_SERVANT_REQ;
		this.channel_time = min(this.channel_time + servants * 7, 120);
		this.binding.can_resist = 1;
	}
	yield* this.binding.setDir(this.target.dir);
	yield* this.binding.buckle_mob(this.target, 1);
	return (yield* parent_proc());
}, true);

// scripture_drivers.dm:170
rt.def("/datum/clockwork_scripture/geis/proc/check_special_requirements", function check_special_requirements(f: Frame) {
	return ((((this.target && this.binding) && (this.target.buckled == this.binding ? 1 : 0)) && (!is_servant_of_ratvar(this.target) ? 1 : 0)) && (this.target.stat != 2 ? 1 : 0));
});

// scripture_drivers.dm:173
rt.def("/datum/clockwork_scripture/geis/proc/scripture_effects", function* scripture_effects(f: Frame) {
	return (yield* add_servant_of_ratvar(this.target));
}, true);

rt.type(1200, "/datum/clockwork_scripture/channeled/taunting_tirade", "/datum/clockwork_scripture/channeled", {
	flee_time: 47,
	grace_period: 3,
	progbar: null,
	descname: "Channeled, Mobile Confusion Trail",
	name: "Taunting Tirade",
	desc: "Allows movement for five seconds, leaving a trail that confuses and knocks down. Chanted every second for up to thirty seconds.",
	chant_invocations: null,
	chant_amount: 5,
	chant_interval: 10,
	consumed_components: null,
	usage_tip: "Useful for fleeing attackers, as few will be able to follow someone using this scripture.",
	tier: "Driver",
	primary_component: "geis_capacitor",
	sort_priority: 6,
	quickbind: 1,
	quickbind_desc: "Allows movement for five seconds, leaving a trail that confuses and knocks down.<br><b>Maximum 5 chants.</b>",
});

// scripture_drivers.dm:184
rt.def("/datum/clockwork_scripture/channeled/taunting_tirade/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.chant_invocations = list("Hostiles on my back!", "Enemies on my trail!", "Gonna try and shake my tail.", "Bogeys on my six!");
	this.consumed_components = rt.alist(f, ["geis_capacitor", 1]);
	return f.dot;
});

// scripture_drivers.dm:196
rt.def("/datum/clockwork_scripture/channeled/taunting_tirade/proc/chant_effects", function* chant_effects(f: Frame, chant_number: Value) {
	this.invoker.visible_message(`<span class='warning'>${this.invoker} is suddenly covered with a thin layer of purple smoke!</span>`);
	let invoker_old_color: Value = this.invoker.color;
	this.invoker.color = list("#AF0AAF", "#AF0AAF", "#AF0AAF", "#000000");
	rt.op(f, "Animate", [2, 6], [null, this.invoker, "color", invoker_old_color, "time", this.flee_time + this.grace_period]);
	yield* addtimer((yield* new_(T("/datum/callback"), this.invoker, P("/atom/proc/update_atom_colour"))), this.flee_time + this.grace_period);
	let endtime: Value = rt.worldTime(f) + this.flee_time;
	this.progbar = (yield* new_(T("/datum/progressbar"), this.invoker, this.flee_time, this.invoker));
	this.progbar.bar.color = list("#AF0AAF", "#AF0AAF", "#AF0AAF", "#000000");
	rt.op(f, "Animate", [2, 6], [null, this.progbar.bar, "color", rt.initial(f, this.progbar.bar, "color"), "time", this.flee_time + this.grace_period]);
	while (rt.worldTime(f) < endtime && this.can_recite()) {
		yield* sleep(1);
		yield* new_(T("/obj/structure/destructible/clockwork/taunting_trail"), this.invoker.loc);
		yield* this.progbar.update(endtime - rt.worldTime(f));
	}
	yield* qdel(this.progbar);
	if (this.can_recite() && chant_number != this.chant_amount) {
		yield* sleep(this.grace_period);
	} else {
		return 0;
	}
	return 1;
}, true);

// scripture_drivers.dm:217
rt.def("/datum/clockwork_scripture/channeled/taunting_tirade/proc/chant_end_effects", function* chant_end_effects(f: Frame) {
	yield* qdel(this.progbar);
	return f.dot;
}, true);

rt.type(1213, "/datum/clockwork_scripture/create_object/replicant", "/datum/clockwork_scripture/create_object", {
	descname: "New Clockwork Slab",
	name: "Replicant",
	desc: "Creates a new clockwork slab.",
	invocations: null,
	channel_time: 10,
	whispered: 1,
	creator_message: "<span class='brass'>You copy a piece of replicant alloy and command it into a new slab.</span>",
	usage_tip: "This is inefficient as a way to produce components, as the slab produced must be held by someone with no other slabs to produce components.",
	tier: "Driver",
	space_allowed: 1,
	primary_component: "replicant_alloy",
	sort_priority: 7,
	quickbind: 1,
	quickbind_desc: "Creates a new Clockwork Slab.",
	object_path: rt.typePath("/obj/item/clockwork/slab"),
});

// scripture_drivers.dm:225
rt.def("/datum/clockwork_scripture/create_object/replicant/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.invocations = list("Metal, become greater!");
	return f.dot;
});

rt.type(1214, "/datum/clockwork_scripture/create_object/tinkerers_cache", "/datum/clockwork_scripture/create_object", {
	descname: "Necessary Structure, Shares Components",
	name: "Tinkerer's Cache",
	desc: "Forms a cache that can store an infinite amount of components. All caches are linked and will provide components to slabs. Striking a cache with a slab will transfer that slab's components to the global cache.",
	invocations: null,
	channel_time: 50,
	consumed_components: null,
	creator_message: "<span class='brass'>You form a tinkerer's cache, which is capable of storing components, which will automatically be used by slabs.</span>",
	observer_message: "<span class='warning'>A hollow brass spire rises and begins to blaze!</span>",
	usage_tip: "Slabs will draw components from the global cache after the slab's own repositories, making caches extremely useful.",
	tier: "Driver",
	one_per_tile: 1,
	primary_component: "replicant_alloy",
	sort_priority: 8,
	quickbind: 1,
	quickbind_desc: "Creates a Tinkerer's Cache, which stores components globally for slab access.",
	object_path: rt.typePath("/obj/structure/destructible/clockwork/cache"),
}, { global: { prev_cost: 653 } });

// scripture_drivers.dm:247
rt.def("/datum/clockwork_scripture/create_object/tinkerers_cache/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.invocations = list("Constructing...", "...a cache!");
	this.consumed_components = rt.alist(f, ["belligerent_eye", 0, "vanguard_cogwheel", 0, "geis_capacitor", 0, "replicant_alloy", 1, "hierophant_ansible", 0]);
	return f.dot;
});

// scripture_drivers.dm:261
rt.def("/datum/clockwork_scripture/create_object/tinkerers_cache/proc/creation_update", function creation_update(f: Frame) {
	let cache_cost_increase: Value = null, i: Value = null;
	if ((cache_cost_increase = min(round(GLOB.clockwork_caches * 0.4), 10)) != GLOB.prev_cost) {
		GLOB.prev_cost = cache_cost_increase;
		this.consumed_components = rt.alist(f, ["belligerent_eye", 0, "vanguard_cogwheel", 0, "geis_capacitor", 0, "replicant_alloy", 1, "hierophant_ansible", 0]);
		for (i of each(this.consumed_components)) {
			if (i != "replicant_alloy") {
				rt.modAt(this.consumed_components, i, cache_cost_increase, add);
			}
		}
		return 1;
	}
	return 0;
});

rt.type(1215, "/datum/clockwork_scripture/create_object/wraith_spectacles", "/datum/clockwork_scripture/create_object", {
	descname: "Limited Xray Vision Glasses",
	name: "Wraith Spectacles",
	desc: "Fabricates a pair of glasses which grant true sight but cause gradual vision loss.",
	invocations: null,
	channel_time: 10,
	whispered: 1,
	creator_message: "<span class='brass'>You form a pair of wraith spectacles, which grant true sight but cause gradual vision loss.</span>",
	usage_tip: "\"True sight\" means that you are able to see through walls and in darkness.",
	tier: "Driver",
	space_allowed: 1,
	primary_component: "hierophant_ansible",
	sort_priority: 9,
	quickbind: 1,
	quickbind_desc: "Creates a pair of Wraith Spectacles, which grant true sight but cause gradual vision loss.",
	object_path: rt.typePath("/obj/item/clothing/glasses/wraith_spectacles"),
});

// scripture_drivers.dm:277
rt.def("/datum/clockwork_scripture/create_object/wraith_spectacles/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.invocations = list("Show the truth of this world to me!");
	return f.dot;
});

rt.type(1216, "/datum/clockwork_scripture/create_object/sigil_of_transgression", "/datum/clockwork_scripture/create_object", {
	descname: "Trap, Stunning",
	name: "Sigil of Transgression",
	desc: "Wards a tile with a sigil, which will stun the next non-Servant to cross it.",
	invocations: null,
	channel_time: 50,
	consumed_components: null,
	whispered: 1,
	creator_message: "<span class='brass'>A sigil silently appears below you. The next non-Servant to cross it will be stunned.</span>",
	usage_tip: "The sigil, while fairly powerful in its stun, does not induce muteness in its victim.",
	tier: "Driver",
	one_per_tile: 1,
	primary_component: "hierophant_ansible",
	sort_priority: 10,
	quickbind: 1,
	quickbind_desc: "Creates a Sigil of Transgression, which will stun the next non-Servant to cross it.",
	object_path: rt.typePath("/obj/effect/clockwork/sigil/transgression"),
});

// scripture_drivers.dm:298
rt.def("/datum/clockwork_scripture/create_object/sigil_of_transgression/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.invocations = list("Divinity, smite...", "...those who tresspass here!");
	this.consumed_components = rt.alist(f, ["hierophant_ansible", 1]);
	return f.dot;
});
