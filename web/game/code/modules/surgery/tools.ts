// From code/modules/surgery/tools.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6661, "/obj/item/weapon/retractor", "/obj/item/weapon", {
	flags: 64,
	name: "retractor",
	desc: "Retracts stuff.",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	icon_state: "retractor",
	materials: null,
	w_class: 1,
	origin_tech: "materials=1;biotech=1",
});

// /obj/item/weapon/retractor/proc/<init>  (code/modules/surgery/tools.dm:6)
rt.def("/obj/item/weapon/retractor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 6000, "$glass", 3000]));
	return f.dot;
});

rt.type(6658, "/obj/item/weapon/hemostat", "/obj/item/weapon", {
	flags: 64,
	name: "hemostat",
	desc: "You think you have seen this before.",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	icon_state: "hemostat",
	materials: null,
	w_class: 1,
	origin_tech: "materials=1;biotech=1",
	attack_verb: null,
});

// /obj/item/weapon/hemostat/proc/<init>  (code/modules/surgery/tools.dm:17)
rt.def("/obj/item/weapon/hemostat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 5000, "$glass", 2500]));
	rt.setSv(f, "attack_verb", rt.list("attacked", "pinched"));
	return f.dot;
});

rt.type(6667, "/obj/item/weapon/cautery", "/obj/item/weapon", {
	flags: 64,
	name: "cautery",
	desc: "This stops bleeding.",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	icon_state: "cautery",
	materials: null,
	w_class: 1,
	origin_tech: "materials=1;biotech=1",
	attack_verb: null,
});

// /obj/item/weapon/cautery/proc/<init>  (code/modules/surgery/tools.dm:29)
rt.def("/obj/item/weapon/cautery/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2500, "$glass", 750]));
	$0 = $0;
	rt.setSv(f, "attack_verb", rt.list("burnt"));
	return f.dot;
});

rt.type(6665, "/obj/item/weapon/surgicaldrill", "/obj/item/weapon", {
	flags: 64,
	name: "surgical drill",
	desc: "You can drill using this item. You dig?",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	icon_state: "drill",
	hitsound: rt.rsc("sound/weapons/circsawhit.ogg"),
	materials: null,
	force: 15,
	w_class: 3,
	origin_tech: "materials=1;biotech=1",
	attack_verb: null,
});

// /obj/item/weapon/surgicaldrill/proc/<init>  (code/modules/surgery/tools.dm:42)
rt.def("/obj/item/weapon/surgicaldrill/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$glass", 6000]));
	$0 = $0;
	rt.setSv(f, "attack_verb", rt.list("drilled"));
	return f.dot;
});

rt.type(6655, "/obj/item/weapon/scalpel", "/obj/item/weapon", {
	flags: 64,
	throw_speed: 3,
	throw_range: 5,
	name: "scalpel",
	desc: "Cut, cut, and once more cut.",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	icon_state: "scalpel",
	force: 10,
	w_class: 1,
	throwforce: 5,
	materials: null,
	origin_tech: "materials=1;biotech=1",
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	sharpness: 2,
});

// /obj/item/weapon/scalpel/proc/<init>  (code/modules/surgery/tools.dm:60)
rt.def("/obj/item/weapon/scalpel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 4000, "$glass", 1000]));
	rt.setSv(f, "attack_verb", rt.list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut"));
	return f.dot;
});

// /obj/item/weapon/scalpel/proc/suicide_act  (code/modules/surgery/tools.dm:67)
rt.def("/obj/item/weapon/scalpel/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is slitting ＀ ＀ with ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.callName(f, live(user), "p_their", []), rt.op(f, "PickUnweighted", [3], ["wrists", "throat", "stomach"]), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
	return 1;
});

rt.type(6663, "/obj/item/weapon/circular_saw", "/obj/item/weapon", {
	flags: 64,
	throw_speed: 2,
	throw_range: 5,
	name: "circular saw",
	desc: "For heavy duty cutting.",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	icon_state: "saw",
	hitsound: rt.rsc("sound/weapons/circsawhit.ogg"),
	throwhitsound: rt.rsc("sound/weapons/pierce.ogg"),
	force: 15,
	w_class: 3,
	throwforce: 9,
	materials: null,
	origin_tech: "biotech=1;combat=1",
	attack_verb: null,
	sharpness: 1,
});

