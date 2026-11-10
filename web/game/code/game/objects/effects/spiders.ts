// Based on /tg/station's code/game/objects/effects/spiders.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(12459, "/obj/structure/spider", "/obj/structure", {
	anchored: 1,
	name: "web",
	icon: rt.rsc("icons/effects/effects.dmi"),
	desc: "it's stringy and sticky",
	density: 0,
	obj_integrity: 15,
});

// spiders.dm:13
rt.def("/obj/structure/spider/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type != "fire") return f.dot;
	playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 100, 1);
	return f.dot;
});

// spiders.dm:18
rt.def("/obj/structure/spider/proc/run_obj_armor", function run_obj_armor(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[2] == "melee") {
		const subject = f.args[1];
		if (subject === "fire") {
			f.args[0] *= 2;
		} else if (subject === "brute") {
			f.args[0] *= 0.25;
		}
	}
	f.dot = parent_proc();
	return f.dot;
}, false, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });

// spiders.dm:27
rt.def("/obj/structure/spider/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	if (!(exposed_temperature > 300)) return f.dot;
	yield* this.take_damage(5, "fire", 0, 0);
	return f.dot;
}, true);

rt.type(12462, "/obj/structure/spider/stickyweb", "/obj/structure/spider", {
	icon_state: "stickyweb1",
});

// spiders.dm:34
rt.def("/obj/structure/spider/stickyweb/proc/Initialize", function Initialize(f: Frame) {
	if (prob(50)) {
		this.icon_state = "stickyweb2";
	}
	f.dot = parent_proc();
	return f.dot;
});

// spiders.dm:39
rt.def("/obj/structure/spider/stickyweb/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	height ??= 0;
	if (height == 0) {
		return 1;
	}
	if (rt.istype(mover, T("/mob/living/simple_animal/hostile/poison/giant_spider"))) {
		return 1;
	} else if (rt.istype(mover, T("/mob/living"))) {
		if (prob(50)) {
			to_chat(mover, fmt("<span class='danger'>You get stuck in ％！ for a moment.</span>", [this]));
			return 0;
		}
	} else if (rt.istype(mover, T("/obj/item/projectile"))) {
		return prob(30);
	}
	return 1;
});

rt.type(12463, "/obj/structure/spider/eggcluster", "/obj/structure/spider", {
	amount_grown: 0,
	player_spiders: 0,
	poison_type: "toxin",
	poison_per_bite: 5,
	faction: null,
	name: "egg cluster",
	desc: "They seem to pulse slightly with an inner life",
	icon_state: "eggs",
});

// spiders.dm:58
rt.def("/obj/structure/spider/eggcluster/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.faction = list("spiders");
	return f.dot;
});

// spiders.dm:61
rt.def("/obj/structure/spider/eggcluster/proc/Initialize", function Initialize(f: Frame) {
	this.pixel_x = rand(3, -3);
	this.pixel_y = rand(3, -3);
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	f.dot = parent_proc();
	return f.dot;
});

