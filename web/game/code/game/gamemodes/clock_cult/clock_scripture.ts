// Based on /tg/station's code/game/gamemodes/clock_cult/clock_scripture.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, add, multiply } = rt;


rt.type(1197, "/datum/clockwork_scripture", "/datum", {
	descname: "useless",
	name: "scripture",
	desc: "Ancient Ratvarian lore. This piece seems particularly mundane.",
	invocations: null,
	channel_time: 10,
	consumed_components: null,
	slab: null,
	invoker: null,
	whispered: 0,
	usage_tip: "This piece seems to serve no purpose and is a waste of components.",
	invokers_required: 1,
	multiple_invokers_used: 0,
	multiple_invokers_optional: 0,
	tier: "Peripheral",
	quickbind: 0,
	quickbind_desc: "This shouldn't be quickbindable. File a bug report!",
	primary_component: null,
	sort_priority: 1,
	used_slab_components: null,
	used_cache_components: null,
}, { global: { neovgre_penalty: 645, inathneq_penalty: 646, sevtug_penalty: 647, nezbere_penalty: 648, nzcrentr_penalty: 649 } });

// clock_scripture.dm:16
rt.def("/datum/clockwork_scripture/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.invocations = list();
	this.consumed_components = rt.alist(f, ["belligerent_eye", 0, "vanguard_cogwheel", 0, "geis_capacitor", 0, "replicant_alloy", 0, "hierophant_ansible", 0]);
	this.used_slab_components = rt.alist(f, ["belligerent_eye", 0, "vanguard_cogwheel", 0, "geis_capacitor", 0, "replicant_alloy", 0, "hierophant_ansible", 0]);
	this.used_cache_components = rt.alist(f, ["belligerent_eye", 0, "vanguard_cogwheel", 0, "geis_capacitor", 0, "replicant_alloy", 0, "hierophant_ansible", 0]);
	return f.dot;
});

// clock_scripture.dm:49
rt.def("/datum/clockwork_scripture/proc/New", function New(f: Frame) {
	this.creation_update();
	return f.dot;
});

// clock_scripture.dm:56
rt.def("/datum/clockwork_scripture/proc/run_scripture", function* run_scripture(f: Frame) {
	let i: Value = null, j: Value = null;
	let $e: any;
	let successful: Value = 0;
	if (this.can_recite() && this.has_requirements()) {
		if (this.slab.busy) {
			to_chat(this.invoker, `<span class='warning'>${this.slab} refuses to work, displaying the message: "${this.slab.busy}!"</span>`);
			return 0;
		}
		this.slab.busy = `Invocation (${this.name}) in progress`;
		if (GLOB.ratvar_awakens) {
			this.channel_time *= 0.5;
		} else if (!this.slab.no_cost) {
			for (i of each(this.consumed_components)) {
				if (rt.index(this.consumed_components, i)) {
					j = null;
					rt.forRange(f, 1, 1, rt.index(this.consumed_components, i), 1);
					while (($e = rt.next(f, 1)) !== undefined) {
						j = $e;
						if (rt.index(this.slab.stored_components, i)) {
							rt.incAt(this.slab.stored_components, i, -1, true);
							rt.incAt(this.used_slab_components, i, 1, true);
						} else {
							rt.incAt(GLOB.clockwork_component_cache, i, -1, true);
							rt.incAt(this.used_cache_components, i, 1, true);
						}
					}
					rt.endFor(f, 1);
				}
			}
			yield* update_slab_info();
		}
		this.channel_time *= this.slab.speed_multiplier;
		if (!(yield* this.recital()) || !this.check_special_requirements() || !(yield* this.scripture_effects())) {
			i = null;
			for (i of each(this.used_slab_components)) {
				if (rt.index(this.used_slab_components, i)) {
					if (this.slab) {
						rt.modAt(this.slab.stored_components, i, rt.index(this.consumed_components, i), add);
					} else {
						rt.modAt(GLOB.clockwork_component_cache, i, rt.index(this.consumed_components, i), add);
					}
				}
			}
			i = null;
			for (i of each(this.used_cache_components)) {
				if (rt.index(this.used_cache_components, i)) {
					rt.modAt(GLOB.clockwork_component_cache, i, rt.index(this.consumed_components, i), add);
				}
			}
			yield* update_slab_info();
		} else {
			successful = 1;
		}
	}
	if (this.slab) {
		this.slab.busy = null;
	}
	yield* qdel(this);
	return successful;
}, true);

