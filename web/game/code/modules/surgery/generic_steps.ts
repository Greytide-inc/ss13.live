// Based on /tg/station's code/modules/surgery/generic_steps.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1334, "/datum/surgery_step/incise", "/datum/surgery_step", {
	name: "make incision",
	implements: null,
	time: 16,
});

// generic_steps.dm:5
rt.def("/datum/surgery_step/incise/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implements = rt.alist(f, [T("/obj/item/weapon/scalpel"), 100, T("/obj/item/weapon/melee/energy/sword"), 75, T("/obj/item/weapon/kitchen/knife"), 65, T("/obj/item/weapon/shard"), 45, T("/obj/item"), 30]);
	return f.dot;
});

// generic_steps.dm:10
rt.def("/datum/surgery_step/incise/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	user.visible_message(`${user} begins to make an incision in ${target}'s ${parse_zone(target_zone)}.`, `<span class='notice'>You begin to make an incision in ${target}'s ${parse_zone(target_zone)}...</span>`);
	return f.dot;
});

// generic_steps.dm:14
rt.def("/datum/surgery_step/incise/proc/tool_check", function tool_check(f: Frame, user: Value, tool: Value) {
	if (this.implement_type == T("/obj/item") && !tool.is_sharp()) {
		return 0;
	}
	return 1;
});

rt.type(1335, "/datum/surgery_step/clamp_bleeders", "/datum/surgery_step", {
	name: "clamp bleeders",
	implements: null,
	time: 24,
});

// generic_steps.dm:22
rt.def("/datum/surgery_step/clamp_bleeders/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implements = rt.alist(f, [T("/obj/item/weapon/hemostat"), 100, T("/obj/item/weapon/wirecutters"), 60, T("/obj/item/stack/packageWrap"), 35, T("/obj/item/stack/cable_coil"), 15]);
	return f.dot;
});

// generic_steps.dm:26
rt.def("/datum/surgery_step/clamp_bleeders/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	user.visible_message(`${user} begins to clamp bleeders in ${target}'s ${parse_zone(target_zone)}.`, `<span class='notice'>You begin to clamp bleeders in ${target}'s ${parse_zone(target_zone)}...</span>`);
	return f.dot;
});

// generic_steps.dm:30
rt.def("/datum/surgery_step/clamp_bleeders/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	if (rt.locateIn(f, T("/datum/surgery_step/saw"), surgery.steps)) {
		yield* target.heal_bodypart_damage(20, 0);
	}
	return (yield* parent_proc());
}, true);

rt.type(1336, "/datum/surgery_step/retract_skin", "/datum/surgery_step", {
	name: "retract skin",
	implements: null,
	time: 24,
});

// generic_steps.dm:38
rt.def("/datum/surgery_step/retract_skin/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implements = rt.alist(f, [T("/obj/item/weapon/retractor"), 100, T("/obj/item/weapon/screwdriver"), 45, T("/obj/item/weapon/wirecutters"), 35]);
	return f.dot;
});

// generic_steps.dm:42
rt.def("/datum/surgery_step/retract_skin/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	user.visible_message(`${user} begins to retract the skin in ${target}'s ${parse_zone(target_zone)}.`, `<span class='notice'>You begin to retract the skin in ${target}'s ${parse_zone(target_zone)}...</span>`);
	return f.dot;
});

rt.type(1337, "/datum/surgery_step/close", "/datum/surgery_step", {
	name: "mend incision",
	implements: null,
	time: 24,
});

// generic_steps.dm:50
rt.def("/datum/surgery_step/close/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implements = rt.alist(f, [T("/obj/item/weapon/cautery"), 100, T("/obj/item/weapon/gun/energy/laser"), 90, T("/obj/item/weapon/weldingtool"), 70, T("/obj/item/weapon/lighter"), 45, T("/obj/item/weapon/match"), 20]);
	return f.dot;
});

