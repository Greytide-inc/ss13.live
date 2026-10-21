// From code/modules/client/verbs/who.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/verb/who  (code/modules/client/verbs/who.dm:5)  may sleep
rt.def("/client/verb/who", function* who(f: Frame) {
	let msg: Value = null, Lines: Value = null, G: Value = null, C: Value = null, entry: Value = null, O: Value = null, C_2: Value = null, entry_3: Value = null, line: Value = null;
	let $0: any, $e: any;
	f.vars = () => [msg, Lines, G, C, entry, O, C_2, entry_3, line, $0, $e];
	msg = "<b>Current Players:</b>\n";
	Lines = rt.list();
	if (truthy(rt.sv(f, "holder"))) {
		if ((truthy((yield* g.call(f, P("/proc/check_rights"), null, [2, 0]))) && truthy((rt.istype(rt.fv(f, "mob", live(f.src)), T("/mob/dead/observer")) ? 1 : 0)))) {
			if (!truthy(rt.gv(f, "started_as_observer", (G = rt.fv(f, "mob", live(f.src)))))) {
				yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ checked advanced who in-round", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
			}
			C = null;
			rt.forList(f, 0, rt.gl("clients"), T("/client"));
			while (($e = rt.next(f, 0)) !== undefined) {
				C = $e;
				entry = fmt("\t＀", [rt.fv(f, "key", live(C))]);
				if ((truthy(rt.fv(f, "holder", live(C))) && truthy(rt.gv(f, "fakekey", rt.fv(f, "holder", live(C)))))) {
					entry = rt.modify(live(entry), fmt(" <i>(as ＀)</i>", [rt.gv(f, "fakekey", rt.fv(f, "holder", live(C)))]), add);
				}
				if (truthy((rt.istype(rt.fv(f, "mob", live(C)), T("/mob/dead/new_player")) ? 1 : 0))) {
					entry = rt.modify(live(entry), " - <font color='darkgray'><b>In Lobby</b></font>", add);
				} else {
					entry = rt.modify(live(entry), fmt(" - Playing as ＀", [rt.gv(f, "real_name", rt.fv(f, "mob", live(C)))]), add);
					$0 = rt.gv(f, "stat", rt.fv(f, "mob", live(C)));
					if ($0 === 1) {
						entry = rt.modify(live(entry), " - <font color='darkgray'><b>Unconscious</b></font>", add);
					} else if ($0 === 2) {
						if (truthy((rt.istype(rt.fv(f, "mob", live(C)), T("/mob/dead/observer")) ? 1 : 0))) {
							if (truthy(rt.gv(f, "started_as_observer", (O = rt.fv(f, "mob", live(C)))))) {
								entry = rt.modify(live(entry), " - <font color='gray'>Observing</font>", add);
							} else {
								entry = rt.modify(live(entry), " - <font color='black'><b>DEAD</b></font>", add);
							}
						} else {
							entry = rt.modify(live(entry), " - <font color='black'><b>DEAD</b></font>", add);
						}
					}
					if (truthy((yield* g.call(f, P("/proc/is_special_character"), null, [rt.fv(f, "mob", live(C))])))) {
						entry = rt.modify(live(entry), " - <b><font color='red'>Antagonist</font></b>", add);
					}
				}
				entry = rt.modify(live(entry), fmt(" ＀", [fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [rt.fv(f, "mob", live(C))])]), add);
				Lines = rt.modify(live(Lines), (entry = rt.modify(live(entry), fmt(" (＀ms)", [(yield* g.call(f, P("/proc/round"), null, [rt.fv(f, "avgping", live(C)), 1]))]), add)), add);
			}
			rt.endFor(f, 0);
		} else {
			C_2 = null;
			rt.forList(f, 0, rt.gl("clients"), T("/client"));
			while (($e = rt.next(f, 0)) !== undefined) {
				C_2 = $e;
				entry_3 = fmt("\t＀", [rt.fv(f, "key", live(C_2))]);
				if ((truthy(rt.fv(f, "holder", live(C_2))) && truthy(rt.gv(f, "fakekey", rt.fv(f, "holder", live(C_2)))))) {
					entry_3 = rt.modify(live(entry_3), fmt(" <i>(as ＀)</i>", [rt.gv(f, "fakekey", rt.fv(f, "holder", live(C_2)))]), add);
				}
				Lines = rt.modify(live(Lines), (entry_3 = rt.modify(live(entry_3), fmt(" (＀ms)", [(yield* g.call(f, P("/proc/round"), null, [rt.fv(f, "avgping", live(C_2)), 1]))]), add)), add);
			}
			rt.endFor(f, 0);
		}
	} else {
		C_2 = null;
		rt.forList(f, 0, rt.gl("clients"), T("/client"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C_2 = $e;
			if ((truthy(rt.fv(f, "holder", live(C_2))) && truthy(rt.gv(f, "fakekey", rt.fv(f, "holder", live(C_2)))))) {
				Lines = rt.modify(live(Lines), fmt("＀ (＀ms)", [rt.gv(f, "fakekey", rt.fv(f, "holder", live(C_2))), (yield* g.call(f, P("/proc/round"), null, [rt.fv(f, "avgping", live(C_2)), 1]))]), add);
			} else {
				Lines = rt.modify(live(Lines), fmt("＀ (＀ms)", [rt.fv(f, "key", live(C_2)), (yield* g.call(f, P("/proc/round"), null, [rt.fv(f, "avgping", live(C_2)), 1]))]), add);
			}
		}
		rt.endFor(f, 0);
	}
	line = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/sortList"), null, [live(Lines)])));
	while (($e = rt.next(f, 0)) !== undefined) {
		line = $e;
		msg = rt.modify(live(msg), fmt("＀\n", [live(line)]), add);
	}
	rt.endFor(f, 0);
	msg = rt.modify(live(msg), fmt("<b>Total Players: ＀</b>", [rt.length(live(Lines))]), add);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), live(msg)]);
	return f.dot;
}, true, { verb: { name: "Who", category: "OOC" } });

