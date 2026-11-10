// Based on /tg/station's code/modules/power/lighting.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9552, "/obj/item/wallframe/light_fixture/small", "/obj/item/wallframe/light_fixture", {
	name: "small light fixture frame",
	icon_state: "bulb-construct-item",
	result_path: rt.typePath("/obj/structure/light_construct/small"),
	materials: null,
});

// lighting.dm:26
rt.def("/obj/item/wallframe/light_fixture/small/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 2000]);
	return f.dot;
});

rt.type(9551, "/obj/item/wallframe/light_fixture", "/obj/item/wallframe", {
	inverse: 1,
	name: "light fixture frame",
	desc: "Used for building lights.",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "tube-construct-item",
	result_path: rt.typePath("/obj/structure/light_construct"),
});

// lighting.dm:29
rt.def("/obj/item/wallframe/light_fixture/proc/try_build", function try_build(f: Frame, on_wall: Value, user: Value) {
	let A: Value = null;
	if (!parent_proc()) {
		return f.dot;
	}
	if ((A = get_area(user)).dynamic_lighting != 1) {
		to_chat(user, `<span class='warning'>You cannot place ${this} in this area!</span>`);
		return f.dot;
	}
	return 1;
}, false);

rt.type(12976, "/obj/structure/light_construct", "/obj/structure", {
	stage: 1,
	fixture_type: "tube",
	sheets_refunded: 2,
	newlight: null,
	anchored: 1,
	name: "light fixture frame",
	desc: "A light fixture under construction.",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "tube-construct-stage1",
	layer: 4.25,
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
});

// lighting.dm:47
rt.def("/obj/structure/light_construct/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 10, "laser", 10, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 80, "acid", 50]);
	return f.dot;
});

// lighting.dm:55
rt.def("/obj/structure/light_construct/proc/New", function* New(f: Frame, loc: Value, ndir: Value, building: Value) {
	yield* parent_proc();
	if (!building) return f.dot;
	yield* this.setDir(ndir);
	return f.dot;
}, true);

// lighting.dm:60
rt.def("/obj/structure/light_construct/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.stage === 1) {
		to_chat(user, "It's an empty frame.");
	} else if (this.stage === 2) {
		to_chat(user, "It's wired.");
	} else if (this.stage === 3) {
		to_chat(user, "The casing is closed.");
	}
	return f.dot;
}, false);

// lighting.dm:70
rt.def("/obj/structure/light_construct/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let coil: Value = null;
	yield* this.add_fingerprint(user);
	if (this.stage === 1) {
		if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
			playsound(this.loc, W.usesound, 75, 1);
			to_chat(f.usr, `<span class='notice'>You begin deconstructing ${this}...</span>`);
			if (!(yield* do_after(f.usr, 30 * W.toolspeed, { target: this }))) {
				return f.dot;
			}
			yield* new_(T("/obj/item/stack/sheet/metal"), rt.getStep(f, this.loc, 0), this.sheets_refunded);
			user.visible_message(`${user.name} deconstructs ${this}.`, `<span class='notice'>You deconstruct ${this}.</span>`, "<span class='italics'>You hear a ratchet.</span>");
			playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 75, 1);
			yield* qdel(this);
			return f.dot;
		}
		if (rt.istype(W, T("/obj/item/stack/cable_coil"))) {
			if (yield* (coil = W).use(1)) {
				if (this.fixture_type === "tube") {
					this.icon_state = "tube-construct-stage2";
				} else if (this.fixture_type === "bulb") {
					this.icon_state = "bulb-construct-stage2";
				}
				this.stage = 2;
				user.visible_message(`${user.name} adds wires to ${this}.`, `<span class='notice'>You add wires to ${this}.</span>`);
			} else {
				to_chat(user, `<span class='warning'>You need one length of cable to wire ${this}!</span>`);
			}
			return f.dot;
		}
	} else if (this.stage === 2) {
		if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
			to_chat(f.usr, "<span class='warning'>You have to remove the wires first!</span>");
			return f.dot;
		}
		if (rt.istype(W, T("/obj/item/weapon/wirecutters"))) {
			this.stage = 1;
			if (this.fixture_type === "tube") {
				this.icon_state = "tube-construct-stage1";
			} else if (this.fixture_type === "bulb") {
				this.icon_state = "bulb-construct-stage1";
			}
			yield* new_(T("/obj/item/stack/cable_coil"), rt.getStep(f, this.loc, 0), 1, "red");
			user.visible_message(`${user.name} removes the wiring from ${this}.`, `<span class='notice'>You remove the wiring from ${this}.</span>`, "<span class='italics'>You hear clicking.</span>");
			playsound(this.loc, W.usesound, 100, 1);
			return f.dot;
		}
		if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
			user.visible_message(`${user.name} closes ${this}'s casing.`, `<span class='notice'>You close ${this}'s casing.</span>`, "<span class='italics'>You hear screwing.</span>");
			playsound(this.loc, W.usesound, 75, 1);
			if (this.fixture_type === "tube") {
				this.newlight = (yield* new_(T("/obj/machinery/light/built"), this.loc));
			} else if (this.fixture_type === "bulb") {
				this.newlight = (yield* new_(T("/obj/machinery/light/small/built"), this.loc));
			}
			yield* this.newlight.setDir(this.dir);
			this.transfer_fingerprints_to(this.newlight);
			yield* qdel(this);
			return f.dot;
		}
	}
	return (yield* parent_proc());
}, true);

