// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/mushroom.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(4972, "/mob/living/simple_animal/hostile/mushroom", "/mob/living/simple_animal/hostile", {
	cap_color: "#ffffff",
	powerlevel: 0,
	bruised: 0,
	recovery_cooldown: 0,
	faint_ticker: 0,
	attack_same: 2,
	stat_attack: 2,
	robust_searching: 1,
	name: "walking mushroom",
	desc: "It's a massive mushroom... with legs?",
	icon_state: "mushroom_color",
	icon_living: "mushroom_color",
	icon_dead: "mushroom_dead",
	speak_chance: 0,
	turns_per_move: 1,
	maxHealth: 10,
	health: 10,
	butcher_results: null,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "whacks",
	harm_intent_damage: 5,
	obj_damage: 0,
	melee_damage_lower: 1,
	melee_damage_upper: 1,
	attacktext: "chomps",
	attack_sound: rt.rsc("sound/weapons/bite.ogg"),
	faction: null,
	environment_smash: 0,
	mouse_opacity: 1,
	speed: 1,
	ventcrawler: 2,
	unique_name: 1,
	speak_emote: null,
	deathmessage: "fainted.",
}, { global: { cap_living: 721, cap_dead: 722 } });

// mushroom.dm:11
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/hugemushroomslice"), 1]);

	this.faction = list("mushroom");

	this.speak_emote = list("squeaks");
	return f.dot;
});

// mushroom.dm:41
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.health >= this.maxHealth) {
		to_chat(user, "<span class='info'>It looks healthy.</span>");
	} else {
		to_chat(user, "<span class='info'>It looks like it's been roughed up.</span>");
	}
	return f.dot;
}, false);

// mushroom.dm:48
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/Life", function* Life(f: Frame) {
	yield* parent_proc();
	if (this.stat) return f.dot;
	yield* this.adjustBruteLoss(-2);
	return f.dot;
}, true, { waitfor: false });

// mushroom.dm:53
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/Initialize", function* Initialize(f: Frame) {
	this.melee_damage_lower += rand(3, 5);
	this.melee_damage_upper += rand(10, 20);
	this.maxHealth += rand(40, 60);
	this.move_to_delay = rand(3, 11);
	GLOB.cap_living = (GLOB.cap_living || mutable_appearance(this.icon, "mushroom_cap"));
	GLOB.cap_dead = (GLOB.cap_dead || mutable_appearance(this.icon, "mushroom_cap_dead"));
	this.cap_color = rt.op(f, "Rgb", [1, 3], [rand(0, 255), rand(0, 255), rand(0, 255)]);
	this.UpdateMushroomCap();
	this.health = this.maxHealth;
	yield* parent_proc();
	return f.dot;
}, true);

// mushroom.dm:66
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (!this.retreat_distance && prob(33)) {
		this.retreat_distance = 5;
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/simple_animal/hostile/mushroom/proc/stop_retreat"))), 30);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// mushroom.dm:72
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/stop_retreat", function stop_retreat(f: Frame) {
	this.retreat_distance = null;
	return f.dot;
});

// mushroom.dm:75
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/attack_animal", function* attack_animal(f: Frame, L: Value) {
	let M: Value = null, level_gain: Value = null;
	if (rt.istype(L, T("/mob/living/simple_animal/hostile/mushroom")) && this.stat == 2) {
		M = L;
		if (this.faint_ticker < 2) {
			M.visible_message(`${M} chews a bit on ${this}.`);
			this.faint_ticker++;
			return 1;
		}
		M.visible_message(`<span class='warning'>${M} devours ${this}!</span>`);
		if ((level_gain = this.powerlevel - M.powerlevel) >= -1 && !this.bruised && !M.ckey) {
			if (level_gain < 1) {
				level_gain = 1;
			}
			yield* M.LevelUp(level_gain);
		}
		yield* M.adjustBruteLoss(-M.maxHealth);
		yield* qdel(this);
		return 1;
	}
	return (yield* parent_proc());
}, true);

