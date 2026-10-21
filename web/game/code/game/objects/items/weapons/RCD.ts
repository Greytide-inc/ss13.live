// From code/game/objects/items/weapons/RCD.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7327, "/obj/item/weapon/construction", "/obj/item/weapon", {
	spark_system: null,
	matter: 0,
	max_matter: 100,
	sheetmultiplier: 4,
	plasteelmultiplier: 3,
	no_ammo_message: "<span class='warning'>The 'Low Ammo' light on the device blinks yellow.</span>",
	anchored: 0,
	flags: 68,
	throw_speed: 3,
	throw_range: 5,
	opacity: 0,
	density: 0,
	force: 0,
	throwforce: 10,
	w_class: 3,
	materials: null,
	origin_tech: "engineering=4;materials=2",
	req_access_txt: "11",
	armor: null,
	resistance_flags: 2,
});

// /obj/item/weapon/construction/proc/<init>  (code/game/objects/items/weapons/RCD.dm:21)
rt.def("/obj/item/weapon/construction/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 100000]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]));
	return f.dot;
});

// /obj/item/weapon/construction/proc/Initialize  (code/game/objects/items/weapons/RCD.dm:34)  may sleep
rt.def("/obj/item/weapon/construction/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "desc", fmt("A ＀. It currently holds ＀/＀ matter-units.", [live(f.src), rt.sv(f, "matter"), rt.sv(f, "max_matter")]));
	rt.setSv(f, "spark_system", (yield* g.new_(f, T("/datum/effect_system/spark_spread"), [])));
	yield* g.callName(f, rt.sv(f, "spark_system"), "set_up", [5, 0, live(f.src)]);
	yield* g.callName(f, rt.sv(f, "spark_system"), "attach", [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/construction/proc/Destroy  (code/game/objects/items/weapons/RCD.dm:42)  may sleep
rt.def("/obj/item/weapon/construction/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "spark_system")]);
	rt.setSv(f, "spark_system", null);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/weapon/construction/proc/attackby  (code/game/objects/items/weapons/RCD.dm:46)  may sleep
rt.def("/obj/item/weapon/construction/proc/attackby", function* attackby(f: Frame) {
	let loaded: Value = null, R: Value = null;
	f.vars = () => [loaded, R];
	if (truthy((rt.istype(live(f.args[1]), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		return live(f.dot);
	}
	loaded = 0;
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/rcd_ammo")) ? 1 : 0))) {
		R = live(f.args[0]);
		if (rt.gt(add(rt.sv(f, "matter"), rt.fv(f, "ammoamt", live(R))), rt.sv(f, "max_matter"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The ＀ can't hold any more matter-units!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		rt.modSrcVar(f, "matter", rt.fv(f, "ammoamt", live(R)), add);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/click.ogg"), 50, 1]);
		loaded = 1;
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/metal")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/glass")) ? 1 : 0)))) {
			loaded = (yield* g.srcCall(f, "loadwithsheets", live(f.args[0]), rt.sv(f, "sheetmultiplier"), live(f.args[1])));
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/plasteel")) ? 1 : 0))) {
				loaded = (yield* g.srcCall(f, "loadwithsheets", live(f.args[0]), multiply(rt.sv(f, "plasteelmultiplier"), rt.sv(f, "sheetmultiplier")), live(f.args[1])));
			}
		}
	}
	if (truthy(live(loaded))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>The ＀ now holds ＀/＀ matter-units.</span>", [live(f.src), rt.sv(f, "matter"), rt.sv(f, "max_matter")])]);
		rt.setSv(f, "desc", fmt("A RCD. It currently holds ＀/＀ matter-units.", [rt.sv(f, "matter"), rt.sv(f, "max_matter")]));
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/construction/proc/loadwithsheets  (code/game/objects/items/weapons/RCD.dm:69)  may sleep
rt.def("/obj/item/weapon/construction/proc/loadwithsheets", function* loadwithsheets(f: Frame, S: Value, value: Value, user: Value) {
	let maxsheets: Value = null, amount_to_use: Value = null;
	f.vars = () => [S, value, user, maxsheets, amount_to_use];
	if (rt.gt((maxsheets = (yield* g.call(f, P("/proc/round"), null, [divide(subtract(rt.sv(f, "max_matter"), rt.sv(f, "matter")), live(value))]))), 0)) {
		amount_to_use = (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "amount", live(S)), live(maxsheets)]));
		yield* g.callName(f, live(S), "use", [live(amount_to_use)]);
		rt.modSrcVar(f, "matter", multiply(live(value), live(amount_to_use)), add);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/click.ogg"), 50, 1]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You insert ＀ ＀ sheets into the ＀. </span>", [live(amount_to_use), rt.fv(f, "name", live(S)), live(f.src)])]);
		return 1;
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You can't insert any more ＀ sheets into the ＀!", [rt.fv(f, "name", live(S)), live(f.src)])]);
	return 0;
}, true);

