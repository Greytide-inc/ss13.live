// From code/game/objects/items/devices/traitordevices.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9293, "/obj/item/device/batterer", "/obj/item/device", {
	times_used: 0,
	max_uses: 2,
	throw_speed: 3,
	throw_range: 7,
	flags: 64,
	name: "mind batterer",
	desc: "A strange device with twin antennas.",
	icon_state: "batterer",
	throwforce: 5,
	w_class: 1,
	item_state: "electronic",
	origin_tech: "magnets=3;combat=3;syndicate=3",
});

// /obj/item/device/batterer/proc/attack_self  (code/game/objects/items/devices/traitordevices.dm:35)  may sleep
rt.def("/obj/item/device/batterer/proc/attack_self", function* attack_self(f: Frame, user: Value, flag: Value, emp: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [user, flag, emp, M, $e];
	if (live(flag) === null) {
		flag = 0;
	}
	if (live(emp) === null) {
		emp = 0;
	}
	if (!truthy(live(user))) {
		return live(f.dot);
	}
	if (rt.ge(rt.sv(f, "times_used"), rt.sv(f, "max_uses"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>The mind batterer has been burnt out!</span>"]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), null, "knocked down people in the area", live(f.src)]);
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/urange"), null, [10, live(user), 1])), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			yield* g.callName(f, live(M), "Knockdown", [(yield* g.call(f, P("/proc/rand"), null, [200, 400]))]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='userdanger'>You feel a tremendous, paralyzing wave flood your mind.</span>"]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='userdanger'>You feel a sudden, electric jolt travel through your head.</span>"]);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/misc/interference.ogg"), 50, 1]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You trigger ＀.</span>", [live(f.src)])]);
	if (!rt.ge((rt.modSrcVar(f, "times_used", 1, add)), rt.sv(f, "max_uses"))) return f.dot;
	rt.setSv(f, "icon_state", "battererburnt");
	return f.dot;
}, true);

rt.type(9283, "/obj/item/device/healthanalyzer/rad_laser", "/obj/item/device/healthanalyzer", {
	irradiate: 1,
	intensity: 10,
	wavelength: 10,
	used: 0,
	materials: null,
	origin_tech: "magnets=3;biotech=5;syndicate=3",
});

// /obj/item/device/healthanalyzer/rad_laser/proc/<init>  (code/game/objects/items/devices/traitordevices.dm:70)
rt.def("/obj/item/device/healthanalyzer/rad_laser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 400]));
	return f.dot;
});

// /obj/item/device/healthanalyzer/rad_laser/proc/attack  (code/game/objects/items/devices/traitordevices.dm:78)  may sleep
rt.def("/obj/item/device/healthanalyzer/rad_laser/proc/attack", function* attack(f: Frame) {
	let cooldown: Value = null;
	f.vars = () => [cooldown];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "irradiate"))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "used"))) {
		yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[1]), live(f.args[0]), "irradiated", live(f.src)]);
		cooldown = multiply((yield* g.call(f, P("/proc/round"), null, [(yield* g.call(f, P("/proc/max"), null, [10, subtract(multiply(rt.sv(f, "intensity"), 5), divide(rt.sv(f, "wavelength"), 4))]))])), 10);
		rt.setSv(f, "used", 1);
		rt.setSv(f, "icon_state", "health1");
		yield* g.srcCall(f, "handle_cooldown", live(cooldown));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>Successfully irradiated ＀.</span>", [live(f.args[0])])]);
		rt.spawnTail(f, multiply(add(rt.sv(f, "wavelength"), multiply(rt.sv(f, "intensity"), 4)), 5), "/obj/item/device/healthanalyzer/rad_laser/proc/attack: spawn at game/objects/items/devices/traitordevices.dm:87", cooldown);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The radioactive microlaser is still recharging.</span>"]);
	}
	return f.dot;
}, true, { args: ["M", "user"] });

