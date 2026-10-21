// From code/modules/research/designs/mechfabricator_designs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(3171, "/datum/design/borg_suit", "/datum/design", {
	name: "Cyborg Endoskeleton",
	id: "borg_suit",
	build_type: 16,
	materials: null,
	construction_time: 500,
	category: null,
	build_path: rt.typePath("/obj/item/robot_suit"),
});

// /datum/design/borg_suit/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:7)
rt.def("/datum/design/borg_suit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Cyborg"));
	return f.dot;
});

rt.type(3172, "/datum/design/borg_chest", "/datum/design", {
	name: "Cyborg Torso",
	id: "borg_chest",
	build_type: 16,
	materials: null,
	construction_time: 350,
	category: null,
	build_path: rt.typePath("/obj/item/bodypart/chest/robot"),
});

// /datum/design/borg_chest/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:16)
rt.def("/datum/design/borg_chest/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 40000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Cyborg"));
	return f.dot;
});

rt.type(3173, "/datum/design/borg_head", "/datum/design", {
	name: "Cyborg Head",
	id: "borg_head",
	build_type: 16,
	materials: null,
	construction_time: 350,
	category: null,
	build_path: rt.typePath("/obj/item/bodypart/head/robot"),
});

// /datum/design/borg_head/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:25)
rt.def("/datum/design/borg_head/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 5000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Cyborg"));
	return f.dot;
});

rt.type(3174, "/datum/design/borg_l_arm", "/datum/design", {
	name: "Cyborg Left Arm",
	id: "borg_l_arm",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/bodypart/l_arm/robot"),
});

// /datum/design/borg_l_arm/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:34)
rt.def("/datum/design/borg_l_arm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Cyborg"));
	return f.dot;
});

rt.type(3175, "/datum/design/borg_r_arm", "/datum/design", {
	name: "Cyborg Right Arm",
	id: "borg_r_arm",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/bodypart/r_arm/robot"),
});

// /datum/design/borg_r_arm/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:43)
rt.def("/datum/design/borg_r_arm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Cyborg"));
	return f.dot;
});

rt.type(3176, "/datum/design/borg_l_leg", "/datum/design", {
	name: "Cyborg Left Leg",
	id: "borg_l_leg",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/bodypart/l_leg/robot"),
});

// /datum/design/borg_l_leg/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:52)
rt.def("/datum/design/borg_l_leg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Cyborg"));
	return f.dot;
});

rt.type(3177, "/datum/design/borg_r_leg", "/datum/design", {
	name: "Cyborg Right Leg",
	id: "borg_r_leg",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/bodypart/r_leg/robot"),
});

// /datum/design/borg_r_leg/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:61)
rt.def("/datum/design/borg_r_leg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Cyborg"));
	return f.dot;
});

rt.type(3178, "/datum/design/ripley_chassis", "/datum/design", {
	name: "Exosuit Chassis (APLU \"Ripley\")",
	id: "ripley_chassis",
	build_type: 16,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/chassis/ripley"),
});

// /datum/design/ripley_chassis/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:71)
rt.def("/datum/design/ripley_chassis/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Ripley"));
	return f.dot;
});

rt.type(3179, "/datum/design/firefighter_chassis", "/datum/design", {
	name: "Exosuit Chassis (APLU \"Firefighter\")",
	id: "firefighter_chassis",
	build_type: 16,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/chassis/firefighter"),
});

// /datum/design/firefighter_chassis/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:81)
rt.def("/datum/design/firefighter_chassis/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Firefighter"));
	return f.dot;
});

rt.type(3180, "/datum/design/ripley_torso", "/datum/design", {
	name: "Exosuit Torso (APLU \"Ripley\")",
	id: "ripley_torso",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/ripley_torso"),
});

// /datum/design/ripley_torso/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:90)
rt.def("/datum/design/ripley_torso/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000, "$glass", 7500]));
	rt.setSv(f, "category", rt.list("Ripley", "Firefighter"));
	return f.dot;
});

rt.type(3181, "/datum/design/ripley_left_arm", "/datum/design", {
	name: "Exosuit Left Arm (APLU \"Ripley\")",
	id: "ripley_left_arm",
	build_type: 16,
	materials: null,
	construction_time: 150,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/ripley_left_arm"),
});

// /datum/design/ripley_left_arm/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:99)
rt.def("/datum/design/ripley_left_arm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000]));
	rt.setSv(f, "category", rt.list("Ripley", "Firefighter"));
	return f.dot;
});

rt.type(3182, "/datum/design/ripley_right_arm", "/datum/design", {
	name: "Exosuit Right Arm (APLU \"Ripley\")",
	id: "ripley_right_arm",
	build_type: 16,
	materials: null,
	construction_time: 150,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/ripley_right_arm"),
});

