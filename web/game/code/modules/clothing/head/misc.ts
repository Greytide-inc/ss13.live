// From code/modules/clothing/head/misc.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8133, "/obj/item/clothing/head/centhat", "/obj/item/clothing/head", {
	name: "１Centcom hat",
	icon_state: "centcom",
	desc: "It's good to be emperor.",
	item_state: "that",
	flags_inv: 0,
	armor: null,
	strip_delay: 80,
});

// /obj/item/clothing/head/centhat/proc/<init>  (code/modules/clothing/head/misc.dm:9)
rt.def("/obj/item/clothing/head/centhat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 15, "laser", 30, "energy", 10, "bomb", 25, "bio", 0, "rad", 0, "fire", 50, "acid", 50]));
	return f.dot;
});

rt.type(8118, "/obj/item/clothing/head/fedora", "/obj/item/clothing/head", {
	name: "fedora",
	icon_state: "fedora",
	item_state: "fedora",
	armor: null,
	desc: "A really cool hat if you're a mobster. A really lame hat if you're not.",
	dynamic_hair_suffix: "+detective",
	pockets: rt.typePath("/obj/item/weapon/storage/internal/pocket/small"),
});

// /obj/item/clothing/head/fedora/proc/<init>  (code/modules/clothing/head/misc.dm:184)
rt.def("/obj/item/clothing/head/fedora/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 25, "bullet", 5, "laser", 25, "energy", 10, "bomb", 0, "bio", 0, "rad", 0, "fire", 30, "acid", 50]));
	return f.dot;
});

// /obj/item/clothing/head/fedora/proc/suicide_act  (code/modules/clothing/head/misc.dm:190)  may sleep
rt.def("/obj/item/clothing/head/fedora/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let H: Value = null;
	f.vars = () => [user, H];
	if (isEqual(rt.fv(f, "gender", live(user)), "female")) {
		return 0;
	}
	H = live(user);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is donning ＀! It looks like they're trying to be nice to girls.</span>", [live(user), live(f.src)])]);
	yield* g.callName(f, live(user), "say", ["M'lady."]);
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	rt.setFv(f, "facial_hair_style", live(H), "Neckbeard");
	return 1;
}, true);

rt.type(8171, "/obj/item/clothing/head/crown", "/obj/item/clothing/head", {
	name: "crown",
	desc: "A crown fit for a king, a petty king maybe.",
	icon_state: "crown",
	armor: null,
	resistance_flags: 2,
});

// /obj/item/clothing/head/crown/proc/<init>  (code/modules/clothing/head/misc.dm:278)
rt.def("/obj/item/clothing/head/crown/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 15, "bullet", 0, "laser", 0, "energy", 15, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]));
	return f.dot;
});