// /obj/item/weapon/construction/proc/activate  (code/game/objects/items/weapons/RCD.dm:81)
rt.def("/obj/item/weapon/construction/proc/activate", function activate(f: Frame) {
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
	return f.dot;
});

// /obj/item/weapon/construction/proc/attack_self  (code/game/objects/items/weapons/RCD.dm:84)
rt.def("/obj/item/weapon/construction/proc/attack_self", function attack_self(f: Frame, user: Value) {
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/pop.ogg"), 50, 0]);
	if (!truthy(rt.op(f, "Prob", [], [20]))) return f.dot;
	rt.callName(f, rt.sv(f, "spark_system"), "start", []);
	return f.dot;
});

// /obj/item/weapon/construction/proc/useResource  (code/game/objects/items/weapons/RCD.dm:89)
rt.def("/obj/item/weapon/construction/proc/useResource", function useResource(f: Frame, amount: Value, user: Value) {
	if (rt.lt(rt.sv(f, "matter"), live(amount))) {
		if (truthy(live(user))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), rt.sv(f, "no_ammo_message")]);
		}
		return 0;
	}
	(rt.modSrcVar(f, "matter", live(amount), subtract));
	rt.setSv(f, "desc", fmt("A ＀. It currently holds ＀/＀ matter-units.", [live(f.src), rt.sv(f, "matter"), rt.sv(f, "max_matter")]));
	rt.callSrc(f, "update_icon", []);
	return 1;
});

// /obj/item/weapon/construction/proc/checkResource  (code/game/objects/items/weapons/RCD.dm:99)
rt.def("/obj/item/weapon/construction/proc/checkResource", function checkResource(f: Frame, amount: Value, user: Value) {
	f.dot = (rt.ge(rt.sv(f, "matter"), live(amount)) ? 1 : 0);
	if ((!truthy(live(f.dot)) && truthy(live(user)))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), rt.sv(f, "no_ammo_message")]);
	}
	return live(f.dot);
});

// /obj/item/weapon/construction/proc/range_check  (code/game/objects/items/weapons/RCD.dm:105)
rt.def("/obj/item/weapon/construction/proc/range_check", function range_check(f: Frame, A: Value, user: Value) {
	if (!truthy((rt.isIn(f, live(A), rt.call(f, P("/proc/view"), null, [7, rt.getStep(f, live(user), 0)])) ? 1 : 0))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The 'Out of Range' light on the ＀ blinks red.</span>", [live(f.src)])]);
		return 0;
	} else {
		return 1;
	}
	return f.dot;
});

// /obj/item/weapon/construction/proc/prox_check  (code/game/objects/items/weapons/RCD.dm:113)
rt.def("/obj/item/weapon/construction/proc/prox_check", function prox_check(f: Frame, proximity: Value) {
	if (truthy(live(proximity))) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
});

rt.type(7328, "/obj/item/weapon/construction/rcd", "/obj/item/weapon/construction", {
	mode: 1,
	canRturf: 0,
	ranged: 0,
	airlock_glass: 0,
	advanced_airlock_setting: 1,
	conf_access: null,
	use_one_access: 0,
	delay_mod: 1,
	airlock_type: rt.typePath("/obj/machinery/door/airlock"),
	window_type: rt.typePath("/obj/structure/window/fulltile"),
	max_matter: 160,
	name: "rapid-construction-device (RCD)",
	desc: "A device used to rapidly build and deconstruct walls and floors.",
	icon: rt.rsc("icons/obj/tools.dmi"),
	icon_state: "rcd",
});

// /obj/item/weapon/construction/rcd/proc/suicide_act  (code/game/objects/items/weapons/RCD.dm:137)
rt.def("/obj/item/weapon/construction/rcd/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ sets the RCD to 'Wall' and points it down ＀ throat! It looks like ＀ trying to commit suicide..</span>", [live(user), rt.callName(f, live(user), "p_their", []), rt.callName(f, live(user), "p_theyre", [])])]);
	return 1;
});

