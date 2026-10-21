// From code/game/gamemodes/gang/gang_datum.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1247, "/datum/gang", "/datum", {
	name: "ERROR",
	color: "white",
	color_hex: "#FFFFFF",
	gangsters: null,
	bosses: null,
	gangtools: null,
	tags_by_mind: null,
	style: null,
	fighting_style: "normal",
	territory: null,
	territory_new: null,
	territory_lost: null,
	recalls: 1,
	dom_attempts: 2,
	inner_outfit: null,
	outer_outfit: null,
	ganghud: null,
	is_deconvertible: 1,
	domination_timer: null,
	is_dominating: null,
	boss_item_list: null,
	boss_category_list: null,
	reg_item_list: null,
	reg_category_list: null,
}, { global: { boss_items: 956, soldier_items: 957 } });

// /datum/gang/proc/<init>  (code/game/gamemodes/gang/gang_datum.dm:8)
rt.def("/datum/gang/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "gangsters", rt.list());
	$0 = $0;
	rt.setSv(f, "bosses", rt.list());
	$0 = $0;
	rt.setSv(f, "gangtools", rt.list());
	$0 = $0;
	rt.setSv(f, "tags_by_mind", rt.list());
	$0 = $0;
	rt.setSv(f, "territory", rt.list());
	$0 = $0;
	rt.setSv(f, "territory_new", rt.list());
	$0 = $0;
	rt.setSv(f, "territory_lost", rt.list());
	return f.dot;
});

// /datum/gang/proc/New  (code/game/gamemodes/gang/gang_datum.dm:103)  may sleep
rt.def("/datum/gang/proc/New", function* New(f: Frame, loc: Value, gangname: Value) {
	let $0: any;
	f.vars = () => [loc, gangname, $0];
	if (!truthy(rt.len(f, rt.gl("gang_colors_pool")))) {
		yield* g.call(f, P("/proc/message_admins"), null, ["WARNING: Maximum number of gangs have been exceeded!"]);
		rt.throw_(f, (yield* g.new_(f, T("/exception"), ["Maximum number of gangs has been exceeded", "code/game/gamemodes/gang/gang_datum.dm", 105])));
		return live(f.dot);
	} else {
		rt.setSv(f, "color", rt.op(f, "PickUnweighted", [1], [rt.gl("gang_colors_pool")]));
		(rt.modGl("gang_colors_pool", rt.sv(f, "color"), subtract));
		$0 = rt.sv(f, "color");
		if ($0 === "red") {
			rt.setSv(f, "color_hex", "#DA0000");
			rt.setSv(f, "inner_outfit", rt.op(f, "PickUnweighted", [2], [T("/obj/item/clothing/under/color/red"), T("/obj/item/clothing/under/lawyer/red")]));
		} else if ($0 === "orange") {
			rt.setSv(f, "color_hex", "#FF9300");
			rt.setSv(f, "inner_outfit", rt.op(f, "PickUnweighted", [2], [T("/obj/item/clothing/under/color/orange"), T("/obj/item/clothing/under/geisha")]));
		} else if ($0 === "yellow") {
			rt.setSv(f, "color_hex", "#FFF200");
			rt.setSv(f, "inner_outfit", rt.op(f, "PickUnweighted", [3], [T("/obj/item/clothing/under/color/yellow"), T("/obj/item/clothing/under/burial"), T("/obj/item/clothing/under/suit_jacket/tan")]));
		} else if ($0 === "green") {
			rt.setSv(f, "color_hex", "#A8E61D");
			rt.setSv(f, "inner_outfit", rt.op(f, "PickUnweighted", [3], [T("/obj/item/clothing/under/color/green"), T("/obj/item/clothing/under/syndicate/camo"), T("/obj/item/clothing/under/suit_jacket/green")]));
		} else if ($0 === "blue") {
			rt.setSv(f, "color_hex", "#00B7EF");
			rt.setSv(f, "inner_outfit", rt.op(f, "PickUnweighted", [2], [T("/obj/item/clothing/under/color/blue"), T("/obj/item/clothing/under/suit_jacket/navy")]));
		} else if ($0 === "purple") {
			rt.setSv(f, "color_hex", "#DA00FF");
			rt.setSv(f, "inner_outfit", rt.op(f, "PickUnweighted", [2], [T("/obj/item/clothing/under/color/lightpurple"), T("/obj/item/clothing/under/lawyer/purpsuit")]));
		} else if ($0 === "white") {
			rt.setSv(f, "color_hex", "#FFFFFF");
			rt.setSv(f, "inner_outfit", rt.op(f, "PickUnweighted", [2], [T("/obj/item/clothing/under/color/white"), T("/obj/item/clothing/under/suit_jacket/white")]));
		}
	}
	if (truthy(live(gangname))) {
		$0 = live(gangname);
	} else {
		$0 = rt.op(f, "PickUnweighted", [1], [rt.gl("gang_name_pool")]);
	}
	rt.setSv(f, "name", $0);
	(rt.modGl("gang_name_pool", rt.sv(f, "name"), subtract));
	rt.setSv(f, "outer_outfit", rt.op(f, "PickUnweighted", [1], [rt.gl("gang_outfit_pool")]));
	rt.setSv(f, "ganghud", (yield* g.new_(f, T("/datum/atom_hud/antag/gang"), [])));
	rt.setFv(f, "color", rt.sv(f, "ganghud"), rt.sv(f, "color_hex"));
	yield* g.call(f, P("/proc/log_game"), null, [fmt("The ＀ Gang has been created. Their gang color is ＀.", [rt.sv(f, "name"), rt.sv(f, "color")])]);
	yield* g.srcCall(f, "build_item_list");
	return f.dot;
}, true);

