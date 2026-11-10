// Based on /tg/station's code/game/gamemodes/gang/gang_items.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1249, "/datum/gang_item", "/datum", {
	name: null,
	item_path: null,
	cost: null,
	spawn_msg: null,
	category: null,
	id: null,
});

// gang_items.dm:11
rt.def("/datum/gang_item/proc/purchase", function* purchase(f: Frame, user: Value, gang: Value, gangtool: Value, check_canbuy: Value) {
	check_canbuy ??= 1;
	if (check_canbuy && !this.can_buy(user, gang, gangtool)) {
		return 0;
	}
	let real_cost: Value = this.get_cost(user, gang, gangtool);
	gang.adjust_influence(user.mind, -real_cost);
	yield* this.spawn_item(user, gang, gangtool);
	return 1;
}, true);

// gang_items.dm:20
rt.def("/datum/gang_item/proc/spawn_item", function* spawn_item(f: Frame, user: Value, gang: Value, gangtool: Value) {
	let O: Value = null;
	if (this.item_path) {
		O = (yield* new_(this.item_path, user.loc));
		yield* user.put_in_hands(O);
	}
	if (!this.spawn_msg) return f.dot;
	to_chat(user, this.spawn_msg);
	return f.dot;
}, true);

// gang_items.dm:26
rt.def("/datum/gang_item/proc/can_buy", function can_buy(f: Frame, user: Value, gang: Value, gangtool: Value) {
	return ((gang && (gang.get_influence(user.mind) >= this.get_cost(user, gang, gangtool) ? 1 : 0)) && this.can_see(user, gang, gangtool));
});

// gang_items.dm:35
rt.def("/datum/gang_item/proc/get_cost_display", function get_cost_display(f: Frame, user: Value, gang: Value, gangtool: Value) {
	return `(${this.get_cost(user, gang, gangtool)} Influence)`;
});

// gang_items.dm:41
rt.def("/datum/gang_item/proc/isboss", function isboss(f: Frame, user: Value, gang: Value) {
	return ((user && gang) && (user.mind == rt.index(gang.bosses, 1) ? 1 : 0));
});

rt.type(1250, "/datum/gang_item/function", "/datum/gang_item", {
	category: "Gangtool Functions:",
	cost: 0,
});

// gang_items.dm:55
rt.def("/datum/gang_item/function/proc/get_cost_display", function get_cost_display(f: Frame, user: Value, gang: Value, gangtool: Value) {
	return "";
});

rt.type(1251, "/datum/gang_item/function/gang_ping", "/datum/gang_item/function", {
	name: "Send Message to Gang",
	id: "gang_ping",
});

// gang_items.dm:64
rt.def("/datum/gang_item/function/gang_ping/proc/spawn_item", function* spawn_item(f: Frame, user: Value, gang: Value, gangtool: Value) {
	if (!gangtool) return f.dot;
	yield* gangtool.ping_gang(user);
	return f.dot;
}, true);

rt.type(1252, "/datum/gang_item/function/recall", "/datum/gang_item/function", {
	name: "Recall Emergency Shuttle",
	id: "recall",
});

// gang_items.dm:72
rt.def("/datum/gang_item/function/recall/proc/can_see", function can_see(f: Frame, user: Value, gang: Value, gangtool: Value) {
	return this.isboss(user, gang);
});

// gang_items.dm:76
rt.def("/datum/gang_item/function/recall/proc/spawn_item", function* spawn_item(f: Frame, user: Value, gang: Value, gangtool: Value) {
	if (!gangtool) return f.dot;
	yield* gangtool.recall(user);
	return f.dot;
}, true);

rt.type(1254, "/datum/gang_item/clothing/under", "/datum/gang_item/clothing", {
	name: "Gang Uniform",
	id: "under",
	cost: 1,
});

// gang_items.dm:92
rt.def("/datum/gang_item/clothing/under/proc/spawn_item", function* spawn_item(f: Frame, user: Value, gang: Value, gangtool: Value) {
	if (!gang.inner_outfit) return f.dot;
	let O: Value = (yield* new_(gang.inner_outfit, user.loc));
	yield* user.put_in_hands(O);
	to_chat(user, "<span class='notice'> This is your gang's official uniform, wearing it will increase your influence");
	return f.dot;
}, true);

