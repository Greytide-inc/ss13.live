// From code/modules/mob/living/simple_animal/bot/construction.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7562, "/obj/item/weapon/bucket_sensor", "/obj/item/weapon", {
	created_name: "Cleanbot",
	throw_speed: 2,
	throw_range: 5,
	desc: "It's a bucket. With a sensor attached.",
	name: "proxy bucket",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "bucket_proxy",
	force: 3,
	throwforce: 5,
	w_class: 3,
});

// /obj/item/weapon/bucket_sensor/proc/attackby  (code/modules/mob/living/simple_animal/bot/construction.dm:17)  may sleep
rt.def("/obj/item/weapon/bucket_sensor/proc/attackby", function* attackby(f: Frame) {
	let _T: Value = null, A: Value = null, t: Value = null;
	f.vars = () => [_T, A, t];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/bodypart/l_arm/robot")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/bodypart/r_arm/robot")) ? 1 : 0)))) {
		if (!truthy((yield* g.callName(f, live(f.args[1]), "temporarilyRemoveItemFromInventory", [live(f.args[0])])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		_T = rt.getStep(f, rt.sv(f, "loc"), 0);
		rt.setFv(f, "name", (A = (yield* g.new_(f, T("/mob/living/simple_animal/bot/cleanbot"), [live(_T)]))), rt.sv(f, "created_name"));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add the robot arm to the bucket and sensor assembly. Beep boop!</span>"]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0))) return f.dot;
		if (!truthy((t = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[1]), "Enter new robot name", rt.sv(f, "name"), rt.sv(f, "created_name"), 42]))))) {
			return live(f.dot);
		}
		if ((!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && !isEqual(rt.sv(f, "loc"), live(f.usr)))) {
			return live(f.dot);
		}
		rt.setSv(f, "created_name", live(t));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(7563, "/obj/item/weapon/ed209_assembly", "/obj/item/weapon", {
	build_step: 0,
	created_name: "ED-209 Security Robot",
	lasercolor: "",
	name: "１ED-209 assembly",
	desc: "Some sort of bizarre assembly.",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "ed209_frame",
	item_state: "ed209_frame",
});

