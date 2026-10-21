// From code/game/gamemodes/gang/recaller.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9144, "/obj/item/device/gangtool", "/obj/item/device", {
	gang: null,
	recalling: 0,
	outfits: 2,
	free_pen: 0,
	promotable: 0,
	tags: null,
	throw_speed: 3,
	throw_range: 7,
	flags: 64,
	name: "suspicious device",
	desc: "A strange device of sorts. Hard to really make out what it actually does if you don't know how to operate it.",
	icon_state: "gangtool-white",
	item_state: "walkietalkie",
	throwforce: 0,
	w_class: 1,
	origin_tech: "programming=5;bluespace=2;syndicate=5",
});

// /obj/item/device/gangtool/proc/<init>  (code/game/gamemodes/gang/recaller.dm:18)
rt.def("/obj/item/device/gangtool/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tags", rt.list());
	return f.dot;
});

// /obj/item/device/gangtool/proc/Initialize  (code/game/gamemodes/gang/recaller.dm:21)  may sleep
rt.def("/obj/item/device/gangtool/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.gv(f, "gang_points", rt.fv(f, "mode", rt.gl("SSticker"))))) return f.dot;
	rt.setFv(f, "gang_points", rt.fv(f, "mode", rt.gl("SSticker")), (yield* g.new_(f, T("/datum/gang_points"), [rt.fv(f, "mode", rt.gl("SSticker"))])));
	return f.dot;
}, true);