// /obj/item/weapon/construction/rcd/verb/toggle_window_type  (code/game/objects/items/weapons/RCD.dm:147)
rt.def("/obj/item/weapon/construction/rcd/verb/toggle_window_type", function toggle_window_type(f: Frame) {
	let window_type_name: Value = null;
	f.vars = () => [window_type_name];
	window_type_name = null;
	if (isEqual(rt.sv(f, "window_type"), T("/obj/structure/window/fulltile"))) {
		rt.setSv(f, "window_type", T("/obj/structure/window/reinforced/fulltile"));
		window_type_name = "reinforced glass";
	} else {
		rt.setSv(f, "window_type", T("/obj/structure/window/fulltile"));
		window_type_name = "glass";
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You change ％！'s window mode to ＀.</span>", [live(f.src), live(window_type_name)])]);
	return f.dot;
}, false, { verb: { name: "Toggle Window Type", category: "Object", src: 11 } });

// /obj/item/weapon/construction/rcd/verb/change_airlock_access  (code/game/objects/items/weapons/RCD.dm:161)  may sleep
rt.def("/obj/item/weapon/construction/rcd/verb/change_airlock_access", function* change_airlock_access(f: Frame) {
	let H: Value = null, t1: Value = null, accesses: Value = null, i: Value = null, A: Value = null, popup: Value = null;
	let $e: any;
	f.vars = () => [H, t1, accesses, i, A, popup, $e];
	if ((!truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0)) && !truthy(rt.fv(f, "has_unlimited_silicon_privilege", live(f.usr))))) {
		return (yield* g.callSuper(f, [live(f.usr)]));
	}
	if (rt.ge((yield* g.callName(f, (H = live(f.usr)), "getBrainLoss", [])), 60)) {
		return live(f.dot);
	}
	t1 = "";
	if (truthy(rt.sv(f, "use_one_access"))) {
		t1 = rt.modify(live(t1), fmt("Restriction Type: <a href='?src=＃;access=one'>At least one access required</a><br>", [live(f.src)]), add);
	} else {
		t1 = rt.modify(live(t1), fmt("Restriction Type: <a href='?src=＃;access=one'>All accesses required</a><br>", [live(f.src)]), add);
	}
	t1 = rt.modify(live(t1), fmt("<a href='?src=＃;access=all'>Remove All</a><br>", [live(f.src)]), add);
	accesses = "";
	accesses = rt.modify(live(accesses), "<div align='center'><b>Access</b></div>", add);
	accesses = rt.modify(live(accesses), "<table style='width:100%'>", add);
	accesses = rt.modify(live(accesses), "<tr>", add);
	i = null;
	i = 1;
	while (rt.le(live(i), 7)) {
		accesses = rt.modify(live(accesses), fmt("<td style='width:14%'><b>＀:</b></td>", [(yield* g.call(f, P("/proc/get_region_accesses_name"), null, [live(i)]))]), add);
		i = rt.inc(live(i), 1);
	}
	accesses = rt.modify(live(accesses), "</tr><tr>", add);
	i = null;
	i = 1;
	while (rt.le(live(i), 7)) {
		accesses = rt.modify(live(accesses), "<td style='width:14%' valign='top'>", add);
		A = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/get_region_accesses"), null, [live(i)])));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			if (truthy((rt.isIn(f, live(A), rt.sv(f, "conf_access")) ? 1 : 0))) {
				accesses = rt.modify(live(accesses), fmt("<a href='?src=＃;access=＀'><font color=\"red\">＀</font></a> ", [live(f.src), live(A), (yield* g.call(f, P("/proc/replacetext"), null, [(yield* g.call(f, P("/proc/get_access_desc"), null, [live(A)])), " ", "&nbsp"]))]), add);
			} else {
				accesses = rt.modify(live(accesses), fmt("<a href='?src=＃;access=＀'>＀</a> ", [live(f.src), live(A), (yield* g.call(f, P("/proc/replacetext"), null, [(yield* g.call(f, P("/proc/get_access_desc"), null, [live(A)])), " ", "&nbsp"]))]), add);
			}
			accesses = rt.modify(live(accesses), "<br>", add);
		}
		rt.endFor(f, 0);
		accesses = rt.modify(live(accesses), "</td>", add);
		i = rt.inc(live(i), 1);
	}
	t1 = rt.modify(live(t1), fmt("<tt>＀</tt>", [(accesses = rt.modify(live(accesses), "</tr></table>", add))]), add);
	t1 = rt.modify(live(t1), fmt("<p><a href='?src=＃;close=1'>Close</a></p>\n", [live(f.src)]), add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.usr), "airlock_electronics", "Access Control", 900, 500]))), "set_content", [live(t1)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(f.usr), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
	yield* g.call(f, P("/proc/onclose"), null, [live(f.usr), "airlock"]);
	return f.dot;
}, true, { verb: { name: "Change Airlock Access", category: "Object", src: 11 } });

