// From code/game/objects/items/devices/powersink.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9277, "/obj/item/device/powersink", "/obj/item/device", {
	drain_rate: 1600000,
	power_drained: 0,
	max_power: 10000000000,
	mode: 0,
	admins_warned: 0,
	DISCONNECTED: 0,
	CLAMPED_OFF: 1,
	OPERATING: 2,
	attached: null,
	flags: 64,
	throw_speed: 1,
	throw_range: 2,
	desc: "A nulling power sink which drains energy from electrical systems.",
	name: "power sink",
	icon_state: "powersink0",
	item_state: "electronic",
	w_class: 4,
	throwforce: 5,
	materials: null,
	origin_tech: "powerstorage=5;syndicate=5",
}, { const: ["DISCONNECTED","CLAMPED_OFF","OPERATING"] });

// /obj/item/device/powersink/proc/<init>  (code/game/objects/items/devices/powersink.dm:13)
rt.def("/obj/item/device/powersink/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 750]));
	return f.dot;
});

// /obj/item/device/powersink/proc/update_icon  (code/game/objects/items/devices/powersink.dm:28)
rt.def("/obj/item/device/powersink/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("powersink＀", [(isEqual(rt.sv(f, "mode"), 2) ? 1 : 0)]));
	return f.dot;
});

