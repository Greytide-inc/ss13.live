// From code/game/objects/items/weapons/implants/implant_explosive.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7404, "/obj/item/weapon/implant/explosive", "/obj/item/weapon/implant", {
	weak: 2,
	medium: 0.8,
	heavy: 0.4,
	delay: 7,
	popup: 0,
	active: 0,
	name: "microbomb implant",
	desc: "And boom goes the weasel.",
	icon_state: "explosive",
	origin_tech: "materials=2;combat=3;biotech=4;syndicate=4",
	actions_types: null,
});

// /obj/item/weapon/implant/explosive/proc/<init>  (code/game/objects/items/weapons/implants/implant_explosive.dm:6)
rt.def("/obj/item/weapon/implant/explosive/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/explosive_implant")));
	return f.dot;
});

// /obj/item/weapon/implant/explosive/proc/get_data  (code/game/objects/items/weapons/implants/implant_explosive.dm:16)
rt.def("/obj/item/weapon/implant/explosive/proc/get_data", function get_data(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	return (dat = "<b>Implant Specifications:</b><BR>\n\t\t\t\t<b>Name:</b> Robust Corp RX-78 Employee Management Implant<BR>\n\t\t\t\t<b>Life:</b> Activates upon death.<BR>\n\t\t\t\t<b>Important Notes:</b> Explodes<BR>\n\t\t\t\t<HR>\n\t\t\t\t<b>Implant Details:</b><BR>\n\t\t\t\t<b>Function:</b> Contains a compact, electrically detonated explosive that detonates upon receiving a specially encoded signal or upon host death.<BR>\n\t\t\t\t<b>Special Features:</b> Explodes<BR>\n\t\t\t\t");
});

// /obj/item/weapon/implant/explosive/proc/trigger  (code/game/objects/items/weapons/implants/implant_explosive.dm:28)  may sleep
rt.def("/obj/item/weapon/implant/explosive/proc/trigger", function* trigger(f: Frame, emote: Value, source: Value) {
	f.vars = () => [emote, source];
	if (!isEqual(live(emote), "deathgasp")) return f.dot;
	yield* g.srcCall(f, "activate", "death");
	return f.dot;
}, true);

// /obj/item/weapon/implant/explosive/proc/activate  (code/game/objects/items/weapons/implants/implant_explosive.dm:32)  may sleep
rt.def("/obj/item/weapon/implant/explosive/proc/activate", function* activate(f: Frame, cause: Value) {
	let response: Value = null, boomturf: Value = null, A: Value = null;
	f.vars = () => [cause, response, boomturf, A];
	if (((!truthy(live(cause)) || !truthy(rt.sv(f, "imp_in"))) || truthy(rt.sv(f, "active")))) {
		return 0;
	}
	if ((isEqual(live(cause), "action_button") && !truthy(rt.sv(f, "popup")))) {
		rt.setSv(f, "popup", 1);
		response = (yield* g.call(f, P("/proc/alert"), null, [rt.sv(f, "imp_in"), fmt("Are you sure you want to activate your ＀? This will cause you to explode!", [rt.sv(f, "name")]), fmt("＀ Confirmation", [rt.sv(f, "name")]), "Yes", "No"]));
		rt.setSv(f, "popup", 0);
		if (isEqual(live(response), "No")) {
			return 0;
		}
	}
	rt.setSv(f, "heavy", (yield* g.call(f, P("/proc/round"), null, [rt.sv(f, "heavy")])));
	rt.setSv(f, "medium", (yield* g.call(f, P("/proc/round"), null, [rt.sv(f, "medium")])));
	rt.setSv(f, "weak", (yield* g.call(f, P("/proc/round"), null, [rt.sv(f, "weak")])));
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "imp_in"), fmt("<span class='notice'>You activate your ＀.</span>", [rt.sv(f, "name")])]);
	rt.setSv(f, "active", 1);
	boomturf = rt.getStep(f, rt.sv(f, "imp_in"), 0);
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(boomturf)]));
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has activated their ＀ at ＀ ＀.", [fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [rt.sv(f, "imp_in")])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [rt.sv(f, "imp_in")]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [rt.sv(f, "imp_in")])]), rt.sv(f, "name"), rt.fv(f, "name", live(A)), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(boomturf)), rt.fv(f, "y", live(boomturf)), rt.fv(f, "z", live(boomturf))])])]);
	if (rt.le(rt.sv(f, "delay"), 7)) {
		yield* g.call(f, P("/proc/explosion"), null, [null, live(f.src), null, rt.sv(f, "heavy"), null, rt.sv(f, "medium"), null, rt.sv(f, "weak"), null, rt.sv(f, "weak"), "flame_range", rt.sv(f, "weak")], rt.Args.Named);
		if (truthy(rt.sv(f, "imp_in"))) {
			yield* g.callName(f, rt.sv(f, "imp_in"), "gib", [1]);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "timed_explosion");
	return f.dot;
}, true);