// generic_steps.dm:55
rt.def("/datum/surgery_step/close/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	user.visible_message(`${user} begins to mend the incision in ${target}'s ${parse_zone(target_zone)}.`, `<span class='notice'>You begin to mend the incision in ${target}'s ${parse_zone(target_zone)}...</span>`);
	return f.dot;
});

// generic_steps.dm:60
rt.def("/datum/surgery_step/close/proc/tool_check", function tool_check(f: Frame, user: Value, tool: Value) {
	let WT: Value = null, L: Value = null, M: Value = null;
	if (rt.istype(tool, T("/obj/item/weapon/cautery"))) {
		return 1;
	}
	if (rt.istype(tool, T("/obj/item/weapon/weldingtool"))) {
		if ((WT = tool).isOn()) {
			return 1;
		}
	} else if (rt.istype(tool, T("/obj/item/weapon/lighter"))) {
		if ((L = tool).lit) {
			return 1;
		}
	} else if (rt.istype(tool, T("/obj/item/weapon/match"))) {
		if ((M = tool).lit) {
			return 1;
		}
	}
	return 0;
});

// generic_steps.dm:81
rt.def("/datum/surgery_step/close/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	if (rt.locateIn(f, T("/datum/surgery_step/saw"), surgery.steps)) {
		yield* target.heal_bodypart_damage(45, 0);
	}
	return (yield* parent_proc());
}, true);

rt.type(1338, "/datum/surgery_step/saw", "/datum/surgery_step", {
	name: "saw bone",
	implements: null,
	time: 54,
});

// generic_steps.dm:90
rt.def("/datum/surgery_step/saw/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implements = rt.alist(f, [T("/obj/item/weapon/circular_saw"), 100, T("/obj/item/weapon/melee/energy/sword/cyborg/saw"), 100, T("/obj/item/weapon/melee/arm_blade"), 75, T("/obj/item/weapon/mounted_chainsaw"), 65, T("/obj/item/weapon/twohanded/required/chainsaw"), 50, T("/obj/item/weapon/twohanded/fireaxe"), 50, T("/obj/item/weapon/hatchet"), 35, T("/obj/item/weapon/kitchen/knife/butcher"), 25]);
	return f.dot;
});

// generic_steps.dm:96
rt.def("/datum/surgery_step/saw/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	user.visible_message(`${user} begins to saw through the bone in ${target}'s ${parse_zone(target_zone)}.`, `<span class='notice'>You begin to saw through the bone in ${target}'s ${parse_zone(target_zone)}...</span>`);
	return f.dot;
});

// generic_steps.dm:100
rt.def("/datum/surgery_step/saw/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	yield* target.apply_damage(50, "brute", `${target_zone}`);
	user.visible_message(`${user} saws ${target}'s ${parse_zone(target_zone)} open!`, `<span class='notice'>You saw ${target}'s ${parse_zone(target_zone)} open.</span>`);
	return 1;
}, true);

rt.type(1339, "/datum/surgery_step/drill", "/datum/surgery_step", {
	name: "drill bone",
	implements: null,
	time: 30,
});

// generic_steps.dm:108
rt.def("/datum/surgery_step/drill/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implements = rt.alist(f, [T("/obj/item/weapon/surgicaldrill"), 100, T("/obj/item/weapon/pickaxe/drill"), 60, T("/obj/item/mecha_parts/mecha_equipment/drill"), 60, T("/obj/item/weapon/screwdriver"), 20]);
	return f.dot;
});

// generic_steps.dm:112
rt.def("/datum/surgery_step/drill/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	user.visible_message(`${user} begins to drill into the bone in ${target}'s ${parse_zone(target_zone)}.`, `<span class='notice'>You begin to drill into the bone in ${target}'s ${parse_zone(target_zone)}...</span>`);
	return f.dot;
});

// generic_steps.dm:116
rt.def("/datum/surgery_step/drill/proc/success", function success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	user.visible_message(`${user} drills into ${target}'s ${parse_zone(target_zone)}!`, `<span class='notice'>You drill into ${target}'s ${parse_zone(target_zone)}.</span>`);
	return 1;
});
