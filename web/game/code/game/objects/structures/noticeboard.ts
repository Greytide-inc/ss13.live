// From code/game/objects/structures/noticeboard.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12820, "/obj/structure/noticeboard", "/obj/structure", {
	notices: 0,
	anchored: 1,
	name: "notice board",
	desc: "A board for pinning important notices upon.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "nboard00",
	density: 0,
	obj_integrity: 150,
	max_integrity: 150,
});

// /obj/structure/noticeboard/proc/Initialize  (code/game/objects/structures/noticeboard.dm:13)
rt.def("/obj/structure/noticeboard/proc/Initialize", function Initialize(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[0]))) {
		return live(f.dot);
	}
	I = null;
	rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (rt.gt(rt.sv(f, "notices"), 4)) {
			break;
		}
		if (truthy((rt.istype(live(I), T("/obj/item/weapon/paper")) ? 1 : 0))) {
			rt.setFv(f, "loc", live(I), live(f.src));
			rt.incSrcVar(f, "notices", 1, true);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "icon_state", fmt("nboard0＀", [rt.sv(f, "notices")]));
	return f.dot;
}, false, { args: ["mapload"] });

// /obj/structure/noticeboard/proc/attackby  (code/game/objects/structures/noticeboard.dm:27)  may sleep
rt.def("/obj/structure/noticeboard/proc/attackby", function* attackby(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/paper")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/photo")) ? 1 : 0)))) {
		if (!truthy((yield* g.srcCall(f, "allowed", live(f.args[1]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='info'>You are not authorized to add notices</span>"]);
			return live(f.dot);
		}
		if (rt.lt(rt.sv(f, "notices"), 5)) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
				return live(f.dot);
			}
			rt.incSrcVar(f, "notices", 1, true);
			rt.setSv(f, "icon_state", fmt("nboard0＀", [rt.sv(f, "notices")]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You pin the ＀ to the noticeboard.</span>", [live(f.args[0])])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>The notice board is full</span>"]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/structure/noticeboard/proc/attack_hand  (code/game/objects/structures/noticeboard.dm:43)
rt.def("/obj/structure/noticeboard/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	let auth: Value = null, dat: Value = null, _P: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [auth, dat, _P, $0, $1, $2, $3, $e];
	auth = rt.callSrc(f, "allowed", [live(user)]);
	dat = fmt("<B>＀</B><BR>", [rt.sv(f, "name")]);
	_P = null;
	rt.forList(f, 0, live(f.src), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		if (truthy((rt.istype(live(_P), T("/obj/item/weapon/paper")) ? 1 : 0))) {
			$0 = live(f.src);
			$1 = live(_P);
			$2 = rt.fv(f, "name", live(_P));
			if (truthy(live(auth))) {
				$3 = fmt("<A href='?src=＃;write=＃'>Write</A> <A href='?src=＃;remove=＃'>Remove</A>", [live(f.src), live(_P), live(f.src), live(_P)]);
			} else {
				$3 = "";
			}
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;read=＃'>＀</A> ＀<BR>", [$0, $1, $2, $3]), add);
		} else {
			$0 = live(f.src);
			$1 = live(_P);
			$2 = rt.fv(f, "name", live(_P));
			if (truthy(live(auth))) {
				$3 = fmt("<A href='?src=＃;remove=＃'>Remove</A>", [live(f.src), live(_P)]);
			} else {
				$3 = "";
			}
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;read=＃'>＀</A> ＀<BR>", [$0, $1, $2, $3]), add);
		}
	}
	rt.endFor(f, 0);
	rt.op(f, "Browse", [], [live(user), fmt("<HEAD><TITLE>Notices</TITLE></HEAD>＀", [live(dat)]), "window=noticeboard"], false);
	rt.call(f, P("/proc/onclose"), null, [live(user), "noticeboard"]);
	return f.dot;
});

// /obj/structure/noticeboard/proc/Topic  (code/game/objects/structures/noticeboard.dm:54)  may sleep
rt.def("/obj/structure/noticeboard/proc/Topic", function* Topic(f: Frame) {
	let I: Value = null, _P: Value = null, I_1: Value = null;
	f.vars = () => [I, _P, I_1];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	if (truthy(rt.at(live(f.args[1]), "remove"))) {
		if ((truthy(rt.fv(f, "stat", live(f.usr))) || truthy((yield* g.callName(f, live(f.usr), "restrained", []))))) {
			return live(f.dot);
		}
		if ((truthy((rt.istype((I = rt.locateIn(f, rt.at(live(f.args[1]), "remove"), rt.sv(f, "contents"))), T("/obj/item")) ? 1 : 0)) && isEqual(rt.fv(f, "loc", live(I)), live(f.src)))) {
			rt.setFv(f, "loc", live(I), rt.fv(f, "loc", live(f.usr)));
			yield* g.callName(f, live(f.usr), "put_in_hands", [live(I)]);
			rt.incSrcVar(f, "notices", -1, true);
			rt.setSv(f, "icon_state", fmt("nboard0＀", [rt.sv(f, "notices")]));
		}
	}
	if (truthy(rt.at(live(f.args[1]), "write"))) {
		if ((truthy(rt.fv(f, "stat", live(f.usr))) || truthy((yield* g.callName(f, live(f.usr), "restrained", []))))) {
			return live(f.dot);
		}
		if ((truthy((rt.istype((_P = rt.locateIn(f, rt.at(live(f.args[1]), "write"), rt.sv(f, "contents"))), T("/obj/item")) ? 1 : 0)) && isEqual(rt.fv(f, "loc", live(_P)), live(f.src)))) {
			if (truthy((I_1 = (yield* g.callName(f, live(f.usr), "is_holding_item_of_type", [T("/obj/item/weapon/pen")]))))) {
				yield* g.srcCall(f, "add_fingerprint", live(f.usr));
				yield* g.callName(f, live(_P), "attackby", [live(I_1), live(f.usr)]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>You'll need something to write with!</span>"]);
			}
		}
	}
	if (!truthy(rt.at(live(f.args[1]), "read"))) return f.dot;
	if (!(truthy((rt.istype((I = rt.locateIn(f, rt.at(live(f.args[1]), "read"), rt.sv(f, "contents"))), T("/obj/item")) ? 1 : 0)) && isEqual(rt.fv(f, "loc", live(I)), live(f.src)))) return f.dot;
	yield* g.callName(f, live(f.usr), "examinate", [live(I)]);
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/structure/noticeboard/proc/deconstruct  (code/game/objects/structures/noticeboard.dm:84)  may sleep
rt.def("/obj/structure/noticeboard/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 1]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(12821, "/obj/structure/noticeboard/captain", "/obj/structure/noticeboard", {
	name: "Captain's Notice Board",
	desc: "Important notices from the Captain.",
	req_access: null,
});

// /obj/structure/noticeboard/captain/proc/<init>  (code/game/objects/structures/noticeboard.dm:93)
rt.def("/obj/structure/noticeboard/captain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(20));
	return f.dot;
});

rt.type(12822, "/obj/structure/noticeboard/hop", "/obj/structure/noticeboard", {
	name: "Head of Personnel's Notice Board",
	desc: "Important notices from the Head of Personnel.",
	req_access: null,
});

// /obj/structure/noticeboard/hop/proc/<init>  (code/game/objects/structures/noticeboard.dm:98)
rt.def("/obj/structure/noticeboard/hop/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(57));
	return f.dot;
});

rt.type(12823, "/obj/structure/noticeboard/ce", "/obj/structure/noticeboard", {
	name: "Chief Engineer's Notice Board",
	desc: "Important notices from the Chief Engineer.",
	req_access: null,
});

// /obj/structure/noticeboard/ce/proc/<init>  (code/game/objects/structures/noticeboard.dm:103)
rt.def("/obj/structure/noticeboard/ce/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(56));
	return f.dot;
});

rt.type(12824, "/obj/structure/noticeboard/hos", "/obj/structure/noticeboard", {
	name: "Head of Security's Notice Board",
	desc: "Important notices from the Head of Security.",
	req_access: null,
});

// /obj/structure/noticeboard/hos/proc/<init>  (code/game/objects/structures/noticeboard.dm:108)
rt.def("/obj/structure/noticeboard/hos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(58));
	return f.dot;
});

rt.type(12825, "/obj/structure/noticeboard/cmo", "/obj/structure/noticeboard", {
	name: "Chief Medical Officer's Notice Board",
	desc: "Important notices from the Chief Medical Officer.",
	req_access: null,
});

// /obj/structure/noticeboard/cmo/proc/<init>  (code/game/objects/structures/noticeboard.dm:113)
rt.def("/obj/structure/noticeboard/cmo/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(40));
	return f.dot;
});

rt.type(12826, "/obj/structure/noticeboard/rd", "/obj/structure/noticeboard", {
	name: "Research Director's Notice Board",
	desc: "Important notices from the Research Director.",
	req_access: null,
});

// /obj/structure/noticeboard/rd/proc/<init>  (code/game/objects/structures/noticeboard.dm:118)
rt.def("/obj/structure/noticeboard/rd/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(30));
	return f.dot;
});

rt.type(12827, "/obj/structure/noticeboard/qm", "/obj/structure/noticeboard", {
	name: "Quartermaster's Notice Board",
	desc: "Important notices from the Quartermaster.",
	req_access: null,
});

// /obj/structure/noticeboard/qm/proc/<init>  (code/game/objects/structures/noticeboard.dm:123)
rt.def("/obj/structure/noticeboard/qm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(41));
	return f.dot;
});

rt.type(12828, "/obj/structure/noticeboard/staff", "/obj/structure/noticeboard", {
	name: "Staff Notice Board",
	desc: "Important notices from the heads of staff.",
	req_access: null,
});

// /obj/structure/noticeboard/staff/proc/<init>  (code/game/objects/structures/noticeboard.dm:128)
rt.def("/obj/structure/noticeboard/staff/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(19));
	return f.dot;
});
