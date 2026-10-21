// From code/modules/detectivework/evidence.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7479, "/obj/item/weapon/evidencebag", "/obj/item/weapon", {
	name: "evidence bag",
	desc: "An empty evidence bag.",
	icon: rt.rsc("icons/obj/storage.dmi"),
	icon_state: "evidenceobj",
	item_state: "",
	w_class: 1,
});

// /obj/item/weapon/evidencebag/proc/afterattack  (code/modules/detectivework/evidence.dm:12)  may sleep
rt.def("/obj/item/weapon/evidencebag/proc/afterattack", function* afterattack(f: Frame, I: Value, user: Value, proximity: Value) {
	f.vars = () => [I, user, proximity];
	if ((!truthy(live(proximity)) || isEqual(rt.sv(f, "loc"), live(I)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "evidencebagEquip", live(I), live(user));
	return f.dot;
}, true);

// /obj/item/weapon/evidencebag/proc/attackby  (code/modules/detectivework/evidence.dm:17)  may sleep
rt.def("/obj/item/weapon/evidencebag/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	f.vars = () => [I, user, params];
	if (!truthy((yield* g.srcCall(f, "evidencebagEquip", live(I), live(user))))) return f.dot;
	return 1;
}, true);

// /obj/item/weapon/evidencebag/proc/evidencebagEquip  (code/modules/detectivework/evidence.dm:21)  may sleep
rt.def("/obj/item/weapon/evidencebag/proc/evidencebagEquip", function* evidencebagEquip(f: Frame, I: Value, user: Value) {
	let U: Value = null, in_evidence: Value = null;
	f.vars = () => [I, user, U, in_evidence];
	if ((!truthy((rt.istype(live(I), T("/obj/item")) ? 1 : 0)) || isEqual(rt.fv(f, "anchored", live(I)), 1))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(I), T("/obj/item/weapon/evidencebag")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You find putting an evidence bag in another evidence bag to be slightly absurd.</span>"]);
		return 1;
	}
	if (rt.gt(rt.fv(f, "w_class", live(I)), 3)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ won't fit in ＀.</span>", [live(I), live(f.src)])]);
		return live(f.dot);
	}
	if (truthy(rt.len(f, rt.sv(f, "contents")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ already has something inside it.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(I))])))) {
		if (truthy((rt.istype(rt.fv(f, "loc", live(I)), T("/obj/item/weapon/storage")) ? 1 : 0))) {
			yield* g.callName(f, (U = rt.fv(f, "loc", live(I))), "remove_from_storage", [live(I), live(f.src)]);
		}
		if (truthy((yield* g.callName(f, live(user), "is_holding", [live(I)])))) {
			yield* g.callName(f, live(user), "dropItemToGround", [live(I)]);
		} else {
			return live(f.dot);
		}
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ puts ＀ into ＀.", [live(user), live(I), live(f.src)]), fmt("<span class='notice'>You put ＀ inside ＀.</span>", [live(I), live(f.src)]), "<span class='italics'>You hear a rustle as someone puts something into a plastic bag.</span>"]);
	rt.setSv(f, "icon_state", "evidence");
	rt.setFv(f, "plane", (in_evidence = (yield* g.new_(f, T("/mutable_appearance"), [live(I)]))), -32767);
	rt.setFv(f, "layer", live(in_evidence), -1);
	rt.setFv(f, "pixel_x", live(in_evidence), 0);
	rt.setFv(f, "pixel_y", live(in_evidence), 0);
	yield* g.srcCall(f, "add_overlay", live(in_evidence));
	yield* g.srcCall(f, "add_overlay", "evidence");
	rt.setSv(f, "desc", fmt("An evidence bag containing ＀. ＀", [live(I), rt.fv(f, "desc", live(I))]));
	rt.setFv(f, "loc", live(I), live(f.src));
	rt.setSv(f, "w_class", rt.fv(f, "w_class", live(I)));
	return 1;
}, true);

// /obj/item/weapon/evidencebag/proc/attack_self  (code/modules/detectivework/evidence.dm:64)  may sleep
rt.def("/obj/item/weapon/evidencebag/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let I: Value = null;
	f.vars = () => [user, I];
	if (truthy(rt.len(f, rt.sv(f, "contents")))) {
		I = rt.index(rt.sv(f, "contents"), 1);
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ takes ＀ out of ＀.", [live(user), live(I), live(f.src)]), fmt("<span class='notice'>You take ＀ out of ＀.</span>", [live(I), live(f.src)]), "<span class='italics'>You hear someone rustle around in a plastic bag, and remove something.</span>"]);
		yield* g.srcCall(f, "cut_overlays");
		yield* g.callName(f, live(user), "put_in_hands", [live(I)]);
		rt.setSv(f, "w_class", 1);
		rt.setSv(f, "icon_state", "evidenceobj");
		rt.setSv(f, "desc", "An empty evidence bag.");
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ is empty.", [live(f.src)])]);
		rt.setSv(f, "icon_state", "evidenceobj");
	}
	return live(f.dot);
}, true);

rt.type(5439, "/obj/item/weapon/storage/box/evidence", "/obj/item/weapon/storage/box", {
	name: "evidence bag box",
	desc: "A box claiming to contain evidence bags.",
});

// /obj/item/weapon/storage/box/evidence/proc/New  (code/modules/detectivework/evidence.dm:84)  may sleep
rt.def("/obj/item/weapon/storage/box/evidence/proc/New", function* New(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/evidencebag"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/evidencebag"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/evidencebag"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/evidencebag"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/evidencebag"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/evidencebag"), [live(f.src)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return live(f.dot);
}, true);
