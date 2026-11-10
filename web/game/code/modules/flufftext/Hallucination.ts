// Based on /tg/station's code/modules/flufftext/Hallucination.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// Hallucination.dm:31
rt.def("/mob/living/carbon/proc/handle_hallucinations", function* handle_hallucinations(f: Frame) {
	let current: Value = null, halpick: Value = null;
	if (this.handling_hal) {
		return f.dot;
	}
	let minor: Value = rt.alist(f, ["sounds", 25, "bolts_minor", 5, "whispers", 15, "message", 10, "hudscrew", 15]);
	let medium: Value = rt.alist(f, ["fake_alert", 15, "items", 10, "items_other", 10, "dangerflash", 10, "bolts", 5, "flood", 5, "husks", 10, "battle", 15, "self_delusion", 10]);
	let major: Value = rt.alist(f, ["fake", 20, "death", 10, "xeno", 10, "singulo", 10, "delusion", 20, "koolaid", 10]);
	this.handling_hal = 1;
	while (this.hallucination > 20) {
		yield* sleep(rand(200, 500) / (this.hallucination / 25));
		if (prob(20)) {
			continue;
		}
		current = list();
		const die = rand(100);
		if (rt.inRange(die, 1, 50)) {
			current = minor;
		} else if (rt.inRange(die, 51, 85)) {
			current = medium;
		} else if (rt.inRange(die, 86, 100)) {
			current = major;
		}
		yield* this.hallucinate((halpick = pickweight(current)));
	}
	this.handling_hal = 0;
	return f.dot;
}, true);

rt.type(12050, "/obj/effect/hallucination", "/obj/effect", {
	target: null,
	invisibility: 60,
});

// Hallucination.dm:61
rt.def("/obj/effect/hallucination/proc/wake_and_restore", function* wake_and_restore(f: Frame) {
	this.target.hal_screwyhud = SCREWYHUD_NONE;
	yield* this.target.SetSleeping(0);
	return f.dot;
}, true);

rt.type(12051, "/obj/effect/hallucination/simple", "/obj/effect/hallucination", {
	image_icon: rt.rsc("icons/mob/alien.dmi"),
	image_state: "alienh_pounce",
	px: 0,
	py: 0,
	col_mod: null,
	current_image: null,
	image_layer: 4,
	active: 1,
});

// Hallucination.dm:75
rt.def("/obj/effect/hallucination/simple/proc/Initialize", function Initialize(f: Frame, mapload: Value, T: Value) {
	parent_proc();
	this.target = T;
	this.current_image = this.GetImage();
	if (!this.target.client) return f.dot;
	(rt.modField(f, this.target.client, "images", this.current_image, rt.bitOr));
	return f.dot;
}, false);

// Hallucination.dm:81
rt.def("/obj/effect/hallucination/simple/proc/GetImage", function GetImage(f: Frame) {
	let I: Value = null;
	(I = image(this.image_icon, this, this.image_state, this.image_layer, { dir: this.dir })).pixel_x = this.px;
	I.pixel_y = this.py;
	if (this.col_mod) {
		I.color = this.col_mod;
	}
	return I;
});

// Hallucination.dm:90
rt.def("/obj/effect/hallucination/simple/proc/Show", function Show(f: Frame, update: Value) {
	update ??= 1;
	if (!this.active) return f.dot;
	if (this.target.client) {
		this.target.client.images.Remove(this.current_image);
	}
	if (update) {
		this.current_image = this.GetImage();
	}
	if (!this.target.client) return f.dot;
	(rt.modField(f, this.target.client, "images", this.current_image, rt.bitOr));
	return f.dot;
});

// Hallucination.dm:96
rt.def("/obj/effect/hallucination/simple/proc/update_icon", function update_icon(f: Frame, new_state: Value, new_icon: Value, new_px: Value, new_py: Value) {
	new_px ??= 0;
	new_py ??= 0;
	this.image_state = new_state;
	if (new_icon) {
		this.image_icon = new_icon;
	} else {
		this.image_icon = rt.initial(f, this, "image_icon");
	}
	this.px = new_px;
	this.py = new_py;
	this.Show();
	return f.dot;
});

// Hallucination.dm:106
rt.def("/obj/effect/hallucination/simple/proc/Moved", function Moved(f: Frame, OldLoc: Value, Dir: Value) {
	this.Show();
	return f.dot;
});

// Hallucination.dm:109
rt.def("/obj/effect/hallucination/simple/proc/Destroy", function* Destroy(f: Frame) {
	if (this.target.client) {
		yield* this.target.client.images.Remove(this.current_image);
	}
	this.active = 0;
	return (yield* parent_proc());
}, true);

rt.type(12057, "/obj/effect/hallucination/fake_flood", "/obj/effect/hallucination", {
	flood_images: null,
	flood_turfs: null,
	image_icon: rt.rsc("icons/effects/tile_effects.dmi"),
	image_state: "plasma",
	radius: 0,
	next_expand: 0,
});

// Hallucination.dm:118
rt.def("/obj/effect/hallucination/fake_flood/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.flood_images = list();

	this.flood_turfs = list();
	return f.dot;
});

// Hallucination.dm:126
rt.def("/obj/effect/hallucination/fake_flood/proc/Initialize", function Initialize(f: Frame) {
	let U: Value = null;
	parent_proc();
	this.target = f.args[1];
	for (U of each(orange(7, this.target), T("/obj/machinery/atmospherics/components/unary/vent_pump"))) {
		if (!U.welded) {
			this.loc = U.loc;
			break;
		}
	}
	this.flood_images += image(this.image_icon, this, this.image_state, 4);
	this.flood_turfs += rt.getStep(f, this.loc, 0);
	if (this.target.client) {
		(rt.modField(f, this.target.client, "images", this.flood_images, rt.bitOr));
	}
	this.next_expand = rt.worldTime(f) + FAKE_FLOOD_EXPAND_TIME;
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, false, { args: ["mapload", "T"] });

// Hallucination.dm:139
rt.def("/obj/effect/hallucination/fake_flood/proc/process", function* process(f: Frame) {
	if (!(this.next_expand <= rt.worldTime(f))) return f.dot;
	this.radius++;
	if (this.radius > FAKE_FLOOD_MAX_RADIUS) {
		yield* qdel(this);
		return f.dot;
	}
	yield* this.Expand();
	if (rt.isIn(f, rt.getStep(f, this.target, 0), this.flood_turfs) && !this.target.internal) {
		yield* this.target.hallucinate("fake_alert", "tox_in_air");
	}
	this.next_expand = rt.worldTime(f) + FAKE_FLOOD_EXPAND_TIME;
	return f.dot;
}, true, { waitfor: false });

// Hallucination.dm:150
rt.def("/obj/effect/hallucination/fake_flood/proc/Expand", function Expand(f: Frame) {
	let FT: Value = null, dir: Value = null, _T: Value = null;
	for (FT of each(this.flood_turfs, T("/turf"))) {
		dir = null;
		for (dir of each(GLOB.cardinal)) {
			if (rt.isIn(f, (_T = rt.getStep(f, FT, dir)), this.flood_turfs) || !FT.CanAtmosPass(_T)) {
				continue;
			}
			this.flood_images += image(this.image_icon, _T, this.image_state, 4);
			this.flood_turfs += _T;
		}
	}
	if (!this.target.client) return f.dot;
	(rt.modField(f, this.target.client, "images", this.flood_images, rt.bitOr));
	return f.dot;
});

// Hallucination.dm:161
rt.def("/obj/effect/hallucination/fake_flood/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	yield* qdel(this.flood_turfs);
	this.flood_turfs = list();
	if (this.target.client) {
		yield* this.target.client.images.Remove(this.flood_images);
	}
	this.target = null;
	yield* qdel(this.flood_images);
	this.flood_images = list();
	return (yield* parent_proc());
}, true);