// /obj/item/weapon/ed209_assembly/proc/attackby  (code/modules/mob/living/simple_animal/bot/construction.dm:49)  may sleep
rt.def("/obj/item/weapon/ed209_assembly/proc/attackby", function* attackby(f: Frame) {
	let t: Value = null, newcolor: Value = null, WT: Value = null, coil: Value = null, newname: Value = null, _T: Value = null;
	let $0: any;
	f.vars = () => [t, newcolor, WT, coil, newname, _T, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0))) {
		if (!truthy((t = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[1]), "Enter new robot name", rt.sv(f, "name"), rt.sv(f, "created_name"), 42]))))) {
			return live(f.dot);
		}
		if ((!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && !isEqual(rt.sv(f, "loc"), live(f.usr)))) {
			return live(f.dot);
		}
		rt.setSv(f, "created_name", live(t));
		return live(f.dot);
	}
	$0 = rt.sv(f, "build_step");
	if ($0 === 0 || $0 === 1) {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/bodypart/l_leg/robot")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/bodypart/r_leg/robot")) ? 1 : 0)))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "temporarilyRemoveItemFromInventory", [live(f.args[0])])))) {
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
			rt.incSrcVar(f, "build_step", 1, true);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add the robot leg to ＀.</span>", [live(f.src)])]);
			rt.setSv(f, "name", "legs/frame assembly");
			if (isEqual(rt.sv(f, "build_step"), 1)) {
				rt.setSv(f, "item_state", "ed209_leg");
				rt.setSv(f, "icon_state", "ed209_leg");
			} else {
				rt.setSv(f, "item_state", "ed209_legs");
				rt.setSv(f, "icon_state", "ed209_legs");
			}
		}
	} else if ($0 === 2) {
		newcolor = "";
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/clothing/suit/redtag")) ? 1 : 0))) {
			newcolor = "r";
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/clothing/suit/bluetag")) ? 1 : 0))) {
				newcolor = "b";
			}
		}
		if ((truthy(live(newcolor)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/clothing/suit/armor/vest")) ? 1 : 0)))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "temporarilyRemoveItemFromInventory", [live(f.args[0])])))) {
				return live(f.dot);
			}
			rt.setSv(f, "lasercolor", live(newcolor));
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
			rt.incSrcVar(f, "build_step", 1, true);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add the armor to ＀.</span>", [live(f.src)])]);
			rt.setSv(f, "name", "vest/legs/frame assembly");
			rt.setSv(f, "item_state", fmt("＀ed209_shell", [rt.sv(f, "lasercolor")]));
			rt.setSv(f, "icon_state", fmt("＀ed209_shell", [rt.sv(f, "lasercolor")]));
		}
	} else if ($0 === 3) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, (WT = live(f.args[0])), "remove_fuel", [0, live(f.args[1])])))) {
				rt.incSrcVar(f, "build_step", 1, true);
				rt.setSv(f, "name", "shielded frame assembly");
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You weld the vest to ＀.</span>", [live(f.src)])]);
			}
		}
	} else if ($0 === 4) {
		$0 = rt.sv(f, "lasercolor");
		if ($0 === "b") {
			if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/clothing/head/helmet/bluetaghelm")) ? 1 : 0))) {
				return live(f.dot);
			}
		} else if ($0 === "r") {
			if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/clothing/head/helmet/redtaghelm")) ? 1 : 0))) {
				return live(f.dot);
			}
		} else if ($0 === "") {
			if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/clothing/head/helmet")) ? 1 : 0))) {
				return live(f.dot);
			}
		}
		if (!truthy((yield* g.callName(f, live(f.args[1]), "temporarilyRemoveItemFromInventory", [live(f.args[0])])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		rt.incSrcVar(f, "build_step", 1, true);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add the helmet to ＀.</span>", [live(f.src)])]);
		rt.setSv(f, "name", "covered and shielded frame assembly");
		rt.setSv(f, "item_state", fmt("＀ed209_hat", [rt.sv(f, "lasercolor")]));
		rt.setSv(f, "icon_state", fmt("＀ed209_hat", [rt.sv(f, "lasercolor")]));
	} else if ($0 === 5) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/assembly/prox_sensor")) ? 1 : 0))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "temporarilyRemoveItemFromInventory", [live(f.args[0])])))) {
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
			rt.incSrcVar(f, "build_step", 1, true);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add the prox sensor to ＀.</span>", [live(f.src)])]);
			rt.setSv(f, "name", "covered, shielded and sensored frame assembly");
			rt.setSv(f, "item_state", fmt("＀ed209_prox", [rt.sv(f, "lasercolor")]));
			rt.setSv(f, "icon_state", fmt("＀ed209_prox", [rt.sv(f, "lasercolor")]));
		}
	} else if ($0 === 6) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0))) {
			if (rt.lt((yield* g.callName(f, (coil = live(f.args[0])), "get_amount", [])), 1)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need one length of cable to wire the ED-209!</span>"]);
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start to wire ＀...</span>", [live(f.src)])]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 40, "target", live(f.src)], rt.Args.Named)))) {
				if ((rt.ge((yield* g.callName(f, live(coil), "get_amount", [])), 1) && isEqual(rt.sv(f, "build_step"), 6))) {
					yield* g.callName(f, live(coil), "use", [1]);
					rt.setSv(f, "build_step", 7);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You wire the ED-209 assembly.</span>"]);
					rt.setSv(f, "name", "wired ED-209 assembly");
				}
			}
		}
	} else if ($0 === 7) {
		newname = "";
		$0 = rt.sv(f, "lasercolor");
		if ($0 === "b") {
			if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/gun/energy/laser/bluetag")) ? 1 : 0))) {
				return live(f.dot);
			}
			newname = "bluetag ED-209 assembly";
		} else if ($0 === "r") {
			if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/gun/energy/laser/redtag")) ? 1 : 0))) {
				return live(f.dot);
			}
			newname = "redtag ED-209 assembly";
		} else if ($0 === "") {
			if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/gun/energy/e_gun/advtaser")) ? 1 : 0))) {
				return live(f.dot);
			}
			newname = "taser ED-209 assembly";
		} else {
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(f.args[1]), "temporarilyRemoveItemFromInventory", [live(f.args[0])])))) {
			return live(f.dot);
		}
		rt.setSv(f, "name", live(newname));
		rt.incSrcVar(f, "build_step", 1, true);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add ＀ to ＀.</span>", [live(f.args[0]), live(f.src)])]);
		rt.setSv(f, "item_state", fmt("＀ed209_taser", [rt.sv(f, "lasercolor")]));
		rt.setSv(f, "icon_state", fmt("＀ed209_taser", [rt.sv(f, "lasercolor")]));
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
	} else if ($0 === 8) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start attaching the gun to the frame...</span>"]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [live(f.args[1]), multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), 0, live(f.src), 1])))) {
				rt.incSrcVar(f, "build_step", 1, true);
				rt.setSv(f, "name", fmt("armed ＀", [rt.sv(f, "name")]));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Taser gun attached.</span>"]);
			}
		}
	} else if ($0 === 9) {
		if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/stock_parts/cell")) ? 1 : 0))) return f.dot;
		if (!truthy((yield* g.callName(f, live(f.args[1]), "temporarilyRemoveItemFromInventory", [live(f.args[0])])))) {
			return live(f.dot);
		}
		rt.incSrcVar(f, "build_step", 1, true);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You complete the ED-209.</span>"]);
		yield* g.new_(f, T("/mob/living/simple_animal/bot/ed209"), [(_T = rt.getStep(f, live(f.src), 0)), rt.sv(f, "created_name"), rt.sv(f, "lasercolor")]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/storage/toolbox/mechanical/proc/attackby  (code/modules/mob/living/simple_animal/bot/construction.dm:220)  may sleep
rt.def("/obj/item/weapon/storage/toolbox/mechanical/proc/attackby", function* attackby(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/tile/plasteel")) ? 1 : 0))) {
		yield* g.callSuper(f, [], rt.Args.Same);
		return live(f.dot);
	}
	if (rt.ge(rt.len(f, rt.sv(f, "contents")), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>They won't fit in, as there is already stuff inside!</span>"]);
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(f.args[0]), "use", [10])))) {
		if (truthy(rt.fv(f, "s_active", live(f.args[1])))) {
			yield* g.callName(f, rt.fv(f, "s_active", live(f.args[1])), "close", [live(f.args[1])]);
		}
		B = (yield* g.new_(f, T("/obj/item/weapon/toolbox_tiles"), []));
		yield* g.callName(f, live(f.args[1]), "put_in_hands", [live(B)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add the tiles into the empty toolbox. They protrude from the top.</span>"]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need 10 floor tiles to start building a floorbot!</span>"]);
		return live(f.dot);
	}
	return f.dot;
}, true, { args: ["T", "user", "params"] });