// /datum/design/ripley_right_arm/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:108)
rt.def("/datum/design/ripley_right_arm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000]));
	rt.setSv(f, "category", rt.list("Ripley", "Firefighter"));
	return f.dot;
});

rt.type(3183, "/datum/design/ripley_left_leg", "/datum/design", {
	name: "Exosuit Left Leg (APLU \"Ripley\")",
	id: "ripley_left_leg",
	build_type: 16,
	materials: null,
	construction_time: 150,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/ripley_left_leg"),
});

// /datum/design/ripley_left_leg/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:117)
rt.def("/datum/design/ripley_left_leg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000]));
	rt.setSv(f, "category", rt.list("Ripley", "Firefighter"));
	return f.dot;
});

rt.type(3184, "/datum/design/ripley_right_leg", "/datum/design", {
	name: "Exosuit Right Leg (APLU \"Ripley\")",
	id: "ripley_right_leg",
	build_type: 16,
	materials: null,
	construction_time: 150,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/ripley_right_leg"),
});

// /datum/design/ripley_right_leg/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:126)
rt.def("/datum/design/ripley_right_leg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000]));
	rt.setSv(f, "category", rt.list("Ripley", "Firefighter"));
	return f.dot;
});

rt.type(3185, "/datum/design/odysseus_chassis", "/datum/design", {
	name: "Exosuit Chassis (\"Odysseus\")",
	id: "odysseus_chassis",
	build_type: 16,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/chassis/odysseus"),
});

// /datum/design/odysseus_chassis/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:136)
rt.def("/datum/design/odysseus_chassis/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Odysseus"));
	return f.dot;
});

rt.type(3186, "/datum/design/odysseus_torso", "/datum/design", {
	name: "Exosuit Torso (\"Odysseus\")",
	id: "odysseus_torso",
	build_type: 16,
	materials: null,
	construction_time: 180,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/odysseus_torso"),
});

// /datum/design/odysseus_torso/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:145)
rt.def("/datum/design/odysseus_torso/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 12000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Odysseus"));
	return f.dot;
});

rt.type(3187, "/datum/design/odysseus_head", "/datum/design", {
	name: "Exosuit Head (\"Odysseus\")",
	id: "odysseus_head",
	build_type: 16,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/odysseus_head"),
});

// /datum/design/odysseus_head/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:154)
rt.def("/datum/design/odysseus_head/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 6000, "$glass", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Odysseus"));
	return f.dot;
});

rt.type(3188, "/datum/design/odysseus_left_arm", "/datum/design", {
	name: "Exosuit Left Arm (\"Odysseus\")",
	id: "odysseus_left_arm",
	build_type: 16,
	materials: null,
	construction_time: 120,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/odysseus_left_arm"),
});

// /datum/design/odysseus_left_arm/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:163)
rt.def("/datum/design/odysseus_left_arm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 6000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Odysseus"));
	return f.dot;
});

rt.type(3189, "/datum/design/odysseus_right_arm", "/datum/design", {
	name: "Exosuit Right Arm (\"Odysseus\")",
	id: "odysseus_right_arm",
	build_type: 16,
	materials: null,
	construction_time: 120,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/odysseus_right_arm"),
});

// /datum/design/odysseus_right_arm/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:172)
rt.def("/datum/design/odysseus_right_arm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 6000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Odysseus"));
	return f.dot;
});

rt.type(3190, "/datum/design/odysseus_left_leg", "/datum/design", {
	name: "Exosuit Left Leg (\"Odysseus\")",
	id: "odysseus_left_leg",
	build_type: 16,
	materials: null,
	construction_time: 130,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/odysseus_left_leg"),
});

// /datum/design/odysseus_left_leg/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:181)
rt.def("/datum/design/odysseus_left_leg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 7000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Odysseus"));
	return f.dot;
});

rt.type(3191, "/datum/design/odysseus_right_leg", "/datum/design", {
	name: "Exosuit Right Leg (\"Odysseus\")",
	id: "odysseus_right_leg",
	build_type: 16,
	materials: null,
	construction_time: 130,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/odysseus_right_leg"),
});

// /datum/design/odysseus_right_leg/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:190)
rt.def("/datum/design/odysseus_right_leg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 7000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Odysseus"));
	return f.dot;
});

rt.type(3192, "/datum/design/gygax_chassis", "/datum/design", {
	name: "Exosuit Chassis (\"Gygax\")",
	id: "gygax_chassis",
	build_type: 16,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/chassis/gygax"),
});

// /datum/design/gygax_chassis/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:210)
rt.def("/datum/design/gygax_chassis/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Gygax"));
	return f.dot;
});

rt.type(3193, "/datum/design/gygax_torso", "/datum/design", {
	name: "Exosuit Torso (\"Gygax\")",
	id: "gygax_torso",
	build_type: 16,
	materials: null,
	construction_time: 300,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/gygax_torso"),
});

