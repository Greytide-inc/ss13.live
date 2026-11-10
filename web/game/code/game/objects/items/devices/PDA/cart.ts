// Based on /tg/station's code/game/objects/items/devices/PDA/cart.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, add, fmt } = rt;


rt.type(7010, "/obj/item/weapon/cartridge", "/obj/item/weapon", {
	radio: null,
	access: 0,
	remote_door_id: "",
	bot_access_flags: 0,
	spam_enabled: 0,
	host_pda: null,
	menu: null,
	active1: null,
	active2: null,
	active3: null,
	powmonitor: null,
	powermonitors: null,
	message1: null,
	message2: null,
	stored_data: null,
	current_channel: null,
	active_bot: null,
	botlist: null,
	name: "generic cartridge",
	desc: "A data cartridge for portable microcomputers.",
	icon: rt.rsc("icons/obj/pda.dmi"),
	icon_state: "cart",
	item_state: "electronic",
	w_class: 1,
});

// Empty in tg.
rt.def("/obj/item/weapon/cartridge/proc/special", undefined, false, { args: ["user", "params"] });

// cart.dm:42
rt.def("/obj/item/weapon/cartridge/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.powermonitors = list();

	this.stored_data = list();

	this.botlist = list();
	return f.dot;
});

// cart.dm:52
rt.def("/obj/item/weapon/cartridge/proc/Initialize", function* Initialize(f: Frame, pda: Value) {
	yield* parent_proc();
	if (!pda) return f.dot;
	this.host_pda = pda;
	return f.dot;
}, true);

rt.type(7021, "/obj/item/weapon/cartridge/signal", "/obj/item/weapon/cartridge", {
	name: "generic signaler cartridge",
	desc: "A data cartridge with an integrated radio signaler module.",
});

// cart.dm:134
rt.def("/obj/item/weapon/cartridge/signal/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.radio = (yield* new_(T("/obj/item/radio/integrated/signal"), this));
	return f.dot;
}, true);

rt.type(7029, "/obj/item/weapon/cartridge/rd", "/obj/item/weapon/cartridge", {
	access: 18708,
	bot_access_flags: 28,
	name: "１Signal Ace DELUXE cartridge",
	icon_state: "cart-rd",
});

// cart.dm:183
rt.def("/obj/item/weapon/cartridge/rd/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.radio = (yield* new_(T("/obj/item/radio/integrated/signal"), this));
	return f.dot;
}, true);

rt.type(7030, "/obj/item/weapon/cartridge/captain", "/obj/item/weapon/cartridge", {
	access: 16777119,
	bot_access_flags: 31,
	spam_enabled: 1,
	name: "１Value-PAK cartridge",
	desc: "Now with 350% more value!",
	icon_state: "cart-c",
});

// cart.dm:195
rt.def("/obj/item/weapon/cartridge/captain/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.radio = (yield* new_(T("/obj/item/radio/integrated/signal"), this));
	return f.dot;
}, true);

// cart.dm:200
rt.def("/obj/item/weapon/cartridge/proc/post_status", function* post_status(f: Frame, command: Value, data1: Value, data2: Value) {
	let frequency: Value = null, status_signal: Value = null;
	if (!(frequency = GLOB.SSradio.return_frequency(1435))) {
		return f.dot;
	}
	(status_signal = (yield* new_(T("/datum/signal")))).source = this;
	status_signal.transmission_method = 1;
	rt.setAt(status_signal.data, "command", command);
	if (command === "message") {
		rt.setAt(status_signal.data, "msg1", data1);
		rt.setAt(status_signal.data, "msg2", data2);
	} else if (command === "alert") {
		rt.setAt(status_signal.data, "picture_state", data1);
	}
	yield* frequency.post_signal(this, status_signal);
	return f.dot;
}, true);

// tg_js: the cartridge apps are native tgui screens (tgui/src/interfaces/pda.ract). cart_data builds the list for the host PDA's
// current `mode` (what generate_menu used to write as HTML); buttons send the "cart" ui_act, which goes through Topic below unchanged.
function cdRow(pairs: any) {
	const E = rt.list();
	for (let i = 0; i < pairs.length; i += 2) rt.setAt(E, pairs[i], pairs[i + 1]);
	return E;
}
function cdPush(out: Value, row: Value) {
	rt.modify(out, rt.list(row), add);
}
function cdStr(v: Value) {
	return fmt("＀", [v]);
}
function cdRef(v: Value) {
	return fmt("＃", [v]);
}

