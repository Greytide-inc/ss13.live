// Based on /tg/station's code/modules/events/wizard/ghost.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(340, "/datum/round_event/wizard/ghost", "/datum/round_event/wizard", {});

// ghost.dm:9
rt.def("/datum/round_event/wizard/ghost/proc/start", function start(f: Frame) {
	let msg: Value = "<span class='warning'>You suddenly feel extremely obvious...</span>";
	set_observer_default_invisibility(0, msg);
	return f.dot;
});

rt.type(341, "/datum/round_event/wizard/possession", "/datum/round_event/wizard", {});

// ghost.dm:23
rt.def("/datum/round_event/wizard/possession/proc/start", function start(f: Frame) {
	let G: Value = null;
	for (G of each(GLOB.player_list, T("/mob/dead/observer"))) {
		G.verbs += P("/mob/dead/observer/verb/boo");
		G.verbs += P("/mob/dead/observer/verb/possess");
		to_chat(G, "You suddenly feel a welling of new spooky powers...");
	}
	return f.dot;
});
