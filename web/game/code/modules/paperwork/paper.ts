// From code/modules/paperwork/paper.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/weapon/paper/proc/pickup  (code/modules/paperwork/paper.dm:38)  may sleep
rt.def("/obj/item/weapon/paper/proc/pickup", function* pickup(f: Frame) {
	let H: Value = null, G: Value = null;
	f.vars = () => [H, G];
	if ((truthy(rt.sv(f, "contact_poison")) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		H = live(f.args[0]);
		if ((!truthy((rt.istype((G = rt.fv(f, "gloves", live(H))), T("/obj/item/clothing/gloves")) ? 1 : 0)) || truthy(rt.fv(f, "transfer_prints", live(G))))) {
			yield* g.callName(f, rt.fv(f, "reagents", live(H)), "add_reagent", [rt.sv(f, "contact_poison"), rt.sv(f, "contact_poison_volume")]);
			rt.setSv(f, "contact_poison", null);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/paper/proc/Initialize  (code/modules/paperwork/paper.dm:48)  may sleep
rt.def("/obj/item/weapon/paper/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-8, 8])));
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-9, 9])));
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "updateinfolinks");
	return f.dot;
}, true);

// /obj/item/weapon/paper/proc/update_icon  (code/modules/paperwork/paper.dm:57)
rt.def("/obj/item/weapon/paper/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 8))) {
		rt.setSv(f, "icon_state", "paper_onfire");
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "info"))) {
		rt.setSv(f, "icon_state", "paper_words");
		return live(f.dot);
	}
	rt.setSv(f, "icon_state", "paper");
	return f.dot;
});

// /obj/item/weapon/paper/proc/examine  (code/modules/paperwork/paper.dm:67)  may sleep
rt.def("/obj/item/weapon/paper/proc/examine", function* examine(f: Frame) {
	let assets: Value = null;
	f.vars = () => [assets];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (assets = (yield* g.call(f, P("/proc/get_asset_datum"), null, [T("/datum/asset/simple/paper")]))), "send", [live(f.args[0])]);
	if (truthy((rt.istype(live(f.src), T("/obj/item/weapon/paper/talisman")) ? 1 : 0))) {
		if ((!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[0])]))) && !truthy(rt.fv(f, "stat", live(f.args[0]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='danger'>There are indecipherable images scrawled on the paper in what looks to be... <i>blood?</i></span>"]);
			return live(f.dot);
		}
	}
	if ((rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.args[0]), live(f.src)])), 1) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)))) {
		if (truthy((yield* g.callName(f, live(f.args[0]), "is_literate", [])))) {
			rt.op(f, "Browse", [], [live(f.args[0]), fmt("<HTML><HEAD><TITLE>＀</TITLE></HEAD><BODY>＀<HR>＀</BODY></HTML>", [rt.sv(f, "name"), rt.sv(f, "info"), rt.sv(f, "stamps")]), fmt("window=＀", [rt.sv(f, "name")])], false);
			yield* g.call(f, P("/proc/onclose"), null, [live(f.args[0]), fmt("＀", [rt.sv(f, "name")])]);
		} else {
			rt.op(f, "Browse", [], [live(f.args[0]), fmt("<HTML><HEAD><TITLE>＀</TITLE></HEAD><BODY>＀<HR>＀</BODY></HTML>", [rt.sv(f, "name"), (yield* g.call(f, P("/proc/stars"), null, [rt.sv(f, "info")])), rt.sv(f, "stamps")]), fmt("window=＀", [rt.sv(f, "name")])], false);
			yield* g.call(f, P("/proc/onclose"), null, [live(f.args[0]), fmt("＀", [rt.sv(f, "name")])]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>It is too far away.</span>"]);
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/paper/verb/rename  (code/modules/paperwork/paper.dm:91)  may sleep
rt.def("/obj/item/weapon/paper/verb/rename", function* rename(f: Frame) {
	let H: Value = null, n_name: Value = null;
	let $0: any;
	f.vars = () => [H, n_name, $0];
	if ((truthy((yield* g.callName(f, live(f.usr), "incapacitated", []))) || !truthy((yield* g.callName(f, live(f.usr), "is_literate", []))))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if ((truthy(rt.bitAnd(rt.gv(f, "disabilities", (H = live(f.usr))), 256)) && truthy(rt.op(f, "Prob", [], [25])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='warning'>You cut yourself on the paper! Ahhhh! Ahhhhh!</span>"]);
			rt.setFv(f, "damageoverlaytemp", live(H), 9001);
			yield* g.callName(f, live(H), "update_damage_hud", []);
			return live(f.dot);
		}
	}
	n_name = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "What would you like to label the paper?", "Paper Labelling", null, 42]));
	if ((isEqual(rt.sv(f, "loc"), live(f.usr)) && isEqual(rt.fv(f, "stat", live(f.usr)), 0))) {
		if (truthy(live(n_name))) {
			$0 = fmt("- '＀'", [live(n_name)]);
		} else {
			$0 = null;
		}
		rt.setSv(f, "name", fmt("paper＀", [$0]));
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	return f.dot;
}, true, { verb: { name: "Rename paper", category: "Object", src: 11 } });

// /obj/item/weapon/paper/proc/suicide_act  (code/modules/paperwork/paper.dm:106)
rt.def("/obj/item/weapon/paper/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ scratches a grid on ＀ wrist with the paper! It looks like ＀ trying to commit sudoku...</span>", [live(user), rt.callName(f, live(user), "p_their", []), rt.callName(f, live(user), "p_theyre", [])])]);
	return 1;
});

