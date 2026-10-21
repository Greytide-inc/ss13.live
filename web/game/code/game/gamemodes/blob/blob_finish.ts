// From code/game/gamemodes/blob/blob_finish.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/game_mode/blob/proc/check_finished  (code/game/gamemodes/blob/blob_finish.dm:2)  may sleep
rt.def("/datum/game_mode/blob/proc/check_finished", function* check_finished(f: Frame) {
	let blob: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [blob, B, $e];
	if (rt.le(rt.sv(f, "blobwincount"), rt.len(f, rt.gl("blobs_legit")))) {
		return 1;
	}
	blob = null;
	rt.forList(f, 0, rt.sv(f, "blob_overminds"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		blob = $e;
		if (truthy((rt.istype(rt.fv(f, "current", live(blob)), T("/mob/camera/blob")) ? 1 : 0))) {
			if ((truthy(rt.gv(f, "blob_core", (B = rt.fv(f, "current", live(blob))))) || !truthy(rt.fv(f, "placed", live(B))))) {
				return 0;
			}
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, rt.gl("blob_cores")))) {
		if (truthy(rt.index(rt.fv(f, "continuous", rt.gl("config")), "blob"))) {
			rt.setSv(f, "message_sent", 0);
			rt.setSv(f, "continuous_sanity_checked", 1);
			yield* g.callName(f, rt.gl("SSshuttle"), "clearHostileEnvironment", [live(f.src)]);
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
		return 1;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/game_mode/blob/proc/declare_completion  (code/game/gamemodes/blob/blob_finish.dm:21)
rt.def("/datum/game_mode/blob/proc/declare_completion", function declare_completion(f: Frame) {
	if (truthy(rt.sv(f, "round_converted"))) {
		rt.callSuper(f, [], rt.Args.Same);
	}
	if (rt.le(rt.sv(f, "blobwincount"), rt.len(f, rt.gl("blobs_legit")))) {
		rt.setFv(f, "mode_result", rt.gl("SSticker"), "win - blob took over");
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<FONT size = 3><B>The blob has taken over the station!</B></FONT>"]);
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>The entire station was eaten by the Blob!</B>"]);
		rt.call(f, P("/proc/log_game"), null, ["Blob mode completed with a blob victory."]);
		rt.setFv(f, "news_report", rt.gl("SSticker"), 8);
	} else {
		if (truthy(rt.sv(f, "station_was_nuked"))) {
			rt.setFv(f, "mode_result", rt.gl("SSticker"), "halfwin - nuke");
			rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<FONT size = 3><B>Partial Win: The station has been destroyed!</B></FONT>"]);
			rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>Directive 7-12 has been successfully carried out, preventing the Blob from spreading.</B>"]);
			rt.call(f, P("/proc/log_game"), null, ["Blob mode completed with a tie (station destroyed)."]);
			rt.setFv(f, "news_report", rt.gl("SSticker"), 9);
		} else {
			if (!truthy(rt.len(f, rt.gl("blob_cores")))) {
				rt.setFv(f, "mode_result", rt.gl("SSticker"), "loss - blob eliminated");
				rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<FONT size = 3><B>The staff has won!</B></FONT>"]);
				rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>The alien organism has been eradicated from the station!</B>"]);
				rt.call(f, P("/proc/log_game"), null, ["Blob mode completed with a crew victory."]);
				rt.setFv(f, "news_report", rt.gl("SSticker"), 10);
			}
		}
	}
	rt.callSuper(f, [], rt.Args.Same);
	return 1;
});

// /datum/game_mode/blob/proc/printplayer  (code/game/gamemodes/blob/blob_finish.dm:50)
rt.def("/datum/game_mode/blob/proc/printplayer", function printplayer(f: Frame) {
	let text: Value = null, B: Value = null;
	f.vars = () => [text, B];
	if (truthy((rt.isIn(f, live(f.args[0]), rt.sv(f, "blob_overminds")) ? 1 : 0))) {
		text = fmt("<br><b>＀</b> was <b>＀</b>", [rt.fv(f, "key", live(f.args[0])), rt.fv(f, "name", live(f.args[0]))]);
		if (truthy((rt.istype(rt.fv(f, "current", live(f.args[0])), T("/mob/camera/blob")) ? 1 : 0))) {
			text = rt.modify(live(text), fmt("<b>(<font color=\"＀\">＀</font>)</b> and", [rt.gv(f, "color", rt.gv(f, "blob_reagent_datum", (B = rt.fv(f, "current", live(f.args[0]))))), rt.gv(f, "name", rt.fv(f, "blob_reagent_datum", live(B)))]), add);
			if (truthy(rt.fv(f, "blob_core", live(B)))) {
				text = rt.modify(live(text), " <span class='greenannounce'>survived</span>", add);
			} else {
				text = rt.modify(live(text), " <span class='boldannounce'>was destroyed</span>", add);
			}
		} else {
			text = rt.modify(live(text), " and <span class='boldannounce'>was destroyed</span>", add);
		}
		return live(text);
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["ply", "fleecheck"] });

// /datum/game_mode/proc/auto_declare_completion_blob  (code/game/gamemodes/blob/blob_finish.dm:65)
rt.def("/datum/game_mode/proc/auto_declare_completion_blob", function auto_declare_completion_blob(f: Frame) {
	let blob_mode: Value = null, text: Value = null, blob: Value = null;
	let $0: any, $e: any;
	f.vars = () => [blob_mode, text, blob, $0, $e];
	if (!truthy((rt.istype(rt.fv(f, "mode", rt.gl("SSticker")), T("/datum/game_mode/blob")) ? 1 : 0))) return f.dot;
	if (truthy(rt.getLen(f, rt.gv(f, "blob_overminds", (blob_mode = live(f.src)))))) {
		if (rt.gt(rt.getLen(f, rt.fv(f, "blob_overminds", live(blob_mode))), 1)) {
			$0 = "s were";
		} else {
			$0 = " was";
		}
		text = fmt("<FONT size = 2><B>The blob＀:</B></FONT>", [$0]);
		blob = null;
		rt.forList(f, 0, rt.fv(f, "blob_overminds", live(blob_mode)), T("/datum/mind"));
		while (($e = rt.next(f, 0)) !== undefined) {
			blob = $e;
			text = rt.modify(live(text), rt.callSrc(f, "printplayer", [live(blob)]), add);
		}
		rt.endFor(f, 0);
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), live(text)]);
	}
	return 1;
});
