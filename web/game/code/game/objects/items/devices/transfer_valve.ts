// From code/game/objects/items/devices/transfer_valve.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9296, "/obj/item/device/transfer_valve", "/obj/item/device", {
	tank_one: null,
	tank_two: null,
	attached_device: null,
	attacher: null,
	valve_open: 0,
	toggle: 1,
	icon: rt.rsc("icons/obj/assemblies.dmi"),
	name: "tank transfer valve",
	icon_state: "valve_1",
	item_state: "ttv",
	desc: "Regulates the transfer of air between two tanks",
	origin_tech: "materials=1;engineering=1",
});

// /obj/item/device/transfer_valve/proc/attackby  (code/game/objects/items/devices/transfer_valve.dm:19)  may sleep
rt.def("/obj/item/device/transfer_valve/proc/attackby", function* attackby(f: Frame, item: Value, user: Value, params: Value) {
	let A: Value = null;
	f.vars = () => [item, user, params, A];
	if (truthy((rt.istype(live(item), T("/obj/item/weapon/tank")) ? 1 : 0))) {
		if ((truthy(rt.sv(f, "tank_one")) && truthy(rt.sv(f, "tank_two")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There are already two tanks attached, remove one first!</span>"]);
			return live(f.dot);
		}
		if (!truthy(rt.sv(f, "tank_one"))) {
			if (!truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(item), live(f.src)])))) {
				return live(f.dot);
			}
			rt.setSv(f, "tank_one", live(item));
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You attach the tank to the transfer valve.</span>"]);
			if (rt.gt(rt.fv(f, "w_class", live(item)), rt.sv(f, "w_class"))) {
				rt.setSv(f, "w_class", rt.fv(f, "w_class", live(item)));
			}
		} else {
			if (!truthy(rt.sv(f, "tank_two"))) {
				if (!truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(item), live(f.src)])))) {
					return live(f.dot);
				}
				rt.setSv(f, "tank_two", live(item));
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You attach the tank to the transfer valve.</span>"]);
				if (rt.gt(rt.fv(f, "w_class", live(item)), rt.sv(f, "w_class"))) {
					rt.setSv(f, "w_class", rt.fv(f, "w_class", live(item)));
				}
			}
		}
		yield* g.srcCall(f, "update_icon");
	} else {
		if (truthy((rt.istype(live(item), T("/obj/item/device/assembly")) ? 1 : 0))) {
			if (truthy(rt.gv(f, "secured", (A = live(item))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The device is secured.</span>"]);
				return live(f.dot);
			}
			if (truthy(rt.sv(f, "attached_device"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There is already a device attached to the valve, remove it first!</span>"]);
				return live(f.dot);
			}
			if (!truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(item), live(f.src)])))) {
				return live(f.dot);
			}
			rt.setSv(f, "attached_device", live(A));
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You attach the ＀ to the valve controls and secure it.</span>", [live(item)])]);
			rt.setFv(f, "holder", live(A), live(f.src));
			yield* g.callName(f, live(A), "toggle_secure", []);
			rt.modGl("bombers", fmt("＀ attached a ＀ to a transfer valve.", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), live(item)]), add);
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ attached a ＀ to a transfer valve.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), live(item)])]);
			yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ attached a ＀ to a transfer valve.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), live(item)])]);
			rt.setSv(f, "attacher", live(user));
		}
	}
	return live(f.dot);
}, true);

// /obj/item/device/transfer_valve/proc/attack_self  (code/game/objects/items/devices/transfer_valve.dm:63)  may sleep
rt.def("/obj/item/device/transfer_valve/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let dat: Value = null, popup: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any;
	f.vars = () => [user, dat, popup, $0, $1, $2, $3, $4, $5, $6];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	$0 = rt.sv(f, "tank_one");
	if (truthy(rt.sv(f, "tank_one"))) {
		$1 = fmt("<A href='?src=＃;tankone=1'>Remove</A>", [live(f.src)]);
	} else {
		$1 = "";
	}
	$2 = rt.sv(f, "tank_two");
	if (truthy(rt.sv(f, "tank_two"))) {
		$3 = fmt("<A href='?src=＃;tanktwo=1'>Remove</A>", [live(f.src)]);
	} else {
		$3 = "";
	}
	if (truthy(rt.sv(f, "attached_device"))) {
		$4 = fmt("<A href='?src=＃;device=1'>＀</A>", [live(f.src), rt.sv(f, "attached_device")]);
	} else {
		$4 = "None";
	}
	if (truthy(rt.sv(f, "attached_device"))) {
		$5 = fmt("<A href='?src=＃;rem_device=1'>Remove</A>", [live(f.src)]);
	} else {
		$5 = "";
	}
	if (truthy(rt.sv(f, "valve_open"))) {
		$6 = fmt("<A href='?src=＃;open=1'>Closed</A> <B>Open</B>", [live(f.src)]);
	} else {
		$6 = fmt("<B>Closed</B> <A href='?src=＃;open=1'>Open</A>", [live(f.src)]);
	}
	dat = fmt("<B> Valve properties: </B>\n\t<BR> <B> Attachment one:</B> ＀ ＀\n\t<BR> <B> Attachment two:</B> ＀ ＀\n\t<BR> <B> Valve attachment:</B> ＀ ＀\n\t<BR> <B> Valve status: </B> ＀", [$0, $1, $2, $3, $4, $5, $6]);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "trans_valve", rt.sv(f, "name")]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true);

