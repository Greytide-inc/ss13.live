// From code/modules/reagents/reagent_containers/pill.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6528, "/obj/item/weapon/reagent_containers/pill", "/obj/item/weapon/reagent_containers", {
	apply_type: 2,
	apply_method: "swallow",
	roundstart: 0,
	self_delay: 0,
	possible_transfer_amounts: null,
	volume: 50,
	name: "pill",
	desc: "A tablet or capsule.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "pill",
	item_state: "pill",
});

// /obj/item/weapon/reagent_containers/pill/proc/<init>  (code/modules/reagents/reagent_containers/pill.dm:7)
rt.def("/obj/item/weapon/reagent_containers/pill/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_transfer_amounts", rt.list());
	return f.dot;
});

// /obj/item/weapon/reagent_containers/pill/proc/Initialize  (code/modules/reagents/reagent_containers/pill.dm:15)  may sleep
rt.def("/obj/item/weapon/reagent_containers/pill/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "icon_state"))) {
		rt.setSv(f, "icon_state", fmt("pill＀", [(yield* g.call(f, P("/proc/rand"), null, [1, 20]))]));
	}
	if (!(truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents"))) && truthy(rt.sv(f, "roundstart")))) return f.dot;
	rt.modSrcVar(f, "name", fmt(" (＀u)", [rt.fv(f, "total_volume", rt.sv(f, "reagents"))]), add);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/pill/proc/attack  (code/modules/reagents/reagent_containers/pill.dm:27)  may sleep
rt.def("/obj/item/weapon/reagent_containers/pill/proc/attack", function* attack(f: Frame, M: Value, user: Value, def_zone: Value) {
	f.vars = () => [M, user, def_zone];
	if (!truthy((yield* g.srcCall(f, "canconsume", live(M), live(user))))) {
		return 0;
	}
	if (isEqual(live(M), live(user))) {
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='notice'>＀ attempts to ＀ ＀.</span>", [live(user), rt.sv(f, "apply_method"), live(f.src)])]);
		if (truthy(rt.sv(f, "self_delay"))) {
			if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(user), live(M), rt.sv(f, "self_delay")])))) {
				return 0;
			}
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='notice'>You ＀ ＀.</span>", [rt.sv(f, "apply_method"), live(f.src)])]);
	} else {
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='danger'>＀ attempts to force ＀ to ＀ ＀.</span>", [live(user), live(M), rt.sv(f, "apply_method"), live(f.src)]), fmt("<span class='userdanger'>＀ attempts to force ＀ to ＀ ＀.</span>", [live(user), live(M), rt.sv(f, "apply_method"), live(f.src)])]);
		if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(user), live(M)])))) {
			return 0;
		}
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='danger'>＀ forces ＀ to ＀ ＀.</span>", [live(user), live(M), rt.sv(f, "apply_method"), live(f.src)]), fmt("<span class='userdanger'>＀ forces ＀ to ＀ ＀.</span>", [live(user), live(M), rt.sv(f, "apply_method"), live(f.src)])]);
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(M), "fed", (yield* g.srcCall(f, "reagentlist", live(f.src)))]);
	if (truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
		yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(M), rt.sv(f, "apply_type")]);
		yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(M), rt.fv(f, "total_volume", rt.sv(f, "reagents"))]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return 1;
}, true);

// /obj/item/weapon/reagent_containers/pill/proc/afterattack  (code/modules/reagents/reagent_containers/pill.dm:55)  may sleep
rt.def("/obj/item/weapon/reagent_containers/pill/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [target, user, proximity, O, $e];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (!(!isEqual((yield* g.callName(f, live(target), "is_open_container", [])), 0) && truthy(rt.fv(f, "reagents", live(target))))) return f.dot;
	if (!truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(target))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is empty! There's nothing to dissolve ＀ in.</span>", [live(target), live(f.src)])]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You dissolve ＀ in ＀.</span>", [live(f.src), live(target)])]);
	O = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [2, live(user)])), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		yield* g.call(f, P("/proc/to_chat"), null, [live(O), fmt("<span class='warning'>＀ slips something into ＀!</span>", [live(user), live(target)])]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(target), rt.fv(f, "total_volume", rt.sv(f, "reagents"))]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(6532, "/obj/item/weapon/reagent_containers/pill/tox", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "toxins pill",
	desc: "Highly toxic.",
	icon_state: "pill5",
});

// /obj/item/weapon/reagent_containers/pill/tox/proc/<init>  (code/modules/reagents/reagent_containers/pill.dm:70)
rt.def("/obj/item/weapon/reagent_containers/pill/tox/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["toxin", 50]));
	return f.dot;
});

rt.type(6533, "/obj/item/weapon/reagent_containers/pill/cyanide", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "cyanide pill",
	desc: "Don't swallow this.",
	icon_state: "pill5",
});

// /obj/item/weapon/reagent_containers/pill/cyanide/proc/<init>  (code/modules/reagents/reagent_containers/pill.dm:76)
rt.def("/obj/item/weapon/reagent_containers/pill/cyanide/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["cyanide", 50]));
	return f.dot;
});

rt.type(6534, "/obj/item/weapon/reagent_containers/pill/adminordrazine", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "adminordrazine pill",
	desc: "It's magic. We don't have to explain it.",
	icon_state: "pill16",
});

// /obj/item/weapon/reagent_containers/pill/adminordrazine/proc/<init>  (code/modules/reagents/reagent_containers/pill.dm:82)
rt.def("/obj/item/weapon/reagent_containers/pill/adminordrazine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["adminordrazine", 50]));
	return f.dot;
});