// /obj/item/device/gangtool/proc/attack_self  (code/game/gamemodes/gang/recaller.dm:26)  may sleep
rt.def("/obj/item/device/gangtool/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let dat: Value = null, isboss: Value = null, cat: Value = null, V: Value = null, G: Value = null, cost: Value = null, toAdd: Value = null, extra: Value = null, popup: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [user, dat, isboss, cat, V, G, cost, toAdd, extra, popup, $0, $1, $e];
	if (!truthy((yield* g.srcCall(f, "can_use", live(user))))) {
		return live(f.dot);
	}
	dat = null;
	if (!truthy(rt.sv(f, "gang"))) {
		dat = rt.modify(live(dat), "This device is not registered.<br><br>", add);
		if (truthy((rt.isIn(f, rt.fv(f, "mind", live(user)), (yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "get_gang_bosses", []))) ? 1 : 0))) {
			if ((truthy(rt.sv(f, "promotable")) && rt.lt(rt.getLen(f, rt.gv(f, "bosses", rt.gv(f, "gang_datum", rt.fv(f, "mind", live(user))))), 3))) {
				dat = rt.modify(live(dat), "Give this device to another member of your organization to use to promote them to Lieutenant.<br><br>", add);
				dat = rt.modify(live(dat), "If this is meant as a spare device for yourself:<br>", add);
			}
			dat = rt.modify(live(dat), fmt("<a href='?src=＃;register=1'>Register Device as Spare</a><br>", [live(f.src)]), add);
		} else {
			if (truthy(rt.sv(f, "promotable"))) {
				if (rt.lt(rt.getLen(f, rt.gv(f, "bosses", rt.gv(f, "gang_datum", rt.fv(f, "mind", live(user))))), 3)) {
					dat = rt.modify(live(dat), "You have been selected for a promotion!<br>", add);
					dat = rt.modify(live(dat), fmt("<a href='?src=＃;register=1'>Accept Promotion</a><br>", [live(f.src)]), add);
				} else {
					dat = rt.modify(live(dat), "No promotions available: All positions filled.<br>", add);
				}
			} else {
				dat = rt.modify(live(dat), "This device is not authorized to promote.<br>", add);
			}
		}
	} else {
		if (truthy(rt.fv(f, "is_dominating", rt.sv(f, "gang")))) {
			dat = rt.modify(live(dat), fmt("<center><font color='red'>Takeover In Progress:<br><B>＀ seconds remain</B></font></center>", [(yield* g.callName(f, rt.sv(f, "gang"), "domination_time_remaining", []))]), add);
		}
		isboss = (isEqual(rt.fv(f, "mind", live(user)), rt.index(rt.fv(f, "bosses", rt.sv(f, "gang")), 1)) ? 1 : 0);
		$0 = rt.fv(f, "name", rt.sv(f, "gang"));
		if (truthy(live(isboss))) {
			$0 = $0;
			$1 = "Boss";
		} else {
			$1 = "Lieutenant";
		}
		dat = rt.modify(live(dat), fmt("Registration: <B>＀ Gang ＀</B><br>", [$0, $1]), add);
		dat = rt.modify(live(dat), fmt("Organization Size: <B>＀</B> | Station Control: <B>＀%</B><br>", [add(rt.getLen(f, rt.fv(f, "gangsters", rt.sv(f, "gang"))), rt.getLen(f, rt.fv(f, "bosses", rt.sv(f, "gang")))), (yield* g.call(f, P("/proc/round"), null, [multiply(divide(rt.getLen(f, rt.fv(f, "territory", rt.sv(f, "gang"))), rt.fv(f, "num_territories", rt.gl("start_state"))), 100), 1]))]), add);
		dat = rt.modify(live(dat), fmt("Your Influence: <B>＀</B><br>", [(yield* g.callName(f, rt.sv(f, "gang"), "get_influence", [rt.fv(f, "mind", live(user))]))]), add);
		dat = rt.modify(live(dat), fmt("Time until Influence grows: <B>＀</B><br>", [(yield* g.call(f, P("/proc/time2text"), null, [subtract(rt.gv(f, "next_point_time", rt.gv(f, "gang_points", rt.fv(f, "mode", rt.gl("SSticker")))), rt.worldTime(f)), "mm:ss"]))]), add);
		dat = rt.modify(live(dat), "<hr>", add);
		cat = null;
		rt.forList(f, 0, rt.fv(f, "boss_category_list", rt.sv(f, "gang")));
		while (($e = rt.next(f, 0)) !== undefined) {
			cat = $e;
			dat = rt.modify(live(dat), fmt("<b>＀</b><br>", [live(cat)]), add);
			V = null;
			rt.forList(f, 1, rt.index(rt.fv(f, "boss_category_list", rt.sv(f, "gang")), live(cat)));
			while (($e = rt.next(f, 1)) !== undefined) {
				V = $e;
				if (!truthy((yield* g.callName(f, (G = live(V)), "can_see", [live(user), rt.sv(f, "gang"), live(f.src)])))) {
					continue;
				}
				if (truthy((cost = (yield* g.callName(f, live(G), "get_cost_display", [live(user), rt.sv(f, "gang"), live(f.src)]))))) {
					dat = rt.modify(live(dat), add(live(cost), " "), add);
				}
				toAdd = (yield* g.callName(f, live(G), "get_name_display", [live(user), rt.sv(f, "gang"), live(f.src)]));
				if (truthy((yield* g.callName(f, live(G), "can_buy", [live(user), rt.sv(f, "gang"), live(f.src)])))) {
					toAdd = fmt("<a href='?src=＃;purchase=＀'>＀</a>", [live(f.src), rt.fv(f, "id", live(G)), live(toAdd)]);
				}
				dat = rt.modify(live(dat), live(toAdd), add);
				if (truthy((extra = (yield* g.callName(f, live(G), "get_extra_info", [live(user), rt.sv(f, "gang"), live(f.src)]))))) {
					dat = rt.modify(live(dat), fmt("<br><i>＀</i>", [live(extra)]), add);
				}
				dat = rt.modify(live(dat), "<br>", add);
			}
			rt.endFor(f, 1);
			dat = rt.modify(live(dat), "<br>", add);
		}
		rt.endFor(f, 0);
	}
	dat = rt.modify(live(dat), fmt("<a href='?src=＃;choice=refresh'>Refresh</a><br>", [live(f.src)]), add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "gangtool", "Welcome to GangTool v3.5", 340, 625]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/item/device/gangtool/proc/Topic  (code/game/gamemodes/gang/recaller.dm:87)  may sleep
