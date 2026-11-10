// Based on /tg/station's code/game/objects/structures/aliens.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(12710, "/obj/structure/alien", "/obj/structure", {
	icon: rt.rsc("icons/mob/alien.dmi"),
	obj_integrity: 100,
	max_integrity: 100,
});

// aliens.dm:16
rt.def("/obj/structure/alien/proc/run_obj_armor", function run_obj_armor(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[2] == "melee") {
		const subject = f.args[1];
		if (subject === "brute") {
			f.args[0] *= 0.25;
		} else if (subject === "fire") {
			f.args[0] *= 2;
		}
	}
	f.dot = parent_proc();
	return f.dot;
}, false, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });

// aliens.dm:25
rt.def("/obj/structure/alien/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		if (damage_amount) {
			playsound(this.loc, rt.rsc("sound/effects/attackblob.ogg"), 100, 1);
		} else {
			playsound(this, rt.rsc("sound/weapons/tap.ogg"), 50, 1);
		}
	} else if (damage_type === "fire") {
		if (!damage_amount) return f.dot;
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 100, 1);
	}
	return f.dot;
});

rt.type(12711, "/obj/structure/alien/gelpod", "/obj/structure/alien", {
	name: "gelatinous mound",
	desc: "A mound of jelly-like substance encasing something inside.",
	icon: rt.rsc("icons/obj/fluff.dmi"),
	icon_state: "gelmound",
});

// aliens.dm:46
rt.def("/obj/structure/alien/gelpod/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* new_(T("/obj/effect/mob_spawn/human/corpse/damaged"), rt.getStep(f, this, 0));
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12712, "/obj/structure/alien/resin", "/obj/structure/alien", {
	resintype: null,
	anchored: 1,
	canSmoothWith: null,
	smooth: 1,
	CanAtmosPass: -2,
	name: "resin",
	desc: "Looks like some kind of thick resin.",
	icon: rt.rsc("icons/obj/smooth_structures/alien/resin_wall.dmi"),
	icon_state: "resin",
	density: 1,
	opacity: 1,
	obj_integrity: 200,
	max_integrity: 200,
});

// aliens.dm:61
rt.def("/obj/structure/alien/resin/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/alien/resin"));
	return f.dot;
});

// aliens.dm:70
rt.def("/obj/structure/alien/resin/proc/New", function* New(f: Frame, location: Value) {
	yield* parent_proc();
	this.air_update_turf(1);
	return f.dot;
}, true);

// aliens.dm:74
rt.def("/obj/structure/alien/resin/proc/Move", function* Move(f: Frame) {
	let _T: Value = this.loc;
	yield* parent_proc();
	this.move_update_air(_T);
	return f.dot;
}, true);

rt.type(12713, "/obj/structure/alien/resin/wall", "/obj/structure/alien/resin", {
	resintype: "wall",
	name: "resin wall",
	desc: "Thick resin solidified into a wall.",
	icon: rt.rsc("icons/obj/smooth_structures/alien/resin_wall.dmi"),
	icon_state: "wall0",
	canSmoothWith: null,
});

// aliens.dm:84
rt.def("/obj/structure/alien/resin/wall/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/alien/resin/wall"), T("/obj/structure/alien/resin/membrane"));
	return f.dot;
});

rt.type(12714, "/obj/structure/alien/resin/membrane", "/obj/structure/alien/resin", {
	resintype: "membrane",
	canSmoothWith: null,
	name: "resin membrane",
	desc: "Resin just thin enough to let light pass through.",
	icon: rt.rsc("icons/obj/smooth_structures/alien/resin_membrane.dmi"),
	icon_state: "membrane0",
	opacity: 0,
	obj_integrity: 160,
	max_integrity: 160,
});

// aliens.dm:98
rt.def("/obj/structure/alien/resin/membrane/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/alien/resin/wall"), T("/obj/structure/alien/resin/membrane"));
	return f.dot;
});

// aliens.dm:101
rt.def("/obj/structure/alien/resin/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// aliens.dm:105
rt.def("/obj/structure/alien/resin/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	height ??= 0;
	return (!this.density ? 1 : 0);
});

rt.type(12716, "/obj/structure/alien/weeds", "/obj/structure/alien", {
	last_expand: 0,
	growth_cooldown_low: 150,
	growth_cooldown_high: 200,
	anchored: 1,
	canSmoothWith: null,
	smooth: 2,
	gender: "plural",
	name: "resin floor",
	desc: "A thick resin surface covers the floor.",
	density: 0,
	layer: 2,
	icon_state: "weeds",
	obj_integrity: 15,
	max_integrity: 15,
}, { global: { blacklisted_turfs: 800 } });