// /obj/item/weapon/construction/rcd/proc/Topic  (code/game/objects/items/weapons/RCD.dm:206)  may sleep
rt.def("/obj/item/weapon/construction/rcd/proc/Topic", function* Topic(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.fv(f, "stat", live(f.usr))) || truthy((yield* g.callName(f, live(f.usr), "restrained", []))))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "close"))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=airlock"], false);
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "access"))) {
		yield* g.srcCall(f, "toggle_access", rt.at(live(f.args[1]), "access"));
	}
	yield* g.srcCall(f, "change_airlock_access");
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/item/weapon/construction/rcd/proc/toggle_access  (code/game/objects/items/weapons/RCD.dm:219)
rt.def("/obj/item/weapon/construction/rcd/proc/toggle_access", function toggle_access(f: Frame, acc: Value) {
	let req: Value = null;
	f.vars = () => [req];
	if (isEqual(live(acc), "all")) {
		rt.setSv(f, "conf_access", null);
	} else {
		if (isEqual(live(acc), "one")) {
			rt.setSv(f, "use_one_access", (!truthy(rt.sv(f, "use_one_access")) ? 1 : 0));
		} else {
			req = rt.call(f, P("/proc/text2num"), null, [live(acc)]);
			if (rt.sv(f, "conf_access") === null) {
				rt.setSv(f, "conf_access", rt.list());
			}
			if (!truthy((rt.isIn(f, live(req), rt.sv(f, "conf_access")) ? 1 : 0))) {
				rt.modSrcVar(f, "conf_access", live(req), add);
			} else {
				(rt.modSrcVar(f, "conf_access", live(req), subtract));
				if (truthy(rt.len(f, rt.sv(f, "conf_access")))) return f.dot;
				rt.setSv(f, "conf_access", null);
			}
		}
	}
	return f.dot;
});

// /obj/item/weapon/construction/rcd/verb/change_airlock_setting  (code/game/objects/items/weapons/RCD.dm:241)  may sleep
rt.def("/obj/item/weapon/construction/rcd/verb/change_airlock_setting", function* change_airlock_setting(f: Frame) {
	let airlockcat: Value = null, airlockpaint: Value = null;
	let $0: any;
	f.vars = () => [airlockcat, airlockpaint, $0];
	$0 = (airlockcat = (yield* g.op(f, "Prompt", [0], [null, null, "Select whether the airlock is solid or glass.", live(f.usr), rt.list("Solid", "Glass")])));
	if ($0 === "Solid") {
		if (isEqual(rt.sv(f, "advanced_airlock_setting"), 1)) {
			$0 = (airlockpaint = (yield* g.op(f, "Prompt", [0], [null, null, "Select the paintjob of the airlock.", live(f.usr), rt.list("Default", "Engineering", "Atmospherics", "Security", "Command", "Medical", "Research", "Mining", "Maintenance", "External", "High Security")])));
			if ($0 === "Default") {
				rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock"));
			} else if ($0 === "Engineering") {
				rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock/engineering"));
			} else if ($0 === "Atmospherics") {
				rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock/atmos"));
			} else if ($0 === "Security") {
				rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock/security"));
			} else if ($0 === "Command") {
				rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock/command"));
			} else if ($0 === "Medical") {
				rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock/medical"));
			} else if ($0 === "Research") {
				rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock/research"));
			} else if ($0 === "Mining") {
				rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock/mining"));
			} else if ($0 === "Maintenance") {
				rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock/maintenance"));
			} else if ($0 === "External") {
				rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock/external"));
			} else if ($0 === "High Security") {
				rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock/highsecurity"));
			}
			rt.setSv(f, "airlock_glass", 0);
		} else {
			rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock"));
			rt.setSv(f, "airlock_glass", 0);
		}
	} else if ($0 === "Glass") {
		if (isEqual(rt.sv(f, "advanced_airlock_setting"), 1)) {
			$0 = (airlockpaint = (yield* g.op(f, "Prompt", [0], [null, null, "Select the paintjob of the airlock.", live(f.usr), rt.list("Default", "Engineering", "Atmospherics", "Security", "Command", "Medical", "Research", "Mining")])));
			if ($0 === "Default") {
				rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock/glass"));
			} else if ($0 === "Engineering") {
				rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock/glass_engineering"));
			} else if ($0 === "Atmospherics") {
				rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock/glass_atmos"));
			} else if ($0 === "Security") {
				rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock/glass_security"));
			} else if ($0 === "Command") {
				rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock/glass_command"));
			} else if ($0 === "Medical") {
				rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock/glass_medical"));
			} else if ($0 === "Research") {
				rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock/glass_research"));
			} else if ($0 === "Mining") {
				rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock/glass_mining"));
			}
			rt.setSv(f, "airlock_glass", 1);
		} else {
			rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock/glass"));
			rt.setSv(f, "airlock_glass", 1);
		}
	} else {
		rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock"));
		rt.setSv(f, "airlock_glass", 0);
	}
	return f.dot;
}, true, { verb: { name: "Change Airlock Setting", category: "Object", src: 11 } });