// /obj/item/weapon/circular_saw/proc/<init>  (code/modules/surgery/tools.dm:84)
rt.def("/obj/item/weapon/circular_saw/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$glass", 6000]));
	rt.setSv(f, "attack_verb", rt.list("attacked", "slashed", "sawed", "cut"));
	return f.dot;
});

rt.type(7648, "/obj/item/weapon/surgical_drapes", "/obj/item/weapon", {
	name: "surgical drapes",
	desc: "Nanotrasen brand surgical drapes provide optimal safety and infection control.",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	icon_state: "surgical_drapes",
	w_class: 1,
	origin_tech: "biotech=1",
	attack_verb: null,
});

// /obj/item/weapon/surgical_drapes/proc/<init>  (code/modules/surgery/tools.dm:96)
rt.def("/obj/item/weapon/surgical_drapes/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("slapped"));
	return f.dot;
});

// /obj/item/weapon/surgical_drapes/proc/attack  (code/modules/surgery/tools.dm:99)  may sleep
rt.def("/obj/item/weapon/surgical_drapes/proc/attack", function* attack(f: Frame) {
	if (truthy((yield* g.call(f, P("/proc/attempt_initiate_surgery"), null, [live(f.src), live(f.args[0]), live(f.args[1])])))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "user"] });

rt.type(7649, "/obj/item/weapon/organ_storage", "/obj/item/weapon", {
	name: "organ storage bag",
	desc: "A container for holding body parts.",
	icon: rt.rsc("icons/obj/storage.dmi"),
	icon_state: "evidenceobj",
});

// /obj/item/weapon/organ_storage/proc/afterattack  (code/modules/surgery/tools.dm:109)
rt.def("/obj/item/weapon/organ_storage/proc/afterattack", function afterattack(f: Frame, I: Value, user: Value, proximity: Value) {
	let xx: Value = null, yy: Value = null, img: Value = null;
	f.vars = () => [xx, yy, img];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (truthy(rt.len(f, rt.sv(f, "contents")))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ already has something inside it.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if ((!truthy((rt.istype(live(I), T("/obj/item/organ")) ? 1 : 0)) && !truthy((rt.istype(live(I), T("/obj/item/bodypart")) ? 1 : 0)))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ can only hold body parts!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	rt.callName(f, live(user), "visible_message", [fmt("＀ puts ＀ into ＀.", [live(user), live(I), live(f.src)]), fmt("<span class='notice'>You put ＀ inside ＀.</span>", [live(I), live(f.src)])]);
	rt.setSv(f, "icon_state", "evidence");
	xx = rt.fv(f, "pixel_x", live(I));
	yy = rt.fv(f, "pixel_y", live(I));
	rt.setFv(f, "pixel_x", live(I), 0);
	rt.setFv(f, "pixel_y", live(I), 0);
	rt.setFv(f, "plane", (img = rt.call(f, P("/proc/image"), null, ["icon", live(I), "layer", -1], rt.Args.Named)), -32767);
	rt.setFv(f, "pixel_x", live(I), live(xx));
	rt.setFv(f, "pixel_y", live(I), live(yy));
	rt.callSrc(f, "add_overlay", [live(img)]);
	rt.callSrc(f, "add_overlay", ["evidence"]);
	rt.setSv(f, "desc", fmt("An organ storage container holding ＀.", [live(I)]));
	rt.setFv(f, "loc", live(I), live(f.src));
	rt.setSv(f, "w_class", rt.fv(f, "w_class", live(I)));
	return f.dot;
});

// /obj/item/weapon/organ_storage/proc/attack_self  (code/modules/surgery/tools.dm:135)  may sleep
rt.def("/obj/item/weapon/organ_storage/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let I: Value = null;
	f.vars = () => [user, I];
	if (truthy(rt.len(f, rt.sv(f, "contents")))) {
		I = rt.index(rt.sv(f, "contents"), 1);
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ dumps ＀ from ＀.", [live(user), live(I), live(f.src)]), fmt("<span class='notice'>You dump ＀ from ＀.</span>", [live(I), live(f.src)])]);
		yield* g.srcCall(f, "cut_overlays");
		yield* g.callName(f, live(I), "forceMove", [rt.getStep(f, live(f.src), 0)]);
		rt.setSv(f, "icon_state", "evidenceobj");
		rt.setSv(f, "desc", "A container for holding body parts.");
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ is empty.", [live(f.src)])]);
	}
	return live(f.dot);
}, true);