// /obj/item/weapon/paper/proc/attack_self  (code/modules/paperwork/paper.dm:110)  may sleep
rt.def("/obj/item/weapon/paper/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "examinate", [live(f.src)]);
	if (!(truthy(rt.sv(f, "rigged")) && (truthy(rt.fv(f, "holidays", rt.gl("SSevents"))) && truthy(rt.index(rt.fv(f, "holidays", rt.gl("SSevents")), "April Fool's Day"))))) return f.dot;
	if (!isEqual(rt.sv(f, "spam_flag"), 0)) return f.dot;
	rt.setSv(f, "spam_flag", 1);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/bikehorn.ogg"), 50, 1]);
	rt.spawnTail(f, 20, "/obj/item/weapon/paper/proc/attack_self: spawn at modules/paperwork/paper.dm:115", user);
	return f.dot;
}, true);

// a spawn(20) body of /obj/item/weapon/paper/proc/attack_self, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/paper/proc/attack_self: spawn at modules/paperwork/paper.dm:115", function* (f: Frame, user: Value) {
	f.vars = () => [user];
	rt.setSv(f, "spam_flag", 0);
	return null;
});

// /obj/item/weapon/paper/proc/attack_ai  (code/modules/paperwork/paper.dm:121)
rt.def("/obj/item/weapon/paper/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	let dist: Value = null;
	f.vars = () => [dist];
	dist = null;
	if ((truthy((rt.istype(live(user), T("/mob/living/silicon/ai")) ? 1 : 0)) && truthy(rt.fv(f, "current", live(user))))) {
		dist = rt.call(f, P("/proc/get_dist"), null, [live(f.src), rt.fv(f, "current", live(user))]);
	} else {
		dist = rt.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)]);
	}
	if (rt.lt(live(dist), 2)) {
		rt.op(f, "Browse", [], [live(f.usr), fmt("<HTML><HEAD><TITLE>＀</TITLE></HEAD><BODY>＀<HR>＀</BODY></HTML>", [rt.sv(f, "name"), rt.sv(f, "info"), rt.sv(f, "stamps")]), fmt("window=＀", [rt.sv(f, "name")])], false);
		rt.call(f, P("/proc/onclose"), null, [live(f.usr), fmt("＀", [rt.sv(f, "name")])]);
	} else {
		rt.op(f, "Browse", [], [live(f.usr), fmt("<HTML><HEAD><TITLE>＀</TITLE></HEAD><BODY>＀<HR>＀</BODY></HTML>", [rt.sv(f, "name"), rt.call(f, P("/proc/stars"), null, [rt.sv(f, "info")]), rt.sv(f, "stamps")]), fmt("window=＀", [rt.sv(f, "name")])], false);
		rt.call(f, P("/proc/onclose"), null, [live(f.usr), fmt("＀", [rt.sv(f, "name")])]);
	}
	return f.dot;
});

