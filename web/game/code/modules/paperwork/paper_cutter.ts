// From code/modules/paperwork/paper_cutter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7619, "/obj/item/weapon/papercutter", "/obj/item/weapon", {
	storedpaper: null,
	storedcutter: null,
	cuttersecured: 1,
	pass_flags: 1,
	name: "paper cutter",
	desc: "Standard office equipment. Precisely cuts paper using a large blade.",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "papercutter",
	force: 5,
	throwforce: 5,
	w_class: 3,
});

// /obj/item/weapon/papercutter/proc/New  (code/modules/paperwork/paper_cutter.dm:16)  may sleep
rt.def("/obj/item/weapon/papercutter/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "storedcutter", (yield* g.new_(f, T("/obj/item/weapon/hatchet/cutterblade"), [live(f.src)])));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/papercutter/proc/suicide_act  (code/modules/paperwork/paper_cutter.dm:23)  may sleep
rt.def("/obj/item/weapon/papercutter/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let C: Value = null, BP: Value = null;
	f.vars = () => [user, C, BP];
	if (truthy(rt.sv(f, "storedcutter"))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is beheading ＀self with ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), (yield* g.callName(f, live(user), "p_them", [])), rt.fv(f, "name", live(f.src)), (yield* g.callName(f, live(user), "p_theyre", []))])]);
		if (truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) {
			C = live(user);
			if (truthy((BP = (yield* g.callName(f, live(C), "get_bodypart", ["head"]))))) {
				yield* g.callName(f, live(BP), "drop_limb", []);
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.op(f, "PickUnweighted", [3], [rt.rsc("sound/misc/desceration-01.ogg"), rt.rsc("sound/misc/desceration-02.ogg"), rt.rsc("sound/misc/desceration-01.ogg")]), 50, 1, -1]);
			}
		}
		return 1;
	} else {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ repeatedly bashes ＀ against ＀ head! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.fv(f, "name", live(f.src)), (yield* g.callName(f, live(user), "p_their", [])), (yield* g.callName(f, live(user), "p_theyre", []))])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/gavel.ogg"), 50, 1, -1]);
		return 1;
	}
	return f.dot;
}, true);

// /obj/item/weapon/papercutter/proc/update_icon  (code/modules/paperwork/paper_cutter.dm:38)
rt.def("/obj/item/weapon/papercutter/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "storedcutter"))) {
		$0 = fmt("＀-cutter", [rt.initial(f, live(f.src), "icon_state")]);
	} else {
		$0 = fmt("＀", [rt.initial(f, live(f.src), "icon_state")]);
	}
	rt.setSv(f, "icon_state", $0);
	if (!truthy(rt.sv(f, "storedpaper"))) return f.dot;
	rt.callSrc(f, "add_overlay", ["paper"]);
	return f.dot;
});

// /obj/item/weapon/papercutter/proc/attackby  (code/modules/paperwork/paper_cutter.dm:46)  may sleep
rt.def("/obj/item/weapon/papercutter/proc/attackby", function* attackby(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/paper")) ? 1 : 0)) && !truthy(rt.sv(f, "storedpaper")))) {
		if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), "pageturn", 60, 1]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You place ＀ in ＀.</span>", [live(f.args[0]), live(f.src)])]);
		rt.setFv(f, "loc", live(f.args[0]), live(f.src));
		rt.setSv(f, "storedpaper", live(f.args[0]));
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/hatchet/cutterblade")) ? 1 : 0)) && !truthy(rt.sv(f, "storedcutter")))) {
		if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You replace ＀'s ＀.</span>", [live(f.src), live(f.args[0])])]);
		rt.setFv(f, "loc", live(f.args[0]), live(f.src));
		rt.setSv(f, "storedcutter", live(f.args[0]));
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && truthy(rt.sv(f, "storedcutter")))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		$0 = live(f.args[1]);
		$1 = rt.sv(f, "storedcutter");
		if (truthy(rt.sv(f, "cuttersecured"))) {
			$1 = $1;
			$2 = "unsecured";
		} else {
			$2 = "secured";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>＀ has been ＀.</span>", [$1, $2])]);
		rt.setSv(f, "cuttersecured", (!truthy(rt.sv(f, "cuttersecured")) ? 1 : 0));
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["P", "user", "params"] });

// /obj/item/weapon/papercutter/proc/attack_hand  (code/modules/paperwork/paper_cutter.dm:72)  may sleep
rt.def("/obj/item/weapon/papercutter/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "add_fingerprint", live(user));
	if (!truthy(rt.sv(f, "storedcutter"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>The cutting blade is gone! You can't use ＀ now.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "cuttersecured"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You remove ＀'s ＀.</span>", [live(f.src), rt.sv(f, "storedcutter")])]);
		yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "storedcutter")]);
		rt.setSv(f, "storedcutter", null);
		yield* g.srcCall(f, "update_icon");
	}
	if (!truthy(rt.sv(f, "storedpaper"))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/slash.ogg"), 50, 1]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You neatly cut ＀.</span>", [rt.sv(f, "storedpaper")])]);
	rt.setSv(f, "storedpaper", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "storedpaper")]);
	yield* g.new_(f, T("/obj/item/weapon/paperslip"), [rt.getStep(f, live(f.src), 0)]);
	yield* g.new_(f, T("/obj/item/weapon/paperslip"), [rt.getStep(f, live(f.src), 0)]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/papercutter/proc/MouseDrop  (code/modules/paperwork/paper_cutter.dm:94)  may sleep
rt.def("/obj/item/weapon/papercutter/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value) {
	let M: Value = null, H: Value = null;
	f.vars = () => [over_object, M, H];
	if ((truthy((yield* g.callName(f, (M = live(f.usr)), "incapacitated", []))) || !truthy((yield* g.srcCall(f, "Adjacent", live(M)))))) {
		return live(f.dot);
	}
	if (isEqual(live(over_object), live(M))) {
		yield* g.callName(f, live(M), "put_in_hands", [live(f.src)]);
	} else {
		if (truthy((rt.istype(live(over_object), T("/obj/screen/inventory/hand")) ? 1 : 0))) {
			H = live(over_object);
			yield* g.callName(f, live(M), "putItemFromInventoryInHandIfPossible", [live(f.src), rt.fv(f, "held_index", live(H))]);
		}
	}
	yield* g.srcCall(f, "add_fingerprint", live(M));
	return f.dot;
}, true);

rt.type(7620, "/obj/item/weapon/paperslip", "/obj/item/weapon", {
	name: "paper slip",
	desc: "A little slip of paper left over after a larger piece was cut. Whoa.",
	icon_state: "paperslip",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	resistance_flags: 4,
	obj_integrity: 50,
	max_integrity: 50,
});

// /obj/item/weapon/paperslip/proc/New  (code/modules/paperwork/paper_cutter.dm:117)  may sleep
rt.def("/obj/item/weapon/paperslip/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	return f.dot;
}, true);
