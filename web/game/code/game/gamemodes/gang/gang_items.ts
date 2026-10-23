// From code/game/gamemodes/gang/gang_items.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1249, "/datum/gang_item", "/datum", {
	name: null,
	item_path: null,
	cost: null,
	spawn_msg: null,
	category: null,
	id: null,
});

// /datum/gang_item/proc/purchase  (code/game/gamemodes/gang/gang_items.dm:11)  may sleep
rt.def("/datum/gang_item/proc/purchase", function* purchase(f: Frame, user: Value, gang: Value, gangtool: Value, check_canbuy: Value) {
	let real_cost: Value = null;
	f.vars = () => [user, gang, gangtool, check_canbuy, real_cost];
	if (live(check_canbuy) === null) {
		check_canbuy = 1;
	}
	if ((truthy(live(check_canbuy)) && !truthy((yield* g.srcCall(f, "can_buy", live(user), live(gang), live(gangtool)))))) {
		return 0;
	}
	real_cost = (yield* g.srcCall(f, "get_cost", live(user), live(gang), live(gangtool)));
	yield* g.callName(f, live(gang), "adjust_influence", [rt.fv(f, "mind", live(user)), rt.neg(live(real_cost))]);
	yield* g.srcCall(f, "spawn_item", live(user), live(gang), live(gangtool));
	return 1;
}, true);

// /datum/gang_item/proc/spawn_item  (code/game/gamemodes/gang/gang_items.dm:20)  may sleep
rt.def("/datum/gang_item/proc/spawn_item", function* spawn_item(f: Frame, user: Value, gang: Value, gangtool: Value) {
	let O: Value = null;
	f.vars = () => [user, gang, gangtool, O];
	if (truthy(rt.sv(f, "item_path"))) {
		O = (yield* g.new_(f, rt.sv(f, "item_path"), [rt.fv(f, "loc", live(user))]));
		yield* g.callName(f, live(user), "put_in_hands", [live(O)]);
	}
	if (!truthy(rt.sv(f, "spawn_msg"))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), rt.sv(f, "spawn_msg")]);
	return f.dot;
}, true);

// /datum/gang_item/proc/can_buy  (code/game/gamemodes/gang/gang_items.dm:26)
rt.def("/datum/gang_item/proc/can_buy", function can_buy(f: Frame, user: Value, gang: Value, gangtool: Value) {
	return ((live(gang) && (rt.ge(rt.callName(f, live(gang), "get_influence", [rt.fv(f, "mind", live(user))]), rt.callSrc(f, "get_cost", [live(user), live(gang), live(gangtool)])) ? 1 : 0)) && rt.callSrc(f, "can_see", [live(user), live(gang), live(gangtool)]));
});

// /datum/gang_item/proc/get_cost_display  (code/game/gamemodes/gang/gang_items.dm:35)
rt.def("/datum/gang_item/proc/get_cost_display", function get_cost_display(f: Frame, user: Value, gang: Value, gangtool: Value) {
	return fmt("(＀ Influence)", [rt.callSrc(f, "get_cost", [live(user), live(gang), live(gangtool)])]);
});

// /datum/gang_item/proc/isboss  (code/game/gamemodes/gang/gang_items.dm:41)
rt.def("/datum/gang_item/proc/isboss", function isboss(f: Frame, user: Value, gang: Value) {
	return ((live(user) && live(gang)) && (isEqual(rt.fv(f, "mind", live(user)), rt.index(rt.fv(f, "bosses", live(gang)), 1)) ? 1 : 0));
});

rt.type(1250, "/datum/gang_item/function", "/datum/gang_item", {
	category: "Gangtool Functions:",
	cost: 0,
});

// /datum/gang_item/function/proc/get_cost_display  (code/game/gamemodes/gang/gang_items.dm:55)
rt.def("/datum/gang_item/function/proc/get_cost_display", function get_cost_display(f: Frame, user: Value, gang: Value, gangtool: Value) {
	return "";
});

rt.type(1251, "/datum/gang_item/function/gang_ping", "/datum/gang_item/function", {
	name: "Send Message to Gang",
	id: "gang_ping",
});

// /datum/gang_item/function/gang_ping/proc/spawn_item  (code/game/gamemodes/gang/gang_items.dm:64)  may sleep
rt.def("/datum/gang_item/function/gang_ping/proc/spawn_item", function* spawn_item(f: Frame, user: Value, gang: Value, gangtool: Value) {
	f.vars = () => [user, gang, gangtool];
	if (!truthy(live(gangtool))) return f.dot;
	yield* g.callName(f, live(gangtool), "ping_gang", [live(user)]);
	return f.dot;
}, true);