// lighting.dm:133
rt.def("/obj/structure/light_construct/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	if (!(B && B.loc == this.loc)) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

// lighting.dm:138
rt.def("/obj/structure/light_construct/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, this.sheets_refunded);
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(10342, "/obj/machinery/light", "/obj/machinery", {
	base_state: "tube",
	on: 0,
	on_gs: 0,
	static_power_used: 0,
	brightness: 8,
	status: 0,
	flickering: 0,
	light_type: rt.typePath("/obj/item/weapon/light/tube"),
	fitting: "tube",
	switchcount: 0,
	rigged: 0,
	anchored: 1,
	name: "light fixture",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "tube1",
	desc: "A lighting fixture.",
	layer: 4.25,
	obj_integrity: 100,
	max_integrity: 100,
	use_power: 2,
	idle_power_usage: 2,
	active_power_usage: 20,
	power_channel: 2,
});

// lighting.dm:191
rt.def("/obj/machinery/light/proc/Move", function* Move(f: Frame) {
	if (this.status != LIGHT_BROKEN) {
		yield* this.break_light_tube(1);
	}
	return (yield* parent_proc());
}, true);

rt.type(10345, "/obj/machinery/light/built", "/obj/machinery/light", {});

// lighting.dm:197
rt.def("/obj/machinery/light/built/proc/New", function* New(f: Frame) {
	this.status = LIGHT_EMPTY;
	yield* this.update(0);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(10344, "/obj/machinery/light/small/built", "/obj/machinery/light/small", {});

// lighting.dm:202
rt.def("/obj/machinery/light/small/built/proc/New", function* New(f: Frame) {
	this.status = LIGHT_EMPTY;
	yield* this.update(0);
	yield* parent_proc();
	return f.dot;
}, true);

// lighting.dm:208
rt.def("/obj/machinery/light/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	rt.spawnTail(f, 2, "/obj/machinery/light/proc/New: spawn at modules/power/lighting.dm:209");
	return f.dot;
}, true);

// a spawn(2) body of /obj/machinery/light/proc/New, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/light/proc/New: spawn at modules/power/lighting.dm:209", function* (f: Frame) {
	if (this.fitting === "tube") {
		this.brightness = 8;
		if (prob(2)) {
			yield* this.break_light_tube(1);
		}
	} else if (this.fitting === "bulb") {
		this.brightness = 4;
		if (prob(5)) {
			yield* this.break_light_tube(1);
		}
	}
	rt.spawnTail(f, 1, "/obj/machinery/light/proc/New: spawn at modules/power/lighting.dm:219");
	return null;
});

// a spawn(1) body of /obj/machinery/light/proc/New, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/light/proc/New: spawn at modules/power/lighting.dm:219", function* (f: Frame) {
	yield* this.update(0);
	return null;
});

// lighting.dm:223
rt.def("/obj/machinery/light/proc/Destroy", function* Destroy(f: Frame) {
	let A: Value = null;
	if (A = get_area(this)) {
		this.on = 0;
	}
	return (yield* parent_proc());
}, true);