// Added by tg_js.
rt.def("/obj/item/weapon/cartridge/proc/cart_data", function* cart_data(f: Frame, user: Value) {
	let R: Value = null, L: Value = null, pm: Value = null, n: Value = null, term: Value = null, A: Value = null, c: Value = null, cl: Value = null, M: Value = null, ml: Value = null, B: Value = null, ch: Value = null, cur: Value = null, msg: Value = null, cm: Value = null, sup: Value = null, out: Value = null, sub: Value = null;
	let d: Value = list();
	if (!this.host_pda) {
		return d;
	}
	let mode: Value = this.host_pda.mode;
	if (mode === 40) {
		sub = this.radio;
		rt.setAt(d, "frequency", format_frequency(sub.frequency));
		rt.setAt(d, "code", sub.code);
	} else if (mode === 42) {
		rt.setAt(d, "message1", this.message1);
		rt.setAt(d, "message2", this.message2);
	} else if (mode === 43) {
		this.powmonitor = null;
		this.powermonitors = list();
		for (pm of each(GLOB.machines, T("/obj/machinery/computer/monitor"))) {
			if (!rt.bitAnd(pm.stat, 3)) {
				this.powermonitors += pm;
			}
		}
		out = list();
		n = 0;
		pm = null;
		for (pm of each(this.powermonitors, T("/obj/machinery/computer/monitor"))) {
			n++;
			cdPush(out, cdRow(["name", cdStr(pm), "n", cdStr(n)]));
		}
		rt.setAt(d, "monitors", out);
	} else if (mode === 433) {
		if (this.powmonitor) {
			L = list();
			for (term of each(this.powmonitor.attached.powernet.nodes, T("/obj/machinery/power/terminal"))) {
				if (rt.istype(term.master, T("/obj/machinery/power/apc"))) {
					rt.modify(L, (A = term.master), add);
				}
			}
			rt.setAt(d, "avail", this.powmonitor.attached.powernet.viewavail);
			rt.setAt(d, "load", num2text(this.powmonitor.attached.powernet.viewload, 10));
			out = list();
			const S_1 = ["Off", "AOff", "On", "AOn"], chg = ["N", "C", "F"];
			A = null;
			for (A of each(L, T("/obj/machinery/power/apc"))) {
				cdPush(out, cdRow([
					"area", A.area.name,
					"eqp", S_1[Number(A.equipment)], "lgt", S_1[Number(A.lighting)], "env", S_1[Number(A.environ)],
					"load", A.lastused_total,
					"cell", A.cell ? round(A.cell.percent()) : null,
					"charging", chg[Number(A.charging)]]));
			}
			rt.setAt(d, "apcs", out);
			rt.setAt(d, "connected", 1);
		}
	} else if (mode === 44 || mode === 45) {
		out = list();
		if (GLOB.data_core.general) {
			for (R of each((yield* sortRecord(GLOB.data_core.general)), T("/datum/data/record"))) {
				cdPush(out, cdRow(["id", rt.index(R.fields, "id"), "name", rt.index(R.fields, "name")]));
			}
		}
		rt.setAt(d, "records", out);
	} else if (mode === 441 || mode === 451) {
		const gen = this.active1;
		if (rt.isIn(f, gen, GLOB.data_core.general)) {
			out = list();
			for (const k of ["name", "id", "sex", "age", "rank", "fingerprint", "p_stat", "m_stat"]) rt.setAt(out, k, rt.index(gen.fields, k));
			rt.setAt(d, "general", out);
		}
		if (mode === 441) {
			const med = this.active2;
			if (rt.isIn(f, med, GLOB.data_core.medical)) {
				out = list();
				for (const k of ["blood_type", "mi_dis", "mi_dis_d", "ma_dis", "ma_dis_d", "alg", "alg_d", "cdi", "cdi_d", "notes"]) rt.setAt(out, k, rt.index(med.fields, k));
				rt.setAt(d, "medical", out);
			}
		} else {
			const sec = this.active3;
			if (rt.isIn(f, sec, GLOB.data_core.security)) {
				out = list();
				rt.setAt(out, "criminal", rt.index(sec.fields, "criminal"));
				rt.setAt(out, "notes", rt.index(sec.fields, "notes"));
				for (const k of ["mi_crim", "ma_crim"]) {
					sub = list();
					c = null;
					for (c of each(rt.index(sec.fields, k), T("/datum/data/crime"))) {
						cdPush(sub, cdRow(["crime", c.crimeName, "details", c.crimeDetails, "author", c.author, "time", c.time]));
					}
					rt.setAt(out, k, sub);
				}
				rt.setAt(d, "security", out);
			}
		}
	} else if (mode === 47) {
		sup = GLOB.SSshuttle.supply;
		if (sup.mode === "call") {
			rt.setAt(d, "shuttle", `Moving to ${sup.z != 2 ? "station" : "centcomm"} (${sup.timeLeft(600)} Mins)`);
		} else {
			rt.setAt(d, "shuttle", "At " + (sup.z != 2 ? "centcomm" : "station"));
		}
		for (const [key, lst] of [["approved", "shoppinglist"], ["requests", "requestlist"]]) {
			out = list();
			for (M of each(rt.fv(f, lst, GLOB.SSshuttle))) {
				cdPush(out, cdRow(["id", M.id, "name", M.pack.name, "orderer", M.orderer, "reason", M.reason]));
			}
			rt.setAt(d, key, out);
		}
	} else if (mode === 49) {
		if (cl = rt.getStep(f, this, 0)) {
			rt.setAt(d, "located", 1);
			rt.setAt(d, "x", cl.x);
			rt.setAt(d, "y", cl.y);
			const scans: any[] = [["mops", "/obj/item/weapon/mop", "world"], ["carts", "/obj/structure/janitorialcart", "world"], ["bots", "/mob/living/simple_animal/bot/cleanbot", "living_mob_list"]];
			for (const [key, path, srcList] of scans) {
				out = list();
				M = null;
				for (M of each(srcList === "world" ? rt.world() : rt.gl(srcList), T(path))) {
					if (!(ml = rt.getStep(f, M, 0))) continue;
					if (ml.z != cl.z) continue;
					const dir = rt.getDir(f, this, M);
					const dtxt = uppertext(dir2text(dir));
					const extra = key === "mops" ? (M.reagents.total_volume ? "Wet" : "Dry") : key === "carts" ? "Water level: " + cdStr(M.reagents.total_volume) + "/100" : (M.on ? "Online" : "Offline");
					cdPush(out, cdRow(["x", ml.x, "y", ml.y, "dir", dtxt, "info", extra]));
				}
				rt.setAt(d, key, out);
			}
		}
	} else if (mode === 53) {
		rt.setAt(d, "channel", this.current_channel ? this.current_channel : "None");
		for (ch of each(GLOB.news_network.network_channels, T("/datum/newscaster/feed_channel"))) {
			if (ch.channel_name == this.current_channel) {
				cur = ch;
			}
		}
		if (cur) {
			rt.setAt(d, "found", 1);
			out = list();
			for (msg of each(cur.messages, T("/datum/newscaster/feed_message"))) {
				sub = list();
				cm = null;
				for (cm of each(msg.comments, T("/datum/newscaster/feed_comment"))) {
					cdPush(sub, cdRow(["body", cm.body, "author", cm.author, "time", cm.time_stamp]));
				}
				cdPush(out, cdRow(["body", msg.returnBody(-1), "author", msg.returnAuthor(-1), "photo", msg.img ? 1 : 0, "comments", sub]));
			}
			rt.setAt(d, "messages", out);
		}
	} else if (mode === 54) {
		B = this.active_bot;
		if (B) {
			sub = cdRow([
				"ref", cdRef(B), "name", cdStr(B), "model", B.model,
				"area", cdStr(get_area(B)), "mode", B.get_mode(),
				"allow_pai", B.allow_pai ? 1 : 0,
				"pai", B.paicard && B.paicard.pai ? B.paicard.pai.name : null,
				"can_eject", (yield* B.bot_core.allowed(f.usr)) ? 1 : 0,
				"is_mule", B.bot_type == 2 ? 1 : 0]);
			if (B.bot_type == 2) {
				rt.setAt(sub, "load", B.load ? B.load.name : null);
				rt.setAt(sub, "destination", B.destination ? B.destination : null);
				rt.setAt(sub, "suffix", B.suffix);
				rt.setAt(sub, "power", B.cell ? B.cell.percent() : 0);
				rt.setAt(sub, "home", B.home_destination ? B.home_destination : null);
				rt.setAt(sub, "report", B.report_delivery ? 1 : 0);
				rt.setAt(sub, "autoret", B.auto_return ? 1 : 0);
				rt.setAt(sub, "autopick", B.auto_pickup ? 1 : 0);
			}
			rt.setAt(d, "bot", sub);
		} else {
			out = list();
			const zlevel = rt.getStep(f, this, 0).z;
			B = null;
			for (B of each(GLOB.living_mob_list, T("/mob/living/simple_animal/bot"))) {
				if (!B.on || B.z != zlevel || B.remote_disabled || !rt.bitAnd(this.bot_access_flags, B.bot_type)) {
					continue;
				}
				cdPush(out, cdRow(["ref", cdRef(B), "name", B.name, "mode", B.get_mode()]));
			}
			rt.setAt(d, "bots", out);
		}
	} else if (mode === 99) {
		rt.setAt(d, "no_id", this.host_pda.id ? 0 : 1);
	}
	return d;
}, true);

