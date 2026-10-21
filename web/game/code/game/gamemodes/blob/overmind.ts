// From code/game/gamemodes/blob/overmind.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5100, "/mob/camera/blob", "/mob/camera", {
	blob_core: null,
	blob_points: 0,
	max_blob_points: 100,
	last_attack: 0,
	blob_reagent_datum: null,
	blob_mobs: null,
	resource_blobs: null,
	free_chem_rerolls: 1,
	nodes_required: 1,
	placed: 0,
	base_point_rate: 2,
	manualplace_min_time: 600,
	autoplace_max_time: 3600,
	pass_flags: 8,
	name: "Blob Overmind",
	real_name: "Blob Overmind",
	desc: "The overmind. It controls the blob.",
	icon: rt.rsc("icons/mob/blob.dmi"),
	icon_state: "marker",
	mouse_opacity: 1,
	move_on_shuttle: 1,
	see_in_dark: 8,
	invisibility: 60,
	layer: 5,
	faction: null,
	lighting_alpha: 128,
});

// /mob/camera/blob/proc/<init>  (code/game/gamemodes/blob/overmind.dm:20)
rt.def("/mob/camera/blob/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "blob_reagent_datum", rt.new_(f, T("/datum/reagent/blob"), []));
	$0 = $0;
	rt.setSv(f, "blob_mobs", rt.list());
	$0 = $0;
	rt.setSv(f, "resource_blobs", rt.list());
	$0 = $0;
	rt.setSv(f, "faction", rt.list("blob"));
	return f.dot;
});