rt.def("/obj/item/device/gangtool/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let G: Value = null;
	f.vars = () => [href, href_list, G];
	if (!truthy((yield* g.srcCall(f, "can_use", live(f.usr))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	if (truthy(rt.at(live(href_list), "register"))) {
		yield* g.srcCall(f, "register_device", live(f.usr));
	} else {
		if (!truthy(rt.sv(f, "gang"))) {
			return live(f.dot);
		}
	}
	if (truthy(rt.at(live(href_list), "purchase"))) {
		if ((truthy((G = rt.index(rt.fv(f, "boss_item_list", rt.sv(f, "gang")), rt.at(live(href_list), "purchase")))) && truthy((yield* g.callName(f, live(G), "can_buy", [live(f.usr), rt.sv(f, "gang"), live(f.src)]))))) {
			yield* g.callName(f, live(G), "purchase", [live(f.usr), rt.sv(f, "gang"), live(f.src), 0]);
		}
	}
	yield* g.srcCall(f, "attack_self", live(f.usr));
	return f.dot;
}, true);

// /obj/item/device/gangtool/proc/ping_gang  (code/game/gamemodes/gang/recaller.dm:107)  may sleep
rt.def("/obj/item/device/gangtool/proc/ping_gang", function* ping_gang(f: Frame, user: Value) {
	let message: Value = null, members: Value = null, gang_rank: Value = null, ping: Value = null, ganger: Value = null, M: Value = null, link: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, message, members, gang_rank, ping, ganger, M, link, $0, $e];
	if (!truthy(live(user))) {
		return live(f.dot);
	}
	if ((!truthy((message = (yield* g.call(f, P("/proc/stripped_input"), null, [live(user), "Discreetly send a gang-wide message.", "Send Message"])))) || !truthy((yield* g.srcCall(f, "can_use", live(user)))))) {
		return live(f.dot);
	}
	if (rt.gt(rt.fv(f, "z", live(user)), 2)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'>＀Error: Station out of range.</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)]))])]);
		return live(f.dot);
	}
	members = rt.list();
	members = rt.modify(live(members), rt.fv(f, "gangsters", rt.sv(f, "gang")), add);
	if (!truthy(rt.getLen(f, (members = rt.modify(live(members), rt.fv(f, "bosses", rt.sv(f, "gang")), add))))) return f.dot;
	$0 = (gang_rank = (yield* g.callName(f, rt.fv(f, "bosses", rt.sv(f, "gang")), "Find", [rt.fv(f, "mind", live(user))])));
	if ($0 === 1) {
		gang_rank = "Gang Boss";
	} else if ($0 === 2) {
		gang_rank = "1st Lieutenant";
	} else if ($0 === 3) {
		gang_rank = "2nd Lieutenant";
	} else if ($0 === 4) {
		gang_rank = "3rd Lieutenant";
	} else {
		gang_rank = fmt("＀th Lieutenant", [subtract(live(gang_rank), 1)]);
	}
	ping = fmt("<span class='danger'><B><i>＀ ＀</i>: ＀</B></span>", [rt.fv(f, "name", rt.sv(f, "gang")), live(gang_rank), live(message)]);
	ganger = null;
	rt.forList(f, 0, live(members), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ganger = $e;
		if (((truthy(rt.fv(f, "current", live(ganger))) && rt.le(rt.gv(f, "z", rt.fv(f, "current", live(ganger))), 2)) && isEqual(rt.gv(f, "stat", rt.fv(f, "current", live(ganger))), 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(ganger)), live(ping)]);
		}
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, rt.gl("dead_mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(M), live(user)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("＀ ＀", [live(link), live(ping)])]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ Messaged ＀ Gang: ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), rt.fv(f, "name", rt.sv(f, "gang")), live(message)])]);
	return f.dot;
}, true);

// /obj/item/device/gangtool/proc/register_device  (code/game/gamemodes/gang/recaller.dm:144)  may sleep
rt.def("/obj/item/device/gangtool/proc/register_device", function* register_device(f: Frame, user: Value) {
	let cached_influence: Value = null;
	f.vars = () => [user, cached_influence];
	if (truthy(rt.sv(f, "gang"))) {
		return live(f.dot);
	}
	if (((truthy(rt.sv(f, "promotable")) && truthy((rt.isIn(f, rt.fv(f, "mind", live(user)), (yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "get_gangsters", []))) ? 1 : 0))) || truthy((rt.isIn(f, rt.fv(f, "mind", live(user)), (yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "get_gang_bosses", []))) ? 1 : 0)))) {
		rt.setSv(f, "gang", rt.gv(f, "gang_datum", rt.fv(f, "mind", live(user))));
		rt.modField(f, rt.sv(f, "gang"), "gangtools", live(f.src), add);
		rt.setSv(f, "icon_state", fmt("gangtool-＀", [rt.fv(f, "color", rt.sv(f, "gang"))]));
		if (!truthy((rt.isIn(f, rt.fv(f, "mind", live(user)), rt.fv(f, "bosses", rt.sv(f, "gang"))) ? 1 : 0))) {
			cached_influence = rt.index(rt.fv(f, "gangsters", rt.sv(f, "gang")), rt.fv(f, "mind", live(user)));
			yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "remove_gangster", [rt.fv(f, "mind", live(user)), 0, 2]);
			rt.setAt(rt.fv(f, "bosses", rt.sv(f, "gang")), rt.fv(f, "mind", live(user)), live(cached_influence));
			rt.setFv(f, "gang_datum", rt.fv(f, "mind", live(user)), rt.sv(f, "gang"));
			rt.setFv(f, "special_role", rt.fv(f, "mind", live(user)), fmt("＀ Gang Lieutenant", [rt.fv(f, "name", rt.sv(f, "gang"))]));
			yield* g.callName(f, rt.sv(f, "gang"), "add_gang_hud", [rt.fv(f, "mind", live(user))]);
			yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has been promoted to Lieutenant in the ＀ Gang", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), rt.fv(f, "name", rt.sv(f, "gang"))])]);
			rt.setSv(f, "free_pen", 1);
			yield* g.callName(f, rt.sv(f, "gang"), "message_gangtools", [fmt("＀ has been promoted to Lieutenant.", [live(user)])]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<FONT size=3 color=red><B>You have been promoted to Lieutenant!</B></FONT>"]);
			yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "forge_gang_objectives", [rt.fv(f, "mind", live(user))]);
			yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "greet_gang", [rt.fv(f, "mind", live(user)), 0]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "The <b>Gangtool</b> you registered will allow you to purchase weapons and equipment, and send messages to your gang."]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Unlike regular gangsters, you may use <b>recruitment pens</b> to add recruits to your gang. Use them on unsuspecting crew members to recruit them. Don't forget to get your one free pen from the gangtool."]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>ACCESS DENIED: Unauthorized user.</span>"]);
	}
	return f.dot;
}, true);