rt.type(12052, "/obj/effect/hallucination/simple/xeno", "/obj/effect/hallucination/simple", {
	image_icon: rt.rsc("icons/mob/alien.dmi"),
	image_state: "alienh_pounce",
});

// Hallucination.dm:176
rt.def("/obj/effect/hallucination/simple/xeno/proc/Initialize", function Initialize(f: Frame, mapload: Value, T: Value) {
	parent_proc();
	this.name = `alien hunter (${rand(1, 1000)})`;
	return f.dot;
}, false);

// Hallucination.dm:180
rt.def("/obj/effect/hallucination/simple/xeno/proc/throw_impact", function* throw_impact(f: Frame, A: Value) {
	yield* this.update_icon("alienh_pounce");
	if (!(A == this.target && this.target.stat != 2)) return f.dot;
	yield* this.target.Knockdown(100);
	this.target.visible_message(`<span class='danger'>${this.target} flails around wildly.</span>`, `<span class ='userdanger'>${this.name} pounces on you!</span>`);
	return f.dot;
}, true, { waitfor: false });

rt.type(12058, "/obj/effect/hallucination/xeno_attack", "/obj/effect/hallucination", {
	pump: null,
	xeno: null,
});

// Hallucination.dm:191
rt.def("/obj/effect/hallucination/xeno_attack/proc/Initialize", function* Initialize(f: Frame) {
	let U: Value = null, xeno_name: Value = null;
	yield* parent_proc();
	this.target = f.args[1];
	for (U of each(orange(7, this.target), T("/obj/machinery/atmospherics/components/unary/vent_pump"))) {
		if (!U.welded) {
			this.pump = U;
			break;
		}
	}
	if (this.pump) {
		this.xeno = (yield* new_(T("/obj/effect/hallucination/simple/xeno"), this.pump.loc, this.target));
		yield* sleep(10);
		yield* this.xeno.update_icon("alienh_leap", rt.rsc("icons/mob/alienleap.dmi"), -32, -32);
		yield* this.xeno.throw_at(this.target, 7, 1, { spin: 0, diagonals_first: 1 });
		yield* sleep(10);
		yield* this.xeno.update_icon("alienh_leap", rt.rsc("icons/mob/alienleap.dmi"), -32, -32);
		yield* this.xeno.throw_at(this.pump, 7, 1, { spin: 0, diagonals_first: 1 });
		yield* sleep(10);
		xeno_name = this.xeno.name;
		to_chat(this.target, `<span class='notice'>${xeno_name} begins climbing into the ventilation system...</span>`);
		yield* sleep(10);
		yield* qdel(this.xeno);
		to_chat(this.target, `<span class='notice'>${xeno_name} scrambles into the ventilation ducts!</span>`);
	}
	yield* qdel(this);
	return f.dot;
}, true, { args: ["mapload", "T"] });

rt.type(12053, "/obj/effect/hallucination/simple/clown", "/obj/effect/hallucination/simple", {
	image_icon: rt.rsc("icons/mob/animal.dmi"),
	image_state: "clown",
});

// Hallucination.dm:218
rt.def("/obj/effect/hallucination/simple/clown/proc/Initialize", function* Initialize(f: Frame, mapload: Value, _T: Value, duration: Value) {
	yield* parent_proc(this.loc, _T);
	this.name = pick(GLOB.clown_names);
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), duration, 8);
	return f.dot;
}, true);

rt.type(12059, "/obj/effect/hallucination/oh_yeah", "/obj/effect/hallucination", {
	bubblegum: null,
	fakebroken: null,
	fakerune: null,
});

// Hallucination.dm:237
rt.def("/obj/effect/hallucination/oh_yeah/proc/Initialize", function* Initialize(f: Frame) {
	let wall: Value = null, W: Value = null;
	let $e: any;
	f.dot = (yield* parent_proc());
	this.target = f.args[1];
	rt.forList(f, 0, range(7, this.target), T("/turf/closed/wall"));
	if (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		wall = W;
	}
	rt.endFor(f, 0);
	if (!wall) {
		return 2;
	}
	this.fakebroken = (yield* image(rt.rsc("icons/turf/floors.dmi"), wall, "plating", { layer: 2 }));
	let landing: Value = rt.getStep(f, this.target, 0);
	let landing_image_turf: Value = rt.getStep(f, landing, 10);
	this.fakerune = (yield* image(rt.rsc("icons/effects/96x96.dmi"), landing_image_turf, "landing", { layer: ABOVE_OPEN_TURF_LAYER }));
	this.fakebroken.override = 1;
	if (this.target.client) {
		(rt.modField(f, this.target.client, "images", this.fakebroken, rt.bitOr));
		(rt.modField(f, this.target.client, "images", this.fakerune, rt.bitOr));
	}
	this.target.playsound_local(wall, rt.rsc("sound/effects/meteorimpact.ogg"), 150, 1);
	this.bubblegum = (yield* new_(T("/obj/effect/hallucination/simple/bubblegum"), wall, this.target));
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/hallucination/oh_yeah/proc/bubble_attack"), landing)), 10);
	return f.dot;
}, true, { args: ["mapload", "T"] });

// Hallucination.dm:260
rt.def("/obj/effect/hallucination/oh_yeah/proc/bubble_attack", function* bubble_attack(f: Frame, landing: Value) {
	let charged: Value = 0;
	while (rt.getStep(f, this.bubblegum, 0) != landing && this.target && this.target.stat != 2) {
		yield* this.bubblegum.forceMove(get_step_towards(this.bubblegum, landing));
		yield* this.bubblegum.setDir(rt.getDir(f, this.bubblegum, landing));
		this.target.playsound_local(rt.getStep(f, this.bubblegum, 0), rt.rsc("sound/effects/meteorimpact.ogg"), 150, 1);
		shake_camera(this.target, 2, 1);
		if (this.bubblegum.Adjacent(this.target) && !charged) {
			charged = 1;
			yield* this.target.Knockdown(80);
			yield* this.target.adjustStaminaLoss(40);
			yield* step_away(this.target, this.bubblegum);
			shake_camera(this.target, 4, 3);
			this.target.visible_message(`<span class='warning'>${this.target} jumps backwards, falling on the ground!</span>`, `<span class='userdanger'>${this.bubblegum} slams into you!</span>`);
		}
		yield* sleep(2);
	}
	yield* sleep(30);
	yield* qdel(this);
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }] });

// Hallucination.dm:277
rt.def("/obj/effect/hallucination/oh_yeah/proc/Destroy", function* Destroy(f: Frame) {
	if (this.target.client) {
		yield* this.target.client.images.Remove(this.fakebroken);
		yield* this.target.client.images.Remove(this.fakerune);
	}
	yield* qdel(this.fakebroken);
	this.fakebroken = null;
	yield* qdel(this.fakerune);
	this.fakerune = null;
	yield* qdel(this.bubblegum);
	this.bubblegum = null;
	return (yield* parent_proc());
}, true);

rt.type(12060, "/obj/effect/hallucination/singularity_scare", "/obj/effect/hallucination", {
	s: null,
});

// Hallucination.dm:291
rt.def("/obj/effect/hallucination/singularity_scare/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.target = f.args[1];
	let start: Value = rt.getStep(f, f.args[1], 0);
	let screen_border: Value = pick(2, 4, 8, 1);
	let i: Value = 0;
	while (i < 11) {
		start = rt.getStep(f, start, screen_border);
		i++;
	}
	this.s = (yield* new_(T("/obj/effect/hallucination/simple/singularity"), start, this.target));
	this.s.parent = this;
	i = 0;
	while (i < 11) {
		yield* sleep(5);
		this.s.loc = rt.getStep(f, rt.getStep(f, this.s, 0), rt.getDir(f, this.s, this.target));
		this.s.Show();
		yield* this.s.Eat();
		i++;
	}
	yield* qdel(this.s);
	return f.dot;
}, true, { args: ["mapload", "T"] });