// /mob/camera/blob/proc/Initialize  (code/game/gamemodes/blob/overmind.dm:31)  may sleep
rt.def("/mob/camera/blob/proc/Initialize", function* Initialize(f: Frame) {
	let new_name: Value = null, BC: Value = null;
	f.vars = () => [new_name, BC];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 60;
	}
	rt.setSv(f, "blob_points", live(f.args[3]));
	if (truthy(live(f.args[1]))) {
		rt.setSv(f, "manualplace_min_time", 0);
		rt.setSv(f, "autoplace_max_time", 0);
		rt.setSv(f, "placed", 1);
	} else {
		if (truthy(live(f.args[2]))) {
			rt.setSv(f, "manualplace_min_time", add(rt.worldTime(f), 1800));
		} else {
			rt.modSrcVar(f, "manualplace_min_time", rt.worldTime(f), add);
		}
		rt.modSrcVar(f, "autoplace_max_time", rt.worldTime(f), add);
	}
	rt.modGl("overminds", live(f.src), add);
	rt.setSv(f, "name", (new_name = fmt("＀ (＀)", [rt.initial(f, live(f.src), "name"), (yield* g.call(f, P("/proc/rand"), null, [1, 999]))])));
	rt.setSv(f, "real_name", live(new_name));
	rt.setSv(f, "last_attack", rt.worldTime(f));
	BC = rt.op(f, "PickUnweighted", [1], [subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/reagent/blob")])), T("/datum/reagent/blob"))]);
	rt.setSv(f, "blob_reagent_datum", (yield* g.new_(f, live(BC), [])));
	rt.setSv(f, "color", rt.fv(f, "complementary_color", rt.sv(f, "blob_reagent_datum")));
	if (truthy(rt.sv(f, "blob_core"))) {
		yield* g.callName(f, rt.sv(f, "blob_core"), "update_icon", []);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["mapload", "pre_placed", "mode_made", "starting_points"] });

// /mob/camera/blob/proc/Life  (code/game/gamemodes/blob/overmind.dm:56)  may sleep
rt.def("/mob/camera/blob/proc/Life", function* Life(f: Frame) {
	if (!truthy(rt.sv(f, "blob_core"))) {
		if (!truthy(rt.sv(f, "placed"))) {
			if ((truthy(rt.sv(f, "manualplace_min_time")) && rt.ge(rt.worldTime(f), rt.sv(f, "manualplace_min_time")))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<b><span class='big'><font color=\"#EE4000\">You may now place your blob core.</font></span></b>"]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='big'><font color=\"#EE4000\">You will automatically place your blob core in ＀ minutes.</font></span>", [(yield* g.call(f, P("/proc/round"), null, [divide(subtract(rt.sv(f, "autoplace_max_time"), rt.worldTime(f)), 600), 0.5]))])]);
				rt.setSv(f, "manualplace_min_time", 0);
			}
			if ((truthy(rt.sv(f, "autoplace_max_time")) && rt.ge(rt.worldTime(f), rt.sv(f, "autoplace_max_time")))) {
				yield* g.srcCall(f, "place_blob_core", rt.sv(f, "base_point_rate"), 1);
			}
		} else {
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { waitfor: false });

// /mob/camera/blob/proc/Destroy  (code/game/gamemodes/blob/overmind.dm:69)  may sleep
rt.def("/mob/camera/blob/proc/Destroy", function* Destroy(f: Frame) {
	let BL: Value = null, B: Value = null, BLO: Value = null, BM: Value = null;
	let $e: any;
	f.vars = () => [BL, B, BLO, BM, $e];
	BL = null;
	rt.forList(f, 0, rt.gl("blobs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		BL = $e;
		if ((truthy((B = live(BL))) && isEqual(rt.fv(f, "overmind", live(B)), live(f.src)))) {
			rt.setFv(f, "overmind", live(B), null);
			yield* g.callName(f, live(B), "update_icon", []);
		}
	}
	rt.endFor(f, 0);
	BLO = null;
	rt.forList(f, 0, rt.sv(f, "blob_mobs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		BLO = $e;
		if (truthy((BM = live(BLO)))) {
			rt.setFv(f, "overmind", live(BM), null);
			yield* g.callName(f, live(BM), "update_icons", []);
		}
	}
	rt.endFor(f, 0);
	(rt.modGl("overminds", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/camera/blob/proc/Login  (code/game/gamemodes/blob/overmind.dm:84)  may sleep
rt.def("/mob/camera/blob/proc/Login", function* Login(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "sync_mind");
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>You are the overmind!</span>"]);
	yield* g.srcCall(f, "blob_help");
	yield* g.srcCall(f, "update_health_hud");
	yield* g.srcCall(f, "add_points", 0);
	return f.dot;
}, true);

// /mob/camera/blob/proc/examine  (code/game/gamemodes/blob/overmind.dm:92)
rt.def("/mob/camera/blob/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "blob_reagent_datum"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("Its chemical is <font color=\"＀\">＀</font>.", [rt.fv(f, "color", rt.sv(f, "blob_reagent_datum")), rt.fv(f, "name", rt.sv(f, "blob_reagent_datum"))])]);
	return f.dot;
}, false, { args: ["user"] });

// /mob/camera/blob/proc/update_health_hud  (code/game/gamemodes/blob/overmind.dm:98)
rt.def("/mob/camera/blob/proc/update_health_hud", function update_health_hud(f: Frame) {
	let B: Value = null;
	let $e: any;
	f.vars = () => [B, $e];
	if (!truthy(rt.sv(f, "blob_core"))) return f.dot;
	rt.setFv(f, "maptext", rt.fv(f, "healths", rt.sv(f, "hud_used")), fmt("<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='#e36600'>＀</font></div>", [rt.call(f, P("/proc/round"), null, [rt.fv(f, "obj_integrity", rt.sv(f, "blob_core"))])]));
	B = null;
	rt.forList(f, 0, rt.sv(f, "blob_mobs"), T("/mob/living/simple_animal/hostile/blob/blobbernaut"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		if ((truthy(rt.fv(f, "hud_used", live(B))) && truthy(rt.gv(f, "blobpwrdisplay", rt.fv(f, "hud_used", live(B)))))) {
			rt.setFv(f, "maptext", rt.gv(f, "blobpwrdisplay", rt.fv(f, "hud_used", live(B))), fmt("<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='#82ed00'>＀</font></div>", [rt.call(f, P("/proc/round"), null, [rt.fv(f, "obj_integrity", rt.sv(f, "blob_core"))])]));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/camera/blob/proc/add_points  (code/game/gamemodes/blob/overmind.dm:104)
rt.def("/mob/camera/blob/proc/add_points", function add_points(f: Frame, points: Value) {
	rt.setSv(f, "blob_points", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "blob_points"), live(points)), rt.sv(f, "max_blob_points")])]));
	rt.setFv(f, "maptext", rt.fv(f, "blobpwrdisplay", rt.sv(f, "hud_used")), fmt("<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='#82ed00'>＀</font></div>", [rt.call(f, P("/proc/round"), null, [rt.sv(f, "blob_points")])]));
	return f.dot;
});

// /mob/camera/blob/proc/say  (code/game/gamemodes/blob/overmind.dm:108)
rt.def("/mob/camera/blob/proc/say", function say(f: Frame, message: Value) {
	if (!truthy(live(message))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "client", live(f.src)))) {
		if (truthy(rt.bitAnd(rt.gv(f, "muted", rt.fv(f, "prefs", rt.sv(f, "client"))), 1))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.src), "You cannot send IC messages (muted)."]);
			return live(f.dot);
		}
		if (truthy(rt.callName(f, rt.fv(f, "client", live(f.src)), "handle_spam_prevention", [live(message), 1]))) {
			return live(f.dot);
		}
	}
	if (truthy(rt.sv(f, "stat"))) {
		return live(f.dot);
	}
	rt.callSrc(f, "blob_talk", [live(message)]);
	return f.dot;
});

