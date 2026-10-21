// From code/modules/paperwork/clipboard.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7606, "/obj/item/weapon/clipboard", "/obj/item/weapon", {
	haspen: null,
	toppaper: null,
	throw_speed: 3,
	throw_range: 7,
	name: "clipboard",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "clipboard",
	item_state: "clipboard",
	throwforce: 0,
	w_class: 2,
	slot_flags: 512,
	resistance_flags: 4,
});

// /obj/item/weapon/clipboard/proc/Initialize  (code/modules/paperwork/clipboard.dm:16)  may sleep
rt.def("/obj/item/weapon/clipboard/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.srcCall(f, "update_icon");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/weapon/clipboard/proc/Destroy  (code/modules/paperwork/clipboard.dm:20)  may sleep
rt.def("/obj/item/weapon/clipboard/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "haspen")]);
	rt.setSv(f, "haspen", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "toppaper")]);
	rt.setSv(f, "toppaper", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/clipboard/proc/update_icon  (code/modules/paperwork/clipboard.dm:25)
rt.def("/obj/item/weapon/clipboard/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "toppaper"))) {
		rt.callSrc(f, "add_overlay", [rt.fv(f, "icon_state", rt.sv(f, "toppaper"))]);
		rt.callSrc(f, "copy_overlays", [rt.sv(f, "toppaper")]);
	}
	if (truthy(rt.sv(f, "haspen"))) {
		rt.callSrc(f, "add_overlay", ["clipboard_pen"]);
	}
	rt.callSrc(f, "add_overlay", ["clipboard_over"]);
	return f.dot;
});

// /obj/item/weapon/clipboard/proc/attackby  (code/modules/paperwork/clipboard.dm:35)  may sleep
rt.def("/obj/item/weapon/clipboard/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	f.vars = () => [W, user, params];
	if (truthy((rt.istype(live(W), T("/obj/item/weapon/paper")) ? 1 : 0))) {
		if (!truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(W), live(f.src)])))) {
			return live(f.dot);
		}
		rt.setSv(f, "toppaper", live(W));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You clip the paper onto ％！.</span>", [live(f.src)])]);
		yield* g.srcCall(f, "update_icon");
	} else {
		if (!truthy(rt.sv(f, "toppaper"))) return f.dot;
		yield* g.callName(f, rt.sv(f, "toppaper"), "attackby", [(yield* g.callName(f, live(user), "get_active_held_item", [])), live(user)]);
		yield* g.srcCall(f, "update_icon");
	}
	return f.dot;
}, true);

// /obj/item/weapon/clipboard/proc/attack_self  (code/modules/paperwork/clipboard.dm:47)  may sleep
rt.def("/obj/item/weapon/clipboard/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let dat: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [user, dat, _P, $e];
	dat = "<title>Clipboard</title>";
	if (truthy(rt.sv(f, "haspen"))) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;pen=1'>Remove Pen</A><BR><HR>", [live(f.src)]), add);
	} else {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;addpen=1'>Add Pen</A><BR><HR>", [live(f.src)]), add);
	}
	if (truthy(rt.sv(f, "toppaper"))) {
		_P = rt.sv(f, "toppaper");
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;write=＃'>Write</A> <A href='?src=＃;remove=＃'>Remove</A> - <A href='?src=＃;read=＃'>＀</A><BR><HR>", [live(f.src), live(_P), live(f.src), live(_P), live(f.src), live(_P), rt.fv(f, "name", live(_P))]), add);
		rt.forList(f, 0, live(f.src), T("/obj/item/weapon/paper"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_P = $e;
			if (isEqual(live(_P), rt.sv(f, "toppaper"))) {
				continue;
			}
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;write=＃'>Write</A> <A href='?src=＃;remove=＃'>Remove</A> <A href='?src=＃;top=＃'>Move to top</A> - <A href='?src=＃;read=＃'>＀</A><BR>", [live(f.src), live(_P), live(f.src), live(_P), live(f.src), live(_P), live(f.src), live(_P), rt.fv(f, "name", live(_P))]), add);
		}
		rt.endFor(f, 0);
	}
	rt.op(f, "Browse", [], [live(user), live(dat), "window=clipboard"], false);
	yield* g.call(f, P("/proc/onclose"), null, [live(user), "clipboard"]);
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	return f.dot;
}, true);