rt.type(12056, "/obj/effect/hallucination/simple/singularity", "/obj/effect/hallucination/simple", {
	parent: null,
	image_icon: rt.rsc("icons/effects/224x224.dmi"),
	image_state: "singularity_s7",
	image_layer: 11,
	px: -96,
	py: -96,
});

// Hallucination.dm:315
rt.def("/obj/effect/hallucination/simple/singularity/proc/Eat", function* Eat(f: Frame, OldLoc: Value, Dir: Value) {
	let target_dist: Value = null;
	if (!((target_dist = get_dist(this, this.target)) <= 3)) return f.dot;
	this.target.hal_screwyhud = SCREWYHUD_CRIT;
	yield* this.target.SetUnconscious(160);
	yield* addtimer((yield* new_(T("/datum/callback"), this.parent, P("/obj/effect/hallucination/proc/wake_and_restore"))), rand(30, 50));
	return f.dot;
}, true);

rt.type(12061, "/obj/effect/hallucination/battle", "/obj/effect/hallucination", {});

// Hallucination.dm:324
rt.def("/obj/effect/hallucination/battle/proc/Initialize", function* Initialize(f: Frame) {
	let i: Value = null;
	yield* parent_proc();
	this.target = f.args[1];
	let hits: Value = rand(3, 6);
	const die = rand(1, 5);
	if (die === 1) {
		i = 0;
		while (i < hits) {
			this.target.playsound_local(null, rt.rsc("sound/weapons/laser.ogg"), 25, 1);
			if (prob(75)) {
				yield* addtimer((yield* new_(T("/datum/callback"), this.target, P("/mob/proc/playsound_local"), null, rt.rsc("sound/weapons/sear.ogg"), 25, 1)), rand(10, 20));
			} else {
				yield* addtimer((yield* new_(T("/datum/callback"), this.target, P("/mob/proc/playsound_local"), null, rt.rsc("sound/weapons/effects/searwall.ogg"), 25, 1)), rand(10, 20));
			}
			yield* sleep(rand(4, 12));
			i++;
		}
		this.target.playsound_local(null, get_sfx("bodyfall"), 25, 1);
	} else if (die === 2) {
		this.target.playsound_local(null, rt.rsc("sound/weapons/saberon.ogg"), 15, 1);
		i = 0;
		while (i < hits) {
			this.target.playsound_local(null, rt.rsc("sound/weapons/blade1.ogg"), 25, 1);
			yield* sleep(rand(8, 16));
			i++;
		}
		this.target.playsound_local(null, get_sfx("bodyfall"), 25, 1);
		this.target.playsound_local(null, rt.rsc("sound/weapons/saberoff.ogg"), 15, 1);
	} else if (die === 3) {
		i = 0;
		while (i < hits) {
			this.target.playsound_local(null, get_sfx("gunshot"), 25);
			if (prob(75)) {
				yield* addtimer((yield* new_(T("/datum/callback"), this.target, P("/mob/proc/playsound_local"), null, rt.rsc("sound/weapons/pierce.ogg"), 25, 1)), rand(10, 20));
			} else {
				yield* addtimer((yield* new_(T("/datum/callback"), this.target, P("/mob/proc/playsound_local"), null, "ricochet", 25, 1)), rand(10, 20));
			}
			yield* sleep(rand(4, 12));
			i++;
		}
		this.target.playsound_local(null, get_sfx("bodyfall"), 25, 1);
	} else if (die === 4) {
		this.target.playsound_local(null, rt.rsc("sound/weapons/egloves.ogg"), 40, 1);
		this.target.playsound_local(null, get_sfx("bodyfall"), 25, 1);
		yield* sleep(20);
		this.target.playsound_local(null, rt.rsc("sound/weapons/cablecuff.ogg"), 15, 1);
	} else if (die === 5) {
		i = 0;
		while (i < hits) {
			this.target.playsound_local(null, rt.rsc("sound/items/timer.ogg"), 25, 1);
			yield* sleep(15);
			i++;
		}
	}
	yield* qdel(this);
	return f.dot;
}, true, { args: ["mapload", "T"] });

rt.type(12062, "/obj/effect/hallucination/items_other", "/obj/effect/hallucination", {});

// Hallucination.dm:367
rt.def("/obj/effect/hallucination/items_other/proc/Initialize", function* Initialize(f: Frame) {
	let image_file: Value = null, A: Value = null, H: Value = null, free_hand: Value = null;
	let $e: any;
	yield* parent_proc();
	this.target = f.args[1];
	let item: Value = pick(list("esword", "dual_esword", "stunpaper", "clockspear", "ttv", "flash", "armblade"));
	for (H of each(view(7, this.target), T("/mob/living/carbon/human"))) {
		if (H != this.target) {
			if (free_hand = (yield* H.get_empty_held_index_for_side({ side: "left" }))) {
				image_file = rt.rsc("icons/mob/inhands/items_lefthand.dmi");
			} else if (free_hand = (yield* H.get_empty_held_index_for_side({ side: "right" }))) {
				image_file = rt.rsc("icons/mob/inhands/items_righthand.dmi");
			}
			if (image_file) {
				if (item === "esword") {
					this.target.playsound_local(H, rt.rsc("sound/weapons/saberon.ogg"), 35, 1);
					A = (yield* image(image_file, H, "swordred", { layer: ABOVE_MOB_LAYER }));
				} else if (item === "dual_esword") {
					this.target.playsound_local(H, rt.rsc("sound/weapons/saberon.ogg"), 35, 1);
					A = (yield* image(image_file, H, "dualsaberred1", { layer: ABOVE_MOB_LAYER }));
				} else if (item === "stunpaper") {
					(A = (yield* image(image_file, H, "paper", { layer: ABOVE_MOB_LAYER }))).color = "#ff0000";
				} else if (item === "clockspear") {
					A = (yield* image(image_file, H, "ratvarian_spear", { layer: ABOVE_MOB_LAYER }));
				} else if (item === "ttv") {
					A = (yield* image(image_file, H, "ttv", { layer: ABOVE_MOB_LAYER }));
				} else if (item === "flash") {
					A = (yield* image(image_file, H, "flashtool", { layer: ABOVE_MOB_LAYER }));
				} else if (item === "armblade") {
					A = (yield* image(image_file, H, "arm_blade", { layer: ABOVE_MOB_LAYER }));
				}
				if (this.target.client) {
					(rt.modField(f, this.target.client, "images", A, rt.bitOr));
					yield* sleep(rand(150, 250));
					if (item == "esword" || item == "dual_esword") {
						this.target.playsound_local(H, rt.rsc("sound/weapons/saberoff.ogg"), 35, 1);
					}
					yield* this.target.client.images.Remove(A);
				}
				break;
			}
		}
	}
	yield* qdel(this);
	return f.dot;
}, true, { args: ["mapload", "T"] });

rt.type(12063, "/obj/effect/hallucination/delusion", "/obj/effect/hallucination", {
	delusions: null,
});

// Hallucination.dm:410
rt.def("/obj/effect/hallucination/delusion/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.delusions = list();
	return f.dot;
});