// /datum/design/gygax_torso/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:219)
rt.def("/datum/design/gygax_torso/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000, "$glass", 10000, "$diamond", 2000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Gygax"));
	return f.dot;
});

rt.type(3194, "/datum/design/gygax_head", "/datum/design", {
	name: "Exosuit Head (\"Gygax\")",
	id: "gygax_head",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/gygax_head"),
});

// /datum/design/gygax_head/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:228)
rt.def("/datum/design/gygax_head/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$glass", 5000, "$diamond", 2000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Gygax"));
	return f.dot;
});

rt.type(3195, "/datum/design/gygax_left_arm", "/datum/design", {
	name: "Exosuit Left Arm (\"Gygax\")",
	id: "gygax_left_arm",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/gygax_left_arm"),
});

// /datum/design/gygax_left_arm/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:237)
rt.def("/datum/design/gygax_left_arm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000, "$diamond", 1000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Gygax"));
	return f.dot;
});

rt.type(3196, "/datum/design/gygax_right_arm", "/datum/design", {
	name: "Exosuit Right Arm (\"Gygax\")",
	id: "gygax_right_arm",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/gygax_right_arm"),
});

// /datum/design/gygax_right_arm/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:246)
rt.def("/datum/design/gygax_right_arm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000, "$diamond", 1000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Gygax"));
	return f.dot;
});

rt.type(3197, "/datum/design/gygax_left_leg", "/datum/design", {
	name: "Exosuit Left Leg (\"Gygax\")",
	id: "gygax_left_leg",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/gygax_left_leg"),
});

// /datum/design/gygax_left_leg/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:255)
rt.def("/datum/design/gygax_left_leg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000, "$diamond", 2000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Gygax"));
	return f.dot;
});

rt.type(3198, "/datum/design/gygax_right_leg", "/datum/design", {
	name: "Exosuit Right Leg (\"Gygax\")",
	id: "gygax_right_leg",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/gygax_right_leg"),
});

// /datum/design/gygax_right_leg/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:264)
rt.def("/datum/design/gygax_right_leg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000, "$diamond", 2000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Gygax"));
	return f.dot;
});

rt.type(3199, "/datum/design/gygax_armor", "/datum/design", {
	name: "Exosuit Armor (\"Gygax\")",
	id: "gygax_armor",
	build_type: 16,
	materials: null,
	construction_time: 600,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/gygax_armor"),
});

// /datum/design/gygax_armor/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:273)
rt.def("/datum/design/gygax_armor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000, "$diamond", 10000, "$titanium", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Gygax"));
	return f.dot;
});

rt.type(3200, "/datum/design/durand_chassis", "/datum/design", {
	name: "Exosuit Chassis (\"Durand\")",
	id: "durand_chassis",
	build_type: 16,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/chassis/durand"),
});

// /datum/design/durand_chassis/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:283)
rt.def("/datum/design/durand_chassis/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 25000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Durand"));
	return f.dot;
});

rt.type(3201, "/datum/design/durand_torso", "/datum/design", {
	name: "Exosuit Torso (\"Durand\")",
	id: "durand_torso",
	build_type: 16,
	materials: null,
	construction_time: 300,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/durand_torso"),
});

// /datum/design/durand_torso/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:292)
rt.def("/datum/design/durand_torso/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 25000, "$glass", 10000, "$silver", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Durand"));
	return f.dot;
});

rt.type(3202, "/datum/design/durand_head", "/datum/design", {
	name: "Exosuit Head (\"Durand\")",
	id: "durand_head",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/durand_head"),
});

// /datum/design/durand_head/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:301)
rt.def("/datum/design/durand_head/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$glass", 15000, "$silver", 2000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Durand"));
	return f.dot;
});

rt.type(3203, "/datum/design/durand_left_arm", "/datum/design", {
	name: "Exosuit Left Arm (\"Durand\")",
	id: "durand_left_arm",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/durand_left_arm"),
});

// /datum/design/durand_left_arm/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:310)
rt.def("/datum/design/durand_left_arm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$silver", 4000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Durand"));
	return f.dot;
});

rt.type(3204, "/datum/design/durand_right_arm", "/datum/design", {
	name: "Exosuit Right Arm (\"Durand\")",
	id: "durand_right_arm",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/durand_right_arm"),
});

// /datum/design/durand_right_arm/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:319)
rt.def("/datum/design/durand_right_arm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$silver", 4000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Durand"));
	return f.dot;
});

rt.type(3205, "/datum/design/durand_left_leg", "/datum/design", {
	name: "Exosuit Left Leg (\"Durand\")",
	id: "durand_left_leg",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/durand_left_leg"),
});

