// Based on /tg/station's code/modules/paperwork/paper.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(6562, "/obj/item/weapon/paper", "/obj/item/weapon", {
	info: null,
	info_links: null,
	stamps: null,
	fields: 0,
	stamped: null,
	rigged: 0,
	spam_flag: 0,
	contact_poison: null,
	contact_poison_volume: 0,
	throw_range: 1,
	throw_speed: 1,
	pressure_resistance: 0,
	name: "paper",
	gender: "neuter",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "paper",
	item_state: "paper",
	throwforce: 0,
	w_class: 1,
	slot_flags: 64,
	body_parts_covered: 1,
	resistance_flags: 4,
	obj_integrity: 50,
	max_integrity: 50,
	dog_fashion: rt.typePath("/datum/dog_fashion/head"),
});

// paper.dm:38
rt.def("/obj/item/weapon/paper/proc/pickup", function* pickup(f: Frame, user: Value) {
	let H: Value = null, G: Value = null;
	if (this.contact_poison && rt.istype(user, T("/mob/living/carbon/human"))) {
		H = user;
		if (!rt.istype((G = H.gloves), T("/obj/item/clothing/gloves")) || G.transfer_prints) {
			yield* H.reagents.add_reagent(this.contact_poison, this.contact_poison_volume);
			this.contact_poison = null;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// paper.dm:48
rt.def("/obj/item/weapon/paper/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.pixel_y = rand(-8, 8);
	this.pixel_x = rand(-9, 9);
	yield* this.update_icon();
	this.updateinfolinks();
	return f.dot;
}, true);

// paper.dm:57
rt.def("/obj/item/weapon/paper/proc/update_icon", function update_icon(f: Frame) {
	if (rt.bitAnd(this.resistance_flags, 8)) {
		this.icon_state = "paper_onfire";
		return f.dot;
	}
	if (this.info) {
		this.icon_state = "paper_words";
		return f.dot;
	}
	this.icon_state = "paper";
	return f.dot;
});

// paper.dm:67
rt.def("/obj/item/weapon/paper/proc/examine", function* examine(f: Frame, user: Value) {
	let assets: Value = null;
	yield* parent_proc();
	yield* (assets = (yield* get_asset_datum(T("/datum/asset/simple/paper")))).send(user);
	if (rt.istype(this, T("/obj/item/weapon/paper/talisman"))) {
		if (!iscultist(user) && !user.stat) {
			to_chat(user, "<span class='danger'>There are indecipherable images scrawled on the paper in what looks to be... <i>blood?</i></span>");
			return f.dot;
		}
	}
	if (get_dist(user, this) <= 1 || rt.istype(user, T("/mob/dead/observer"))) {
		if (user.is_literate()) {
			rt.op(f, "Browse", [], [user, `<HTML><HEAD><TITLE>${this.name}</TITLE></HEAD><BODY>${this.info}<HR>${this.stamps}</BODY></HTML>`, `window=${this.name}`], false);
			onclose(user, `${this.name}`);
		} else {
			rt.op(f, "Browse", [], [user, `<HTML><HEAD><TITLE>${this.name}</TITLE></HEAD><BODY>${stars(this.info)}<HR>${this.stamps}</BODY></HTML>`, `window=${this.name}`], false);
			onclose(user, `${this.name}`);
		}
	} else {
		to_chat(user, "<span class='notice'>It is too far away.</span>");
	}
	return f.dot;
}, true);

// paper.dm:91
rt.def("/obj/item/weapon/paper/verb/rename", function* rename(f: Frame) {
	let H: Value = null;
	if (f.usr.incapacitated() || !f.usr.is_literate()) {
		return f.dot;
	}
	if (rt.istype(f.usr, T("/mob/living/carbon/human"))) {
		if (rt.bitAnd((H = f.usr).disabilities, 256) && prob(25)) {
			to_chat(H, "<span class='warning'>You cut yourself on the paper! Ahhhh! Ahhhhh!</span>");
			H.damageoverlaytemp = 9001;
			yield* H.update_damage_hud();
			return f.dot;
		}
	}
	let n_name: Value = (yield* stripped_input(f.usr, "What would you like to label the paper?", "Paper Labelling", null, 42));
	if (this.loc == f.usr && f.usr.stat == 0) {
		this.name = `paper${n_name ? `- '${n_name}'` : null}`;
	}
	yield* this.add_fingerprint(f.usr);
	return f.dot;
}, true, { verb: { name: "Rename paper", category: "Object", src: 11 } });

// paper.dm:106
rt.def("/obj/item/weapon/paper/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} scratches a grid on ${user.p_their()} wrist with the paper! It looks like ${user.p_theyre()} trying to commit sudoku...</span>`);
	return 1;
});

// paper.dm:110
rt.def("/obj/item/weapon/paper/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* user.examinate(this);
	if (!(this.rigged && GLOB.SSevents.holidays && rt.index(GLOB.SSevents.holidays, "April Fool's Day"))) return f.dot;
	if (this.spam_flag != 0) return f.dot;
	this.spam_flag = 1;
	playsound(this.loc, rt.rsc("sound/items/bikehorn.ogg"), 50, 1);
	rt.spawnTail(f, 20, "/obj/item/weapon/paper/proc/attack_self: spawn at modules/paperwork/paper.dm:115", user);
	return f.dot;
}, true);

// a spawn(20) body of /obj/item/weapon/paper/proc/attack_self, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/paper/proc/attack_self: spawn at modules/paperwork/paper.dm:115", function* (f: Frame, user: Value) {
	this.spam_flag = 0;
	return null;
});