// lighting.dm:231
rt.def("/obj/machinery/light/proc/update_icon", function update_icon(f: Frame) {
	if (this.status === LIGHT_OK) {
		this.icon_state = `${this.base_state}${this.on}`;
	} else if (this.status === LIGHT_EMPTY) {
		this.icon_state = `${this.base_state}-empty`;
		this.on = 0;
	} else if (this.status === LIGHT_BURNED) {
		this.icon_state = `${this.base_state}-burned`;
		this.on = 0;
	} else if (this.status === LIGHT_BROKEN) {
		this.icon_state = `${this.base_state}-broken`;
		this.on = 0;
	}
	return f.dot;
});

// lighting.dm:248
rt.def("/obj/machinery/light/proc/update", function update(f: Frame, trigger: Value) {
	trigger ??= 1;
	this.update_icon();
	if (this.on) {
		if (!this.light || this.light.light_range != this.brightness) {
			this.switchcount++;
			if (this.rigged) {
				if (this.status == LIGHT_OK && trigger) {
					this.explode();
				}
			} else if (prob(min(60, this.switchcount * this.switchcount * 0.01))) {
				if (trigger) {
					this.burn_out();
				}
			} else {
				this.use_power = 2;
				this.set_light(this.brightness);
			}
		}
	} else {
		this.use_power = 1;
		this.set_light(0);
	}
	this.active_power_usage = this.brightness * 10;
	if (this.on == this.on_gs) return f.dot;
	this.on_gs = this.on;
	if (this.on) {
		this.static_power_used = this.brightness * 20;
		this.addStaticPower(this.static_power_used, 6);
	} else {
		this.removeStaticPower(this.static_power_used, 6);
	}
	return f.dot;
});

// lighting.dm:276
rt.def("/obj/machinery/light/proc/burn_out", function burn_out(f: Frame) {
	if (this.status != LIGHT_OK) return f.dot;
	this.status = LIGHT_BURNED;
	this.icon_state = `${this.base_state}-burned`;
	this.on = 0;
	this.set_light(0);
	return f.dot;
});

// lighting.dm:285
rt.def("/obj/machinery/light/proc/seton", function seton(f: Frame, s: Value) {
	this.on = (s && (this.status == 0 ? 1 : 0));
	this.update();
	return f.dot;
});

// lighting.dm:290
rt.def("/obj/machinery/light/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.status === LIGHT_OK) {
		to_chat(user, `It is turned ${this.on ? "on" : "off"}.`);
	} else if (this.status === LIGHT_EMPTY) {
		to_chat(user, `The ${this.fitting} has been removed.`);
	} else if (this.status === LIGHT_BURNED) {
		to_chat(user, `The ${this.fitting} is burnt out.`);
	} else if (this.status === LIGHT_BROKEN) {
		to_chat(user, `The ${this.fitting} has been smashed.`);
	}
	return f.dot;
}, false);