// Hallucination.dm:413
rt.def("/obj/effect/hallucination/delusion/proc/Initialize", function* Initialize(f: Frame) {
	let A: Value = null, H: Value = null;
	let $e: any;
	if (f.args[2] === null) {
		f.args[2] = null;
	}
	if (f.args[3] === null) {
		f.args[3] = 300;
	}
	if (f.args[4] === null) {
		f.args[4] = 1;
	}
	if (f.args[5] === null) {
		f.args[5] = null;
	}
	if (f.args[6] === null) {
		f.args[6] = null;
	}
	f.dot = (yield* parent_proc());
	this.target = f.args[1];
	let kind: Value = f.args[2] ? f.args[2] : pick("clown", "corgi", "carp", "skeleton", "demon", "zombie");
	for (H of each(GLOB.living_mob_list, T("/mob/living/carbon/human"))) {
		if (H == this.target) {
			continue;
		}
		if (f.args[4] && rt.isIn(f, H, view(this.target))) {
			continue;
		}
		if (kind === "clown") {
			A = image(rt.rsc("icons/mob/animal.dmi"), H, "clown");
		} else if (kind === "carp") {
			A = image(rt.rsc("icons/mob/animal.dmi"), H, "carp");
		} else if (kind === "corgi") {
			A = image(rt.rsc("icons/mob/pets.dmi"), H, "corgi");
		} else if (kind === "skeleton") {
			A = image(rt.rsc("icons/mob/human.dmi"), H, "skeleton");
		} else if (kind === "zombie") {
			A = image(rt.rsc("icons/mob/human.dmi"), H, "zombie");
		} else if (kind === "demon") {
			A = image(rt.rsc("icons/mob/mob.dmi"), H, "daemon");
		} else if (kind === "custom") {
			A = image(f.args[6], H, f.args[5]);
		}
		A.override = 1;
		if (this.target.client) {
			(rt.modSrcVar(f, "delusions", A, rt.bitOr));
			(rt.modField(f, this.target.client, "images", A, rt.bitOr));
		}
	}
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), f.args[3], 8);
	return f.dot;
}, true, { args: ["mapload", "T", "force_kind", "duration", "skip_nearby", "custom_icon", "custom_icon_file"] });

// Hallucination.dm:444
rt.def("/obj/effect/hallucination/delusion/proc/Destroy", function* Destroy(f: Frame) {
	let I: Value = null;
	for (I of each(this.delusions, T("/image"))) {
		if (this.target.client) {
			yield* this.target.client.images.Remove(I);
		}
	}
	return (yield* parent_proc());
}, true);

rt.type(12064, "/obj/effect/hallucination/self_delusion", "/obj/effect/hallucination", {
	delusion: null,
});

// Hallucination.dm:453
rt.def("/obj/effect/hallucination/self_delusion/proc/Initialize", function* Initialize(f: Frame) {
	let A: Value = null, kind: Value = null;
	let $0: any;
	if (f.args[2] === null) {
		f.args[2] = null;
	}
	if (f.args[3] === null) {
		f.args[3] = 300;
	}
	if (f.args[4] === null) {
		f.args[4] = null;
	}
	if (f.args[5] === null) {
		f.args[5] = null;
	}
	yield* parent_proc();
	this.target = f.args[1];
	if (f.args[2]) {
		$0 = f.args[2];
	} else {
		$0 = pick("clown", "corgi", "carp", "skeleton", "demon", "zombie", "robot");
	}
	$0 = (kind = $0);
	if ($0 === "clown") {
		A = image(rt.rsc("icons/mob/animal.dmi"), this.target, "clown");
	} else if ($0 === "carp") {
		A = image(rt.rsc("icons/mob/animal.dmi"), this.target, "carp");
	} else if ($0 === "corgi") {
		A = image(rt.rsc("icons/mob/pets.dmi"), this.target, "corgi");
	} else if ($0 === "skeleton") {
		A = image(rt.rsc("icons/mob/human.dmi"), this.target, "skeleton");
	} else if ($0 === "zombie") {
		A = image(rt.rsc("icons/mob/human.dmi"), this.target, "zombie");
	} else if ($0 === "demon") {
		A = image(rt.rsc("icons/mob/mob.dmi"), this.target, "daemon");
	} else if ($0 === "robot") {
		A = image(rt.rsc("icons/mob/robots.dmi"), this.target, "robot");
		this.target.playsound_local(this.target, rt.rsc("sound/voice/liveagain.ogg"), 75, 1);
	} else if ($0 === "custom") {
		A = image(f.args[5], this.target, f.args[4]);
	}
	A.override = 1;
	if (this.target.client) {
		to_chat(this.target, "<span class='italics'>...wabbajack...wabbajack...</span>");
		this.target.playsound_local(this.target, rt.rsc("sound/magic/staff_change.ogg"), 50, 1, -1);
		this.delusion = A;
		(rt.modField(f, this.target.client, "images", A, rt.bitOr));
	}
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), f.args[3], 8);
	return f.dot;
}, true, { args: ["mapload", "T", "force_kind", "duration", "custom_icon", "custom_icon_file"] });

// Hallucination.dm:484
rt.def("/obj/effect/hallucination/self_delusion/proc/Destroy", function* Destroy(f: Frame) {
	if (this.target.client) {
		yield* this.target.client.images.Remove(this.delusion);
	}
	return (yield* parent_proc());
}, true);

rt.type(12065, "/obj/effect/hallucination/fakeattacker", "/obj/effect/hallucination", {});

// Hallucination.dm:489
rt.def("/obj/effect/hallucination/fakeattacker/proc/Initialize", function* Initialize(f: Frame) {
	let clone: Value = null, clone_weapon: Value = null, H: Value = null, I: Value = null;
	yield* parent_proc();
	this.target = f.args[1];
	for (H of each(GLOB.living_mob_list, T("/mob/living/carbon/human"))) {
		if (H.stat || H.lying) {
			continue;
		}
		clone = H;
		break;
	}
	if (!clone) {
		return f.dot;
	}
	let F: Value = (yield* new_(T("/obj/effect/fake_attacker"), rt.getStep(f, this.target, 0), this.target));
	for (I of each(clone.held_items, T("/obj/item"))) {
		if (!rt.locateIn(f, I, GLOB.non_fakeattack_weapons)) {
			clone_weapon = I.name;
			F.weap = I;
		}
	}
	F.name = clone.name;
	F.my_target = this.target;
	F.weapon_name = clone_weapon;
	F.left = (yield* image(clone, { dir: 8 }));
	F.right = (yield* image(clone, { dir: 4 }));
	F.up = (yield* image(clone, { dir: 1 }));
	F.down = (yield* image(clone, { dir: 2 }));
	F.updateimage();
	yield* qdel(this);
	return f.dot;
}, true, { args: ["mapload", "T"] });

rt.type(12069, "/obj/effect/fake_attacker", "/obj/effect", {
	my_target: null,
	weapon_name: null,
	weap: null,
	stand_icon: null,
	currentimage: null,
	base: null,
	skin_tone: null,
	clone: null,
	left: null,
	right: null,
	up: null,
	collapse: null,
	down: null,
	anchored: 1,
	icon: null,
	icon_state: null,
	name: "",
	desc: "",
	density: 0,
	opacity: 0,
	obj_integrity: 100,
});

// Hallucination.dm:563
rt.def("/obj/effect/fake_attacker/proc/attackby", function* attackby(f: Frame, _P: Value, user: Value, params: Value) {
	yield* step_away(this, this.my_target, 2);
	user.changeNext_move(8);
	yield* user.do_attack_animation(this);
	this.my_target.playsound_local(this, _P.hitsound, 1);
	this.my_target.visible_message(`<span class='danger'>${this.my_target} flails around wildly.</span>`, `<span class='danger'>${this.my_target} has attacked ${this}!</span>`);
	this.obj_integrity -= _P.force;
	return f.dot;
}, true);

// Hallucination.dm:573
rt.def("/obj/effect/fake_attacker/proc/Crossed", function* Crossed(f: Frame, M: Value, somenumber: Value) {
	let O: Value = null;
	if (M != this.my_target) return f.dot;
	yield* step_away(this, this.my_target, 2);
	if (!prob(30)) return f.dot;
	for (O of each(oviewers(rt.world().view, this.my_target), T("/mob"))) {
		to_chat(O, `<span class='danger'>${this.my_target} stumbles around.</span>`);
	}
	return f.dot;
}, true);

