// From code/modules/paperwork/stamps.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7626, "/obj/item/weapon/stamp", "/obj/item/weapon", {
	throw_speed: 3,
	throw_range: 7,
	pressure_resistance: 2,
	name: "１GRANTED rubber stamp",
	desc: "A rubber stamp for stamping important documents.",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "stamp-ok",
	item_state: "stamp",
	throwforce: 0,
	w_class: 1,
	materials: null,
	item_color: "cargo",
	attack_verb: null,
});

// /obj/item/weapon/stamp/proc/<init>  (code/modules/paperwork/stamps.dm:11)
rt.def("/obj/item/weapon/stamp/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 60]));
	$0 = $0;
	rt.setSv(f, "attack_verb", rt.list("stamped"));
	return f.dot;
});

// /obj/item/weapon/stamp/proc/suicide_act  (code/modules/paperwork/stamps.dm:17)
rt.def("/obj/item/weapon/stamp/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ stamps 'VOID' on ＀ forehead, then promptly falls over, dead.</span>", [live(user), rt.callName(f, live(user), "p_their", [])])]);
	return 8;
});

// /obj/item/weapon/stamp/proc/attack_paw  (code/modules/paperwork/stamps.dm:71)  may sleep
rt.def("/obj/item/weapon/stamp/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

rt.type(7637, "/obj/item/weapon/stamp/chameleon", "/obj/item/weapon/stamp", {
	stamp_types: null,
	stamp_names: null,
	actions_types: null,
});

// /obj/item/weapon/stamp/chameleon/proc/<init>  (code/modules/paperwork/stamps.dm:76)
rt.def("/obj/item/weapon/stamp/chameleon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle")));
	return f.dot;
});

// /obj/item/weapon/stamp/chameleon/proc/Initialize  (code/modules/paperwork/stamps.dm:82)  may sleep
rt.def("/obj/item/weapon/stamp/chameleon/proc/Initialize", function* Initialize(f: Frame) {
	let i: Value = null, stamp_type: Value = null;
	let $e: any;
	f.vars = () => [i, stamp_type, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "stamp_types", subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/stamp")])), rt.sv(f, "type")));
	rt.setSv(f, "stamp_names", rt.list());
	i = null;
	rt.forList(f, 0, rt.sv(f, "stamp_types"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.modSrcVar(f, "stamp_names", rt.initial(f, (stamp_type = live(i)), "name"), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "stamp_names", (yield* g.call(f, P("/proc/sortList"), null, [rt.sv(f, "stamp_names")])));
	return f.dot;
}, true);

// /obj/item/weapon/stamp/chameleon/proc/emp_act  (code/modules/paperwork/stamps.dm:94)
rt.def("/obj/item/weapon/stamp/chameleon/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	rt.callSrc(f, "change_to", [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "stamp_types")])]);
	return f.dot;
});

// /obj/item/weapon/stamp/chameleon/proc/change_to  (code/modules/paperwork/stamps.dm:97)
rt.def("/obj/item/weapon/stamp/chameleon/proc/change_to", function change_to(f: Frame, stamp_type: Value) {
	rt.setSv(f, "name", rt.initial(f, live(stamp_type), "name"));
	rt.setSv(f, "icon_state", rt.initial(f, live(stamp_type), "icon_state"));
	rt.setSv(f, "item_color", rt.initial(f, live(stamp_type), "item_color"));
	return f.dot;
});

// /obj/item/weapon/stamp/chameleon/proc/attack_self  (code/modules/paperwork/stamps.dm:102)  may sleep
rt.def("/obj/item/weapon/stamp/chameleon/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let input_stamp: Value = null, stamp_type: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [user, input_stamp, stamp_type, i, $e];
	input_stamp = (yield* g.op(f, "Prompt", [1], [null, "Choose a stamp.", "Choose a stamp to disguise as.", live(user), rt.sv(f, "stamp_names")]));
	if (!((truthy(live(user)) && truthy((rt.isIn(f, live(f.src), rt.fv(f, "contents", live(user))) ? 1 : 0))) && truthy(live(input_stamp)))) return f.dot;
	stamp_type = null;
	i = null;
	rt.forList(f, 0, rt.sv(f, "stamp_types"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (isEqual(rt.initial(f, (stamp_type = live(i)), "name"), live(input_stamp))) {
			break;
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "change_to", live(stamp_type));
	return f.dot;
}, true);