// /client/verb/adminwho  (code/modules/client/verbs/who.dm:63)
rt.def("/client/verb/adminwho", function adminwho(f: Frame) {
	let msg: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [msg, C, $e];
	msg = "<b>Current Admins:</b>\n";
	if (truthy(rt.sv(f, "holder"))) {
		C = null;
		rt.forList(f, 0, rt.gl("admins"), T("/client"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			msg = rt.modify(live(msg), fmt("\t＀ is a ＀", [live(C), rt.gv(f, "rank", rt.fv(f, "holder", live(C)))]), add);
			if (truthy(rt.gv(f, "fakekey", rt.fv(f, "holder", live(C))))) {
				msg = rt.modify(live(msg), fmt(" <i>(as ＀)</i>", [rt.gv(f, "fakekey", rt.fv(f, "holder", live(C)))]), add);
			}
			if (truthy((rt.istype(rt.fv(f, "mob", live(C)), T("/mob/dead/observer")) ? 1 : 0))) {
				msg = rt.modify(live(msg), " - Observing", add);
			} else {
				if (truthy((rt.istype(rt.fv(f, "mob", live(C)), T("/mob/dead/new_player")) ? 1 : 0))) {
					msg = rt.modify(live(msg), " - Lobby", add);
				} else {
					msg = rt.modify(live(msg), " - Playing", add);
				}
			}
			if (truthy(rt.callName(f, live(C), "is_afk", []))) {
				msg = rt.modify(live(msg), " (AFK)", add);
			}
			msg = rt.modify(live(msg), "\n", add);
		}
		rt.endFor(f, 0);
	} else {
		C = null;
		rt.forList(f, 0, rt.gl("admins"), T("/client"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			if (truthy(rt.callName(f, live(C), "is_afk", []))) {
				continue;
			}
			if (!truthy(rt.gv(f, "fakekey", rt.fv(f, "holder", live(C))))) {
				msg = rt.modify(live(msg), fmt("\t＀ is a ＀\n", [live(C), rt.gv(f, "rank", rt.fv(f, "holder", live(C)))]), add);
			}
		}
		rt.endFor(f, 0);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), live(msg)]);
	return f.dot;
}, false, { verb: { name: "Adminwho", category: "Admin" } });