// /obj/item/weapon/construction/rcd/proc/rcd_create  (code/game/objects/items/weapons/RCD.dm:304)  may sleep
rt.def("/obj/item/weapon/construction/rcd/proc/rcd_create", function* rcd_create(f: Frame, A: Value, user: Value) {
	let rcd_results: Value = null;
	f.vars = () => [A, user, rcd_results];
	if (!truthy((rcd_results = (yield* g.callName(f, live(A), "rcd_vals", [live(user), live(f.src)]))))) {
		return 0;
	}
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(rt.at(live(rcd_results), "delay"), rt.sv(f, "delay_mod")), "target", live(A)], rt.Args.Named)))) return f.dot;
	if (!truthy((yield* g.srcCall(f, "checkResource", rt.at(live(rcd_results), "cost"), live(user))))) return f.dot;
	if (!truthy((yield* g.callName(f, live(A), "rcd_act", [live(user), live(f.src), rt.at(live(rcd_results), "mode")])))) return f.dot;
	yield* g.srcCall(f, "useResource", rt.at(live(rcd_results), "cost"), live(user));
	yield* g.srcCall(f, "activate");
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/click.ogg"), 50, 1]);
	return 1;
}, true);

// /obj/item/weapon/construction/rcd/proc/New  (code/game/objects/items/weapons/RCD.dm:316)  may sleep
rt.def("/obj/item/weapon/construction/rcd/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("rcd_list", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/weapon/construction/rcd/proc/Destroy  (code/game/objects/items/weapons/RCD.dm:320)  may sleep
rt.def("/obj/item/weapon/construction/rcd/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("rcd_list", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/weapon/construction/rcd/proc/attack_self  (code/game/objects/items/weapons/RCD.dm:324)
rt.def("/obj/item/weapon/construction/rcd/proc/attack_self", function attack_self(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "mode");
	if ($0 === 1) {
		rt.setSv(f, "mode", 2);
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You change RCD's mode to 'Airlock'.</span>"]);
	} else if ($0 === 2) {
		rt.setSv(f, "mode", 3);
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You change RCD's mode to 'Deconstruct'.</span>"]);
	} else if ($0 === 3) {
		rt.setSv(f, "mode", 4);
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You change RCD's mode to 'Grilles & Windows'.</span>"]);
	} else if ($0 === 4) {
		rt.setSv(f, "mode", 1);
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You change RCD's mode to 'Floor & Walls'.</span>"]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/construction/rcd/proc/target_check  (code/game/objects/items/weapons/RCD.dm:340)
rt.def("/obj/item/weapon/construction/rcd/proc/target_check", function target_check(f: Frame, A: Value, user: Value) {
	if ((((((((truthy(rt.call(f, P("/proc/isturf"), null, [live(A)])) && truthy(rt.fv(f, "density", live(A)))) && isEqual(rt.sv(f, "mode"), 3)) || (truthy(rt.call(f, P("/proc/isturf"), null, [live(A)])) && !truthy(rt.fv(f, "density", live(A))))) || (truthy((rt.istype(live(A), T("/obj/machinery/door/airlock")) ? 1 : 0)) && isEqual(rt.sv(f, "mode"), 3))) || truthy((rt.istype(live(A), T("/obj/structure/grille")) ? 1 : 0))) || (truthy((rt.istype(live(A), T("/obj/structure/window")) ? 1 : 0)) && isEqual(rt.sv(f, "mode"), 3))) || truthy((rt.istype(live(A), T("/obj/structure/girder")) ? 1 : 0)))) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
});

// /obj/item/weapon/construction/rcd/proc/afterattack  (code/game/objects/items/weapons/RCD.dm:346)  may sleep
rt.def("/obj/item/weapon/construction/rcd/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	f.vars = () => [A, user, proximity];
	if (!truthy((yield* g.srcCall(f, "prox_check", live(proximity))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "rcd_create", live(A), live(user));
	return f.dot;
}, true);

// /obj/item/weapon/construction/rcd/proc/detonate_pulse  (code/game/objects/items/weapons/RCD.dm:351)  may sleep
rt.def("/obj/item/weapon/construction/rcd/proc/detonate_pulse", function* detonate_pulse(f: Frame) {
	yield* g.srcCall(f, "audible_message", fmt("<span class='danger'><b>＀ begins to vibrate and buzz loudly!</b></span>", [live(f.src)]), fmt("<span class='danger'><b>＀ begins vibrating violently!</b></span>", [live(f.src)]));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/construction/rcd/proc/detonate_pulse_explode")])), 50]);
	return f.dot;
}, true);

// /obj/item/weapon/construction/rcd/proc/detonate_pulse_explode  (code/game/objects/items/weapons/RCD.dm:358)  may sleep
rt.def("/obj/item/weapon/construction/rcd/proc/detonate_pulse_explode", function* detonate_pulse_explode(f: Frame) {
	yield* g.call(f, P("/proc/explosion"), null, [null, live(f.src), null, 0, null, 0, null, 3, null, 1, "flame_range", 1], rt.Args.Named);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(7329, "/obj/item/weapon/construction/rcd/borg", "/obj/item/weapon/construction/rcd", {});

// /obj/item/weapon/construction/rcd/borg/proc/New  (code/game/objects/items/weapons/RCD.dm:363)  may sleep
rt.def("/obj/item/weapon/construction/rcd/borg/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "no_ammo_message", "<span class='warning'>Insufficient charge.</span>");
	rt.setSv(f, "desc", "A device used to rapidly build walls and floors.");
	rt.setSv(f, "canRturf", 1);
	return f.dot;
}, true);

// /obj/item/weapon/construction/rcd/borg/proc/useResource  (code/game/objects/items/weapons/RCD.dm:369)  may sleep
rt.def("/obj/item/weapon/construction/rcd/borg/proc/useResource", function* useResource(f: Frame, amount: Value, user: Value) {
	let borgy: Value = null;
	f.vars = () => [amount, user, borgy];
	if (!truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		return 0;
	}
	if (!truthy(rt.gv(f, "cell", (borgy = live(user))))) {
		if (truthy(live(user))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), rt.sv(f, "no_ammo_message")]);
		}
		return 0;
	}
	f.dot = (yield* g.callName(f, rt.fv(f, "cell", live(borgy)), "use", [multiply(live(amount), 72)]));
	if ((!truthy(live(f.dot)) && truthy(live(user)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), rt.sv(f, "no_ammo_message")]);
	}
	return live(f.dot);
}, true);

// /obj/item/weapon/construction/rcd/borg/proc/checkResource  (code/game/objects/items/weapons/RCD.dm:382)
rt.def("/obj/item/weapon/construction/rcd/borg/proc/checkResource", function checkResource(f: Frame, amount: Value, user: Value) {
	let borgy: Value = null;
	f.vars = () => [borgy];
	if (!truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		return 0;
	}
	if (!truthy(rt.gv(f, "cell", (borgy = live(user))))) {
		if (truthy(live(user))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), rt.sv(f, "no_ammo_message")]);
		}
		return 0;
	}
	f.dot = (rt.ge(rt.gv(f, "charge", rt.fv(f, "cell", live(borgy))), multiply(live(amount), 72)) ? 1 : 0);
	if ((!truthy(live(f.dot)) && truthy(live(user)))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), rt.sv(f, "no_ammo_message")]);
	}
	return live(f.dot);
});