// aliens.dm:124
rt.def("/obj/structure/alien/weeds/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/alien/weeds"), T("/turf/closed/wall"));
	return f.dot;
});

// aliens.dm:134
rt.def("/obj/structure/alien/weeds/proc/Initialize", function Initialize(f: Frame) {
	this.pixel_x = -4;
	this.pixel_y = -4;
	parent_proc();
	if (!rt.gl("blacklisted_turfs#2")) {
		rt.setGl("blacklisted_turfs#2", typecacheof(list(T("/turf/open/space"), T("/turf/open/chasm"), T("/turf/open/floor/plating/lava"))));
	}
	this.last_expand = rt.worldTime(f) + rand(this.growth_cooldown_low, this.growth_cooldown_high);
	if (this.icon != rt.initial(f, this, "icon")) return f.dot;
	const die = rand(1, 3);
	if (die === 1) {
		this.icon = rt.rsc("icons/obj/smooth_structures/alien/weeds1.dmi");
	} else if (die === 2) {
		this.icon = rt.rsc("icons/obj/smooth_structures/alien/weeds2.dmi");
	} else if (die === 3) {
		this.icon = rt.rsc("icons/obj/smooth_structures/alien/weeds3.dmi");
	}
	return f.dot;
});

// aliens.dm:154
rt.def("/obj/structure/alien/weeds/proc/expand", function* expand(f: Frame) {
	let U: Value = null, _T: Value = null;
	if (is_type_in_typecache((U = rt.getStep(f, this, 0)), rt.gl("blacklisted_turfs#2"))) {
		yield* qdel(this);
		return 0;
	}
	for (_T of each(U.GetAtmosAdjacentTurfs(), T("/turf"))) {
		if (rt.locateIn(f, T("/obj/structure/alien/weeds"), _T)) {
			continue;
		}
		if (is_type_in_typecache(_T, rt.gl("blacklisted_turfs#2"))) {
			continue;
		}
		yield* new_(T("/obj/structure/alien/weeds"), _T);
	}
	return 1;
}, true);

// aliens.dm:170
rt.def("/obj/structure/alien/weeds/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	if (!(exposed_temperature > 300)) return f.dot;
	yield* this.take_damage(5, "fire", 0, 0);
	return f.dot;
}, true);

rt.type(12717, "/obj/structure/alien/weeds/node", "/obj/structure/alien/weeds", {
	lon_range: 4,
	node_range: 3,
	light_color: "#6496FA",
	light_power: 0.5,
	name: "glowing resin",
	desc: "Blue bioluminescence shines from beneath the surface.",
	icon_state: "weednode",
});

// aliens.dm:184
rt.def("/obj/structure/alien/weeds/node/proc/Initialize", function* Initialize(f: Frame) {
	let W: Value = null;
	this.icon = rt.rsc("icons/obj/smooth_structures/alien/weednode.dmi");
	yield* parent_proc();
	this.set_light(this.lon_range);
	if ((W = rt.locateIn(f, T("/obj/structure/alien/weeds"), this.loc)) && W != this) {
		yield* qdel(W);
	}
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// aliens.dm:193
rt.def("/obj/structure/alien/weeds/node/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return (yield* parent_proc());
}, true);

// aliens.dm:197
rt.def("/obj/structure/alien/weeds/node/proc/process", function* process(f: Frame) {
	let W: Value = null;
	for (W of each(range(this.node_range, this), T("/obj/structure/alien/weeds"))) {
		if (W.last_expand <= rt.worldTime(f)) {
			if (yield* W.expand()) {
				W.last_expand = rt.worldTime(f) + rand(this.growth_cooldown_low, this.growth_cooldown_high);
			}
		}
	}
	return f.dot;
}, true, { waitfor: false });

rt.type(12718, "/obj/structure/alien/egg", "/obj/structure/alien", {
	base_icon: "egg",
	status: "growing",
	child: null,
	anchored: 1,
	name: "egg",
	desc: "A large mottled egg.",
	icon_state: "egg_growing",
	density: 0,
	obj_integrity: 100,
	max_integrity: 100,
	integrity_failure: 5,
	layer: 4,
});

// aliens.dm:231
rt.def("/obj/structure/alien/egg/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	let $1: any;
	yield* parent_proc();
	yield* this.update_icon();
	if (this.status == "growing" || this.status == "grown") {
		this.child = (yield* new_(T("/obj/item/clothing/mask/facehugger"), this));
	}
	if (this.status == "growing") {
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/structure/alien/egg/proc/Grow"))), rand(MIN_GROWTH_TIME, MAX_GROWTH_TIME));
	}
	let $0: any = this;
	if (this.status == "grown") {
		$1 = 1;
	} else {
		$1 = 0;
	}
	this.proximity_monitor = (yield* new_(T("/datum/proximity_monitor"), $0, $1));
	if (this.status != "burst") return f.dot;
	this.obj_integrity = this.integrity_failure;
	return f.dot;
}, true);