rt.type(6535, "/obj/item/weapon/reagent_containers/pill/morphine", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "morphine pill",
	desc: "Commonly used to treat insomnia.",
	icon_state: "pill8",
});

// /obj/item/weapon/reagent_containers/pill/morphine/proc/<init>  (code/modules/reagents/reagent_containers/pill.dm:88)
rt.def("/obj/item/weapon/reagent_containers/pill/morphine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["morphine", 30]));
	return f.dot;
});

rt.type(6536, "/obj/item/weapon/reagent_containers/pill/stimulant", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "stimulant pill",
	desc: "Often taken by overworked employees, athletes, and the inebriated. You'll snap to attention immediately!",
	icon_state: "pill19",
});

// /obj/item/weapon/reagent_containers/pill/stimulant/proc/<init>  (code/modules/reagents/reagent_containers/pill.dm:94)
rt.def("/obj/item/weapon/reagent_containers/pill/stimulant/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["ephedrine", 10, "antihol", 10, "coffee", 30]));
	return f.dot;
});

rt.type(6537, "/obj/item/weapon/reagent_containers/pill/salbutamol", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "salbutamol pill",
	desc: "Used to treat oxygen deprivation.",
	icon_state: "pill16",
});

// /obj/item/weapon/reagent_containers/pill/salbutamol/proc/<init>  (code/modules/reagents/reagent_containers/pill.dm:100)
rt.def("/obj/item/weapon/reagent_containers/pill/salbutamol/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["salbutamol", 30]));
	return f.dot;
});

rt.type(6538, "/obj/item/weapon/reagent_containers/pill/charcoal", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "charcoal pill",
	desc: "Neutralizes many common toxins.",
	icon_state: "pill17",
});

// /obj/item/weapon/reagent_containers/pill/charcoal/proc/<init>  (code/modules/reagents/reagent_containers/pill.dm:106)
rt.def("/obj/item/weapon/reagent_containers/pill/charcoal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["charcoal", 10]));
	return f.dot;
});

rt.type(6539, "/obj/item/weapon/reagent_containers/pill/epinephrine", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "epinephrine pill",
	desc: "Used to stabilize patients.",
	icon_state: "pill5",
});

// /obj/item/weapon/reagent_containers/pill/epinephrine/proc/<init>  (code/modules/reagents/reagent_containers/pill.dm:112)
rt.def("/obj/item/weapon/reagent_containers/pill/epinephrine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["epinephrine", 15]));
	return f.dot;
});

rt.type(6540, "/obj/item/weapon/reagent_containers/pill/mannitol", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "mannitol pill",
	desc: "Used to treat brain damage.",
	icon_state: "pill17",
});

// /obj/item/weapon/reagent_containers/pill/mannitol/proc/<init>  (code/modules/reagents/reagent_containers/pill.dm:118)
rt.def("/obj/item/weapon/reagent_containers/pill/mannitol/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["mannitol", 50]));
	return f.dot;
});

rt.type(6541, "/obj/item/weapon/reagent_containers/pill/mutadone", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "mutadone pill",
	desc: "Used to treat genetic damage.",
	icon_state: "pill20",
});

// /obj/item/weapon/reagent_containers/pill/mutadone/proc/<init>  (code/modules/reagents/reagent_containers/pill.dm:124)
rt.def("/obj/item/weapon/reagent_containers/pill/mutadone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["mutadone", 50]));
	return f.dot;
});

rt.type(6542, "/obj/item/weapon/reagent_containers/pill/salicyclic", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "salicylic acid pill",
	desc: "Used to dull pain.",
	icon_state: "pill9",
});

// /obj/item/weapon/reagent_containers/pill/salicyclic/proc/<init>  (code/modules/reagents/reagent_containers/pill.dm:130)
rt.def("/obj/item/weapon/reagent_containers/pill/salicyclic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["sal_acid", 24]));
	return f.dot;
});

rt.type(6543, "/obj/item/weapon/reagent_containers/pill/oxandrolone", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "oxandrolone pill",
	desc: "Used to stimulate burn healing.",
	icon_state: "pill11",
});

// /obj/item/weapon/reagent_containers/pill/oxandrolone/proc/<init>  (code/modules/reagents/reagent_containers/pill.dm:136)
rt.def("/obj/item/weapon/reagent_containers/pill/oxandrolone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["oxandrolone", 24]));
	return f.dot;
});

rt.type(6544, "/obj/item/weapon/reagent_containers/pill/insulin", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	roundstart: 1,
	name: "insulin pill",
	desc: "Handles hyperglycaemic coma.",
	icon_state: "pill18",
});

// /obj/item/weapon/reagent_containers/pill/insulin/proc/<init>  (code/modules/reagents/reagent_containers/pill.dm:143)
rt.def("/obj/item/weapon/reagent_containers/pill/insulin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["insulin", 50]));
	return f.dot;
});

rt.type(6545, "/obj/item/weapon/reagent_containers/pill/shadowtoxin", "/obj/item/weapon/reagent_containers/pill", {
	list_reagents: null,
	name: "black pill",
	desc: "I wouldn't eat this if I were you.",
	icon_state: "pill9",
	color: "#454545",
});

// /obj/item/weapon/reagent_containers/pill/shadowtoxin/proc/<init>  (code/modules/reagents/reagent_containers/pill.dm:151)
rt.def("/obj/item/weapon/reagent_containers/pill/shadowtoxin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["shadowmutationtoxin", 1]));
	return f.dot;
});
