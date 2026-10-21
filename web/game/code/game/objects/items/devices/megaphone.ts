// From code/game/objects/items/devices/megaphone.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9263, "/obj/item/device/megaphone", "/obj/item/device", {
	spamcheck: 0,
	emagged: 0,
	voicespan: null,
	name: "megaphone",
	desc: "A device used to project your voice. Loudly.",
	icon_state: "megaphone",
	item_state: "radio",
	w_class: 2,
	siemens_coefficient: 1,
});

// /obj/item/device/megaphone/proc/<init>  (code/game/objects/items/devices/megaphone.dm:10)
rt.def("/obj/item/device/megaphone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "voicespan", rt.list("command_headset"));
	return f.dot;
});

// /obj/item/device/megaphone/proc/get_held_item_speechspans  (code/game/objects/items/devices/megaphone.dm:13)
rt.def("/obj/item/device/megaphone/proc/get_held_item_speechspans", function get_held_item_speechspans(f: Frame, user: Value) {
	if (rt.gt(rt.sv(f, "spamcheck"), rt.worldTime(f))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ needs to recharge!</span>", [live(f.src)])]);
	} else {
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/megaphone.ogg"), 100, 0, 1]);
		rt.setSv(f, "spamcheck", add(rt.worldTime(f), 50));
		return rt.sv(f, "voicespan");
	}
	return f.dot;
});

// /obj/item/device/megaphone/proc/emag_act  (code/game/objects/items/devices/megaphone.dm:21)
rt.def("/obj/item/device/megaphone/proc/emag_act", function emag_act(f: Frame, user: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You overload ％！'s voice synthesizer.</span>", [live(f.src)])]);
	rt.setSv(f, "emagged", 1);
	rt.setSv(f, "voicespan", rt.list("reallybig", "userdanger"));
	return f.dot;
});

rt.type(9267, "/obj/item/device/megaphone/clown", "/obj/item/device/megaphone", {
	voicespan: null,
	name: "clown's megaphone",
	desc: "Something that should not exist.",
	icon_state: "megaphone-clown",
});

// /obj/item/device/megaphone/clown/proc/<init>  (code/game/objects/items/devices/megaphone.dm:41)
rt.def("/obj/item/device/megaphone/clown/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "voicespan", rt.list("clown"));
	return f.dot;
});
