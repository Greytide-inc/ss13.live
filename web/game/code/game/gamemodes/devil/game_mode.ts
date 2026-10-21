// From code/game/gamemodes/devil/game_mode.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/game_mode/proc/auto_declare_completion_sintouched  (code/game/gamemodes/devil/game_mode.dm:7)
rt.def("/datum/game_mode/proc/auto_declare_completion_sintouched", function auto_declare_completion_sintouched(f: Frame) {
	let text: Value = null, sintouchedUnique: Value = null, S: Value = null, sintouched_mind: Value = null;
	let $e: any;
	f.vars = () => [text, sintouchedUnique, S, sintouched_mind, $e];
	text = "";
	if (truthy(rt.len(f, rt.sv(f, "sintouched")))) {
		text = rt.modify(live(text), "<br><span class='big'><b>The sintouched were:</b></span>", add);
		sintouchedUnique = rt.call(f, P("/proc/uniqueList"), null, [rt.sv(f, "sintouched")]);
		S = null;
		rt.forList(f, 0, live(sintouchedUnique));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			text = rt.modify(live(text), rt.callSrc(f, "printplayer", [(sintouched_mind = live(S))]), add);
			text = rt.modify(live(text), rt.callSrc(f, "printobjectives", [live(sintouched_mind)]), add);
			text = rt.modify(live(text), "<br>", add);
		}
		rt.endFor(f, 0);
		text = rt.modify(live(text), "<br>", add);
	}
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), live(text)]);
	return f.dot;
});

// /datum/game_mode/proc/auto_declare_completion_devils  (code/game/gamemodes/devil/game_mode.dm:20)
rt.def("/datum/game_mode/proc/auto_declare_completion_devils", function auto_declare_completion_devils(f: Frame) {
	let text: Value = null, D: Value = null, devil: Value = null;
	let $e: any;
	f.vars = () => [text, D, devil, $e];
	text = "";
	if (truthy(rt.len(f, rt.sv(f, "devils")))) {
		text = rt.modify(live(text), "<br><span class='big'><b>The devils were:</b></span>", add);
		D = null;
		rt.forList(f, 0, rt.sv(f, "devils"));
		while (($e = rt.next(f, 0)) !== undefined) {
			D = $e;
			text = rt.modify(live(text), rt.callSrc(f, "printplayer", [(devil = live(D))]), add);
			text = rt.modify(live(text), rt.callSrc(f, "printdevilinfo", [live(devil)]), add);
			text = rt.modify(live(text), rt.callSrc(f, "printobjectives", [live(devil)]), add);
			text = rt.modify(live(text), "<br>", add);
		}
		rt.endFor(f, 0);
		text = rt.modify(live(text), "<br>", add);
	}
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), live(text)]);
	return f.dot;
});