// clock_scripture.dm:96
rt.def("/datum/clockwork_scripture/proc/can_recite", function can_recite(f: Frame) {
	if (!this.invoker || !this.slab || this.invoker.get_active_held_item() != this.slab) {
		return 0;
	}
	if (!this.invoker.can_speak_vocal()) {
		to_chat(this.invoker, "<span class='warning'>You are unable to speak the words of the scripture!</span>");
		return 0;
	}
	return 1;
});

// clock_scripture.dm:105
rt.def("/datum/clockwork_scripture/proc/has_requirements", function has_requirements(f: Frame) {
	let component_printout: Value = null, failed: Value = null, i: Value = null, cache_components: Value = null, total_components: Value = null, nearby_servants: Value = null, L: Value = null, message: Value = null, ratvarian_prob: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $e: any;
	let checked_penalty: Value = 0;
	if (!GLOB.ratvar_awakens && !this.slab.no_cost) {
		checked_penalty = this.check_offstation_penalty();
		component_printout = "<span class='warning'>You lack the components to recite this piece of scripture!";
		failed = 0;
		for (i of each(this.consumed_components)) {
			cache_components = GLOB.clockwork_caches ? rt.index(GLOB.clockwork_component_cache, i) : 0;
			total_components = rt.index(this.slab.stored_components, i) + cache_components;
			if (rt.index(this.consumed_components, i) && total_components < rt.index(this.consumed_components, i)) {
				$0 = get_component_span(i);
				$1 = total_components;
				$2 = rt.index(this.consumed_components, i);
				$3 = get_component_name(i);
				if (i != "replicant_alloy") {
					$4 = "s";
				} else {
					$4 = "";
				}
				component_printout += `\nYou have <span class='${$0}_small'><b>${$1}/${$2}</b> ${$3}${$4}.</span>`;
				failed = 1;
			}
		}
		if (failed) {
			component_printout += "</span>";
			to_chat(this.invoker, component_printout);
			return 0;
		}
	}
	if (this.multiple_invokers_used && !this.multiple_invokers_optional && !GLOB.ratvar_awakens && !this.slab.no_cost) {
		nearby_servants = 0;
		for (L of each(range(1, rt.getStep(f, this.invoker, 0)), T("/mob/living"))) {
			if (can_recite_scripture(L)) {
				nearby_servants++;
			}
		}
		if (nearby_servants < this.invokers_required) {
			to_chat(this.invoker, `<span class='warning'>There aren't enough non-mute servants nearby (${nearby_servants}/${this.invokers_required})!</span>`);
			return 0;
		}
	}
	if (!this.check_special_requirements()) {
		return 0;
	}
	if (checked_penalty && !this.slab.busy) {
		ratvarian_prob = 0;
		if (this.primary_component === "belligerent_eye") {
			message = pick(GLOB.neovgre_penalty);
			ratvarian_prob = 55;
		} else if (this.primary_component === "vanguard_cogwheel") {
			message = pick(GLOB.inathneq_penalty);
			ratvarian_prob = 25;
		} else if (this.primary_component === "geis_capacitor") {
			message = pick(GLOB.sevtug_penalty);
			ratvarian_prob = 40;
		} else if (this.primary_component === "replicant_alloy") {
			message = pick(GLOB.nezbere_penalty);
			ratvarian_prob = 10;
		} else if (this.primary_component === "hierophant_ansible") {
			message = pick(GLOB.nzcrentr_penalty);
			ratvarian_prob = 70;
		}
		if (message) {
			if (prob(ratvarian_prob)) {
				message = text2ratvar(message);
			}
			to_chat(this.invoker, `<span class='${get_component_span(this.primary_component)}_large'>"${message}"</span>`);
			rt.op(f, "OutputReference", [rt.R.srcVar("invoker")], [rt.rsc("sound/magic/clockwork/invoke_general.ogg")], false);
		}
	}
	return 1;
});

