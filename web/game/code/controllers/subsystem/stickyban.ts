// From code/controllers/subsystem/stickyban.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(42, "/datum/controller/subsystem/stickyban", "/datum/controller/subsystem", {
	cache: null,
	name: "Sticky Ban",
	init_order: -10,
	flags: 2,
});

// /datum/controller/subsystem/stickyban/proc/New  (code/controllers/subsystem/stickyban.dm:1)  may sleep
rt.def("/datum/controller/subsystem/stickyban/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSstickyban"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSstickyban"), T("/datum/controller/subsystem/stickyban")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSstickyban")]);
		}
		rt.setGl("SSstickyban", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/stickyban/proc/<init>  (code/controllers/subsystem/stickyban.dm:6)
rt.def("/datum/controller/subsystem/stickyban/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cache", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/stickyban/proc/Initialize  (code/controllers/subsystem/stickyban.dm:9)
rt.def("/datum/controller/subsystem/stickyban/proc/Initialize", function Initialize(f: Frame, timeofday: Value) {
	let bannedkeys: Value = null, bannedkey: Value = null, ckey: Value = null, ban: Value = null, bannedckey: Value = null;
	let $e: any;
	f.vars = () => [bannedkeys, bannedkey, ckey, ban, bannedckey, $e];
	bannedkeys = rt.callName(f, rt.world(), "GetConfig", ["ban"]);
	bannedkey = null;
	rt.forList(f, 0, live(bannedkeys));
	while (($e = rt.next(f, 0)) !== undefined) {
		bannedkey = $e;
		ckey = rt.call(f, P("/proc/ckey"), null, [live(bannedkey)]);
		ban = rt.call(f, P("/proc/stickyban2list"), null, [rt.callName(f, rt.world(), "GetConfig", ["ban", live(bannedkey)])]);
		rt.callName(f, rt.world(), "SetConfig", ["ban", live(bannedkey), null]);
		if (!truthy(rt.at(live(ban), "ckey"))) {
			rt.setAt(live(ban), "ckey", live(ckey));
		}
		(ban = rt.modify(live(ban), "IP", subtract));
		(ban = rt.modify(live(ban), "computer_id", subtract));
		rt.setAt(live(ban), "matches_this_round", rt.list());
		rt.setAt(live(ban), "existing_user_matches_this_round", rt.list());
		rt.setAt(live(ban), "admin_matches_this_round", rt.list());
		rt.setAt(rt.sv(f, "cache"), live(ckey), live(ban));
	}
	rt.endFor(f, 0);
	bannedckey = null;
	rt.forList(f, 0, rt.sv(f, "cache"));
	while (($e = rt.next(f, 0)) !== undefined) {
		bannedckey = $e;
		rt.callName(f, rt.world(), "SetConfig", ["ban", live(bannedckey), rt.call(f, P("/proc/list2stickyban"), null, [rt.index(rt.sv(f, "cache"), live(bannedckey))])]);
	}
	rt.endFor(f, 0);
	return f.dot;
});