// lighting.dm:308
rt.def("/obj/machinery/light/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let LR: Value = null, L: Value = null;
	if (rt.istype(W, T("/obj/item/device/lightreplacer"))) {
		yield* (LR = W).ReplaceLight(this, user);
	} else if (rt.istype(W, T("/obj/item/weapon/light"))) {
		if (this.status == LIGHT_OK) {
			to_chat(user, `<span class='warning'>There is a ${this.fitting} already inserted!</span>`);
		} else {
			yield* this.add_fingerprint(user);
			if (rt.op(f, "IsType", [], [(L = W), this.light_type])) {
				if (!(yield* user.drop_item())) {
					return f.dot;
				}
				yield* this.add_fingerprint(user);
				if (this.status != LIGHT_EMPTY) {
					yield* this.drop_light_tube(user);
					to_chat(user, `<span class='notice'>You replace ${L}.</span>`);
				} else {
					to_chat(user, `<span class='notice'>You insert ${L}.</span>`);
				}
				this.status = L.status;
				this.switchcount = L.switchcount;
				this.rigged = L.rigged;
				this.brightness = L.brightness;
				this.on = this.has_power();
				yield* this.update();
				yield* qdel(L);
				if (this.on && this.rigged) {
					yield* this.explode();
				}
			} else {
				to_chat(user, `<span class='warning'>This type of light requires a ${this.fitting}!</span>`);
			}
		}
	} else if (this.status == LIGHT_EMPTY) {
		if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
			playsound(this.loc, W.usesound, 75, 1);
			user.visible_message(`${user.name} opens ${this}'s casing.`, `<span class='notice'>You open ${this}'s casing.</span>`, "<span class='italics'>You hear a noise.</span>");
			yield* this.deconstruct();
		} else {
			to_chat(user, fmt("<span class='userdanger'>You stick ％！ into the light socket!</span>", [W]));
			if (this.has_power() && rt.bitAnd(W.flags, CONDUCT)) {
				yield* do_sparks(3, 1, this);
				if (prob(75)) {
					yield* electrocute_mob(user, get_area(this), this, rand(0.7, 1), 1);
				}
			}
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// lighting.dm:360
rt.def("/obj/machinery/light/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let newlight: Value = null, cur_stage: Value = null;
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		cur_stage = LIGHT_BROKEN;
		if (!disassembled) {
			cur_stage = LIGHT_EMPTY;
		}
		if (this.fitting === "tube") {
			(newlight = (yield* new_(T("/obj/structure/light_construct"), this.loc))).icon_state = `tube-construct-stage${cur_stage}`;
		} else if (this.fitting === "bulb") {
			(newlight = (yield* new_(T("/obj/structure/light_construct/small"), this.loc))).icon_state = `bulb-construct-stage${cur_stage}`;
		}
		yield* newlight.setDir(this.dir);
		newlight.stage = cur_stage;
		if (!disassembled) {
			newlight.obj_integrity = newlight.max_integrity * 0.5;
			if (this.status != LIGHT_BROKEN) {
				yield* this.break_light_tube();
			}
			if (this.status != LIGHT_EMPTY) {
				yield* this.drop_light_tube();
			}
			yield* new_(T("/obj/item/stack/cable_coil"), this.loc, 1, "red");
		}
		this.transfer_fingerprints_to(newlight);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// lighting.dm:386
rt.def("/obj/machinery/light/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value) {
	yield* parent_proc();
	if (!(this.status == LIGHT_BROKEN || this.status == LIGHT_EMPTY)) return f.dot;
	if (!(this.on && rt.bitAnd(I.flags, CONDUCT))) return f.dot;
	if (!prob(12)) return f.dot;
	yield* electrocute_mob(user, get_area(this), this, 0.3, 1);
	return f.dot;
}, true);

// lighting.dm:393
rt.def("/obj/machinery/light/proc/take_damage", function* take_damage(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = "brute";
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	f.dot = (yield* parent_proc());
	if (!(f.dot && !(!this || this.gc_destroyed))) return f.dot;
	if (!prob(f.args[0] * 5)) return f.dot;
	yield* this.break_light_tube();
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect"] });

// lighting.dm:402
rt.def("/obj/machinery/light/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		if (this.status === LIGHT_EMPTY) {
			playsound(this.loc, rt.rsc("sound/weapons/smash.ogg"), 50, 1);
		} else if (this.status === LIGHT_BROKEN) {
			playsound(this.loc, rt.rsc("sound/effects/hit_on_shattered_glass.ogg"), 90, 1);
		} else {
			playsound(this.loc, rt.rsc("sound/effects/glasshit.ogg"), 90, 1);
		}
	} else if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 100, 1);
	}
	return f.dot;
});

// lighting.dm:418
rt.def("/obj/machinery/light/proc/has_power", function has_power(f: Frame) {
	let A: Value = null;
	return ((A = get_area(this)).lightswitch && A.power_light);
});

// lighting.dm:425
rt.def("/obj/machinery/light/proc/flicker", function* flicker(f: Frame, amount: Value) {
	let i: Value = null;
	amount ??= rand(10, 20);
	if (this.flickering) {
		return f.dot;
	}
	this.flickering = 1;
	if (this.on && this.status == 0) {
		i = 0;
		while (i < amount) {
			if (this.status != 0) {
				break;
			}
			this.on = (!this.on ? 1 : 0);
			yield* this.update(0);
			yield* sleep(rand(5, 15));
			i++;
		}
		this.on = (this.status == 0 ? 1 : 0);
		yield* this.update(0);
	}
	this.flickering = 0;
	return f.dot;
}, true, { waitfor: false });

