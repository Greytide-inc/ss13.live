// From code/modules/clothing/under/jobs/medsci.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8314, "/obj/item/clothing/under/rank/research_director", "/obj/item/clothing/under/rank", {
	desc: "It's a suit worn by those with the know-how to achieve the position of \"Research Director\". Its fabric provides minor protection from biological contaminants.",
	name: "research director's vest suit",
	icon_state: "director",
	item_state: "lb_suit",
	item_color: "director",
	armor: null,
	can_adjust: 0,
});

// /obj/item/clothing/under/rank/research_director/proc/<init>  (code/modules/clothing/under/jobs/medsci.dm:10)
rt.def("/obj/item/clothing/under/rank/research_director/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 10, "bio", 10, "rad", 0, "fire", 0, "acid", 35]));
	return f.dot;
});

rt.type(8315, "/obj/item/clothing/under/rank/research_director/alt", "/obj/item/clothing/under/rank/research_director", {
	desc: "Maybe you'll engineer your own half-man, half-pig creature some day. Its fabric provides minor protection from biological contaminants.",
	name: "research director's tan suit",
	icon_state: "rdwhimsy",
	item_state: "rdwhimsy",
	item_color: "rdwhimsy",
	armor: null,
	can_adjust: 1,
	alt_covers_chest: 1,
});

// /obj/item/clothing/under/rank/research_director/alt/proc/<init>  (code/modules/clothing/under/jobs/medsci.dm:19)
rt.def("/obj/item/clothing/under/rank/research_director/alt/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 10, "bio", 10, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

rt.type(8316, "/obj/item/clothing/under/rank/research_director/turtleneck", "/obj/item/clothing/under/rank/research_director", {
	desc: "A dark purple turtleneck and tan khakis, for a director with a superior sense of style.",
	name: "research director's turtleneck",
	icon_state: "rdturtle",
	item_state: "p_suit",
	item_color: "rdturtle",
	armor: null,
	can_adjust: 1,
	alt_covers_chest: 1,
});

// /obj/item/clothing/under/rank/research_director/turtleneck/proc/<init>  (code/modules/clothing/under/jobs/medsci.dm:29)
rt.def("/obj/item/clothing/under/rank/research_director/turtleneck/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 10, "bio", 10, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

rt.type(8317, "/obj/item/clothing/under/rank/scientist", "/obj/item/clothing/under/rank", {
	desc: "It's made of a special fiber that provides minor protection against explosives. It has markings that denote the wearer as a scientist.",
	name: "scientist's jumpsuit",
	icon_state: "toxins",
	item_state: "w_suit",
	item_color: "toxinswhite",
	permeability_coefficient: 0.5,
	armor: null,
});

// /obj/item/clothing/under/rank/scientist/proc/<init>  (code/modules/clothing/under/jobs/medsci.dm:40)
rt.def("/obj/item/clothing/under/rank/scientist/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 10, "bio", 0, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

rt.type(8318, "/obj/item/clothing/under/rank/chemist", "/obj/item/clothing/under/rank", {
	desc: "It's made of a special fiber that gives special protection against biohazards. It has a chemist rank stripe on it.",
	name: "chemist's jumpsuit",
	icon_state: "chemistry",
	item_state: "w_suit",
	item_color: "chemistrywhite",
	permeability_coefficient: 0.5,
	armor: null,
});

// /obj/item/clothing/under/rank/chemist/proc/<init>  (code/modules/clothing/under/jobs/medsci.dm:50)
rt.def("/obj/item/clothing/under/rank/chemist/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 10, "rad", 0, "fire", 50, "acid", 65]));
	return f.dot;
});

rt.type(8319, "/obj/item/clothing/under/rank/chief_medical_officer", "/obj/item/clothing/under/rank", {
	desc: "It's a jumpsuit worn by those with the experience to be \"Chief Medical Officer\". It provides minor biological protection.",
	name: "chief medical officer's jumpsuit",
	icon_state: "cmo",
	item_state: "w_suit",
	item_color: "cmo",
	permeability_coefficient: 0.5,
	armor: null,
});

// /obj/item/clothing/under/rank/chief_medical_officer/proc/<init>  (code/modules/clothing/under/jobs/medsci.dm:62)
rt.def("/obj/item/clothing/under/rank/chief_medical_officer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 10, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

rt.type(8320, "/obj/item/clothing/under/rank/geneticist", "/obj/item/clothing/under/rank", {
	desc: "It's made of a special fiber that gives special protection against biohazards. It has a genetics rank stripe on it.",
	name: "geneticist's jumpsuit",
	icon_state: "genetics",
	item_state: "w_suit",
	item_color: "geneticswhite",
	permeability_coefficient: 0.5,
	armor: null,
});

// /obj/item/clothing/under/rank/geneticist/proc/<init>  (code/modules/clothing/under/jobs/medsci.dm:71)
rt.def("/obj/item/clothing/under/rank/geneticist/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 10, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

rt.type(8321, "/obj/item/clothing/under/rank/virologist", "/obj/item/clothing/under/rank", {
	desc: "It's made of a special fiber that gives special protection against biohazards. It has a virologist rank stripe on it.",
	name: "virologist's jumpsuit",
	icon_state: "virology",
	item_state: "w_suit",
	item_color: "virologywhite",
	permeability_coefficient: 0.5,
	armor: null,
});

// /obj/item/clothing/under/rank/virologist/proc/<init>  (code/modules/clothing/under/jobs/medsci.dm:80)
rt.def("/obj/item/clothing/under/rank/virologist/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 10, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

rt.type(8322, "/obj/item/clothing/under/rank/nursesuit", "/obj/item/clothing/under/rank", {
	desc: "It's a jumpsuit commonly worn by nursing staff in the medical department.",
	name: "nurse's suit",
	icon_state: "nursesuit",
	item_state: "w_suit",
	item_color: "nursesuit",
	permeability_coefficient: 0.5,
	armor: null,
	fitted: 0,
	can_adjust: 0,
});

// /obj/item/clothing/under/rank/nursesuit/proc/<init>  (code/modules/clothing/under/jobs/medsci.dm:89)
rt.def("/obj/item/clothing/under/rank/nursesuit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 10, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

rt.type(8323, "/obj/item/clothing/under/rank/medical", "/obj/item/clothing/under/rank", {
	desc: "It's made of a special fiber that provides minor protection against biohazards. It has a cross on the chest denoting that the wearer is trained medical personnel.",
	name: "medical doctor's jumpsuit",
	icon_state: "medical",
	item_state: "w_suit",
	item_color: "medical",
	permeability_coefficient: 0.5,
	armor: null,
});

// /obj/item/clothing/under/rank/medical/proc/<init>  (code/modules/clothing/under/jobs/medsci.dm:100)
rt.def("/obj/item/clothing/under/rank/medical/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 10, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});