rt.type(7564, "/obj/item/weapon/toolbox_tiles", "/obj/item/weapon", {
	created_name: "Floorbot",
	throw_speed: 2,
	throw_range: 5,
	desc: "It's a toolbox with tiles sticking out the top",
	name: "tiles and toolbox",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "toolbox_tiles",
	force: 3,
	throwforce: 10,
	w_class: 3,
});

// /obj/item/weapon/toolbox_tiles/proc/attackby  (code/modules/mob/living/simple_animal/bot/construction.dm:238)  may sleep
rt.def("/obj/item/weapon/toolbox_tiles/proc/attackby", function* attackby(f: Frame) {
	let B: Value = null, t: Value = null;
	f.vars = () => [B, t];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/assembly/prox_sensor")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		rt.setFv(f, "created_name", (B = (yield* g.new_(f, T("/obj/item/weapon/toolbox_tiles_sensor"), []))), rt.sv(f, "created_name"));
		yield* g.callName(f, live(f.args[1]), "put_in_hands", [live(B)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add the sensor to the toolbox and tiles.</span>"]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0))) return f.dot;
		if (!truthy((t = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[1]), "Enter new robot name", rt.sv(f, "name"), rt.sv(f, "created_name"), 42]))))) {
			return live(f.dot);
		}
		if ((!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && !isEqual(rt.sv(f, "loc"), live(f.usr)))) {
			return live(f.dot);
		}
		rt.setSv(f, "created_name", live(t));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(7565, "/obj/item/weapon/toolbox_tiles_sensor", "/obj/item/weapon", {
	created_name: "Floorbot",
	throw_speed: 2,
	throw_range: 5,
	desc: "It's a toolbox with tiles sticking out the top and a sensor attached",
	name: "tiles, toolbox and sensor arrangement",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "toolbox_tiles_sensor",
	force: 3,
	throwforce: 10,
	w_class: 3,
});

