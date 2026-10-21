// From code/_onclick/hud/swarmer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11195, "/obj/screen/swarmer/FabricateTrap", "/obj/screen/swarmer", {
	icon_state: "ui_trap",
	name: "Create trap (Costs 5 Resources)",
	desc: "Creates a trap that will nonlethally shock any non-swarmer that attempts to cross it. (Costs 5 resources)",
});

// /obj/screen/swarmer/FabricateTrap/proc/Click  (code/_onclick/hud/swarmer.dm:12)  may sleep
rt.def("/obj/screen/swarmer/FabricateTrap/proc/Click", function* Click(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/simple_animal/hostile/swarmer")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (S = live(f.usr)), "CreateTrap", []);
	return f.dot;
}, true);

rt.type(11196, "/obj/screen/swarmer/Barricade", "/obj/screen/swarmer", {
	icon_state: "ui_barricade",
	name: "Create barricade (Costs 5 Resources)",
	desc: "Creates a destructible barricade that will stop any non swarmer from passing it. Also allows disabler beams to pass through. (Costs 5 resources)",
});

// /obj/screen/swarmer/Barricade/proc/Click  (code/_onclick/hud/swarmer.dm:22)  may sleep
rt.def("/obj/screen/swarmer/Barricade/proc/Click", function* Click(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/simple_animal/hostile/swarmer")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (S = live(f.usr)), "CreateBarricade", []);
	return f.dot;
}, true);

rt.type(11197, "/obj/screen/swarmer/Replicate", "/obj/screen/swarmer", {
	icon_state: "ui_replicate",
	name: "Replicate (Costs 50 Resources)",
	desc: "Creates a another of our kind.",
});

// /obj/screen/swarmer/Replicate/proc/Click  (code/_onclick/hud/swarmer.dm:32)  may sleep
rt.def("/obj/screen/swarmer/Replicate/proc/Click", function* Click(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/simple_animal/hostile/swarmer")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (S = live(f.usr)), "CreateSwarmer", []);
	return f.dot;
}, true);

rt.type(11198, "/obj/screen/swarmer/RepairSelf", "/obj/screen/swarmer", {
	icon_state: "ui_self_repair",
	name: "Repair self",
	desc: "Repairs damage to our body.",
});

// /obj/screen/swarmer/RepairSelf/proc/Click  (code/_onclick/hud/swarmer.dm:42)  may sleep
rt.def("/obj/screen/swarmer/RepairSelf/proc/Click", function* Click(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/simple_animal/hostile/swarmer")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (S = live(f.usr)), "RepairSelf", []);
	return f.dot;
}, true);

rt.type(11199, "/obj/screen/swarmer/ToggleLight", "/obj/screen/swarmer", {
	icon_state: "ui_light",
	name: "Toggle light",
	desc: "Toggles our inbuilt light on or off.",
});

// /obj/screen/swarmer/ToggleLight/proc/Click  (code/_onclick/hud/swarmer.dm:52)
rt.def("/obj/screen/swarmer/ToggleLight/proc/Click", function Click(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/simple_animal/hostile/swarmer")) ? 1 : 0))) return f.dot;
	rt.callName(f, (S = live(f.usr)), "ToggleLight", []);
	return f.dot;
});

rt.type(11200, "/obj/screen/swarmer/ContactSwarmers", "/obj/screen/swarmer", {
	icon_state: "ui_contact_swarmers",
	name: "Contact swarmers",
	desc: "Sends a message to all other swarmers, should they exist.",
});

// /obj/screen/swarmer/ContactSwarmers/proc/Click  (code/_onclick/hud/swarmer.dm:62)  may sleep
rt.def("/obj/screen/swarmer/ContactSwarmers/proc/Click", function* Click(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/simple_animal/hostile/swarmer")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (S = live(f.usr)), "ContactSwarmers", []);
	return f.dot;
}, true);

rt.type(78, "/datum/hud/swarmer", "/datum/hud", {});

// /datum/hud/swarmer/proc/New  (code/_onclick/hud/swarmer.dm:67)  may sleep
rt.def("/datum/hud/swarmer/proc/New", function* New(f: Frame) {
	let using: Value = null;
	f.vars = () => [using];
	yield* g.callSuper(f, [], rt.Args.Same);
	using = null;
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/swarmer/FabricateTrap"), []))), (yield* g.call(f, P("/proc/ui_hand_position"), null, [2])));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/swarmer/Barricade"), []))), (yield* g.call(f, P("/proc/ui_hand_position"), null, [1])));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/swarmer/Replicate"), []))), "EAST-1:28,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/swarmer/RepairSelf"), []))), "CENTER+1:18,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/swarmer/ToggleLight"), []))), "CENTER-2:14,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/swarmer/ContactSwarmers"), []))), "WEST:6,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	return f.dot;
}, true, { args: ["owner"] });

// /mob/living/simple_animal/hostile/swarmer/proc/create_mob_hud  (code/_onclick/hud/swarmer.dm:96)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(truthy(rt.sv(f, "client")) && !truthy(rt.sv(f, "hud_used")))) return f.dot;
	rt.setSv(f, "hud_used", (yield* g.new_(f, T("/datum/hud/swarmer"), [live(f.src)])));
	return f.dot;
}, true);