// Hallucination.dm:580
rt.def("/obj/effect/fake_attacker/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.my_target = f.args[1];
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 300, 8);
	yield* step_away(this, this.my_target, 2);
	yield* ImmediateInvokeAsync(this, P("/obj/effect/fake_attacker/proc/attack_loop"));
	return f.dot;
}, true, { args: ["mapload", "T"] });

// Hallucination.dm:589
rt.def("/obj/effect/fake_attacker/proc/updateimage", function updateimage(f: Frame) {
	if (this.dir == 1) {
		rt.del(f, this.currentimage);
		this.currentimage = new_(T("/image"), this.up, this);
	} else if (this.dir == 2) {
		rt.del(f, this.currentimage);
		this.currentimage = new_(T("/image"), this.down, this);
	} else if (this.dir == 4) {
		rt.del(f, this.currentimage);
		this.currentimage = new_(T("/image"), this.right, this);
	} else if (this.dir == 8) {
		rt.del(f, this.currentimage);
		this.currentimage = new_(T("/image"), this.left, this);
	}
	rt.op(f, "OutputReference", [rt.R.srcVar("my_target")], [this.currentimage], false);
	return f.dot;
});

// Hallucination.dm:606
rt.def("/obj/effect/fake_attacker/proc/attack_loop", function* attack_loop(f: Frame) {
	while (true) {
		yield* sleep(rand(5, 10));
		if (this.obj_integrity < 0 || this.my_target.stat) {
			yield* this.collapse();
			continue;
		}
		if (get_dist(this, this.my_target) > 1) {
			yield* this.setDir(rt.getDir(f, this, this.my_target));
			yield* step_towards(this, this.my_target);
			this.updateimage();
		} else if (prob(15)) {
			if (this.weapon_name) {
				this.my_target.playsound_local(this.my_target, this.weap.hitsound, this.weap.get_clamped_volume(), 1);
				this.my_target.show_message(`<span class='danger'>${this.name} has attacked ${this.my_target} with ${this.weapon_name}!</span>`, 1);
				this.my_target.staminaloss += 30;
				if (prob(20)) {
					yield* this.my_target.blur_eyes(3);
				}
				if (prob(33)) {
					if (!rt.locateIn(f, T("/obj/effect/overlay"), this.my_target.loc)) {
						yield* this.fake_blood(this.my_target);
					}
				}
			} else {
				this.my_target.playsound_local(this.my_target, pick(rt.rsc("sound/weapons/punch1.ogg"), rt.rsc("sound/weapons/punch2.ogg"), rt.rsc("sound/weapons/punch3.ogg"), rt.rsc("sound/weapons/punch4.ogg")), 25, 1, -1);
				this.my_target.show_message(`<span class='userdanger'>${this.name} has punched ${this.my_target}!</span>`, 1);
				this.my_target.staminaloss += 30;
				if (prob(33)) {
					if (!rt.locateIn(f, T("/obj/effect/overlay"), this.my_target.loc)) {
						yield* this.fake_blood(this.my_target);
					}
				}
			}
		}
		if (prob(15)) {
			yield* step_away(this, this.my_target, 2);
		}
	}
	return f.dot;
}, true);

// Hallucination.dm:638
rt.def("/obj/effect/fake_attacker/proc/collapse", function* collapse(f: Frame) {
	this.collapse = 1;
	this.updateimage();
	yield* qdel(this);
	return f.dot;
}, true);

// Hallucination.dm:642
rt.def("/obj/effect/fake_attacker/proc/fake_blood", function* fake_blood(f: Frame, target: Value) {
	let O: Value = null, I: Value = null;
	(O = (yield* new_(T("/obj/effect/overlay"), target.loc))).name = "blood";
	rt.op(f, "Output", [], [target, (I = image(rt.rsc("icons/effects/blood.dmi"), O, `floor${rand(1, 7)}`, O.dir, 1))], false);
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), O)), 300, 8);
	return f.dot;
}, true);

rt.type(12066, "/obj/effect/hallucination/bolts", "/obj/effect/hallucination", {
	doors: null,
});

// Hallucination.dm:650
rt.def("/obj/effect/hallucination/bolts/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.doors = list();
	return f.dot;
});

// Hallucination.dm:653
rt.def("/obj/effect/hallucination/bolts/proc/Initialize", function* Initialize(f: Frame) {
	let I: Value = null, A: Value = null, B: Value = null;
	if (f.args[2] === null) {
		f.args[2] = -1;
	}
	yield* parent_proc();
	this.target = f.args[1];
	let count: Value = 0;
	for (A of each(range(7, this.target), T("/obj/machinery/door/airlock"))) {
		if (count > f.args[2] && f.args[2] > 0) {
			break;
		}
		count++;
		this.doors += (I = (yield* image(A.overlays_file, rt.getStep(f, A, 0), "lights_bolts", { layer: A.layer + 0.1 })));
		if (this.target.client) {
			(rt.modField(f, this.target.client, "images", I, rt.bitOr));
			this.target.playsound_local(rt.getStep(f, A, 0), rt.rsc("sound/machines/boltsdown.ogg"), 30, 0, 3);
		}
		yield* sleep(rand(6, 12));
	}
	yield* sleep(100);
	for (B of each(this.doors, T("/image"))) {
		if (this.target.client) {
			yield* this.target.client.images.Remove(B);
			this.target.playsound_local(rt.getStep(f, B, 0), rt.rsc("sound/machines/boltsup.ogg"), 30, 0, 3);
		}
		yield* sleep(rand(6, 12));
	}
	yield* qdel(this);
	return f.dot;
}, true, { args: ["mapload", "T", "door_number"] });

rt.type(12067, "/obj/effect/hallucination/whispers", "/obj/effect/hallucination", {});

// Hallucination.dm:678
rt.def("/obj/effect/hallucination/whispers/proc/Initialize", function* Initialize(f: Frame) {
	let person: Value = null, H: Value = null, speech_overlay: Value = null, humans: Value = null, H_6: Value = null;
	let $8: any, $e: any;
	yield* parent_proc();
	this.target = f.args[1];
	let speak_messages: Value = list("I'm watching you...", `${this.target.first_name()}!`, "Get out!", "Kchck-Chkck? Kchchck!", "Did you hear that?", "What did you do ?", "Why?", "Give me that!", "HELP!!", "EI NATH!!", "RUN!!", "Kill me!", "O bidai nabora se'sma!", `${text2ratvar("Divinity, grant...")}`);
	let $0: any = "Xenos!";
	let $1: any = "Singularity loose!";
	let $2: any = "Comms down!";
	let $3: any = "They are arming the nuke!";
	let $4: any = "They butchered Ian!";
	let $5: any = "H-help!";
	let $6: any = pick("Cult", "Wizard", "Ling", "Ops", "Revenant", "Murderer", "Harm", "I hear flashing", "Help");
	let $7: any = pick(GLOB.teleportlocs);
	if (prob(50)) {
		$8 = "!";
	} else {
		$8 = "!!";
	}
	let radio_messages: Value = list($0, $1, $2, $3, $4, $5, `${$6} in ${$7}${$8}`, `Where's ${this.target.first_name()}?`, "Call the shuttle!", "AI rogue!!");
	let people: Value = list();
	let understood_language: Value = (yield* this.target.get_random_understood_language());
	for (H of each(view(this.target), T("/mob/living/carbon"))) {
		if (H == this.target) {
			continue;
		}
		if (!person) {
			person = H;
		} else if (get_dist(this.target, H) < get_dist(this.target, person)) {
			person = H;
		}
		people += H;
	}
	if (person) {
		speech_overlay = (yield* image(rt.rsc("icons/mob/talk.dmi"), person, "default0", { layer: ABOVE_MOB_LAYER }));
		to_chat(this.target, (yield* this.target.compose_message(person, understood_language, pick(speak_messages), null, person.get_spans())));
		if (this.target.client) {
			(rt.modField(f, this.target.client, "images", speech_overlay, rt.bitOr));
			yield* sleep(30);
			yield* this.target.client.images.Remove(speech_overlay);
		}
	} else {
		humans = list();
		for (H_6 of each(GLOB.living_mob_list, T("/mob/living/carbon/human"))) {
			humans += H_6;
		}
		person = pick(humans);
		to_chat(this.target, (yield* this.target.compose_message(person, understood_language, pick(radio_messages), "1459", person.get_spans())));
	}
	yield* qdel(this);
	return f.dot;
}, true, { args: ["mapload", "T"] });