// cart.dm:553
rt.def("/obj/item/weapon/cartridge/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let S: Value = null, new_frequency: Value = null, pnum: Value = null, host_pda_owner_name: Value = null, message: Value = null, current: Value = null, chan: Value = null;
	let $e: any;
	yield* parent_proc();
	if (!f.usr.canmove || f.usr.stat || f.usr.restrained() || !(get_dist(this.loc, f.usr) <= 1) || !f.usr.canUseTopic(this.loc)) {
		// tg_js fix (2017 tg bug): the distance check alone let a player standing next to someone else's PDA push its cartridge's buttons by href; the PDA's own check (canUseTopic) now applies too.
		yield* f.usr.unset_machine();
		rt.op(f, "Browse", [], [f.usr, null, "window=pda"], false);
		return f.dot;
	}
	let $0: any = rt.at(href_list, "choice");
	if ($0 === "Medical Records") {
		this.active1 = find_record("id", rt.at(href_list, "target"), GLOB.data_core.general);
		if (this.active1) {
			this.active2 = find_record("id", rt.at(href_list, "target"), GLOB.data_core.medical);
		}
		this.host_pda.mode = 441;
		if (!this.active2) {
			this.active1 = null;
		}
	} else if ($0 === "Security Records") {
		this.active1 = find_record("id", rt.at(href_list, "target"), GLOB.data_core.general);
		if (this.active1) {
			this.active3 = find_record("id", rt.at(href_list, "target"), GLOB.data_core.security);
		}
		this.host_pda.mode = 451;
		if (!this.active3) {
			this.active1 = null;
		}
	} else if ($0 === "Send Signal") {
		rt.spawnTail(f, 0, "/obj/item/weapon/cartridge/proc/Topic: spawn at game/objects/items/devices/PDA/cart.dm:578", S, new_frequency, pnum, host_pda_owner_name, message, current, chan);
	} else if ($0 === "Signal Frequency") {
		S = this.radio;
		new_frequency = sanitize_frequency(S.frequency + text2num(rt.at(href_list, "sfreq")));
		yield* S.set_frequency(new_frequency);
	} else if ($0 === "Signal Code") {
		(S = this.radio).code += text2num(rt.at(href_list, "scode"));
		S.code = round(S.code);
		S.code = min(100, S.code);
		S.code = max(1, S.code);
	} else if ($0 === "Status") {
		$0 = rt.at(href_list, "statdisp");
		if ($0 === "message") {
			yield* this.post_status("message", this.message1, this.message2);
		} else if ($0 === "alert") {
			yield* this.post_status("alert", rt.at(href_list, "alert"));
		} else if ($0 === "setmsg1") {
			this.message1 = reject_bad_text((yield* g.op(f, "Prompt", [3], [null, this.message1, "Enter Message Text", "Line 1", null])), 40);
			yield* this.updateSelfDialog();
		} else if ($0 === "setmsg2") {
			this.message2 = reject_bad_text((yield* g.op(f, "Prompt", [3], [null, this.message2, "Enter Message Text", "Line 2", null])), 40);
			yield* this.updateSelfDialog();
		} else {
			yield* this.post_status(rt.at(href_list, "statdisp"));
		}
	} else if ($0 === "Power Select") {
		pnum = text2num(rt.at(href_list, "target"));
		// tg_js fix (2017 tg bug): a target outside the list of power monitors (0, 99, 1.5, text) was a "list index out of bounds" runtime.
		if (typeof pnum === "number" && Number.isInteger(pnum) && pnum >= 1 && pnum <= rt.len(f, this.powermonitors)) {
			this.powmonitor = rt.index(this.powermonitors, pnum);
			this.host_pda.mode = 433;
		}
	} else if ($0 === "Supply Orders") {
		this.host_pda.mode = 47;
	} else if ($0 === "Newscaster Access") {
		this.host_pda.mode = 53;
	} else if ($0 === "Newscaster Message") {
		if (this.host_pda.id) {
			$0 = `${this.host_pda.id.registered_name} (${this.host_pda.id.assignment})`;
		} else {
			$0 = "Unknown";
		}
		host_pda_owner_name = $0;
		message = (yield* this.host_pda.msg_input());
		for (chan of each(GLOB.news_network.network_channels, T("/datum/newscaster/feed_channel"))) {
			if (chan.channel_name == this.current_channel) {
				current = chan;
			}
		}
		if (current.locked && current.author != host_pda_owner_name) {
			this.host_pda.mode = 99;
			yield* this.host_pda.Topic(null, rt.alist(f, ["choice", "Refresh"]));
			return f.dot;
		}
		yield* GLOB.news_network.SubmitArticle(message, this.host_pda.owner, this.current_channel);
		yield* this.host_pda.Topic(null, rt.alist(f, ["choice", num2text(this.host_pda.mode)]));
		return f.dot;
	} else if ($0 === "Newscaster Switch Channel") {
		this.current_channel = (yield* this.host_pda.msg_input());
		yield* this.host_pda.Topic(null, rt.alist(f, ["choice", num2text(this.host_pda.mode)]));
		return f.dot;
	}
	if (rt.at(href_list, "op")) {
		const item = rt.at(href_list, "op");
		if (item === "control") {
			// tg_js fix (2017 tg bug): locate() of the href's ref named any object in the world; only a bot can be the one controlled.
			this.active_bot = null;
			$e = rt.locateIn(f, rt.at(href_list, "bot"), rt.world());
			if (rt.istype($e, T("/mob/living/simple_animal/bot"))) {
				this.active_bot = $e;
			}
		} else if (item === "botlist") {
			this.active_bot = null;
		} else if (item === "summon") {
			if (this.active_bot !== null)
			yield* this.active_bot.bot_control({ command: "summon", user_turf: rt.getStep(f, f.usr, 0), user_access: this.host_pda.GetAccess() });
		} else if (this.active_bot !== null) {
			yield* this.active_bot.bot_control({ command: rt.at(href_list, "op"), user: f.usr });
		}
	}
	if (rt.at(href_list, "mule") && this.active_bot !== null) {
		yield* this.active_bot.bot_control({ command: rt.at(href_list, "mule"), user: f.usr, pda: 1 });
	}
	if (!this.host_pda) {
		return f.dot;
	}
	yield* this.host_pda.attack_self(f.usr);
	return f.dot;
}, true);

// a spawn(0) body of /obj/item/weapon/cartridge/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/cartridge/proc/Topic: spawn at game/objects/items/devices/PDA/cart.dm:578", function* (f: Frame, S: Value, new_frequency: Value, pnum: Value, host_pda_owner_name: Value, message: Value, current: Value, chan: Value) {
	yield* (S = this.radio).send_signal("ACTIVATE");
	return f.dot;
});

// cart.dm:727
rt.def("/obj/item/weapon/cartridge/proc/message_header", function message_header(f: Frame) {
	return "";
});

// cart.dm:731
rt.def("/obj/item/weapon/cartridge/proc/message_special", function message_special(f: Frame, target: Value) {
	return "";
});
