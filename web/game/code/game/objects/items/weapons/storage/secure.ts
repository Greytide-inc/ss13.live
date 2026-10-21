// From code/game/objects/items/weapons/storage/secure.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5582, "/obj/item/weapon/storage/secure", "/obj/item/weapon/storage", {
	icon_locking: "secureb",
	icon_sparking: "securespark",
	icon_opened: "secure0",
	locked: 1,
	code: "",
	l_code: null,
	l_set: 0,
	l_setshort: 0,
	l_hacking: 0,
	open: 0,
	name: "secstorage",
	w_class: 3,
	max_w_class: 2,
	max_combined_w_class: 14,
});

// /obj/item/weapon/storage/secure/proc/examine  (code/game/objects/items/weapons/storage/secure.dm:30)
rt.def("/obj/item/weapon/storage/secure/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if (truthy(rt.fv(f, "open", live(f.src)))) {
		$1 = "open";
	} else {
		$1 = "closed";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("The service panel is ＀.", [$1])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/storage/secure/proc/attackby  (code/game/objects/items/weapons/storage/secure.dm:35)  may sleep
rt.def("/obj/item/weapon/storage/secure/proc/attackby", function* attackby(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (truthy(rt.sv(f, "locked"))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				rt.setFv(f, "open", live(f.src), (!truthy(rt.fv(f, "open", live(f.src))) ? 1 : 0));
				$0 = live(f.args[1]);
				if (truthy(rt.sv(f, "open"))) {
					$1 = "open";
				} else {
					$1 = "close";
				}
				yield* g.callName(f, $0, "show_message", [fmt("<span class='notice'>You ＀ the service panel.</span>", [$1]), 1]);
			}
			return live(f.dot);
		}
		if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0)) && isEqual(rt.fv(f, "open", live(f.src)), 1)) && !truthy(rt.fv(f, "l_hacking", live(f.src))))) {
			yield* g.callName(f, live(f.args[1]), "show_message", ["<span class='danger'>Now attempting to reset internal memory, please hold.</span>", 1]);
			rt.setFv(f, "l_hacking", live(f.src), 1);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.usr), null, multiply(100, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				if (truthy(rt.op(f, "Prob", [], [33]))) {
					rt.setFv(f, "l_setshort", live(f.src), 1);
					rt.setFv(f, "l_set", live(f.src), 0);
					yield* g.callName(f, live(f.args[1]), "show_message", ["<span class='danger'>Internal memory reset.  Please give it a few seconds to reinitialize.</span>", 1]);
					yield* g.call(f, P("/proc/sleep"), null, [80]);
					rt.setFv(f, "l_setshort", live(f.src), 0);
					rt.setFv(f, "l_hacking", live(f.src), 0);
				} else {
					yield* g.callName(f, live(f.args[1]), "show_message", ["<span class='danger'>Unable to reset internal memory.</span>", 1]);
					rt.setFv(f, "l_hacking", live(f.src), 0);
				}
			} else {
				rt.setFv(f, "l_hacking", live(f.src), 0);
			}
			return live(f.dot);
		}
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/storage/secure/proc/MouseDrop  (code/game/objects/items/weapons/storage/secure.dm:66)  may sleep
rt.def("/obj/item/weapon/storage/secure/proc/MouseDrop", function* MouseDrop(f: Frame) {
	if (truthy(rt.sv(f, "locked"))) {
		yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.usr)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>It's locked!</span>"]);
		return 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["over_object", "src_location", "over_location"] });

