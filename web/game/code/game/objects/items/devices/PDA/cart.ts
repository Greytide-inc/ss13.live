// From code/game/objects/items/devices/PDA/cart.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/weapon/cartridge/proc/special  empty
rt.def("/obj/item/weapon/cartridge/proc/special", undefined, false, { args: ["user", "params"] });

// /obj/item/weapon/cartridge/proc/<init>  (code/game/objects/items/devices/PDA/cart.dm:42)
rt.def("/obj/item/weapon/cartridge/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "powermonitors", rt.list());
	$0 = $0;
	rt.setSv(f, "stored_data", rt.list());
	$0 = $0;
	rt.setSv(f, "botlist", rt.list());
	return f.dot;
});

// /obj/item/weapon/cartridge/proc/Initialize  (code/game/objects/items/devices/PDA/cart.dm:52)  may sleep
rt.def("/obj/item/weapon/cartridge/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[0]))) return f.dot;
	rt.setSv(f, "host_pda", live(f.args[0]));
	return f.dot;
}, true, { args: ["pda"] });

rt.type(7021, "/obj/item/weapon/cartridge/signal", "/obj/item/weapon/cartridge", {
	name: "generic signaler cartridge",
	desc: "A data cartridge with an integrated radio signaler module.",
});

// /obj/item/weapon/cartridge/signal/proc/Initialize  (code/game/objects/items/devices/PDA/cart.dm:134)  may sleep
rt.def("/obj/item/weapon/cartridge/signal/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "radio", (yield* g.new_(f, T("/obj/item/radio/integrated/signal"), [live(f.src)])));
	return f.dot;
}, true);

rt.type(7029, "/obj/item/weapon/cartridge/rd", "/obj/item/weapon/cartridge", {
	access: 18708,
	bot_access_flags: 28,
	name: "１Signal Ace DELUXE cartridge",
	icon_state: "cart-rd",
});

// /obj/item/weapon/cartridge/rd/proc/Initialize  (code/game/objects/items/devices/PDA/cart.dm:183)  may sleep
rt.def("/obj/item/weapon/cartridge/rd/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "radio", (yield* g.new_(f, T("/obj/item/radio/integrated/signal"), [live(f.src)])));
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

// /obj/item/weapon/cartridge/captain/proc/New  (code/game/objects/items/devices/PDA/cart.dm:195)  may sleep
rt.def("/obj/item/weapon/cartridge/captain/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "radio", (yield* g.new_(f, T("/obj/item/radio/integrated/signal"), [live(f.src)])));
	return f.dot;
}, true);

// /obj/item/weapon/cartridge/proc/post_status  (code/game/objects/items/devices/PDA/cart.dm:200)  may sleep
rt.def("/obj/item/weapon/cartridge/proc/post_status", function* post_status(f: Frame, command: Value, data1: Value, data2: Value) {
	let frequency: Value = null, status_signal: Value = null;
	let $0: any;
	f.vars = () => [command, data1, data2, frequency, status_signal, $0];
	if (!truthy((frequency = (yield* g.callName(f, rt.gl("SSradio"), "return_frequency", [1435]))))) {
		return live(f.dot);
	}
	rt.setFv(f, "source", (status_signal = (yield* g.new_(f, T("/datum/signal"), []))), live(f.src));
	rt.setFv(f, "transmission_method", live(status_signal), 1);
	rt.setAt(rt.fv(f, "data", live(status_signal)), "command", live(command));
	$0 = live(command);
	if ($0 === "message") {
		rt.setAt(rt.fv(f, "data", live(status_signal)), "msg1", live(data1));
		rt.setAt(rt.fv(f, "data", live(status_signal)), "msg2", live(data2));
	} else if ($0 === "alert") {
		rt.setAt(rt.fv(f, "data", live(status_signal)), "picture_state", live(data1));
	}
	yield* g.callName(f, live(frequency), "post_signal", [live(f.src), live(status_signal)]);
	return f.dot;
}, true);