// /datum/design/durand_left_leg/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:328)
rt.def("/datum/design/durand_left_leg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000, "$silver", 4000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Durand"));
	return f.dot;
});

rt.type(3206, "/datum/design/durand_right_leg", "/datum/design", {
	name: "Exosuit Right Leg (\"Durand\")",
	id: "durand_right_leg",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/durand_right_leg"),
});

// /datum/design/durand_right_leg/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:337)
rt.def("/datum/design/durand_right_leg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000, "$silver", 4000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Durand"));
	return f.dot;
});

rt.type(3207, "/datum/design/durand_armor", "/datum/design", {
	name: "Exosuit Armor (\"Durand\")",
	id: "durand_armor",
	build_type: 16,
	materials: null,
	construction_time: 600,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/durand_armor"),
});

// /datum/design/durand_armor/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:346)
rt.def("/datum/design/durand_armor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30000, "$uranium", 25000, "$titanium", 20000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Durand"));
	return f.dot;
});

rt.type(3208, "/datum/design/honk_chassis", "/datum/design", {
	name: "Exosuit Chassis (\"H.O.N.K\")",
	id: "honk_chassis",
	build_type: 16,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/chassis/honker"),
});

// /datum/design/honk_chassis/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:356)
rt.def("/datum/design/honk_chassis/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("H.O.N.K"));
	return f.dot;
});

rt.type(3209, "/datum/design/honk_torso", "/datum/design", {
	name: "Exosuit Torso (\"H.O.N.K\")",
	id: "honk_torso",
	build_type: 16,
	materials: null,
	construction_time: 300,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/honker_torso"),
});

// /datum/design/honk_torso/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:365)
rt.def("/datum/design/honk_torso/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000, "$glass", 10000, "$bananium", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("H.O.N.K"));
	return f.dot;
});

rt.type(3210, "/datum/design/honk_head", "/datum/design", {
	name: "Exosuit Head (\"H.O.N.K\")",
	id: "honk_head",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/honker_head"),
});

// /datum/design/honk_head/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:374)
rt.def("/datum/design/honk_head/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$glass", 5000, "$bananium", 5000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("H.O.N.K"));
	return f.dot;
});

rt.type(3211, "/datum/design/honk_left_arm", "/datum/design", {
	name: "Exosuit Left Arm (\"H.O.N.K\")",
	id: "honk_left_arm",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/honker_left_arm"),
});

// /datum/design/honk_left_arm/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:383)
rt.def("/datum/design/honk_left_arm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000, "$bananium", 5000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("H.O.N.K"));
	return f.dot;
});

rt.type(3212, "/datum/design/honk_right_arm", "/datum/design", {
	name: "Exosuit Right Arm (\"H.O.N.K\")",
	id: "honk_right_arm",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/honker_right_arm"),
});

// /datum/design/honk_right_arm/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:392)
rt.def("/datum/design/honk_right_arm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000, "$bananium", 5000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("H.O.N.K"));
	return f.dot;
});

rt.type(3213, "/datum/design/honk_left_leg", "/datum/design", {
	name: "Exosuit Left Leg (\"H.O.N.K\")",
	id: "honk_left_leg",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/honker_left_leg"),
});

// /datum/design/honk_left_leg/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:401)
rt.def("/datum/design/honk_left_leg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000, "$bananium", 5000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("H.O.N.K"));
	return f.dot;
});

rt.type(3214, "/datum/design/honk_right_leg", "/datum/design", {
	name: "Exosuit Right Leg (\"H.O.N.K\")",
	id: "honk_right_leg",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/honker_right_leg"),
});

// /datum/design/honk_right_leg/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:410)
rt.def("/datum/design/honk_right_leg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000, "$bananium", 5000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("H.O.N.K"));
	return f.dot;
});

rt.type(3215, "/datum/design/phazon_chassis", "/datum/design", {
	name: "Exosuit Chassis (\"Phazon\")",
	id: "phazon_chassis",
	build_type: 16,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/chassis/phazon"),
});

// /datum/design/phazon_chassis/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:421)
rt.def("/datum/design/phazon_chassis/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Phazon"));
	return f.dot;
});

rt.type(3216, "/datum/design/phazon_torso", "/datum/design", {
	name: "Exosuit Torso (\"Phazon\")",
	id: "phazon_torso",
	build_type: 16,
	materials: null,
	construction_time: 300,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/phazon_torso"),
});

// /datum/design/phazon_torso/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:430)
rt.def("/datum/design/phazon_torso/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 35000, "$glass", 10000, "$plasma", 20000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Phazon"));
	return f.dot;
});

rt.type(3217, "/datum/design/phazon_head", "/datum/design", {
	name: "Exosuit Head (\"Phazon\")",
	id: "phazon_head",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/phazon_head"),
});