// lighting.dm:438
rt.def("/obj/machinery/light/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	this.flicker(1);
	return f.dot;
});

// lighting.dm:445
rt.def("/obj/machinery/light/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let prot: Value = null, H: Value = null, G: Value = null, affecting: Value = null;
	let $0: any, $1: any;
	user.changeNext_move(8);
	yield* this.add_fingerprint(user);
	if (this.status == LIGHT_EMPTY) {
		to_chat(user, `There is no ${this.fitting} in this light.`);
		return f.dot;
	}
	if (this.on) {
		prot = 0;
		if (rt.istype((H = user), T("/mob/living/carbon/human"))) {
			if (H.gloves) {
				if ((G = H.gloves).max_heat_protection_temperature) {
					prot = (G.max_heat_protection_temperature > 360 ? 1 : 0);
				}
			}
		} else {
			prot = 1;
		}
		if (prot > 0) {
			to_chat(user, `<span class='notice'>You remove the light ${this.fitting}.</span>`);
		} else if (rt.istype(user, T("/mob/living/carbon/human")) && user.dna.check_mutation("Telekinesis")) {
			to_chat(user, `<span class='notice'>You telekinetically remove the light ${this.fitting}.</span>`);
		} else {
			to_chat(user, `<span class='warning'>You try to remove the light ${this.fitting}, but you burn your hand on it!</span>`);
			$0 = H;
			if (user.active_hand_index % 2 == 0) {
				$1 = "r";
			} else {
				$1 = "l";
			}
			if ((affecting = $0.get_bodypart(`${$1}_arm`)) && (yield* affecting.receive_damage(0, 5))) {
				H.update_damage_overlays();
			}
			return f.dot;
		}
	} else {
		to_chat(user, `<span class='notice'>You remove the light ${this.fitting}.</span>`);
	}
	yield* this.drop_light_tube(user);
	return f.dot;
}, true);

// lighting.dm:483
rt.def("/obj/machinery/light/proc/drop_light_tube", function* drop_light_tube(f: Frame, user: Value) {
	let L: Value = null;
	(L = (yield* new_(this.light_type))).status = this.status;
	L.rigged = this.rigged;
	L.brightness = this.brightness;
	L.switchcount = this.switchcount;
	this.switchcount = 0;
	yield* L.update();
	yield* L.forceMove(this.loc);
	if (user) {
		yield* L.add_fingerprint(user);
		yield* user.put_in_active_hand(L);
	}
	this.status = LIGHT_EMPTY;
	yield* this.update();
	return L;
}, true);

// lighting.dm:504
rt.def("/obj/machinery/light/proc/attack_tk", function* attack_tk(f: Frame, user: Value) {
	let L: Value = null;
	if (this.status == LIGHT_EMPTY) {
		to_chat(user, `There is no ${this.fitting} in this light.`);
		return f.dot;
	}
	to_chat(user, `<span class='notice'>You telekinetically remove the light ${this.fitting}.</span>`);
	yield* (L = (yield* this.drop_light_tube())).attack_tk(user);
	return f.dot;
}, true);

// lighting.dm:517
rt.def("/obj/machinery/light/proc/break_light_tube", function* break_light_tube(f: Frame, skip_sound_and_sparks: Value) {
	skip_sound_and_sparks ??= 0;
	if (this.status == LIGHT_EMPTY || this.status == LIGHT_BROKEN) {
		return f.dot;
	}
	if (!skip_sound_and_sparks) {
		if (this.status == LIGHT_OK || this.status == LIGHT_BURNED) {
			playsound(this.loc, rt.rsc("sound/effects/glasshit.ogg"), 75, 1);
		}
		if (this.on) {
			yield* do_sparks(3, 1, this);
		}
	}
	this.status = LIGHT_BROKEN;
	yield* this.update();
	return f.dot;
}, true);

// lighting.dm:529
rt.def("/obj/machinery/light/proc/fix", function fix(f: Frame) {
	if (this.status == LIGHT_OK) {
		return f.dot;
	}
	this.status = LIGHT_OK;
	this.brightness = rt.initial(f, this, "brightness");
	this.on = 1;
	this.update();
	return f.dot;
});