// paper.dm:121
rt.def("/obj/item/weapon/paper/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	let dist: Value = null;
	if (rt.istype(user, T("/mob/living/silicon/ai")) && user.current) {
		dist = get_dist(this, user.current);
	} else {
		dist = get_dist(this, user);
	}
	if (dist < 2) {
		rt.op(f, "Browse", [], [f.usr, `<HTML><HEAD><TITLE>${this.name}</TITLE></HEAD><BODY>${this.info}<HR>${this.stamps}</BODY></HTML>`, `window=${this.name}`], false);
		onclose(f.usr, `${this.name}`);
	} else {
		rt.op(f, "Browse", [], [f.usr, `<HTML><HEAD><TITLE>${this.name}</TITLE></HEAD><BODY>${stars(this.info)}<HR>${this.stamps}</BODY></HTML>`, `window=${this.name}`], false);
		onclose(f.usr, `${this.name}`);
	}
	return f.dot;
});

// paper.dm:140
rt.def("/obj/item/weapon/paper/proc/addtofield", function addtofield(f: Frame, id: Value, text: Value, links: Value) {
	let istart: Value = null, iend: Value = null, before: Value = null, after: Value = null;
	links ??= 0;
	let locid: Value = 0;
	let laststart: Value = 1;
	let textindex: Value = 1;
	while (true) {
		istart = 0;
		if (links) {
			istart = findtext(this.info_links, "<span class=\"paper_field\">", laststart);
		} else {
			istart = findtext(this.info, "<span class=\"paper_field\">", laststart);
		}
		if (istart == 0) {
			return f.dot;
		}
		laststart = istart + 1;
		locid++;
		if (locid == id) {
			iend = 1;
			if (links) {
				iend = findtext(this.info_links, "</span>", istart);
			} else {
				iend = findtext(this.info, "</span>", istart);
			}
			textindex = iend;
			break;
		}
	}
	if (links) {
		before = copytext(this.info_links, 1, textindex);
		after = copytext(this.info_links, textindex);
		this.info_links = before + text + after;
	} else {
		before = copytext(this.info, 1, textindex);
		after = copytext(this.info, textindex);
		this.info = before + text + after;
		this.updateinfolinks();
	}
	return f.dot;
});

// paper.dm:172
rt.def("/obj/item/weapon/paper/proc/updateinfolinks", function updateinfolinks(f: Frame) {
	let i: Value = null;
	let $e: any;
	this.info_links = this.info;
	rt.forRange(f, 0, 1, min(this.fields, 15), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		this.addtofield(i, fmt("<font face=\"＀\"><A href='?src=＃;write=＀'>write</A></font>", ["Verdana", this, i]), 1);
	}
	rt.endFor(f, 0);
	this.info_links = this.info_links + fmt("<font face=\"＀\"><A href='?src=＃;write=end'>write</A></font>", ["Verdana", this]);
	return f.dot;
});

// paper.dm:181
rt.def("/obj/item/weapon/paper/proc/clearpaper", function clearpaper(f: Frame) {
	this.info = null;
	this.stamps = null;
	if (this.stamped) {
		this.stamped.Cut();
	}
	this.cut_overlays();
	this.updateinfolinks();
	this.update_icon();
	return f.dot;
});