// /datum/gang/proc/build_item_list  (code/game/gamemodes/gang/gang_datum.dm:142)  may sleep
rt.def("/datum/gang/proc/build_item_list", function* build_item_list(f: Frame) {
	let B: Value = null, G: Value = null, Cat: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [B, G, Cat, S, $e];
	rt.setSv(f, "boss_item_list", rt.list());
	rt.setSv(f, "boss_category_list", rt.list());
	B = null;
	rt.forList(f, 0, rt.gl("boss_items"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		G = (yield* g.new_(f, live(B), []));
		rt.setAt(rt.sv(f, "boss_item_list"), rt.fv(f, "id", live(G)), live(G));
		if (truthy((Cat = rt.index(rt.sv(f, "boss_category_list"), rt.fv(f, "category", live(G)))))) {
			Cat = rt.modify(live(Cat), live(G), add);
		} else {
			rt.setAt(rt.sv(f, "boss_category_list"), rt.fv(f, "category", live(G)), rt.list(live(G)));
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "reg_item_list", rt.list());
	rt.setSv(f, "reg_category_list", rt.list());
	S = null;
	rt.forList(f, 0, rt.gl("soldier_items"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		G = (yield* g.new_(f, live(S), []));
		rt.setAt(rt.sv(f, "reg_item_list"), rt.fv(f, "id", live(G)), live(G));
		if (truthy((Cat = rt.index(rt.sv(f, "reg_category_list"), rt.fv(f, "category", live(G)))))) {
			Cat = rt.modify(live(Cat), live(G), add);
		} else {
			rt.setAt(rt.sv(f, "reg_category_list"), rt.fv(f, "category", live(G)), rt.list(live(G)));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/gang/proc/add_gang_hud  (code/game/gamemodes/gang/gang_datum.dm:165)
rt.def("/datum/gang/proc/add_gang_hud", function add_gang_hud(f: Frame, recruit_mind: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	rt.callName(f, rt.sv(f, "ganghud"), "join_hud", [rt.fv(f, "current", live(recruit_mind))]);
	$0 = rt.fv(f, "mode", rt.gl("SSticker"));
	$1 = rt.fv(f, "current", live(recruit_mind));
	if (truthy((rt.isIn(f, live(recruit_mind), rt.sv(f, "bosses")) ? 1 : 0))) {
		$2 = "gang_boss";
	} else {
		$2 = "gangster";
	}
	rt.callName(f, $0, "set_antag_hud", [$1, $2]);
	return f.dot;
});

// /datum/gang/proc/remove_gang_hud  (code/game/gamemodes/gang/gang_datum.dm:169)
rt.def("/datum/gang/proc/remove_gang_hud", function remove_gang_hud(f: Frame, defector_mind: Value) {
	rt.callName(f, rt.sv(f, "ganghud"), "leave_hud", [rt.fv(f, "current", live(defector_mind))]);
	rt.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "set_antag_hud", [rt.fv(f, "current", live(defector_mind)), null]);
	return f.dot;
});

// /datum/gang/proc/domination  (code/game/gamemodes/gang/gang_datum.dm:173)
rt.def("/datum/gang/proc/domination", function domination(f: Frame, modifier: Value) {
	f.vars = () => [modifier];
	if (live(modifier) === null) {
		modifier = 1;
	}
	rt.callSrc(f, "set_domination_time", [multiply(rt.call(f, P("/proc/determine_domination_time"), null, [live(f.src)]), live(modifier))]);
	rt.setSv(f, "is_dominating", 1);
	rt.call(f, P("/proc/set_security_level"), null, ["delta"]);
	return f.dot;
});

// /datum/gang/proc/set_domination_time  (code/game/gamemodes/gang/gang_datum.dm:178)
rt.def("/datum/gang/proc/set_domination_time", function set_domination_time(f: Frame, d: Value) {
	rt.setSv(f, "domination_timer", add(rt.worldTime(f), multiply(10, live(d))));
	return f.dot;
});

// /datum/gang/proc/domination_time_remaining  (code/game/gamemodes/gang/gang_datum.dm:181)
rt.def("/datum/gang/proc/domination_time_remaining", function domination_time_remaining(f: Frame) {
	let diff: Value = null;
	f.vars = () => [diff];
	return divide((diff = subtract(rt.sv(f, "domination_timer"), rt.worldTime(f))), 10);
});

// /datum/gang/proc/message_gangtools  (code/game/gamemodes/gang/gang_datum.dm:188)
rt.def("/datum/gang/proc/message_gangtools", function message_gangtools(f: Frame, message: Value, beep: Value, warning: Value) {
	let tool: Value = null, mob: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [beep, tool, mob, $0, $1, $e];
	if (live(beep) === null) {
		beep = 1;
	}
	if ((!truthy(rt.len(f, rt.sv(f, "gangtools"))) || !truthy(live(message)))) {
		return live(f.dot);
	}
	tool = null;
	rt.forList(f, 0, rt.sv(f, "gangtools"), T("/obj/item/device/gangtool"));
	while (($e = rt.next(f, 0)) !== undefined) {
		tool = $e;
		if (((truthy((mob = rt.call(f, P("/proc/get"), null, [rt.fv(f, "loc", live(tool)), T("/mob/living")]))) && truthy(rt.fv(f, "mind", live(mob)))) && isEqual(rt.fv(f, "stat", live(mob)), 0))) {
			if (isEqual(rt.gv(f, "gang_datum", rt.fv(f, "mind", live(mob))), live(f.src))) {
				$0 = live(mob);
				if (truthy(live(warning))) {
					$1 = "warning";
				} else {
					$1 = "notice";
				}
				rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='＀'>＀ ＀</span>", [$1, rt.call(f, P("/proc/bicon"), null, [live(tool)]), live(message)])]);
			}
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/gang/proc/income  (code/game/gamemodes/gang/gang_datum.dm:202)  may sleep
rt.def("/datum/gang/proc/income", function* income(f: Frame) {
	let added_names: Value = null, lost_names: Value = null, reclaimed_territories: Value = null, area: Value = null, message: Value = null, control: Value = null, sbonus: Value = null, seconds_remaining: Value = null, new_time: Value = null;
	let $e: any;
	f.vars = () => [added_names, lost_names, reclaimed_territories, area, message, control, sbonus, seconds_remaining, new_time, $e];
	if (!truthy(rt.len(f, rt.sv(f, "bosses")))) {
		return live(f.dot);
	}
	added_names = "";
	lost_names = "";
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "shuttle_check", []);
	(rt.modSrcVar(f, "territory", (reclaimed_territories = rt.bitAnd(rt.sv(f, "territory_new"), rt.sv(f, "territory_lost"))), rt.bitOr));
	(rt.modSrcVar(f, "territory_new", live(reclaimed_territories), subtract));
	(rt.modSrcVar(f, "territory_lost", live(reclaimed_territories), subtract));
	area = null;
	rt.forList(f, 0, rt.sv(f, "territory_lost"));
	while (($e = rt.next(f, 0)) !== undefined) {
		area = $e;
		if (!isEqual(live(lost_names), "")) {
			lost_names = rt.modify(live(lost_names), ", ", add);
		}
		lost_names = rt.modify(live(lost_names), fmt("＀", [rt.index(rt.sv(f, "territory_lost"), live(area))]), add);
		(rt.modSrcVar(f, "territory", live(area), subtract));
	}
	rt.endFor(f, 0);
	area = null;
	rt.forList(f, 0, rt.sv(f, "territory_new"));
	while (($e = rt.next(f, 0)) !== undefined) {
		area = $e;
		if (!isEqual(live(added_names), "")) {
			added_names = rt.modify(live(added_names), ", ", add);
		}
		added_names = rt.modify(live(added_names), fmt("＀", [rt.index(rt.sv(f, "territory_new"), live(area))]), add);
		rt.modSrcVar(f, "territory", live(area), add);
	}
	rt.endFor(f, 0);
	message = fmt("<b>＀ Gang Status Report:</b>.<BR>*---------*<BR>", [live(f.src)]);
	message = rt.modify(live(message), fmt("<b>＀ new territories:</b><br><i>＀</i><br>", [rt.len(f, rt.sv(f, "territory_new")), live(added_names)]), add);
	message = rt.modify(live(message), fmt("<b>＀ territories lost:</b><br><i>＀</i><br>", [rt.len(f, rt.sv(f, "territory_lost")), live(lost_names)]), add);
	rt.setSv(f, "territory_new", rt.list());
	rt.setSv(f, "territory_lost", rt.list());
	control = (yield* g.call(f, P("/proc/round"), null, [multiply(divide(rt.len(f, rt.sv(f, "territory")), rt.fv(f, "num_territories", rt.gl("start_state"))), 100), 1]));
	sbonus = rt.op(f, "Sqrt", [], [rt.length(rt.sv(f, "territory"))]);
	message = rt.modify(live(message), fmt("Your gang now has <b>＀% control</b> of the station.<BR>*---------*<BR>", [live(control)]), add);
	if (truthy(rt.sv(f, "is_dominating"))) {
		seconds_remaining = (yield* g.srcCall(f, "domination_time_remaining"));
		if (rt.lt((new_time = (yield* g.call(f, P("/proc/max"), null, [180, subtract(live(seconds_remaining), multiply(rt.len(f, rt.sv(f, "territory")), 2))]))), live(seconds_remaining))) {
			message = rt.modify(live(message), fmt("Takeover shortened by ＀ seconds for defending ＀ territories.<BR>", [subtract(live(seconds_remaining), live(new_time)), rt.len(f, rt.sv(f, "territory"))]), add);
			yield* g.srcCall(f, "set_domination_time", live(new_time));
		}
		message = rt.modify(live(message), fmt("<b>＀ seconds remain</b> in hostile takeover.<BR>", [live(seconds_remaining)]), add);
	} else {
		yield* g.srcCall(f, "pay_territory_income_to_bosses");
		yield* g.srcCall(f, "pay_territory_income_to_soldiers", live(sbonus));
		yield* g.srcCall(f, "pay_all_clothing_bonuses");
		yield* g.srcCall(f, "announce_all_influence");
	}
	return f.dot;
}, true);

// /datum/gang/proc/pay_all_clothing_bonuses  (code/game/gamemodes/gang/gang_datum.dm:255)
rt.def("/datum/gang/proc/pay_all_clothing_bonuses", function pay_all_clothing_bonuses(f: Frame) {
	let mind: Value = null;
	let $e: any;
	f.vars = () => [mind, $e];
	mind = null;
	rt.forList(f, 0, rt.bitOr(rt.sv(f, "gangsters"), rt.sv(f, "bosses")), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		mind = $e;
		rt.callSrc(f, "pay_clothing_bonus", [live(mind)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/gang/proc/pay_clothing_bonus  (code/game/gamemodes/gang/gang_datum.dm:261)
rt.def("/datum/gang/proc/pay_clothing_bonus", function pay_clothing_bonus(f: Frame, gangsta: Value) {
	let gangbanger: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [gangbanger, C, $e];
	gangbanger = rt.fv(f, "current", live(gangsta));
	f.dot = 0;
	if ((!truthy((rt.istype(live(gangbanger), T("/mob/living/carbon/human")) ? 1 : 0)) || isEqual(rt.fv(f, "stat", live(gangbanger)), 2))) {
		return 0;
	}
	C = null;
	rt.forList(f, 0, rt.fv(f, "contents", live(gangbanger)), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (isEqual(rt.fv(f, "type", live(C)), rt.sv(f, "inner_outfit"))) {
			f.dot = rt.modify(live(f.dot), 2, add);
			continue;
		}
		if (isEqual(rt.fv(f, "type", live(C)), rt.sv(f, "outer_outfit"))) {
			f.dot = rt.modify(live(f.dot), 2, add);
			continue;
		}
		f.dot = rt.modify(live(f.dot), rt.callName(f, live(C), "gang_contraband_value", []), add);
	}
	rt.endFor(f, 0);
	rt.callSrc(f, "adjust_influence", [live(gangsta), live(f.dot)]);
	if (truthy(live(f.dot))) {
		rt.callSrc(f, "announce_to_mind", [live(gangsta), fmt("<span class='notice'>Your influential choice of clothing has increased your influence by ＀ points!</span>", [live(f.dot)])]);
	} else {
		rt.callSrc(f, "announce_to_mind", [live(gangsta), "<span class='warning'>Unfortunately, you have not gained any additional influence from your drab, old, boring clothing. Learn to dress like a gangsta, bro!</span>"]);
	}
	return f.dot;
});

// /datum/gang/proc/pay_soldier_territory_income  (code/game/gamemodes/gang/gang_datum.dm:281)
rt.def("/datum/gang/proc/pay_soldier_territory_income", function pay_soldier_territory_income(f: Frame, soldier: Value, sbonus: Value) {
	f.vars = () => [sbonus];
	if (live(sbonus) === null) {
		sbonus = 0;
	}
	f.dot = 0;
	f.dot = add(add(rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/round"), null, [subtract(3, divide(rt.index(rt.sv(f, "gangsters"), live(soldier)), 10))])]), live(sbonus)), divide(rt.callSrc(f, "get_soldier_territories", [live(soldier)]), 2));
	rt.callSrc(f, "adjust_influence", [live(soldier), live(f.dot)]);
	return f.dot;
});

// /datum/gang/proc/get_soldier_territories  (code/game/gamemodes/gang/gang_datum.dm:285)
rt.def("/datum/gang/proc/get_soldier_territories", function get_soldier_territories(f: Frame, soldier: Value) {
	let tags: Value = null;
	f.vars = () => [tags];
	if (!truthy((rt.istype(rt.index(rt.sv(f, "tags_by_mind"), live(soldier)), T("/list")) ? 1 : 0))) {
		return 0;
	}
	return rt.getLen(f, (tags = rt.index(rt.sv(f, "tags_by_mind"), live(soldier))));
});

// /datum/gang/proc/pay_territory_income_to_soldiers  (code/game/gamemodes/gang/gang_datum.dm:291)
rt.def("/datum/gang/proc/pay_territory_income_to_soldiers", function pay_territory_income_to_soldiers(f: Frame, sbonus: Value) {
	let soldier: Value = null, returned: Value = null;
	let $e: any;
	f.vars = () => [sbonus, soldier, returned, $e];
	if (live(sbonus) === null) {
		sbonus = 0;
	}
	soldier = null;
	rt.forList(f, 0, rt.sv(f, "gangsters"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		soldier = $e;
		if (!truthy((returned = rt.callSrc(f, "pay_soldier_territory_income", [live(soldier)])))) {
			rt.callSrc(f, "announce_to_mind", [live(soldier), "<span class='warning'>You have not gained any influence from territories you personally tagged. Get to work, soldier!</span>"]);
		} else {
			rt.callSrc(f, "announce_to_mind", [live(soldier), fmt("<span class='notice'>You have gained ＀ influence from ＀ territories you have personally tagged.</span>", [live(returned), rt.callSrc(f, "get_soldier_territories", [live(soldier)])])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/gang/proc/announce_all_influence  (code/game/gamemodes/gang/gang_datum.dm:299)
rt.def("/datum/gang/proc/announce_all_influence", function announce_all_influence(f: Frame) {
	let MG: Value = null;
	let $e: any;
	f.vars = () => [MG, $e];
	MG = null;
	rt.forList(f, 0, rt.bitOr(rt.sv(f, "bosses"), rt.sv(f, "gangsters")), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		MG = $e;
		rt.callSrc(f, "announce_total_influence", [live(MG)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/gang/proc/pay_territory_income_to_bosses  (code/game/gamemodes/gang/gang_datum.dm:304)
rt.def("/datum/gang/proc/pay_territory_income_to_bosses", function pay_territory_income_to_bosses(f: Frame) {
	let boss_mind: Value = null, inc: Value = null;
	let $e: any;
	f.vars = () => [boss_mind, inc, $e];
	f.dot = 0;
	boss_mind = null;
	rt.forList(f, 0, rt.sv(f, "bosses"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		boss_mind = $e;
		f.dot = rt.modify(live(f.dot), (inc = add(rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/round"), null, [subtract(5, divide(rt.index(rt.sv(f, "bosses"), live(boss_mind)), 10))])]), rt.length(rt.sv(f, "territory")))), add);
		rt.callSrc(f, "adjust_influence", [live(boss_mind), live(inc)]);
		rt.callSrc(f, "announce_to_mind", [live(boss_mind), fmt("<span class='boldnotice'>Your influence has increased by ＀ from your gang holding ＀ territories!</span>", [live(inc), rt.length(rt.sv(f, "territory"))])]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/gang/proc/get_influence  (code/game/gamemodes/gang/gang_datum.dm:311)
rt.def("/datum/gang/proc/get_influence", function get_influence(f: Frame, gangster_mind: Value) {
	if (truthy((rt.isIn(f, live(gangster_mind), rt.sv(f, "gangsters")) ? 1 : 0))) {
		return rt.index(rt.sv(f, "gangsters"), live(gangster_mind));
	}
	if (!truthy((rt.isIn(f, live(gangster_mind), rt.sv(f, "bosses")) ? 1 : 0))) return f.dot;
	return rt.index(rt.sv(f, "bosses"), live(gangster_mind));
});

// /datum/gang/proc/adjust_influence  (code/game/gamemodes/gang/gang_datum.dm:317)
rt.def("/datum/gang/proc/adjust_influence", function adjust_influence(f: Frame, gangster_mind: Value, amount: Value) {
	if (truthy((rt.isIn(f, live(gangster_mind), rt.sv(f, "gangsters")) ? 1 : 0))) {
		rt.modAt(rt.sv(f, "gangsters"), live(gangster_mind), live(amount), add);
	}
	if (!truthy((rt.isIn(f, live(gangster_mind), rt.sv(f, "bosses")) ? 1 : 0))) return f.dot;
	rt.modAt(rt.sv(f, "bosses"), live(gangster_mind), live(amount), add);
	return f.dot;
});

// /datum/gang/proc/announce_to_mind  (code/game/gamemodes/gang/gang_datum.dm:323)
rt.def("/datum/gang/proc/announce_to_mind", function announce_to_mind(f: Frame, gangster_mind: Value, message: Value) {
	if (!(truthy(rt.fv(f, "current", live(gangster_mind))) && !isEqual(rt.gv(f, "stat", rt.fv(f, "current", live(gangster_mind))), 2))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", live(gangster_mind)), live(message)]);
	return f.dot;
});

// /datum/gang/proc/announce_total_influence  (code/game/gamemodes/gang/gang_datum.dm:327)
rt.def("/datum/gang/proc/announce_total_influence", function announce_total_influence(f: Frame, gangster_mind: Value) {
	rt.callSrc(f, "announce_to_mind", [live(gangster_mind), fmt("<span class='boldnotice'>＀ Gang: You now have a total of ＀ influence!</span>", [rt.sv(f, "name"), rt.callSrc(f, "get_influence", [live(gangster_mind)])])]);
	return f.dot;
});

// /datum/gang/proc/reclaim_points  (code/game/gamemodes/gang/gang_datum.dm:330)
rt.def("/datum/gang/proc/reclaim_points", function reclaim_points(f: Frame, amount: Value) {
	let bawss: Value = null;
	let $e: any;
	f.vars = () => [bawss, $e];
	bawss = null;
	rt.forList(f, 0, rt.sv(f, "bosses"), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		bawss = $e;
		rt.callSrc(f, "adjust_influence", [live(bawss), divide(live(amount), rt.len(f, rt.sv(f, "bosses")))]);
		rt.callSrc(f, "announce_to_mind", [live(bawss), fmt("<span class='notice'>＀ Gang: ＀ influence given from internal automatic restructuring.</span>", [rt.sv(f, "name"), divide(live(amount), rt.len(f, rt.sv(f, "bosses")))])]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(1248, "/datum/gang/multiverse", "/datum/gang", {
	dom_attempts: 0,
	fighting_style: "multiverse",
	is_deconvertible: 0,
});

// /datum/gang/multiverse/proc/New  (code/game/gamemodes/gang/gang_datum.dm:342)
rt.def("/datum/gang/multiverse/proc/New", function New(f: Frame, loc: Value, multiverse_override: Value) {
	rt.setSv(f, "name", live(multiverse_override));
	rt.setSv(f, "ganghud", rt.new_(f, T("/datum/atom_hud/antag/gang"), []));
	return f.dot;
});
