// From code/modules/research/designs/limbgrower_designs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(3141, "/datum/design/leftarm", "/datum/design", {
	name: "Left Arm",
	id: "leftarm",
	build_type: 64,
	reagents_list: null,
	category: null,
	build_path: rt.typePath("/obj/item/bodypart/l_arm"),
});

// /datum/design/leftarm/proc/<init>  (code/modules/research/designs/limbgrower_designs.dm:9)
rt.def("/datum/design/leftarm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagents_list", rt.alist(f, ["synthflesh", 25]));
	rt.setSv(f, "category", rt.list("initial", "human", "lizard", "plasmaman"));
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

// /datum/design/rightarm/proc/<init>  (code/modules/research/designs/limbgrower_designs.dm:17)
rt.def("/datum/design/rightarm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagents_list", rt.alist(f, ["synthflesh", 25]));
	rt.setSv(f, "category", rt.list("initial", "human", "lizard", "plasmaman"));
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

// /datum/design/leftleg/proc/<init>  (code/modules/research/designs/limbgrower_designs.dm:25)
rt.def("/datum/design/leftleg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagents_list", rt.alist(f, ["synthflesh", 25]));
	rt.setSv(f, "category", rt.list("initial", "human", "lizard", "plasmaman"));
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

// /datum/design/rightleg/proc/<init>  (code/modules/research/designs/limbgrower_designs.dm:33)
rt.def("/datum/design/rightleg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagents_list", rt.alist(f, ["synthflesh", 25]));
	rt.setSv(f, "category", rt.list("initial", "human", "lizard", "plasmaman"));
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

// /datum/design/armblade/proc/<init>  (code/modules/research/designs/limbgrower_designs.dm:41)
rt.def("/datum/design/armblade/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagents_list", rt.alist(f, ["synthflesh", 75]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("special"));
	return f.dot;
});