// /obj/item/weapon/paper/proc/addtofield  (code/modules/paperwork/paper.dm:140)
rt.def("/obj/item/weapon/paper/proc/addtofield", function addtofield(f: Frame, id: Value, text: Value, links: Value) {
	let locid: Value = null, laststart: Value = null, textindex: Value = null, istart: Value = null, iend: Value = null, before: Value = null, after: Value = null;
	f.vars = () => [links, locid, laststart, textindex, istart, iend, before, after];
	if (live(links) === null) {
		links = 0;
	}
	locid = 0;
	laststart = 1;
	textindex = 1;
	while (true) {
		istart = 0;
		if (truthy(live(links))) {
			istart = rt.call(f, P("/proc/findtext"), null, [rt.sv(f, "info_links"), "<span class=\"paper_field\">", live(laststart)]);
		} else {
			istart = rt.call(f, P("/proc/findtext"), null, [rt.sv(f, "info"), "<span class=\"paper_field\">", live(laststart)]);
		}
		if (isEqual(live(istart), 0)) {
			return live(f.dot);
		}
		laststart = add(live(istart), 1);
		locid = rt.inc(live(locid), 1);
		if (isEqual(live(locid), live(id))) {
			iend = 1;
			if (truthy(live(links))) {
				iend = rt.call(f, P("/proc/findtext"), null, [rt.sv(f, "info_links"), "</span>", live(istart)]);
			} else {
				iend = rt.call(f, P("/proc/findtext"), null, [rt.sv(f, "info"), "</span>", live(istart)]);
			}
			textindex = live(iend);
			break;
		}
	}
	if (truthy(live(links))) {
		before = rt.call(f, P("/proc/copytext"), null, [rt.sv(f, "info_links"), 1, live(textindex)]);
		after = rt.call(f, P("/proc/copytext"), null, [rt.sv(f, "info_links"), live(textindex)]);
		rt.setSv(f, "info_links", add(add(live(before), live(text)), live(after)));
	} else {
		before = rt.call(f, P("/proc/copytext"), null, [rt.sv(f, "info"), 1, live(textindex)]);
		after = rt.call(f, P("/proc/copytext"), null, [rt.sv(f, "info"), live(textindex)]);
		rt.setSv(f, "info", add(add(live(before), live(text)), live(after)));
		rt.callSrc(f, "updateinfolinks", []);
	}
	return f.dot;
});

