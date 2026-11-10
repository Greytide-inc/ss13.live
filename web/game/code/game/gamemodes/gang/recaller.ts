// Based on /tg/station's code/game/gamemodes/gang/recaller.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


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

// recaller.dm:18
rt.def("/obj/item/device/gangtool/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tags = list();
	return f.dot;
});

// recaller.dm:21
rt.def("/obj/item/device/gangtool/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	if (GLOB.SSticker.mode.gang_points) return f.dot;
	GLOB.SSticker.mode.gang_points = (yield* new_(T("/datum/gang_points"), GLOB.SSticker.mode));
	return f.dot;
}, true);

// recaller.dm:26
rt.def("/obj/item/device/gangtool/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let dat: Value = null, isboss: Value = null, cat: Value = null, V: Value = null, G: Value = null, cost: Value = null, toAdd: Value = null, extra: Value = null, popup: Value = null;
	let $0: any, $1: any, $e: any;
	if (!this.can_use(user)) {
		return f.dot;
	}
	if (!this.gang) {
		dat += "This device is not registered.<br><br>";
		if (rt.isIn(f, user.mind, GLOB.SSticker.mode.get_gang_bosses())) {
			if (this.promotable && rt.len(f, user.mind.gang_datum.bosses) < 3) {
				dat += "Give this device to another member of your organization to use to promote them to Lieutenant.<br><br>";
				dat += "If this is meant as a spare device for yourself:<br>";
			}
			dat += fmt("<a href='?src=＃;register=1'>Register Device as Spare</a><br>", [this]);
		} else if (this.promotable) {
			if (rt.len(f, user.mind.gang_datum.bosses) < 3) {
				dat += "You have been selected for a promotion!<br>";
				dat += fmt("<a href='?src=＃;register=1'>Accept Promotion</a><br>", [this]);
			} else {
				dat += "No promotions available: All positions filled.<br>";
			}
		} else {
			dat += "This device is not authorized to promote.<br>";
		}
	} else {
		if (this.gang.is_dominating) {
			dat += `<center><font color='red'>Takeover In Progress:<br><B>${this.gang.domination_time_remaining()} seconds remain</B></font></center>`;
		}
		isboss = (user.mind == rt.index(this.gang.bosses, 1) ? 1 : 0);
		$0 = this.gang.name;
		if (isboss) {

			$1 = "Boss";
		} else {
			$1 = "Lieutenant";
		}
		dat += `Registration: <B>${$0} Gang ${$1}</B><br>`;
		dat += `Organization Size: <B>${rt.len(f, this.gang.gangsters) + rt.len(f, this.gang.bosses)}</B> | Station Control: <B>${round(rt.len(f, this.gang.territory) / GLOB.start_state.num_territories * 100, 1)}%</B><br>`;
		dat += `Your Influence: <B>${this.gang.get_influence(user.mind)}</B><br>`;
		dat += `Time until Influence grows: <B>${time2text(GLOB.SSticker.mode.gang_points.next_point_time - rt.worldTime(f), "mm:ss")}</B><br>`;
		dat += "<hr>";
		for (cat of each(this.gang.boss_category_list)) {
			dat += `<b>${cat}</b><br>`;
			V = null;
			for (V of each(rt.index(this.gang.boss_category_list, cat))) {
				if (!(G = V).can_see(user, this.gang, this)) {
					continue;
				}
				if (cost = G.get_cost_display(user, this.gang, this)) {
					dat += cost + " ";
				}
				toAdd = G.get_name_display(user, this.gang, this);
				if (G.can_buy(user, this.gang, this)) {
					toAdd = fmt("<a href='?src=＃;purchase=＀'>＀</a>", [this, G.id, toAdd]);
				}
				dat += toAdd;
				if (extra = G.get_extra_info(user, this.gang, this)) {
					dat += `<br><i>${extra}</i>`;
				}
				dat += "<br>";
			}
			dat += "<br>";
		}
	}
	dat += fmt("<a href='?src=＃;choice=refresh'>Refresh</a><br>", [this]);
	(popup = (yield* new_(T("/datum/browser"), user, "gangtool", "Welcome to GangTool v3.5", 340, 625))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// recaller.dm:87
rt.def("/obj/item/device/gangtool/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let G: Value = null;
	if (!this.can_use(f.usr)) {
		return f.dot;
	}
	yield* this.add_fingerprint(f.usr);
	if (rt.at(href_list, "register")) {
		yield* this.register_device(f.usr);
	} else if (!this.gang) {
		return f.dot;
	}
	if (rt.at(href_list, "purchase")) {
		if ((G = rt.index(this.gang.boss_item_list, rt.at(href_list, "purchase"))) && G.can_buy(f.usr, this.gang, this)) {
			yield* G.purchase(f.usr, this.gang, this, 0);
		}
	}
	yield* this.attack_self(f.usr);
	return f.dot;
}, true);

// recaller.dm:107
rt.def("/obj/item/device/gangtool/proc/ping_gang", function* ping_gang(f: Frame, user: Value) {
	let message: Value = null, gang_rank: Value = null, ganger: Value = null, M: Value = null, link: Value = null;
	let $e: any;
	if (!user) {
		return f.dot;
	}
	if (!(message = (yield* stripped_input(user, "Discreetly send a gang-wide message.", "Send Message"))) || !this.can_use(user)) {
		return f.dot;
	}
	if (user.z > 2) {
		to_chat(user, `<span class='info'>${bicon(this)}Error: Station out of range.</span>`);
		return f.dot;
	}
	let members: Value = list();
	members += this.gang.gangsters;
	if (!rt.len(f, (members += this.gang.bosses))) return f.dot;
	const subject = (gang_rank = this.gang.bosses.Find(user.mind));
	if (subject === 1) {
		gang_rank = "Gang Boss";
	} else if (subject === 2) {
		gang_rank = "1st Lieutenant";
	} else if (subject === 3) {
		gang_rank = "2nd Lieutenant";
	} else if (subject === 4) {
		gang_rank = "3rd Lieutenant";
	} else {
		gang_rank = `${gang_rank - 1}th Lieutenant`;
	}
	let ping: Value = `<span class='danger'><B><i>${this.gang.name} ${gang_rank}</i>: ${message}</B></span>`;
	for (ganger of each(members, T("/datum/mind"))) {
		if (ganger.current && ganger.current.z <= 2 && ganger.current.stat == 0) {
			to_chat(ganger.current, ping);
		}
	}
	for (M of each(GLOB.dead_mob_list, T("/mob"))) {
		link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [M, user]);
		to_chat(M, `${link} ${ping}`);
	}
	log_game(`${key_name(user)} Messaged ${this.gang.name} Gang: ${message}.`);
	return f.dot;
}, true);

