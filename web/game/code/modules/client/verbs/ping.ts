// Based on /tg/station's code/modules/client/verbs/ping.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// ping.dm:4
rt.def("/client/verb/update_ping", function update_ping(f: Frame, time: Value) {
	let ping: Value = null;
	this.lastping = (ping = this.pingfromtime(time));
	if (!this.avgping) {
		this.avgping = ping;
	} else {
		this.avgping = 0.9 * this.avgping + 0.1 * ping;
	}
	return f.dot;
}, false, { verb: { name: ".update_ping" }, argTypes: [{ type: 32 }] });

// ping.dm:12
rt.def("/client/proc/pingfromtime", function pingfromtime(f: Frame, time: Value) {
	return (rt.worldTime(f) + rt.world().tick_lag * rt.tickUsage(f) / 100 - time) * 100;
});

// ping.dm:17
rt.def("/client/verb/display_ping", function display_ping(f: Frame, time: Value) {
	to_chat(this, `<span class='notice'>Round trip ping took ${round(this.pingfromtime(time), 1)}ms</span>`);
	return f.dot;
}, false, { verb: { name: ".display_ping" }, argTypes: [{ type: 32 }] });

// ping.dm:22
rt.def("/client/verb/ping", function ping(f: Frame) {
	winset(this, null, `command=.display_ping+${rt.worldTime(f) + rt.world().tick_lag * rt.tickUsage(f) / 100}`);
	return f.dot;
}, false, { verb: { name: "Ping", category: "OOC" } });
