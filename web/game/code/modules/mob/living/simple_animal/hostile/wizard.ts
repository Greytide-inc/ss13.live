// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/wizard.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4997, "/mob/living/simple_animal/hostile/wizard", "/mob/living/simple_animal/hostile", {
	fireball: null,
	blink: null,
	mm: null,
	next_cast: 0,
	retreat_distance: 3,
	minimum_distance: 3,
	name: "Space Wizard",
	desc: "EI NATH?",
	icon: rt.rsc("icons/mob/simple_human.dmi"),
	icon_state: "wizard",
	icon_living: "wizard",
	icon_dead: "wizard_dead",
	speak_chance: 0,
	turns_per_move: 3,
	response_help: "pokes",
	response_disarm: "shoves",
	response_harm: "hits",
	speed: 0,
	maxHealth: 100,
	health: 100,
	harm_intent_damage: 5,
	melee_damage_lower: 5,
	melee_damage_upper: 5,
	attacktext: "punches",
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	a_intent: "harm",
	atmos_requirements: null,
	unsuitable_atmos_damage: 15,
	faction: null,
	status_flags: 8,
	del_on_death: 1,
	loot: null,
});

// wizard.dm:22
rt.def("/mob/living/simple_animal/hostile/wizard/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.atmos_requirements = rt.alist(f, ["min_oxy", 5, "max_oxy", 0, "min_tox", 0, "max_tox", 1, "min_co2", 0, "max_co2", 5, "min_n2", 0, "max_n2", 0]);

	this.faction = list("wizard");

	this.loot = list(T("/obj/effect/mob_spawn/human/corpse/wizard"), T("/obj/item/weapon/staff"));
	return f.dot;
});

// wizard.dm:40
rt.def("/mob/living/simple_animal/hostile/wizard/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.fireball = (yield* new_(T("/obj/effect/proc_holder/spell/aimed/fireball")));
	this.fireball.clothes_req = 0;
	this.fireball.human_req = 0;
	this.fireball.player_lock = 0;
	yield* this.AddSpell(this.fireball);
	this.implants += (yield* new_(T("/obj/item/weapon/implant/exile"), this));
	this.mm = (yield* new_(T("/obj/effect/proc_holder/spell/targeted/projectile/magic_missile")));
	this.mm.clothes_req = 0;
	this.mm.human_req = 0;
	this.mm.player_lock = 0;
	yield* this.AddSpell(this.mm);
	this.blink = (yield* new_(T("/obj/effect/proc_holder/spell/targeted/turf_teleport/blink")));
	this.blink.clothes_req = 0;
	this.blink.human_req = 0;
	this.blink.player_lock = 0;
	this.blink.outer_tele_radius = 3;
	yield* this.AddSpell(this.blink);
	return f.dot;
}, true);

// wizard.dm:62
rt.def("/mob/living/simple_animal/hostile/wizard/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!(this.target && this.next_cast < rt.worldTime(f))) return f.dot;
	if (rt.isIn(f, rt.getDir(f, this, this.target), list(2, 4, 8, 1)) && (yield* this.fireball.cast_check(0, this))) {
		yield* this.setDir(rt.getDir(f, this, this.target));
		yield* this.fireball.perform(list(this.target), { user: this });
		this.next_cast = rt.worldTime(f) + 10;
		return f.dot;
	}
	if (yield* this.mm.cast_check(0, this)) {
		yield* this.mm.choose_targets(this);
		this.next_cast = rt.worldTime(f) + 10;
		return f.dot;
	}
	if (!(yield* this.blink.cast_check(0, this))) return f.dot;
	yield* this.blink.choose_targets(this);
	this.next_cast = rt.worldTime(f) + 10;
	return f.dot;
}, true, { waitfor: false });
