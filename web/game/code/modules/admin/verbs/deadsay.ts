// From code/modules/admin/verbs/deadsay.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/proc/dsay  (code/modules/admin/verbs/deadsay.dm:5)
rt.def("/client/proc/dsay", function dsay(f: Frame, msg: Value) {
	let rendered: Value = null, M: Value = null;
	let $0: any, $e: any;
	f.vars = () => [msg, rendered, M, $0, $e];
	if (!truthy(rt.fv(f, "holder", live(f.src)))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "mob", live(f.src)))) {
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.fv(f, "muted", rt.sv(f, "prefs")), 16))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>You cannot send DSAY messages (muted).</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.callName(f, live(f.src), "handle_spam_prevention", [live(msg), 16]))) {
		return live(f.dot);
	}
	msg = rt.call(f, P("/proc/copytext"), null, [rt.call(f, P("/proc/sanitize"), null, [live(msg)]), 1, 1024]);
	rt.call(f, P("/proc/log_dsay"), null, [fmt("＀ : ＀", [rt.call(f, P("/proc/key_name"), null, [live(f.src)]), live(msg)])]);
	if (!truthy(live(msg))) {
		return live(f.dot);
	}
	if (truthy(rt.gv(f, "fakekey", rt.fv(f, "holder", live(f.src))))) {
		$0 = rt.op(f, "PickUnweighted", [1], [rt.gl("nicknames")]);
	} else {
		$0 = rt.fv(f, "key", live(f.src));
	}
	rendered = fmt("<span class='game deadsay'><span class='prefix'>DEAD:</span> <span class='name'>ADMIN(＀)</span> says, <span class='message'>\"＀\"</span></span>", [$0, live(msg)]);
	M = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((rt.istype(live(M), T("/mob/dead/new_player")) ? 1 : 0))) {
			continue;
		}
		if ((isEqual(rt.fv(f, "stat", live(M)), 2) || ((truthy(rt.fv(f, "client", live(M))) && truthy(rt.gv(f, "holder", rt.fv(f, "client", live(M))))) && truthy(rt.bitAnd(rt.gv(f, "chat_toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(M)))), 2))))) {
			rt.callName(f, live(M), "show_message", [live(rendered), 2]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { hidden: true, verb: { name: "Dsay", category: "Special Verbs" }, argTypes: [{ type: 2 }] });
