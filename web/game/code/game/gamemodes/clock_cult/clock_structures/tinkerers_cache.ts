// Based on /tg/station's code/game/gamemodes/clock_cult/clock_structures/tinkerers_cache.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add } = rt;


rt.type(12164, "/obj/structure/destructible/clockwork/cache", "/obj/structure/destructible/clockwork", {
	wall_generation_cooldown: null,
	linkedwall: null,
	clockwork_desc: "A brass container capable of storing a large amount of components.\nShares components with all other caches and will gradually generate components if near a Clockwork Wall.",
	unanchored_icon: "tinkerers_cache_unwrenched",
	construction_value: 10,
	light_color: "#C2852F",
	name: "tinkerer's cache",
	desc: "A large brass spire with a flaming hole in its center.",
	icon_state: "tinkerers_cache",
	break_message: "<span class='warning'>The cache's fire winks out before it falls in on itself!</span>",
	max_integrity: 80,
	obj_integrity: 80,
}, { global: { linked_caches: 792 } });

// tinkerers_cache.dm:19
rt.def("/obj/structure/destructible/clockwork/cache/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	GLOB.clockwork_caches++;
	yield* update_slab_info();
	this.set_light(2, 0.7);
	return f.dot;
}, true);

// tinkerers_cache.dm:26
rt.def("/obj/structure/destructible/clockwork/cache/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.clockwork_caches--;
	yield* update_slab_info();
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	if (this.linkedwall) {
		GLOB.linked_caches--;
		this.linkedwall.linkedcache = null;
		this.linkedwall = null;
	}
	return (yield* parent_proc());
}, true);

// tinkerers_cache.dm:36
rt.def("/obj/structure/destructible/clockwork/cache/proc/process", function* process(f: Frame) {
	let C: Value = null;
	if (!this.anchored) {
		if (this.linkedwall) {
			GLOB.linked_caches--;
			this.linkedwall.linkedcache = null;
			this.linkedwall = null;
		}
		return f.dot;
	}
	for (C of each(range(4, this), T("/turf/closed/wall/clockwork"))) {
		if (!C.linkedcache && !this.linkedwall) {
			GLOB.linked_caches++;
			C.linkedcache = this;
			this.linkedwall = C;
			this.wall_generation_cooldown = rt.worldTime(f) + this.get_production_time();
			this.visible_message(`<span class='warning'>${this} starts to whirr in the presence of ${C}...</span>`);
			break;
		}
	}
	if (!(this.linkedwall && this.wall_generation_cooldown <= rt.worldTime(f))) return f.dot;
	this.wall_generation_cooldown = rt.worldTime(f) + this.get_production_time();
	let component_id: Value = (yield* generate_cache_component(null, this));
	playsound(this.linkedwall, rt.rsc("sound/magic/clockwork/fellowship_armory.ogg"), rand(15, 20), 1, -3, 1, 1);
	this.visible_message(`<span class='${get_component_span(component_id)}'>Something</span><span class='warning'> cl${pick("ank", "ink", "unk", "ang")}s around inside of ${this}...</span>`);
	return f.dot;
}, true, { waitfor: false });

// tinkerers_cache.dm:57
rt.def("/obj/structure/destructible/clockwork/cache/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let C: Value = null, S: Value = null, i: Value = null;
	if (!is_servant_of_ratvar(user)) {
		return (yield* parent_proc());
	}
	if (rt.istype(I, T("/obj/item/clockwork/component"))) {
		C = I;
		if (!this.anchored) {
			to_chat(user, `<span class='warning'>${this} needs to be secured to place ${C} into it!</span>`);
		} else {
			rt.incAt(GLOB.clockwork_component_cache, C.component_id, 1, true);
			yield* update_slab_info();
			to_chat(user, `<span class='notice'>You add ${C} to ${this}.</span>`);
			yield* user.drop_item();
			yield* qdel(C);
		}
		return 1;
	} else if (rt.istype(I, T("/obj/item/clockwork/slab"))) {
		S = I;
		if (!this.anchored) {
			to_chat(user, `<span class='warning'>${this} needs to be secured to offload your slab's components into it!</span>`);
		} else {
			for (i of each(S.stored_components)) {
				rt.modAt(GLOB.clockwork_component_cache, i, rt.index(S.stored_components, i), add);
				rt.setAt(S.stored_components, i, 0);
			}
			yield* update_slab_info();
			user.visible_message(`<span class='notice'>${user} empties ${S} into ${this}.</span>`, `<span class='notice'>You offload your slab's components into ${this}.</span>`);
		}
		return 1;
	} else {
		return (yield* parent_proc());
	}
}, true);

// tinkerers_cache.dm:85
rt.def("/obj/structure/destructible/clockwork/cache/proc/update_anchored", function* update_anchored(f: Frame, user: Value, do_damage: Value) {
	yield* parent_proc();
	if (this.anchored) {
		this.set_light(2, 0.7);
	} else {
		this.set_light(0);
	}
	return f.dot;
}, true);

// tinkerers_cache.dm:92
rt.def("/obj/structure/destructible/clockwork/cache/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let temp_time: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	yield* parent_proc();
	if (!is_servant_of_ratvar(user)) return f.dot;
	if (this.linkedwall) {
		if (this.wall_generation_cooldown > rt.worldTime(f)) {
			temp_time = (this.wall_generation_cooldown - rt.worldTime(f)) * 0.1;
			$0 = user;
			$1 = this;
			$2 = temp_time;
			if (temp_time == 1) {
				$3 = "";
			} else {
				$3 = "s";
			}
			to_chat($0, `<span class='alloy'>${$1} will produce a component in <b>${$2}</b> second${$3}.</span>`);
		} else {
			to_chat(user, `<span class='brass'>${this} is about to produce a component!</span>`);
		}
	} else if (this.anchored) {
		to_chat(user, `<span class='alloy'>${this} is unlinked! Construct a Clockwork Wall nearby to generate components!</span>`);
	} else {
		to_chat(user, `<span class='alloy'>${this} needs to be secured to generate components!</span>`);
	}
	return f.dot;
}, true);

// tinkerers_cache.dm:106
rt.def("/obj/structure/destructible/clockwork/cache/proc/examine", function examine(f: Frame, user: Value) {
	let i: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	parent_proc();
	if (!(is_servant_of_ratvar(user) || rt.istype(user, T("/mob/dead/observer")))) return f.dot;
	if (this.linkedwall) {
		to_chat(user, `<span class='brass'>It is linked to a Clockwork Wall and will generate a component every <b>${round(this.get_production_time() * 0.1, 0.1)}</b> seconds!</span>`);
	} else {
		to_chat(user, "<span class='alloy'>It is unlinked! Construct a Clockwork Wall nearby to generate components!</span>");
	}
	to_chat(user, "<b>Stored components:</b>");
	for (i of each(GLOB.clockwork_component_cache)) {
		$0 = user;
		$1 = get_component_span(i);
		$2 = get_component_name(i);
		if (i != "replicant_alloy") {
			$3 = "s";
		} else {
			$3 = "";
		}
		to_chat($0, `<span class='${$1}_small'><i>${$2}${$3}:</i> <b>${rt.index(GLOB.clockwork_component_cache, i)}</b></span>`);
	}
	return f.dot;
}, false);

// tinkerers_cache.dm:117
rt.def("/obj/structure/destructible/clockwork/cache/proc/get_production_time", function get_production_time(f: Frame) {
	return (CACHE_PRODUCTION_TIME + ACTIVE_CACHE_SLOWDOWN * GLOB.linked_caches) * this.get_efficiency_mod(1);
});
