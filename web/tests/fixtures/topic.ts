// topic.ts - fixture for the Topic section (runTopicCheck): the DM tests/dm/topic_helpers.dm. A second /client/Topic after the
// std one in std-procs.ts: its `..()` runs the first, as a /client/Topic override does in the game.
import { rt, setG, G } from "./lib.js";
import type { Frame, Value } from "./lib.js";
const { T, live, truthy, add } = rt;

rt.globals([["tp_log", ""], ["tp_target", null]]);

const LOG = (s: Value) => setG("tp_log", add(G("tp_log"), s));

rt.def("/client/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value, hsrc: Value) {
	if (truthy(rt.index(live(href_list), "tp"))) {
		const same = rt.isEqual(live(f.usr), rt.srcVar(f, "mob"));
		LOG(rt.fmt("client:＀:＀;", [same ? "usr=mob" : rt.fmt("usr=＀", [f.usr]), truthy(hsrc) ? "hsrc" : "nohsrc"]));
	}
	return yield* rt.g.callSuper(f, [], rt.Args.Same);
}, true);

rt.type("/datum/tp_target", "/datum", {});
rt.def("/datum/tp_target/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	const who = () => (truthy(f.usr) ? rt.fmt("usr=＀", [rt.get(f, live(f.usr), "name")]) : "usr=null");
	LOG(rt.fmt("datum:＀;", [who()]));
	if (truthy(rt.index(live(href_list), "sleep"))) {
		yield* rt.g.call(f, rt.P("/proc/sleep"), null, [1]);
		LOG(rt.fmt("after_sleep:＀;", [who()]));
	}
	return f.dot;
}, true);

rt.def("/proc/tp_new_target", function* tp_new_target(f: Frame) {
	setG("tp_target", yield* rt.g.new_(f, T("/datum/tp_target"), []));
	return G("tp_target");
}, true);

rt.def("/proc/tp_getlog", function tp_getlog(f: Frame) {
	f.dot = G("tp_log");
	setG("tp_log", "");
	return f.dot;
});
