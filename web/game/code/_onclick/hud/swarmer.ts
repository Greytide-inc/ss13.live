// Based on /tg/station's code/_onclick/hud/swarmer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11195, "/obj/screen/swarmer/FabricateTrap", "/obj/screen/swarmer", {
	icon_state: "ui_trap",
	name: "Create trap (Costs 5 Resources)",
	desc: "Creates a trap that will nonlethally shock any non-swarmer that attempts to cross it. (Costs 5 resources)",
});

// swarmer.dm:12
rt.def("/obj/screen/swarmer/FabricateTrap/proc/Click", function* Click(f: Frame) {
	let S: Value = null;
	if (!rt.istype(f.usr, T("/mob/living/simple_animal/hostile/swarmer"))) return f.dot;
	yield* (S = f.usr).CreateTrap();
	return f.dot;
}, true);

rt.type(11196, "/obj/screen/swarmer/Barricade", "/obj/screen/swarmer", {
	icon_state: "ui_barricade",
	name: "Create barricade (Costs 5 Resources)",
	desc: "Creates a destructible barricade that will stop any non swarmer from passing it. Also allows disabler beams to pass through. (Costs 5 resources)",
});

// swarmer.dm:22
rt.def("/obj/screen/swarmer/Barricade/proc/Click", function* Click(f: Frame) {
	let S: Value = null;
	if (!rt.istype(f.usr, T("/mob/living/simple_animal/hostile/swarmer"))) return f.dot;
	yield* (S = f.usr).CreateBarricade();
	return f.dot;
}, true);

rt.type(11197, "/obj/screen/swarmer/Replicate", "/obj/screen/swarmer", {
	icon_state: "ui_replicate",
	name: "Replicate (Costs 50 Resources)",
	desc: "Creates a another of our kind.",
});

// swarmer.dm:32
rt.def("/obj/screen/swarmer/Replicate/proc/Click", function* Click(f: Frame) {
	let S: Value = null;
	if (!rt.istype(f.usr, T("/mob/living/simple_animal/hostile/swarmer"))) return f.dot;
	yield* (S = f.usr).CreateSwarmer();
	return f.dot;
}, true);

rt.type(11198, "/obj/screen/swarmer/RepairSelf", "/obj/screen/swarmer", {
	icon_state: "ui_self_repair",
	name: "Repair self",
	desc: "Repairs damage to our body.",
});

// swarmer.dm:42
rt.def("/obj/screen/swarmer/RepairSelf/proc/Click", function* Click(f: Frame) {
	let S: Value = null;
	if (!rt.istype(f.usr, T("/mob/living/simple_animal/hostile/swarmer"))) return f.dot;
	yield* (S = f.usr).RepairSelf();
	return f.dot;
}, true);

rt.type(11199, "/obj/screen/swarmer/ToggleLight", "/obj/screen/swarmer", {
	icon_state: "ui_light",
	name: "Toggle light",
	desc: "Toggles our inbuilt light on or off.",
});

// swarmer.dm:52
rt.def("/obj/screen/swarmer/ToggleLight/proc/Click", function Click(f: Frame) {
	let S: Value = null;
	if (!rt.istype(f.usr, T("/mob/living/simple_animal/hostile/swarmer"))) return f.dot;
	(S = f.usr).ToggleLight();
	return f.dot;
});

rt.type(11200, "/obj/screen/swarmer/ContactSwarmers", "/obj/screen/swarmer", {
	icon_state: "ui_contact_swarmers",
	name: "Contact swarmers",
	desc: "Sends a message to all other swarmers, should they exist.",
});

// swarmer.dm:62
rt.def("/obj/screen/swarmer/ContactSwarmers/proc/Click", function* Click(f: Frame) {
	let S: Value = null;
	if (!rt.istype(f.usr, T("/mob/living/simple_animal/hostile/swarmer"))) return f.dot;
	yield* (S = f.usr).ContactSwarmers();
	return f.dot;
}, true);

rt.type(78, "/datum/hud/swarmer", "/datum/hud", {});

// swarmer.dm:67
rt.def("/datum/hud/swarmer/proc/New", function* New(f: Frame, owner: Value) {
	let using: Value = null;
	yield* parent_proc();
	(using = (yield* new_(T("/obj/screen/swarmer/FabricateTrap")))).screen_loc = ui_hand_position(2);
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/swarmer/Barricade")))).screen_loc = ui_hand_position(1);
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/swarmer/Replicate")))).screen_loc = "EAST-1:28,SOUTH:5";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/swarmer/RepairSelf")))).screen_loc = "CENTER+1:18,SOUTH:5";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/swarmer/ToggleLight")))).screen_loc = "CENTER-2:14,SOUTH:5";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/swarmer/ContactSwarmers")))).screen_loc = "WEST:6,SOUTH:5";
	this.static_inventory += using;
	return f.dot;
}, true);

// swarmer.dm:96
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(this.client && !this.hud_used)) return f.dot;
	this.hud_used = (yield* new_(T("/datum/hud/swarmer"), this));
	return f.dot;
}, true);