// a spawn(multiply(add(rt.srcVarI(f, $ic[12]), multiply(rt.srcVarI(f, $ic[13]), 4)), 5)) body of /obj/item/device/healthanalyzer/rad_laser/proc/attack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/healthanalyzer/rad_laser/proc/attack: spawn at game/objects/items/devices/traitordevices.dm:87", function* (f: Frame, cooldown: Value) {
	f.vars = () => [cooldown];
	if (truthy(live(f.args[0]))) {
		if (rt.ge(rt.sv(f, "intensity"), 5)) {
			yield* g.callName(f, live(f.args[0]), "apply_effect", [(yield* g.call(f, P("/proc/round"), null, [divide(rt.sv(f, "intensity"), 0.07500000298023224)])), 1]);
		}
		yield* g.callName(f, live(f.args[0]), "rad_act", [multiply(rt.sv(f, "intensity"), 10)]);
	}
	return null;
});

// /obj/item/device/healthanalyzer/rad_laser/proc/handle_cooldown  (code/game/objects/items/devices/traitordevices.dm:97)
rt.def("/obj/item/device/healthanalyzer/rad_laser/proc/handle_cooldown", function handle_cooldown(f: Frame, cooldown: Value) {
	rt.spawnTail(f, live(cooldown), "/obj/item/device/healthanalyzer/rad_laser/proc/handle_cooldown: spawn at game/objects/items/devices/traitordevices.dm:97", cooldown);
	return f.dot;
});

// a spawn(live(cooldown)) body of /obj/item/device/healthanalyzer/rad_laser/proc/handle_cooldown, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/healthanalyzer/rad_laser/proc/handle_cooldown: spawn at game/objects/items/devices/traitordevices.dm:97", function* (f: Frame, cooldown: Value) {
	f.vars = () => [cooldown];
	rt.setSv(f, "used", 0);
	rt.setSv(f, "icon_state", "health");
	return null;
});

// /obj/item/device/healthanalyzer/rad_laser/proc/attack_self  (code/game/objects/items/devices/traitordevices.dm:102)  may sleep
rt.def("/obj/item/device/healthanalyzer/rad_laser/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "interact", live(user));
	return f.dot;
}, true);

