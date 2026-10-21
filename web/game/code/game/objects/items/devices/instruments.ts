// From code/game/objects/items/devices/instruments.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9249, "/obj/item/device/instrument", "/obj/item/device", {
	song: null,
	instrumentId: "generic",
	instrumentExt: "ogg",
	name: "generic instrument",
	resistance_flags: 4,
	obj_integrity: 100,
	max_integrity: 100,
});

// /obj/item/device/instrument/proc/New  (code/game/objects/items/devices/instruments.dm:12)  may sleep
rt.def("/obj/item/device/instrument/proc/New", function* New(f: Frame) {
	rt.setSv(f, "song", (yield* g.new_(f, T("/datum/song/handheld"), [rt.sv(f, "instrumentId"), live(f.src)])));
	rt.setFv(f, "instrumentExt", rt.sv(f, "song"), rt.sv(f, "instrumentExt"));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/device/instrument/proc/Destroy  (code/game/objects/items/devices/instruments.dm:17)  may sleep
rt.def("/obj/item/device/instrument/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "song")]);
	rt.setSv(f, "song", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/device/instrument/proc/suicide_act  (code/game/objects/items/devices/instruments.dm:22)
rt.def("/obj/item/device/instrument/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ begins to play 'Gloomy Sunday'! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.callName(f, live(user), "p_theyre", [])])]);
	return 1;
});

// /obj/item/device/instrument/proc/Initialize  (code/game/objects/items/devices/instruments.dm:26)  may sleep
rt.def("/obj/item/device/instrument/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[0]))) return f.dot;
	rt.setFv(f, "tempo", rt.sv(f, "song"), (yield* g.callName(f, rt.sv(f, "song"), "sanitize_tempo", [rt.fv(f, "tempo", rt.sv(f, "song"))])));
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/item/device/instrument/proc/attack_self  (code/game/objects/items/devices/instruments.dm:31)  may sleep
rt.def("/obj/item/device/instrument/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((yield* g.callName(f, live(user), "IsAdvancedToolUser", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You don't have the dexterity to do this!</span>"]);
		return 1;
	}
	yield* g.srcCall(f, "interact", live(user));
	return f.dot;
}, true);

// /obj/item/device/instrument/proc/interact  (code/game/objects/items/devices/instruments.dm:37)  may sleep
rt.def("/obj/item/device/instrument/proc/interact", function* interact(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(live(user))) {
		return live(f.dot);
	}
	if ((((!truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0)) || truthy(rt.fv(f, "stat", live(user)))) || truthy((yield* g.callName(f, live(user), "restrained", [])))) || truthy(rt.fv(f, "lying", live(user))))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	yield* g.callName(f, rt.sv(f, "song"), "interact", [live(user)]);
	return f.dot;
}, true);