// /obj/item/weapon/toolbox_tiles_sensor/proc/attackby  (code/modules/mob/living/simple_animal/bot/construction.dm:257)  may sleep
rt.def("/obj/item/weapon/toolbox_tiles_sensor/proc/attackby", function* attackby(f: Frame) {
	let _T: Value = null, A: Value = null, t: Value = null;
	f.vars = () => [_T, A, t];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/bodypart/l_arm/robot")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/bodypart/r_arm/robot")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		_T = rt.getStep(f, rt.fv(f, "loc", live(f.args[1])), 0);
		rt.setFv(f, "name", (A = (yield* g.new_(f, T("/mob/living/simple_animal/bot/floorbot"), [live(_T)]))), rt.sv(f, "created_name"));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add the robot arm to the odd looking toolbox assembly. Boop beep!</span>"]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0))) return f.dot;
		if (!truthy((t = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[1]), "Enter new robot name", rt.sv(f, "name"), rt.sv(f, "created_name"), 42]))))) {
			return live(f.dot);
		}
		if ((!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && !isEqual(rt.sv(f, "loc"), live(f.usr)))) {
			return live(f.dot);
		}
		rt.setSv(f, "created_name", live(t));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(7566, "/obj/item/weapon/firstaid_arm_assembly", "/obj/item/weapon", {
	build_step: 0,
	created_name: "Medibot",
	skin: null,
	name: "incomplete medibot assembly",
	desc: "A first aid kit with a robot arm permanently grafted to it.",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "firstaid_arm",
	w_class: 3,
});

// /obj/item/weapon/firstaid_arm_assembly/proc/New  (code/modules/mob/living/simple_animal/bot/construction.dm:286)  may sleep
rt.def("/obj/item/weapon/firstaid_arm_assembly/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.spawnTail(f, 5, "/obj/item/weapon/firstaid_arm_assembly/proc/New: spawn at modules/mob/living/simple_animal/bot/construction.dm:287");
	return f.dot;
}, true);

// a spawn(5) body of /obj/item/weapon/firstaid_arm_assembly/proc/New, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/firstaid_arm_assembly/proc/New: spawn at modules/mob/living/simple_animal/bot/construction.dm:287", function* (f: Frame) {
	if (truthy(rt.sv(f, "skin"))) {
		yield* g.srcCall(f, "add_overlay", fmt("kit_skin_＀", [rt.sv(f, "skin")]));
	}
	return null;
});

rt.type(5568, "/obj/item/weapon/storage/firstaid", "/obj/item/weapon/storage", {
	empty: 0,
	throw_speed: 3,
	throw_range: 7,
	name: "first-aid kit",
	desc: "It's an emergency medical kit for those serious boo-boos.",
	icon_state: "firstaid",
});