// tg_js: the cartridge apps are native tgui screens (tgui/src/interfaces/pda.ract). cart_data builds the list for the host PDA's
// current `mode` (what generate_menu used to write as HTML); buttons send the "cart" ui_act, which goes through Topic below unchanged.
function cdRow(pairs: any) {
	const E = rt.list();
	for (let i = 0; i < pairs.length; i += 2) rt.setAt(live(E), pairs[i], pairs[i + 1]);
	return E;
}
function cdPush(out: Value, row: Value) {
	rt.modify(live(out), rt.list(live(row)), add);
}
function cdStr(v: Value) {
	return fmt("＀", [live(v)]);
}
function cdRef(v: Value) {
	return fmt("＃", [live(v)]);
}

// /obj/item/weapon/cartridge/proc/cart_data  (tg_js)  may sleep
rt.def("/obj/item/weapon/cartridge/proc/cart_data", function* cart_data(f: Frame, user: Value) {
	let d: Value = null, R: Value = null, L: Value = null, pm: Value = null, n: Value = null, term: Value = null, A: Value = null, c: Value = null, cl: Value = null, M: Value = null, ml: Value = null, B: Value = null, ch: Value = null, cur: Value = null, msg: Value = null, cm: Value = null, sup: Value = null, out: Value = null, sub: Value = null, mode: Value = null;
	let $e: any;
	f.vars = () => [user, d, R, L, pm, n, term, A, c, cl, M, ml, B, ch, cur, msg, cm, sup, out, sub, mode, $e];
	d = rt.list();
	if (!truthy(rt.sv(f, "host_pda"))) {
		return live(d);
	}
	mode = rt.fv(f, "mode", rt.sv(f, "host_pda"));
	if (mode === 40) {
		sub = rt.sv(f, "radio");
		rt.setAt(live(d), "frequency", (yield* g.call(f, P("/proc/format_frequency"), null, [rt.fv(f, "frequency", live(sub))])));
		rt.setAt(live(d), "code", rt.fv(f, "code", live(sub)));
	} else if (mode === 42) {
		rt.setAt(live(d), "message1", rt.sv(f, "message1"));
		rt.setAt(live(d), "message2", rt.sv(f, "message2"));
	} else if (mode === 43) {
		rt.setSv(f, "powmonitor", null);
		rt.setSv(f, "powermonitors", rt.list());
		pm = null;
		rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/computer/monitor"));
		while (($e = rt.next(f, 0)) !== undefined) {
			pm = $e;
			if (!truthy(rt.bitAnd(rt.fv(f, "stat", live(pm)), 3))) {
				rt.modSrcVar(f, "powermonitors", live(pm), add);
			}
		}
		rt.endFor(f, 0);
		out = rt.list();
		n = 0;
		pm = null;
		rt.forList(f, 0, rt.sv(f, "powermonitors"), T("/obj/machinery/computer/monitor"));
		while (($e = rt.next(f, 0)) !== undefined) {
			pm = $e;
			n = rt.inc(live(n), 1);
			cdPush(out, cdRow(["name", cdStr(pm), "n", cdStr(n)]));
		}
		rt.endFor(f, 0);
		rt.setAt(live(d), "monitors", live(out));
	} else if (mode === 433) {
		if (truthy(rt.sv(f, "powmonitor"))) {
			L = rt.list();
			term = null;
			rt.forList(f, 0, rt.gv(f, "nodes", rt.gv(f, "powernet", rt.fv(f, "attached", rt.sv(f, "powmonitor")))), T("/obj/machinery/power/terminal"));
			while (($e = rt.next(f, 0)) !== undefined) {
				term = $e;
				if (truthy((rt.istype(rt.fv(f, "master", live(term)), T("/obj/machinery/power/apc")) ? 1 : 0))) {
					rt.modify(live(L), (A = rt.fv(f, "master", live(term))), add);
				}
			}
			rt.endFor(f, 0);
			rt.setAt(live(d), "avail", rt.gv(f, "viewavail", rt.gv(f, "powernet", rt.fv(f, "attached", rt.sv(f, "powmonitor")))));
			rt.setAt(live(d), "load", (yield* g.call(f, P("/proc/num2text"), null, [rt.gv(f, "viewload", rt.gv(f, "powernet", rt.fv(f, "attached", rt.sv(f, "powmonitor")))), 10])));
			out = rt.list();
			const S_1 = ["Off", "AOff", "On", "AOn"], chg = ["N", "C", "F"];
			A = null;
			rt.forList(f, 0, live(L), T("/obj/machinery/power/apc"));
			while (($e = rt.next(f, 0)) !== undefined) {
				A = $e;
				cdPush(out, cdRow([
					"area", rt.gv(f, "name", rt.fv(f, "area", live(A))),
					"eqp", S_1[Number(rt.fv(f, "equipment", live(A)))], "lgt", S_1[Number(rt.fv(f, "lighting", live(A)))], "env", S_1[Number(rt.fv(f, "environ", live(A)))],
					"load", rt.fv(f, "lastused_total", live(A)),
					"cell", truthy(rt.fv(f, "cell", live(A))) ? (yield* g.call(f, P("/proc/round"), null, [(yield* g.callName(f, rt.fv(f, "cell", live(A)), "percent", []))])) : null,
					"charging", chg[Number(rt.fv(f, "charging", live(A)))]]));
			}
			rt.endFor(f, 0);
			rt.setAt(live(d), "apcs", live(out));
			rt.setAt(live(d), "connected", 1);
		}
	} else if (mode === 44 || mode === 45) {
		out = rt.list();
		if (truthy(rt.fv(f, "general", rt.gl("data_core")))) {
			R = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/sortRecord"), null, [rt.fv(f, "general", rt.gl("data_core"))])), T("/datum/data/record"));
			while (($e = rt.next(f, 0)) !== undefined) {
				R = $e;
				cdPush(out, cdRow(["id", rt.index(rt.fv(f, "fields", live(R)), "id"), "name", rt.index(rt.fv(f, "fields", live(R)), "name")]));
			}
			rt.endFor(f, 0);
		}
		rt.setAt(live(d), "records", live(out));
	} else if (mode === 441 || mode === 451) {
		const gen = rt.sv(f, "active1");
		if (truthy((rt.isIn(f, gen, rt.fv(f, "general", rt.gl("data_core"))) ? 1 : 0))) {
			out = rt.list();
			for (const k of ["name", "id", "sex", "age", "rank", "fingerprint", "p_stat", "m_stat"]) rt.setAt(live(out), k, rt.index(rt.fv(f, "fields", gen), k));
			rt.setAt(live(d), "general", live(out));
		}
		if (mode === 441) {
			const med = rt.sv(f, "active2");
			if (truthy((rt.isIn(f, med, rt.fv(f, "medical", rt.gl("data_core"))) ? 1 : 0))) {
				out = rt.list();
				for (const k of ["blood_type", "mi_dis", "mi_dis_d", "ma_dis", "ma_dis_d", "alg", "alg_d", "cdi", "cdi_d", "notes"]) rt.setAt(live(out), k, rt.index(rt.fv(f, "fields", med), k));
				rt.setAt(live(d), "medical", live(out));
			}
		} else {
			const sec = rt.sv(f, "active3");
			if (truthy((rt.isIn(f, sec, rt.fv(f, "security", rt.gl("data_core"))) ? 1 : 0))) {
				out = rt.list();
				rt.setAt(live(out), "criminal", rt.index(rt.fv(f, "fields", sec), "criminal"));
				rt.setAt(live(out), "notes", rt.index(rt.fv(f, "fields", sec), "notes"));
				for (const k of ["mi_crim", "ma_crim"]) {
					sub = rt.list();
					c = null;
					rt.forList(f, 0, rt.index(rt.fv(f, "fields", sec), k), T("/datum/data/crime"));
					while (($e = rt.next(f, 0)) !== undefined) {
						c = $e;
						cdPush(sub, cdRow(["crime", rt.fv(f, "crimeName", live(c)), "details", rt.fv(f, "crimeDetails", live(c)), "author", rt.fv(f, "author", live(c)), "time", rt.fv(f, "time", live(c))]));
					}
					rt.endFor(f, 0);
					rt.setAt(live(out), k, live(sub));
				}
				rt.setAt(live(d), "security", live(out));
			}
		}
	} else if (mode === 47) {
		sup = rt.fv(f, "supply", rt.gl("SSshuttle"));
		if (rt.gv(f, "mode", live(sup)) === "call") {
			rt.setAt(live(d), "shuttle", fmt("Moving to ＀ (＀ Mins)", [!isEqual(rt.gv(f, "z", live(sup)), 2) ? "station" : "centcomm", (yield* g.callName(f, live(sup), "timeLeft", [600]))]));
		} else {
			rt.setAt(live(d), "shuttle", "At " + (!isEqual(rt.gv(f, "z", live(sup)), 2) ? "centcomm" : "station"));
		}
		for (const [key, lst] of [["approved", "shoppinglist"], ["requests", "requestlist"]]) {
			out = rt.list();
			rt.forList(f, 0, rt.fv(f, lst, rt.gl("SSshuttle")));
			while (($e = rt.next(f, 0)) !== undefined) {
				M = $e;
				cdPush(out, cdRow(["id", rt.gv(f, "id", live(M)), "name", rt.gv(f, "name", rt.fv(f, "pack", live(M))), "orderer", rt.fv(f, "orderer", live(M)), "reason", rt.fv(f, "reason", live(M))]));
			}
			rt.endFor(f, 0);
			rt.setAt(live(d), key, live(out));
		}
	} else if (mode === 49) {
		if (truthy((cl = rt.getStep(f, live(f.src), 0)))) {
			rt.setAt(live(d), "located", 1);
			rt.setAt(live(d), "x", rt.fv(f, "x", live(cl)));
			rt.setAt(live(d), "y", rt.fv(f, "y", live(cl)));
			const scans: any[] = [["mops", "/obj/item/weapon/mop", "world"], ["carts", "/obj/structure/janitorialcart", "world"], ["bots", "/mob/living/simple_animal/bot/cleanbot", "living_mob_list"]];
			for (const [key, path, srcList] of scans) {
				out = rt.list();
				M = null;
				rt.forList(f, 0, srcList === "world" ? rt.world() : rt.gl(srcList), T(path));
				while (($e = rt.next(f, 0)) !== undefined) {
					M = $e;
					if (!truthy((ml = rt.getStep(f, live(M), 0)))) continue;
					if (!isEqual(rt.fv(f, "z", live(ml)), rt.fv(f, "z", live(cl)))) continue;
					const dir = rt.getDir(f, live(f.src), live(M));
					const dtxt = (yield* g.call(f, P("/proc/uppertext"), null, [(yield* g.call(f, P("/proc/dir2text"), null, [live(dir)]))]));
					const extra = key === "mops" ? (truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(M)))) ? "Wet" : "Dry") : key === "carts" ? "Water level: " + cdStr(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(M)))) + "/100" : (truthy(rt.fv(f, "on", live(M))) ? "Online" : "Offline");
					cdPush(out, cdRow(["x", rt.fv(f, "x", live(ml)), "y", rt.fv(f, "y", live(ml)), "dir", dtxt, "info", extra]));
				}
				rt.endFor(f, 0);
				rt.setAt(live(d), key, live(out));
			}
		}
	} else if (mode === 53) {
		rt.setAt(live(d), "channel", truthy(rt.sv(f, "current_channel")) ? rt.sv(f, "current_channel") : "None");
		cur = null;
		ch = null;
		rt.forList(f, 0, rt.fv(f, "network_channels", rt.gl("news_network")), T("/datum/newscaster/feed_channel"));
		while (($e = rt.next(f, 0)) !== undefined) {
			ch = $e;
			if (isEqual(rt.fv(f, "channel_name", live(ch)), rt.sv(f, "current_channel"))) {
				cur = live(ch);
			}
		}
		rt.endFor(f, 0);
		if (truthy(live(cur))) {
			rt.setAt(live(d), "found", 1);
			out = rt.list();
			msg = null;
			rt.forList(f, 0, rt.fv(f, "messages", live(cur)), T("/datum/newscaster/feed_message"));
			while (($e = rt.next(f, 0)) !== undefined) {
				msg = $e;
				sub = rt.list();
				cm = null;
				rt.forList(f, 1, rt.fv(f, "comments", live(msg)), T("/datum/newscaster/feed_comment"));
				while (($e = rt.next(f, 1)) !== undefined) {
					cm = $e;
					cdPush(sub, cdRow(["body", rt.fv(f, "body", live(cm)), "author", rt.fv(f, "author", live(cm)), "time", rt.fv(f, "time_stamp", live(cm))]));
				}
				rt.endFor(f, 1);
				cdPush(out, cdRow(["body", (yield* g.callName(f, live(msg), "returnBody", [-1])), "author", (yield* g.callName(f, live(msg), "returnAuthor", [-1])), "photo", truthy(rt.fv(f, "img", live(msg))) ? 1 : 0, "comments", live(sub)]));
			}
			rt.endFor(f, 0);
			rt.setAt(live(d), "messages", live(out));
		}
	} else if (mode === 54) {
		B = rt.sv(f, "active_bot");
		if (truthy(live(B))) {
			sub = cdRow([
				"ref", cdRef(B), "name", cdStr(B), "model", rt.fv(f, "model", live(B)),
				"area", cdStr((yield* g.call(f, P("/proc/get_area"), null, [live(B)]))), "mode", (yield* g.callName(f, live(B), "get_mode", [])),
				"allow_pai", truthy(rt.fv(f, "allow_pai", live(B))) ? 1 : 0,
				"pai", (truthy(rt.fv(f, "paicard", live(B))) && truthy(rt.gv(f, "pai", rt.fv(f, "paicard", live(B))))) ? rt.gv(f, "name", rt.gv(f, "pai", rt.fv(f, "paicard", live(B)))) : null,
				"can_eject", truthy((yield* g.callName(f, rt.fv(f, "bot_core", live(B)), "allowed", [live(f.usr)]))) ? 1 : 0,
				"is_mule", isEqual(rt.fv(f, "bot_type", live(B)), 2) ? 1 : 0]);
			if (isEqual(rt.fv(f, "bot_type", live(B)), 2)) {
				rt.setAt(live(sub), "load", truthy(rt.fv(f, "load", live(B))) ? rt.fv(f, "name", rt.fv(f, "load", live(B))) : null);
				rt.setAt(live(sub), "destination", truthy(rt.fv(f, "destination", live(B))) ? rt.fv(f, "destination", live(B)) : null);
				rt.setAt(live(sub), "suffix", rt.fv(f, "suffix", live(B)));
				rt.setAt(live(sub), "power", truthy(rt.fv(f, "cell", live(B))) ? (yield* g.callName(f, rt.fv(f, "cell", live(B)), "percent", [])) : 0);
				rt.setAt(live(sub), "home", truthy(rt.fv(f, "home_destination", live(B))) ? rt.fv(f, "home_destination", live(B)) : null);
				rt.setAt(live(sub), "report", truthy(rt.fv(f, "report_delivery", live(B))) ? 1 : 0);
				rt.setAt(live(sub), "autoret", truthy(rt.fv(f, "auto_return", live(B))) ? 1 : 0);
				rt.setAt(live(sub), "autopick", truthy(rt.fv(f, "auto_pickup", live(B))) ? 1 : 0);
			}
			rt.setAt(live(d), "bot", live(sub));
		} else {
			out = rt.list();
			const zlevel = rt.fv(f, "z", rt.getStep(f, live(f.src), 0));
			B = null;
			rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/simple_animal/bot"));
			while (($e = rt.next(f, 0)) !== undefined) {
				B = $e;
				if ((((!truthy(rt.fv(f, "on", live(B))) || !isEqual(rt.fv(f, "z", live(B)), live(zlevel))) || truthy(rt.fv(f, "remote_disabled", live(B)))) || !truthy(rt.bitAnd(rt.sv(f, "bot_access_flags"), rt.fv(f, "bot_type", live(B)))))) {
					continue;
				}
				cdPush(out, cdRow(["ref", cdRef(B), "name", rt.fv(f, "name", live(B)), "mode", (yield* g.callName(f, live(B), "get_mode", []))]));
			}
			rt.endFor(f, 0);
			rt.setAt(live(d), "bots", live(out));
		}
	} else if (mode === 99) {
		rt.setAt(live(d), "no_id", truthy(rt.fv(f, "id", rt.sv(f, "host_pda"))) ? 0 : 1);
	}
	return live(d);
}, true);