// /obj/item/weapon/implant/explosive/proc/implant  (code/game/objects/items/weapons/implants/implant_explosive.dm:58)  may sleep
rt.def("/obj/item/weapon/implant/explosive/proc/implant", function* implant(f: Frame) {
	let X: Value = null, imp_e: Value = null;
	let $e: any;
	f.vars = () => [X, imp_e, $e];
	X = null;
	rt.forList(f, 0, rt.fv(f, "implants", live(f.args[0])));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (truthy(rt.op(f, "IsType", [], [live(X), rt.sv(f, "type")]))) {
			rt.modField(f, (imp_e = live(X)), "heavy", rt.sv(f, "heavy"), add);
			rt.modField(f, live(imp_e), "medium", rt.sv(f, "medium"), add);
			rt.modField(f, live(imp_e), "weak", rt.sv(f, "weak"), add);
			rt.modField(f, live(imp_e), "delay", rt.sv(f, "delay"), add);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return 1;
		}
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["target"] });

// /obj/item/weapon/implant/explosive/proc/timed_explosion  (code/game/objects/items/weapons/implants/implant_explosive.dm:71)  may sleep
rt.def("/obj/item/weapon/implant/explosive/proc/timed_explosion", function* timed_explosion(f: Frame) {
	yield* g.callName(f, rt.sv(f, "imp_in"), "visible_message", [fmt("<span class='warning'>＀ starts beeping ominously!</span>", [rt.sv(f, "imp_in")])]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/timer.ogg"), 30, 0]);
	yield* g.call(f, P("/proc/sleep"), null, [multiply(rt.sv(f, "delay"), 0.25)]);
	if ((truthy(rt.sv(f, "imp_in")) && !truthy(rt.fv(f, "stat", rt.sv(f, "imp_in"))))) {
		yield* g.callName(f, rt.sv(f, "imp_in"), "visible_message", [fmt("<span class='warning'>＀ doubles over in pain!</span>", [rt.sv(f, "imp_in")])]);
		yield* g.callName(f, rt.sv(f, "imp_in"), "Knockdown", [140]);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/timer.ogg"), 30, 0]);
	yield* g.call(f, P("/proc/sleep"), null, [multiply(rt.sv(f, "delay"), 0.25)]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/timer.ogg"), 30, 0]);
	yield* g.call(f, P("/proc/sleep"), null, [multiply(rt.sv(f, "delay"), 0.25)]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/timer.ogg"), 30, 0]);
	yield* g.call(f, P("/proc/sleep"), null, [multiply(rt.sv(f, "delay"), 0.25)]);
	yield* g.call(f, P("/proc/explosion"), null, [null, live(f.src), null, rt.sv(f, "heavy"), null, rt.sv(f, "medium"), null, rt.sv(f, "weak"), null, rt.sv(f, "weak"), "flame_range", rt.sv(f, "weak")], rt.Args.Named);
	if (truthy(rt.sv(f, "imp_in"))) {
		yield* g.callName(f, rt.sv(f, "imp_in"), "gib", [1]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(7405, "/obj/item/weapon/implant/explosive/macro", "/obj/item/weapon/implant/explosive", {
	weak: 16,
	medium: 8,
	heavy: 4,
	delay: 70,
	name: "macrobomb implant",
	desc: "And boom goes the weasel. And everything else nearby.",
	icon_state: "explosive",
	origin_tech: "materials=3;combat=5;biotech=4;syndicate=5",
});

// /obj/item/weapon/implant/explosive/macro/proc/implant  (code/game/objects/items/weapons/implants/implant_explosive.dm:99)  may sleep
rt.def("/obj/item/weapon/implant/explosive/macro/proc/implant", function* implant(f: Frame) {
	let X: Value = null, Y: Value = null, imp_e: Value = null;
	let $e: any;
	f.vars = () => [X, Y, imp_e, $e];
	X = null;
	rt.forList(f, 0, rt.fv(f, "implants", live(f.args[0])));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (truthy(rt.op(f, "IsType", [], [live(X), rt.sv(f, "type")]))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	Y = null;
	rt.forList(f, 0, rt.fv(f, "implants", live(f.args[0])));
	while (($e = rt.next(f, 0)) !== undefined) {
		Y = $e;
		if (truthy((rt.istype(live(Y), T("/obj/item/weapon/implant/explosive")) ? 1 : 0))) {
			rt.modSrcVar(f, "heavy", rt.gv(f, "heavy", (imp_e = live(Y))), add);
			rt.modSrcVar(f, "medium", rt.fv(f, "medium", live(imp_e)), add);
			rt.modSrcVar(f, "weak", rt.fv(f, "weak", live(imp_e)), add);
			rt.modSrcVar(f, "delay", rt.fv(f, "delay", live(imp_e)), add);
			yield* g.call(f, P("/proc/qdel"), null, [live(imp_e)]);
			break;
		}
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["target"] });
