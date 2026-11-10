// Based on /tg/station's code/game/objects/items/weapons/melee/energy.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5673, "/obj/item/weapon/melee/energy", "/obj/item/weapon/melee", {
	active: 0,
	force_on: 30,
	throwforce_on: 20,
	icon_state_on: "axe1",
	attack_verb_on: null,
	possible_colors: null,
	w_class_on: 4,
	brightness_on: 3,
	w_class: 2,
	sharpness: 1,
	heat: 3500,
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
	resistance_flags: 2,
});

// energy.dm:14
rt.def("/obj/item/weapon/melee/energy/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb_on = list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut");
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 30]);
	return f.dot;
});

// energy.dm:19
rt.def("/obj/item/weapon/melee/energy/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (rt.length(this.possible_colors)) {
		this.item_color = pick(this.possible_colors);
		if (this.item_color === "red") {
			this.light_color = "#FA8282";
		} else if (this.item_color === "green") {
			this.light_color = "#64C864";
		} else if (this.item_color === "blue") {
			this.light_color = "#40CEFF";
		} else if (this.item_color === "purple") {
			this.light_color = "#9B51FF";
		}
	}
	if (!this.active) return f.dot;
	this.set_light(this.brightness_on);
	return f.dot;
}, true);

// energy.dm:35
rt.def("/obj/item/weapon/melee/energy/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is ${pick(`slitting ${user.p_their()} stomach open with`, "falling on")} ${this}! It looks like ${user.p_theyre()} trying to commit seppuku!</span>`);
	return 3;
});

// energy.dm:42
rt.def("/obj/item/weapon/melee/energy/proc/is_sharp", function is_sharp(f: Frame) {
	return this.active * this.sharpness;
});

rt.type(5674, "/obj/item/weapon/melee/energy/axe", "/obj/item/weapon/melee/energy", {
	force_on: 150,
	throwforce_on: 30,
	throw_speed: 3,
	throw_range: 5,
	w_class_on: 5,
	flags: 64,
	attack_verb_on: null,
	light_color: "#40ceff",
	name: "energy axe",
	desc: "An energized battle axe.",
	icon_state: "axe0",
	force: 40,
	throwforce: 25,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	w_class: 3,
	armour_penetration: 100,
	origin_tech: "combat=4;magnets=3",
	attack_verb: null,
});

// energy.dm:61
rt.def("/obj/item/weapon/melee/energy/axe/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb_on = list();
	this.attack_verb = list("attacked", "chopped", "cleaved", "torn", "cut");
	return f.dot;
});

// energy.dm:65
rt.def("/obj/item/weapon/melee/energy/axe/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} swings ${this} towards ${user.p_their()} head! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	return 3;
});

rt.type(5675, "/obj/item/weapon/melee/energy/sword", "/obj/item/weapon/melee/energy", {
	hacked: 0,
	throw_speed: 3,
	throw_range: 5,
	possible_colors: null,
	name: "energy sword",
	desc: "May the force be within you.",
	icon_state: "sword0",
	force: 3,
	throwforce: 5,
	hitsound: "swing_hit",
	sharpness: 1,
	embed_chance: 75,
	embedded_impact_pain_multiplier: 10,
	armour_penetration: 35,
	origin_tech: "combat=3;magnets=4;syndicate=4",
	block_chance: 50,
});

// energy.dm:87
rt.def("/obj/item/weapon/melee/energy/sword/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// energy.dm:93
rt.def("/obj/item/weapon/melee/energy/sword/proc/process", function* process(f: Frame) {
	if (this.active) {
		if (this.hacked) {
			this.light_color = pick("#FA8282", "#64C864", "#40CEFF", "#9B51FF");
		}
		yield* this.open_flame();
	} else {
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
	}
	return f.dot;
}, true, { waitfor: false });

// energy.dm:100
rt.def("/obj/item/weapon/melee/energy/sword/proc/hit_reaction", function hit_reaction(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = "the attack";
	}
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (f.args[4] === null) {
		f.args[4] = 0;
	}
	if (f.args[5] === null) {
		f.args[5] = 1;
	}
	if (this.active) {
		return parent_proc();
	}
	return 0;
}, false, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });

// energy.dm:104
rt.def("/obj/item/weapon/melee/energy/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (rt.bitAnd(user.disabilities, 256) && prob(50)) {
		to_chat(user, `<span class='warning'>You accidentally cut yourself with ${this}, like a doofus!</span>`);
		yield* user.take_bodypart_damage(5, 5);
	}
	this.active = (!this.active ? 1 : 0);
	if (this.active) {
		this.force = this.force_on;
		this.throwforce = this.throwforce_on;
		this.hitsound = rt.rsc("sound/weapons/blade1.ogg");
		this.throw_speed = 4;
		if (rt.len(f, this.attack_verb_on)) {
			this.attack_verb = this.attack_verb_on;
		}
		if (!this.item_color) {
			this.icon_state = this.icon_state_on;
		} else {
			this.icon_state = `sword${this.item_color}`;
		}
		this.w_class = this.w_class_on;
		playsound(user, rt.rsc("sound/weapons/saberon.ogg"), 35, 1);
		to_chat(user, `<span class='notice'>${this} is now active.</span>`);
		if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSobj.processing += this;
		}
		this.set_light(this.brightness_on);
	} else {
		this.force = rt.initial(f, this, "force");
		this.throwforce = rt.initial(f, this, "throwforce");
		this.hitsound = rt.initial(f, this, "hitsound");
		this.throw_speed = rt.initial(f, this, "throw_speed");
		if (rt.len(f, this.attack_verb_on)) {
			this.attack_verb = list();
		}
		this.icon_state = rt.initial(f, this, "icon_state");
		this.w_class = rt.initial(f, this, "w_class");
		playsound(user, rt.rsc("sound/weapons/saberoff.ogg"), 35, 1);
		to_chat(user, `<span class='notice'>${this} can now be concealed.</span>`);
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
		this.set_light(0);
	}
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// energy.dm:140
rt.def("/obj/item/weapon/melee/energy/proc/is_hot", function is_hot(f: Frame) {
	return this.active * this.heat;
});