// /obj/item/device/transfer_valve/proc/Topic  (code/game/objects/items/devices/transfer_valve.dm:76)  may sleep
rt.def("/obj/item/device/transfer_valve/proc/Topic", function* Topic(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.fv(f, "stat", live(f.usr))) || truthy((yield* g.callName(f, live(f.usr), "restrained", []))))) {
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "loc", live(f.src)), live(f.usr))) {
		if ((truthy(rt.sv(f, "tank_one")) && truthy(rt.at(live(f.args[1]), "tankone")))) {
			yield* g.srcCall(f, "split_gases");
			rt.setSv(f, "valve_open", 0);
			rt.setFv(f, "loc", rt.sv(f, "tank_one"), rt.getStep(f, live(f.src), 0));
			rt.setSv(f, "tank_one", null);
			yield* g.srcCall(f, "update_icon");
			if (((!truthy(rt.sv(f, "tank_two")) || rt.lt(rt.fv(f, "w_class", rt.sv(f, "tank_two")), 4)) && rt.gt(rt.sv(f, "w_class"), 3))) {
				rt.setSv(f, "w_class", 3);
			}
		} else {
			if ((truthy(rt.sv(f, "tank_two")) && truthy(rt.at(live(f.args[1]), "tanktwo")))) {
				yield* g.srcCall(f, "split_gases");
				rt.setSv(f, "valve_open", 0);
				rt.setFv(f, "loc", rt.sv(f, "tank_two"), rt.getStep(f, live(f.src), 0));
				rt.setSv(f, "tank_two", null);
				yield* g.srcCall(f, "update_icon");
				if (((!truthy(rt.sv(f, "tank_one")) || rt.lt(rt.fv(f, "w_class", rt.sv(f, "tank_one")), 4)) && rt.gt(rt.sv(f, "w_class"), 3))) {
					rt.setSv(f, "w_class", 3);
				}
			} else {
				if (truthy(rt.at(live(f.args[1]), "open"))) {
					yield* g.srcCall(f, "toggle_valve");
				} else {
					if (truthy(rt.sv(f, "attached_device"))) {
						if (truthy(rt.at(live(f.args[1]), "rem_device"))) {
							rt.setFv(f, "loc", rt.sv(f, "attached_device"), rt.getStep(f, live(f.src), 0));
							rt.setFv(f, "holder", rt.sv(f, "attached_device"), null);
							rt.setSv(f, "attached_device", null);
							yield* g.srcCall(f, "update_icon");
						}
						if (truthy(rt.at(live(f.args[1]), "device"))) {
							yield* g.callName(f, rt.sv(f, "attached_device"), "attack_self", [live(f.usr)]);
						}
					}
				}
			}
		}
		yield* g.callName(f, live(f.src), "attack_self", [live(f.usr)]);
		yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.usr)]);
		return live(f.dot);
	}
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/item/device/transfer_valve/proc/process_activation  (code/game/objects/items/devices/transfer_valve.dm:115)  may sleep
rt.def("/obj/item/device/transfer_valve/proc/process_activation", function* process_activation(f: Frame, D: Value) {
	f.vars = () => [D];
	if (!truthy(rt.sv(f, "toggle"))) return f.dot;
	rt.setSv(f, "toggle", 0);
	yield* g.srcCall(f, "toggle_valve");
	rt.spawnTail(f, 50, "/obj/item/device/transfer_valve/proc/process_activation: spawn at game/objects/items/devices/transfer_valve.dm:116", D);
	return f.dot;
}, true);

