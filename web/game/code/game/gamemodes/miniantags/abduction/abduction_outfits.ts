// Based on /tg/station's code/game/gamemodes/miniantags/abduction/abduction_outfits.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(616, "/datum/outfit/abductor", "/datum/outfit", {
	name: "Abductor Basic",
	uniform: rt.typePath("/obj/item/clothing/under/color/grey"),
	shoes: rt.typePath("/obj/item/clothing/shoes/combat"),
	back: rt.typePath("/obj/item/weapon/storage/backpack"),
	ears: rt.typePath("/obj/item/device/radio/headset/abductor"),
});

// abduction_outfits.dm:9
rt.def("/datum/outfit/abductor/proc/get_team_console", function get_team_console(f: Frame, team_number: Value) {
	let C: Value = null;
	for (C of each(GLOB.machines, T("/obj/machinery/abductor/console"))) {
		if (C.team == team_number) {
			return C;
		}
	}
	return f.dot;
});

// abduction_outfits.dm:14
rt.def("/datum/outfit/abductor/proc/link_to_console", function link_to_console(f: Frame, H: Value, team_number: Value) {
	let S: Value = null, console: Value = null, V: Value = null, B: Value = null, G: Value = null;
	if (!team_number && is_species(H, T("/datum/species/abductor"))) {
		team_number = (S = H.dna.species).team;
	}
	if (!team_number) {
		team_number = 1;
	}
	if (!(console = this.get_team_console(team_number))) return f.dot;
	if (V = rt.locateIn(f, T("/obj/item/clothing/suit/armor/abductor/vest"), H)) {
		console.AddVest(V);
		(rt.modField(f, V, "flags", NODROP, rt.bitOr));
	}
	if (!(B = rt.locateIn(f, T("/obj/item/weapon/storage/backpack"), H))) return f.dot;
	for (G of each(B.contents, T("/obj/item/device/abductor/gizmo"))) {
		console.AddGizmo(G);
	}
	return f.dot;
});

// abduction_outfits.dm:34
rt.def("/datum/outfit/abductor/proc/post_equip", function post_equip(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	parent_proc();
	if (f.args[1]) return f.dot;
	this.link_to_console(f.args[0]);
	return f.dot;
}, false, { args: ["H", "visualsOnly"] });

rt.type(617, "/datum/outfit/abductor/agent", "/datum/outfit/abductor", {
	name: "Abductor Agent",
	head: rt.typePath("/obj/item/clothing/head/helmet/abductor"),
	suit: rt.typePath("/obj/item/clothing/suit/armor/abductor/vest"),
	suit_store: rt.typePath("/obj/item/weapon/abductor_baton"),
	belt: rt.typePath("/obj/item/weapon/storage/belt/military/abductor/full"),
	backpack_contents: null,
});

// abduction_outfits.dm:46
rt.def("/datum/outfit/abductor/agent/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/gun/energy/alien"), 1, T("/obj/item/device/abductor/silencer"), 1]);
	return f.dot;
});

rt.type(618, "/datum/outfit/abductor/scientist", "/datum/outfit/abductor", {
	name: "Abductor Scientist",
	backpack_contents: null,
});

// abduction_outfits.dm:54
rt.def("/datum/outfit/abductor/scientist/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/device/abductor/gizmo"), 1]);
	return f.dot;
});

// abduction_outfits.dm:59
rt.def("/datum/outfit/abductor/scientist/proc/post_equip", function* post_equip(f: Frame) {
	let beamplant: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (f.args[1]) return f.dot;
	yield* (beamplant = (yield* new_(T("/obj/item/weapon/implant/abductor"), f.args[0]))).implant(f.args[0]);
	return f.dot;
}, true, { args: ["H", "visualsOnly"] });