rt.type(1252, "/datum/gang_item/function/recall", "/datum/gang_item/function", {
	name: "Recall Emergency Shuttle",
	id: "recall",
});

// /datum/gang_item/function/recall/proc/can_see  (code/game/gamemodes/gang/gang_items.dm:72)
rt.def("/datum/gang_item/function/recall/proc/can_see", function can_see(f: Frame, user: Value, gang: Value, gangtool: Value) {
	return rt.callSrc(f, "isboss", [live(user), live(gang)]);
});

// /datum/gang_item/function/recall/proc/spawn_item  (code/game/gamemodes/gang/gang_items.dm:76)  may sleep
rt.def("/datum/gang_item/function/recall/proc/spawn_item", function* spawn_item(f: Frame, user: Value, gang: Value, gangtool: Value) {
	f.vars = () => [user, gang, gangtool];
	if (!truthy(live(gangtool))) return f.dot;
	yield* g.callName(f, live(gangtool), "recall", [live(user)]);
	return f.dot;
}, true);

rt.type(1254, "/datum/gang_item/clothing/under", "/datum/gang_item/clothing", {
	name: "Gang Uniform",
	id: "under",
	cost: 1,
});

// /datum/gang_item/clothing/under/proc/spawn_item  (code/game/gamemodes/gang/gang_items.dm:92)  may sleep
rt.def("/datum/gang_item/clothing/under/proc/spawn_item", function* spawn_item(f: Frame, user: Value, gang: Value, gangtool: Value) {
	let O: Value = null;
	f.vars = () => [user, gang, gangtool, O];
	if (!truthy(rt.fv(f, "inner_outfit", live(gang)))) return f.dot;
	O = (yield* g.new_(f, rt.fv(f, "inner_outfit", live(gang)), [rt.fv(f, "loc", live(user))]));
	yield* g.callName(f, live(user), "put_in_hands", [live(O)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'> This is your gang's official uniform, wearing it will increase your influence"]);
	return f.dot;
}, true);

rt.type(1255, "/datum/gang_item/clothing/suit", "/datum/gang_item/clothing", {
	name: "Gang Armored Outerwear",
	id: "suit",
	cost: 1,
});

// /datum/gang_item/clothing/suit/proc/spawn_item  (code/game/gamemodes/gang/gang_items.dm:103)  may sleep
rt.def("/datum/gang_item/clothing/suit/proc/spawn_item", function* spawn_item(f: Frame, user: Value, gang: Value, gangtool: Value) {
	let O: Value = null;
	f.vars = () => [user, gang, gangtool, O];
	if (!truthy(rt.fv(f, "outer_outfit", live(gang)))) return f.dot;
	rt.setFv(f, "armor", (O = (yield* g.new_(f, rt.fv(f, "outer_outfit", live(gang)), [rt.fv(f, "loc", live(user))]))), rt.alist(f, ["melee", 20, "bullet", 35, "laser", 10, "energy", 10, "bomb", 30, "bio", 0, "rad", 0, "fire", 30, "acid", 30]));
	rt.modField(f, live(O), "desc", fmt(" Tailored for the ＀ Gang to offer the wearer moderate protection against ballistics and physical trauma.", [rt.fv(f, "name", live(gang))]), add);
	yield* g.callName(f, live(user), "put_in_hands", [live(O)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'> This is your gang's official outerwear, wearing it will increase your influence"]);
	return f.dot;
}, true);

rt.type(1263, "/datum/gang_item/weapon/ammo", "/datum/gang_item/weapon", {});

// /datum/gang_item/weapon/ammo/proc/get_cost_display  (code/game/gamemodes/gang/gang_items.dm:199)
rt.def("/datum/gang_item/weapon/ammo/proc/get_cost_display", function get_cost_display(f: Frame) {
	return add("&nbsp;&#8627;", rt.callSuper(f, [], rt.Args.Same));
}, false, { args: ["user", "gang", "gangtool"] });

rt.type(1285, "/datum/gang_item/equipment/implant_breaker", "/datum/gang_item/equipment", {
	name: "Implant Breaker",
	id: "implant_breaker",
	cost: 10,
	spawn_msg: "<span class='notice'>The <b>implant breaker</b> is a single-use device that destroys all implants within the target before trying to recruit them to your gang. Also works on enemy gangsters.</span>",
	item_path: rt.typePath("/obj/item/weapon/implanter/gang"),
});

// /datum/gang_item/equipment/implant_breaker/proc/spawn_item  (code/game/gamemodes/gang/gang_items.dm:343)  may sleep
rt.def("/datum/gang_item/equipment/implant_breaker/proc/spawn_item", function* spawn_item(f: Frame, user: Value, gang: Value, gangtool: Value) {
	let O: Value = null;
	f.vars = () => [user, gang, gangtool, O];
	if (truthy(rt.sv(f, "item_path"))) {
		O = (yield* g.new_(f, rt.sv(f, "item_path"), [rt.fv(f, "loc", live(user)), live(gang)]));
		yield* g.callName(f, live(user), "put_in_hands", [live(O)]);
	}
	if (!truthy(rt.sv(f, "spawn_msg"))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), rt.sv(f, "spawn_msg")]);
	return f.dot;
}, true);

rt.type(1287, "/datum/gang_item/equipment/pen", "/datum/gang_item/equipment", {
	name: "Recruitment Pen",
	id: "pen",
	cost: 50,
	spawn_msg: "<span class='notice'>More <b>recruitment pens</b> will allow you to recruit gangsters faster. Only gang leaders can recruit with pens.</span>",
	item_path: rt.typePath("/obj/item/weapon/pen/gang"),
});

// /datum/gang_item/equipment/pen/proc/purchase  (code/game/gamemodes/gang/gang_items.dm:368)  may sleep
rt.def("/datum/gang_item/equipment/pen/proc/purchase", function* purchase(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		rt.setFv(f, "free_pen", live(f.args[2]), 0);
		return 1;
	}
	return 0;
}, true, { args: ["user", "gang", "gangtool"] });

// /datum/gang_item/equipment/pen/proc/get_cost  (code/game/gamemodes/gang/gang_items.dm:374)
rt.def("/datum/gang_item/equipment/pen/proc/get_cost", function get_cost(f: Frame) {
	if ((truthy(live(f.args[2])) && truthy(rt.fv(f, "free_pen", live(f.args[2]))))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["user", "gang", "gangtool"] });

// /datum/gang_item/equipment/pen/proc/get_cost_display  (code/game/gamemodes/gang/gang_items.dm:379)
rt.def("/datum/gang_item/equipment/pen/proc/get_cost_display", function get_cost_display(f: Frame) {
	if ((truthy(live(f.args[2])) && truthy(rt.fv(f, "free_pen", live(f.args[2]))))) {
		return "(GET ONE FREE)";
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["user", "gang", "gangtool"] });

rt.type(1288, "/datum/gang_item/equipment/gangtool", "/datum/gang_item/equipment", {
	id: "gangtool",
	cost: 10,
});

// /datum/gang_item/equipment/gangtool/proc/spawn_item  (code/game/gamemodes/gang/gang_items.dm:390)  may sleep
rt.def("/datum/gang_item/equipment/gangtool/proc/spawn_item", function* spawn_item(f: Frame, user: Value, gang: Value, gangtool: Value) {
	let item_type: Value = null, tool: Value = null;
	f.vars = () => [user, gang, gangtool, item_type, tool];
	item_type = null;
	if ((truthy(live(gang)) && truthy((yield* g.srcCall(f, "isboss", live(user), live(gang)))))) {
		item_type = T("/obj/item/device/gangtool/spare/lt");
		if (rt.lt(rt.getLen(f, rt.fv(f, "bosses", live(gang))), 3)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'><b>Gangtools</b> allow you to promote a gangster to be your Lieutenant, enabling them to recruit and purchase items like you. Simply have them register the gangtool. You may promote up to ＀ more Lieutenants</span>", [subtract(3, rt.getLen(f, rt.fv(f, "bosses", live(gang))))])]);
		}
	} else {
		item_type = T("/obj/item/device/gangtool/spare");
	}
	tool = (yield* g.new_(f, live(item_type), [rt.fv(f, "loc", live(user))]));
	yield* g.callName(f, live(user), "put_in_hands", [live(tool)]);
	return f.dot;
}, true);

// /datum/gang_item/equipment/gangtool/proc/get_name_display  (code/game/gamemodes/gang/gang_items.dm:400)
rt.def("/datum/gang_item/equipment/gangtool/proc/get_name_display", function get_name_display(f: Frame, user: Value, gang: Value, gangtool: Value) {
	if (((truthy(live(gang)) && truthy(rt.callSrc(f, "isboss", [live(user), live(gang)]))) && rt.lt(rt.getLen(f, rt.fv(f, "bosses", live(gang))), 3))) {
		return "Promote a Gangster";
	}
	return "Spare Gangtool";
});

rt.type(1289, "/datum/gang_item/equipment/dominator", "/datum/gang_item/equipment", {
	name: "Station Dominator",
	id: "dominator",
	cost: 30,
	spawn_msg: "<span class='notice'>The <b>dominator</b> will secure your gang's dominance over the station. Turn it on when you are ready to defend it.</span>",
	item_path: rt.typePath("/obj/machinery/dominator"),
});

// /datum/gang_item/equipment/dominator/proc/can_buy  (code/game/gamemodes/gang/gang_items.dm:413)
rt.def("/datum/gang_item/equipment/dominator/proc/can_buy", function can_buy(f: Frame) {
	if ((!truthy(live(f.args[1])) || !truthy(rt.fv(f, "dom_attempts", live(f.args[1]))))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["user", "gang", "gangtool"] });

// /datum/gang_item/equipment/dominator/proc/get_name_display  (code/game/gamemodes/gang/gang_items.dm:418)
rt.def("/datum/gang_item/equipment/dominator/proc/get_name_display", function get_name_display(f: Frame) {
	if ((!truthy(live(f.args[1])) || !truthy(rt.fv(f, "dom_attempts", live(f.args[1]))))) {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return fmt("<b>＀</b>", [rt.callSuper(f, [], rt.Args.Same)]);
}, false, { args: ["user", "gang", "gangtool"] });

// /datum/gang_item/equipment/dominator/proc/get_cost_display  (code/game/gamemodes/gang/gang_items.dm:423)
rt.def("/datum/gang_item/equipment/dominator/proc/get_cost_display", function get_cost_display(f: Frame) {
	if ((!truthy(live(f.args[1])) || !truthy(rt.fv(f, "dom_attempts", live(f.args[1]))))) {
		return "(Out of stock)";
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["user", "gang", "gangtool"] });

// /datum/gang_item/equipment/dominator/proc/get_extra_info  (code/game/gamemodes/gang/gang_items.dm:429)
rt.def("/datum/gang_item/equipment/dominator/proc/get_extra_info", function get_extra_info(f: Frame, user: Value, gang: Value, gangtool: Value) {
	if (!truthy(live(gang))) return f.dot;
	return fmt("(Estimated Takeover Time: ＀ minutes)", [rt.call(f, P("/proc/round"), null, [divide(rt.call(f, P("/proc/determine_domination_time"), null, [live(gang)]), 60), 0.10000000149011612])]);
});

// /datum/gang_item/equipment/dominator/proc/purchase  (code/game/gamemodes/gang/gang_items.dm:432)  may sleep
rt.def("/datum/gang_item/equipment/dominator/proc/purchase", function* purchase(f: Frame) {
	let usrarea: Value = null, usrturf: Value = null, obj: Value = null;
	let $e: any;
	f.vars = () => [usrarea, usrturf, obj, $e];
	usrarea = (yield* g.call(f, P("/proc/get_area"), null, [rt.fv(f, "loc", live(f.args[0]))]));
	usrturf = rt.getStep(f, rt.fv(f, "loc", live(f.args[0])), 0);
	if (((isEqual(rt.initial(f, live(usrarea), "name"), "Space") || truthy((rt.istype(live(usrturf), T("/turf/open/space")) ? 1 : 0))) || !isEqual(rt.fv(f, "z", live(f.usr)), 2))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You can only use this on the station!</span>"]);
		return 0;
	}
	obj = null;
	rt.forList(f, 0, live(usrturf), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		obj = $e;
		if (truthy(rt.fv(f, "density", live(obj)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>There's not enough room here!</span>"]);
			return 0;
		}
	}
	rt.endFor(f, 0);
	if (truthy((yield* g.call(f, P("/proc/dominator_excessive_walls"), null, [live(f.args[0])])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>The <b>dominator</b> will not function here! The <b>dominator</b> requires a sizable open space within three standard units so that walls do not interfere with the signal.</span>"]);
		return 0;
	}
	if (!truthy((rt.isIn(f, rt.fv(f, "type", live(usrarea)), rt.bitOr(rt.fv(f, "territory", live(f.args[1])), rt.fv(f, "territory_new", live(f.args[1])))) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>The <b>dominator</b> can be spawned only on territory controlled by your gang!</span>"]);
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user", "gang", "gangtool"] });

// /datum/gang_item/equipment/dominator/proc/spawn_item  (code/game/gamemodes/gang/gang_items.dm:453)  may sleep
rt.def("/datum/gang_item/equipment/dominator/proc/spawn_item", function* spawn_item(f: Frame, user: Value, gang: Value, gangtool: Value) {
	f.vars = () => [user, gang, gangtool];
	yield* g.new_(f, rt.sv(f, "item_path"), [rt.fv(f, "loc", live(user))]);
	return f.dot;
}, true);