rt.type(7336, "/obj/item/weapon/rcd_ammo", "/obj/item/weapon", {
	ammoamt: 40,
	name: "compressed matter cartridge",
	desc: "Highly compressed matter for the RCD.",
	icon: rt.rsc("icons/obj/ammo.dmi"),
	icon_state: "rcd",
	item_state: "rcdammo",
	origin_tech: "materials=3",
	materials: null,
});

// /obj/item/weapon/rcd_ammo/proc/<init>  (code/game/objects/items/weapons/RCD.dm:409)
rt.def("/obj/item/weapon/rcd_ammo/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 12000, "$glass", 8000]));
	return f.dot;
});

rt.type(7337, "/obj/item/weapon/rcd_ammo/large", "/obj/item/weapon/rcd_ammo", {
	ammoamt: 160,
	origin_tech: "materials=4",
	materials: null,
});

// /obj/item/weapon/rcd_ammo/large/proc/<init>  (code/game/objects/items/weapons/RCD.dm:414)
rt.def("/obj/item/weapon/rcd_ammo/large/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 48000, "$glass", 32000]));
	return f.dot;
});

rt.type(7333, "/obj/item/weapon/construction/rcd/arcd", "/obj/item/weapon/construction/rcd", {
	max_matter: 300,
	matter: 300,
	delay_mod: 0.6,
	ranged: 1,
	name: "advanced rapid-construction-device (ARCD)",
	desc: "A prototype RCD with ranged capability and extended capacity",
	icon_state: "arcd",
	item_state: "rcd",
});

// /obj/item/weapon/construction/rcd/arcd/proc/afterattack  (code/game/objects/items/weapons/RCD.dm:438)  may sleep
rt.def("/obj/item/weapon/construction/rcd/arcd/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value) {
	f.vars = () => [A, user];
	if (!truthy((yield* g.srcCall(f, "range_check", live(A), live(user))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "target_check", live(A), live(user))))) {
		yield* g.callName(f, live(user), "Beam", [null, live(A), "icon_state", "rped_upgrade", "time", 30], rt.Args.Named);
	}
	yield* g.srcCall(f, "rcd_create", live(A), live(user));
	return f.dot;
}, true);

rt.type(7335, "/obj/item/weapon/construction/rld", "/obj/item/weapon/construction", {
	mode: 2,
	wallcost: 10,
	floorcost: 15,
	launchcost: 5,
	deconcost: 10,
	walldelay: 10,
	floordelay: 10,
	decondelay: 15,
	color_choice: null,
	matter: 200,
	max_matter: 200,
	name: "rapid-light-device (RLD)",
	desc: "A device used to rapidly provide lighting sources to an area.",
	icon: rt.rsc("icons/obj/tools.dmi"),
	icon_state: "rld-5",
	actions_types: null,
});

