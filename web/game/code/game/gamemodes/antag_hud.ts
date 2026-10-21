// From code/game/gamemodes/antag_hud.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(563, "/datum/atom_hud/antag", "/datum/atom_hud", {
	self_visible: 1,
	hud_icons: null,
});

// /datum/atom_hud/antag/proc/<init>  (code/game/gamemodes/antag_hud.dm:2)
rt.def("/datum/atom_hud/antag/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "hud_icons", rt.list("15"));
	return f.dot;
});

// /datum/atom_hud/antag/proc/join_hud  (code/game/gamemodes/antag_hud.dm:10)
rt.def("/datum/atom_hud/antag/proc/join_hud", function join_hud(f: Frame, M: Value) {
	if (!truthy((rt.istype(live(M), T("/mob")) ? 1 : 0))) {
		rt.call(f, P("/proc/CRASH"), null, [fmt("join_hud(): ＀ (＀) is not a mob!", [live(M), rt.fv(f, "type", live(M))])]);
	}
	if (truthy(rt.gv(f, "antag_hud", rt.fv(f, "mind", live(M))))) {
		rt.callName(f, rt.gv(f, "antag_hud", rt.fv(f, "mind", live(M))), "leave_hud", [live(M)]);
	}
	rt.callSrc(f, "add_to_hud", [live(M)]);
	if (truthy(rt.sv(f, "self_visible"))) {
		rt.callSrc(f, "add_hud_to", [live(M)]);
	}
	rt.setFv(f, "antag_hud", rt.fv(f, "mind", live(M)), live(f.src));
	return f.dot;
});

// /datum/atom_hud/antag/proc/leave_hud  (code/game/gamemodes/antag_hud.dm:20)
rt.def("/datum/atom_hud/antag/proc/leave_hud", function leave_hud(f: Frame, M: Value) {
	if (!truthy(live(M))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(M), T("/mob")) ? 1 : 0))) {
		rt.call(f, P("/proc/CRASH"), null, [fmt("leave_hud(): ＀ (＀) is not a mob!", [live(M), rt.fv(f, "type", live(M))])]);
	}
	rt.callSrc(f, "remove_from_hud", [live(M)]);
	rt.callSrc(f, "remove_hud_from", [live(M)]);
	if (!truthy(rt.fv(f, "mind", live(M)))) return f.dot;
	rt.setFv(f, "antag_hud", rt.fv(f, "mind", live(M)), null);
	return f.dot;
});

// /datum/game_mode/proc/set_antag_hud  (code/game/gamemodes/antag_hud.dm:33)
rt.def("/datum/game_mode/proc/set_antag_hud", function set_antag_hud(f: Frame, M: Value, new_icon_state: Value) {
	let holder: Value = null;
	f.vars = () => [holder];
	if (!truthy((rt.istype(live(M), T("/mob")) ? 1 : 0))) {
		rt.call(f, P("/proc/CRASH"), null, [fmt("set_antag_hud(): ＀ (＀) is not a mob!", [live(M), rt.fv(f, "type", live(M))])]);
	}
	if (truthy((holder = rt.index(rt.fv(f, "hud_list", live(M)), "15")))) {
		rt.setFv(f, "icon_state", live(holder), live(new_icon_state));
	}
	if (!(truthy(rt.fv(f, "mind", live(M))) || truthy(live(new_icon_state)))) return f.dot;
	rt.setFv(f, "antag_hud_icon_state", rt.fv(f, "mind", live(M)), live(new_icon_state));
	return f.dot;
});

// /datum/mind/proc/transfer_antag_huds  (code/game/gamemodes/antag_hud.dm:45)
rt.def("/datum/mind/proc/transfer_antag_huds", function transfer_antag_huds(f: Frame, newhud: Value) {
	rt.callSrc(f, "leave_all_antag_huds", []);
	rt.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "set_antag_hud", [rt.sv(f, "current"), rt.sv(f, "antag_hud_icon_state")]);
	if (!truthy(live(newhud))) return f.dot;
	rt.callName(f, live(newhud), "join_hud", [rt.sv(f, "current")]);
	return f.dot;
});