rt.type(12068, "/obj/effect/hallucination/message", "/obj/effect/hallucination", {});

// Hallucination.dm:713
rt.def("/obj/effect/hallucination/message/proc/Initialize", function* Initialize(f: Frame, mapload: Value, T: Value) {
	yield* parent_proc();
	this.target = T;
	let chosen: Value = pick("<span class='userdanger'>The light burns you!</span>", "<span class='danger'>You don't feel like yourself.</span>", `<span class='userdanger'>Unknown has punched ${this.target}!</span>`, "<span class='notice'>You hear something squeezing through the ducts...</span>", "<span class='notice'>You hear a distant scream.</span>", "<span class='notice'>You feel invincible, nothing can hurt you!</span>", "<span class='warning'>You feel a tiny prick!</span>", `<B>${this.target}</B> sneezes.`, "<span class='warning'>You feel faint.</span>", `<span class='noticealien'>You hear a strange, alien voice in your head...</span>${pick("Hiss", "Ssss")}`, "<span class='notice'>You can see...everything!</span>");
	to_chat(this.target, chosen);
	yield* qdel(this);
	return f.dot;
}, true);

// Hallucination.dm:731
rt.def("/mob/living/carbon/proc/hallucinate", function* hallucinate(f: Frame, hal_type: Value, specific: Value) {
	let creepyasssounds: Value = null, i: Value = null, alert_type: Value = null, l_hand: Value = null, r_hand: Value = null, l: Value = null, r: Value = null, slots_free: Value = null, H: Value = null, possible_points: Value = null, F: Value = null, target: Value = null, area: Value = null, dead_people: Value = null, G: Value = null, fakemob: Value = null, body: Value = null, M: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $e: any;
	if (hal_type === "xeno") {
		yield* new_(T("/obj/effect/hallucination/xeno_attack"), this.loc, this);
	} else if (hal_type === "singulo") {
		yield* new_(T("/obj/effect/hallucination/singularity_scare"), this.loc, this);
	} else if (hal_type === "koolaid") {
		yield* new_(T("/obj/effect/hallucination/oh_yeah"), this.loc, this);
	} else if (hal_type === "battle") {
		yield* new_(T("/obj/effect/hallucination/battle"), this.loc, this);
	} else if (hal_type === "flood") {
		yield* new_(T("/obj/effect/hallucination/fake_flood"), this.loc, this);
	} else if (hal_type === "delusion") {
		yield* new_(T("/obj/effect/hallucination/delusion"), this.loc, this);
	} else if (hal_type === "self_delusion") {
		yield* new_(T("/obj/effect/hallucination/self_delusion"), this.loc, this);
	} else if (hal_type === "fake") {
		yield* new_(T("/obj/effect/hallucination/fakeattacker"), this.loc, this);
	} else if (hal_type === "bolts") {
		yield* new_(T("/obj/effect/hallucination/bolts"), this.loc, this);
	} else if (hal_type === "bolts_minor") {
		yield* new_(T("/obj/effect/hallucination/bolts"), this.loc, this, rand(1, 2));
	} else if (hal_type === "whispers") {
		yield* new_(T("/obj/effect/hallucination/whispers"), this.loc, this);
	} else if (hal_type === "message") {
		yield* new_(T("/obj/effect/hallucination/message"), this.loc, this);
	} else if (hal_type === "items_other") {
		yield* new_(T("/obj/effect/hallucination/items_other"), this.loc, this);
	} else if (hal_type === "sounds") {
		const die = rand(1, 20);
		if (die === 1) {
			this.playsound_local(null, rt.rsc("sound/machines/airlock.ogg"), 15, 1);
		} else if (die === 2) {
			if (prob(50)) {
				this.playsound_local(null, rt.rsc("sound/effects/explosion1.ogg"), 50, 1);
			} else {
				this.playsound_local(null, rt.rsc("sound/effects/explosion2.ogg"), 50, 1);
			}
		} else if (die === 3) {
			this.playsound_local(null, rt.rsc("sound/effects/explosionfar.ogg"), 50, 1);
		} else if (die === 4) {
			this.playsound_local(null, pick(rt.rsc("sound/effects/glassbr1.ogg"), rt.rsc("sound/effects/glassbr2.ogg"), rt.rsc("sound/effects/glassbr3.ogg")), 50, 1);
		} else if (die === 5) {
			this.playsound_local(null, rt.rsc("sound/weapons/ring.ogg"), 35);
			yield* sleep(15);
			this.playsound_local(null, rt.rsc("sound/weapons/ring.ogg"), 35);
			yield* sleep(15);
			this.playsound_local(null, rt.rsc("sound/weapons/ring.ogg"), 35);
		} else if (die === 6) {
			this.playsound_local(null, rt.rsc("sound/magic/summon_guns.ogg"), 50, 1);
		} else if (die === 7) {
			this.playsound_local(null, rt.rsc("sound/machines/alarm.ogg"), 100, 0);
		} else if (die === 8) {
			this.playsound_local(null, rt.rsc("sound/voice/bfreeze.ogg"), 35, 0);
		} else if (die === 9) {
			this.playsound_local(null, rt.rsc("sound/weapons/gunshot.ogg"), 25, 1);
			rt.spawnTail(f, rand(10, 30), "/mob/living/carbon/proc/hallucinate: spawn at modules/flufftext/Hallucination.dm:778", hal_type, specific, creepyasssounds, i, alert_type, l_hand, r_hand, l, r, slots_free, H, possible_points, F, target, area, dead_people, G, fakemob, body, M);
		} else if (die === 10) {
			this.playsound_local(null, rt.rsc("sound/effects/pray_chaplain.ogg"), 50);
		} else if (die === 11) {
			this.playsound_local(null, rt.rsc("sound/weapons/taser.ogg"), 25, 1);
			rt.spawnTail(f, rand(10, 30), "/mob/living/carbon/proc/hallucinate: spawn at modules/flufftext/Hallucination.dm:786", hal_type, specific, creepyasssounds, i, alert_type, l_hand, r_hand, l, r, slots_free, H, possible_points, F, target, area, dead_people, G, fakemob, body, M);
		} else if (die === 12) {
			creepyasssounds = list(rt.rsc("sound/effects/ghost.ogg"), rt.rsc("sound/effects/ghost2.ogg"), rt.rsc("sound/effects/heart_beat.ogg"), rt.rsc("sound/effects/screech.ogg"), rt.rsc("sound/hallucinations/behind_you1.ogg"), rt.rsc("sound/hallucinations/behind_you2.ogg"), rt.rsc("sound/hallucinations/far_noise.ogg"), rt.rsc("sound/hallucinations/growl1.ogg"), rt.rsc("sound/hallucinations/growl2.ogg"), rt.rsc("sound/hallucinations/growl3.ogg"), rt.rsc("sound/hallucinations/im_here1.ogg"), rt.rsc("sound/hallucinations/im_here2.ogg"), rt.rsc("sound/hallucinations/i_see_you1.ogg"), rt.rsc("sound/hallucinations/i_see_you2.ogg"), rt.rsc("sound/hallucinations/look_up1.ogg"), rt.rsc("sound/hallucinations/look_up2.ogg"), rt.rsc("sound/hallucinations/over_here1.ogg"), rt.rsc("sound/hallucinations/over_here2.ogg"), rt.rsc("sound/hallucinations/over_here3.ogg"), rt.rsc("sound/hallucinations/turn_around1.ogg"), rt.rsc("sound/hallucinations/turn_around2.ogg"), rt.rsc("sound/hallucinations/veryfar_noise.ogg"), rt.rsc("sound/hallucinations/wail.ogg"));
			this.playsound_local(null, pick(creepyasssounds), 50, 1);
		} else if (die === 13) {
			this.playsound_local(null, rt.rsc("sound/effects/ratvar_rises.ogg"), 100);
			yield* sleep(150);
			this.playsound_local(null, rt.rsc("sound/effects/ratvar_reveal.ogg"), 100);
		} else if (die === 14) {
			to_chat(this, "<h1 class='alert'>Priority Announcement</h1>");
			to_chat(this, "<br><br><span class='alert'>The Emergency Shuttle has docked with the station. You have 3 minutes to board the Emergency Shuttle.</span><br><br>");
			this.playsound_local(null, rt.rsc("sound/ai/shuttledock.ogg"), 100);
		} else if (die === 15) {
			this.playsound_local(null, rt.rsc("sound/items/welder.ogg"), 15, 1);
			yield* sleep(105);
			this.playsound_local(null, rt.rsc("sound/items/welder2.ogg"), 15, 1);
			yield* sleep(15);
			this.playsound_local(null, rt.rsc("sound/items/ratchet.ogg"), 15, 1);
		} else if (die === 16) {
			this.playsound_local(null, rt.rsc("sound/items/screwdriver.ogg"), 15, 1);
			yield* sleep(rand(10, 30));
			i = rand(1, 3);
			while (i > 0) {
				this.playsound_local(null, rt.rsc("sound/weapons/empty.ogg"), 15, 1);
				yield* sleep(rand(10, 30));
				i--;
			}
			this.playsound_local(null, rt.rsc("sound/machines/airlockforced.ogg"), 15, 1);
		} else if (die === 17) {
			this.playsound_local(null, rt.rsc("sound/weapons/saberon.ogg"), 35, 1);
		} else if (die === 18) {
			to_chat(this, "<h1 class='alert'>Biohazard Alert</h1>");
			to_chat(this, `<br><br><span class='alert'>Confirmed outbreak of level 5 biohazard aboard ${station_name()}. All personnel must contain the outbreak.</span><br><br>`);
			this.playsound_local(null, rt.rsc("sound/ai/outbreak5.ogg"));
		} else if (die === 19) {
			this.playsound_local(null, rt.rsc("sound/magic/lightningbolt.ogg"), 35, 1);
			yield* sleep(20);
			this.playsound_local(null, rt.rsc("sound/magic/lightningbolt.ogg"), 65, 1);
			yield* sleep(20);
			this.playsound_local(null, rt.rsc("sound/magic/lightningbolt.ogg"), 100, 1);
		} else if (die === 20) {
			to_chat(this, "<h1 class='alert'>Anomaly Alert</h1>");
			to_chat(this, "<br><br><span class='alert'>Hostile runtimes detected in all station systems, please deactivate your AI to prevent possible damage to its morality core.</span><br><br>");
			this.playsound_local(null, rt.rsc("sound/ai/aimalf.ogg"), 100);
		}
	} else if (hal_type === "hudscrew") {
		this.hal_screwyhud = pick(SCREWYHUD_NONE, SCREWYHUD_CRIT, SCREWYHUD_DEAD, SCREWYHUD_HEALTHY);
		yield* sleep(rand(100, 250));
		this.hal_screwyhud = 0;
	} else if (hal_type === "fake_alert") {
		alert_type = pick("oxy", "not_enough_tox", "not_enough_co2", "too_much_oxy", "too_much_co2", "tox_in_air", "newlaw", "nutrition", "charge", "weightless", "fire", "locked", "hacked", "temp", "pressure");
		if (specific) {
			alert_type = specific;
		}
		if (alert_type === "oxy") {
			yield* this.throw_alert("oxy", T("/obj/screen/alert/oxy"), { override: 1 });
		} else if (alert_type === "not_enough_tox") {
			yield* this.throw_alert("not_enough_tox", T("/obj/screen/alert/not_enough_tox"), { override: 1 });
		} else if (alert_type === "not_enough_co2") {
			yield* this.throw_alert("not_enough_co2", T("/obj/screen/alert/not_enough_co2"), { override: 1 });
		} else if (alert_type === "too_much_oxy") {
			yield* this.throw_alert("too_much_oxy", T("/obj/screen/alert/too_much_oxy"), { override: 1 });
		} else if (alert_type === "too_much_co2") {
			yield* this.throw_alert("too_much_co2", T("/obj/screen/alert/too_much_co2"), { override: 1 });
		} else if (alert_type === "tox_in_air") {
			yield* this.throw_alert("tox_in_air", T("/obj/screen/alert/tox_in_air"), { override: 1 });
		} else if (alert_type === "nutrition") {
			if (prob(50)) {
				yield* this.throw_alert("nutrition", T("/obj/screen/alert/fat"), { override: 1 });
			} else {
				yield* this.throw_alert("nutrition", T("/obj/screen/alert/starving"), { override: 1 });
			}
		} else if (alert_type === "weightless") {
			yield* this.throw_alert("weightless", T("/obj/screen/alert/weightless"), { override: 1 });
		} else if (alert_type === "fire") {
			yield* this.throw_alert("fire", T("/obj/screen/alert/fire"), { override: 1 });
		} else if (alert_type === "temp") {
			if (prob(50)) {
				yield* this.throw_alert("temp", T("/obj/screen/alert/hot"), 3, { override: 1 });
			} else {
				yield* this.throw_alert("temp", T("/obj/screen/alert/cold"), 3, { override: 1 });
			}
		} else if (alert_type === "pressure") {
			if (prob(50)) {
				yield* this.throw_alert("pressure", T("/obj/screen/alert/highpressure"), 2, { override: 1 });
			} else {
				yield* this.throw_alert("pressure", T("/obj/screen/alert/lowpressure"), 2, { override: 1 });
			}
		} else if (alert_type === "newlaw") {
			yield* this.throw_alert("newlaw", T("/obj/screen/alert/newlaw"), { override: 1 });
		} else if (alert_type === "locked") {
			yield* this.throw_alert("locked", T("/obj/screen/alert/locked"), { override: 1 });
		} else if (alert_type === "hacked") {
			yield* this.throw_alert("hacked", T("/obj/screen/alert/hacked"), { override: 1 });
		} else if (alert_type === "charge") {
			yield* this.throw_alert("charge", T("/obj/screen/alert/emptycell"), { override: 1 });
		}
		yield* sleep(rand(100, 200));
		yield* this.clear_alert(alert_type, { clear_override: 1 });
	} else if (hal_type === "items") {
		if (!this.halitem) {
			this.halitem = (yield* new_(T("/obj")));
			l_hand = this.get_item_for_held_index(1);
			r_hand = this.get_item_for_held_index(2);
			l = ui_hand_position(this.get_held_index_of_item(l_hand));
			r = ui_hand_position(this.get_held_index_of_item(r_hand));
			slots_free = list(l, r);
			if (l_hand) {
				slots_free -= l;
			}
			if (r_hand) {
				slots_free -= r;
			}
			if (rt.istype(this, T("/mob/living/carbon/human"))) {
				if (!(H = this).belt) {
					slots_free += "CENTER-3:14,SOUTH:5";
				}
				if (!H.l_store) {
					slots_free += "CENTER+1:18,SOUTH:5";
				}
				if (!H.r_store) {
					slots_free += "CENTER+2:20,SOUTH:5";
				}
			}
			if (rt.len(f, slots_free)) {
				this.halitem.screen_loc = pick(slots_free);
				this.halitem.layer = ABOVE_HUD_LAYER;
				this.halitem.plane = ABOVE_HUD_PLANE;
				const die = rand(1, 6);
				if (die === 1) {
					this.halitem.icon = rt.rsc("icons/obj/guns/projectile.dmi");
					this.halitem.icon_state = "revolver";
					this.halitem.name = "Revolver";
				} else if (die === 2) {
					this.halitem.icon = rt.rsc("icons/obj/grenade.dmi");
					this.halitem.icon_state = "plastic-explosive0";
					this.halitem.name = "Mysterious Package";
					if (prob(25)) {
						this.halitem.icon_state = "c4small_1";
					}
				} else if (die === 3) {
					this.halitem.icon = rt.rsc("icons/obj/weapons.dmi");
					this.halitem.icon_state = "sword1";
					this.halitem.name = "Sword";
				} else if (die === 4) {
					this.halitem.icon = rt.rsc("icons/obj/weapons.dmi");
					this.halitem.icon_state = "stunbaton";
					this.halitem.name = "Stun Baton";
				} else if (die === 5) {
					this.halitem.icon = rt.rsc("icons/obj/card.dmi");
					this.halitem.icon_state = "emag";
					this.halitem.name = "Cryptographic Sequencer";
				} else if (die === 6) {
					this.halitem.icon = rt.rsc("icons/obj/grenade.dmi");
					this.halitem.icon_state = "flashbang1";
					this.halitem.name = "Flashbang";
				}
				if (this.client) {
					this.client.screen += this.halitem;
				}
				yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this.halitem)), rand(100, 250), 8);
			}
		}
	} else if (hal_type === "dangerflash") {
		if (!this.halimage) {
			possible_points = list();
			for (F of each(view(this, rt.world().view), T("/turf/open/floor"))) {
				possible_points += F;
			}
			if (rt.len(f, possible_points)) {
				target = pick(possible_points);
				const die = rand(1, 4);
				if (die === 1) {
					this.halimage = image(rt.rsc("icons/turf/space.dmi"), target, `${rand(1, 25)}`, 2);
				} else if (die === 2) {
					this.halimage = image(rt.rsc("icons/turf/floors/lava.dmi"), target, "smooth", 2);
				} else if (die === 3) {
					this.halimage = image(rt.rsc("icons/turf/floors/chasms.dmi"), target, "smooth", 2);
				} else if (die === 4) {
					this.halimage = image(rt.rsc("icons/obj/grenade.dmi"), target, "plastic-explosive2", 3.01);
				}
				if (this.client) {
					this.client.images += this.halimage;
				}
				yield* sleep(rand(40, 60));
				if (this.client) {
					this.client.images -= this.halimage;
				}
				this.halimage = null;
			}
		}
	} else if (hal_type === "death") {
		this.hal_screwyhud = SCREWYHUD_DEAD;
		yield* this.SetUnconscious(400);
		area = get_area(this);
		to_chat(this, `<span class='deadsay'><b>${this.mind.name}</b> has died at <b>${area.name}</b>.</span>`);
		if (prob(50)) {
			dead_people = list();
			for (G of each(GLOB.player_list, T("/mob/dead/observer"))) {
				dead_people += G;
			}
			if (fakemob = pick(dead_people)) {
				yield* sleep(rand(30, 60));
				$0 = this;
				$1 = fakemob.name;
				$2 = "rip";
				$3 = `welcome ${this.first_name()}`;
				$4 = "you too?";
				$5 = "is the AI malf?";
				if (prob(50)) {
					$6 = " fucking";
				} else {
					$6 = "";
				}
				to_chat($0, `<span class='deadsay'><b>DEAD: ${$1}</b> says, "${pick($2, $3, $4, $5, `i${$6} hate ${pick("blood cult", "clock cult", "revenants", "abductors", "double agents", "viruses", "badmins", "you")}`)}"</span>`);
			}
		}
		yield* sleep(rand(50, 70));
		this.hal_screwyhud = SCREWYHUD_NONE;
		yield* this.SetSleeping(0);
	} else if (hal_type === "husks") {
		if (this.halbody) return f.dot;
		possible_points = list();
		F = null;
		for (F of each(view(this, rt.world().view), T("/turf/open/floor"))) {
			possible_points += F;
		}
		if (!rt.len(f, possible_points)) return f.dot;
		target = pick(possible_points);
		const die = rand(1, 4);
		if (die === 1) {
			body = image(rt.rsc("icons/mob/human.dmi"), target, "husk", 2);
			(M = matrix()).Turn(90);
			body.transform = M;
			this.halbody = body;
		} else if (die === 2 || die === 3) {
			this.halbody = image(rt.rsc("icons/mob/human.dmi"), target, "husk", 2);
		} else if (die === 4) {
			this.halbody = image(rt.rsc("icons/mob/alien.dmi"), target, "alienother", 2);
		}
		if (this.client) {
			this.client.images += this.halbody;
		}
		rt.spawnTail(f, rand(30, 50), "/mob/living/carbon/proc/hallucinate: spawn at modules/flufftext/Hallucination.dm:1008", hal_type, specific, creepyasssounds, i, alert_type, l_hand, r_hand, l, r, slots_free, H, possible_points, F, target, area, dead_people, G, fakemob, body, M);
	}
	return f.dot;
}, true, { waitfor: false });