// /obj/item/weapon/paper/proc/updateinfolinks  (code/modules/paperwork/paper.dm:172)
rt.def("/obj/item/weapon/paper/proc/updateinfolinks", function updateinfolinks(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	rt.setSv(f, "info_links", rt.sv(f, "info"));
	i = null;
	rt.forRange(f, 0, 1, rt.call(f, P("/proc/min"), null, [rt.sv(f, "fields"), 15]), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.callSrc(f, "addtofield", [live(i), fmt("<font face=\"＀\"><A href='?src=＃;write=＀'>write</A></font>", ["Verdana", live(f.src), live(i)]), 1]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "info_links", add(rt.sv(f, "info_links"), fmt("<font face=\"＀\"><A href='?src=＃;write=end'>write</A></font>", ["Verdana", live(f.src)])));
	return f.dot;
});

// /obj/item/weapon/paper/proc/clearpaper  (code/modules/paperwork/paper.dm:181)
rt.def("/obj/item/weapon/paper/proc/clearpaper", function clearpaper(f: Frame) {
	rt.setSv(f, "info", null);
	rt.setSv(f, "stamps", null);
	if (truthy(rt.sv(f, "stamped"))) {
		rt.callName(f, rt.sv(f, "stamped"), "Cut", []);
	}
	rt.callSrc(f, "cut_overlays", []);
	rt.callSrc(f, "updateinfolinks", []);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/item/weapon/paper/proc/parsepencode  (code/modules/paperwork/paper.dm:188)
rt.def("/obj/item/weapon/paper/proc/parsepencode", function parsepencode(f: Frame, t: Value, _P: Value, user: Value, iscrayon: Value) {
	let C: Value = null, laststart: Value = null, i: Value = null;
	f.vars = () => [t, iscrayon, C, laststart, i];
	if (live(iscrayon) === null) {
		iscrayon = 0;
	}
	if (rt.lt(rt.length(live(t)), 1)) {
		return live(f.dot);
	}
	t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [live(t), "[center]", "<center>"])), "[/center]", "</center>"])), "[br]", "<BR>"])), "\n", "<BR>"])), "[b]", "<B>"])), "[/b]", "</B>"])), "[i]", "<I>"])), "[/i]", "</I>"])), "[u]", "<U>"])), "[/u]", "</U>"])), "[large]", "<font size=\"4\">"])), "[/large]", "</font>"])), "[sign]", fmt("<font face=\"＀\"><i>＀</i></font>", ["Times New Roman", rt.fv(f, "real_name", live(user))])])), "[field]", "<span class=\"paper_field\"></span>"])), "[tab]", "&nbsp;&nbsp;&nbsp;&nbsp;"]);
	if (!truthy(live(iscrayon))) {
		t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [live(t), "[*]", "<li>"])), "[hr]", "<HR>"])), "[small]", "<font size = \"1\">"])), "[/small]", "</font>"])), "[list]", "<ul>"])), "[/list]", "</ul>"]);
		t = fmt("<font face=\"＀\" color=＀>＀</font>", [rt.fv(f, "font", live(_P)), rt.fv(f, "colour", live(_P)), live(t)]);
	} else {
		C = live(_P);
		t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [live(t), "[*]", ""])), "[hr]", ""])), "[small]", ""])), "[/small]", ""])), "[list]", ""])), "[/list]", ""]);
		t = fmt("<font face=\"＀\" color=＀><b>＀</b></font>", ["Comic Sans MS", rt.fv(f, "paint_color", live(C)), live(t)]);
	}
	laststart = 1;
	while (true) {
		if (isEqual((i = rt.call(f, P("/proc/findtext"), null, [live(t), "<span class=\"paper_field\">", live(laststart)])), 0)) {
			break;
		}
		laststart = add(live(i), 1);
		rt.incSrcVar(f, "fields", 1, true);
	}
	return live(t);
});

// /obj/item/weapon/paper/proc/reload_fields  (code/modules/paperwork/paper.dm:246)
rt.def("/obj/item/weapon/paper/proc/reload_fields", function reload_fields(f: Frame) {
	let laststart: Value = null, i: Value = null;
	f.vars = () => [laststart, i];
	rt.setSv(f, "fields", 0);
	laststart = 1;
	while (true) {
		if (isEqual((i = rt.call(f, P("/proc/findtext"), null, [rt.sv(f, "info"), "<span class=\"paper_field\">", live(laststart)])), 0)) {
			break;
		}
		laststart = add(live(i), 1);
		rt.incSrcVar(f, "fields", 1, true);
	}
	rt.callSrc(f, "updateinfolinks", []);
	return f.dot;
});

// /obj/item/weapon/paper/proc/openhelp  (code/modules/paperwork/paper.dm:255)
rt.def("/obj/item/weapon/paper/proc/openhelp", function openhelp(f: Frame, user: Value) {
	rt.op(f, "Browse", [], [live(user), "<HTML><HEAD><TITLE>Paper Help</TITLE></HEAD>\n\t<BODY>\n\t\t<b><center>Crayon&Pen commands</center></b><br>\n\t\t<br>\n\t\t[br] : Creates a linebreak.<br>\n\t\t[center] - [/center] : Centers the text.<br>\n\t\t[b] - [/b] : Makes the text <b>bold</b>.<br>\n\t\t[i] - [/i] : Makes the text <i>italic</i>.<br>\n\t\t[u] - [/u] : Makes the text <u>underlined</u>.<br>\n\t\t[large] - [/large] : Increases the <font size = \"4\">size</font> of the text.<br>\n\t\t[sign] : Inserts a signature of your name in a foolproof way.<br>\n\t\t[field] : Inserts an invisible field which lets you start type from there. Useful for forms.<br>\n\t\t<br>\n\t\t<b><center>Pen exclusive commands</center></b><br>\n\t\t[small] - [/small] : Decreases the <font size = \"1\">size</font> of the text.<br>\n\t\t[list] - [/list] : A list.<br>\n\t\t[*] : A dot used for lists.<br>\n\t\t[hr] : Adds a horizontal rule.\n\t</BODY></HTML>", "window=paper_help"], false);
	return f.dot;
});