// energy.dm:143
rt.def("/obj/item/weapon/melee/energy/proc/ignition_effect", function* ignition_effect(f: Frame, A: Value, user: Value) {
	let C: Value = null;
	if (!this.active) {
		return "";
	}
	let in_mouth: Value = "";
	if (rt.istype(user, T("/mob/living/carbon"))) {
		if ((C = user).wear_mask == this) {
			in_mouth = ", barely missing their nose";
		}
	}
	f.dot = `<span class='warning'>${user} swings their ${this}${in_mouth}. They light ${A} in the process.</span>`;
	playsound(this.loc, this.hitsound, this.get_clamped_volume(), 1, -1);
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

rt.type(5676, "/obj/item/weapon/melee/energy/sword/cyborg", "/obj/item/weapon/melee/energy/sword", {
	hitcost: 50,
});

// energy.dm:160
rt.def("/obj/item/weapon/melee/energy/sword/cyborg/proc/attack", function* attack(f: Frame, M: Value, R: Value) {
	let C: Value = null;
	if (R.cell) {
		C = R.cell;
		if (this.active && !(yield* C.use(this.hitcost))) {
			yield* this.attack_self(R);
			to_chat(R, "<span class='notice'>It's out of charge!</span>");
			return f.dot;
		}
		yield* parent_proc();
	}
	return f.dot;
}, true);

rt.type(5677, "/obj/item/weapon/melee/energy/sword/cyborg/saw", "/obj/item/weapon/melee/energy/sword/cyborg", {
	force_on: 30,
	icon_state_on: "esaw_1",
	hitcost: 75,
	light_color: "#40ceff",
	possible_colors: null,
	name: "energy saw",
	desc: "For heavy duty cutting. It has a carbon-fiber blade in addition to a toggleable hard-light edge to dramatically increase sharpness.",
	icon_state: "esaw_0",
	force: 18,
	hitsound: rt.rsc("sound/weapons/circsawhit.ogg"),
	icon: rt.rsc("icons/obj/surgery.dmi"),
	item_color: null,
	w_class: 3,
	sharpness: 1,
});

// energy.dm:184
rt.def("/obj/item/weapon/melee/energy/sword/cyborg/saw/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_colors = null;
	return f.dot;
});

// energy.dm:187
rt.def("/obj/item/weapon/melee/energy/sword/cyborg/saw/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.icon_state = "esaw_0";
	this.item_color = null;
	return f.dot;
}, true);

rt.type(5679, "/obj/item/weapon/melee/energy/sword/saber/blue", "/obj/item/weapon/melee/energy/sword/saber", {
	possible_colors: null,
});

// energy.dm:197
rt.def("/obj/item/weapon/melee/energy/sword/saber/blue/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_colors = list("blue");
	return f.dot;
});

rt.type(5680, "/obj/item/weapon/melee/energy/sword/saber/purple", "/obj/item/weapon/melee/energy/sword/saber", {
	possible_colors: null,
});

// energy.dm:200
rt.def("/obj/item/weapon/melee/energy/sword/saber/purple/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_colors = list("purple");
	return f.dot;
});

rt.type(5681, "/obj/item/weapon/melee/energy/sword/saber/green", "/obj/item/weapon/melee/energy/sword/saber", {
	possible_colors: null,
});

// energy.dm:203
rt.def("/obj/item/weapon/melee/energy/sword/saber/green/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_colors = list("green");
	return f.dot;
});

rt.type(5682, "/obj/item/weapon/melee/energy/sword/saber/red", "/obj/item/weapon/melee/energy/sword/saber", {
	possible_colors: null,
});

// energy.dm:206
rt.def("/obj/item/weapon/melee/energy/sword/saber/red/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_colors = list("red");
	return f.dot;
});

rt.type(5678, "/obj/item/weapon/melee/energy/sword/saber", "/obj/item/weapon/melee/energy/sword", {});

// energy.dm:210
rt.def("/obj/item/weapon/melee/energy/sword/saber/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/device/multitool"))) {
		if (!this.hacked) {
			this.hacked = 1;
			this.item_color = "rainbow";
			to_chat(user, "<span class='warning'>RNBW_ENGAGE</span>");
			if (this.active) {
				this.icon_state = "swordrainbow";
				yield* user.update_inv_hands();
			}
		} else {
			to_chat(user, "<span class='warning'>It's already fabulous!</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(5684, "/obj/item/weapon/melee/energy/blade", "/obj/item/weapon/melee/energy", {
	spark_system: null,
	active: 1,
	throw_speed: 3,
	throw_range: 1,
	name: "energy blade",
	desc: "A concentrated beam of energy in the shape of a blade. Very stylish... and lethal.",
	icon_state: "blade",
	force: 30,
	hitsound: rt.rsc("sound/weapons/blade1.ogg"),
	throwforce: 1,
	w_class: 4,
	sharpness: 1,
});

// energy.dm:247
rt.def("/obj/item/weapon/melee/energy/blade/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.spark_system = (yield* new_(T("/datum/effect_system/spark_spread")));
	yield* this.spark_system.set_up(5, 0, this);
	yield* this.spark_system.attach(this);
	return f.dot;
}, true);
