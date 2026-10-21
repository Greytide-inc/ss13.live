// From code/modules/research/designs/AI_module_designs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2865, "/datum/design/board/aicore", "/datum/design/board", {
	name: "AI Design (AI Core)",
	desc: "Allows for the construction of circuit boards used to build new AI cores.",
	id: "aicore",
	req_tech: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/circuitboard/aicore"),
});

// /datum/design/board/aicore/proc/<init>  (code/modules/research/designs/AI_module_designs.dm:9)
rt.def("/datum/design/board/aicore/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("AI Modules"));
	return f.dot;
});

rt.type(2866, "/datum/design/board/safeguard_module", "/datum/design/board", {
	name: "Module Design (Safeguard)",
	desc: "Allows for the construction of a Safeguard AI Module.",
	id: "safeguard_module",
	req_tech: null,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/aiModule/supplied/safeguard"),
});

// /datum/design/board/safeguard_module/proc/<init>  (code/modules/research/designs/AI_module_designs.dm:18)
rt.def("/datum/design/board/safeguard_module/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "materials", 3]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1000, "$gold", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("AI Modules"));
	return f.dot;
});

rt.type(2867, "/datum/design/board/onehuman_module", "/datum/design/board", {
	name: "Module Design (OneHuman)",
	desc: "Allows for the construction of a OneHuman AI Module.",
	id: "onehuman_module",
	req_tech: null,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/aiModule/zeroth/oneHuman"),
});

// /datum/design/board/onehuman_module/proc/<init>  (code/modules/research/designs/AI_module_designs.dm:27)
rt.def("/datum/design/board/onehuman_module/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 6, "materials", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1000, "$diamond", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("AI Modules"));
	return f.dot;
});

rt.type(2868, "/datum/design/board/protectstation_module", "/datum/design/board", {
	name: "Module Design (ProtectStation)",
	desc: "Allows for the construction of a ProtectStation AI Module.",
	id: "protectstation_module",
	req_tech: null,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/aiModule/supplied/protectStation"),
});

// /datum/design/board/protectstation_module/proc/<init>  (code/modules/research/designs/AI_module_designs.dm:36)
rt.def("/datum/design/board/protectstation_module/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 5, "materials", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1000, "$gold", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("AI Modules"));
	return f.dot;
});

rt.type(2869, "/datum/design/board/quarantine_module", "/datum/design/board", {
	name: "Module Design (Quarantine)",
	desc: "Allows for the construction of a Quarantine AI Module.",
	id: "quarantine_module",
	req_tech: null,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/aiModule/supplied/quarantine"),
});

// /datum/design/board/quarantine_module/proc/<init>  (code/modules/research/designs/AI_module_designs.dm:45)
rt.def("/datum/design/board/quarantine_module/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "biotech", 2, "materials", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1000, "$gold", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("AI Modules"));
	return f.dot;
});

rt.type(2870, "/datum/design/board/oxygen_module", "/datum/design/board", {
	name: "Module Design (OxygenIsToxicToHumans)",
	desc: "Allows for the construction of a Safeguard AI Module.",
	id: "oxygen_module",
	req_tech: null,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/aiModule/supplied/oxygen"),
});

// /datum/design/board/oxygen_module/proc/<init>  (code/modules/research/designs/AI_module_designs.dm:55)
rt.def("/datum/design/board/oxygen_module/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 4, "biotech", 2, "materials", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1000, "$gold", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("AI Modules"));
	return f.dot;
});

rt.type(2871, "/datum/design/board/freeform_module", "/datum/design/board", {
	name: "Module Design (Freeform)",
	desc: "Allows for the construction of a Freeform AI Module.",
	id: "freeform_module",
	req_tech: null,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/aiModule/supplied/freeform"),
});

// /datum/design/board/freeform_module/proc/<init>  (code/modules/research/designs/AI_module_designs.dm:64)
rt.def("/datum/design/board/freeform_module/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 5, "materials", 4]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1000, "$gold", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("AI Modules"));
	return f.dot;
});

rt.type(2872, "/datum/design/board/reset_module", "/datum/design/board", {
	name: "Module Design (Reset)",
	desc: "Allows for the construction of a Reset AI Module.",
	id: "reset_module",
	req_tech: null,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/aiModule/reset"),
});

// /datum/design/board/reset_module/proc/<init>  (code/modules/research/designs/AI_module_designs.dm:73)
rt.def("/datum/design/board/reset_module/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 4, "materials", 6]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1000, "$gold", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("AI Modules"));
	return f.dot;
});

