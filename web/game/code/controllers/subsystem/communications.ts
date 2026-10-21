// From code/controllers/subsystem/communications.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(17, "/datum/controller/subsystem/communications", "/datum/controller/subsystem", {
	silicon_message_cooldown: null,
	nonsilicon_message_cooldown: null,
	name: "Communications",
	flags: 3,
});

// /datum/controller/subsystem/communications/proc/New  (code/controllers/subsystem/communications.dm:4)  may sleep
rt.def("/datum/controller/subsystem/communications/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SScommunications"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SScommunications"), T("/datum/controller/subsystem/communications")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SScommunications")]);
		}
		rt.setGl("SScommunications", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/communications/proc/can_announce  (code/controllers/subsystem/communications.dm:12)
rt.def("/datum/controller/subsystem/communications/proc/can_announce", function can_announce(f: Frame, user: Value, is_silicon: Value) {
	if ((truthy(live(is_silicon)) && rt.gt(rt.sv(f, "silicon_message_cooldown"), rt.worldTime(f)))) {
		f.dot = 0;
	} else {
		if ((!truthy(live(is_silicon)) && rt.gt(rt.sv(f, "nonsilicon_message_cooldown"), rt.worldTime(f)))) {
			f.dot = 0;
		} else {
			f.dot = 1;
		}
	}
	return f.dot;
});

// /datum/controller/subsystem/communications/proc/make_announcement  (code/controllers/subsystem/communications.dm:20)  may sleep
rt.def("/datum/controller/subsystem/communications/proc/make_announcement", function* make_announcement(f: Frame, user: Value, is_silicon: Value, input: Value) {
	f.vars = () => [user, is_silicon, input];
	if (!truthy((yield* g.srcCall(f, "can_announce", live(user), live(is_silicon))))) {
		return 0;
	}
	if (truthy(live(is_silicon))) {
		yield* g.call(f, P("/proc/minor_announce"), null, [(yield* g.call(f, P("/proc/html_decode"), null, [live(input)])), fmt("＀ Announces:", [rt.fv(f, "name", live(user))])]);
		rt.setSv(f, "silicon_message_cooldown", add(rt.worldTime(f), 600));
	} else {
		yield* g.call(f, P("/proc/priority_announce"), null, [(yield* g.call(f, P("/proc/html_decode"), null, [live(input)])), null, rt.rsc("sound/misc/announce.ogg"), "Captain"]);
		rt.setSv(f, "nonsilicon_message_cooldown", add(rt.worldTime(f), 600));
	}
	yield* g.call(f, P("/proc/log_say"), null, [fmt("＀ has made a priority announcement: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), live(input)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has made a priority announcement.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)]))])]);
	return f.dot;
}, true);