// clock_scripture.dm:157
rt.def("/datum/clockwork_scripture/proc/check_offstation_penalty", function check_offstation_penalty(f: Frame) {
	let _T: Value = null, i: Value = null;
	if (!(_T = rt.getStep(f, this.invoker, 0)) || _T.z != ZLEVEL_STATION && _T.z != ZLEVEL_CENTCOM && _T.z != ZLEVEL_MINING && _T.z != ZLEVEL_LAVALAND) {
		this.channel_time *= 2;
		for (i of each(this.consumed_components)) {
			if (rt.index(this.consumed_components, i)) {
				(rt.modAt(this.consumed_components, i, 2, multiply));
			}
		}
		return 1;
	}
	return 0;
});

// clock_scripture.dm:170
rt.def("/datum/clockwork_scripture/proc/recital", function* recital(f: Frame) {
	let L: Value = null, invocation: Value = null, invocation_0: Value = null, L_1: Value = null;
	let $1: any, $e: any;
	if (!this.channel_time && rt.len(f, this.invocations)) {
		if (this.multiple_invokers_used) {
			for (L of each(range(1, this.invoker), T("/mob/living"))) {
				if (can_recite_scripture(L)) {
					invocation = null;
					for (invocation of each(this.invocations)) {
						yield* clockwork_say(L, text2ratvar(invocation), this.whispered);
					}
				}
			}
		} else {
			for (invocation_0 of each(this.invocations)) {
				yield* clockwork_say(this.invoker, text2ratvar(invocation_0), this.whispered);
			}
		}
	}
	let $0: any = this.invoker;
	if (this.channel_time <= 0) {
		$1 = "recite";
	} else {
		$1 = "begin reciting";
	}
	to_chat($0, `<span class='brass'>You ${$1} a piece of scripture entitled "${this.name}".</span>`);
	if (!this.channel_time) {
		return 1;
	}
	invocation_0 = null;
	for (invocation_0 of each(this.invocations)) {
		if (!(yield* do_after(this.invoker, this.channel_time / rt.len(f, this.invocations), { target: this.invoker, extra_checks: (yield* new_(T("/datum/callback"), this, P("/datum/clockwork_scripture/proc/check_special_requirements"))) }))) {
			this.slab.busy = null;
			return 0;
		}
		if (this.multiple_invokers_used) {
			L_1 = null;
			for (L_1 of each(range(1, rt.getStep(f, this.invoker, 0)), T("/mob/living"))) {
				if (can_recite_scripture(L_1)) {
					yield* clockwork_say(L_1, text2ratvar(invocation_0), this.whispered);
				}
			}
		} else {
			yield* clockwork_say(this.invoker, text2ratvar(invocation_0), this.whispered);
		}
	}
	return 1;
}, true);

rt.type(1198, "/datum/clockwork_scripture/channeled", "/datum/clockwork_scripture", {
	chant_invocations: null,
	chant_amount: 5,
	chant_interval: 10,
});

// Empty in tg.
rt.def("/datum/clockwork_scripture/channeled/proc/chant_effects", undefined, false, { args: ["chant_number"] });

// clock_scripture.dm:199
rt.def("/datum/clockwork_scripture/channeled/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.chant_invocations = list("AYY LMAO");
	return f.dot;
});

// clock_scripture.dm:204
rt.def("/datum/clockwork_scripture/channeled/proc/check_offstation_penalty", function check_offstation_penalty(f: Frame) {
	f.dot = parent_proc();
	if (!f.dot) return f.dot;
	this.chant_interval *= 2;
	return f.dot;
});

// clock_scripture.dm:209
rt.def("/datum/clockwork_scripture/channeled/proc/scripture_effects", function* scripture_effects(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, this.chant_amount, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!(yield* do_after(this.invoker, this.chant_interval, { target: this.invoker, extra_checks: (yield* new_(T("/datum/callback"), this, P("/datum/clockwork_scripture/proc/can_recite"))) }))) {
			break;
		}
		yield* clockwork_say(this.invoker, text2ratvar(pick(this.chant_invocations)), this.whispered);
		if (!(yield* this.chant_effects(i))) {
			break;
		}
	}
	rt.endFor(f, 0);
	if (this.invoker && this.slab) {
		yield* this.chant_end_effects();
	}
	return 1;
}, true);

// clock_scripture.dm:222
rt.def("/datum/clockwork_scripture/channeled/proc/chant_end_effects", function chant_end_effects(f: Frame) {
	to_chat(this.invoker, "<span class='brass'>You cease your chant.</span>");
	return f.dot;
});

