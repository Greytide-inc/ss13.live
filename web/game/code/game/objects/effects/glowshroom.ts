// Based on /tg/station's code/game/objects/effects/glowshroom.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(12700, "/obj/structure/glowshroom", "/obj/structure", {
	delay: 1200,
	floor: 0,
	generation: 1,
	spreadIntoAdjacentChance: 60,
	myseed: rt.typePath("/obj/item/seeds/glowshroom"),
	anchored: 1,
	name: "glowshroom",
	desc: "Mycena Bregprox, a species of mushroom that glows in the dark.",
	opacity: 0,
	density: 0,
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "glowshroom",
	layer: 2.08,
	obj_integrity: 30,
	max_integrity: 30,
}, { global: { blacklisted_glowshroom_turfs: 799 } });

// glowshroom.dm:39
rt.def("/obj/structure/glowshroom/proc/examine", function examine(f: Frame, user: Value) {
	f.dot = parent_proc();
	to_chat(user, fmt("This is a ＀４ generation ＀!", [this.generation, this.name]));
	return f.dot;
}, false);

// glowshroom.dm:44
rt.def("/obj/structure/glowshroom/proc/Destroy", function* Destroy(f: Frame) {
	if (this.myseed) {
		yield* qdel(this.myseed);
		this.myseed = null;
	}
	return (yield* parent_proc());
}, true);

// glowshroom.dm:48
rt.def("/obj/structure/glowshroom/proc/New", function* New(f: Frame, loc: Value, newseed: Value, mutate_stats: Value) {
	let G: Value = null;
	yield* parent_proc();
	if (newseed) {
		this.myseed = (yield* newseed.Copy());
		yield* this.myseed.forceMove(this);
	} else {
		this.myseed = (yield* new_(this.myseed, this));
	}
	if (mutate_stats) {
		this.myseed.adjust_potency(rand(-3, 6));
		this.myseed.adjust_yield(rand(-1, 2));
		this.myseed.adjust_production(rand(-3, 6));
		this.myseed.adjust_endurance(rand(-3, 6));
	}
	this.delay = this.delay - this.myseed.production * 100;
	this.obj_integrity = this.myseed.endurance;
	this.max_integrity = this.myseed.endurance;
	if (this.myseed.get_gene(T("/datum/plant_gene/trait/glow"))) {
		this.set_light((G = this.myseed.get_gene(T("/datum/plant_gene/trait/glow"))).glow_range(this.myseed), G.glow_power(this.myseed), G.glow_color);
	}
	yield* this.setDir(this.CalcDir());
	let base_icon_state: Value = rt.initial(f, this, "icon_state");
	if (!this.floor) {
		if (this.dir === 1) {
			this.pixel_y = 32;
		} else if (this.dir === 2) {
			this.pixel_y = -32;
		} else if (this.dir === 4) {
			this.pixel_x = 32;
		} else if (this.dir === 8) {
			this.pixel_x = -32;
		}
		this.icon_state = `${base_icon_state}${rand(1, 3)}`;
	} else {
		this.icon_state = `${base_icon_state}f`;
	}
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/structure/glowshroom/proc/Spread"))), this.delay);
	return f.dot;
}, true);