// /obj/item/device/gangtool/proc/recall  (code/game/gamemodes/gang/recaller.dm:167)  may sleep
rt.def("/obj/item/device/gangtool/proc/recall", function* recall(f: Frame, user: Value) {
	let userturf: Value = null, end_state: Value = null;
	f.vars = () => [user, userturf, end_state];
	if (!truthy((yield* g.srcCall(f, "can_use", live(user))))) {
		return 0;
	}
	if (truthy(rt.fv(f, "emergencyNoRecall", rt.gl("SSshuttle")))) {
		return 0;
	}
	if (truthy(rt.sv(f, "recalling"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Error: Recall already in progress.</span>"]);
		return 0;
	}
	if (!truthy(rt.fv(f, "recalls", rt.sv(f, "gang")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Error: Unable to access communication arrays. Firewall has logged our signature and is blocking all further attempts.</span>"]);
	}
	yield* g.callName(f, rt.sv(f, "gang"), "message_gangtools", [fmt("＀ is attempting to recall the emergency shuttle.", [live(f.usr)])]);
	rt.setSv(f, "recalling", 1);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "loc"), fmt("<span class='info'>＀Generating shuttle recall order with codes retrieved from last call signal...</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)]))])]);
	yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [100, 300]))]);
	if (!isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "call")) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀Emergency shuttle cannot be recalled at this time.</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)]))])]);
		rt.setSv(f, "recalling", 0);
		return 0;
	}
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "loc"), fmt("<span class='info'>＀Shuttle recall order generated. Accessing station long-range communication arrays...</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)]))])]);
	yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [100, 300]))]);
	if (!truthy(rt.fv(f, "dom_attempts", rt.sv(f, "gang")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀Error: Unable to access communication arrays. Firewall has logged our signature and is blocking all further attempts.</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)]))])]);
		rt.setSv(f, "recalling", 0);
		return 0;
	}
	if (!isEqual(rt.gv(f, "z", (userturf = rt.getStep(f, live(user), 0))), 2)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀Error: Device out of range of station communication arrays.</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)]))])]);
		rt.setSv(f, "recalling", 0);
		return 0;
	}
	yield* g.callName(f, (end_state = (yield* g.new_(f, T("/datum/station_state"), []))), "count", []);
	if (rt.lt(multiply(100, (yield* g.callName(f, rt.gl("start_state"), "score", [live(end_state)]))), 80)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀Error: Station communication systems compromised. Unable to establish connection.</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)]))])]);
		rt.setSv(f, "recalling", 0);
		return 0;
	}
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "loc"), fmt("<span class='info'>＀Comm arrays accessed. Broadcasting recall signal...</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)]))])]);
	yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [100, 300]))]);
	rt.setSv(f, "recalling", 0);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has tried to recall the shuttle with a gangtool.", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)]))])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has tried to recall the shuttle with a gangtool.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)]))]), 1]);
	if (isEqual(rt.gv(f, "z", (userturf = rt.getStep(f, live(user), 0))), 2)) {
		if (truthy((yield* g.callName(f, rt.gl("SSshuttle"), "cancelEvac", [live(user)])))) {
			(rt.modField(f, rt.sv(f, "gang"), "recalls", 1, subtract));
			return 1;
		}
	}
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "loc"), fmt("<span class='info'>＀No response recieved. Emergency shuttle cannot be recalled at this time.</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)]))])]);
	return 0;
}, true);

