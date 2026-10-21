// From code/game/gamemodes/meteor/meteor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1094, "/datum/game_mode/meteor", "/datum/game_mode", {
	meteordelay: 2000,
	nometeors: 0,
	rampupdelta: 5,
	name: "meteor",
	config_tag: "meteor",
	required_players: 0,
	announce_span: "danger",
	announce_text: "A major meteor shower is bombarding the station! The crew needs to evacuate or survive the onslaught.",
});

// /datum/game_mode/meteor/proc/process  (code/game/gamemodes/meteor/meteor.dm:14)  may sleep
rt.def("/datum/game_mode/meteor/proc/process", function* process(f: Frame) {
	let wavetype: Value = null, meteorminutes: Value = null, ramp_up_final: Value = null;
	f.vars = () => [wavetype, meteorminutes, ramp_up_final];
	if ((truthy(rt.sv(f, "nometeors")) || rt.gt(rt.sv(f, "meteordelay"), subtract(rt.worldTime(f), rt.fv(f, "round_start_time", rt.gl("SSticker")))))) {
		return live(f.dot);
	}
	wavetype = rt.gl("meteors_normal");
	if (truthy(rt.op(f, "Prob", [], [(meteorminutes = divide(divide(subtract(subtract(rt.worldTime(f), rt.fv(f, "round_start_time", rt.gl("SSticker"))), rt.sv(f, "meteordelay")), 10), 60))]))) {
		wavetype = rt.gl("meteors_threatening");
	}
	if (truthy(rt.op(f, "Prob", [], [divide(live(meteorminutes), 2)]))) {
		wavetype = rt.gl("meteors_catastrophic");
	}
	yield* g.call(f, P("/proc/spawn_meteors"), null, [(ramp_up_final = (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/round"), null, [divide(live(meteorminutes), rt.sv(f, "rampupdelta"))])), 10]))]))), live(wavetype)]);
	return f.dot;
}, true, { waitfor: false });

// /datum/game_mode/meteor/proc/declare_completion  (code/game/gamemodes/meteor/meteor.dm:36)
rt.def("/datum/game_mode/meteor/proc/declare_completion", function declare_completion(f: Frame) {
	let text: Value = null, survivors: Value = null, player: Value = null;
	let $e: any;
	f.vars = () => [text, survivors, player, $e];
	text = null;
	survivors = 0;
	player = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player = $e;
		if (!isEqual(rt.fv(f, "stat", live(player)), 2)) {
			survivors = rt.inc(live(survivors), 1);
			if (truthy(rt.callName(f, live(player), "onCentcom", []))) {
				text = rt.modify(live(text), fmt("<br><b><font size=2>＀ escaped to the safety of Centcom.</font></b>", [rt.fv(f, "real_name", live(player))]), add);
			} else {
				if (truthy(rt.callName(f, live(player), "onSyndieBase", []))) {
					text = rt.modify(live(text), fmt("<br><b><font size=2>＀ escaped to the (relative) safety of Syndicate Space.</font></b>", [rt.fv(f, "real_name", live(player))]), add);
				} else {
					text = rt.modify(live(text), fmt("<br><font size=1>＀ survived but is stranded without any hope of rescue.</font>", [rt.fv(f, "real_name", live(player))]), add);
				}
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(survivors))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<span class='boldnotice'>The following survived the meteor storm</span>:＀", [live(text)])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='boldnotice'>Nobody survived the meteor storm!</span>"]);
	}
	rt.setFv(f, "mode_result", rt.gl("SSticker"), "end - evacuation");
	rt.callSuper(f, [], rt.Args.Same);
	return 1;
});
