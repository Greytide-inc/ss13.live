// popup.ts - fixture for the right-click menu section (runPopupMenuCheck): the DM tests/dm/popup_helpers.dm.
// Verb meta as the translator writes it: verb.src = DMCompiler's VerbSrc, argTypes = the `as mob|obj in view()` specs.
import { rt, setG, G } from "./lib.js";
import type { Frame, Value } from "./lib.js";
const { T, live, add } = rt;

rt.globals([["pm_log", ""]]);

const LOG = (s: Value) => setG("pm_log", add(G("pm_log"), s));
const NAME = (f: Frame, a: Value) => rt.get(f, live(a), "name");

rt.type("/mob/pm_mob", "/mob", {});
rt.def("/mob/pm_mob/verb/pm_examine", function pm_examine(f: Frame, A: Value) {
	LOG(rt.fmt("examine:＀;", [NAME(f, A)]));
	return f.dot;
}, false, { verb: { name: "Examine" }, argTypes: [{ type: 28, path: "/atom", source: "view" }] });
rt.def("/mob/pm_mob/verb/pm_pull", function pm_pull(f: Frame, AM: Value) {
	LOG(rt.fmt("pull:＀;", [NAME(f, AM)]));
	return f.dot;
}, false, { verb: { name: "Pull" }, argTypes: [{ type: 12, path: "/atom/movable", source: "oview:1" }] });
rt.def("/mob/pm_mob/verb/pm_say", function pm_say(f: Frame, msg: Value) {
	LOG(rt.fmt("say:＀;", [msg]));
	return f.dot;
}, false, { verb: { name: "Say" }, argTypes: [{ type: 2 }] });
rt.def("/mob/pm_mob/verb/pm_secret", function pm_secret(f: Frame) {
	return f.dot;
}, false, { hidden: true, verb: { name: "Secret" } });

rt.type("/mob/pm_other", "/mob", { name: "bob" });
rt.type("/obj/pm_plain", "/obj", { name: "plain", layer: 3.5 });
rt.type("/obj/pm_item", "/obj", { name: "item", layer: 3 });

rt.def("/obj/pm_item/verb/pm_pickup", function pm_pickup(f: Frame) {
	LOG(rt.fmt("pickup:＀;", [rt.srcVar(f, "name")]));
	return f.dot;
}, false, { verb: { name: "Pick up", src: 3, range: 1 } });
rt.def("/obj/pm_item/verb/pm_use", function pm_use(f: Frame) {
	LOG(rt.fmt("use:＀;", [rt.srcVar(f, "name")]));
	return f.dot;
}, false, { verb: { name: "Use", src: 1, range: 1 } });
rt.def("/obj/pm_item/verb/pm_far", function pm_far(f: Frame) {
	return f.dot;
}, false, { verb: { name: "Far", src: 1, range: 3 } });
rt.def("/obj/pm_item/verb/pm_mine", function pm_mine(f: Frame) {
	return f.dot;
}, false, { verb: { name: "Mine", src: 11 } });
rt.def("/obj/pm_item/verb/pm_hid", function pm_hid(f: Frame) {
	return f.dot;
}, false, { hidden: true, verb: { name: "Hidden one", src: 1 } });
rt.def("/obj/pm_item/verb/pm_nopop", function pm_nopop(f: Frame) {
	return f.dot;
}, false, { hidePopup: true, verb: { name: "No popup", src: 1 } });
rt.def("/obj/pm_item/verb/pm_world_v", function pm_world_v(f: Frame) {
	return f.dot;
}, false, { verb: { name: "World verb", src: 9 } });

rt.def("/proc/pm_setup", function pm_setup(f: Frame, C: Value) {
	rt.set(f, rt.world(), "maxx", 15);
	rt.set(f, rt.world(), "maxy", 15);
	for (let x = 1; x <= 15; x++) {
		for (let y = 1; y <= 15; y++) {
			const T_ = rt.locate(x, y, 1);
			rt.forList(f, 0, T_, T("/atom/movable"));
			for (let A = rt.next(f, 0); A !== undefined; A = rt.next(f, 0)) rt.set(f, live(A), "loc", null);
			rt.endFor(f, 0);
			if (!rt.isEqual(rt.get(f, live(T_), "type"), T("/turf"))) rt.new_(f, T("/turf"), [T_]);
		}
	}
	const L = rt.list();
	const M = rt.new_(f, T("/mob/pm_mob"), [rt.locate(8, 8, 1)]);
	rt.set(f, live(C), "mob", M);
	rt.set(f, live(C), "eye", M);
	rt.set(f, live(C), "view", 7);
	L.push(M);
	L.push(rt.new_(f, T("/obj/pm_item"), [rt.locate(9, 8, 1)]));
	L.push(rt.new_(f, T("/obj/pm_plain"), [rt.locate(9, 8, 1)]));
	L.push(rt.new_(f, T("/mob/pm_other"), [rt.locate(9, 8, 1)]));
	L.push(rt.new_(f, T("/obj/pm_item"), [rt.locate(12, 8, 1)]));
	L.push(rt.new_(f, T("/obj/pm_item"), [M]));
	setG("pm_log", "");
	return L;
});

rt.def("/proc/pm_getlog", function pm_getlog(f: Frame) {
	return G("pm_log");
});

rt.def("/proc/pm_end", function pm_end(f: Frame, M: Value) {
	rt.set(f, live(M), "loc", null);
	rt.set(f, rt.world(), "maxx", 5);
	rt.set(f, rt.world(), "maxy", 5);
	return f.dot;
});