// recaller.dm:144
rt.def("/obj/item/device/gangtool/proc/register_device", function* register_device(f: Frame, user: Value) {
	let cached_influence: Value = null;
	if (this.gang) {
		return f.dot;
	}
	if (this.promotable && rt.isIn(f, user.mind, GLOB.SSticker.mode.get_gangsters()) || rt.isIn(f, user.mind, GLOB.SSticker.mode.get_gang_bosses())) {
		this.gang = user.mind.gang_datum;
		this.gang.gangtools += this;
		this.icon_state = `gangtool-${this.gang.color}`;
		if (!rt.isIn(f, user.mind, this.gang.bosses)) {
			cached_influence = rt.index(this.gang.gangsters, user.mind);
			yield* GLOB.SSticker.mode.remove_gangster(user.mind, 0, 2);
			rt.setAt(this.gang.bosses, user.mind, cached_influence);
			user.mind.gang_datum = this.gang;
			user.mind.special_role = `${this.gang.name} Gang Lieutenant`;
			this.gang.add_gang_hud(user.mind);
			log_game(`${key_name(user)} has been promoted to Lieutenant in the ${this.gang.name} Gang`);
			this.free_pen = 1;
			this.gang.message_gangtools(`${user} has been promoted to Lieutenant.`);
			to_chat(user, "<FONT size=3 color=red><B>You have been promoted to Lieutenant!</B></FONT>");
			GLOB.SSticker.mode.forge_gang_objectives(user.mind);
			GLOB.SSticker.mode.greet_gang(user.mind, 0);
			to_chat(user, "The <b>Gangtool</b> you registered will allow you to purchase weapons and equipment, and send messages to your gang.");
			to_chat(user, "Unlike regular gangsters, you may use <b>recruitment pens</b> to add recruits to your gang. Use them on unsuspecting crew members to recruit them. Don't forget to get your one free pen from the gangtool.");
		}
	} else {
		to_chat(f.usr, "<span class='warning'>ACCESS DENIED: Unauthorized user.</span>");
	}
	return f.dot;
}, true);