// /obj/item/weapon/paper/proc/Topic  (code/modules/paperwork/paper.dm:277)  may sleep
rt.def("/obj/item/weapon/paper/proc/Topic", function* Topic(f: Frame) {
	let id: Value = null, t: Value = null, i: Value = null, iscrayon: Value = null;
	f.vars = () => [id, t, i, iscrayon];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.fv(f, "stat", live(f.usr))) || truthy((yield* g.callName(f, live(f.usr), "restrained", []))))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "help"))) {
		yield* g.srcCall(f, "openhelp", live(f.usr));
		return live(f.dot);
	}
	if (!truthy(rt.at(live(f.args[1]), "write"))) return f.dot;
	id = rt.at(live(f.args[1]), "write");
	if (!truthy((t = (yield* g.call(f, P("/proc/stripped_multiline_input"), null, [null, "Enter what you want to write:", null, "Write", "no_trim", 1], rt.Args.Named))))) {
		return live(f.dot);
	}
	i = (yield* g.callName(f, live(f.usr), "get_active_held_item", []));
	iscrayon = 0;
	if (!truthy((rt.istype(live(i), T("/obj/item/weapon/pen")) ? 1 : 0))) {
		if (!truthy((rt.istype(live(i), T("/obj/item/toy/crayon")) ? 1 : 0))) {
			return live(f.dot);
		}
		iscrayon = 1;
	}
	if (((((!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && !isEqual(rt.sv(f, "loc"), live(f.usr))) && !truthy((rt.istype(rt.sv(f, "loc"), T("/obj/item/weapon/clipboard")) ? 1 : 0))) && !isEqual(rt.fv(f, "loc", rt.sv(f, "loc")), live(f.usr))) && !isEqual((yield* g.callName(f, live(f.usr), "get_active_held_item", [])), live(i)))) {
		return live(f.dot);
	}
	if ((t = (yield* g.srcCall(f, "parsepencode", live(t), live(i), live(f.usr), live(iscrayon)))) === null) return f.dot;
	if (!isEqual(live(id), "end")) {
		yield* g.srcCall(f, "addtofield", (yield* g.call(f, P("/proc/text2num"), null, [live(id)])), live(t));
	} else {
		rt.modSrcVar(f, "info", live(t), add);
		yield* g.srcCall(f, "updateinfolinks");
	}
	rt.op(f, "Browse", [], [live(f.usr), fmt("<HTML><HEAD><TITLE>＀</TITLE></HEAD><BODY>＀<HR>＀</BODY><div align='right'style='position:fixed;bottom:0;font-style:bold;'><A href='?src=＃;help=1'>[?]</A></div></HTML>", [rt.sv(f, "name"), rt.sv(f, "info_links"), rt.sv(f, "stamps"), live(f.src)]), fmt("window=＀", [rt.sv(f, "name")])], false);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/item/weapon/paper/proc/attackby  (code/modules/paperwork/paper.dm:312)  may sleep