// a spawn((yield* g.call(f, P("/proc/rand"), null, [30, 50]))) body of /mob/living/carbon/proc/hallucinate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/carbon/proc/hallucinate: spawn at modules/flufftext/Hallucination.dm:1008", function* (f: Frame, hal_type: Value, specific: Value, creepyasssounds: Value, i: Value, alert_type: Value, l_hand: Value, r_hand: Value, l: Value, r: Value, slots_free: Value, H: Value, possible_points: Value, F: Value, target: Value, area: Value, dead_people: Value, G: Value, fakemob: Value, body: Value, M: Value) {
	if (this.client) {
		this.client.images -= this.halbody;
	}
	this.halbody = null;
	return null;
});

// a spawn((yield* g.call(f, P("/proc/rand"), null, [10, 30]))) body of /mob/living/carbon/proc/hallucinate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/carbon/proc/hallucinate: spawn at modules/flufftext/Hallucination.dm:786", function* (f: Frame, hal_type: Value, specific: Value, creepyasssounds: Value, i: Value, alert_type: Value, l_hand: Value, r_hand: Value, l: Value, r: Value, slots_free: Value, H: Value, possible_points: Value, F: Value, target: Value, area: Value, dead_people: Value, G: Value, fakemob: Value, body: Value, M: Value) {
	this.playsound_local(null, rt.rsc("sound/weapons/taser.ogg"), 25, 1);
	yield* sleep(rand(5, 10));
	this.playsound_local(null, sound(get_sfx("bodyfall"), 25), 25, 1);
	return null;
});

// a spawn((yield* g.call(f, P("/proc/rand"), null, [10, 30]))) body of /mob/living/carbon/proc/hallucinate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/carbon/proc/hallucinate: spawn at modules/flufftext/Hallucination.dm:778", function* (f: Frame, hal_type: Value, specific: Value, creepyasssounds: Value, i: Value, alert_type: Value, l_hand: Value, r_hand: Value, l: Value, r: Value, slots_free: Value, H: Value, possible_points: Value, F: Value, target: Value, area: Value, dead_people: Value, G: Value, fakemob: Value, body: Value, M: Value) {
	this.playsound_local(null, rt.rsc("sound/weapons/gunshot.ogg"), 25, 1);
	yield* sleep(rand(5, 10));
	this.playsound_local(null, sound(get_sfx("bodyfall"), 25), 25, 1);
	return null;
});