// aliens.dm:242
rt.def("/obj/structure/alien/egg/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	if (this.status === "growing") {
		this.icon_state = `${this.base_icon}_growing`;
	} else if (this.status === "grown") {
		this.icon_state = `${this.base_icon}`;
	} else if (this.status === "burst") {
		this.icon_state = `${this.base_icon}_hatched`;
	}
	return f.dot;
});

// aliens.dm:252
rt.def("/obj/structure/alien/egg/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.dot = (yield* this.attack_hand(user));
	return f.dot;
}, true);

// aliens.dm:255
rt.def("/obj/structure/alien/egg/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	f.dot = (yield* this.attack_hand(user));
	return f.dot;
}, true);

// aliens.dm:258
rt.def("/obj/structure/alien/egg/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (user.getorgan(T("/obj/item/organ/alien/plasmavessel"))) {
		if (this.status === "burst") {
			to_chat(user, "<span class='notice'>You clear the hatched egg.</span>");
			playsound(this.loc, rt.rsc("sound/effects/attackblob.ogg"), 100, 1);
			yield* qdel(this);
			return f.dot;
		} else if (this.status === "growing") {
			to_chat(user, "<span class='notice'>The child is not developed yet.</span>");
			return f.dot;
		} else if (this.status === "grown") {
			to_chat(user, "<span class='notice'>You retrieve the child.</span>");
			yield* this.Burst({ kill: 0 });
			return f.dot;
		}
	} else {
		to_chat(user, "<span class='notice'>It feels slimy.</span>");
		user.changeNext_move(8);
	}
	return f.dot;
}, true);

// aliens.dm:278
rt.def("/obj/structure/alien/egg/proc/Grow", function* Grow(f: Frame) {
	this.status = "grown";
	yield* this.update_icon();
	yield* this.proximity_monitor.SetRange(1);
	return f.dot;
}, true);

// aliens.dm:284
rt.def("/obj/structure/alien/egg/proc/Burst", function* Burst(f: Frame, kill: Value) {
	kill ??= 1;
	if (!(this.status == "grown" || this.status == "growing")) return f.dot;
	yield* this.proximity_monitor.SetRange(0);
	this.status = "burst";
	yield* this.update_icon();
	flick("egg_opening", this);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/structure/alien/egg/proc/finish_bursting"), kill)), 15);
	return f.dot;
}, true);

// aliens.dm:293
rt.def("/obj/structure/alien/egg/proc/finish_bursting", function* finish_bursting(f: Frame, kill: Value) {
	let M: Value = null;
	kill ??= 1;
	if (!this.child) return f.dot;
	yield* this.child.forceMove(rt.getStep(f, this, 0));
	if (!rt.istype(this.child, T("/obj/item/clothing/mask/facehugger"))) return f.dot;
	if (kill) {
		this.child.Die();
	} else {
		for (M of each(range(1, this), T("/mob"))) {
			if (CanHug(M)) {
				yield* this.child.Leap(M);
				break;
			}
		}
	}
	return f.dot;
}, true);

// aliens.dm:305
rt.def("/obj/structure/alien/egg/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	if (rt.bitAnd(this.flags, NODECONSTRUCT)) return f.dot;
	if (this.status == "burst") return f.dot;
	yield* this.Burst({ kill: 1 });
	return f.dot;
}, true);

// aliens.dm:310
rt.def("/obj/structure/alien/egg/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	if (!(exposed_temperature > 500)) return f.dot;
	yield* this.take_damage(5, "fire", 0, 0);
	return f.dot;
}, true);

// aliens.dm:315
rt.def("/obj/structure/alien/egg/proc/HasProximity", function* HasProximity(f: Frame, AM: Value) {
	let C: Value = null;
	if (this.status != "grown") return f.dot;
	if (!CanHug(AM)) {
		return f.dot;
	}
	if ((C = AM).stat == 0 && C.getorgan(T("/obj/item/organ/body_egg/alien_embryo"))) {
		return f.dot;
	}
	yield* this.Burst({ kill: 0 });
	return f.dot;
}, true);