// /datum/game_mode/proc/add_devil_objectives  (code/game/gamemodes/devil/game_mode.dm:33)  may sleep
rt.def("/datum/game_mode/proc/add_devil_objectives", function* add_devil_objectives(f: Frame, devil_mind: Value, quantity: Value) {
	let validtypes: Value = null, i: Value = null, type: Value = null, objective: Value = null;
	let $e: any;
	f.vars = () => [devil_mind, quantity, validtypes, i, type, objective, $e];
	validtypes = rt.list(T("/datum/objective/devil/soulquantity"), T("/datum/objective/devil/soulquality"), T("/datum/objective/devil/sintouch"), T("/datum/objective/devil/buy_target"));
	i = null;
	rt.forRange(f, 0, 1, live(quantity), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		type = rt.op(f, "PickUnweighted", [1], [live(validtypes)]);
		rt.setFv(f, "owner", (objective = (yield* g.new_(f, live(type), [null]))), live(devil_mind));
		rt.modField(f, live(devil_mind), "objectives", live(objective), add);
		if (!truthy((rt.istype(live(objective), T("/datum/objective/devil/buy_target")) ? 1 : 0))) {
			(validtypes = rt.modify(live(validtypes), live(type), subtract));
		} else {
			yield* g.callName(f, live(objective), "find_target", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/game_mode/proc/printdevilinfo  (code/game/gamemodes/devil/game_mode.dm:45)
rt.def("/datum/game_mode/proc/printdevilinfo", function printdevilinfo(f: Frame, ply: Value) {
	let devilinfo: Value = null, text: Value = null;
	f.vars = () => [devilinfo, text];
	if (!truthy((devilinfo = rt.call(f, P("/proc/is_devil"), null, [live(ply)])))) {
		return "Target is not a devil.";
	}
	text = fmt("</br>The devil's true name is: ＀</br>", [rt.fv(f, "truename", live(devilinfo))]);
	text = rt.modify(live(text), "The devil's bans were:</br>", add);
	text = rt.modify(live(text), fmt("\t＀</br>", [rt.index(rt.index(rt.gl("lawlorify"), 1), rt.fv(f, "ban", live(devilinfo)))]), add);
	text = rt.modify(live(text), fmt("\t＀</br>", [rt.index(rt.index(rt.gl("lawlorify"), 1), rt.fv(f, "bane", live(devilinfo)))]), add);
	text = rt.modify(live(text), fmt("\t＀</br>", [rt.index(rt.index(rt.gl("lawlorify"), 1), rt.fv(f, "obligation", live(devilinfo)))]), add);
	return (text = rt.modify(live(text), fmt("\t＀</br></br>", [rt.index(rt.index(rt.gl("lawlorify"), 1), rt.fv(f, "banish", live(devilinfo)))]), add));
});

// /datum/game_mode/proc/update_devil_icons_added  (code/game/gamemodes/devil/game_mode.dm:57)
rt.def("/datum/game_mode/proc/update_devil_icons_added", function update_devil_icons_added(f: Frame, devil_mind: Value) {
	let hud: Value = null;
	f.vars = () => [hud];
	rt.callName(f, (hud = rt.index(rt.gl("huds"), 15)), "join_hud", [rt.fv(f, "current", live(devil_mind))]);
	rt.callSrc(f, "set_antag_hud", [rt.fv(f, "current", live(devil_mind)), "devil"]);
	return f.dot;
});

// /datum/game_mode/proc/update_devil_icons_removed  (code/game/gamemodes/devil/game_mode.dm:62)
rt.def("/datum/game_mode/proc/update_devil_icons_removed", function update_devil_icons_removed(f: Frame, devil_mind: Value) {
	let hud: Value = null;
	f.vars = () => [hud];
	rt.callName(f, (hud = rt.index(rt.gl("huds"), 15)), "leave_hud", [rt.fv(f, "current", live(devil_mind))]);
	rt.callSrc(f, "set_antag_hud", [rt.fv(f, "current", live(devil_mind)), null]);
	return f.dot;
});

// /datum/game_mode/proc/update_sintouched_icons_added  (code/game/gamemodes/devil/game_mode.dm:67)
rt.def("/datum/game_mode/proc/update_sintouched_icons_added", function update_sintouched_icons_added(f: Frame, sintouched_mind: Value) {
	let hud: Value = null;
	f.vars = () => [hud];
	rt.callName(f, (hud = rt.index(rt.gl("huds"), 16)), "join_hud", [rt.fv(f, "current", live(sintouched_mind))]);
	rt.callSrc(f, "set_antag_hud", [rt.fv(f, "current", live(sintouched_mind)), "sintouched"]);
	return f.dot;
});

// /datum/game_mode/proc/update_sintouched_icons_removed  (code/game/gamemodes/devil/game_mode.dm:72)
rt.def("/datum/game_mode/proc/update_sintouched_icons_removed", function update_sintouched_icons_removed(f: Frame, sintouched_mind: Value) {
	let hud: Value = null;
	f.vars = () => [hud];
	rt.callName(f, (hud = rt.index(rt.gl("huds"), 16)), "leave_hud", [rt.fv(f, "current", live(sintouched_mind))]);
	rt.callSrc(f, "set_antag_hud", [rt.fv(f, "current", live(sintouched_mind)), null]);
	return f.dot;
});

// /datum/game_mode/proc/update_soulless_icons_added  (code/game/gamemodes/devil/game_mode.dm:77)
rt.def("/datum/game_mode/proc/update_soulless_icons_added", function update_soulless_icons_added(f: Frame, soulless_mind: Value) {
	let hud: Value = null;
	f.vars = () => [hud];
	rt.callName(f, (hud = rt.index(rt.gl("huds"), 17)), "join_hud", [rt.fv(f, "current", live(soulless_mind))]);
	rt.callSrc(f, "set_antag_hud", [rt.fv(f, "current", live(soulless_mind)), "soulless"]);
	return f.dot;
});

// /datum/game_mode/proc/update_soulless_icons_removed  (code/game/gamemodes/devil/game_mode.dm:82)
rt.def("/datum/game_mode/proc/update_soulless_icons_removed", function update_soulless_icons_removed(f: Frame, soulless_mind: Value) {
	let hud: Value = null;
	f.vars = () => [hud];
	rt.callName(f, (hud = rt.index(rt.gl("huds"), 17)), "leave_hud", [rt.fv(f, "current", live(soulless_mind))]);
	rt.callSrc(f, "set_antag_hud", [rt.fv(f, "current", live(soulless_mind)), null]);
	return f.dot;
});