// spiders.dm:67
rt.def("/obj/structure/spider/eggcluster/proc/process", function* process(f: Frame) {
	let S: Value = null;
	if (!((this.amount_grown += rand(0, 2)) >= 100)) return f.dot;
	let num: Value = rand(3, 12);
	let i: Value = 0;
	while (i < num) {
		(S = (yield* new_(T("/obj/structure/spider/spiderling"), this.loc))).poison_type = this.poison_type;
		S.poison_per_bite = this.poison_per_bite;
		S.faction = (yield* this.faction.Copy());
		if (this.player_spiders) {
			S.player_spiders = 1;
		}
		i++;
	}
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

rt.type(12464, "/obj/structure/spider/spiderling", "/obj/structure/spider", {
	amount_grown: 0,
	grow_as: null,
	entry_vent: null,
	travelling_in_vent: 0,
	player_spiders: 0,
	poison_type: "toxin",
	poison_per_bite: 5,
	faction: null,
	anchored: 0,
	name: "spiderling",
	desc: "It never stays still for long.",
	icon_state: "spiderling",
	layer: 2.75,
	obj_integrity: 3,
});

// spiders.dm:93
rt.def("/obj/structure/spider/spiderling/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.faction = list("spiders");
	return f.dot;
});

// spiders.dm:96
rt.def("/obj/structure/spider/spiderling/proc/Initialize", function Initialize(f: Frame) {
	this.pixel_x = rand(6, -6);
	this.pixel_y = rand(6, -6);
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	f.dot = parent_proc();
	return f.dot;
});

// spiders.dm:108
rt.def("/obj/structure/spider/spiderling/proc/Bump", function* Bump(f: Frame, user: Value) {
	if (rt.istype(user, T("/obj/structure/table"))) {
		this.loc = user.loc;
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// spiders.dm:115
rt.def("/obj/structure/spider/spiderling/proc/process", function* process(f: Frame) {
	let vents: Value = null, entry_vent_parent: Value = null, temp_vent: Value = null, exit_vent: Value = null, travel_time: Value = null, new_area: Value = null, nearby: Value = null, target_atom: Value = null, v: Value = null, S: Value = null;
	if (this.travelling_in_vent) {
		if (isturf(this.loc)) {
			this.travelling_in_vent = 0;
			this.entry_vent = null;
		}
	} else if (this.entry_vent) {
		if (get_dist(this, this.entry_vent) <= 1) {
			vents = list();
			entry_vent_parent = rt.index(this.entry_vent.parents, 1);
			for (temp_vent of each(entry_vent_parent.other_atmosmch, T("/obj/machinery/atmospherics/components/unary/vent_pump"))) {
				vents.Add(temp_vent);
			}
			if (!rt.len(f, vents)) {
				this.entry_vent = null;
				return f.dot;
			}
			exit_vent = pick(vents);
			if (prob(50)) {
				this.visible_message(`<B>${this} scrambles into the ventillation ducts!</B>`, "<span class='italics'>You hear something scampering through the ventilation ducts.</span>");
			}
			rt.spawnTail(f, rand(20, 60), "/obj/structure/spider/spiderling/proc/process: spawn at game/objects/effects/spiders.dm:129", vents, entry_vent_parent, temp_vent, exit_vent, travel_time, new_area, nearby, target_atom, v, S);
		}
	} else if (prob(33)) {
		if (rt.len(f, (nearby = oview(10, this)))) {
			target_atom = pick(nearby);
			walk_to(this, target_atom);
			if (prob(40)) {
				this.visible_message(fmt("<span class='notice'>＄！ skitters＀.</span>", [this, pick(" away", " around", "")]));
			}
		}
	} else if (prob(10)) {
		for (v of each(view(7, this), T("/obj/machinery/atmospherics/components/unary/vent_pump"))) {
			if (!v.welded) {
				this.entry_vent = v;
				walk_to(this, this.entry_vent, 1);
				break;
			}
		}
	}
	if (!isturf(this.loc)) return f.dot;
	if (!((this.amount_grown += rand(0, 2)) >= 100)) return f.dot;
	if (!this.grow_as) {
		this.grow_as = pick(T("/mob/living/simple_animal/hostile/poison/giant_spider"), T("/mob/living/simple_animal/hostile/poison/giant_spider/hunter"), T("/mob/living/simple_animal/hostile/poison/giant_spider/nurse"));
	}
	(S = (yield* new_(this.grow_as, this.loc))).poison_per_bite = this.poison_per_bite;
	S.poison_type = this.poison_type;
	S.faction = (yield* this.faction.Copy());
	if (this.player_spiders) {
		S.playable_spider = 1;
		yield* notify_ghosts(`Spider ${S.name} can be controlled`, null, { enter_link: fmt("<a href=?src=＃;activate=1>(Click to play)</a>", [S]), source: S, action: "attack" });
	}
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

// a spawn((yield* g.call(f, P("/proc/rand"), null, [20, 60]))) body of /obj/structure/spider/spiderling/proc/process, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/structure/spider/spiderling/proc/process: spawn at game/objects/effects/spiders.dm:129", function* (f: Frame, vents: Value, entry_vent_parent: Value, temp_vent: Value, exit_vent: Value, travel_time: Value, new_area: Value, nearby: Value, target_atom: Value, v: Value, S: Value) {
	this.loc = exit_vent;
	rt.spawnTail(f, (travel_time = round(get_dist(this.loc, exit_vent.loc) / 2)), "/obj/structure/spider/spiderling/proc/process: spawn at game/objects/effects/spiders.dm:134", vents, entry_vent_parent, temp_vent, exit_vent, travel_time, new_area, nearby, target_atom, v, S);
	return null;
});

// a spawn((travel_time = (yield* g.call(f, P("/proc/round"), null, [divide((yield* g.call(f, P("/proc/get_dist"), null, [rt.srcVarI(f, $ic[35]), rt.fieldI(f, live(exit_vent), $ic[36])])), 2)])))) body of /obj/structure/spider/spiderling/proc/process, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/structure/spider/spiderling/proc/process: spawn at game/objects/effects/spiders.dm:134", function* (f: Frame, vents: Value, entry_vent_parent: Value, temp_vent: Value, exit_vent: Value, travel_time: Value, new_area: Value, nearby: Value, target_atom: Value, v: Value, S: Value) {
	if (!exit_vent || exit_vent.welded) {
		this.loc = this.entry_vent;
		this.entry_vent = null;
		return f.dot;
	}
	if (prob(50)) {
		this.audible_message("<span class='italics'>You hear something scampering through the ventilation ducts.</span>");
	}
	yield* sleep(travel_time);
	if (!exit_vent || exit_vent.welded) {
		this.loc = this.entry_vent;
		this.entry_vent = null;
		return f.dot;
	}
	this.loc = exit_vent.loc;
	this.entry_vent = null;
	if (new_area = get_area(this.loc)) {
		yield* new_area.Entered(this);
	}
	return null;
});

rt.type(12460, "/obj/structure/spider/cocoon", "/obj/structure/spider", {
	name: "cocoon",
	desc: "Something wrapped in silky spider web",
	icon_state: "cocoon1",
	obj_integrity: 60,
});

// spiders.dm:194
rt.def("/obj/structure/spider/cocoon/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = pick("cocoon1", "cocoon2", "cocoon3");
	f.dot = parent_proc();
	return f.dot;
});

// spiders.dm:199
rt.def("/obj/structure/spider/cocoon/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	let breakout_time: Value = 1;
	user.changeNext_move(100);
	user.last_special = rt.worldTime(f) + 100;
	to_chat(user, `<span class='notice'>You struggle against the tight bonds... (This will take about ${breakout_time} minutes.)</span>`);
	this.visible_message(fmt("You see something struggling and writhing in ％！!", [this]));
	if (!(yield* do_after(user, breakout_time * 60 * 10, { target: this }))) return f.dot;
	if (!user || user.stat != 0 || user.loc != this) {
		return f.dot;
	}
	yield* qdel(this);
	return f.dot;
}, true);

// spiders.dm:211
rt.def("/obj/structure/spider/cocoon/proc/Destroy", function* Destroy(f: Frame) {
	let A: Value = null;
	let _T: Value = rt.getStep(f, this, 0);
	this.visible_message(fmt("<span class='warning'>＄！ splits open.</span>", [this]));
	for (A of each(this.contents, T("/atom/movable"))) {
		yield* A.forceMove(_T);
	}
	return (yield* parent_proc());
}, true);