// paper.dm:188
rt.def("/obj/item/weapon/paper/proc/parsepencode", function parsepencode(f: Frame, t: Value, _P: Value, user: Value, iscrayon: Value) {
	let C: Value = null, i: Value = null;
	iscrayon ??= 0;
	if (rt.length(t) < 1) {
		return f.dot;
	}
	t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext(t, "[center]", "<center>")), "[/center]", "</center>")), "[br]", "<BR>")), "\n", "<BR>")), "[b]", "<B>")), "[/b]", "</B>")), "[i]", "<I>")), "[/i]", "</I>")), "[u]", "<U>")), "[/u]", "</U>")), "[large]", "<font size=\"4\">")), "[/large]", "</font>")), "[sign]", `<font face="${"Times New Roman"}"><i>${user.real_name}</i></font>`)), "[field]", "<span class=\"paper_field\"></span>")), "[tab]", "&nbsp;&nbsp;&nbsp;&nbsp;");
	if (!iscrayon) {
		t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext(t, "[*]", "<li>")), "[hr]", "<HR>")), "[small]", "<font size = \"1\">")), "[/small]", "</font>")), "[list]", "<ul>")), "[/list]", "</ul>");
		t = `<font face="${_P.font}" color=${_P.colour}>${t}</font>`;
	} else {
		C = _P;
		t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext(t, "[*]", "")), "[hr]", "")), "[small]", "")), "[/small]", "")), "[list]", "")), "[/list]", "");
		t = `<font face="${"Comic Sans MS"}" color=${C.paint_color}><b>${t}</b></font>`;
	}
	let laststart: Value = 1;
	while (true) {
		if ((i = findtext(t, "<span class=\"paper_field\">", laststart)) == 0) {
			break;
		}
		laststart = i + 1;
		this.fields++;
	}
	return t;
});

// paper.dm:246
rt.def("/obj/item/weapon/paper/proc/reload_fields", function reload_fields(f: Frame) {
	let i: Value = null;
	this.fields = 0;
	let laststart: Value = 1;
	while (true) {
		if ((i = findtext(this.info, "<span class=\"paper_field\">", laststart)) == 0) {
			break;
		}
		laststart = i + 1;
		this.fields++;
	}
	this.updateinfolinks();
	return f.dot;
});

// paper.dm:255
rt.def("/obj/item/weapon/paper/proc/openhelp", function openhelp(f: Frame, user: Value) {
	rt.op(f, "Browse", [], [user, "<HTML><HEAD><TITLE>Paper Help</TITLE></HEAD>\n\t<BODY>\n\t\t<b><center>Crayon&Pen commands</center></b><br>\n\t\t<br>\n\t\t[br] : Creates a linebreak.<br>\n\t\t[center] - [/center] : Centers the text.<br>\n\t\t[b] - [/b] : Makes the text <b>bold</b>.<br>\n\t\t[i] - [/i] : Makes the text <i>italic</i>.<br>\n\t\t[u] - [/u] : Makes the text <u>underlined</u>.<br>\n\t\t[large] - [/large] : Increases the <font size = \"4\">size</font> of the text.<br>\n\t\t[sign] : Inserts a signature of your name in a foolproof way.<br>\n\t\t[field] : Inserts an invisible field which lets you start type from there. Useful for forms.<br>\n\t\t<br>\n\t\t<b><center>Pen exclusive commands</center></b><br>\n\t\t[small] - [/small] : Decreases the <font size = \"1\">size</font> of the text.<br>\n\t\t[list] - [/list] : A list.<br>\n\t\t[*] : A dot used for lists.<br>\n\t\t[hr] : Adds a horizontal rule.\n\t</BODY></HTML>", "window=paper_help"], false);
	return f.dot;
});

// paper.dm:277
rt.def("/obj/item/weapon/paper/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let t: Value = null;
	yield* parent_proc();
	if (f.usr.stat || f.usr.restrained()) {
		return f.dot;
	}
	if (rt.at(href_list, "help")) {
		this.openhelp(f.usr);
		return f.dot;
	}
	if (!rt.at(href_list, "write")) return f.dot;
	let id: Value = rt.at(href_list, "write");
	if (!(t = (yield* stripped_multiline_input("Enter what you want to write:", "Write", { no_trim: 1 })))) {
		return f.dot;
	}
	let i: Value = f.usr.get_active_held_item();
	let iscrayon: Value = 0;
	if (!rt.istype(i, T("/obj/item/weapon/pen"))) {
		if (!rt.istype(i, T("/obj/item/toy/crayon"))) {
			return f.dot;
		}
		iscrayon = 1;
	}
	if (!(get_dist(this, f.usr) <= 1) && this.loc != f.usr && !rt.istype(this.loc, T("/obj/item/weapon/clipboard")) && this.loc.loc != f.usr && f.usr.get_active_held_item() != i) {
		return f.dot;
	}
	if ((t = this.parsepencode(t, i, f.usr, iscrayon)) === null) return f.dot;
	if (id != "end") {
		this.addtofield(text2num(id), t);
	} else {
		this.info += t;
		this.updateinfolinks();
	}
	rt.op(f, "Browse", [], [f.usr, fmt("<HTML><HEAD><TITLE>＀</TITLE></HEAD><BODY>＀<HR>＀</BODY><div align='right'style='position:fixed;bottom:0;font-style:bold;'><A href='?src=＃;help=1'>[?]</A></div></HTML>", [this.name, this.info_links, this.stamps, this]), `window=${this.name}`], false);
	yield* this.update_icon();
	return f.dot;
}, true);

