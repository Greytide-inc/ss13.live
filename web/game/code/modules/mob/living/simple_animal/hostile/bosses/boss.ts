// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/bosses/boss.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5018, "/mob/living/simple_animal/hostile/boss", "/mob/living/simple_animal/hostile", {
	boss_abilities: null,
	atb: null,
	point_regen_delay: 1,
	robust_searching: 1,
	stat_attack: 1,
	name: "A Perfectly Generic Boss Placeholder",
	desc: "",
	status_flags: 0,
	a_intent: "harm",
	gender: "neuter",
});

// boss.dm:9
rt.def("/mob/living/simple_animal/hostile/boss/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.boss_abilities = list();
	return f.dot;
});

// boss.dm:15
rt.def("/mob/living/simple_animal/hostile/boss/proc/Initialize", function* Initialize(f: Frame) {
	let ab: Value = null, AB: Value = null;
	yield* parent_proc();
	this.atb = (yield* new_(T("/datum/boss_active_timed_battle")));
	this.atb.point_regen_delay = this.point_regen_delay;
	this.atb.boss = this;
	for (ab of each(this.boss_abilities)) {
		this.boss_abilities -= ab;
		(AB = (yield* new_(ab))).boss = this;
		yield* AB.Grant(this);
		this.boss_abilities += AB;
	}
	this.atb.assign_abilities(this.boss_abilities);
	return f.dot;
}, true);

// boss.dm:32
rt.def("/mob/living/simple_animal/hostile/boss/proc/Destroy", function* Destroy(f: Frame) {
	let ab: Value = null, AB: Value = null;
	yield* qdel(this.atb);
	this.atb = null;
	for (ab of each(this.boss_abilities)) {
		(AB = ab).boss = null;
		yield* AB.Remove(this);
		yield* qdel(AB);
	}
	this.boss_abilities.Cut();
	return (yield* parent_proc());
}, true);

rt.type(267, "/datum/action/boss", "/datum/action", {
	boss_cost: 100,
	usage_probability: 100,
	boss: null,
	needs_target: 1,
	say_when_triggered: "",
	boss_type: rt.typePath("/mob/living/simple_animal/hostile/boss"),
	check_flags: 8,
});

// boss.dm:55
rt.def("/datum/action/boss/proc/Trigger", function* Trigger(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	if (!rt.op(f, "IsType", [], [this.boss, this.boss_type])) {
		return 0;
	}
	if (!this.boss.atb) {
		return 0;
	}
	if (this.boss.atb.points < this.boss_cost) {
		return 0;
	}
	if (!this.boss.client) {
		if (this.needs_target && !this.boss.target) {
			return 0;
		}
	}
	if (!this.boss) return f.dot;
	if (this.say_when_triggered) {
		yield* this.boss.say(this.say_when_triggered);
	}
	if (this.boss.atb.spend(this.boss_cost)) return f.dot;
	return 0;
}, true);

rt.type(4155, "/datum/boss_active_timed_battle", "/datum", {
	abilities: null,
	point_regen_delay: 5,
	points: 50,
	next_point_time: 0,
	chance_to_hold_onto_points: 50,
	highest_cost: 0,
	boss: null,
});

// boss.dm:92
rt.def("/datum/boss_active_timed_battle/proc/New", function New(f: Frame) {
	parent_proc();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
});

// boss.dm:97
rt.def("/datum/boss_active_timed_battle/proc/assign_abilities", function assign_abilities(f: Frame, L: Value) {
	let ab: Value = null, AB: Value = null;
	if (!L) {
		return 0;
	}
	this.abilities = L;
	for (ab of each(this.abilities)) {
		if ((AB = ab).boss_cost > this.highest_cost) {
			this.highest_cost = AB.boss_cost;
		}
	}
	return f.dot;
});

// boss.dm:107
rt.def("/datum/boss_active_timed_battle/proc/spend", function spend(f: Frame, cost: Value) {
	if (cost <= this.points) {
		this.points = max(0, this.points - cost);
		return 1;
	}
	return 0;
});

// boss.dm:114
rt.def("/datum/boss_active_timed_battle/proc/refund", function refund(f: Frame, cost: Value) {
	this.points = min(this.points + cost, 100);
	return f.dot;
});

// boss.dm:118
rt.def("/datum/boss_active_timed_battle/proc/process", function* process(f: Frame) {
	let ab: Value = null, AB: Value = null;
	if (rt.worldTime(f) >= this.next_point_time) {
		this.next_point_time = rt.worldTime(f) + this.point_regen_delay;
		this.points = min(100, ++this.points);
	}
	if (!this.abilities) return f.dot;
	this.chance_to_hold_onto_points = this.highest_cost * 0.5;
	if (this.points != 100 && prob(this.chance_to_hold_onto_points)) {
		return f.dot;
	}
	if (this.boss.client) return f.dot;
	this.abilities = shuffle(this.abilities);
	for (ab of each(this.abilities)) {
		if (prob((AB = ab).usage_probability) && (yield* AB.Trigger())) {
			break;
		}
	}
	return f.dot;
}, true, { waitfor: false });

// boss.dm:136
rt.def("/datum/boss_active_timed_battle/proc/Destroy", function* Destroy(f: Frame) {
	this.abilities = null;
	yield* GLOB.SSobj.processing.Remove(this);
	return (yield* parent_proc());
}, true);