// a spawn(50) body of /obj/item/device/transfer_valve/proc/process_activation, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/transfer_valve/proc/process_activation: spawn at game/objects/items/devices/transfer_valve.dm:116", function* (f: Frame, D: Value) {
	f.vars = () => [D];
	rt.setSv(f, "toggle", 1);
	return null;
});

// /obj/item/device/transfer_valve/proc/update_icon  (code/game/objects/items/devices/transfer_valve.dm:120)
rt.def("/obj/item/device/transfer_valve/proc/update_icon", function update_icon(f: Frame) {
	let J: Value = null;
	f.vars = () => [J];
	rt.callSrc(f, "cut_overlays", []);
	rt.setSv(f, "underlays", null);
	if (((!truthy(rt.sv(f, "tank_one")) && !truthy(rt.sv(f, "tank_two"))) && !truthy(rt.sv(f, "attached_device")))) {
		rt.setSv(f, "icon_state", "valve_1");
		return live(f.dot);
	}
	rt.setSv(f, "icon_state", "valve");
	if (truthy(rt.sv(f, "tank_one"))) {
		rt.callSrc(f, "add_overlay", [fmt("＀", [rt.fv(f, "icon_state", rt.sv(f, "tank_one"))])]);
	}
	if (truthy(rt.sv(f, "tank_two"))) {
		rt.callName(f, (J = rt.new_(f, T("/icon"), [null, rt.sv(f, "icon"), "icon_state", fmt("＀", [rt.fv(f, "icon_state", rt.sv(f, "tank_two"))])], rt.Args.Named)), "Shift", [8, 13]);
		rt.modSrcVar(f, "underlays", live(J), add);
	}
	if (!truthy(rt.sv(f, "attached_device"))) return f.dot;
	rt.callSrc(f, "add_overlay", ["device"]);
	return f.dot;
});

// /obj/item/device/transfer_valve/proc/merge_gases  (code/game/objects/items/devices/transfer_valve.dm:138)  may sleep
rt.def("/obj/item/device/transfer_valve/proc/merge_gases", function* merge_gases(f: Frame) {
	let temp: Value = null;
	f.vars = () => [temp];
	rt.modField(f, rt.fv(f, "air_contents", rt.sv(f, "tank_two")), "volume", rt.gv(f, "volume", rt.fv(f, "air_contents", rt.sv(f, "tank_one"))), add);
	temp = null;
	temp = (yield* g.callName(f, rt.fv(f, "air_contents", rt.sv(f, "tank_one")), "remove_ratio", [1]));
	yield* g.callName(f, rt.fv(f, "air_contents", rt.sv(f, "tank_two")), "merge", [live(temp)]);
	return f.dot;
}, true);

// /obj/item/device/transfer_valve/proc/split_gases  (code/game/objects/items/devices/transfer_valve.dm:144)  may sleep
rt.def("/obj/item/device/transfer_valve/proc/split_gases", function* split_gases(f: Frame) {
	let ratio1: Value = null, temp: Value = null;
	f.vars = () => [ratio1, temp];
	if (((!truthy(rt.sv(f, "valve_open")) || !truthy(rt.sv(f, "tank_one"))) || !truthy(rt.sv(f, "tank_two")))) {
		return live(f.dot);
	}
	ratio1 = divide(rt.gv(f, "volume", rt.fv(f, "air_contents", rt.sv(f, "tank_one"))), rt.gv(f, "volume", rt.fv(f, "air_contents", rt.sv(f, "tank_two"))));
	temp = null;
	temp = (yield* g.callName(f, rt.fv(f, "air_contents", rt.sv(f, "tank_two")), "remove_ratio", [live(ratio1)]));
	yield* g.callName(f, rt.fv(f, "air_contents", rt.sv(f, "tank_one")), "merge", [live(temp)]);
	(rt.modField(f, rt.fv(f, "air_contents", rt.sv(f, "tank_two")), "volume", rt.gv(f, "volume", rt.fv(f, "air_contents", rt.sv(f, "tank_one"))), subtract));
	return f.dot;
}, true);

