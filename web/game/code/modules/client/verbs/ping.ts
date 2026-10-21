// From code/modules/client/verbs/ping.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/verb/update_ping  (code/modules/client/verbs/ping.dm:4)
rt.def("/client/verb/update_ping", function update_ping(f: Frame, time: Value) {
	let ping: Value = null;
	f.vars = () => [ping];
	rt.setSv(f, "lastping", (ping = rt.callSrc(f, "pingfromtime", [live(time)])));
	if (!truthy(rt.sv(f, "avgping"))) {
		rt.setSv(f, "avgping", live(ping));
	} else {
		rt.setSv(f, "avgping", add(multiply(0.8999999761581421, rt.sv(f, "avgping")), multiply(0.10000000149011612, live(ping))));
	}
	return f.dot;
}, false, { verb: { name: ".update_ping" }, argTypes: [{ type: 32 }] });

// /client/proc/pingfromtime  (code/modules/client/verbs/ping.dm:12)
rt.def("/client/proc/pingfromtime", function pingfromtime(f: Frame, time: Value) {
	return multiply(subtract(add(rt.worldTime(f), divide(multiply(rt.fv(f, "tick_lag", rt.world()), rt.tickUsage(f)), 100)), live(time)), 100);
});

// /client/verb/display_ping  (code/modules/client/verbs/ping.dm:17)
rt.def("/client/verb/display_ping", function display_ping(f: Frame, time: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='notice'>Round trip ping took ＀ms</span>", [rt.call(f, P("/proc/round"), null, [rt.callSrc(f, "pingfromtime", [live(time)]), 1])])]);
	return f.dot;
}, false, { verb: { name: ".display_ping" }, argTypes: [{ type: 32 }] });

// /client/verb/ping  (code/modules/client/verbs/ping.dm:22)
rt.def("/client/verb/ping", function ping(f: Frame) {
	rt.call(f, P("/proc/winset"), null, [live(f.src), null, fmt("command=.display_ping+＀", [add(rt.worldTime(f), divide(multiply(rt.fv(f, "tick_lag", rt.world()), rt.tickUsage(f)), 100))])]);
	return f.dot;
}, false, { verb: { name: "Ping", category: "OOC" } });