// /obj/item/device/powersink/proc/set_mode  (code/game/objects/items/devices/powersink.dm:31)
rt.def("/obj/item/device/powersink/proc/set_mode", function set_mode(f: Frame, value: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (isEqual(live(value), rt.sv(f, "mode"))) {
		return live(f.dot);
	}
	$0 = live(value);
	if ($0 === 0) {
		rt.setSv(f, "attached", null);
		if (isEqual(rt.sv(f, "mode"), 2)) {
			rt.setFv(f, "isprocessing", live(f.src), 0);
			(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		}
		rt.setSv(f, "anchored", 0);
	} else if ($0 === 1) {
		if (!truthy(rt.sv(f, "attached"))) {
			return live(f.dot);
		}
		if (isEqual(rt.sv(f, "mode"), 2)) {
			rt.setFv(f, "isprocessing", live(f.src), 0);
			(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		}
		rt.setSv(f, "anchored", 1);
	} else if ($0 === 2) {
		if (!truthy(rt.sv(f, "attached"))) {
			return live(f.dot);
		}
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
		}
		rt.setSv(f, "anchored", 1);
	}
	rt.setSv(f, "mode", live(value));
	rt.callSrc(f, "update_icon", []);
	rt.callSrc(f, "set_light", [0]);
	return f.dot;
});

// /obj/item/device/powersink/proc/attackby  (code/game/objects/items/devices/powersink.dm:58)  may sleep
rt.def("/obj/item/device/powersink/proc/attackby", function* attackby(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (isEqual(rt.sv(f, "mode"), 0)) {
			if ((truthy((yield* g.call(f, P("/proc/isturf"), null, [(_T = rt.sv(f, "loc"))]))) && !truthy(rt.fv(f, "intact", live(_T))))) {
				rt.setSv(f, "attached", rt.locateIn(f, T("/obj/structure/cable"), live(_T)));
				if (!truthy(rt.sv(f, "attached"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>This device must be placed over an exposed, powered cable node!</span>"]);
				} else {
					yield* g.srcCall(f, "set_mode", 1);
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ attaches ％！ to the cable.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You attach ％！ to the cable.</span>", [live(f.src)]), "<span class='italics'>You hear some wires being connected to something.</span>"]);
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>This device must be placed over an exposed, powered cable node!</span>"]);
			}
		} else {
			yield* g.srcCall(f, "set_mode", 0);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ detaches ％！ from the cable.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You detach ％！ from the cable.</span>", [live(f.src)]), "<span class='italics'>You hear some wires being disconnected from something.</span>"]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/device/powersink/proc/attack_hand  (code/game/objects/items/devices/powersink.dm:89)  may sleep
rt.def("/obj/item/device/powersink/proc/attack_hand", function* attack_hand(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	$0 = rt.sv(f, "mode");
	if ($0 === 0) {
		yield* g.callSuper(f, [], rt.Args.Same);
	} else if ($0 === 1) {
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("＀ activates ％！!", [live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You activate ％！.</span>", [live(f.src)]), "<span class='italics'>You hear a click.</span>"]);
		$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[0])])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.args[0])]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.args[0])])]);
		if (truthy(live(f.src))) {
			$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])]);
		} else {
			$1 = "nonexistent location";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("Power sink activated by ＀ at ＀", [$0, fmt("＀", [$1])])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("Power sink activated by ＀ at ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.args[0])])), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])])]);
		yield* g.srcCall(f, "set_mode", 2);
	} else if ($0 === 2) {
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("＀ deactivates ％！!", [live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You deactivate ％！.</span>", [live(f.src)]), "<span class='italics'>You hear a click.</span>"]);
		yield* g.srcCall(f, "set_mode", 1);
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/device/powersink/proc/process  (code/game/objects/items/devices/powersink.dm:110)  may sleep
rt.def("/obj/item/device/powersink/proc/process", function* process(f: Frame) {
	let PN: Value = null, drained: Value = null, _T: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [PN, drained, _T, A, $e];
	if (!truthy(rt.sv(f, "attached"))) {
		yield* g.srcCall(f, "set_mode", 0);
		return live(f.dot);
	}
	if (truthy((PN = rt.fv(f, "powernet", rt.sv(f, "attached"))))) {
		yield* g.srcCall(f, "set_light", 5);
		drained = (yield* g.call(f, P("/proc/min"), null, [rt.sv(f, "drain_rate"), rt.fv(f, "avail", live(PN))]));
		rt.modField(f, live(PN), "load", live(drained), add);
		rt.modSrcVar(f, "power_drained", live(drained), add);
		if (rt.lt(live(drained), rt.sv(f, "drain_rate"))) {
			_T = null;
			rt.forList(f, 0, rt.fv(f, "nodes", live(PN)), T("/obj/machinery/power/terminal"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_T = $e;
				if (truthy((rt.istype(rt.fv(f, "master", live(_T)), T("/obj/machinery/power/apc")) ? 1 : 0))) {
					if ((truthy(rt.gv(f, "operating", (A = rt.fv(f, "master", live(_T))))) && truthy(rt.fv(f, "cell", live(A))))) {
						rt.setFv(f, "charge", rt.fv(f, "cell", live(A)), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.gv(f, "charge", rt.fv(f, "cell", live(A))), 50)])));
						rt.modSrcVar(f, "power_drained", 50, add);
						if (isEqual(rt.fv(f, "charging", live(A)), 2)) {
							rt.setFv(f, "charging", live(A), 1);
						}
					}
				}
			}
			rt.endFor(f, 0);
		}
	}
	if (rt.gt(rt.sv(f, "power_drained"), multiply(rt.sv(f, "max_power"), 0.9800000190734863))) {
		if (!truthy(rt.sv(f, "admins_warned"))) {
			rt.setSv(f, "admins_warned", 1);
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("Power sink at (＀,＀,＀ - <A HREF='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>) is 95% full. Explosion imminent.", [rt.sv(f, "x"), rt.sv(f, "y"), rt.sv(f, "z"), rt.sv(f, "x"), rt.sv(f, "y"), rt.sv(f, "z")])]);
		}
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/screech.ogg"), 100, 1, 1]);
	}
	if (!rt.ge(rt.sv(f, "power_drained"), rt.sv(f, "max_power"))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	yield* g.call(f, P("/proc/explosion"), null, [rt.fv(f, "loc", live(f.src)), 4, 8, 16, 32]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { waitfor: false });