// /mob/camera/blob/proc/blob_talk  (code/game/gamemodes/blob/overmind.dm:124)
rt.def("/mob/camera/blob/proc/blob_talk", function blob_talk(f: Frame, message: Value) {
	let message_a: Value = null, rendered: Value = null, M: Value = null, link: Value = null;
	let $e: any;
	f.vars = () => [message, message_a, rendered, M, link, $e];
	rt.call(f, P("/proc/log_say"), null, [fmt("＀ : ＀", [rt.call(f, P("/proc/key_name"), null, [live(f.src)]), live(message)])]);
	if (!truthy((message = rt.call(f, P("/proc/trim"), null, [rt.call(f, P("/proc/copytext"), null, [rt.call(f, P("/proc/sanitize"), null, [live(message)]), 1, 1024])])))) {
		return live(f.dot);
	}
	message_a = rt.callSrc(f, "say_quote", [live(message), rt.callSrc(f, "get_spans", [])]);
	rendered = fmt("<span class='big'><font color=\"#EE4000\"><b>[Blob Telepathy] ＀(<font color=\"＀\">＀</font>)</b> ＀</font></span>", [rt.sv(f, "name"), rt.fv(f, "color", rt.sv(f, "blob_reagent_datum")), rt.fv(f, "name", rt.sv(f, "blob_reagent_datum")), live(message_a)]);
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((truthy((rt.istype(live(M), T("/mob/camera/blob")) ? 1 : 0)) || truthy((rt.istype(live(M), T("/mob/living/simple_animal/hostile/blob")) ? 1 : 0)))) {
			rt.call(f, P("/proc/to_chat"), null, [live(M), live(rendered)]);
		}
		if (truthy((rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0))) {
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(M), live(f.src)]);
			rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("＀ ＀", [live(link), live(rendered)])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/camera/blob/proc/Stat  (code/game/gamemodes/blob/overmind.dm:148)  may sleep
rt.def("/mob/camera/blob/proc/Stat", function* Stat(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Status"])))) return f.dot;
	if (truthy(rt.sv(f, "blob_core"))) {
		yield* g.call(f, P("/proc/stat"), null, [null, fmt("Core Health: ＀", [rt.fv(f, "obj_integrity", rt.sv(f, "blob_core"))])]);
	}
	yield* g.call(f, P("/proc/stat"), null, [null, fmt("Power Stored: ＀/＀", [rt.sv(f, "blob_points"), rt.sv(f, "max_blob_points")])]);
	if ((truthy(rt.gl("SSticker")) && truthy((rt.istype(rt.fv(f, "mode", rt.gl("SSticker")), T("/datum/game_mode/blob")) ? 1 : 0)))) {
		B = rt.fv(f, "mode", rt.gl("SSticker"));
		yield* g.call(f, P("/proc/stat"), null, [null, fmt("Blobs to Win: ＀/＀", [rt.len(f, rt.gl("blobs_legit")), rt.fv(f, "blobwincount", live(B))])]);
	} else {
		yield* g.call(f, P("/proc/stat"), null, [null, fmt("Total Blobs: ＀", [rt.len(f, rt.gl("blobs"))])]);
	}
	if (truthy(rt.sv(f, "free_chem_rerolls"))) {
		yield* g.call(f, P("/proc/stat"), null, [null, fmt("You have ＀ Free Chemical Reroll５ Remaining", [rt.sv(f, "free_chem_rerolls")])]);
	}
	if (truthy(rt.sv(f, "placed"))) return f.dot;
	if (truthy(rt.sv(f, "manualplace_min_time"))) {
		yield* g.call(f, P("/proc/stat"), null, [null, fmt("Time Before Manual Placement: ＀", [(yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/round"), null, [multiply(subtract(rt.sv(f, "manualplace_min_time"), rt.worldTime(f)), 0.10000000149011612), 0.10000000149011612])), 0]))])]);
	}
	yield* g.call(f, P("/proc/stat"), null, [null, fmt("Time Before Automatic Placement: ＀", [(yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/round"), null, [multiply(subtract(rt.sv(f, "autoplace_max_time"), rt.worldTime(f)), 0.10000000149011612), 0.10000000149011612])), 0]))])]);
	return f.dot;
}, true);

// /mob/camera/blob/proc/Move  (code/game/gamemodes/blob/overmind.dm:167)
rt.def("/mob/camera/blob/proc/Move", function Move(f: Frame, NewLoc: Value, Dir: Value) {
	let B: Value = null, A: Value = null;
	f.vars = () => [Dir, B, A];
	if (live(Dir) === null) {
		Dir = 0;
	}
	if (truthy(rt.sv(f, "placed"))) {
		if (truthy((B = rt.locateIn(f, T("/obj/structure/blob"), rt.call(f, P("/proc/range"), null, ["3x3", live(NewLoc)]))))) {
			rt.setSv(f, "loc", live(NewLoc));
		} else {
			return 0;
		}
	} else {
		A = rt.call(f, P("/proc/get_area"), null, [live(NewLoc)]);
		if ((truthy((rt.istype(live(NewLoc), T("/turf/open/space")) ? 1 : 0)) || truthy((rt.istype(live(A), T("/area/shuttle")) ? 1 : 0)))) {
			return 0;
		}
		rt.setSv(f, "loc", live(NewLoc));
		return 1;
	}
	return f.dot;
});
