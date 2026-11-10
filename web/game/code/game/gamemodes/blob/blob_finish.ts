// Based on /tg/station's code/game/gamemodes/blob/blob_finish.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// blob_finish.dm:2
rt.def("/datum/game_mode/blob/proc/check_finished", function* check_finished(f: Frame) {
	let blob: Value = null, B: Value = null;
	if (this.blobwincount <= rt.len(f, GLOB.blobs_legit)) {
		return 1;
	}
	for (blob of each(this.blob_overminds, T("/datum/mind"))) {
		if (rt.istype(blob.current, T("/mob/camera/blob"))) {
			if ((B = blob.current).blob_core || !B.placed) {
				return 0;
			}
		}
	}
	if (!rt.len(f, GLOB.blob_cores)) {
		if (rt.index(GLOB.config.continuous, "blob")) {
			this.message_sent = 0;
			this.continuous_sanity_checked = 1;
			yield* GLOB.SSshuttle.clearHostileEnvironment(this);
			return (yield* parent_proc());
		}
		return 1;
	}
	return (yield* parent_proc());
}, true);

// blob_finish.dm:21
rt.def("/datum/game_mode/blob/proc/declare_completion", function declare_completion(f: Frame) {
	if (this.round_converted) {
		parent_proc();
	}
	if (this.blobwincount <= rt.len(f, GLOB.blobs_legit)) {
		GLOB.SSticker.mode_result = "win - blob took over";
		to_chat(rt.world(), "<FONT size = 3><B>The blob has taken over the station!</B></FONT>");
		to_chat(rt.world(), "<B>The entire station was eaten by the Blob!</B>");
		log_game("Blob mode completed with a blob victory.");
		GLOB.SSticker.news_report = 8;
	} else if (this.station_was_nuked) {
		GLOB.SSticker.mode_result = "halfwin - nuke";
		to_chat(rt.world(), "<FONT size = 3><B>Partial Win: The station has been destroyed!</B></FONT>");
		to_chat(rt.world(), "<B>Directive 7-12 has been successfully carried out, preventing the Blob from spreading.</B>");
		log_game("Blob mode completed with a tie (station destroyed).");
		GLOB.SSticker.news_report = 9;
	} else if (!rt.len(f, GLOB.blob_cores)) {
		GLOB.SSticker.mode_result = "loss - blob eliminated";
		to_chat(rt.world(), "<FONT size = 3><B>The staff has won!</B></FONT>");
		to_chat(rt.world(), "<B>The alien organism has been eradicated from the station!</B>");
		log_game("Blob mode completed with a crew victory.");
		GLOB.SSticker.news_report = 10;
	}
	parent_proc();
	return 1;
});

// blob_finish.dm:50
rt.def("/datum/game_mode/blob/proc/printplayer", function printplayer(f: Frame, ply: Value, fleecheck: Value) {
	let text: Value = null, B: Value = null;
	if (rt.isIn(f, ply, this.blob_overminds)) {
		text = `<br><b>${ply.key}</b> was <b>${ply.name}</b>`;
		if (rt.istype(ply.current, T("/mob/camera/blob"))) {
			text += `<b>(<font color="${(B = ply.current).blob_reagent_datum.color}">${B.blob_reagent_datum.name}</font>)</b> and`;
			if (B.blob_core) {
				text += " <span class='greenannounce'>survived</span>";
			} else {
				text += " <span class='boldannounce'>was destroyed</span>";
			}
		} else {
			text += " and <span class='boldannounce'>was destroyed</span>";
		}
		return text;
	}
	return parent_proc();
}, false);

// blob_finish.dm:65
rt.def("/datum/game_mode/proc/auto_declare_completion_blob", function auto_declare_completion_blob(f: Frame) {
	let blob_mode: Value = null, text: Value = null, blob: Value = null;
	let $e: any;
	if (!rt.istype(GLOB.SSticker.mode, T("/datum/game_mode/blob"))) return f.dot;
	if (rt.len(f, (blob_mode = this).blob_overminds)) {
		text = `<FONT size = 2><B>The blob${rt.len(f, blob_mode.blob_overminds) > 1 ? "s were" : " was"}:</B></FONT>`;
		for (blob of each(blob_mode.blob_overminds, T("/datum/mind"))) {
			text += this.printplayer(blob);
		}
		to_chat(rt.world(), text);
	}
	return 1;
});