// lighting.dm:538
rt.def("/obj/machinery/light/proc/tesla_act", function* tesla_act(f: Frame, power: Value, explosive: Value) {
	explosive ??= 0;
	if (explosive) {
		yield* explosion(this.loc, 0, 0, 0, { flame_range: 5, adminlog: 0 });
	}
	yield* qdel(this);
	return f.dot;
}, true);

// lighting.dm:543
rt.def("/obj/machinery/light/proc/power_change", function power_change(f: Frame) {
	let A: Value = null;
	this.seton(((A = get_area(this)).lightswitch && A.power_light));
	return f.dot;
});

// lighting.dm:549
rt.def("/obj/machinery/light/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	if (!prob(max(0, exposed_temperature - 673))) return f.dot;
	yield* this.break_light_tube();
	return f.dot;
}, true);

// lighting.dm:556
rt.def("/obj/machinery/light/proc/explode", function* explode(f: Frame) {
	let _T: Value = rt.getStep(f, this.loc, 0);
	yield* this.break_light_tube();
	yield* sleep(2);
	yield* explosion(_T, 0, 0, 2, 2);
	yield* sleep(1);
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

rt.type(7638, "/obj/item/weapon/light", "/obj/item/weapon", {
	status: 0,
	base_state: null,
	switchcount: 0,
	rigged: 0,
	brightness: 2,
	icon: rt.rsc("icons/obj/lighting.dmi"),
	force: 2,
	throwforce: 5,
	w_class: 1,
	materials: null,
});

// lighting.dm:575
rt.def("/obj/item/weapon/light/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 100]);
	return f.dot;
});

// lighting.dm:596
rt.def("/obj/item/weapon/light/proc/throw_impact", function throw_impact(f: Frame, hit_atom: Value) {
	if (parent_proc()) return f.dot;
	this.shatter();
	return f.dot;
}, false, { waitfor: false });

// lighting.dm:602
rt.def("/obj/item/weapon/light/proc/update", function update(f: Frame) {
	if (this.status === LIGHT_OK) {
		this.icon_state = this.base_state;
		this.desc = `A replacement ${this.name}.`;
	} else if (this.status === LIGHT_BURNED) {
		this.icon_state = `${this.base_state}-burned`;
		this.desc = `A burnt-out ${this.name}.`;
	} else if (this.status === LIGHT_BROKEN) {
		this.icon_state = `${this.base_state}-broken`;
		this.desc = `A broken ${this.name}.`;
	}
	return f.dot;
});

// lighting.dm:615
rt.def("/obj/item/weapon/light/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.update();
	return f.dot;
}, true);

// lighting.dm:622
rt.def("/obj/item/weapon/light/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let S: Value = null;
	yield* parent_proc();
	if (rt.istype(I, T("/obj/item/weapon/reagent_containers/syringe"))) {
		S = I;
		to_chat(user, fmt("<span class='notice'>You inject the solution into ％！.</span>", [this]));
		if (S.reagents.has_reagent("plasma", 5)) {
			this.rigged = 1;
		}
		yield* S.reagents.clear_reagents();
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// lighting.dm:638
rt.def("/obj/item/weapon/light/proc/attack", function* attack(f: Frame, M: Value, user: Value, def_zone: Value) {
	yield* parent_proc();
	this.shatter();
	return f.dot;
}, true);

// lighting.dm:642
rt.def("/obj/item/weapon/light/proc/attack_obj", function* attack_obj(f: Frame, O: Value, user: Value) {
	yield* parent_proc();
	this.shatter();
	return f.dot;
}, true);

// lighting.dm:646
rt.def("/obj/item/weapon/light/proc/shatter", function shatter(f: Frame) {
	if (!(this.status == LIGHT_OK || this.status == LIGHT_BURNED)) return f.dot;
	this.visible_message(`<span class='danger'>${this.name} shatters.</span>`, "<span class='italics'>You hear a small glass object shatter.</span>");
	this.status = LIGHT_BROKEN;
	this.force = 5;
	playsound(this.loc, rt.rsc("sound/effects/glasshit.ogg"), 75, 1);
	this.update();
	return f.dot;
});