// /obj/item/device/healthanalyzer/rad_laser/proc/interact  (code/game/objects/items/devices/traitordevices.dm:105)  may sleep
rt.def("/obj/item/device/healthanalyzer/rad_laser/proc/interact", function* interact(f: Frame, user: Value) {
	let cooldown: Value = null, dat: Value = null, popup: Value = null;
	let $0: any, $1: any;
	f.vars = () => [user, cooldown, dat, popup, $0, $1];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	cooldown = (yield* g.call(f, P("/proc/round"), null, [(yield* g.call(f, P("/proc/max"), null, [10, subtract(multiply(rt.sv(f, "intensity"), 5), divide(rt.sv(f, "wavelength"), 4))]))]));
	$0 = live(f.src);
	if (truthy(rt.sv(f, "irradiate"))) {
		$1 = "On";
	} else {
		$1 = "Off";
	}
	dat = fmt("Irradiation: <A href='?src=＃;rad=1'>＀</A><br>", [$0, $1]);
	dat = rt.modify(live(dat), fmt("Scan Mode: <a href='?src=＃;mode=1'>", [live(f.src)]), add);
	if (!truthy(rt.sv(f, "scanmode"))) {
		dat = rt.modify(live(dat), "Scan Health", add);
	} else {
		if (isEqual(rt.sv(f, "scanmode"), 1)) {
			dat = rt.modify(live(dat), "Scan Reagents", add);
		} else {
			dat = rt.modify(live(dat), "Disabled", add);
		}
	}
	dat = rt.modify(live(dat), "</a><br><br>", add);
	dat = rt.modify(live(dat), fmt("\n\tRadiation Intensity:\n\t<A href='?src=＃;radint=-5'>-</A><A href='?src=＃;radint=-1'>-</A>\n\t＀\n\t<A href='?src=＃;radint=1'>+</A><A href='?src=＃;radint=5'>+</A><BR>\n\n\tRadiation Wavelength:\n\t<A href='?src=＃;radwav=-5'>-</A><A href='?src=＃;radwav=-1'>-</A>\n\t＀\n\t<A href='?src=＃;radwav=1'>+</A><A href='?src=＃;radwav=5'>+</A><BR>\n\tLaser Cooldown: ＀ Seconds<BR>\n\t", [live(f.src), live(f.src), rt.sv(f, "intensity"), live(f.src), live(f.src), live(f.src), live(f.src), add(rt.sv(f, "wavelength"), multiply(rt.sv(f, "intensity"), 4)), live(f.src), live(f.src), live(cooldown)]), add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "radlaser", "Radioactive Microlaser Interface", 400, 240]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/item/device/healthanalyzer/rad_laser/proc/Topic  (code/game/objects/items/devices/traitordevices.dm:136)  may sleep
rt.def("/obj/item/device/healthanalyzer/rad_laser/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let amount: Value = null;
	f.vars = () => [href, href_list, amount];
	if (!truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src)])))) {
		return 1;
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	if (truthy(rt.at(live(href_list), "rad"))) {
		rt.setSv(f, "irradiate", (!truthy(rt.sv(f, "irradiate")) ? 1 : 0));
	} else {
		if (truthy(rt.at(live(href_list), "mode"))) {
			if (rt.gt((rt.modSrcVar(f, "scanmode", 1, add)), 2)) {
				rt.setSv(f, "scanmode", 0);
			}
		} else {
			if (truthy(rt.at(live(href_list), "radint"))) {
				amount = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "radint")]));
				amount = rt.modify(live(amount), rt.sv(f, "intensity"), add);
				rt.setSv(f, "intensity", (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [20, live(amount)]))])));
			} else {
				if (truthy(rt.at(live(href_list), "radwav"))) {
					amount = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "radwav")]));
					amount = rt.modify(live(amount), rt.sv(f, "wavelength"), add);
					rt.setSv(f, "wavelength", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [120, live(amount)]))])));
				}
			}
		}
	}
	yield* g.srcCall(f, "attack_self", live(f.usr));
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	return live(f.dot);
}, true);

rt.type(9294, "/obj/item/device/shadowcloak", "/obj/item/device", {
	user: null,
	charge: 300,
	max_charge: 300,
	on: 0,
	old_alpha: 0,
	name: "cloaker belt",
	desc: "Makes you invisible for short periods of time. Recharges in darkness.",
	icon: rt.rsc("icons/obj/clothing/belts.dmi"),
	icon_state: "utilitybelt",
	item_state: "utility",
	slot_flags: 512,
	attack_verb: null,
	actions_types: null,
});

// /obj/item/device/shadowcloak/proc/<init>  (code/game/objects/items/devices/traitordevices.dm:176)
rt.def("/obj/item/device/shadowcloak/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("whipped", "lashed", "disciplined"));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle")));
	return f.dot;
});

// /obj/item/device/shadowcloak/proc/ui_action_click  (code/game/objects/items/devices/traitordevices.dm:179)
rt.def("/obj/item/device/shadowcloak/proc/ui_action_click", function ui_action_click(f: Frame, user: Value) {
	if (isEqual(rt.callName(f, live(user), "get_item_by_slot", [5]), live(f.src))) {
		if (!truthy(rt.sv(f, "on"))) {
			rt.callSrc(f, "Activate", [live(f.usr)]);
		} else {
			rt.callSrc(f, "Deactivate", []);
		}
	}
	return live(f.dot);
});

// /obj/item/device/shadowcloak/proc/item_action_slot_check  (code/game/objects/items/devices/traitordevices.dm:187)
rt.def("/obj/item/device/shadowcloak/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value, user: Value) {
	if (!isEqual(live(slot), 5)) return f.dot;
	return 1;
});