// /obj/item/device/gangtool/proc/can_use  (code/game/gamemodes/gang/recaller.dm:227)
rt.def("/obj/item/device/gangtool/proc/can_use", function can_use(f: Frame, user: Value) {
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return 0;
	}
	if (truthy(rt.callName(f, live(user), "incapacitated", []))) {
		return 0;
	}
	if (!truthy((rt.isIn(f, live(f.src), rt.fv(f, "contents", live(user))) ? 1 : 0))) {
		return 0;
	}
	if (!truthy(rt.fv(f, "mind", live(user)))) {
		return 0;
	}
	if ((truthy(rt.sv(f, "gang")) && truthy((rt.isIn(f, rt.fv(f, "mind", live(user)), rt.fv(f, "bosses", rt.sv(f, "gang"))) ? 1 : 0)))) {
		return 1;
	} else {
		if (truthy((rt.isIn(f, rt.fv(f, "mind", live(user)), rt.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "get_all_gangsters", [])) ? 1 : 0))) {
			return 1;
		}
	}
	return 0;
});

rt.type(9147, "/obj/item/device/gangtool/soldier", "/obj/item/device/gangtool", {});

// /obj/item/device/gangtool/soldier/proc/New  (code/game/gamemodes/gang/recaller.dm:250)  may sleep
rt.def("/obj/item/device/gangtool/soldier/proc/New", function* New(f: Frame) {
	let GT: Value = null;
	f.vars = () => [GT];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "gang", rt.gv(f, "gang_datum", rt.fv(f, "mind", live(f.args[0]))));
	rt.modField(f, rt.sv(f, "gang"), "gangtools", live(f.src), add);
	yield* g.callName(f, (GT = (yield* g.new_(f, T("/datum/action/innate/gang/tool"), []))), "Grant", [live(f.args[0]), live(f.src), rt.sv(f, "gang")]);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/device/gangtool/soldier/proc/attack_self  (code/game/gamemodes/gang/recaller.dm:257)  may sleep
rt.def("/obj/item/device/gangtool/soldier/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let dat: Value = null, _T: Value = null, cat: Value = null, V: Value = null, G: Value = null, cost: Value = null, toAdd: Value = null, extra: Value = null, popup: Value = null;
	let $e: any;
	f.vars = () => [user, dat, _T, cat, V, G, cost, toAdd, extra, popup, $e];
	if (!truthy((yield* g.srcCall(f, "can_use", live(user))))) {
		return live(f.dot);
	}
	dat = null;
	if (truthy(rt.fv(f, "is_dominating", rt.sv(f, "gang")))) {
		dat = rt.modify(live(dat), fmt("<center><font color='red'>Takeover In Progress:<br><B>＀ seconds remain</B></font></center>", [(yield* g.callName(f, rt.sv(f, "gang"), "domination_time_remaining", []))]), add);
	}
	dat = rt.modify(live(dat), fmt("Registration: <B>＀ - Foot Soldier</B><br>", [rt.fv(f, "name", rt.sv(f, "gang"))]), add);
	dat = rt.modify(live(dat), fmt("Organization Size: <B>＀</B> | Station Control: <B>＀%</B><br>", [add(rt.getLen(f, rt.fv(f, "gangsters", rt.sv(f, "gang"))), rt.getLen(f, rt.fv(f, "bosses", rt.sv(f, "gang")))), (yield* g.call(f, P("/proc/round"), null, [multiply(divide(rt.getLen(f, rt.fv(f, "territory", rt.sv(f, "gang"))), rt.fv(f, "num_territories", rt.gl("start_state"))), 100), 1]))]), add);
	dat = rt.modify(live(dat), fmt("Your Influence: <B>＀</B><br>", [(yield* g.callName(f, rt.sv(f, "gang"), "get_influence", [rt.fv(f, "mind", live(user))]))]), add);
	if (truthy(rt.length(rt.sv(f, "tags")))) {
		dat = rt.modify(live(dat), "Your tags generate bonus influence for you.<br> You have tagged the following territories:", add);
		_T = null;
		rt.forList(f, 0, rt.sv(f, "tags"), T("/obj/effect/decal/cleanable/crayon/gang"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			dat = rt.modify(live(dat), fmt(" ＀ -", [rt.fv(f, "territory", live(_T))]), add);
		}
		rt.endFor(f, 0);
	} else {
		dat = rt.modify(live(dat), "You have not personally tagged any territory for your gang. Use a spray can to mark your territory and receive bonus influence.", add);
	}
	dat = rt.modify(live(dat), fmt("<br>Time until Influence grows: <B>＀</B><br>", [(yield* g.call(f, P("/proc/time2text"), null, [subtract(rt.gv(f, "next_point_time", rt.gv(f, "gang_points", rt.fv(f, "mode", rt.gl("SSticker")))), rt.worldTime(f)), "mm:ss"]))]), add);
	dat = rt.modify(live(dat), "<hr>", add);
	cat = null;
	rt.forList(f, 0, rt.fv(f, "reg_category_list", rt.sv(f, "gang")));
	while (($e = rt.next(f, 0)) !== undefined) {
		cat = $e;
		dat = rt.modify(live(dat), fmt("<b>＀</b><br>", [live(cat)]), add);
		V = null;
		rt.forList(f, 1, rt.index(rt.fv(f, "reg_category_list", rt.sv(f, "gang")), live(cat)));
		while (($e = rt.next(f, 1)) !== undefined) {
			V = $e;
			if (!truthy((yield* g.callName(f, (G = live(V)), "can_see", [live(user), rt.sv(f, "gang"), live(f.src)])))) {
				continue;
			}
			if (truthy((cost = (yield* g.callName(f, live(G), "get_cost_display", [live(user), rt.sv(f, "gang"), live(f.src)]))))) {
				dat = rt.modify(live(dat), add(live(cost), " "), add);
			}
			toAdd = (yield* g.callName(f, live(G), "get_name_display", [live(user), rt.sv(f, "gang"), live(f.src)]));
			if (truthy((yield* g.callName(f, live(G), "can_buy", [live(user), rt.sv(f, "gang"), live(f.src)])))) {
				toAdd = fmt("<a href='?src=＃;purchase=＀'>＀</a>", [live(f.src), rt.fv(f, "id", live(G)), live(toAdd)]);
			}
			dat = rt.modify(live(dat), live(toAdd), add);
			if (truthy((extra = (yield* g.callName(f, live(G), "get_extra_info", [live(user), rt.sv(f, "gang"), live(f.src)]))))) {
				dat = rt.modify(live(dat), fmt("<br><i>＀</i>", [live(extra)]), add);
			}
			dat = rt.modify(live(dat), "<br>", add);
		}
		rt.endFor(f, 1);
		dat = rt.modify(live(dat), "<br>", add);
	}
	rt.endFor(f, 0);
	dat = rt.modify(live(dat), fmt("<a href='?src=＃;choice=refresh'>Refresh</a><br>", [live(f.src)]), add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "gangtool", "Welcome to GangTool v3.5", 340, 625]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/item/device/gangtool/soldier/proc/Topic  (code/game/gamemodes/gang/recaller.dm:301)  may sleep
rt.def("/obj/item/device/gangtool/soldier/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let G: Value = null;
	f.vars = () => [href, href_list, G];
	if (!truthy((yield* g.srcCall(f, "can_use", live(f.usr))))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(href_list), "purchase"))) {
		if ((truthy((G = rt.index(rt.fv(f, "reg_item_list", rt.sv(f, "gang")), rt.at(live(href_list), "purchase")))) && truthy((yield* g.callName(f, live(G), "can_buy", [live(f.usr), rt.sv(f, "gang"), live(f.src)]))))) {
			yield* g.callName(f, live(G), "purchase", [live(f.usr), rt.sv(f, "gang"), live(f.src), 0]);
		}
	}
	yield* g.srcCall(f, "attack_self", live(f.usr));
	return f.dot;
}, true);