// glowshroom.dm:84
rt.def("/obj/structure/glowshroom/proc/Spread", function* Spread(f: Frame) {
	let i: Value = null, possibleLocs: Value = null, spreadsIntoAdjacent: Value = null, earth: Value = null, newLoc: Value = null, shroomCount: Value = null, placeCount: Value = null, shroom: Value = null, wallDir: Value = null, isWall: Value = null, child: Value = null;
	let $e: any;
	let ownturf: Value = rt.getStep(f, this, 0);
	let shrooms_planted: Value = 0;
	rt.forRange(f, 0, 1, this.myseed.yield, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (prob(1 / (this.generation * this.generation) * 100)) {
			possibleLocs = list();
			spreadsIntoAdjacent = 0;
			if (prob(this.spreadIntoAdjacentChance)) {
				spreadsIntoAdjacent = 1;
			}
			earth = null;
			for (earth of each(view(3, this), T("/turf/open/floor"))) {
				if (is_type_in_typecache(earth, GLOB.blacklisted_glowshroom_turfs)) {
					continue;
				}
				if (!ownturf.CanAtmosPass(earth)) {
					continue;
				}
				if (spreadsIntoAdjacent || !rt.locateIn(f, T("/obj/structure/glowshroom"), view(1, earth))) {
					possibleLocs += earth;
				}
				if (rt.tickUsage(f) > GLOB.current_ticklimit) {
					yield* stoplag();
				}
			}
			if (!rt.len(f, possibleLocs)) {
				break;
			}
			newLoc = pick(possibleLocs);
			shroomCount = 0;
			placeCount = 1;
			shroom = null;
			for (shroom of each(newLoc, T("/obj/structure/glowshroom"))) {
				shroomCount++;
			}
			wallDir = null;
			for (wallDir of each(GLOB.cardinal)) {
				if ((isWall = rt.getStep(f, newLoc, wallDir)).density) {
					placeCount++;
				}
			}
			if (shroomCount >= placeCount) {
				continue;
			}
			(child = (yield* new_(this.type, newLoc, this.myseed, 1))).generation = this.generation + 1;
			shrooms_planted++;
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		} else {
			shrooms_planted++;
		}
	}
	rt.endFor(f, 0);
	if (!(shrooms_planted < this.myseed.yield)) return f.dot;
	this.myseed.yield -= shrooms_planted;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/structure/glowshroom/proc/Spread"))), this.delay);
	return f.dot;
}, true);

// glowshroom.dm:133
rt.def("/obj/structure/glowshroom/proc/CalcDir", function CalcDir(f: Frame, location: Value) {
	let wallDir: Value = null, newTurf: Value = null, shroom: Value = null, newDir: Value = null;
	location ??= this.loc;
	let direction: Value = 16;
	for (wallDir of each(GLOB.cardinal)) {
		if ((newTurf = rt.getStep(f, location, wallDir)).density) {
			(direction = rt.modify(direction, wallDir, rt.bitOr));
		}
	}
	for (shroom of each(location, T("/obj/structure/glowshroom"))) {
		if (shroom == this) {
			continue;
		}
		if (shroom.floor) {
			(direction = rt.modify(direction, 16777199, rt.bitAnd));
		} else {
			(direction = rt.modify(direction, rt.op(f, "BitNot", [], [shroom.dir]), rt.bitAnd));
		}
	}
	let dirList: Value = list();
	let i: Value = 1;
	while (i <= 16) {
		if (rt.bitAnd(direction, i)) {
			dirList += i;
		}
		(i = rt.modify(i, 1, rt.shiftLeft));
	}
	if (rt.len(f, dirList)) {
		if ((newDir = pick(dirList)) == 16) {
			this.floor = 1;
			newDir = 1;
		}
		return newDir;
	}
	this.floor = 1;
	return 1;
});

// glowshroom.dm:163
rt.def("/obj/structure/glowshroom/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (!(damage_type == "fire" && damage_amount)) return f.dot;
	playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 100, 1);
	return f.dot;
});

// glowshroom.dm:167
rt.def("/obj/structure/glowshroom/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	if (!(exposed_temperature > 300)) return f.dot;
	yield* this.take_damage(5, "fire", 0, 0);
	return f.dot;
}, true);

// glowshroom.dm:172
rt.def("/obj/structure/glowshroom/proc/acid_act", function* acid_act(f: Frame, acidpwr: Value, acid_volume: Value) {
	let I: Value = null;
	f.dot = 1;
	this.visible_message(`<span class='danger'>${this} melts away!</span>`);
	(I = (yield* new_(T("/obj/effect/decal/cleanable/molten_object"), rt.getStep(f, this, 0)))).desc = fmt("Looks like this was ＇！ some time ago.", [this]);
	yield* qdel(this);
	return f.dot;
}, true);