// /datum/design/phazon_head/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:439)
rt.def("/datum/design/phazon_head/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000, "$glass", 5000, "$plasma", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Phazon"));
	return f.dot;
});

rt.type(3218, "/datum/design/phazon_left_arm", "/datum/design", {
	name: "Exosuit Left Arm (\"Phazon\")",
	id: "phazon_left_arm",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/phazon_left_arm"),
});

// /datum/design/phazon_left_arm/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:448)
rt.def("/datum/design/phazon_left_arm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000, "$plasma", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Phazon"));
	return f.dot;
});

rt.type(3219, "/datum/design/phazon_right_arm", "/datum/design", {
	name: "Exosuit Right Arm (\"Phazon\")",
	id: "phazon_right_arm",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/phazon_right_arm"),
});

// /datum/design/phazon_right_arm/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:457)
rt.def("/datum/design/phazon_right_arm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000, "$plasma", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Phazon"));
	return f.dot;
});

rt.type(3220, "/datum/design/phazon_left_leg", "/datum/design", {
	name: "Exosuit Left Leg (\"Phazon\")",
	id: "phazon_left_leg",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/phazon_left_leg"),
});

// /datum/design/phazon_left_leg/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:466)
rt.def("/datum/design/phazon_left_leg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000, "$plasma", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Phazon"));
	return f.dot;
});

rt.type(3221, "/datum/design/phazon_right_leg", "/datum/design", {
	name: "Exosuit Right Leg (\"Phazon\")",
	id: "phazon_right_leg",
	build_type: 16,
	materials: null,
	construction_time: 200,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/phazon_right_leg"),
});

// /datum/design/phazon_right_leg/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:475)
rt.def("/datum/design/phazon_right_leg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000, "$plasma", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Phazon"));
	return f.dot;
});

rt.type(3222, "/datum/design/phazon_armor", "/datum/design", {
	name: "Exosuit Armor (\"Phazon\")",
	id: "phazon_armor",
	build_type: 16,
	materials: null,
	construction_time: 300,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/part/phazon_armor"),
});

// /datum/design/phazon_armor/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:484)
rt.def("/datum/design/phazon_armor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 25000, "$plasma", 20000, "$titanium", 20000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Phazon"));
	return f.dot;
});

rt.type(3223, "/datum/design/mech_hydraulic_clamp", "/datum/design", {
	name: "Exosuit Engineering Equipment (Hydraulic Clamp)",
	id: "mech_hydraulic_clamp",
	build_type: 16,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp"),
});

// /datum/design/mech_hydraulic_clamp/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:494)
rt.def("/datum/design/mech_hydraulic_clamp/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3224, "/datum/design/mech_drill", "/datum/design", {
	name: "Exosuit Engineering Equipment (Drill)",
	id: "mech_drill",
	build_type: 16,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/drill"),
});

// /datum/design/mech_drill/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:503)
rt.def("/datum/design/mech_drill/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3225, "/datum/design/mech_mining_scanner", "/datum/design", {
	name: "Exosuit Engineering Equipment (Mining Scanner)",
	id: "mech_mscanner",
	build_type: 16,
	materials: null,
	construction_time: 50,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/mining_scanner"),
});

// /datum/design/mech_mining_scanner/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:512)
rt.def("/datum/design/mech_mining_scanner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 5000, "$glass", 2500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3226, "/datum/design/mech_extinguisher", "/datum/design", {
	name: "Exosuit Engineering Equipment (Extinguisher)",
	id: "mech_extinguisher",
	build_type: 16,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/extinguisher"),
});

// /datum/design/mech_extinguisher/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:521)
rt.def("/datum/design/mech_extinguisher/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3227, "/datum/design/mech_cable_layer", "/datum/design", {
	name: "Exosuit Engineering Equipment (Cable Layer)",
	id: "mech_cable_layer",
	build_type: 16,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/cable_layer"),
});

// /datum/design/mech_cable_layer/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:530)
rt.def("/datum/design/mech_cable_layer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3228, "/datum/design/mech_generator", "/datum/design", {
	name: "Exosuit Equipment (Plasma Generator)",
	id: "mech_generator",
	build_type: 16,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/generator"),
});

// /datum/design/mech_generator/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:539)
rt.def("/datum/design/mech_generator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$glass", 1000, "$silver", 2000, "$plasma", 5000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3229, "/datum/design/mech_mousetrap_mortar", "/datum/design", {
	name: "H.O.N.K Mousetrap Mortar",
	id: "mech_mousetrap_mortar",
	build_type: 16,
	materials: null,
	construction_time: 300,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/mousetrap_mortar"),
});