// /obj/item/weapon/storage/secure/proc/attack_self  (code/game/objects/items/weapons/storage/secure.dm:72)  may sleep
rt.def("/obj/item/weapon/storage/secure/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let dat: Value = null, message: Value = null;
	let $0: any, $1: any;
	f.vars = () => [user, dat, message, $0, $1];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	$0 = live(f.src);
	if (truthy(rt.fv(f, "locked", live(f.src)))) {
		$1 = "LOCKED";
	} else {
		$1 = "UNLOCKED";
	}
	dat = fmt("<TT><B>＀</B><BR>\n\nLock Status: ＀", [$0, $1]);
	message = "Code";
	if ((isEqual(rt.fv(f, "l_set", live(f.src)), 0) && !truthy(rt.fv(f, "l_setshort", live(f.src))))) {
		dat = rt.modify(live(dat), "<p>\n<b>5-DIGIT PASSCODE NOT SET.<br>ENTER NEW PASSCODE.</b>", add);
	}
	if (truthy(rt.fv(f, "l_setshort", live(f.src)))) {
		dat = rt.modify(live(dat), "<p>\n<font color=red><b>ALERT: MEMORY SYSTEM ERROR - 6040 201</b></font>", add);
	}
	message = fmt("＀", [rt.fv(f, "code", live(f.src))]);
	if (!truthy(rt.fv(f, "locked", live(f.src)))) {
		message = "*****";
	}
	dat = rt.modify(live(dat), fmt("<HR>\n>＀<BR>\n<A href='?src=＃;type=1'>1</A>-<A href='?src=＃;type=2'>2</A>-<A href='?src=＃;type=3'>3</A><BR>\n<A href='?src=＃;type=4'>4</A>-<A href='?src=＃;type=5'>5</A>-<A href='?src=＃;type=6'>6</A><BR>\n<A href='?src=＃;type=7'>7</A>-<A href='?src=＃;type=8'>8</A>-<A href='?src=＃;type=9'>9</A><BR>\n<A href='?src=＃;type=R'>R</A>-<A href='?src=＃;type=0'>0</A>-<A href='?src=＃;type=E'>E</A><BR>\n</TT>", [live(message), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src), live(f.src)]), add);
	rt.op(f, "Browse", [], [live(user), live(dat), "window=caselock;size=300x280"], false);
	return f.dot;
}, true);

