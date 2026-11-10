// Based on /tg/station's code/modules/research/designs/limbgrower_designs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(3141, "/datum/design/leftarm", "/datum/design", {
	name: "Left Arm",
	id: "leftarm",
	build_type: 64,
	reagents_list: null,
	category: null,
	build_path: rt.typePath("/obj/item/bodypart/l_arm"),
});

// limbgrower_designs.dm:9
rt.def("/datum/design/leftarm/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagents_list = rt.alist(f, ["synthflesh", 25]);
	this.category = list("initial", "human", "lizard", "plasmaman");
	return f.dot;
});

rt.type(3142, "/datum/design/rightarm", "/datum/design", {
	name: "Right Arm",
	id: "rightarm",
	build_type: 64,
	reagents_list: null,
	category: null,
	build_path: rt.typePath("/obj/item/bodypart/r_arm"),
});

// limbgrower_designs.dm:17
rt.def("/datum/design/rightarm/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagents_list = rt.alist(f, ["synthflesh", 25]);
	this.category = list("initial", "human", "lizard", "plasmaman");
	return f.dot;
});

rt.type(3143, "/datum/design/leftleg", "/datum/design", {
	name: "Left Leg",
	id: "leftleg",
	build_type: 64,
	reagents_list: null,
	category: null,
	build_path: rt.typePath("/obj/item/bodypart/l_leg"),
});

// limbgrower_designs.dm:25
rt.def("/datum/design/leftleg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagents_list = rt.alist(f, ["synthflesh", 25]);
	this.category = list("initial", "human", "lizard", "plasmaman");
	return f.dot;
});

rt.type(3144, "/datum/design/rightleg", "/datum/design", {
	name: "Right Leg",
	id: "rightleg",
	build_type: 64,
	reagents_list: null,
	category: null,
	build_path: rt.typePath("/obj/item/bodypart/r_leg"),
});

// limbgrower_designs.dm:33
rt.def("/datum/design/rightleg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagents_list = rt.alist(f, ["synthflesh", 25]);
	this.category = list("initial", "human", "lizard", "plasmaman");
	return f.dot;
});

rt.type(3145, "/datum/design/armblade", "/datum/design", {
	name: "Arm Blade",
	id: "armblade",
	build_type: 64,
	reagents_list: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/melee/synthetic_arm_blade"),
});

// limbgrower_designs.dm:41
rt.def("/datum/design/armblade/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.reagents_list = rt.alist(f, ["synthflesh", 75]);

	this.category = list("special");
	return f.dot;
});