// /datum/design/mech_mousetrap_mortar/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:548)
rt.def("/datum/design/mech_mousetrap_mortar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000, "$bananium", 5000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3230, "/datum/design/mech_banana_mortar", "/datum/design", {
	name: "H.O.N.K Banana Mortar",
	id: "mech_banana_mortar",
	build_type: 16,
	materials: null,
	construction_time: 300,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/banana_mortar"),
});

// /datum/design/mech_banana_mortar/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:557)
rt.def("/datum/design/mech_banana_mortar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000, "$bananium", 5000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3231, "/datum/design/mech_honker", "/datum/design", {
	name: "HoNkER BlAsT 5000",
	id: "mech_honker",
	build_type: 16,
	materials: null,
	construction_time: 500,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/weapon/honker"),
});

// /datum/design/mech_honker/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:566)
rt.def("/datum/design/mech_honker/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000, "$bananium", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3232, "/datum/design/mech_punching_glove", "/datum/design", {
	name: "Oingo Boingo Punch-face",
	id: "mech_punching_face",
	build_type: 16,
	materials: null,
	construction_time: 400,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/punching_glove"),
});

// /datum/design/mech_punching_glove/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:575)
rt.def("/datum/design/mech_punching_glove/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20000, "$bananium", 7500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Exosuit Equipment"));
	return f.dot;
});

rt.type(3233, "/datum/design/borg_upgrade_rename", "/datum/design", {
	name: "Cyborg Upgrade (Rename Board)",
	id: "borg_upgrade_rename",
	build_type: 16,
	materials: null,
	construction_time: 120,
	category: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/rename"),
});

// /datum/design/borg_upgrade_rename/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:588)
rt.def("/datum/design/borg_upgrade_rename/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 35000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Cyborg Upgrade Modules"));
	return f.dot;
});

rt.type(3234, "/datum/design/borg_upgrade_restart", "/datum/design", {
	name: "Cyborg Upgrade (Emergency Reboot Board)",
	id: "borg_upgrade_restart",
	build_type: 16,
	materials: null,
	construction_time: 120,
	category: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/restart"),
});

// /datum/design/borg_upgrade_restart/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:597)
rt.def("/datum/design/borg_upgrade_restart/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 60000, "$glass", 5000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Cyborg Upgrade Modules"));
	return f.dot;
});

rt.type(3235, "/datum/design/borg_upgrade_vtec", "/datum/design", {
	name: "Cyborg Upgrade (VTEC Module)",
	id: "borg_upgrade_vtec",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 120,
	category: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/vtec"),
});

// /datum/design/borg_upgrade_vtec/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:606)
rt.def("/datum/design/borg_upgrade_vtec/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["engineering", 4, "materials", 5, "programming", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 80000, "$glass", 6000, "$uranium", 5000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Cyborg Upgrade Modules"));
	return f.dot;
});

rt.type(3236, "/datum/design/borg_upgrade_thrusters", "/datum/design", {
	name: "Cyborg Upgrade (Ion Thrusters)",
	id: "borg_upgrade_thrusters",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 120,
	category: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/thrusters"),
});

// /datum/design/borg_upgrade_thrusters/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:616)
rt.def("/datum/design/borg_upgrade_thrusters/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["engineering", 4, "powerstorage", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$plasma", 5000, "$uranium", 6000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Cyborg Upgrade Modules"));
	return f.dot;
});

rt.type(3237, "/datum/design/borg_upgrade_disablercooler", "/datum/design", {
	name: "Cyborg Upgrade (Rapid Disabler Cooling Module)",
	id: "borg_upgrade_disablercooler",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 120,
	category: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/disablercooler"),
});

// /datum/design/borg_upgrade_disablercooler/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:626)
rt.def("/datum/design/borg_upgrade_disablercooler/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["combat", 5, "powerstorage", 4, "engineering", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 80000, "$glass", 6000, "$gold", 2000, "$diamond", 500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Cyborg Upgrade Modules"));
	return f.dot;
});

rt.type(3238, "/datum/design/borg_upgrade_diamonddrill", "/datum/design", {
	name: "Cyborg Upgrade (Diamond Drill)",
	id: "borg_upgrade_diamonddrill",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 120,
	category: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/ddrill"),
});

// /datum/design/borg_upgrade_diamonddrill/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:636)
rt.def("/datum/design/borg_upgrade_diamonddrill/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["engineering", 5, "materials", 6]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$diamond", 2000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Cyborg Upgrade Modules"));
	return f.dot;
});

rt.type(3239, "/datum/design/borg_upgrade_holding", "/datum/design", {
	name: "Cyborg Upgrade (Ore Satchel of Holding)",
	id: "borg_upgrade_holding",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 120,
	category: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/soh"),
});

// /datum/design/borg_upgrade_holding/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:646)
rt.def("/datum/design/borg_upgrade_holding/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["engineering", 4, "materials", 4, "bluespace", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$gold", 250, "$uranium", 500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Cyborg Upgrade Modules"));
	return f.dot;
});

