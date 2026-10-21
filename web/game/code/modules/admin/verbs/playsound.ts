// From code/modules/admin/verbs/playsound.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/proc/play_sound  (code/modules/admin/verbs/playsound.dm:4)  may sleep
rt.def("/client/proc/play_sound", function* play_sound(f: Frame, S: Value) {
	let freq: Value = null, admin_sound: Value = null, res: Value = null, M: Value = null;
	let $0: any, $e: any;
	f.vars = () => [S, freq, admin_sound, res, M, $0, $e];
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2048])))) {
		return live(f.dot);
	}
	freq = 1;
	if ((truthy(rt.fv(f, "holidays", rt.gl("SSevents"))) && truthy(rt.index(rt.fv(f, "holidays", rt.gl("SSevents")), "April Fool's Day")))) {
		freq = rt.op(f, "PickUnweighted", [12], [0.5, 0.699999988079071, 0.800000011920929, 0.8500000238418579, 0.8999999761581421, 0.949999988079071, 1.100000023841858, 1.2000000476837158, 1.399999976158142, 1.600000023841858, 2, 2.5]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "You feel the Honkmother messing with your song..."]);
	}
	rt.setFv(f, "file", (admin_sound = (yield* g.new_(f, T("/sound"), []))), live(S));
	rt.setFv(f, "priority", live(admin_sound), 250);
	rt.setFv(f, "channel", live(admin_sound), 1023);
	rt.setFv(f, "frequency", live(admin_sound), live(freq));
	rt.setFv(f, "wait", live(admin_sound), 1);
	rt.setFv(f, "repeat", live(admin_sound), 0);
	rt.setFv(f, "status", live(admin_sound), 4);
	$0 = (res = (yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "Show the title of this song to the players?", null, "No", "Yes", "Cancel"])));
	if ($0 === "Yes") {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<span class='boldannounce'>An admin played: ＀</span>", [live(S)])]);
	} else if ($0 === "Cancel") {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ played sound ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), live(S)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ played sound ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), live(S)])]);
	M = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.bitAnd(rt.gv(f, "toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(M)))), 2))) {
			rt.op(f, "Output", [], [live(M), live(admin_sound)], false);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { verb: { name: "Play Global Sound", category: "Fun" }, argTypes: [{ type: 2048 }] });

// /client/proc/play_local_sound  (code/modules/admin/verbs/playsound.dm:41)
rt.def("/client/proc/play_local_sound", function play_local_sound(f: Frame, S: Value) {
	if (!truthy(rt.call(f, P("/proc/check_rights"), null, [2048]))) {
		return live(f.dot);
	}
	rt.call(f, P("/proc/log_admin"), null, [fmt("＀ played a local sound ＀", [rt.call(f, P("/proc/key_name"), null, [live(f.src)]), live(S)])]);
	rt.call(f, P("/proc/message_admins"), null, [fmt("＀ played a local sound ＀", [rt.call(f, P("/proc/key_name_admin"), null, [live(f.src)]), live(S)])]);
	rt.call(f, P("/proc/playsound"), null, [rt.getStep(f, rt.fv(f, "mob", live(f.src)), 0), live(S), 50, 0, 0]);
	return f.dot;
}, false, { verb: { name: "Play Local Sound", category: "Fun" }, argTypes: [{ type: 2048 }] });

// /client/proc/set_round_end_sound  (code/modules/admin/verbs/playsound.dm:52)
rt.def("/client/proc/set_round_end_sound", function set_round_end_sound(f: Frame, S: Value) {
	if (!truthy(rt.call(f, P("/proc/check_rights"), null, [2048]))) {
		return live(f.dot);
	}
	rt.callName(f, rt.gl("SSticker"), "SetRoundEndSound", [live(S)]);
	rt.call(f, P("/proc/log_admin"), null, [fmt("＀ set the round end sound to ＀", [rt.call(f, P("/proc/key_name"), null, [live(f.src)]), live(S)])]);
	rt.call(f, P("/proc/message_admins"), null, [fmt("＀ set the round end sound to ＀", [rt.call(f, P("/proc/key_name_admin"), null, [live(f.src)]), live(S)])]);
	return f.dot;
}, false, { verb: { name: "Set Round End Sound", category: "Fun" }, argTypes: [{ type: 2048 }] });

// /client/proc/stop_sounds  (code/modules/admin/verbs/playsound.dm:64)
rt.def("/client/proc/stop_sounds", function stop_sounds(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	if (!truthy(rt.fv(f, "holder", live(f.src)))) {
		return live(f.dot);
	}
	rt.call(f, P("/proc/log_admin"), null, [fmt("＀ stopped all currently playing sounds.", [rt.call(f, P("/proc/key_name"), null, [live(f.src)])])]);
	rt.call(f, P("/proc/message_admins"), null, [fmt("＀ stopped all currently playing sounds.", [rt.call(f, P("/proc/key_name_admin"), null, [live(f.src)])])]);
	M = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.fv(f, "client", live(M)))) {
			rt.op(f, "Output", [], [live(M), rt.call(f, P("/proc/sound"), null, [null])], false);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { verb: { name: "Stop All Playing Sounds", category: "Debug" } });