// paper.dm:312
rt.def("/obj/item/weapon/paper/proc/attackby", function* attackby(f: Frame) {
	let stampoverlay: Value = null;
	yield* parent_proc();
	if (rt.bitAnd(this.resistance_flags, 8)) {
		return f.dot;
	}
	if (is_blind(f.args[1])) {
		return f.dot;
	}
	if (rt.istype(f.args[0], T("/obj/item/weapon/pen")) || rt.istype(f.args[0], T("/obj/item/toy/crayon"))) {
		// tg bug: the talisman check sat after both branches' returns, so a talisman opened the write window; checked first now
		if (rt.istype(this, T("/obj/item/weapon/paper/talisman"))) {
			to_chat(f.args[1], `<span class='warning'>${f.args[0]}'s ink fades away shortly after it is written.</span>`);
			return f.dot;
		}
		if (f.args[1].is_literate()) {
			rt.op(f, "Browse", [], [f.args[1], fmt("<HTML><HEAD><TITLE>＀</TITLE></HEAD><BODY>＀<HR>＀</BODY><div align='right'style='position:fixed;bottom:0;font-style:bold;'><A href='?src=＃;help=1'>[?]</A></div></HTML>", [this.name, this.info_links, this.stamps, this]), `window=${this.name}`], false);
			return f.dot;
		} else {
			to_chat(f.args[1], "<span class='notice'>You don't know how to read or write.</span>");
			return f.dot;
		}
	} else if (rt.istype(f.args[0], T("/obj/item/weapon/stamp"))) {
		if (!(get_dist(this, f.args[1]) <= 1)) {
			return f.dot;
		}
		this.stamps += `<img src=large_${f.args[0].icon_state}.png>`;
		(stampoverlay = mutable_appearance(rt.rsc("icons/obj/bureaucracy.dmi"), `paper_${f.args[0].icon_state}`)).pixel_x = rand(-2, 2);
		stampoverlay.pixel_y = rand(-3, 2);
		if (!this.stamped) {
			this.stamped = list();
		}
		this.stamped += f.args[0].icon_state;
		this.add_overlay(stampoverlay);
		to_chat(f.args[1], "<span class='notice'>You stamp the paper with your rubber stamp.</span>");
	}
	if (f.args[0].is_hot()) {
		if (rt.bitAnd(f.args[1].disabilities, 256) && prob(10)) {
			f.args[1].visible_message(`<span class='warning'>${f.args[1]} accidentally ignites themselves!</span>`, "<span class='userdanger'>You miss the paper and accidentally light yourself on fire!</span>");
			yield* f.args[1].dropItemToGround(f.args[0]);
			yield* f.args[1].adjust_fire_stacks(1);
			yield* f.args[1].IgniteMob();
			return f.dot;
		}
		if (!(get_dist(f.args[1], this) <= 1)) {
			return f.dot;
		}
		yield* f.args[1].dropItemToGround(this);
		f.args[1].visible_message(`<span class='danger'>${f.args[1]} lights ${this} ablaze with ${f.args[0]}!</span>`, `<span class='danger'>You light ${this} on fire!</span>`);
		yield* this.fire_act();
	}
	yield* this.add_fingerprint(f.args[1]);
	return f.dot;
}, true, { args: ["P", "user", "params"] });

// paper.dm:366
rt.def("/obj/item/weapon/paper/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	yield* parent_proc();
	if (rt.bitAnd(this.resistance_flags, FIRE_PROOF)) return f.dot;
	this.icon_state = "paper_onfire";
	this.info = `${stars(this.info)}`;
	return f.dot;
}, true);

// paper.dm:373
rt.def("/obj/item/weapon/paper/proc/extinguish", function extinguish(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

rt.type(6620, "/obj/item/weapon/paper/construction", "/obj/item/weapon/paper", {});

// paper.dm:383
rt.def("/obj/item/weapon/paper/construction/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.color = pick("FF0000", "#33cc33", "#ffb366", "#551A8B", "#ff80d5", "#4d94ff");
	return f.dot;
}, true);

rt.type(6621, "/obj/item/weapon/paper/natural", "/obj/item/weapon/paper", {});

// paper.dm:391
rt.def("/obj/item/weapon/paper/natural/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.color = "#FFF5ED";
	return f.dot;
}, true);