// /obj/item/weapon/storage/secure/proc/Topic  (code/game/objects/items/weapons/storage/secure.dm:86)  may sleep
rt.def("/obj/item/weapon/storage/secure/proc/Topic", function* Topic(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || truthy((yield* g.callName(f, live(f.usr), "restrained", [])))) || rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "type"))) {
		if (isEqual(rt.at(live(f.args[1]), "type"), "E")) {
			if ((((isEqual(rt.fv(f, "l_set", live(f.src)), 0) && isEqual(rt.length(rt.fv(f, "code", live(f.src))), 5)) && !truthy(rt.fv(f, "l_setshort", live(f.src)))) && !isEqual(rt.fv(f, "code", live(f.src)), "ERROR"))) {
				rt.setFv(f, "l_code", live(f.src), rt.fv(f, "code", live(f.src)));
				rt.setFv(f, "l_set", live(f.src), 1);
			} else {
				if ((isEqual(rt.fv(f, "code", live(f.src)), rt.fv(f, "l_code", live(f.src))) && isEqual(rt.fv(f, "l_set", live(f.src)), 1))) {
					rt.setFv(f, "locked", live(f.src), 0);
					yield* g.srcCall(f, "cut_overlays");
					yield* g.srcCall(f, "add_overlay", rt.sv(f, "icon_opened"));
					rt.setFv(f, "code", live(f.src), null);
				} else {
					rt.setFv(f, "code", live(f.src), "ERROR");
				}
			}
		} else {
			if ((isEqual(rt.at(live(f.args[1]), "type"), "R") && !truthy(rt.fv(f, "l_setshort", live(f.src))))) {
				rt.setFv(f, "locked", live(f.src), 1);
				yield* g.srcCall(f, "cut_overlays");
				rt.setFv(f, "code", live(f.src), null);
				yield* g.callName(f, live(f.src), "close", [live(f.usr)]);
			} else {
				rt.modField(f, live(f.src), "code", fmt("＀", [(yield* g.call(f, P("/proc/sanitize_text"), null, [rt.at(live(f.args[1]), "type")]))]), add);
				if (rt.gt(rt.length(rt.fv(f, "code", live(f.src))), 5)) {
					rt.setFv(f, "code", live(f.src), "ERROR");
				}
			}
		}
		yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.usr)]);
		M = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [1, rt.fv(f, "loc", live(f.src))])), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if ((truthy(rt.fv(f, "client", live(M))) && isEqual(rt.fv(f, "machine", live(M)), live(f.src)))) {
				yield* g.callName(f, live(f.src), "attack_self", [live(M)]);
			}
			return live(f.dot);
		}
		rt.endFor(f, 0);
	}
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/item/weapon/storage/secure/proc/storage_contents_dump_act  (code/game/objects/items/weapons/storage/secure.dm:120)  may sleep
rt.def("/obj/item/weapon/storage/secure/proc/storage_contents_dump_act", function* storage_contents_dump_act(f: Frame) {
	if (truthy(rt.sv(f, "locked"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>It's locked!</span>"]);
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["src_object", "user"] });

// /obj/item/weapon/storage/secure/proc/can_be_inserted  (code/game/objects/items/weapons/storage/secure.dm:127)
rt.def("/obj/item/weapon/storage/secure/proc/can_be_inserted", function can_be_inserted(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (truthy(rt.sv(f, "locked"))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["W", "stop_messages"] });

rt.type(5583, "/obj/item/weapon/storage/secure/briefcase", "/obj/item/weapon/storage/secure", {
	throw_speed: 2,
	throw_range: 4,
	name: "secure briefcase",
	icon: rt.rsc("icons/obj/storage.dmi"),
	icon_state: "secure",
	item_state: "sec-case",
	desc: "A large briefcase with a digital locking system.",
	force: 8,
	hitsound: "swing_hit",
	w_class: 4,
	max_w_class: 3,
	max_combined_w_class: 21,
	attack_verb: null,
});

// /obj/item/weapon/storage/secure/briefcase/proc/PopulateContents  (code/game/objects/items/weapons/storage/secure.dm:149)  may sleep
rt.def("/obj/item/weapon/storage/secure/briefcase/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/paper"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/pen"), [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/storage/secure/briefcase/proc/attack_hand  (code/game/objects/items/weapons/storage/secure.dm:153)  may sleep
rt.def("/obj/item/weapon/storage/secure/briefcase/proc/attack_hand", function* attack_hand(f: Frame) {
	if ((isEqual(rt.fv(f, "loc", live(f.src)), live(f.args[0])) && isEqual(rt.fv(f, "locked", live(f.src)), 1))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＀ is locked and cannot be opened!</span>", [live(f.src)])]);
		yield* g.srcCall(f, "add_fingerprint", live(f.args[0]));
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user"] });

rt.type(5584, "/obj/item/weapon/storage/secure/briefcase/syndie", "/obj/item/weapon/storage/secure/briefcase", {
	force: 15,
});

// /obj/item/weapon/storage/secure/briefcase/syndie/proc/PopulateContents  (code/game/objects/items/weapons/storage/secure.dm:164)  may sleep
rt.def("/obj/item/weapon/storage/secure/briefcase/syndie/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	i = 0;
	while (rt.lt(live(i), subtract(rt.sv(f, "storage_slots"), 2))) {
		yield* g.new_(f, T("/obj/item/stack/spacecash/c1000"), [live(f.src)]);
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

rt.type(5585, "/obj/item/weapon/storage/secure/safe", "/obj/item/weapon/storage/secure", {
	icon_opened: "safe0",
	icon_locking: "safeb",
	icon_sparking: "safespark",
	anchored: 1,
	name: "secure safe",
	icon: rt.rsc("icons/obj/storage.dmi"),
	icon_state: "safe",
	force: 8,
	w_class: 6,
	max_w_class: 8,
	density: 0,
	cant_hold: null,
});

// /obj/item/weapon/storage/secure/safe/proc/<init>  (code/game/objects/items/weapons/storage/secure.dm:185)
rt.def("/obj/item/weapon/storage/secure/safe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cant_hold", rt.list(T("/obj/item/weapon/storage/secure/briefcase")));
	return f.dot;
});

// /obj/item/weapon/storage/secure/safe/proc/PopulateContents  (code/game/objects/items/weapons/storage/secure.dm:188)  may sleep
rt.def("/obj/item/weapon/storage/secure/safe/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/paper"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/pen"), [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/storage/secure/safe/proc/attack_hand  (code/game/objects/items/weapons/storage/secure.dm:192)  may sleep
rt.def("/obj/item/weapon/storage/secure/safe/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_self", live(user)));
}, true);