// recaller.dm:167
rt.def("/obj/item/device/gangtool/proc/recall", function* recall(f: Frame, user: Value) {
	let userturf: Value = null, end_state: Value = null;
	if (!this.can_use(user)) {
		return 0;
	}
	if (GLOB.SSshuttle.emergencyNoRecall) {
		return 0;
	}
	if (this.recalling) {
		to_chat(f.usr, "<span class='warning'>Error: Recall already in progress.</span>");
		return 0;
	}
	if (!this.gang.recalls) {
		to_chat(f.usr, "<span class='warning'>Error: Unable to access communication arrays. Firewall has logged our signature and is blocking all further attempts.</span>");
	}
	this.gang.message_gangtools(`${f.usr} is attempting to recall the emergency shuttle.`);
	this.recalling = 1;
	to_chat(this.loc, `<span class='info'>${bicon(this)}Generating shuttle recall order with codes retrieved from last call signal...</span>`);
	yield* sleep(rand(100, 300));
	if (GLOB.SSshuttle.emergency.mode != "call") {
		to_chat(user, `<span class='warning'>${bicon(this)}Emergency shuttle cannot be recalled at this time.</span>`);
		this.recalling = 0;
		return 0;
	}
	to_chat(this.loc, `<span class='info'>${bicon(this)}Shuttle recall order generated. Accessing station long-range communication arrays...</span>`);
	yield* sleep(rand(100, 300));
	if (!this.gang.dom_attempts) {
		to_chat(user, `<span class='warning'>${bicon(this)}Error: Unable to access communication arrays. Firewall has logged our signature and is blocking all further attempts.</span>`);
		this.recalling = 0;
		return 0;
	}
	if ((userturf = rt.getStep(f, user, 0)).z != ZLEVEL_STATION) {
		to_chat(user, `<span class='warning'>${bicon(this)}Error: Device out of range of station communication arrays.</span>`);
		this.recalling = 0;
		return 0;
	}
	(end_state = (yield* new_(T("/datum/station_state")))).count();
	if (100 * GLOB.start_state.score(end_state) < 80) {
		to_chat(user, `<span class='warning'>${bicon(this)}Error: Station communication systems compromised. Unable to establish connection.</span>`);
		this.recalling = 0;
		return 0;
	}
	to_chat(this.loc, `<span class='info'>${bicon(this)}Comm arrays accessed. Broadcasting recall signal...</span>`);
	yield* sleep(rand(100, 300));
	this.recalling = 0;
	log_game(`${key_name(user)} has tried to recall the shuttle with a gangtool.`);
	message_admins(`${key_name_admin(user)} has tried to recall the shuttle with a gangtool.`, 1);
	if ((userturf = rt.getStep(f, user, 0)).z == ZLEVEL_STATION) {
		if (yield* GLOB.SSshuttle.cancelEvac(user)) {
			this.gang.recalls -= 1;
			return 1;
		}
	}
	to_chat(this.loc, `<span class='info'>${bicon(this)}No response recieved. Emergency shuttle cannot be recalled at this time.</span>`);
	return 0;
}, true);

// recaller.dm:227
rt.def("/obj/item/device/gangtool/proc/can_use", function can_use(f: Frame, user: Value) {
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		return 0;
	}
	if (user.incapacitated()) {
		return 0;
	}
	if (!rt.isIn(f, this, user.contents)) {
		return 0;
	}
	if (!user.mind) {
		return 0;
	}
	if (this.gang && rt.isIn(f, user.mind, this.gang.bosses)) {
		return 1;
	} else if (rt.isIn(f, user.mind, GLOB.SSticker.mode.get_all_gangsters())) {
		return 1;
	}
	return 0;
});

rt.type(9147, "/obj/item/device/gangtool/soldier", "/obj/item/device/gangtool", {});

// recaller.dm:250
rt.def("/obj/item/device/gangtool/soldier/proc/New", function* New(f: Frame, user: Value) {
	let GT: Value = null;
	f.dot = (yield* parent_proc());
	this.gang = user.mind.gang_datum;
	this.gang.gangtools += this;
	yield* (GT = (yield* new_(T("/datum/action/innate/gang/tool")))).Grant(user, this, this.gang);
	return f.dot;
}, true);