// /obj/item/device/shadowcloak/proc/Activate  (code/game/objects/items/devices/traitordevices.dm:191)
rt.def("/obj/item/device/shadowcloak/proc/Activate", function Activate(f: Frame, user: Value) {
	if (!truthy(live(user))) {
		return live(f.dot);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You activate ＀.</span>", [live(f.src)])]);
	rt.setFv(f, "user", live(f.src), live(user));
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	rt.setSv(f, "old_alpha", rt.fv(f, "alpha", live(user)));
	rt.setSv(f, "on", 1);
	return f.dot;
});

// /obj/item/device/shadowcloak/proc/Deactivate  (code/game/objects/items/devices/traitordevices.dm:200)
rt.def("/obj/item/device/shadowcloak/proc/Deactivate", function Deactivate(f: Frame) {
	rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "user"), fmt("<span class='notice'>You deactivate ＀.</span>", [live(f.src)])]);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	if (truthy(rt.sv(f, "user"))) {
		rt.setFv(f, "alpha", rt.sv(f, "user"), rt.sv(f, "old_alpha"));
	}
	rt.setSv(f, "on", 0);
	rt.setSv(f, "user", null);
	return f.dot;
});

// /obj/item/device/shadowcloak/proc/dropped  (code/game/objects/items/devices/traitordevices.dm:208)  may sleep
rt.def("/obj/item/device/shadowcloak/proc/dropped", function* dropped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy(live(f.args[0])) && !isEqual((yield* g.callName(f, live(f.args[0]), "get_item_by_slot", [5])), live(f.src)))) return f.dot;
	yield* g.srcCall(f, "Deactivate");
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/device/shadowcloak/proc/process  (code/game/objects/items/devices/traitordevices.dm:213)
rt.def("/obj/item/device/shadowcloak/proc/process", function process(f: Frame) {
	let _T: Value = null, lumcount: Value = null;
	f.vars = () => [_T, lumcount];
	if (!isEqual(rt.callName(f, rt.sv(f, "user"), "get_item_by_slot", [5]), live(f.src))) {
		rt.callSrc(f, "Deactivate", []);
		return live(f.dot);
	}
	_T = rt.getStep(f, live(f.src), 0);
	if (!truthy(rt.sv(f, "on"))) return f.dot;
	if (rt.gt((lumcount = rt.callName(f, live(_T), "get_lumcount", [])), 0.30000001192092896)) {
		rt.setSv(f, "charge", rt.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "charge"), 25)]));
	} else {
		rt.setSv(f, "charge", rt.call(f, P("/proc/min"), null, [rt.sv(f, "max_charge"), add(rt.sv(f, "charge"), 50)]));
	}
	rt.op(f, "Animate", [2, 6], [null, rt.sv(f, "user"), "alpha", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [subtract(255, rt.sv(f, "charge")), 255])]), "time", 10]);
	return f.dot;
}, false, { waitfor: false });

rt.type(9295, "/obj/item/device/jammer", "/obj/item/device", {
	active: 0,
	range: 12,
	name: "radio jammer",
	desc: "Device used to disrupt nearby radio communication.",
	icon_state: "jammer",
});

// /obj/item/device/jammer/proc/attack_self  (code/game/objects/items/devices/traitordevices.dm:234)
rt.def("/obj/item/device/jammer/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	$0 = live(user);
	if (truthy(rt.sv(f, "active"))) {
		$1 = "deactivate";
	} else {
		$1 = "activate";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the ＀<span>", [$1, live(f.src)])]);
	rt.setSv(f, "active", (!truthy(rt.sv(f, "active")) ? 1 : 0));
	if (truthy(rt.sv(f, "active"))) {
		(rt.modGl("active_jammers", live(f.src), rt.bitOr));
	} else {
		(rt.modGl("active_jammers", live(f.src), subtract));
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});
