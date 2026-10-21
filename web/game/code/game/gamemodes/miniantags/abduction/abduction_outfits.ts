// From code/game/gamemodes/miniantags/abduction/abduction_outfits.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(616, "/datum/outfit/abductor", "/datum/outfit", {
	name: "Abductor Basic",
	uniform: rt.typePath("/obj/item/clothing/under/color/grey"),
	shoes: rt.typePath("/obj/item/clothing/shoes/combat"),
	back: rt.typePath("/obj/item/weapon/storage/backpack"),
	ears: rt.typePath("/obj/item/device/radio/headset/abductor"),
});

// /datum/outfit/abductor/proc/get_team_console  (code/game/gamemodes/miniantags/abduction/abduction_outfits.dm:9)
rt.def("/datum/outfit/abductor/proc/get_team_console", function get_team_console(f: Frame, team_number: Value) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	C = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/abductor/console"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (isEqual(rt.fv(f, "team", live(C)), live(team_number))) {
			return live(C);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/outfit/abductor/proc/link_to_console  (code/game/gamemodes/miniantags/abduction/abduction_outfits.dm:14)
rt.def("/datum/outfit/abductor/proc/link_to_console", function link_to_console(f: Frame, H: Value, team_number: Value) {
	let S: Value = null, console: Value = null, V: Value = null, B: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [team_number, S, console, V, B, G, $e];
	if ((!truthy(live(team_number)) && truthy(rt.call(f, P("/proc/is_species"), null, [live(H), T("/datum/species/abductor")])))) {
		team_number = rt.gv(f, "team", (S = rt.gv(f, "species", rt.fv(f, "dna", live(H)))));
	}
	if (!truthy(live(team_number))) {
		team_number = 1;
	}
	if (!truthy((console = rt.callSrc(f, "get_team_console", [live(team_number)])))) return f.dot;
	if (truthy((V = rt.locateIn(f, T("/obj/item/clothing/suit/armor/abductor/vest"), live(H))))) {
		rt.callName(f, live(console), "AddVest", [live(V)]);
		(rt.modField(f, live(V), "flags", 2, rt.bitOr));
	}
	if (!truthy((B = rt.locateIn(f, T("/obj/item/weapon/storage/backpack"), live(H))))) return f.dot;
	G = null;
	rt.forList(f, 0, rt.fv(f, "contents", live(B)), T("/obj/item/device/abductor/gizmo"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		rt.callName(f, live(console), "AddGizmo", [live(G)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/outfit/abductor/proc/post_equip  (code/game/gamemodes/miniantags/abduction/abduction_outfits.dm:34)
rt.def("/datum/outfit/abductor/proc/post_equip", function post_equip(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) return f.dot;
	rt.callSrc(f, "link_to_console", [live(f.args[0])]);
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

// /datum/outfit/abductor/agent/proc/<init>  (code/game/gamemodes/miniantags/abduction/abduction_outfits.dm:46)
rt.def("/datum/outfit/abductor/agent/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/gun/energy/alien"), 1, T("/obj/item/device/abductor/silencer"), 1]));
	return f.dot;
});

rt.type(618, "/datum/outfit/abductor/scientist", "/datum/outfit/abductor", {
	name: "Abductor Scientist",
	backpack_contents: null,
});

// /datum/outfit/abductor/scientist/proc/<init>  (code/game/gamemodes/miniantags/abduction/abduction_outfits.dm:54)
rt.def("/datum/outfit/abductor/scientist/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/device/abductor/gizmo"), 1]));
	return f.dot;
});

// /datum/outfit/abductor/scientist/proc/post_equip  (code/game/gamemodes/miniantags/abduction/abduction_outfits.dm:59)  may sleep
rt.def("/datum/outfit/abductor/scientist/proc/post_equip", function* post_equip(f: Frame) {
	let beamplant: Value = null;
	f.vars = () => [beamplant];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) return f.dot;
	yield* g.callName(f, (beamplant = (yield* g.new_(f, T("/obj/item/weapon/implant/abductor"), [live(f.args[0])]))), "implant", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["H", "visualsOnly"] });