rt.type(3240, "/datum/design/borg_upgrade_lavaproof", "/datum/design", {
	name: "Cyborg Upgrade (Lavaproof Tracks)",
	id: "borg_upgrade_lavaproof",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 120,
	category: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/lavaproof"),
});

// /datum/design/borg_upgrade_lavaproof/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:656)
rt.def("/datum/design/borg_upgrade_lavaproof/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["plasmatech", 4, "materials", 4, "engineering", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$plasma", 4000, "$titanium", 5000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Cyborg Upgrade Modules"));
	return f.dot;
});

rt.type(3241, "/datum/design/borg_syndicate_module", "/datum/design", {
	name: "Cyborg Upgrade (Illegal Modules)",
	id: "borg_syndicate_module",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 120,
	category: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/syndicate"),
});

// /datum/design/borg_syndicate_module/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:665)
rt.def("/datum/design/borg_syndicate_module/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["combat", 4, "syndicate", 2]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$glass", 15000, "$diamond", 10000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Cyborg Upgrade Modules"));
	return f.dot;
});

rt.type(3242, "/datum/design/borg_upgrade_selfrepair", "/datum/design", {
	name: "Cyborg Upgrade (Self-repair)",
	id: "borg_upgrade_selfrepair",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 120,
	category: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/selfrepair"),
});

// /datum/design/borg_upgrade_selfrepair/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:676)
rt.def("/datum/design/borg_upgrade_selfrepair/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 4, "engineering", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000, "$glass", 15000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Cyborg Upgrade Modules"));
	return f.dot;
});

rt.type(3243, "/datum/design/borg_upgrade_expandedsynthesiser", "/datum/design", {
	name: "Cyborg Upgrade (Hypospray Expanded Synthesiser)",
	id: "borg_upgrade_expandedsynthesiser",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 120,
	category: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/hypospray/expanded"),
});

// /datum/design/borg_upgrade_expandedsynthesiser/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:686)
rt.def("/datum/design/borg_upgrade_expandedsynthesiser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 5, "engineering", 4, "biotech", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000, "$glass", 15000, "$plasma", 5000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Cyborg Upgrade Modules"));
	return f.dot;
});

rt.type(3244, "/datum/design/borg_upgrade_highstrengthsynthesiser", "/datum/design", {
	name: "Cyborg Upgrade (Hypospray High-Strength Synthesiser)",
	id: "borg_upgrade_highstrengthsynthesiser",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 120,
	category: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/hypospray/high_strength"),
});

// /datum/design/borg_upgrade_highstrengthsynthesiser/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:696)
rt.def("/datum/design/borg_upgrade_highstrengthsynthesiser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 5, "engineering", 5, "biotech", 6]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000, "$glass", 15000, "$plasma", 10000, "$uranium", 5000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Cyborg Upgrade Modules"));
	return f.dot;
});

rt.type(3245, "/datum/design/borg_upgrade_piercinghypospray", "/datum/design", {
	name: "Cyborg Upgrade (Piercing Hypospray)",
	id: "borg_upgrade_piercinghypospray",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 120,
	category: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/piercing_hypospray"),
});

// /datum/design/borg_upgrade_piercinghypospray/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:706)
rt.def("/datum/design/borg_upgrade_piercinghypospray/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 5, "engineering", 7, "combat", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000, "$glass", 15000, "$titanium", 10000, "$diamond", 5000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Cyborg Upgrade Modules"));
	return f.dot;
});

rt.type(3246, "/datum/design/borg_upgrade_defibrillator", "/datum/design", {
	name: "Cyborg Upgrade (Defibrillator)",
	id: "borg_upgrade_defibrillator",
	build_type: 16,
	req_tech: null,
	materials: null,
	construction_time: 120,
	category: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/defib"),
});

// /datum/design/borg_upgrade_defibrillator/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:716)
rt.def("/datum/design/borg_upgrade_defibrillator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 4, "engineering", 5, "materials", 5, "powerstorage", 5, "biotech", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000, "$glass", 15000, "$silver", 10000, "$gold", 10000, "$titanium", 5000, "$diamond", 5000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Cyborg Upgrade Modules"));
	return f.dot;
});

rt.type(3247, "/datum/design/boris_ai_controller", "/datum/design", {
	name: "B.O.R.I.S. AI-Cyborg Remote Control Module",
	id: "borg_ai_control",
	build_type: 16,
	materials: null,
	req_tech: null,
	construction_time: 50,
	category: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/ai"),
});

// /datum/design/boris_ai_controller/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:726)
rt.def("/datum/design/boris_ai_controller/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1200, "$glass", 1500, "$gold", 200]));
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 4, "magnets", 4, "engineering", 4]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Misc"));
	return f.dot;
});

