// From code/modules/library/soapstone.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10089, "/obj/item/soapstone", "/obj/item", {
	tool_speed: 50,
	remaining_uses: 3,
	throw_speed: 3,
	throw_range: 5,
	w_class: 1,
	name: "soapstone",
	desc: "Leave informative messages for the crew, including the crew of future shifts!\nEven if out of uses, it can still be used to remove messages.\n(Not suitable for engraving on shuttles, off station or on cats. Side effects may include beatings, bannings and orbital bombardment.)",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "soapstone",
});

// /obj/item/soapstone/proc/Initialize  (code/modules/library/soapstone.dm:13)  may sleep
rt.def("/obj/item/soapstone/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "check_name");
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/item/soapstone/proc/examine  (code/modules/library/soapstone.dm:17)
rt.def("/obj/item/soapstone/proc/examine", function examine(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (isEqual(rt.sv(f, "remaining_uses"), -1)) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("It has ＀ uses left.", [rt.sv(f, "remaining_uses")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/soapstone/proc/afterattack  (code/modules/library/soapstone.dm:22)  may sleep
rt.def("/obj/item/soapstone/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let _T: Value = null, existing_message: Value = null, message: Value = null, M: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [target, user, proximity, _T, existing_message, message, M, $0, $1, $2, $3];
	_T = rt.getStep(f, live(target), 0);
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	existing_message = rt.locateIn(f, T("/obj/structure/chisel_message"), live(_T));
	if ((!truthy(rt.sv(f, "remaining_uses")) && !truthy(live(existing_message)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is too worn out to use.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/good_chisel_message_location"), null, [live(_T)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>It's not appropriate to engrave on ＀.</span>", [live(_T)])]);
		return live(f.dot);
	}
	if (truthy(live(existing_message))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ starts erasing ＀.</span>", [live(user), live(existing_message)]), fmt("<span class='notice'>You start erasing ＀.</span>", [live(existing_message)]), "<span class='italics'>You hear a chipping sound.</span>"]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/gavel.ogg"), 50, 1, -1]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, rt.sv(f, "tool_speed"), "target", live(existing_message)], rt.Args.Named)))) {
			$0 = live(user);
			$1 = fmt("<span class='notice'>＀ erases ＀.</span>", [live(user), live(existing_message)]);
			$2 = live(existing_message);
			if (isEqual(rt.fv(f, "creator_key", live(existing_message)), rt.fv(f, "ckey", live(user)))) {
				$3 = ", refunding a use";
			} else {
				$3 = "";
			}
			yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='notice'>You erase ＀＀.</span>", [$2, $3])]);
			rt.setFv(f, "persists", live(existing_message), 0);
			yield* g.call(f, P("/proc/qdel"), null, [live(existing_message)]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/gavel.ogg"), 50, 1, -1]);
			if (isEqual(rt.fv(f, "creator_key", live(existing_message)), rt.fv(f, "ckey", live(user)))) {
				yield* g.srcCall(f, "refund_use");
			}
		}
		return live(f.dot);
	}
	if (!truthy((message = (yield* g.call(f, P("/proc/stripped_input"), null, [live(user), "What would you like to engrave?", "Leave a message"]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You decide not to engrave anything.</span>"]);
		return live(f.dot);
	}
	if ((!truthy((yield* g.callName(f, live(target), "Adjacent", [live(user)]))) && truthy(rt.locateIn(f, T("/obj/structure/chisel_message"), live(_T))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Someone wrote here before you chose! Find another spot.</span>"]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/gavel.ogg"), 50, 1, -1]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ starts engraving a message into ＀...</span>", [live(user), live(_T)]), fmt("<span class='notice'>You start engraving a message into ＀...</span>", [live(_T)]), "<span class='italics'>You hear a chipping sound.</span>"]);
	if (!((truthy((yield* g.srcCall(f, "can_use"))) && truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, rt.sv(f, "tool_speed"), "target", live(_T)], rt.Args.Named)))) && truthy((yield* g.srcCall(f, "can_use"))))) return f.dot;
	if (truthy(rt.locateIn(f, (rt.isIn(f, T("/obj/structure/chisel_message"), live(_T)) ? 1 : 0), rt.world()))) return f.dot;
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ leaves a message for future spacemen!</span>", [live(user)]), fmt("<span class='notice'>You engrave a message into ＀!</span>", [live(_T)]), "<span class='italics'>You hear a chipping sound.</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/gavel.ogg"), 50, 1, -1]);
	yield* g.callName(f, (M = (yield* g.new_(f, T("/obj/structure/chisel_message"), [live(_T)]))), "register", [live(user), live(message)]);
	yield* g.srcCall(f, "remove_use");
	return f.dot;
}, true);