// /obj/item/device/transfer_valve/proc/toggle_valve  (code/game/objects/items/devices/transfer_valve.dm:158)  may sleep
rt.def("/obj/item/device/transfer_valve/proc/toggle_valve", function* toggle_valve(f: Frame) {
	let bombturf: Value = null, A: Value = null, attachment: Value = null, attacher_name: Value = null, log_str1: Value = null, log_str2: Value = null, log_attacher: Value = null, mob: Value = null, last_touch_info: Value = null, log_str3: Value = null, bomb_message: Value = null, i: Value = null;
	f.vars = () => [bombturf, A, attachment, attacher_name, log_str1, log_str2, log_attacher, mob, last_touch_info, log_str3, bomb_message, i];
	if (((!truthy(rt.sv(f, "valve_open")) && truthy(rt.sv(f, "tank_one"))) && truthy(rt.sv(f, "tank_two")))) {
		rt.setSv(f, "valve_open", 1);
		bombturf = rt.getStep(f, live(f.src), 0);
		A = (yield* g.call(f, P("/proc/get_area"), null, [live(bombturf)]));
		attachment = "no device";
		if (truthy(rt.sv(f, "attached_device"))) {
			if (truthy((rt.istype(rt.sv(f, "attached_device"), T("/obj/item/device/assembly/signaler")) ? 1 : 0))) {
				attachment = fmt("<A HREF='?_src_=holder;secrets=list_signalers'>＀</A>", [rt.sv(f, "attached_device")]);
			} else {
				attachment = rt.sv(f, "attached_device");
			}
		}
		attacher_name = "";
		if (!truthy(rt.sv(f, "attacher"))) {
			attacher_name = "Unknown";
		} else {
			attacher_name = fmt("＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [rt.sv(f, "attacher")]))]);
		}
		log_str1 = "Bomb valve opened in ";
		log_str2 = fmt("with ＀ attacher: ＀", [live(attachment), live(attacher_name)]);
		log_attacher = "";
		if (truthy(rt.sv(f, "attacher"))) {
			log_attacher = fmt("＀ ＀", [fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [rt.sv(f, "attacher")]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [rt.sv(f, "attacher")])]);
		}
		mob = (yield* g.call(f, P("/proc/get_mob_by_key"), null, [rt.fv(f, "fingerprintslast", live(f.src))]));
		last_touch_info = "";
		if (truthy(live(mob))) {
			last_touch_info = fmt("＀ ＀", [fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(mob)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(mob)])]);
		}
		log_str3 = fmt(" Last touched by: ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(mob)]))]);
		rt.modGl("bombers", (bomb_message = fmt("＀ ＀＀ ＀＀ ＀＀", [live(log_str1), rt.fv(f, "name", live(A)), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))]), live(log_str2), live(log_attacher), live(log_str3), live(last_touch_info)])), add);
		yield* g.call(f, P("/proc/message_admins"), null, [live(bomb_message), 0, 1]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ ＀＀ ＀ ＀", [live(log_str1), rt.fv(f, "name", live(A)), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))]), live(log_str2), live(log_str3)])]);
		yield* g.srcCall(f, "merge_gases");
		rt.spawnTail(f, 20, "/obj/item/device/transfer_valve/proc/toggle_valve: spawn at game/objects/items/devices/transfer_valve.dm:197", bombturf, A, attachment, attacher_name, log_str1, log_str2, log_attacher, mob, last_touch_info, log_str3, bomb_message, i);
	} else {
		if (!((truthy(rt.sv(f, "valve_open")) && truthy(rt.sv(f, "tank_one"))) && truthy(rt.sv(f, "tank_two")))) return f.dot;
		yield* g.srcCall(f, "split_gases");
		rt.setSv(f, "valve_open", 0);
		yield* g.callName(f, live(f.src), "update_icon", []);
	}
	return f.dot;
}, true);

// a spawn(20) body of /obj/item/device/transfer_valve/proc/toggle_valve, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/transfer_valve/proc/toggle_valve: spawn at game/objects/items/devices/transfer_valve.dm:197", function* (f: Frame, bombturf: Value, A: Value, attachment: Value, attacher_name: Value, log_str1: Value, log_str2: Value, log_attacher: Value, mob: Value, last_touch_info: Value, log_str3: Value, bomb_message: Value, i: Value) {
	f.vars = () => [bombturf, A, attachment, attacher_name, log_str1, log_str2, log_attacher, mob, last_touch_info, log_str3, bomb_message, i];
	i = null;
	i = 0;
	while (rt.lt(live(i), 5)) {
		yield* g.callName(f, live(f.src), "update_icon", []);
		yield* g.call(f, P("/proc/sleep"), null, [10]);
		i = rt.inc(live(i), 1);
	}
	yield* g.callName(f, live(f.src), "update_icon", []);
	return null;
});