// recaller.dm:257
rt.def("/obj/item/device/gangtool/soldier/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let dat: Value = null, _T: Value = null, cat: Value = null, V: Value = null, G: Value = null, cost: Value = null, toAdd: Value = null, extra: Value = null, popup: Value = null;
	if (!this.can_use(user)) {
		return f.dot;
	}
	if (this.gang.is_dominating) {
		dat += `<center><font color='red'>Takeover In Progress:<br><B>${this.gang.domination_time_remaining()} seconds remain</B></font></center>`;
	}
	dat += `Registration: <B>${this.gang.name} - Foot Soldier</B><br>`;
	dat += `Organization Size: <B>${rt.len(f, this.gang.gangsters) + rt.len(f, this.gang.bosses)}</B> | Station Control: <B>${round(rt.len(f, this.gang.territory) / GLOB.start_state.num_territories * 100, 1)}%</B><br>`;
	dat += `Your Influence: <B>${this.gang.get_influence(user.mind)}</B><br>`;
	if (rt.length(this.tags)) {
		dat += "Your tags generate bonus influence for you.<br> You have tagged the following territories:";
		for (_T of each(this.tags, T("/obj/effect/decal/cleanable/crayon/gang"))) {
			dat += ` ${_T.territory} -`;
		}
	} else {
		dat += "You have not personally tagged any territory for your gang. Use a spray can to mark your territory and receive bonus influence.";
	}
	dat += `<br>Time until Influence grows: <B>${time2text(GLOB.SSticker.mode.gang_points.next_point_time - rt.worldTime(f), "mm:ss")}</B><br>`;
	dat += "<hr>";
	for (cat of each(this.gang.reg_category_list)) {
		dat += `<b>${cat}</b><br>`;
		V = null;
		for (V of each(rt.index(this.gang.reg_category_list, cat))) {
			if (!(G = V).can_see(user, this.gang, this)) {
				continue;
			}
			if (cost = G.get_cost_display(user, this.gang, this)) {
				dat += cost + " ";
			}
			toAdd = G.get_name_display(user, this.gang, this);
			if (G.can_buy(user, this.gang, this)) {
				toAdd = fmt("<a href='?src=＃;purchase=＀'>＀</a>", [this, G.id, toAdd]);
			}
			dat += toAdd;
			if (extra = G.get_extra_info(user, this.gang, this)) {
				dat += `<br><i>${extra}</i>`;
			}
			dat += "<br>";
		}
		dat += "<br>";
	}
	dat += fmt("<a href='?src=＃;choice=refresh'>Refresh</a><br>", [this]);
	(popup = (yield* new_(T("/datum/browser"), user, "gangtool", "Welcome to GangTool v3.5", 340, 625))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// recaller.dm:301
rt.def("/obj/item/device/gangtool/soldier/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let G: Value = null;
	if (!this.can_use(f.usr)) {
		return f.dot;
	}
	if (rt.at(href_list, "purchase")) {
		if ((G = rt.index(this.gang.reg_item_list, rt.at(href_list, "purchase"))) && G.can_buy(f.usr, this.gang, this)) {
			yield* G.purchase(f.usr, this.gang, this, 0);
		}
	}
	yield* this.attack_self(f.usr);
	return f.dot;
}, true);

rt.type(100, "/datum/action/innate/gang", "/datum/action/innate", {
	background_icon_state: "bg_spell",
});

// recaller.dm:314
rt.def("/datum/action/innate/gang/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (rt.isIn(f, ((!this.owner.mind ? 1 : 0) || (!this.owner.mind ? 1 : 0)), GLOB.SSticker.mode.get_all_gangsters())) {
		return 0;
	}
	return parent_proc();
});

rt.type(101, "/datum/action/innate/gang/tool", "/datum/action/innate/gang", {
	GT: null,
	name: "Personal Gang Tool",
	desc: "An implanted gang tool that lets you purchase gear",
	background_icon_state: "bg_mime",
	button_icon_state: "bolt_action",
});

// recaller.dm:326
rt.def("/datum/action/innate/gang/tool/proc/Grant", function* Grant(f: Frame, user: Value, reg: Value, G: Value) {
	f.dot = (yield* parent_proc());
	this.GT = reg;
	this.button.color = G.color;
	return f.dot;
}, true);

// recaller.dm:331
rt.def("/datum/action/innate/gang/tool/proc/Activate", function* Activate(f: Frame) {
	yield* this.GT.attack_self(this.owner);
	return f.dot;
}, true);