// /obj/item/soapstone/proc/can_use  (code/modules/library/soapstone.dm:67)
rt.def("/obj/item/soapstone/proc/can_use", function can_use(f: Frame) {
	return ((isEqual(rt.sv(f, "remaining_uses"), -1) ? 1 : 0) || (rt.ge(rt.sv(f, "remaining_uses"), 0) ? 1 : 0));
});

// /obj/item/soapstone/proc/remove_use  (code/modules/library/soapstone.dm:70)
rt.def("/obj/item/soapstone/proc/remove_use", function remove_use(f: Frame) {
	if (rt.le(rt.sv(f, "remaining_uses"), 0)) {
		return live(f.dot);
	}
	rt.incSrcVar(f, "remaining_uses", -1, true);
	rt.callSrc(f, "check_name", []);
	return f.dot;
});

// /obj/item/soapstone/proc/refund_use  (code/modules/library/soapstone.dm:76)
rt.def("/obj/item/soapstone/proc/refund_use", function refund_use(f: Frame) {
	if (isEqual(rt.sv(f, "remaining_uses"), -1)) {
		return live(f.dot);
	}
	rt.incSrcVar(f, "remaining_uses", 1, true);
	rt.callSrc(f, "check_name", []);
	return f.dot;
});

// /obj/item/soapstone/proc/check_name  (code/modules/library/soapstone.dm:84)
rt.def("/obj/item/soapstone/proc/check_name", function check_name(f: Frame) {
	if (truthy(rt.sv(f, "remaining_uses"))) {
		rt.setSv(f, "name", rt.initial(f, live(f.src), "name"));
	} else {
		rt.setSv(f, "name", fmt("dull ＀", [rt.initial(f, live(f.src), "name")]));
	}
	return f.dot;
});

// /proc/good_chisel_message_location  (code/modules/library/soapstone.dm:102)
rt.def("/proc/good_chisel_message_location", function good_chisel_message_location(f: Frame, _T: Value) {
	if (!truthy(live(_T))) {
		f.dot = 0;
	} else {
		if (!(truthy((rt.istype(live(_T), T("/turf/open/floor")) ? 1 : 0)) || truthy((rt.istype(live(_T), T("/turf/closed/wall")) ? 1 : 0)))) {
			f.dot = 0;
		} else {
			f.dot = 1;
		}
	}
	return f.dot;
});

rt.type(12953, "/obj/structure/chisel_message", "/obj/structure", {
	hidden_message: null,
	creator_key: null,
	creator_name: null,
	realdate: null,
	map: null,
	persists: 1,
	like_keys: null,
	dislike_keys: null,
	original_turf: null,
	anchored: 1,
	name: "engraved message",
	desc: "A message from a past traveler.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "soapstone_message",
	layer: 2.2,
	density: 0,
	obj_integrity: 30,
	max_integrity: 30,
});

// /obj/structure/chisel_message/proc/<init>  (code/modules/library/soapstone.dm:127)
rt.def("/obj/structure/chisel_message/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "like_keys", rt.list());
	$0 = $0;
	rt.setSv(f, "dislike_keys", rt.list());
	return f.dot;
});