// /obj/item/weapon/clipboard/proc/Topic  (code/modules/paperwork/clipboard.dm:68)  may sleep
rt.def("/obj/item/weapon/clipboard/proc/Topic", function* Topic(f: Frame) {
	let held: Value = null, W: Value = null, _P: Value = null, newtop: Value = null;
	f.vars = () => [held, W, _P, newtop];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.fv(f, "stat", live(f.usr))) || truthy((yield* g.callName(f, live(f.usr), "restrained", []))))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, rt.fv(f, "contents", live(f.usr)), "Find", [live(f.src)])))) return f.dot;
	if (truthy(rt.at(live(f.args[1]), "pen"))) {
		if (truthy(rt.sv(f, "haspen"))) {
			rt.setFv(f, "loc", rt.sv(f, "haspen"), rt.fv(f, "loc", live(f.usr)));
			yield* g.callName(f, live(f.usr), "put_in_hands", [rt.sv(f, "haspen")]);
			rt.setSv(f, "haspen", null);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "addpen"))) {
		if (!truthy(rt.sv(f, "haspen"))) {
			if (truthy((rt.istype((held = (yield* g.callName(f, live(f.usr), "get_active_held_item", []))), T("/obj/item/weapon/pen")) ? 1 : 0))) {
				W = live(held);
				if (!truthy((yield* g.callName(f, live(f.usr), "transferItemToLoc", [live(W), live(f.src)])))) {
					return live(f.dot);
				}
				rt.setSv(f, "haspen", live(W));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You slot ＀ into ＀.</span>", [live(W), live(f.src)])]);
			}
		}
	}
	if (truthy(rt.at(live(f.args[1]), "write"))) {
		if ((truthy((rt.istype((_P = rt.locateIn(f, rt.at(live(f.args[1]), "write"), rt.world())), T("/obj/item")) ? 1 : 0)) && isEqual(rt.fv(f, "loc", live(_P)), live(f.src)))) {
			if (truthy((yield* g.callName(f, live(f.usr), "get_active_held_item", [])))) {
				yield* g.callName(f, live(_P), "attackby", [(yield* g.callName(f, live(f.usr), "get_active_held_item", [])), live(f.usr)]);
			}
		}
	}
	if (truthy(rt.at(live(f.args[1]), "remove"))) {
		if ((truthy((rt.istype((_P = rt.locateIn(f, rt.at(live(f.args[1]), "remove"), rt.world())), T("/obj/item")) ? 1 : 0)) && isEqual(rt.fv(f, "loc", live(_P)), live(f.src)))) {
			rt.setFv(f, "loc", live(_P), rt.fv(f, "loc", live(f.usr)));
			yield* g.callName(f, live(f.usr), "put_in_hands", [live(_P)]);
			if (isEqual(live(_P), rt.sv(f, "toppaper"))) {
				rt.setSv(f, "toppaper", null);
				if ((truthy((newtop = rt.locateIn(f, T("/obj/item/weapon/paper"), live(f.src)))) && !isEqual(live(newtop), live(_P)))) {
					rt.setSv(f, "toppaper", live(newtop));
				} else {
					rt.setSv(f, "toppaper", null);
				}
			}
		}
	}
	if (truthy(rt.at(live(f.args[1]), "read"))) {
		if ((truthy((rt.istype((_P = rt.locateIn(f, rt.at(live(f.args[1]), "read"), rt.world())), T("/obj/item/weapon/paper")) ? 1 : 0)) && isEqual(rt.fv(f, "loc", live(_P)), live(f.src)))) {
			yield* g.callName(f, live(f.usr), "examinate", [live(_P)]);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "top"))) {
		if ((truthy((rt.istype((_P = rt.locateIn(f, rt.at(live(f.args[1]), "top"), rt.world())), T("/obj/item")) ? 1 : 0)) && isEqual(rt.fv(f, "loc", live(_P)), live(f.src)))) {
			rt.setSv(f, "toppaper", live(_P));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You move ＀ to the top.</span>", [rt.fv(f, "name", live(_P))])]);
		}
	}
	yield* g.srcCall(f, "attack_self", live(f.usr));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["href", "href_list"] });