// /obj/item/weapon/construction/rld/proc/<init>  (code/game/objects/items/weapons/RCD.dm:458)
rt.def("/obj/item/weapon/construction/rld/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/pick_color")));
	return f.dot;
});

// /obj/item/weapon/construction/rld/proc/ui_action_click  (code/game/objects/items/weapons/RCD.dm:473)  may sleep
rt.def("/obj/item/weapon/construction/rld/proc/ui_action_click", function* ui_action_click(f: Frame) {
	if (truthy((rt.istype(live(f.args[1]), T("/datum/action/item_action/pick_color")) ? 1 : 0))) {
		rt.setSv(f, "color_choice", (yield* g.op(f, "Prompt", [256], [null, null, "Choose Color", live(f.args[0]), null])));
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user", "A"] });

// /obj/item/weapon/construction/rld/proc/update_icon  (code/game/objects/items/weapons/RCD.dm:479)
rt.def("/obj/item/weapon/construction/rld/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("rld-＀", [rt.call(f, P("/proc/round"), null, [divide(rt.sv(f, "matter"), 35)])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /obj/item/weapon/construction/rld/proc/attack_self  (code/game/objects/items/weapons/RCD.dm:484)
rt.def("/obj/item/weapon/construction/rld/proc/attack_self", function attack_self(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "mode");
	if ($0 === 1) {
		rt.setSv(f, "mode", 2);
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You change RLD's mode to 'Permanent Light Construction'.</span>"]);
	} else if ($0 === 2) {
		rt.setSv(f, "mode", 3);
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You change RLD's mode to 'Light Launcher'.</span>"]);
	} else if ($0 === 3) {
		rt.setSv(f, "mode", 1);
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You change RLD's mode to 'Deconstruct'.</span>"]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/construction/rld/proc/checkdupes  (code/game/objects/items/weapons/RCD.dm:498)
rt.def("/obj/item/weapon/construction/rld/proc/checkdupes", function checkdupes(f: Frame, target: Value) {
	let checking: Value = null, dupe: Value = null;
	let $e: any;
	f.vars = () => [checking, dupe, $e];
	f.dot = rt.list();
	checking = rt.getStep(f, live(target), 0);
	dupe = null;
	rt.forList(f, 0, live(checking), T("/obj/machinery/light"));
	while (($e = rt.next(f, 0)) !== undefined) {
		dupe = $e;
		if (truthy((rt.istype(live(dupe), T("/obj/machinery/light")) ? 1 : 0))) {
			(f.dot = rt.modify(live(f.dot), live(dupe), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/weapon/construction/rld/proc/afterattack  (code/game/objects/items/weapons/RCD.dm:506)  may sleep
rt.def("/obj/item/weapon/construction/rld/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value) {
	let start: Value = null, W: Value = null, candidates: Value = null, winner: Value = null, winning_dist: Value = null, direction: Value = null, C: Value = null, dupes: Value = null, O: Value = null, x0: Value = null, y0: Value = null, contender: Value = null, light: Value = null, align: Value = null, L: Value = null, F: Value = null, destination: Value = null, FL: Value = null, G: Value = null;
	let $0: any, $e: any;
	f.vars = () => [A, user, start, W, candidates, winner, winning_dist, direction, C, dupes, O, x0, y0, contender, light, align, L, F, destination, FL, G, $0, $e];
	if (!truthy((yield* g.srcCall(f, "range_check", live(A), live(user))))) {
		return live(f.dot);
	}
	start = rt.getStep(f, live(f.src), 0);
	$0 = rt.sv(f, "mode");
	if ($0 === 1) {
		if (truthy((rt.istype(live(A), T("/obj/machinery/light")) ? 1 : 0))) {
			if (truthy((yield* g.srcCall(f, "checkResource", rt.sv(f, "deconcost"), live(user))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You start deconstructing ＀...</span>", [live(A)])]);
				yield* g.callName(f, live(user), "Beam", [null, live(A), "icon_state", "nzcrentrs_power", "time", 15], rt.Args.Named);
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/click.ogg"), 50, 1]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, rt.sv(f, "decondelay"), "target", live(A)], rt.Args.Named)))) {
					if (!truthy((yield* g.srcCall(f, "useResource", rt.sv(f, "deconcost"), live(user))))) {
						return 0;
					}
					yield* g.srcCall(f, "activate");
					yield* g.call(f, P("/proc/qdel"), null, [live(A)]);
					return 1;
				}
			}
			return 0;
		}
	} else if ($0 === 2) {
		if (truthy((rt.istype(live(A), T("/turf/closed/wall")) ? 1 : 0))) {
			W = live(A);
			if (truthy((yield* g.srcCall(f, "checkResource", rt.sv(f, "floorcost"), live(user))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You start building a wall light...</span>"]);
				yield* g.callName(f, live(user), "Beam", [null, live(A), "icon_state", "nzcrentrs_power", "time", 15], rt.Args.Named);
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/click.ogg"), 50, 1]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/light_flicker.ogg"), 50, 0]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, rt.sv(f, "floordelay"), "target", live(A)], rt.Args.Named)))) {
					if (!truthy((rt.istype(live(W), T("/turf/closed/wall")) ? 1 : 0))) {
						return 0;
					}
					candidates = rt.list();
					winner = null;
					winning_dist = null;
					direction = null;
					rt.forList(f, 0, rt.gl("cardinal"));
					while (($e = rt.next(f, 0)) !== undefined) {
						direction = $e;
						C = rt.getStep(f, live(W), live(direction));
						dupes = (yield* g.srcCall(f, "checkdupes", live(C)));
						if ((truthy((yield* g.callName(f, live(start), "CanAtmosPass", [live(C)]))) && !truthy(rt.len(f, live(dupes))))) {
							candidates = rt.modify(live(candidates), live(C), add);
						}
					}
					rt.endFor(f, 0);
					if (!truthy(rt.len(f, live(candidates)))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Valid target not found...</span>"]);
						yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/misc/compiler-failure.ogg"), 30, 1]);
						return 0;
					}
					O = null;
					rt.forList(f, 0, live(candidates), T("/turf/open"));
					while (($e = rt.next(f, 0)) !== undefined) {
						O = $e;
						if (truthy((rt.istype(live(O), T("/turf/open")) ? 1 : 0))) {
							x0 = rt.fv(f, "x", live(O));
							y0 = rt.fv(f, "y", live(O));
							contender = (yield* g.call(f, P("/proc/cheap_hypotenuse"), null, [rt.fv(f, "x", live(start)), rt.fv(f, "y", live(start)), live(x0), live(y0)]));
							if (!truthy(live(winner))) {
								winner = live(O);
								winning_dist = live(contender);
							} else {
								if (rt.lt(live(contender), live(winning_dist))) {
									winner = live(O);
									winning_dist = live(contender);
								}
							}
						}
					}
					rt.endFor(f, 0);
					yield* g.srcCall(f, "activate");
					if (!truthy((yield* g.srcCall(f, "useResource", rt.sv(f, "wallcost"), live(user))))) {
						return 0;
					}
					light = rt.getStep(f, live(winner), 0);
					align = rt.getDir(f, live(winner), live(A));
					rt.setFv(f, "dir", (L = (yield* g.new_(f, T("/obj/machinery/light"), [live(light)]))), live(align));
					rt.setFv(f, "color", live(L), rt.sv(f, "color_choice"));
					rt.setFv(f, "light_color", live(L), rt.fv(f, "color", live(L)));
					return 1;
				}
			}
			return 0;
		}
		if (truthy((rt.istype(live(A), T("/turf/open/floor")) ? 1 : 0))) {
			F = live(A);
			if (truthy((yield* g.srcCall(f, "checkResource", rt.sv(f, "floorcost"), live(user))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You start building a floor light...</span>"]);
				yield* g.callName(f, live(user), "Beam", [null, live(A), "icon_state", "nzcrentrs_power", "time", 15], rt.Args.Named);
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/click.ogg"), 50, 1]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/light_flicker.ogg"), 50, 1]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, rt.sv(f, "floordelay"), "target", live(A)], rt.Args.Named)))) {
					if (!truthy((rt.istype(live(F), T("/turf/open/floor")) ? 1 : 0))) {
						return 0;
					}
					if (!truthy((yield* g.srcCall(f, "useResource", rt.sv(f, "floorcost"), live(user))))) {
						return 0;
					}
					yield* g.srcCall(f, "activate");
					destination = rt.getStep(f, live(A), 0);
					rt.setFv(f, "color", (FL = (yield* g.new_(f, T("/obj/machinery/light/floor"), [live(destination)]))), rt.sv(f, "color_choice"));
					rt.setFv(f, "light_color", live(FL), rt.fv(f, "color", live(FL)));
					return 1;
				}
			}
			return 0;
		}
	} else if ($0 === 3) {
		if (truthy((yield* g.srcCall(f, "useResource", rt.sv(f, "launchcost"), live(user))))) {
			yield* g.srcCall(f, "activate");
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You fire a glowstick!</span>"]);
			rt.setFv(f, "color", (G = (yield* g.new_(f, T("/obj/item/device/flashlight/glowstick"), [live(start)]))), rt.sv(f, "color_choice"));
			rt.setFv(f, "light_color", live(G), rt.fv(f, "color", live(G)));
			yield* g.callName(f, live(G), "throw_at", [live(A), 9, 3, live(user)]);
			rt.setFv(f, "on", live(G), 1);
			yield* g.callName(f, live(G), "update_brightness", []);
			return 1;
		}
		return 0;
	}
	return f.dot;
}, true);