// /obj/structure/chisel_message/proc/Initialize  (code/modules/library/soapstone.dm:133)  may sleep
rt.def("/obj/structure/chisel_message/proc/Initialize", function* Initialize(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.modField(f, rt.gl("SSpersistence"), "chisel_messages", live(f.src), add);
	rt.setSv(f, "original_turf", (_T = rt.getStep(f, live(f.src), 0)));
	if (truthy((yield* g.call(f, P("/proc/good_chisel_message_location"), null, [live(_T)])))) return f.dot;
	rt.setSv(f, "persists", 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/structure/chisel_message/proc/register  (code/modules/library/soapstone.dm:143)
rt.def("/obj/structure/chisel_message/proc/register", function register(f: Frame, user: Value, newmessage: Value) {
	rt.setSv(f, "hidden_message", live(newmessage));
	rt.setSv(f, "creator_name", rt.fv(f, "real_name", live(user)));
	rt.setSv(f, "creator_key", rt.fv(f, "ckey", live(user)));
	rt.setSv(f, "realdate", rt.fv(f, "timeofday", rt.world()));
	rt.setSv(f, "map", rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))));
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/structure/chisel_message/proc/update_icon  (code/modules/library/soapstone.dm:151)
rt.def("/obj/structure/chisel_message/proc/update_icon", function update_icon(f: Frame) {
	let hash: Value = null, newcolor: Value = null;
	f.vars = () => [hash, newcolor];
	rt.callSuper(f, [], rt.Args.Same);
	hash = rt.call(f, P("/proc/md5"), null, [rt.sv(f, "hidden_message")]);
	rt.callSrc(f, "add_atom_colour", [fmt("#＀", [(newcolor = rt.call(f, P("/proc/copytext"), null, [live(hash), 1, 7]))]), 4]);
	rt.setSv(f, "light_color", fmt("#＀", [live(newcolor)]));
	rt.callSrc(f, "set_light", [1]);
	return f.dot;
});

// /obj/structure/chisel_message/proc/pack  (code/modules/library/soapstone.dm:159)
rt.def("/obj/structure/chisel_message/proc/pack", function pack(f: Frame) {
	let data: Value = null;
	f.vars = () => [data];
	rt.setAt((data = rt.list()), "hidden_message", rt.sv(f, "hidden_message"));
	rt.setAt(live(data), "creator_name", rt.sv(f, "creator_name"));
	rt.setAt(live(data), "creator_key", rt.sv(f, "creator_key"));
	rt.setAt(live(data), "realdate", rt.sv(f, "realdate"));
	rt.setAt(live(data), "map", rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))));
	rt.setAt(live(data), "x", rt.fv(f, "x", rt.sv(f, "original_turf")));
	rt.setAt(live(data), "y", rt.fv(f, "y", rt.sv(f, "original_turf")));
	rt.setAt(live(data), "z", rt.fv(f, "z", rt.sv(f, "original_turf")));
	rt.setAt(live(data), "like_keys", rt.sv(f, "like_keys"));
	rt.setAt(live(data), "dislike_keys", rt.sv(f, "dislike_keys"));
	return live(data);
});

