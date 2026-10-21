// From code/modules/events/wizard/ghost.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(340, "/datum/round_event/wizard/ghost", "/datum/round_event/wizard", {});

// /datum/round_event/wizard/ghost/proc/start  (code/modules/events/wizard/ghost.dm:9)
rt.def("/datum/round_event/wizard/ghost/proc/start", function start(f: Frame) {
	let msg: Value = null;
	f.vars = () => [msg];
	msg = "<span class='warning'>You suddenly feel extremely obvious...</span>";
	rt.call(f, P("/proc/set_observer_default_invisibility"), null, [0, live(msg)]);
	return f.dot;
});

rt.type(341, "/datum/round_event/wizard/possession", "/datum/round_event/wizard", {});

// /datum/round_event/wizard/possession/proc/start  (code/modules/events/wizard/ghost.dm:23)
rt.def("/datum/round_event/wizard/possession/proc/start", function start(f: Frame) {
	let G: Value = null;
	let $e: any;
	f.vars = () => [G, $e];
	G = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/observer"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		rt.modField(f, live(G), "verbs", P("/mob/dead/observer/verb/boo"), add);
		rt.modField(f, live(G), "verbs", P("/mob/dead/observer/verb/possess"), add);
		rt.call(f, P("/proc/to_chat"), null, [live(G), "You suddenly feel a welling of new spooky powers..."]);
	}
	rt.endFor(f, 0);
	return f.dot;
});