rt.def("/obj/item/weapon/paper/proc/attackby", function* attackby(f: Frame) {
	let stampoverlay: Value = null;
	f.vars = () => [stampoverlay];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 8))) {
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/is_blind"), null, [live(f.args[1])])))) {
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/toy/crayon")) ? 1 : 0)))) {
		if (truthy((yield* g.callName(f, live(f.args[1]), "is_literate", [])))) {
			rt.op(f, "Browse", [], [live(f.args[1]), fmt("<HTML><HEAD><TITLE>＀</TITLE></HEAD><BODY>＀<HR>＀</BODY><div align='right'style='position:fixed;bottom:0;font-style:bold;'><A href='?src=＃;help=1'>[?]</A></div></HTML>", [rt.sv(f, "name"), rt.sv(f, "info_links"), rt.sv(f, "stamps"), live(f.src)]), fmt("window=＀", [rt.sv(f, "name")])], false);
			return live(f.dot);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You don't know how to read or write.</span>"]);
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.src), T("/obj/item/weapon/paper/talisman")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀'s ink fades away shortly after it is written.</span>", [live(f.args[0])])]);
			return live(f.dot);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/stamp")) ? 1 : 0))) {
			if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[1])])), 1)) {
				return live(f.dot);
			}
			rt.modSrcVar(f, "stamps", fmt("<img src=large_＀.png>", [rt.fv(f, "icon_state", live(f.args[0]))]), add);
			rt.setFv(f, "pixel_x", (stampoverlay = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/bureaucracy.dmi"), fmt("paper_＀", [rt.fv(f, "icon_state", live(f.args[0]))])]))), (yield* g.call(f, P("/proc/rand"), null, [-2, 2])));
			rt.setFv(f, "pixel_y", live(stampoverlay), (yield* g.call(f, P("/proc/rand"), null, [-3, 2])));
			if (!truthy(rt.sv(f, "stamped"))) {
				rt.setSv(f, "stamped", rt.list());
			}
			rt.modSrcVar(f, "stamped", rt.fv(f, "icon_state", live(f.args[0])), add);
			yield* g.srcCall(f, "add_overlay", live(stampoverlay));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You stamp the paper with your rubber stamp.</span>"]);
		}
	}
	if (truthy((yield* g.callName(f, live(f.args[0]), "is_hot", [])))) {
		if ((truthy(rt.bitAnd(rt.fv(f, "disabilities", live(f.args[1])), 256)) && truthy(rt.op(f, "Prob", [], [10])))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ accidentally ignites themselves!</span>", [live(f.args[1])]), "<span class='userdanger'>You miss the paper and accidentally light yourself on fire!</span>"]);
			yield* g.callName(f, live(f.args[1]), "dropItemToGround", [live(f.args[0])]);
			yield* g.callName(f, live(f.args[1]), "adjust_fire_stacks", [1]);
			yield* g.callName(f, live(f.args[1]), "IgniteMob", []);
			return live(f.dot);
		}
		if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.args[1]), live(f.src)])), 1)) {
			return live(f.dot);
		}
		yield* g.callName(f, live(f.args[1]), "dropItemToGround", [live(f.src)]);
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='danger'>＀ lights ＀ ablaze with ＀!</span>", [live(f.args[1]), live(f.src), live(f.args[0])]), fmt("<span class='danger'>You light ＀ on fire!</span>", [live(f.src)])]);
		yield* g.srcCall(f, "fire_act");
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	return f.dot;
}, true, { args: ["P", "user", "params"] });

// /obj/item/weapon/paper/proc/fire_act  (code/modules/paperwork/paper.dm:366)  may sleep
rt.def("/obj/item/weapon/paper/proc/fire_act", function* fire_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 2))) return f.dot;
	rt.setSv(f, "icon_state", "paper_onfire");
	rt.setSv(f, "info", fmt("＀", [(yield* g.call(f, P("/proc/stars"), null, [rt.sv(f, "info")]))]));
	return f.dot;
}, true, { args: ["exposed_temperature", "exposed_volume"] });

// /obj/item/weapon/paper/proc/extinguish  (code/modules/paperwork/paper.dm:373)
rt.def("/obj/item/weapon/paper/proc/extinguish", function extinguish(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

rt.type(6620, "/obj/item/weapon/paper/construction", "/obj/item/weapon/paper", {});

// /obj/item/weapon/paper/construction/proc/Initialize  (code/modules/paperwork/paper.dm:383)  may sleep
rt.def("/obj/item/weapon/paper/construction/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "color", rt.op(f, "PickUnweighted", [6], ["FF0000", "#33cc33", "#ffb366", "#551A8B", "#ff80d5", "#4d94ff"]));
	return f.dot;
}, true);

rt.type(6621, "/obj/item/weapon/paper/natural", "/obj/item/weapon/paper", {});

// /obj/item/weapon/paper/natural/proc/Initialize  (code/modules/paperwork/paper.dm:391)  may sleep
rt.def("/obj/item/weapon/paper/natural/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "color", "#FFF5ED");
	return f.dot;
}, true);