// /obj/structure/chisel_message/proc/unpack  (code/modules/library/soapstone.dm:173)  may sleep
rt.def("/obj/structure/chisel_message/proc/unpack", function* unpack(f: Frame, data: Value) {
	let x: Value = null, y: Value = null, z: Value = null, newloc: Value = null;
	f.vars = () => [data, x, y, z, newloc];
	if (!truthy((rt.istype(live(data), T("/list")) ? 1 : 0))) {
		return live(f.dot);
	}
	rt.setSv(f, "hidden_message", rt.at(live(data), "hidden_message"));
	rt.setSv(f, "creator_name", rt.at(live(data), "creator_name"));
	rt.setSv(f, "creator_key", rt.at(live(data), "creator_key"));
	rt.setSv(f, "realdate", rt.at(live(data), "realdate"));
	rt.setSv(f, "like_keys", rt.at(live(data), "like_keys"));
	if (!truthy(rt.sv(f, "like_keys"))) {
		rt.setSv(f, "like_keys", rt.list());
	}
	rt.setSv(f, "dislike_keys", rt.at(live(data), "dislike_keys"));
	if (!truthy(rt.sv(f, "dislike_keys"))) {
		rt.setSv(f, "dislike_keys", rt.list());
	}
	x = rt.at(live(data), "x");
	y = rt.at(live(data), "y");
	z = rt.at(live(data), "z");
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [(newloc = rt.locate(live(x), live(y), live(z)))])))) {
		yield* g.srcCall(f, "forceMove", live(newloc));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/structure/chisel_message/proc/examine  (code/modules/library/soapstone.dm:196)
rt.def("/obj/structure/chisel_message/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>＀</span>", [rt.sv(f, "hidden_message")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/chisel_message/proc/Destroy  (code/modules/library/soapstone.dm:201)  may sleep
rt.def("/obj/structure/chisel_message/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "persists"))) {
		yield* g.callName(f, rt.gl("SSpersistence"), "SaveChiselMessage", [live(f.src)]);
	}
	(rt.modField(f, rt.gl("SSpersistence"), "chisel_messages", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/structure/chisel_message/proc/ui_interact  (code/modules/library/soapstone.dm:207)  may sleep
rt.def("/obj/structure/chisel_message/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("always_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "engraved_message", rt.sv(f, "name"), 600, 300, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/structure/chisel_message/proc/ui_data  (code/modules/library/soapstone.dm:213)
rt.def("/obj/structure/chisel_message/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null;
	f.vars = () => [data];
	rt.setAt((data = rt.list()), "hidden_message", rt.sv(f, "hidden_message"));
	rt.setAt(live(data), "realdate", rt.call(f, P("/proc/SQLtime"), null, [rt.sv(f, "realdate")]));
	rt.setAt(live(data), "num_likes", rt.len(f, rt.sv(f, "like_keys")));
	rt.setAt(live(data), "num_dislikes", rt.len(f, rt.sv(f, "dislike_keys")));
	rt.setAt(live(data), "is_creator", (isEqual(rt.fv(f, "ckey", live(user)), rt.sv(f, "creator_key")) ? 1 : 0));
	rt.setAt(live(data), "has_liked", (rt.isIn(f, rt.fv(f, "ckey", live(user)), rt.sv(f, "like_keys")) ? 1 : 0));
	rt.setAt(live(data), "has_disliked", (rt.isIn(f, rt.fv(f, "ckey", live(user)), rt.sv(f, "dislike_keys")) ? 1 : 0));
	if (truthy(rt.call(f, P("/proc/check_rights_for"), null, [rt.fv(f, "client", live(user)), 2]))) {
		rt.setAt(live(data), "admin_mode", 1);
		rt.setAt(live(data), "creator_key", rt.sv(f, "creator_key"));
		rt.setAt(live(data), "creator_name", rt.sv(f, "creator_name"));
	}
	return live(data);
});

// /obj/structure/chisel_message/proc/ui_act  (code/modules/library/soapstone.dm:231)  may sleep
rt.def("/obj/structure/chisel_message/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value) {
	let user: Value = null, is_admin: Value = null, is_creator: Value = null, has_liked: Value = null, has_disliked: Value = null, confirm: Value = null;
	let $0: any;
	f.vars = () => [action, params, ui, user, is_admin, is_creator, has_liked, has_disliked, confirm, $0];
	// An href can reach this with the window closed or out of reach: only an interactive window may act.
	if (!truthy(live(ui)) || !isEqual(rt.fv(f, "status", live(ui)), 2)) {
		return 1;
	}
	user = live(f.usr);
	is_admin = (yield* g.call(f, P("/proc/check_rights_for"), null, [rt.fv(f, "client", live(user)), 2]));
	is_creator = (isEqual(rt.fv(f, "ckey", live(user)), rt.sv(f, "creator_key")) ? 1 : 0);
	has_liked = (rt.isIn(f, rt.fv(f, "ckey", live(user)), rt.sv(f, "like_keys")) ? 1 : 0);
	has_disliked = (rt.isIn(f, rt.fv(f, "ckey", live(user)), rt.sv(f, "dislike_keys")) ? 1 : 0);
	$0 = live(action);
	if ($0 === "like") {
		if (truthy(live(is_creator))) {
			return live(f.dot);
		}
		if (truthy(live(has_disliked))) {
			(rt.modSrcVar(f, "dislike_keys", rt.fv(f, "ckey", live(user)), subtract));
		}
		(rt.modSrcVar(f, "like_keys", rt.fv(f, "ckey", live(user)), rt.bitOr));
		f.dot = 1;
	} else if ($0 === "dislike") {
		if (truthy(live(is_creator))) {
			return live(f.dot);
		}
		if (truthy(live(has_liked))) {
			(rt.modSrcVar(f, "like_keys", rt.fv(f, "ckey", live(user)), subtract));
		}
		(rt.modSrcVar(f, "dislike_keys", rt.fv(f, "ckey", live(user)), rt.bitOr));
		f.dot = 1;
	} else if ($0 === "neutral") {
		if (truthy(live(is_creator))) {
			return live(f.dot);
		}
		(rt.modSrcVar(f, "dislike_keys", rt.fv(f, "ckey", live(user)), subtract));
		(rt.modSrcVar(f, "like_keys", rt.fv(f, "ckey", live(user)), subtract));
		f.dot = 1;
	} else if ($0 === "delete") {
		if (!truthy(live(is_admin))) {
			return live(f.dot);
		}
		if (!isEqual((confirm = (yield* g.call(f, P("/proc/alert"), null, [live(user), "Confirm deletion of engraved message?", "Confirm Deletion", "Yes", "No"]))), "Yes")) return f.dot;
		rt.setSv(f, "persists", 0);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);