rt.type(3248, "/datum/design/mecha_tracking", "/datum/design", {
	name: "Exosuit Tracking Beacon",
	id: "mecha_tracking",
	build_type: 16,
	materials: null,
	construction_time: 50,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_tracking"),
});

// /datum/design/mecha_tracking/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:737)
rt.def("/datum/design/mecha_tracking/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Misc"));
	return f.dot;
});

rt.type(3249, "/datum/design/mecha_tracking_ai_control", "/datum/design", {
	name: "AI Control Beacon",
	id: "mecha_tracking_ai_control",
	build_type: 16,
	materials: null,
	req_tech: null,
	construction_time: 50,
	category: null,
	build_path: rt.typePath("/obj/item/mecha_parts/mecha_tracking/ai_control"),
});

// /datum/design/mecha_tracking_ai_control/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:746)
rt.def("/datum/design/mecha_tracking_ai_control/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1000, "$glass", 500, "$silver", 200]));
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "magnets", 2, "engineering", 2]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Misc"));
	return f.dot;
});

rt.type(3250, "/datum/design/drone_shell", "/datum/design", {
	name: "Drone Shell",
	desc: "A shell of a maintenance drone, an expendable robot built to perform station repairs.",
	id: "drone_shell",
	req_tech: null,
	build_type: 18,
	materials: null,
	construction_time: 150,
	category: null,
	build_path: rt.typePath("/obj/item/drone_shell"),
});

// /datum/design/drone_shell/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:755)
rt.def("/datum/design/drone_shell/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 2, "biotech", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 800, "$glass", 350]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Misc"));
	return f.dot;
});

rt.type(3251, "/datum/design/synthetic_flash", "/datum/design", {
	name: "Flash",
	desc: "When a problem arises, SCIENCE is the solution.",
	id: "sflash",
	build_type: 16,
	materials: null,
	construction_time: 100,
	category: null,
	build_path: rt.typePath("/obj/item/device/assembly/flash/handheld"),
});

// /datum/design/synthetic_flash/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:767)
rt.def("/datum/design/synthetic_flash/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 750, "$glass", 750]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Misc"));
	return f.dot;
});

rt.type(3252, "/datum/design/flightsuit", "/datum/design", {
	name: "Flight Suit",
	desc: "A specialized hardsuit that is able to attach a flightpack and accessories..",
	id: "flightsuit",
	build_type: 16,
	materials: null,
	construction_time: 250,
	category: null,
	req_tech: null,
	build_path: rt.typePath("/obj/item/clothing/suit/space/hardsuit/flightsuit"),
});

// /datum/design/flightsuit/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:778)
rt.def("/datum/design/flightsuit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 16000, "$glass", 8000, "$diamond", 200, "$gold", 3000, "$silver", 3000, "$titanium", 16000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Misc"));
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 2, "combat", 2, "plasmatech", 2, "materials", 4, "engineering", 3, "powerstorage", 2]));
	return f.dot;
});

rt.type(3253, "/datum/design/flightpack", "/datum/design", {
	name: "Flight Pack",
	desc: "An advanced back-worn system that has dual ion engines powerful enough to grant a humanoid flight. Contains an internal self-recharging high-current capacitor for short, powerful boosts.",
	id: "flightpack",
	build_type: 16,
	materials: null,
	construction_time: 250,
	category: null,
	req_tech: null,
	build_path: rt.typePath("/obj/item/device/flightpack"),
});

// /datum/design/flightpack/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:789)
rt.def("/datum/design/flightpack/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 16000, "$glass", 8000, "$diamond", 4000, "$gold", 12000, "$silver", 12000, "$uranium", 20000, "$plasma", 16000, "$titanium", 16000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Misc"));
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 4, "combat", 3, "plasmatech", 4, "materials", 5, "engineering", 4, "powerstorage", 4]));
	return f.dot;
});

rt.type(3254, "/datum/design/flightshoes", "/datum/design", {
	name: "Flight Shoes",
	desc: "Flight shoes, attachable to a flight suit to provide additional functions.",
	id: "flightshoes",
	build_type: 16,
	materials: null,
	construction_time: 100,
	category: null,
	req_tech: null,
	build_path: rt.typePath("/obj/item/clothing/shoes/flightshoes"),
});

// /datum/design/flightshoes/proc/<init>  (code/modules/research/designs/mechfabricator_designs.dm:800)
rt.def("/datum/design/flightshoes/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 5000, "$glass", 5000, "$gold", 1500, "$silver", 1500, "$plasma", 2000, "$titanium", 2000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Misc"));
	rt.setSv(f, "req_tech", rt.alist(f, ["magnets", 2, "combat", 2, "plasmatech", 3, "materials", 3, "engineering", 2, "powerstorage", 2]));
	return f.dot;
});