rt.type(1255, "/datum/gang_item/clothing/suit", "/datum/gang_item/clothing", {
	name: "Gang Armored Outerwear",
	id: "suit",
	cost: 1,
});

// gang_items.dm:103
rt.def("/datum/gang_item/clothing/suit/proc/spawn_item", function* spawn_item(f: Frame, user: Value, gang: Value, gangtool: Value) {
	let O: Value = null;
	if (!gang.outer_outfit) return f.dot;
	(O = (yield* new_(gang.outer_outfit, user.loc))).armor = rt.alist(f, ["melee", 20, "bullet", 35, "laser", 10, "energy", 10, "bomb", 30, "bio", 0, "rad", 0, "fire", 30, "acid", 30]);
	O.desc += ` Tailored for the ${gang.name} Gang to offer the wearer moderate protection against ballistics and physical trauma.`;
	yield* user.put_in_hands(O);
	to_chat(user, "<span class='notice'> This is your gang's official outerwear, wearing it will increase your influence");
	return f.dot;
}, true);

rt.type(1263, "/datum/gang_item/weapon/ammo", "/datum/gang_item/weapon", {});

// gang_items.dm:199
rt.def("/datum/gang_item/weapon/ammo/proc/get_cost_display", function get_cost_display(f: Frame, user: Value, gang: Value, gangtool: Value) {
	return "&nbsp;&#8627;" + parent_proc();
}, false);

rt.type(1285, "/datum/gang_item/equipment/implant_breaker", "/datum/gang_item/equipment", {
	name: "Implant Breaker",
	id: "implant_breaker",
	cost: 10,
	spawn_msg: "<span class='notice'>The <b>implant breaker</b> is a single-use device that destroys all implants within the target before trying to recruit them to your gang. Also works on enemy gangsters.</span>",
	item_path: rt.typePath("/obj/item/weapon/implanter/gang"),
});

// gang_items.dm:343
rt.def("/datum/gang_item/equipment/implant_breaker/proc/spawn_item", function* spawn_item(f: Frame, user: Value, gang: Value, gangtool: Value) {
	let O: Value = null;
	if (this.item_path) {
		O = (yield* new_(this.item_path, user.loc, gang));
		yield* user.put_in_hands(O);
	}
	if (!this.spawn_msg) return f.dot;
	to_chat(user, this.spawn_msg);
	return f.dot;
}, true);

rt.type(1287, "/datum/gang_item/equipment/pen", "/datum/gang_item/equipment", {
	name: "Recruitment Pen",
	id: "pen",
	cost: 50,
	spawn_msg: "<span class='notice'>More <b>recruitment pens</b> will allow you to recruit gangsters faster. Only gang leaders can recruit with pens.</span>",
	item_path: rt.typePath("/obj/item/weapon/pen/gang"),
});

// gang_items.dm:368
rt.def("/datum/gang_item/equipment/pen/proc/purchase", function* purchase(f: Frame, user: Value, gang: Value, gangtool: Value) {
	if (yield* parent_proc()) {
		gangtool.free_pen = 0;
		return 1;
	}
	return 0;
}, true);

// gang_items.dm:374
rt.def("/datum/gang_item/equipment/pen/proc/get_cost", function get_cost(f: Frame, user: Value, gang: Value, gangtool: Value) {
	if (gangtool && gangtool.free_pen) {
		return 0;
	}
	return parent_proc();
}, false);

// gang_items.dm:379
rt.def("/datum/gang_item/equipment/pen/proc/get_cost_display", function get_cost_display(f: Frame, user: Value, gang: Value, gangtool: Value) {
	if (gangtool && gangtool.free_pen) {
		return "(GET ONE FREE)";
	}
	return parent_proc();
}, false);

rt.type(1288, "/datum/gang_item/equipment/gangtool", "/datum/gang_item/equipment", {
	id: "gangtool",
	cost: 10,
});

// gang_items.dm:390
rt.def("/datum/gang_item/equipment/gangtool/proc/spawn_item", function* spawn_item(f: Frame, user: Value, gang: Value, gangtool: Value) {
	let item_type: Value = null;
	if (gang && this.isboss(user, gang)) {
		item_type = T("/obj/item/device/gangtool/spare/lt");
		if (rt.len(f, gang.bosses) < 3) {
			to_chat(user, `<span class='notice'><b>Gangtools</b> allow you to promote a gangster to be your Lieutenant, enabling them to recruit and purchase items like you. Simply have them register the gangtool. You may promote up to ${3 - rt.len(f, gang.bosses)} more Lieutenants</span>`);
		}
	} else {
		item_type = T("/obj/item/device/gangtool/spare");
	}
	let tool: Value = (yield* new_(item_type, user.loc));
	yield* user.put_in_hands(tool);
	return f.dot;
}, true);

// gang_items.dm:400
rt.def("/datum/gang_item/equipment/gangtool/proc/get_name_display", function get_name_display(f: Frame, user: Value, gang: Value, gangtool: Value) {
	if (gang && this.isboss(user, gang) && rt.len(f, gang.bosses) < 3) {
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

// gang_items.dm:413
rt.def("/datum/gang_item/equipment/dominator/proc/can_buy", function can_buy(f: Frame, user: Value, gang: Value, gangtool: Value) {
	if (!gang || !gang.dom_attempts) {
		return 0;
	}
	return parent_proc();
}, false);

// gang_items.dm:418
rt.def("/datum/gang_item/equipment/dominator/proc/get_name_display", function get_name_display(f: Frame, user: Value, gang: Value, gangtool: Value) {
	if (!gang || !gang.dom_attempts) {
		return parent_proc();
	}
	return `<b>${parent_proc()}</b>`;
}, false);

// gang_items.dm:423
rt.def("/datum/gang_item/equipment/dominator/proc/get_cost_display", function get_cost_display(f: Frame, user: Value, gang: Value, gangtool: Value) {
	if (!gang || !gang.dom_attempts) {
		return "(Out of stock)";
	}
	return parent_proc();
}, false);

// gang_items.dm:429
rt.def("/datum/gang_item/equipment/dominator/proc/get_extra_info", function get_extra_info(f: Frame, user: Value, gang: Value, gangtool: Value) {
	if (!gang) return f.dot;
	return `(Estimated Takeover Time: ${round(determine_domination_time(gang) / 60, 0.1)} minutes)`;
});

// gang_items.dm:432
rt.def("/datum/gang_item/equipment/dominator/proc/purchase", function* purchase(f: Frame, user: Value, gang: Value, gangtool: Value) {
	let obj: Value = null;
	let usrarea: Value = get_area(user.loc);
	let usrturf: Value = rt.getStep(f, user.loc, 0);
	if (rt.initial(f, usrarea, "name") == "Space" || rt.istype(usrturf, T("/turf/open/space")) || f.usr.z != ZLEVEL_STATION) {
		to_chat(user, "<span class='warning'>You can only use this on the station!</span>");
		return 0;
	}
	for (obj of each(usrturf, T("/obj"))) {
		if (obj.density) {
			to_chat(user, "<span class='warning'>There's not enough room here!</span>");
			return 0;
		}
	}
	if (dominator_excessive_walls(user)) {
		to_chat(user, "<span class='warning'>The <b>dominator</b> will not function here! The <b>dominator</b> requires a sizable open space within three standard units so that walls do not interfere with the signal.</span>");
		return 0;
	}
	if (!rt.isIn(f, usrarea.type, rt.bitOr(gang.territory, gang.territory_new))) {
		to_chat(user, "<span class='warning'>The <b>dominator</b> can be spawned only on territory controlled by your gang!</span>");
		return 0;
	}
	return (yield* parent_proc());
}, true);

// gang_items.dm:453
rt.def("/datum/gang_item/equipment/dominator/proc/spawn_item", function* spawn_item(f: Frame, user: Value, gang: Value, gangtool: Value) {
	yield* new_(this.item_path, user.loc);
	return f.dot;
}, true);