// mushroom.dm:93
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/revive", function* revive(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (!(yield* parent_proc())) return f.dot;
	this.icon_state = "mushroom_color";
	this.UpdateMushroomCap();
	f.dot = 1;
	return f.dot;
}, true, { args: ["full_heal", "admin_revive"] });

// mushroom.dm:99
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/death", function* death(f: Frame, gibbed: Value) {
	yield* parent_proc(gibbed);
	this.UpdateMushroomCap();
	return f.dot;
}, true);

// mushroom.dm:103
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/UpdateMushroomCap", function UpdateMushroomCap(f: Frame) {
	this.cut_overlays();
	GLOB.cap_living.color = this.cap_color;
	GLOB.cap_dead.color = this.cap_color;
	if (this.health == 0) {
		this.add_overlay(GLOB.cap_dead);
	} else {
		this.add_overlay(GLOB.cap_living);
	}
	return f.dot;
});

// mushroom.dm:112
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/Recover", function* Recover(f: Frame) {
	this.visible_message(`${this} slowly begins to recover.`);
	this.faint_ticker = 0;
	yield* this.revive({ full_heal: 1 });
	this.UpdateMushroomCap();
	this.recovery_cooldown = 1;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/simple_animal/hostile/mushroom/proc/recovery_recharge"))), 300);
	return f.dot;
}, true);

// mushroom.dm:123
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/LevelUp", function* LevelUp(f: Frame, level_gain: Value) {
	if (this.powerlevel <= 9) {
		this.powerlevel += level_gain;
		if (prob(25)) {
			this.melee_damage_lower += level_gain * rand(1, 5);
		} else {
			this.melee_damage_upper += level_gain * rand(1, 5);
		}
		this.maxHealth += level_gain * rand(1, 5);
	}
	yield* this.adjustBruteLoss(-this.maxHealth);
	return f.dot;
}, true);

// mushroom.dm:133
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/Bruise", function Bruise(f: Frame) {
	if (!(!this.bruised && !this.stat)) return f.dot;
	this.visible_message(`The ${this.name} was bruised!`);
	this.bruised = 1;
	return f.dot;
});

// mushroom.dm:138
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom"))) {
		if (this.stat == 2 && !this.recovery_cooldown) {
			yield* this.Recover();
			yield* qdel(I);
		} else {
			to_chat(user, `<span class='warning'>${this} won't eat it!</span>`);
		}
		return f.dot;
	}
	if (I.force) {
		this.Bruise();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// mushroom.dm:150
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/attack_hand", function* attack_hand(f: Frame, M: Value) {
	yield* parent_proc();
	if (M.a_intent != "harm") return f.dot;
	this.Bruise();
	return f.dot;
}, true);

// mushroom.dm:155
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/hitby", function* hitby(f: Frame, AM: Value) {
	let _T: Value = null;
	yield* parent_proc();
	if (!rt.istype(AM, T("/obj/item"))) return f.dot;
	if (!(_T = AM).throwforce) return f.dot;
	this.Bruise();
	return f.dot;
}, true);

// mushroom.dm:162
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/bullet_act", function* bullet_act(f: Frame) {
	yield* parent_proc();
	this.Bruise();
	return f.dot;
}, true);

// mushroom.dm:167
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/harvest", function* harvest(f: Frame) {
	let S: Value = null;
	let counter: Value = 0;
	while (counter <= this.powerlevel) {
		yield* (S = (yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/hugemushroomslice"), this.loc))).reagents.add_reagent("mushroomhallucinogen", this.powerlevel);
		yield* S.reagents.add_reagent("omnizine", this.powerlevel);
		yield* S.reagents.add_reagent("synaptizine", this.powerlevel);
		counter++;
	}
	yield* qdel(this);
	return f.dot;
}, true);