rt.type(1203, "/datum/clockwork_scripture/create_object", "/datum/clockwork_scripture", {
	creator_message: "<span class='brass'>You create a meme.</span>",
	observer_message: null,
	one_per_tile: 0,
	prevent_path: null,
	space_allowed: 0,
	object_path: rt.typePath("/obj/item/clockwork"),
});

// clock_scripture.dm:235
rt.def("/datum/clockwork_scripture/create_object/proc/New", function New(f: Frame) {
	parent_proc();
	if (this.prevent_path) return f.dot;
	this.prevent_path = this.object_path;
	return f.dot;
});

// clock_scripture.dm:240
rt.def("/datum/clockwork_scripture/create_object/proc/check_special_requirements", function check_special_requirements(f: Frame) {
	let _T: Value = rt.getStep(f, this.invoker, 0);
	if (!this.space_allowed && rt.istype(_T, T("/turf/open/space"))) {
		to_chat(this.invoker, "<span class='warning'>You need solid ground to place this object!</span>");
		return 0;
	}
	if (this.one_per_tile && rt.locateIn(f, this.prevent_path, _T)) {
		to_chat(this.invoker, "<span class='warning'>You can only place one of this object on each tile!</span>");
		return 0;
	}
	return 1;
});

// clock_scripture.dm:250
rt.def("/datum/clockwork_scripture/create_object/proc/scripture_effects", function* scripture_effects(f: Frame) {
	let O: Value = null;
	if (this.creator_message && this.observer_message) {
		this.invoker.visible_message(this.observer_message, this.creator_message);
	} else if (this.creator_message) {
		to_chat(this.invoker, this.creator_message);
	}
	yield* (O = (yield* new_(this.object_path, rt.getStep(f, this.invoker, 0)))).ratvar_act();
	if (rt.istype(O, T("/obj/item"))) {
		yield* this.invoker.put_in_hands(O);
	}
	return 1;
}, true);

rt.type(1224, "/datum/clockwork_scripture/ranged_ability", "/datum/clockwork_scripture", {
	slab_icon: "dread_ipad",
	ranged_message: "This is a huge goddamn bug, how'd you cast this?",
	timeout_time: 0,
	allow_mobility: 1,
	progbar: null,
	ranged_type: rt.typePath("/obj/effect/proc_holder/slab"),
});

// clock_scripture.dm:270
rt.def("/datum/clockwork_scripture/ranged_ability/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.progbar);
	return (yield* parent_proc());
}, true);

// clock_scripture.dm:275
rt.def("/datum/clockwork_scripture/ranged_ability/proc/scripture_effects", function* scripture_effects(f: Frame) {
	this.slab.icon_state = this.slab_icon;
	this.slab.slab_ability = (yield* new_(this.ranged_type, this.slab));
	this.slab.slab_ability.slab = this.slab;
	yield* this.slab.slab_ability.add_ranged_ability(this.invoker, this.ranged_message);
	yield* this.invoker.update_inv_hands();
	let end_time: Value = rt.worldTime(f) + this.timeout_time;
	let successful: Value = 0;
	if (this.timeout_time) {
		this.progbar = (yield* new_(T("/datum/progressbar"), this.invoker, this.timeout_time, this.slab));
	}
	let _T: Value = rt.getStep(f, this.invoker, 0);
	while (this.slab && this.slab.slab_ability && !this.slab.slab_ability.finished && (this.slab.slab_ability.in_progress || !this.timeout_time || rt.worldTime(f) <= end_time) && (this.allow_mobility || this.can_recite() && _T == rt.getStep(f, this.invoker, 0))) {
		if (this.progbar) {
			if (this.slab.slab_ability.in_progress) {
				yield* qdel(this.progbar);
			} else {
				yield* this.progbar.update(end_time - rt.worldTime(f));
			}
		}
		yield* sleep(1);
	}
	if (this.slab) {
		if (this.slab.slab_ability) {
			successful = this.slab.slab_ability.successful;
			if (!this.slab.slab_ability.finished) {
				yield* this.slab.slab_ability.remove_ranged_ability();
			}
		}
		this.slab.icon_state = "dread_ipad";
		if (this.invoker) {
			yield* this.invoker.update_inv_hands();
		}
	}
	return successful;
}, true);