// /obj/item/weapon/cartridge/proc/Topic  (code/game/objects/items/devices/PDA/cart.dm:553)  may sleep
rt.def("/obj/item/weapon/cartridge/proc/Topic", function* Topic(f: Frame) {
	let S: Value = null, new_frequency: Value = null, pnum: Value = null, host_pda_owner_name: Value = null, message: Value = null, current: Value = null, chan: Value = null;
	let $0: any, $e: any;
	f.vars = () => [S, new_frequency, pnum, host_pda_owner_name, message, current, chan, $0, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((((!truthy(rt.fv(f, "canmove", live(f.usr))) || truthy(rt.fv(f, "stat", live(f.usr)))) || truthy((yield* g.callName(f, live(f.usr), "restrained", [])))) || !rt.le((yield* g.call(f, P("/proc/get_dist"), null, [rt.sv(f, "loc"), live(f.usr)])), 1)) || !truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [rt.sv(f, "loc")])))) {
		// tg_js fix (2017 tg bug): the distance check alone let a player standing next to someone else's PDA push its cartridge's buttons by href; the PDA's own check (canUseTopic) now applies too.
		yield* g.callName(f, live(f.usr), "unset_machine", []);
		rt.op(f, "Browse", [], [live(f.usr), null, "window=pda"], false);
		return live(f.dot);
	}
	$0 = rt.at(live(f.args[1]), "choice");
	if ($0 === "Medical Records") {
		rt.setSv(f, "active1", (yield* g.call(f, P("/proc/find_record"), null, ["id", rt.at(live(f.args[1]), "target"), rt.fv(f, "general", rt.gl("data_core"))])));
		if (truthy(rt.sv(f, "active1"))) {
			rt.setSv(f, "active2", (yield* g.call(f, P("/proc/find_record"), null, ["id", rt.at(live(f.args[1]), "target"), rt.fv(f, "medical", rt.gl("data_core"))])));
		}
		rt.setFv(f, "mode", rt.sv(f, "host_pda"), 441);
		if (!truthy(rt.sv(f, "active2"))) {
			rt.setSv(f, "active1", null);
		}
	} else if ($0 === "Security Records") {
		rt.setSv(f, "active1", (yield* g.call(f, P("/proc/find_record"), null, ["id", rt.at(live(f.args[1]), "target"), rt.fv(f, "general", rt.gl("data_core"))])));
		if (truthy(rt.sv(f, "active1"))) {
			rt.setSv(f, "active3", (yield* g.call(f, P("/proc/find_record"), null, ["id", rt.at(live(f.args[1]), "target"), rt.fv(f, "security", rt.gl("data_core"))])));
		}
		rt.setFv(f, "mode", rt.sv(f, "host_pda"), 451);
		if (!truthy(rt.sv(f, "active3"))) {
			rt.setSv(f, "active1", null);
		}
	} else if ($0 === "Send Signal") {
		rt.spawnTail(f, 0, "/obj/item/weapon/cartridge/proc/Topic: spawn at game/objects/items/devices/PDA/cart.dm:578", S, new_frequency, pnum, host_pda_owner_name, message, current, chan);
	} else if ($0 === "Signal Frequency") {
		S = rt.sv(f, "radio");
		new_frequency = (yield* g.call(f, P("/proc/sanitize_frequency"), null, [add(rt.fv(f, "frequency", live(S)), (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "sfreq")])))]));
		yield* g.callName(f, live(S), "set_frequency", [live(new_frequency)]);
	} else if ($0 === "Signal Code") {
		rt.modField(f, (S = rt.sv(f, "radio")), "code", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "scode")])), add);
		rt.setFv(f, "code", live(S), (yield* g.call(f, P("/proc/round"), null, [rt.fv(f, "code", live(S))])));
		rt.setFv(f, "code", live(S), (yield* g.call(f, P("/proc/min"), null, [100, rt.fv(f, "code", live(S))])));
		rt.setFv(f, "code", live(S), (yield* g.call(f, P("/proc/max"), null, [1, rt.fv(f, "code", live(S))])));
	} else if ($0 === "Status") {
		$0 = rt.at(live(f.args[1]), "statdisp");
		if ($0 === "message") {
			yield* g.srcCall(f, "post_status", "message", rt.sv(f, "message1"), rt.sv(f, "message2"));
		} else if ($0 === "alert") {
			yield* g.srcCall(f, "post_status", "alert", rt.at(live(f.args[1]), "alert"));
		} else if ($0 === "setmsg1") {
			rt.setSv(f, "message1", (yield* g.call(f, P("/proc/reject_bad_text"), null, [(yield* g.op(f, "Prompt", [3], [null, rt.sv(f, "message1"), "Enter Message Text", "Line 1", null])), 40])));
			yield* g.srcCall(f, "updateSelfDialog");
		} else if ($0 === "setmsg2") {
			rt.setSv(f, "message2", (yield* g.call(f, P("/proc/reject_bad_text"), null, [(yield* g.op(f, "Prompt", [3], [null, rt.sv(f, "message2"), "Enter Message Text", "Line 2", null])), 40])));
			yield* g.srcCall(f, "updateSelfDialog");
		} else {
			yield* g.srcCall(f, "post_status", rt.at(live(f.args[1]), "statdisp"));
		}
	} else if ($0 === "Power Select") {
		pnum = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "target")]));
		// tg_js fix (2017 tg bug): a target outside the list of power monitors (0, 99, 1.5, text) was a "list index out of bounds" runtime.
		if (typeof live(pnum) === "number" && Number.isInteger(live(pnum)) && live(pnum) >= 1 && live(pnum) <= rt.len(f, rt.sv(f, "powermonitors"))) {
			rt.setSv(f, "powmonitor", rt.index(rt.sv(f, "powermonitors"), live(pnum)));
			rt.setFv(f, "mode", rt.sv(f, "host_pda"), 433);
		}
	} else if ($0 === "Supply Orders") {
		rt.setFv(f, "mode", rt.sv(f, "host_pda"), 47);
	} else if ($0 === "Newscaster Access") {
		rt.setFv(f, "mode", rt.sv(f, "host_pda"), 53);
	} else if ($0 === "Newscaster Message") {
		if (truthy(rt.fv(f, "id", rt.sv(f, "host_pda")))) {
			$0 = fmt("＀ (＀)", [rt.gv(f, "registered_name", rt.fv(f, "id", rt.sv(f, "host_pda"))), rt.gv(f, "assignment", rt.fv(f, "id", rt.sv(f, "host_pda")))]);
		} else {
			$0 = "Unknown";
		}
		host_pda_owner_name = $0;
		message = (yield* g.callName(f, rt.sv(f, "host_pda"), "msg_input", []));
		current = null;
		chan = null;
		rt.forList(f, 0, rt.fv(f, "network_channels", rt.gl("news_network")), T("/datum/newscaster/feed_channel"));
		while (($e = rt.next(f, 0)) !== undefined) {
			chan = $e;
			if (isEqual(rt.fv(f, "channel_name", live(chan)), rt.sv(f, "current_channel"))) {
				current = live(chan);
			}
		}
		rt.endFor(f, 0);
		if ((truthy(rt.fv(f, "locked", live(current))) && !isEqual(rt.fv(f, "author", live(current)), live(host_pda_owner_name)))) {
			rt.setFv(f, "mode", rt.sv(f, "host_pda"), 99);
			yield* g.callName(f, rt.sv(f, "host_pda"), "Topic", [null, rt.alist(f, ["choice", "Refresh"])]);
			return live(f.dot);
		}
		yield* g.callName(f, rt.gl("news_network"), "SubmitArticle", [live(message), rt.fv(f, "owner", rt.sv(f, "host_pda")), rt.sv(f, "current_channel")]);
		yield* g.callName(f, rt.sv(f, "host_pda"), "Topic", [null, rt.alist(f, ["choice", (yield* g.call(f, P("/proc/num2text"), null, [rt.fv(f, "mode", rt.sv(f, "host_pda"))]))])]);
		return live(f.dot);
	} else if ($0 === "Newscaster Switch Channel") {
		rt.setSv(f, "current_channel", (yield* g.callName(f, rt.sv(f, "host_pda"), "msg_input", [])));
		yield* g.callName(f, rt.sv(f, "host_pda"), "Topic", [null, rt.alist(f, ["choice", (yield* g.call(f, P("/proc/num2text"), null, [rt.fv(f, "mode", rt.sv(f, "host_pda"))]))])]);
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "op"))) {
		$0 = rt.at(live(f.args[1]), "op");
		if ($0 === "control") {
			// tg_js fix (2017 tg bug): locate() of the href's ref named any object in the world; only a bot can be the one controlled.
			rt.setSv(f, "active_bot", null);
			$e = rt.locateIn(f, rt.at(live(f.args[1]), "bot"), rt.world());
			if (rt.istype(live($e), T("/mob/living/simple_animal/bot"))) {
				rt.setSv(f, "active_bot", live($e));
			}
		} else if ($0 === "botlist") {
			rt.setSv(f, "active_bot", null);
		} else if ($0 === "summon") {
			if (rt.sv(f, "active_bot") !== null)
			yield* g.callName(f, rt.sv(f, "active_bot"), "bot_control", ["command", "summon", "user_turf", rt.getStep(f, live(f.usr), 0), "user_access", (yield* g.callName(f, rt.sv(f, "host_pda"), "GetAccess", []))], rt.Args.Named);
		} else if (rt.sv(f, "active_bot") !== null) {
			yield* g.callName(f, rt.sv(f, "active_bot"), "bot_control", ["command", rt.at(live(f.args[1]), "op"), "user", live(f.usr)], rt.Args.Named);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "mule")) && rt.sv(f, "active_bot") !== null) {
		yield* g.callName(f, rt.sv(f, "active_bot"), "bot_control", ["command", rt.at(live(f.args[1]), "mule"), "user", live(f.usr), "pda", 1], rt.Args.Named);
	}
	if (!truthy(rt.sv(f, "host_pda"))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "host_pda"), "attack_self", [live(f.usr)]);
	return f.dot;
}, true, { args: ["href", "href_list"] });

// a spawn(0) body of /obj/item/weapon/cartridge/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/cartridge/proc/Topic: spawn at game/objects/items/devices/PDA/cart.dm:578", function* (f: Frame, S: Value, new_frequency: Value, pnum: Value, host_pda_owner_name: Value, message: Value, current: Value, chan: Value) {
	f.vars = () => [S, new_frequency, pnum, host_pda_owner_name, message, current, chan];
	yield* g.callName(f, (S = rt.sv(f, "radio")), "send_signal", ["ACTIVATE"]);
	return live(f.dot);
	return null;
});

// /obj/item/weapon/cartridge/proc/message_header  (code/game/objects/items/devices/PDA/cart.dm:727)
rt.def("/obj/item/weapon/cartridge/proc/message_header", function message_header(f: Frame) {
	return "";
});

// /obj/item/weapon/cartridge/proc/message_special  (code/game/objects/items/devices/PDA/cart.dm:731)
rt.def("/obj/item/weapon/cartridge/proc/message_special", function message_special(f: Frame, target: Value) {
	return "";
});
