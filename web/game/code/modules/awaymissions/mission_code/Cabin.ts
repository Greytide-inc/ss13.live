// Based on /tg/station's code/modules/awaymissions/mission_code/Cabin.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12935, "/obj/structure/firepit", "/obj/structure", {
	active: 1,
	name: "firepit",
	desc: "warm and toasty",
	icon: rt.rsc("icons/obj/fireplace.dmi"),
	icon_state: "firepit-active",
	density: 0,
});

// Cabin.dm:11
rt.def("/obj/structure/firepit/proc/Initialize", function Initialize(f: Frame) {
	parent_proc();
	this.toggleFirepit();
	return f.dot;
});

// Cabin.dm:17
rt.def("/obj/structure/firepit/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.active) {
		this.active = 0;
		this.toggleFirepit();
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// Cabin.dm:22
rt.def("/obj/structure/firepit/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let msg: Value = null;
	if (!this.active) {
		if (msg = (yield* W.ignition_effect(this, user))) {
			this.active = 1;
			this.visible_message(msg);
			this.toggleFirepit();
		} else {
			return (yield* parent_proc());
		}
	} else {
		yield* W.fire_act();
	}
	return f.dot;
}, true);

// Cabin.dm:35
rt.def("/obj/structure/firepit/proc/toggleFirepit", function toggleFirepit(f: Frame) {
	if (this.active) {
		this.set_light(8);
		this.icon_state = "firepit-active";
	} else {
		this.set_light(0);
		this.icon_state = "firepit";
	}
	return f.dot;
});

// Cabin.dm:44
rt.def("/obj/structure/firepit/proc/extinguish", function extinguish(f: Frame) {
	if (!this.active) return f.dot;
	this.active = 0;
	this.toggleFirepit();
	return f.dot;
});

// Cabin.dm:47
rt.def("/obj/structure/firepit/proc/fire_act", function fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	if (this.active) return f.dot;
	this.active = 1;
	this.toggleFirepit();
	return f.dot;
});

rt.type(10816, "/obj/machinery/recycler/lumbermill", "/obj/machinery/recycler", {
	emagged: 2,
	item_recycle_sound: rt.rsc("sound/weapons/chainsawhit.ogg"),
	name: "lumbermill saw",
	desc: "Faster then the cartoons!",
});

// Cabin.dm:62
rt.def("/obj/machinery/recycler/lumbermill/proc/recycle_item", function* recycle_item(f: Frame, L: Value) {
	let potency: Value = null;
	if (!rt.istype(L, T("/obj/item/weapon/grown/log"))) {
		return f.dot;
	} else {
		potency = L.seed.potency;
		yield* parent_proc();
		yield* new_(L.plank_type, this.loc, 1 + round(potency / 25));
	}
	return f.dot;
}, true);

rt.type(5071, "/mob/living/simple_animal/chicken/rabbit/normal", "/mob/living/simple_animal/chicken/rabbit", {
	icon_state: "b_rabbit",
	icon_living: "b_rabbit",
	icon_dead: "b_rabbit_dead",
	icon_prefix: "b_rabbit",
	minbodytemp: 0,
	eggsleft: 0,
	speak: null,
	egg_type: null,
});

// Cabin.dm:77
rt.def("/mob/living/simple_animal/chicken/rabbit/normal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak = list();
	return f.dot;
});

rt.type(1868, "/datum/mapGenerator/snowy", "/datum/mapGenerator", {
	modules: null,
});

// Cabin.dm:81
rt.def("/datum/mapGenerator/snowy/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.modules = list(T("/datum/mapGeneratorModule/bottomlayer/snow"), T("/datum/mapGeneratorModule/snow/pineTrees"), T("/datum/mapGeneratorModule/snow/deadTrees"), T("/datum/mapGeneratorModule/snow/randBushes"), T("/datum/mapGeneratorModule/snow/randIceRocks"), T("/datum/mapGeneratorModule/snow/bunnies"));
	return f.dot;
});

rt.type(1900, "/datum/mapGeneratorModule/snow", "/datum/mapGeneratorModule", {});

// Cabin.dm:89
rt.def("/datum/mapGeneratorModule/snow/proc/checkPlaceAtom", function checkPlaceAtom(f: Frame, _T: Value) {
	if (rt.istype(_T, T("/turf/open/floor/plating/asteroid/snow"))) {
		return parent_proc(_T);
	}
	return 0;
});

rt.type(1907, "/datum/mapGeneratorModule/bottomlayer/snow", "/datum/mapGeneratorModule/bottomlayer", {
	spawnableTurfs: null,
});

// Cabin.dm:94
rt.def("/datum/mapGeneratorModule/bottomlayer/snow/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableTurfs = rt.alist(f, [T("/turf/open/floor/plating/asteroid/snow/atmosphere"), 100]);
	return f.dot;
});

rt.type(1901, "/datum/mapGeneratorModule/snow/pineTrees", "/datum/mapGeneratorModule/snow", {
	spawnableAtoms: null,
});

// Cabin.dm:97
rt.def("/datum/mapGeneratorModule/snow/pineTrees/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableAtoms = rt.alist(f, [T("/obj/structure/flora/tree/pine"), 30]);
	return f.dot;
});

rt.type(1902, "/datum/mapGeneratorModule/snow/deadTrees", "/datum/mapGeneratorModule/snow", {
	spawnableAtoms: null,
});

// Cabin.dm:100
rt.def("/datum/mapGeneratorModule/snow/deadTrees/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableAtoms = rt.alist(f, [T("/obj/structure/flora/tree/dead"), 10]);
	return f.dot;
});

rt.type(1903, "/datum/mapGeneratorModule/snow/randBushes", "/datum/mapGeneratorModule/snow", {
	spawnableAtoms: null,
});

// Cabin.dm:103
rt.def("/datum/mapGeneratorModule/snow/randBushes/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableAtoms = list();
	return f.dot;
});

// Cabin.dm:106
rt.def("/datum/mapGeneratorModule/snow/randBushes/proc/New", function New(f: Frame) {
	let i: Value = null;
	parent_proc();
	this.spawnableAtoms = typesof(T("/obj/structure/flora/ausbushes"));
	for (i of each(this.spawnableAtoms)) {
		rt.setAt(this.spawnableAtoms, i, 1);
	}
	return f.dot;
});

rt.type(1904, "/datum/mapGeneratorModule/snow/bunnies", "/datum/mapGeneratorModule/snow", {
	spawnableAtoms: null,
});

// Cabin.dm:113
rt.def("/datum/mapGeneratorModule/snow/bunnies/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableAtoms = rt.alist(f, [T("/mob/living/simple_animal/chicken/rabbit"), 0.5]);
	return f.dot;
});

rt.type(1905, "/datum/mapGeneratorModule/snow/randIceRocks", "/datum/mapGeneratorModule/snow", {
	spawnableAtoms: null,
});

// Cabin.dm:116
rt.def("/datum/mapGeneratorModule/snow/randIceRocks/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spawnableAtoms = rt.alist(f, [T("/obj/structure/flora/rock/icy"), 5, T("/obj/structure/flora/rock/pile/icy"), 5]);
	return f.dot;
});
