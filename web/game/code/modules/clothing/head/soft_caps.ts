// From code/modules/clothing/head/soft_caps.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8073, "/obj/item/clothing/head/soft", "/obj/item/clothing/head", {
	flipped: 0,
	name: "cargo cap",
	desc: "It's a baseball hat in a tasteless yellow colour.",
	icon_state: "cargosoft",
	item_state: "helmet",
	item_color: "cargo",
	dog_fashion: rt.typePath("/datum/dog_fashion/head/cargo_tech"),
});

// /obj/item/clothing/head/soft/proc/dropped  (code/modules/clothing/head/soft_caps.dm:13)  may sleep
rt.def("/obj/item/clothing/head/soft/proc/dropped", function* dropped(f: Frame) {
	rt.setFv(f, "icon_state", live(f.src), fmt("＀soft", [rt.sv(f, "item_color")]));
	rt.setFv(f, "flipped", live(f.src), 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/clothing/head/soft/verb/flipcap  (code/modules/clothing/head/soft_caps.dm:21)  may sleep
rt.def("/obj/item/clothing/head/soft/verb/flipcap", function* flipcap(f: Frame) {
	yield* g.srcCall(f, "flip", live(f.usr));
	return f.dot;
}, true, { verb: { name: "Flip cap", category: "Object" } });

// /obj/item/clothing/head/soft/proc/AltClick  (code/modules/clothing/head/soft_caps.dm:25)  may sleep
rt.def("/obj/item/clothing/head/soft/proc/AltClick", function* AltClick(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.callName(f, live(f.args[0]), "canUseTopic", [null, live(f.src), "be_close", 1], rt.Args.Named)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You can't do that right now!</span>"]);
		return live(f.dot);
	} else {
		yield* g.srcCall(f, "flip", live(f.args[0]));
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clothing/head/soft/proc/flip  (code/modules/clothing/head/soft_caps.dm:34)  may sleep
rt.def("/obj/item/clothing/head/soft/proc/flip", function* flip(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!((truthy(rt.fv(f, "canmove", live(user))) && !truthy(rt.fv(f, "stat", live(user)))) && !truthy((yield* g.callName(f, live(user), "restrained", []))))) return f.dot;
	rt.setFv(f, "flipped", live(f.src), (!truthy(rt.fv(f, "flipped", live(f.src))) ? 1 : 0));
	if (truthy(rt.fv(f, "flipped", live(f.src)))) {
		rt.setSv(f, "icon_state", fmt("＀soft_flipped", [rt.sv(f, "item_color")]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You flip the hat backwards.</span>"]);
	} else {
		rt.setSv(f, "icon_state", fmt("＀soft", [rt.sv(f, "item_color")]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You flip the hat back in normal position.</span>"]);
	}
	yield* g.callName(f, live(f.usr), "update_inv_head", []);
	return f.dot;
}, true);

// /obj/item/clothing/head/soft/proc/examine  (code/modules/clothing/head/soft_caps.dm:45)
rt.def("/obj/item/clothing/head/soft/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if (truthy(rt.sv(f, "flipped"))) {
		$1 = "forwards";
	} else {
		$1 = "backwards";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>Alt-click the cap to flip it ＀.</span>", [$1])]);
	return f.dot;
}, false, { args: ["user"] });

rt.type(8084, "/obj/item/clothing/head/soft/sec", "/obj/item/clothing/head/soft", {
	name: "security cap",
	desc: "It's a robust baseball hat in tasteful red colour.",
	icon_state: "secsoft",
	item_color: "sec",
	armor: null,
	strip_delay: 60,
	dog_fashion: null,
});

// /obj/item/clothing/head/soft/sec/proc/<init>  (code/modules/clothing/head/soft_caps.dm:123)
rt.def("/obj/item/clothing/head/soft/sec/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 25, "laser", 25, "energy", 10, "bomb", 25, "bio", 0, "rad", 0, "fire", 20, "acid", 50]));
	return f.dot;
});