// /datum/mind/proc/leave_all_antag_huds  (code/game/gamemodes/antag_hud.dm:51)
rt.def("/datum/mind/proc/leave_all_antag_huds", function leave_all_antag_huds(f: Frame) {
	let hud: Value = null;
	let $e: any;
	f.vars = () => [hud, $e];
	hud = null;
	rt.forList(f, 0, rt.gl("huds"), T("/datum/atom_hud/antag"));
	while (($e = rt.next(f, 0)) !== undefined) {
		hud = $e;
		if (truthy(rt.index(rt.fv(f, "hudusers", live(hud)), rt.sv(f, "current")))) {
			rt.callName(f, live(hud), "leave_hud", [rt.sv(f, "current")]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(565, "/datum/atom_hud/antag/gang", "/datum/atom_hud/antag", {
	color: null,
});

// /datum/atom_hud/antag/gang/proc/add_to_hud  (code/game/gamemodes/antag_hud.dm:59)
rt.def("/datum/atom_hud/antag/gang/proc/add_to_hud", function add_to_hud(f: Frame) {
	let holder: Value = null;
	f.vars = () => [holder];
	if (!truthy(live(f.args[0]))) {
		return live(f.dot);
	}
	if (truthy((holder = rt.index(rt.fv(f, "hud_list", live(f.args[0])), "15")))) {
		rt.setFv(f, "color", live(holder), rt.sv(f, "color"));
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["A"] });

// /datum/atom_hud/antag/gang/proc/remove_from_hud  (code/game/gamemodes/antag_hud.dm:67)
rt.def("/datum/atom_hud/antag/gang/proc/remove_from_hud", function remove_from_hud(f: Frame) {
	let holder: Value = null;
	f.vars = () => [holder];
	if (!truthy(live(f.args[0]))) {
		return live(f.dot);
	}
	if (truthy((holder = rt.index(rt.fv(f, "hud_list", live(f.args[0])), "15")))) {
		rt.setFv(f, "color", live(holder), null);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["A"] });

// /datum/atom_hud/antag/gang/proc/join_hud  (code/game/gamemodes/antag_hud.dm:75)
rt.def("/datum/atom_hud/antag/gang/proc/join_hud", function join_hud(f: Frame) {
	let holder: Value = null;
	f.vars = () => [holder];
	if (!truthy((rt.istype(live(f.args[0]), T("/mob")) ? 1 : 0))) {
		rt.call(f, P("/proc/CRASH"), null, [fmt("join_hud(): ＀ (＀) is not a mob!", [live(f.args[0]), rt.fv(f, "type", live(f.args[0]))])]);
	}
	if (truthy((holder = rt.index(rt.fv(f, "hud_list", live(f.args[0])), "15")))) {
		rt.setFv(f, "color", live(holder), rt.sv(f, "color"));
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["M"] });

// /datum/atom_hud/antag/gang/proc/leave_hud  (code/game/gamemodes/antag_hud.dm:83)
rt.def("/datum/atom_hud/antag/gang/proc/leave_hud", function leave_hud(f: Frame) {
	let holder: Value = null;
	f.vars = () => [holder];
	if (!truthy((rt.istype(live(f.args[0]), T("/mob")) ? 1 : 0))) {
		rt.call(f, P("/proc/CRASH"), null, [fmt("leave_hud(): ＀ (＀) is not a mob!", [live(f.args[0]), rt.fv(f, "type", live(f.args[0]))])]);
	}
	if (truthy((holder = rt.index(rt.fv(f, "hud_list", live(f.args[0])), "15")))) {
		rt.setFv(f, "color", live(holder), null);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["M"] });