rt.type(2873, "/datum/design/board/purge_module", "/datum/design/board", {
	name: "Module Design (Purge)",
	desc: "Allows for the construction of a Purge AI Module.",
	id: "purge_module",
	req_tech: null,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/aiModule/reset/purge"),
});

// /datum/design/board/purge_module/proc/<init>  (code/modules/research/designs/AI_module_designs.dm:82)
rt.def("/datum/design/board/purge_module/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 5, "materials", 6]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1000, "$diamond", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("AI Modules"));
	return f.dot;
});

rt.type(2874, "/datum/design/board/remove_module", "/datum/design/board", {
	name: "Module Design (Law Removal)",
	desc: "Allows for the construction of a Law Removal AI Core Module.",
	id: "remove_module",
	req_tech: null,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/aiModule/remove"),
});

// /datum/design/board/remove_module/proc/<init>  (code/modules/research/designs/AI_module_designs.dm:91)
rt.def("/datum/design/board/remove_module/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 5, "materials", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1000, "$diamond", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("AI Modules"));
	return f.dot;
});

rt.type(2875, "/datum/design/board/freeformcore_module", "/datum/design/board", {
	name: "AI Core Module (Freeform)",
	desc: "Allows for the construction of a Freeform AI Core Module.",
	id: "freeformcore_module",
	req_tech: null,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/aiModule/core/freeformcore"),
});

// /datum/design/board/freeformcore_module/proc/<init>  (code/modules/research/designs/AI_module_designs.dm:100)
rt.def("/datum/design/board/freeformcore_module/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 6, "materials", 6]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1000, "$diamond", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("AI Modules"));
	return f.dot;
});

rt.type(2876, "/datum/design/board/asimov", "/datum/design/board", {
	name: "Core Module Design (Asimov)",
	desc: "Allows for the construction of a Asimov AI Core Module.",
	id: "asimov_module",
	req_tech: null,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/aiModule/core/full/asimov"),
});

// /datum/design/board/asimov/proc/<init>  (code/modules/research/designs/AI_module_designs.dm:109)
rt.def("/datum/design/board/asimov/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 3, "materials", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1000, "$diamond", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("AI Modules"));
	return f.dot;
});

rt.type(2877, "/datum/design/board/paladin_module", "/datum/design/board", {
	name: "Core Module Design (P.A.L.A.D.I.N.)",
	desc: "Allows for the construction of a P.A.L.A.D.I.N. AI Core Module.",
	id: "paladin_module",
	req_tech: null,
	build_type: 1,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/aiModule/core/full/paladin"),
});

// /datum/design/board/paladin_module/proc/<init>  (code/modules/research/designs/AI_module_designs.dm:118)
rt.def("/datum/design/board/paladin_module/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 5, "materials", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1000, "$diamond", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("AI Modules"));
	return f.dot;
});

rt.type(2878, "/datum/design/board/tyrant_module", "/datum/design/board", {
	name: "Core Module Design (T.Y.R.A.N.T.)",
	desc: "Allows for the construction of a T.Y.R.A.N.T. AI Module.",
	id: "tyrant_module",
	req_tech: null,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/aiModule/core/full/tyrant"),
});

// /datum/design/board/tyrant_module/proc/<init>  (code/modules/research/designs/AI_module_designs.dm:128)
rt.def("/datum/design/board/tyrant_module/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 5, "syndicate", 2, "materials", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1000, "$diamond", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("AI Modules"));
	return f.dot;
});

rt.type(2879, "/datum/design/board/corporate_module", "/datum/design/board", {
	name: "Core Module Design (Corporate)",
	desc: "Allows for the construction of a Corporate AI Core Module.",
	id: "corporate_module",
	req_tech: null,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/aiModule/core/full/corp"),
});

// /datum/design/board/corporate_module/proc/<init>  (code/modules/research/designs/AI_module_designs.dm:137)
rt.def("/datum/design/board/corporate_module/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 5, "materials", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1000, "$diamond", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("AI Modules"));
	return f.dot;
});

rt.type(2880, "/datum/design/board/default_module", "/datum/design/board", {
	name: "Core Module Design (Default)",
	desc: "Allows for the construction of a Default AI Core Module.",
	id: "default_module",
	req_tech: null,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/weapon/aiModule/core/full/custom"),
});

// /datum/design/board/default_module/proc/<init>  (code/modules/research/designs/AI_module_designs.dm:146)
rt.def("/datum/design/board/default_module/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["programming", 5, "materials", 5]));
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1000, "$diamond", 100]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("AI Modules"));
	return f.dot;
});
