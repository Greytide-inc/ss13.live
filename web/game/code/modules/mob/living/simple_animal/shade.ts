// Based on /tg/station's code/modules/mob/living/simple_animal/shade.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(5077, "/mob/living/simple_animal/shade", "/mob/living/simple_animal", {
	initial_language_holder: rt.typePath("/datum/language_holder/construct"),
	name: "Shade",
	real_name: "Shade",
	desc: "A bound spirit",
	gender: "plural",
	icon: rt.rsc("icons/mob/mob.dmi"),
	icon_state: "shade",
	icon_living: "shade",
	maxHealth: 50,
	health: 50,
	healable: 0,
	speak_emote: null,
	emote_hear: null,
	response_help: "puts their hand through",
	response_disarm: "flails at",
	response_harm: "punches",
	speak_chance: 1,
	melee_damage_lower: 5,
	melee_damage_upper: 15,
	attacktext: "metaphysically strikes",
	minbodytemp: 0,
	maxbodytemp: 1e+31,
	atmos_requirements: null,
	speed: -1,
	stop_automated_movement: 1,
	status_flags: 8,
	faction: null,
	movement_type: 2,
	loot: null,
	del_on_death: 1,
});

// shade.dm:12
rt.def("/mob/living/simple_animal/shade/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("hisses");
	this.emote_hear = list("wails.", "screeches.");
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);

	this.faction = list("cult");

	this.loot = list(T("/obj/item/weapon/ectoplasm"));
	return f.dot;
});

// shade.dm:35
rt.def("/mob/living/simple_animal/shade/proc/death", function* death(f: Frame) {
	this.deathmessage = `lets out a contented sigh as ${this.p_their()} form unwinds.`;
	yield* parent_proc();
	return f.dot;
}, true);

// shade.dm:39
rt.def("/mob/living/simple_animal/shade/proc/canSuicide", function canSuicide(f: Frame) {
	if (rt.istype(this.loc, T("/obj/item/device/soulstone"))) {
		return 0;
	}
	return parent_proc();
});

// shade.dm:47
rt.def("/mob/living/simple_animal/shade/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	let C: Value = null;
	if (rt.istype(M, T("/mob/living/simple_animal/hostile/construct"))) {
		if (!(C = M).can_repair_constructs) {
			return f.dot;
		}
		if (this.health < this.maxHealth) {
			yield* this.adjustHealth(-25);
			yield* this.Beam(M, { icon_state: "sendbeam", time: 4 });
			M.visible_message(fmt("<span class='danger'>＀ heals ％<b>！</b>.</span>", [M, this]), `<span class='cult'>You heal <b>${this}</b>, leaving <b>${this}</b> at <b>${this.health}/${this.maxHealth}</b> health.</span>`);
		} else {
			to_chat(M, `<span class='cult'>You cannot heal <b>${this}</b>, as ${this.p_they()} ${this.p_are()} unharmed!</span>`);
		}
	} else {
		if (this == M) return f.dot;
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// shade.dm:62
rt.def("/mob/living/simple_animal/shade/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let SS: Value = null;
	if (rt.istype(O, T("/obj/item/device/soulstone"))) {
		yield* (SS = O).transfer_soul("SHADE", this, user);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);