rt.type(100, "/datum/action/innate/gang", "/datum/action/innate", {
	background_icon_state: "bg_spell",
});

// /datum/action/innate/gang/proc/IsAvailable  (code/game/gamemodes/gang/recaller.dm:314)
rt.def("/datum/action/innate/gang/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (truthy((rt.isIn(f, ((!truthy(rt.fv(f, "mind", rt.sv(f, "owner"))) ? 1 : 0) || (!truthy(rt.fv(f, "mind", rt.sv(f, "owner"))) ? 1 : 0)), rt.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "get_all_gangsters", [])) ? 1 : 0))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

rt.type(101, "/datum/action/innate/gang/tool", "/datum/action/innate/gang", {
	GT: null,
	name: "Personal Gang Tool",
	desc: "An implanted gang tool that lets you purchase gear",
	background_icon_state: "bg_mime",
	button_icon_state: "bolt_action",
});

// /datum/action/innate/gang/tool/proc/Grant  (code/game/gamemodes/gang/recaller.dm:326)  may sleep
rt.def("/datum/action/innate/gang/tool/proc/Grant", function* Grant(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "GT", live(f.args[1]));
	rt.setFv(f, "color", rt.sv(f, "button"), rt.fv(f, "color", live(f.args[2])));
	return f.dot;
}, true, { args: ["user", "reg", "G"] });

// /datum/action/innate/gang/tool/proc/Activate  (code/game/gamemodes/gang/recaller.dm:331)  may sleep
rt.def("/datum/action/innate/gang/tool/proc/Activate", function* Activate(f: Frame) {
	yield* g.callName(f, rt.sv(f, "GT"), "attack_self", [rt.sv(f, "owner")]);
	return f.dot;
}, true);
