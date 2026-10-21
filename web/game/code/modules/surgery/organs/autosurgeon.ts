// From code/modules/surgery/organs/autosurgeon.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9431, "/obj/item/device/autosurgeon", "/obj/item/device", {
	storedorgan: null,
	uses: -1,
	starting_organ: null,
	organ_type: rt.typePath("/obj/item/organ"),
	name: "autosurgeon",
	desc: "A device that automatically inserts an implant or organ into the user without the hassle of extensive surgery. It has a slot to insert implants/organs and a screwdriver slot for removing accidentally added items.",
	icon_state: "autoimplanter",
	item_state: "walkietalkie",
	w_class: 2,
});

// /obj/item/device/autosurgeon/proc/Initialize  (code/modules/surgery/organs/autosurgeon.dm:15)  may sleep
rt.def("/obj/item/device/autosurgeon/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "starting_organ"))) return f.dot;
	yield* g.srcCall(f, "insert_organ", (yield* g.new_(f, rt.sv(f, "starting_organ"), [live(f.src)])));
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/item/device/autosurgeon/proc/insert_organ  (code/modules/surgery/organs/autosurgeon.dm:20)  may sleep
rt.def("/obj/item/device/autosurgeon/proc/insert_organ", function* insert_organ(f: Frame, I: Value) {
	f.vars = () => [I];
	rt.setSv(f, "storedorgan", live(I));
	yield* g.callName(f, live(I), "forceMove", [live(f.src)]);
	rt.setSv(f, "name", fmt("＀ (＀)", [rt.initial(f, live(f.src), "name"), rt.fv(f, "name", rt.sv(f, "storedorgan"))]));
	return f.dot;
}, true);

// /obj/item/device/autosurgeon/proc/attack_self  (code/modules/surgery/organs/autosurgeon.dm:25)  may sleep
rt.def("/obj/item/device/autosurgeon/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "uses"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ has already been used. The tools are dull and won't reactivate.</span>", [live(f.src)])]);
		return live(f.dot);
	} else {
		if (!truthy(rt.sv(f, "storedorgan"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ currently has no implant stored.</span>", [live(f.src)])]);
			return live(f.dot);
		}
	}
	yield* g.callName(f, rt.sv(f, "storedorgan"), "Insert", [live(user)]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ presses a button on ＀, and you hear a short mechanical noise.</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You feel a sharp sting as ＀ plunges into your body.</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.rsc("sound/weapons/circsawhit.ogg"), 50, 1]);
	rt.setSv(f, "storedorgan", null);
	rt.setSv(f, "name", rt.initial(f, live(f.src), "name"));
	if (!isEqual(rt.sv(f, "uses"), -1)) {
		rt.incSrcVar(f, "uses", -1, true);
	}
	if (truthy(rt.sv(f, "uses"))) return f.dot;
	rt.setSv(f, "desc", fmt("＀ Looks like it's been used up.", [rt.initial(f, live(f.src), "desc")]));
	return f.dot;
}, true);

// /obj/item/device/autosurgeon/proc/attackby  (code/modules/surgery/organs/autosurgeon.dm:42)  may sleep
rt.def("/obj/item/device/autosurgeon/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let floorloc: Value = null;
	f.vars = () => [I, user, params, floorloc];
	if (truthy(rt.op(f, "IsType", [], [live(I), rt.sv(f, "organ_type")]))) {
		if (truthy(rt.sv(f, "storedorgan"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ already has an implant stored.</span>", [live(f.src)])]);
			return live(f.dot);
		} else {
			if (!truthy(rt.sv(f, "uses"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ has already been used up.</span>", [live(f.src)])]);
				return live(f.dot);
			}
		}
		if (!truthy((yield* g.callName(f, live(user), "drop_item", [])))) {
			return live(f.dot);
		}
		yield* g.callName(f, live(I), "forceMove", [live(f.src)]);
		rt.setSv(f, "storedorgan", live(I));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You insert the ＀ into ＀.</span>", [live(I), live(f.src)])]);
	} else {
		if (!truthy((rt.istype(live(I), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) return f.dot;
		if (!truthy(rt.sv(f, "storedorgan"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>There's no implant in ＀ for you to remove.</span>", [live(f.src)])]);
		} else {
			rt.modField(f, (floorloc = rt.getStep(f, live(user), 0)), "contents", rt.sv(f, "contents"), add);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You remove the ＀ from ＀.</span>", [rt.sv(f, "storedorgan"), live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.fv(f, "usesound", live(I)), 50, 1]);
			rt.setSv(f, "storedorgan", null);
			if (!isEqual(rt.sv(f, "uses"), -1)) {
				rt.incSrcVar(f, "uses", -1, true);
			}
			if (truthy(rt.sv(f, "uses"))) return f.dot;
			rt.setSv(f, "desc", fmt("＀ Looks like it's been used up.", [rt.initial(f, live(f.src), "desc")]));
		}
	}
	return f.dot;
}, true);