// /obj/item/weapon/storage/firstaid/proc/attackby  (code/modules/mob/living/simple_animal/bot/construction.dm:293)  may sleep
rt.def("/obj/item/weapon/storage/firstaid/proc/attackby", function* attackby(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if ((!truthy((rt.istype(live(f.args[0]), T("/obj/item/bodypart/l_arm/robot")) ? 1 : 0)) && !truthy((rt.istype(live(f.args[0]), T("/obj/item/bodypart/r_arm/robot")) ? 1 : 0)))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (rt.ge(rt.len(f, rt.sv(f, "contents")), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You need to empty ＀ out first!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	A = (yield* g.new_(f, T("/obj/item/weapon/firstaid_arm_assembly"), []));
	if (truthy((rt.istype(live(f.src), T("/obj/item/weapon/storage/firstaid/fire")) ? 1 : 0))) {
		rt.setFv(f, "skin", live(A), "ointment");
	} else {
		if (truthy((rt.istype(live(f.src), T("/obj/item/weapon/storage/firstaid/toxin")) ? 1 : 0))) {
			rt.setFv(f, "skin", live(A), "tox");
		} else {
			if (truthy((rt.istype(live(f.src), T("/obj/item/weapon/storage/firstaid/o2")) ? 1 : 0))) {
				rt.setFv(f, "skin", live(A), "o2");
			} else {
				if (truthy((rt.istype(live(f.src), T("/obj/item/weapon/storage/firstaid/brute")) ? 1 : 0))) {
					rt.setFv(f, "skin", live(A), "brute");
				}
			}
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
	yield* g.callName(f, live(f.args[1]), "put_in_hands", [live(A)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add the robot arm to the first aid kit.</span>"]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["S", "user", "params"] });

// /obj/item/weapon/firstaid_arm_assembly/proc/attackby  (code/modules/mob/living/simple_animal/bot/construction.dm:318)  may sleep
rt.def("/obj/item/weapon/firstaid_arm_assembly/proc/attackby", function* attackby(f: Frame) {
	let t: Value = null, _T: Value = null, S: Value = null;
	let $0: any;
	f.vars = () => [t, _T, S, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0))) {
		if (!truthy((t = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[1]), "Enter new robot name", rt.sv(f, "name"), rt.sv(f, "created_name"), 42]))))) {
			return live(f.dot);
		}
		if ((!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && !isEqual(rt.sv(f, "loc"), live(f.usr)))) {
			return live(f.dot);
		}
		rt.setSv(f, "created_name", live(t));
	} else {
		$0 = rt.sv(f, "build_step");
		if ($0 === 0) {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/healthanalyzer")) ? 1 : 0))) {
				if (!truthy((yield* g.callName(f, live(f.args[1]), "temporarilyRemoveItemFromInventory", [live(f.args[0])])))) {
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
				rt.incSrcVar(f, "build_step", 1, true);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add the health sensor to ＀.</span>", [live(f.src)])]);
				rt.setSv(f, "name", "First aid/robot arm/health analyzer assembly");
				yield* g.srcCall(f, "add_overlay", "na_scanner");
			}
		} else if ($0 === 1) {
			if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/device/assembly/prox_sensor")) ? 1 : 0))) return f.dot;
			if (!truthy((yield* g.callName(f, live(f.args[1]), "temporarilyRemoveItemFromInventory", [live(f.args[0])])))) {
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
			rt.incSrcVar(f, "build_step", 1, true);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You complete the Medibot. Beep boop!</span>"]);
			_T = rt.getStep(f, live(f.src), 0);
			rt.setFv(f, "skin", (S = (yield* g.new_(f, T("/mob/living/simple_animal/bot/medbot"), [live(_T)]))), rt.sv(f, "skin"));
			rt.setFv(f, "name", live(S), rt.sv(f, "created_name"));
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/clothing/head/helmet/proc/attackby  (code/modules/mob/living/simple_animal/bot/construction.dm:362)  may sleep
rt.def("/obj/item/clothing/head/helmet/proc/attackby", function* attackby(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/device/assembly/signaler")) ? 1 : 0))) {
		yield* g.callSuper(f, [], rt.Args.Same);
		return live(f.dot);
	}
	if (!isEqual(rt.sv(f, "type"), T("/obj/item/clothing/head/helmet/sec"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "F"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The mounted flashlight is in the way, remove it first!</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "secured", live(f.args[0])))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		A = (yield* g.new_(f, T("/obj/item/weapon/secbot_assembly"), []));
		yield* g.callName(f, live(f.args[1]), "put_in_hands", [live(A)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add the signaler to the helmet.</span>"]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		return live(f.dot);
	}
	return f.dot;
}, true, { args: ["S", "user", "params"] });

rt.type(7567, "/obj/item/weapon/secbot_assembly", "/obj/item/weapon", {
	build_step: 0,
	created_name: "Securitron",
	name: "incomplete securitron assembly",
	desc: "Some sort of bizarre assembly made from a proximity sensor, helmet, and signaler.",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "helmet_signaler",
	item_state: "helmet",
});

// /obj/item/weapon/secbot_assembly/proc/attackby  (code/modules/mob/living/simple_animal/bot/construction.dm:384)  may sleep
rt.def("/obj/item/weapon/secbot_assembly/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null, S: Value = null, t: Value = null;
	f.vars = () => [WT, S, t];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "build_step"))) {
			if (truthy((yield* g.callName(f, (WT = live(f.args[0])), "remove_fuel", [0, live(f.args[1])])))) {
				rt.incSrcVar(f, "build_step", 1, true);
				yield* g.srcCall(f, "add_overlay", "hs_hole");
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You weld a hole in ＀!</span>", [live(f.src)])]);
			}
		} else {
			if (isEqual(rt.sv(f, "build_step"), 1)) {
				if (truthy((yield* g.callName(f, (WT = live(f.args[0])), "remove_fuel", [0, live(f.args[1])])))) {
					rt.incSrcVar(f, "build_step", -1, true);
					yield* g.srcCall(f, "cut_overlay", "hs_hole");
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You weld the hole in ＀ shut!</span>", [live(f.src)])]);
				}
			}
		}
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/device/assembly/prox_sensor")) ? 1 : 0)) && isEqual(rt.sv(f, "build_step"), 1))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "temporarilyRemoveItemFromInventory", [live(f.args[0])])))) {
				return live(f.dot);
			}
			rt.incSrcVar(f, "build_step", 1, true);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add the prox sensor to ＀!</span>", [live(f.src)])]);
			yield* g.srcCall(f, "add_overlay", "hs_eye");
			rt.setSv(f, "name", "helmet/signaler/prox sensor assembly");
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		} else {
			if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/bodypart/l_arm/robot")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/bodypart/r_arm/robot")) ? 1 : 0))) && isEqual(rt.sv(f, "build_step"), 2))) {
				if (!truthy((yield* g.callName(f, live(f.args[1]), "temporarilyRemoveItemFromInventory", [live(f.args[0])])))) {
					return live(f.dot);
				}
				rt.incSrcVar(f, "build_step", 1, true);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add the robot arm to ＀!</span>", [live(f.src)])]);
				rt.setSv(f, "name", "helmet/signaler/prox sensor/robot arm assembly");
				yield* g.srcCall(f, "add_overlay", "hs_arm");
				yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
			} else {
				if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/melee/baton")) ? 1 : 0)) && rt.ge(rt.sv(f, "build_step"), 3))) {
					if (!truthy((yield* g.callName(f, live(f.args[1]), "temporarilyRemoveItemFromInventory", [live(f.args[0])])))) {
						return live(f.dot);
					}
					rt.incSrcVar(f, "build_step", 1, true);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You complete the Securitron! Beep boop.</span>"]);
					rt.setFv(f, "name", (S = (yield* g.new_(f, T("/mob/living/simple_animal/bot/secbot"), [rt.getStep(f, live(f.src), 0)]))), rt.sv(f, "created_name"));
					rt.setFv(f, "baton_type", live(S), rt.fv(f, "type", live(f.args[0])));
					yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
					yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
				} else {
					if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0))) {
						if (!truthy((t = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[1]), "Enter new robot name", rt.sv(f, "name"), rt.sv(f, "created_name"), 42]))))) {
							return live(f.dot);
						}
						if ((!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && !isEqual(rt.sv(f, "loc"), live(f.usr)))) {
							return live(f.dot);
						}
						rt.setSv(f, "created_name", live(t));
					} else {
						if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) return f.dot;
						if (!truthy(rt.sv(f, "build_step"))) {
							yield* g.new_(f, T("/obj/item/device/assembly/signaler"), [rt.getStep(f, live(f.src), 0)]);
							yield* g.new_(f, T("/obj/item/clothing/head/helmet/sec"), [rt.getStep(f, live(f.src), 0)]);
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You disconnect the signaler from the helmet.</span>"]);
							yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
						} else {
							if (isEqual(rt.sv(f, "build_step"), 2)) {
								yield* g.srcCall(f, "cut_overlay", "hs_eye");
								yield* g.new_(f, T("/obj/item/device/assembly/prox_sensor"), [rt.getStep(f, live(f.src), 0)]);
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You detach the proximity sensor from ＀.</span>", [live(f.src)])]);
								rt.incSrcVar(f, "build_step", -1, true);
							} else {
								if (!isEqual(rt.sv(f, "build_step"), 3)) return f.dot;
								yield* g.srcCall(f, "cut_overlay", "hs_arm");
								yield* g.new_(f, T("/obj/item/bodypart/l_arm/robot"), [rt.getStep(f, live(f.src), 0)]);
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You remove the robot arm from ＀.</span>", [live(f.src)])]);
								rt.incSrcVar(f, "build_step", -1, true);
							}
						}
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });
