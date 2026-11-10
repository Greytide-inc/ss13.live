// Based on /tg/station's code/game/gamemodes/gang/gang_datum.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add } = rt;


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

// gang_datum.dm:8
rt.def("/datum/gang/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.gangsters = list();

	this.bosses = list();

	this.gangtools = list();

	this.tags_by_mind = list();

	this.territory = list();

	this.territory_new = list();

	this.territory_lost = list();
	return f.dot;
});

// gang_datum.dm:103
rt.def("/datum/gang/proc/New", function* New(f: Frame, loc: Value, gangname: Value) {
	if (!rt.len(f, GLOB.gang_colors_pool)) {
		message_admins("WARNING: Maximum number of gangs have been exceeded!");
		rt.throw_(f, (yield* new_(T("/exception"), "Maximum number of gangs has been exceeded", "code/game/gamemodes/gang/gang_datum.dm", 105)));
		return f.dot;
	} else {
		this.color = pick(GLOB.gang_colors_pool);
		GLOB.gang_colors_pool -= this.color;
		if (this.color === "red") {
			this.color_hex = "#DA0000";
			this.inner_outfit = pick(T("/obj/item/clothing/under/color/red"), T("/obj/item/clothing/under/lawyer/red"));
		} else if (this.color === "orange") {
			this.color_hex = "#FF9300";
			this.inner_outfit = pick(T("/obj/item/clothing/under/color/orange"), T("/obj/item/clothing/under/geisha"));
		} else if (this.color === "yellow") {
			this.color_hex = "#FFF200";
			this.inner_outfit = pick(T("/obj/item/clothing/under/color/yellow"), T("/obj/item/clothing/under/burial"), T("/obj/item/clothing/under/suit_jacket/tan"));
		} else if (this.color === "green") {
			this.color_hex = "#A8E61D";
			this.inner_outfit = pick(T("/obj/item/clothing/under/color/green"), T("/obj/item/clothing/under/syndicate/camo"), T("/obj/item/clothing/under/suit_jacket/green"));
		} else if (this.color === "blue") {
			this.color_hex = "#00B7EF";
			this.inner_outfit = pick(T("/obj/item/clothing/under/color/blue"), T("/obj/item/clothing/under/suit_jacket/navy"));
		} else if (this.color === "purple") {
			this.color_hex = "#DA00FF";
			this.inner_outfit = pick(T("/obj/item/clothing/under/color/lightpurple"), T("/obj/item/clothing/under/lawyer/purpsuit"));
		} else if (this.color === "white") {
			this.color_hex = "#FFFFFF";
			this.inner_outfit = pick(T("/obj/item/clothing/under/color/white"), T("/obj/item/clothing/under/suit_jacket/white"));
		}
	}
	this.name = gangname ? gangname : pick(GLOB.gang_name_pool);
	GLOB.gang_name_pool -= this.name;
	this.outer_outfit = pick(GLOB.gang_outfit_pool);
	this.ganghud = (yield* new_(T("/datum/atom_hud/antag/gang")));
	this.ganghud.color = this.color_hex;
	log_game(`The ${this.name} Gang has been created. Their gang color is ${this.color}.`);
	yield* this.build_item_list();
	return f.dot;
}, true);

// gang_datum.dm:142
rt.def("/datum/gang/proc/build_item_list", function* build_item_list(f: Frame) {
	let B: Value = null, G: Value = null, Cat: Value = null, S: Value = null;
	this.boss_item_list = list();
	this.boss_category_list = list();
	for (B of each(GLOB.boss_items)) {
		G = (yield* new_(B));
		rt.setAt(this.boss_item_list, G.id, G);
		if (Cat = rt.index(this.boss_category_list, G.category)) {
			Cat += G;
		} else {
			rt.setAt(this.boss_category_list, G.category, list(G));
		}
	}
	this.reg_item_list = list();
	this.reg_category_list = list();
	for (S of each(GLOB.soldier_items)) {
		G = (yield* new_(S));
		rt.setAt(this.reg_item_list, G.id, G);
		if (Cat = rt.index(this.reg_category_list, G.category)) {
			Cat += G;
		} else {
			rt.setAt(this.reg_category_list, G.category, list(G));
		}
	}
	return f.dot;
}, true);

// gang_datum.dm:165
rt.def("/datum/gang/proc/add_gang_hud", function add_gang_hud(f: Frame, recruit_mind: Value) {
	this.ganghud.join_hud(recruit_mind.current);
	let $0: any = GLOB.SSticker.mode;
	let $1: any = recruit_mind.current;
	$0.set_antag_hud($1, rt.isIn(f, recruit_mind, this.bosses) ? "gang_boss" : "gangster");
	return f.dot;
});

// gang_datum.dm:169
rt.def("/datum/gang/proc/remove_gang_hud", function remove_gang_hud(f: Frame, defector_mind: Value) {
	this.ganghud.leave_hud(defector_mind.current);
	GLOB.SSticker.mode.set_antag_hud(defector_mind.current, null);
	return f.dot;
});

// gang_datum.dm:173
rt.def("/datum/gang/proc/domination", function domination(f: Frame, modifier: Value) {
	modifier ??= 1;
	this.set_domination_time(determine_domination_time(this) * modifier);
	this.is_dominating = 1;
	set_security_level("delta");
	return f.dot;
});

// gang_datum.dm:178
rt.def("/datum/gang/proc/set_domination_time", function set_domination_time(f: Frame, d: Value) {
	this.domination_timer = rt.worldTime(f) + 10 * d;
	return f.dot;
});

// gang_datum.dm:181
rt.def("/datum/gang/proc/domination_time_remaining", function domination_time_remaining(f: Frame) {
	let diff: Value = null;
	return (diff = this.domination_timer - rt.worldTime(f)) / 10;
});

// gang_datum.dm:188
rt.def("/datum/gang/proc/message_gangtools", function message_gangtools(f: Frame, message: Value, beep: Value, warning: Value) {
	let tool: Value = null, mob: Value = null;
	let $e: any;
	beep ??= 1;
	if (!rt.len(f, this.gangtools) || !message) {
		return f.dot;
	}
	for (tool of each(this.gangtools, T("/obj/item/device/gangtool"))) {
		if ((mob = get(tool.loc, T("/mob/living"))) && mob.mind && mob.stat == 0) {
			if (mob.mind.gang_datum == this) {
				to_chat(mob, `<span class='${warning ? "warning" : "notice"}'>${bicon(tool)} ${message}</span>`);
			}
			return f.dot;
		}
	}
	return f.dot;
});

// gang_datum.dm:202
rt.def("/datum/gang/proc/income", function* income(f: Frame) {
	let reclaimed_territories: Value = null, area: Value = null, seconds_remaining: Value = null, new_time: Value = null;
	if (!rt.len(f, this.bosses)) {
		return f.dot;
	}
	let added_names: Value = "";
	let lost_names: Value = "";
	yield* GLOB.SSticker.mode.shuttle_check();
	(rt.modSrcVar(f, "territory", (reclaimed_territories = rt.bitAnd(this.territory_new, this.territory_lost)), rt.bitOr));
	this.territory_new -= reclaimed_territories;
	this.territory_lost -= reclaimed_territories;
	for (area of each(this.territory_lost)) {
		if (lost_names != "") {
			lost_names += ", ";
		}
		lost_names += `${rt.index(this.territory_lost, area)}`;
		this.territory -= area;
	}
	area = null;
	for (area of each(this.territory_new)) {
		if (added_names != "") {
			added_names += ", ";
		}
		added_names += `${rt.index(this.territory_new, area)}`;
		this.territory += area;
	}
	let message: Value = `<b>${this} Gang Status Report:</b>.<BR>*---------*<BR>`;
	message += `<b>${rt.len(f, this.territory_new)} new territories:</b><br><i>${added_names}</i><br>`;
	message += `<b>${rt.len(f, this.territory_lost)} territories lost:</b><br><i>${lost_names}</i><br>`;
	this.territory_new = list();
	this.territory_lost = list();
	let control: Value = round(rt.len(f, this.territory) / GLOB.start_state.num_territories * 100, 1);
	let sbonus: Value = rt.op(f, "Sqrt", [], [rt.length(this.territory)]);
	message += `Your gang now has <b>${control}% control</b> of the station.<BR>*---------*<BR>`;
	if (this.is_dominating) {
		seconds_remaining = this.domination_time_remaining();
		if ((new_time = max(180, seconds_remaining - rt.len(f, this.territory) * 2)) < seconds_remaining) {
			message += `Takeover shortened by ${seconds_remaining - new_time} seconds for defending ${rt.len(f, this.territory)} territories.<BR>`;
			this.set_domination_time(new_time);
		}
		message += `<b>${seconds_remaining} seconds remain</b> in hostile takeover.<BR>`;
	} else {
		this.pay_territory_income_to_bosses();
		this.pay_territory_income_to_soldiers(sbonus);
		this.pay_all_clothing_bonuses();
		this.announce_all_influence();
	}
	return f.dot;
}, true);

// gang_datum.dm:255
rt.def("/datum/gang/proc/pay_all_clothing_bonuses", function pay_all_clothing_bonuses(f: Frame) {
	let mind: Value = null;
	for (mind of each(rt.bitOr(this.gangsters, this.bosses), T("/datum/mind"))) {
		this.pay_clothing_bonus(mind);
	}
	return f.dot;
});

// gang_datum.dm:261
rt.def("/datum/gang/proc/pay_clothing_bonus", function pay_clothing_bonus(f: Frame, gangsta: Value) {
	let C: Value = null;
	let gangbanger: Value = gangsta.current;
	f.dot = 0;
	if (!rt.istype(gangbanger, T("/mob/living/carbon/human")) || gangbanger.stat == 2) {
		return 0;
	}
	for (C of each(gangbanger.contents, T("/obj/item"))) {
		if (C.type == this.inner_outfit) {
			f.dot += 2;
			continue;
		}
		if (C.type == this.outer_outfit) {
			f.dot += 2;
			continue;
		}
		f.dot += C.gang_contraband_value();
	}
	this.adjust_influence(gangsta, f.dot);
	if (f.dot) {
		this.announce_to_mind(gangsta, `<span class='notice'>Your influential choice of clothing has increased your influence by ${f.dot} points!</span>`);
	} else {
		this.announce_to_mind(gangsta, "<span class='warning'>Unfortunately, you have not gained any additional influence from your drab, old, boring clothing. Learn to dress like a gangsta, bro!</span>");
	}
	return f.dot;
});

// gang_datum.dm:281
rt.def("/datum/gang/proc/pay_soldier_territory_income", function pay_soldier_territory_income(f: Frame, soldier: Value, sbonus: Value) {
	sbonus ??= 0;
	f.dot = 0;
	f.dot = max(0, round(3 - rt.index(this.gangsters, soldier) / 10)) + sbonus + this.get_soldier_territories(soldier) / 2;
	this.adjust_influence(soldier, f.dot);
	return f.dot;
});

// gang_datum.dm:285
rt.def("/datum/gang/proc/get_soldier_territories", function get_soldier_territories(f: Frame, soldier: Value) {
	let tags: Value = null;
	if (!rt.istype(rt.index(this.tags_by_mind, soldier), T("/list"))) {
		return 0;
	}
	return rt.len(f, (tags = rt.index(this.tags_by_mind, soldier)));
});

// gang_datum.dm:291
rt.def("/datum/gang/proc/pay_territory_income_to_soldiers", function pay_territory_income_to_soldiers(f: Frame, sbonus: Value) {
	let soldier: Value = null, returned: Value = null;
	sbonus ??= 0;
	for (soldier of each(this.gangsters, T("/datum/mind"))) {
		if (!(returned = this.pay_soldier_territory_income(soldier))) {
			this.announce_to_mind(soldier, "<span class='warning'>You have not gained any influence from territories you personally tagged. Get to work, soldier!</span>");
		} else {
			this.announce_to_mind(soldier, `<span class='notice'>You have gained ${returned} influence from ${this.get_soldier_territories(soldier)} territories you have personally tagged.</span>`);
		}
	}
	return f.dot;
});

// gang_datum.dm:299
rt.def("/datum/gang/proc/announce_all_influence", function announce_all_influence(f: Frame) {
	let MG: Value = null;
	for (MG of each(rt.bitOr(this.bosses, this.gangsters), T("/datum/mind"))) {
		this.announce_total_influence(MG);
	}
	return f.dot;
});

// gang_datum.dm:304
rt.def("/datum/gang/proc/pay_territory_income_to_bosses", function pay_territory_income_to_bosses(f: Frame) {
	let boss_mind: Value = null, inc: Value = null;
	f.dot = 0;
	for (boss_mind of each(this.bosses, T("/datum/mind"))) {
		f.dot += (inc = max(0, round(5 - rt.index(this.bosses, boss_mind) / 10)) + rt.length(this.territory));
		this.adjust_influence(boss_mind, inc);
		this.announce_to_mind(boss_mind, `<span class='boldnotice'>Your influence has increased by ${inc} from your gang holding ${rt.length(this.territory)} territories!</span>`);
	}
	return f.dot;
});

// gang_datum.dm:311
rt.def("/datum/gang/proc/get_influence", function get_influence(f: Frame, gangster_mind: Value) {
	if (rt.isIn(f, gangster_mind, this.gangsters)) {
		return rt.index(this.gangsters, gangster_mind);
	}
	if (!rt.isIn(f, gangster_mind, this.bosses)) return f.dot;
	return rt.index(this.bosses, gangster_mind);
});

// gang_datum.dm:317
rt.def("/datum/gang/proc/adjust_influence", function adjust_influence(f: Frame, gangster_mind: Value, amount: Value) {
	if (rt.isIn(f, gangster_mind, this.gangsters)) {
		rt.modAt(this.gangsters, gangster_mind, amount, add);
	}
	if (!rt.isIn(f, gangster_mind, this.bosses)) return f.dot;
	rt.modAt(this.bosses, gangster_mind, amount, add);
	return f.dot;
});

// gang_datum.dm:323
rt.def("/datum/gang/proc/announce_to_mind", function announce_to_mind(f: Frame, gangster_mind: Value, message: Value) {
	if (!(gangster_mind.current && gangster_mind.current.stat != 2)) return f.dot;
	to_chat(gangster_mind.current, message);
	return f.dot;
});

// gang_datum.dm:327
rt.def("/datum/gang/proc/announce_total_influence", function announce_total_influence(f: Frame, gangster_mind: Value) {
	this.announce_to_mind(gangster_mind, `<span class='boldnotice'>${this.name} Gang: You now have a total of ${this.get_influence(gangster_mind)} influence!</span>`);
	return f.dot;
});

// gang_datum.dm:330
rt.def("/datum/gang/proc/reclaim_points", function reclaim_points(f: Frame, amount: Value) {
	let bawss: Value = null;
	for (bawss of each(this.bosses, T("/datum/mind"))) {
		this.adjust_influence(bawss, amount / rt.len(f, this.bosses));
		this.announce_to_mind(bawss, `<span class='notice'>${this.name} Gang: ${amount / rt.len(f, this.bosses)} influence given from internal automatic restructuring.</span>`);
	}
	return f.dot;
});

rt.type(1248, "/datum/gang/multiverse", "/datum/gang", {
	dom_attempts: 0,
	fighting_style: "multiverse",
	is_deconvertible: 0,
});

// gang_datum.dm:342
rt.def("/datum/gang/multiverse/proc/New", function New(f: Frame, loc: Value, multiverse_override: Value) {
	this.name = multiverse_override;
	this.ganghud = new_(T("/datum/atom_hud/antag/gang"));
	return f.dot;
});
