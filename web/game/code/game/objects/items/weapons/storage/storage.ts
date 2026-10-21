// From code/game/objects/items/weapons/storage/storage.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5286, "/obj/item/weapon/storage", "/obj/item/weapon", {
	silent: 0,
	max_w_class: 2,
	max_combined_w_class: 14,
	storage_slots: 7,
	boxes: null,
	closer: null,
	use_to_pickup: null,
	display_contents_with_number: null,
	allow_quick_empty: null,
	allow_quick_gather: null,
	collection_mode: 1,
	preposition: "in",
	rustle_jimmies: 1,
	can_hold: null,
	cant_hold: null,
	is_seeing: null,
	name: "storage",
	icon: rt.rsc("icons/obj/storage.dmi"),
	w_class: 3,
});

// /obj/item/weapon/storage/proc/<init>  (code/game/objects/items/weapons/storage/storage.dm:13)
rt.def("/obj/item/weapon/storage/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.new_(f, T("/list"), []));
	$0 = $0;
	rt.setSv(f, "cant_hold", rt.new_(f, T("/list"), []));
	$0 = $0;
	rt.setSv(f, "is_seeing", rt.new_(f, T("/list"), []));
	return f.dot;
});

// /obj/item/weapon/storage/proc/MouseDrop  (code/game/objects/items/weapons/storage/storage.dm:31)  may sleep
rt.def("/obj/item/weapon/storage/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value) {
	let M: Value = null, H: Value = null;
	f.vars = () => [over_object, M, H];
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.usr)])))) return f.dot;
	M = live(f.usr);
	if (!truthy(live(over_object))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(rt.fv(f, "loc", live(f.usr)), T("/obj/mecha")) ? 1 : 0))) {
		return live(f.dot);
	}
	if ((isEqual(live(over_object), live(M)) && truthy((yield* g.callName(f, live(M), "CanReach", [null, live(f.src), "view_only", 1], rt.Args.Named))))) {
		yield* g.srcCall(f, "orient2hud", live(M));
		if (truthy(rt.fv(f, "s_active", live(M)))) {
			yield* g.callName(f, rt.fv(f, "s_active", live(M)), "close", [live(M)]);
		}
		yield* g.srcCall(f, "show_to", live(M));
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(M), "incapacitated", [])))) return f.dot;
	if (!truthy((rt.istype(live(over_object), T("/obj/screen")) ? 1 : 0))) {
		return (yield* g.srcCall(f, "content_can_dump", live(over_object), live(M)));
	}
	if ((!isEqual(rt.sv(f, "loc"), live(f.usr)) || (truthy(rt.sv(f, "loc")) && isEqual(rt.fv(f, "loc", rt.sv(f, "loc")), live(f.usr))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), "rustle", 50, 1, -5]);
	if (truthy((rt.istype(live(over_object), T("/obj/screen/inventory/hand")) ? 1 : 0))) {
		H = live(over_object);
		yield* g.callName(f, live(M), "putItemFromInventoryInHandIfPossible", [live(f.src), rt.fv(f, "held_index", live(H))]);
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	return f.dot;
}, true);

// /obj/item/weapon/storage/proc/MouseDrop_T  (code/game/objects/items/weapons/storage/storage.dm:65)  may sleep
rt.def("/obj/item/weapon/storage/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, O: Value, user: Value) {
	let I: Value = null, L: Value = null;
	f.vars = () => [O, user, I, L];
	if (!truthy((rt.istype(live(O), T("/obj/item")) ? 1 : 0))) return f.dot;
	I = live(O);
	if (!(truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0)) || truthy((rt.istype(live(user), T("/mob/living/simple_animal/drone")) ? 1 : 0)))) return f.dot;
	if (!(!truthy((yield* g.callName(f, (L = live(user)), "incapacitated", []))) && isEqual(live(I), (yield* g.callName(f, live(L), "get_active_held_item", []))))) return f.dot;
	if (!truthy((yield* g.srcCall(f, "can_be_inserted", live(I), 0)))) return f.dot;
	yield* g.srcCall(f, "handle_item_insertion", live(I), 0, live(L));
	return f.dot;
}, true);

// /obj/item/weapon/storage/proc/content_can_dump  (code/game/objects/items/weapons/storage/storage.dm:76)  may sleep
rt.def("/obj/item/weapon/storage/proc/content_can_dump", function* content_can_dump(f: Frame, dest_object: Value, user: Value) {
	f.vars = () => [dest_object, user];
	if ((truthy((yield* g.srcCall(f, "Adjacent", live(user)))) && truthy((yield* g.callName(f, live(dest_object), "Adjacent", [live(user)]))))) {
		if (truthy((yield* g.callName(f, live(dest_object), "storage_contents_dump_act", [live(f.src), live(user)])))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), "rustle", 50, 1, -5]);
			return 1;
		}
	}
	return 0;
}, true);

// /obj/item/weapon/storage/proc/storage_contents_dump_act  (code/game/objects/items/weapons/storage/storage.dm:84)  may sleep
rt.def("/obj/item/weapon/storage/proc/storage_contents_dump_act", function* storage_contents_dump_act(f: Frame, src_object: Value, user: Value) {
	let things: Value = null, progress: Value = null;
	f.vars = () => [src_object, user, things, progress];
	things = (yield* g.callName(f, rt.fv(f, "contents", live(src_object)), "Copy", []));
	progress = (yield* g.new_(f, T("/datum/progressbar"), [live(user), rt.len(f, live(things)), live(f.src)]));
	while (truthy((yield* g.call(f, P("/proc/do_after"), null, [live(user), 10, 1, live(f.src), 0, (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/storage/proc/handle_mass_item_insertion"), live(things), live(src_object), live(user), live(progress)]))])))) {
		yield* g.call(f, P("/proc/sleep"), null, [1]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(progress)]);
	yield* g.srcCall(f, "orient2hud", live(user));
	yield* g.callName(f, live(src_object), "orient2hud", [live(user)]);
	if (truthy(rt.fv(f, "s_active", live(user)))) {
		yield* g.callName(f, rt.fv(f, "s_active", live(user)), "close", [live(user)]);
		yield* g.callName(f, rt.fv(f, "s_active", live(user)), "show_to", [live(user)]);
	}
	return 1;
}, true);

// /obj/item/weapon/storage/proc/handle_mass_item_insertion  (code/game/objects/items/weapons/storage/storage.dm:97)  may sleep
rt.def("/obj/item/weapon/storage/proc/handle_mass_item_insertion", function* handle_mass_item_insertion(f: Frame, things: Value, src_object: Value, user: Value, progress: Value) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [things, src_object, user, progress, I, $e];
	I = null;
	rt.forList(f, 0, live(things), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		(things = rt.modify(live(things), live(I), subtract));
		if (!isEqual(rt.fv(f, "loc", live(I)), live(src_object))) {
			continue;
		}
		if (!isEqual(rt.fv(f, "s_active", live(user)), live(src_object))) {
			if (truthy((yield* g.callName(f, live(I), "on_found", [live(user)])))) {
				break;
			}
		}
		if (truthy((yield* g.srcCall(f, "can_be_inserted", live(I), 0, live(user))))) {
			yield* g.srcCall(f, "handle_item_insertion", live(I), 1, live(user));
		}
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.callName(f, live(progress), "update", [subtract(rt.fv(f, "goal", live(progress)), rt.len(f, live(things)))]);
			return 1;
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(progress), "update", [subtract(rt.fv(f, "goal", live(progress)), rt.len(f, live(things)))]);
	return 0;
}, true, { argTypes: [{ path: "/list" }, { type: 4, path: "/obj/item/weapon/storage" }, { type: 8, path: "/mob" }, { path: "/datum/progressbar" }] });

// /obj/item/weapon/storage/proc/return_inv  (code/game/objects/items/weapons/storage/storage.dm:114)
rt.def("/obj/item/weapon/storage/proc/return_inv", function return_inv(f: Frame) {
	let L: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [L, S, $e];
	L = rt.list();
	L = rt.modify(live(L), rt.sv(f, "contents"), add);
	S = null;
	rt.forList(f, 0, live(f.src), T("/obj/item/weapon/storage"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		L = rt.modify(live(L), rt.callName(f, live(S), "return_inv", []), add);
	}
	rt.endFor(f, 0);
	return live(L);
});

// /obj/item/weapon/storage/proc/show_to  (code/game/objects/items/weapons/storage/storage.dm:123)  may sleep
rt.def("/obj/item/weapon/storage/proc/show_to", function* show_to(f: Frame, user: Value) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [user, I, $e];
	if (!truthy(rt.fv(f, "client", live(user)))) {
		return live(f.dot);
	}
	if ((!isEqual(rt.fv(f, "s_active", live(user)), live(f.src)) && isEqual(rt.fv(f, "stat", live(user)), 0))) {
		I = null;
		rt.forList(f, 0, live(f.src), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if (truthy((yield* g.callName(f, live(I), "on_found", [live(user)])))) {
				return live(f.dot);
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.fv(f, "s_active", live(user)))) {
		yield* g.callName(f, rt.fv(f, "s_active", live(user)), "hide_from", [live(user)]);
	}
	(rt.modField(f, rt.fv(f, "client", live(user)), "screen", rt.sv(f, "boxes"), rt.bitOr));
	(rt.modField(f, rt.fv(f, "client", live(user)), "screen", rt.sv(f, "closer"), rt.bitOr));
	(rt.modField(f, rt.fv(f, "client", live(user)), "screen", rt.sv(f, "contents"), rt.bitOr));
	rt.setFv(f, "s_active", live(user), live(f.src));
	(rt.modSrcVar(f, "is_seeing", live(user), rt.bitOr));
	return f.dot;
}, true);

// /obj/item/weapon/storage/proc/throw_at  (code/game/objects/items/weapons/storage/storage.dm:139)  may sleep
rt.def("/obj/item/weapon/storage/proc/throw_at", function* throw_at(f: Frame) {
	if (live(f.args[4]) === null) {
		f.args[4] = 1;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = 0;
	}
	yield* g.srcCall(f, "close_all");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["target", "range", "speed", "thrower", "spin", "diagonals_first", "callback"] });

// /obj/item/weapon/storage/proc/hide_from  (code/game/objects/items/weapons/storage/storage.dm:143)
rt.def("/obj/item/weapon/storage/proc/hide_from", function hide_from(f: Frame, user: Value) {
	if (!truthy(rt.fv(f, "client", live(user)))) {
		return live(f.dot);
	}
	(rt.modField(f, rt.fv(f, "client", live(user)), "screen", rt.sv(f, "boxes"), subtract));
	(rt.modField(f, rt.fv(f, "client", live(user)), "screen", rt.sv(f, "closer"), subtract));
	(rt.modField(f, rt.fv(f, "client", live(user)), "screen", rt.sv(f, "contents"), subtract));
	if (isEqual(rt.fv(f, "s_active", live(user)), live(f.src))) {
		rt.setFv(f, "s_active", live(user), null);
	}
	(rt.modSrcVar(f, "is_seeing", live(user), subtract));
	return f.dot;
});

// /obj/item/weapon/storage/proc/can_see_contents  (code/game/objects/items/weapons/storage/storage.dm:154)
rt.def("/obj/item/weapon/storage/proc/can_see_contents", function can_see_contents(f: Frame) {
	let cansee: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [cansee, M, $e];
	cansee = rt.list();
	M = null;
	rt.forList(f, 0, rt.sv(f, "is_seeing"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((isEqual(rt.fv(f, "s_active", live(M)), live(f.src)) && truthy(rt.fv(f, "client", live(M))))) {
			(cansee = rt.modify(live(cansee), live(M), rt.bitOr));
		} else {
			(rt.modSrcVar(f, "is_seeing", live(M), subtract));
		}
	}
	rt.endFor(f, 0);
	return live(cansee);
});

// /obj/item/weapon/storage/proc/close  (code/game/objects/items/weapons/storage/storage.dm:164)
rt.def("/obj/item/weapon/storage/proc/close", function close(f: Frame, user: Value) {
	rt.callSrc(f, "hide_from", [live(user)]);
	rt.setFv(f, "s_active", live(user), null);
	return f.dot;
});

// /obj/item/weapon/storage/proc/close_all  (code/game/objects/items/weapons/storage/storage.dm:169)
rt.def("/obj/item/weapon/storage/proc/close_all", function close_all(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, rt.callSrc(f, "can_see_contents", []), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.callSrc(f, "close", [live(M)]);
		f.dot = 1;
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/weapon/storage/proc/orient_objs  (code/game/objects/items/weapons/storage/storage.dm:177)
rt.def("/obj/item/weapon/storage/proc/orient_objs", function orient_objs(f: Frame, tx: Value, ty: Value, mx: Value, my: Value) {
	let cx: Value = null, cy: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [cx, cy, O, $e];
	cx = live(tx);
	cy = live(ty);
	rt.setFv(f, "screen_loc", rt.sv(f, "boxes"), fmt("＀:,＀ to ＀,＀", [live(tx), live(ty), live(mx), live(my)]));
	O = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		rt.setFv(f, "screen_loc", live(O), fmt("＀,＀", [live(cx), live(cy)]));
		rt.setFv(f, "layer", live(O), 20);
		rt.setFv(f, "plane", live(O), 20);
		cx = rt.inc(live(cx), 1);
		if (rt.gt(live(cx), live(mx))) {
			cx = live(tx);
			cy = rt.inc(live(cy), -1);
		}
	}
	rt.endFor(f, 0);
	rt.setFv(f, "screen_loc", rt.sv(f, "closer"), fmt("＀,＀", [add(live(mx), 1), live(my)]));
	return f.dot;
});

// /obj/item/weapon/storage/proc/standard_orient_objs  (code/game/objects/items/weapons/storage/storage.dm:194)
rt.def("/obj/item/weapon/storage/proc/standard_orient_objs", function standard_orient_objs(f: Frame, rows: Value, cols: Value, display_contents: Value) {
	let cx: Value = null, cy: Value = null, ND: Value = null, O: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [cx, cy, ND, O, $0, $1, $e];
	cx = 4;
	cy = add(2, live(rows));
	rt.setFv(f, "screen_loc", rt.sv(f, "boxes"), fmt("4:16,2:16 to ＀:16,＀:16", [add(4, live(cols)), add(2, live(rows))]));
	if (truthy(rt.sv(f, "display_contents_with_number"))) {
		ND = null;
		rt.forList(f, 0, live(display_contents), T("/datum/numbered_display"));
		while (($e = rt.next(f, 0)) !== undefined) {
			ND = $e;
			rt.setFv(f, "mouse_opacity", rt.fv(f, "sample_object", live(ND)), 2);
			rt.setFv(f, "screen_loc", rt.fv(f, "sample_object", live(ND)), fmt("＀:16,＀:16", [live(cx), live(cy)]));
			$0 = rt.fv(f, "sample_object", live(ND));
			if (rt.gt(rt.fv(f, "number", live(ND)), 1)) {
				$1 = fmt("＀", [rt.fv(f, "number", live(ND))]);
			} else {
				$1 = "";
			}
			rt.setFv(f, "maptext", $0, fmt("<font color='white'>＀</font>", [$1]));
			rt.setFv(f, "layer", rt.fv(f, "sample_object", live(ND)), 20);
			rt.setFv(f, "plane", rt.fv(f, "sample_object", live(ND)), 20);
			cx = rt.inc(live(cx), 1);
			if (rt.gt(live(cx), add(4, live(cols)))) {
				cx = 4;
				cy = rt.inc(live(cy), -1);
			}
		}
		rt.endFor(f, 0);
	} else {
		O = null;
		rt.forList(f, 0, rt.sv(f, "contents"), T("/obj"));
		while (($e = rt.next(f, 0)) !== undefined) {
			O = $e;
			rt.setFv(f, "mouse_opacity", live(O), 2);
			rt.setFv(f, "screen_loc", live(O), fmt("＀:16,＀:16", [live(cx), live(cy)]));
			rt.setFv(f, "maptext", live(O), "");
			rt.setFv(f, "layer", live(O), 20);
			rt.setFv(f, "plane", live(O), 20);
			cx = rt.inc(live(cx), 1);
			if (rt.gt(live(cx), add(4, live(cols)))) {
				cx = 4;
				cy = rt.inc(live(cy), -1);
			}
		}
		rt.endFor(f, 0);
	}
	rt.setFv(f, "screen_loc", rt.sv(f, "closer"), fmt("＀:16,2:16", [add(add(4, live(cols)), 1)]));
	return f.dot;
});

rt.type(1804, "/datum/numbered_display", "/datum", {
	sample_object: null,
	number: null,
});

// /datum/numbered_display/proc/New  (code/game/objects/items/weapons/storage/storage.dm:227)  may sleep
rt.def("/datum/numbered_display/proc/New", function* New(f: Frame, sample: Value) {
	f.vars = () => [sample];
	if (!truthy((rt.istype(live(sample), T("/obj/item")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	rt.setSv(f, "sample_object", live(sample));
	rt.setSv(f, "number", 1);
	return f.dot;
}, true);

// /obj/item/weapon/storage/proc/orient2hud  (code/game/objects/items/weapons/storage/storage.dm:240)  may sleep
rt.def("/obj/item/weapon/storage/proc/orient2hud", function* orient2hud(f: Frame, user: Value) {
	let adjusted_contents: Value = null, numbered_contents: Value = null, I: Value = null, found: Value = null, ND: Value = null, row_num: Value = null, col_count: Value = null;
	let $e: any;
	f.vars = () => [user, adjusted_contents, numbered_contents, I, found, ND, row_num, col_count, $e];
	adjusted_contents = rt.len(f, rt.sv(f, "contents"));
	numbered_contents = null;
	if (truthy(rt.sv(f, "display_contents_with_number"))) {
		numbered_contents = rt.list();
		adjusted_contents = 0;
		I = null;
		rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			found = 0;
			ND = null;
			rt.forList(f, 1, live(numbered_contents), T("/datum/numbered_display"));
			while (($e = rt.next(f, 1)) !== undefined) {
				ND = $e;
				if (isEqual(rt.gv(f, "type", rt.fv(f, "sample_object", live(ND))), rt.fv(f, "type", live(I)))) {
					rt.incField(f, live(ND), "number", 1, true);
					found = 1;
					break;
				}
			}
			rt.endFor(f, 1);
			if (!truthy(live(found))) {
				adjusted_contents = rt.inc(live(adjusted_contents), 1);
				yield* g.callName(f, live(numbered_contents), "Add", [(yield* g.new_(f, T("/datum/numbered_display"), [live(I)]))]);
			}
		}
		rt.endFor(f, 0);
	}
	row_num = 0;
	col_count = subtract((yield* g.call(f, P("/proc/min"), null, [7, rt.sv(f, "storage_slots")])), 1);
	if (rt.gt(live(adjusted_contents), 7)) {
		row_num = (yield* g.call(f, P("/proc/round"), null, [divide(subtract(live(adjusted_contents), 1), 7)]));
	}
	yield* g.srcCall(f, "standard_orient_objs", live(row_num), live(col_count), live(numbered_contents));
	return f.dot;
}, true);

// /obj/item/weapon/storage/proc/can_be_inserted  (code/game/objects/items/weapons/storage/storage.dm:264)
rt.def("/obj/item/weapon/storage/proc/can_be_inserted", function can_be_inserted(f: Frame, W: Value, stop_messages: Value, user: Value) {
	let sum_w_class: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [stop_messages, sum_w_class, I, $e];
	if (live(stop_messages) === null) {
		stop_messages = 0;
	}
	if ((!truthy((rt.istype(live(W), T("/obj/item")) ? 1 : 0)) || truthy(rt.bitAnd(rt.fv(f, "flags", live(W)), 128)))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "loc"), live(W))) {
		return 0;
	}
	if (rt.ge(rt.len(f, rt.sv(f, "contents")), rt.sv(f, "storage_slots"))) {
		if (!truthy(live(stop_messages))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＀ is full, make some space!</span>", [live(f.src)])]);
		}
		return 0;
	}
	if (truthy(rt.len(f, rt.sv(f, "can_hold")))) {
		if (!truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(W), rt.sv(f, "can_hold")]))) {
			if (!truthy(live(stop_messages))) {
				rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＀ cannot hold ＀!</span>", [live(f.src), live(W)])]);
			}
			return 0;
		}
	}
	if (truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(W), rt.sv(f, "cant_hold")]))) {
		if (!truthy(live(stop_messages))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＀ cannot hold ＀!</span>", [live(f.src), live(W)])]);
		}
		return 0;
	}
	if (rt.gt(rt.fv(f, "w_class", live(W)), rt.sv(f, "max_w_class"))) {
		if (!truthy(live(stop_messages))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＀ is too big for ＀!</span>", [live(W), live(f.src)])]);
		}
		return 0;
	}
	sum_w_class = rt.fv(f, "w_class", live(W));
	I = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		sum_w_class = rt.modify(live(sum_w_class), rt.fv(f, "w_class", live(I)), add);
	}
	rt.endFor(f, 0);
	if (rt.gt(live(sum_w_class), rt.sv(f, "max_combined_w_class"))) {
		if (!truthy(live(stop_messages))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＀ won't fit in ＀, make some space!</span>", [live(W), live(f.src)])]);
		}
		return 0;
	}
	if ((rt.ge(rt.fv(f, "w_class", live(W)), rt.sv(f, "w_class")) && truthy((rt.istype(live(W), T("/obj/item/weapon/storage")) ? 1 : 0)))) {
		if (!truthy((rt.istype(live(f.src), T("/obj/item/weapon/storage/backpack/holding")) ? 1 : 0))) {
			if (!truthy(live(stop_messages))) {
				rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＀ cannot hold ＀ as it's a storage item of the same size!</span>", [live(f.src), live(W)])]);
			}
			return 0;
		}
	}
	if (truthy(rt.bitAnd(rt.fv(f, "flags", live(W)), 2))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>％！ is stuck to your hand, you can't put it in ％！!</span>", [live(W), live(f.src)])]);
		return 0;
	}
	return 1;
});

// /obj/item/weapon/storage/proc/handle_item_insertion  (code/game/objects/items/weapons/storage/storage.dm:316)  may sleep
rt.def("/obj/item/weapon/storage/proc/handle_item_insertion", function* handle_item_insertion(f: Frame, W: Value, prevent_warning: Value, user: Value) {
	let M: Value = null, observe: Value = null;
	let $e: any;
	f.vars = () => [W, prevent_warning, user, M, observe, $e];
	if (live(prevent_warning) === null) {
		prevent_warning = 0;
	}
	if (!truthy((rt.istype(live(W), T("/obj/item")) ? 1 : 0))) {
		return 0;
	}
	if (truthy(live(f.usr))) {
		if (!truthy((yield* g.callName(f, live(f.usr), "transferItemToLoc", [live(W), live(f.src)])))) {
			return 0;
		}
	} else {
		yield* g.callName(f, live(W), "forceMove", [live(f.src)]);
	}
	if (truthy(rt.sv(f, "silent"))) {
		prevent_warning = 1;
	}
	if (truthy(rt.fv(f, "pulledby", live(W)))) {
		yield* g.callName(f, rt.fv(f, "pulledby", live(W)), "stop_pulling", []);
	}
	yield* g.callName(f, live(W), "on_enter_storage", [live(f.src)]);
	if (truthy(live(f.usr))) {
		if ((truthy(rt.fv(f, "client", live(f.usr))) && !isEqual(rt.fv(f, "s_active", live(f.usr)), live(f.src)))) {
			(rt.modField(f, rt.fv(f, "client", live(f.usr)), "screen", live(W), subtract));
		}
		if ((truthy(rt.fv(f, "observers", live(f.usr))) && truthy(rt.getLen(f, rt.fv(f, "observers", live(f.usr)))))) {
			M = null;
			rt.forList(f, 0, rt.fv(f, "observers", live(f.usr)));
			while (($e = rt.next(f, 0)) !== undefined) {
				M = $e;
				if ((truthy(rt.gv(f, "client", (observe = live(M)))) && !isEqual(rt.fv(f, "s_active", live(observe)), live(f.src)))) {
					(rt.modField(f, rt.fv(f, "client", live(observe)), "screen", live(W), subtract));
				}
			}
			rt.endFor(f, 0);
		}
		yield* g.srcCall(f, "add_fingerprint", live(f.usr));
		if ((truthy(rt.sv(f, "rustle_jimmies")) && !truthy(live(prevent_warning)))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), "rustle", 50, 1, -5]);
		}
		if (!truthy(live(prevent_warning))) {
			M = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [live(f.usr), null])), T("/mob"));
			while (($e = rt.next(f, 0)) !== undefined) {
				M = $e;
				if (isEqual(live(M), live(f.usr))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You put ＀ ＀to ＀.</span>", [live(W), rt.sv(f, "preposition"), live(f.src)])]);
				} else {
					if (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(M), live(f.usr)])), 1)) {
						yield* g.callName(f, live(M), "show_message", [fmt("<span class='notice'>＀ puts ＀ ＀to ＀.</span>", [live(f.usr), live(W), rt.sv(f, "preposition"), live(f.src)]), 1]);
					} else {
						if ((truthy(live(W)) && rt.ge(rt.fv(f, "w_class", live(W)), 3))) {
							yield* g.callName(f, live(M), "show_message", [fmt("<span class='notice'>＀ puts ＀ ＀to ＀.</span>", [live(f.usr), live(W), rt.sv(f, "preposition"), live(f.src)]), 1]);
						}
					}
				}
			}
			rt.endFor(f, 0);
		}
		yield* g.srcCall(f, "orient2hud", live(f.usr));
		M = null;
		rt.forList(f, 0, (yield* g.srcCall(f, "can_see_contents")), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* g.srcCall(f, "show_to", live(M));
		}
		rt.endFor(f, 0);
	}
	rt.setFv(f, "mouse_opacity", live(W), 2);
	yield* g.srcCall(f, "update_icon");
	return 1;
}, true);

// /obj/item/weapon/storage/proc/remove_from_storage  (code/game/objects/items/weapons/storage/storage.dm:360)  may sleep
rt.def("/obj/item/weapon/storage/proc/remove_from_storage", function* remove_from_storage(f: Frame, W: Value, new_location: Value) {
	let F: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [W, new_location, F, M, $e];
	if (!truthy((rt.istype(live(W), T("/obj/item")) ? 1 : 0))) {
		return 0;
	}
	if (truthy((rt.istype(live(f.src), T("/obj/item/weapon/storage/fancy")) ? 1 : 0))) {
		yield* g.callName(f, (F = live(f.src)), "update_icon", [1]);
	}
	M = null;
	rt.forList(f, 0, (yield* g.srcCall(f, "can_see_contents")), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.fv(f, "client", live(M)))) {
			(rt.modField(f, rt.fv(f, "client", live(M)), "screen", live(W), subtract));
		}
	}
	rt.endFor(f, 0);
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) {
		M = rt.sv(f, "loc");
		yield* g.callName(f, live(W), "dropped", [live(M)]);
	}
	rt.setFv(f, "layer", live(W), rt.initial(f, live(W), "layer"));
	rt.setFv(f, "plane", live(W), rt.initial(f, live(W), "plane"));
	yield* g.callName(f, live(W), "forceMove", [live(new_location)]);
	M = null;
	rt.forList(f, 0, (yield* g.srcCall(f, "can_see_contents")), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.srcCall(f, "orient2hud", live(M));
		yield* g.srcCall(f, "show_to", live(M));
	}
	rt.endFor(f, 0);
	if (truthy(rt.fv(f, "maptext", live(W)))) {
		rt.setFv(f, "maptext", live(W), "");
	}
	yield* g.callName(f, live(W), "on_exit_storage", [live(f.src)]);
	yield* g.srcCall(f, "update_icon");
	rt.setFv(f, "mouse_opacity", live(W), rt.initial(f, live(W), "mouse_opacity"));
	return 1;
}, true);

// /obj/item/weapon/storage/proc/deconstruct  (code/game/objects/items/weapons/storage/storage.dm:390)  may sleep
rt.def("/obj/item/weapon/storage/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let drop_loc: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [disassembled, drop_loc, I, $e];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	drop_loc = rt.sv(f, "loc");
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) {
		drop_loc = rt.getStep(f, live(f.src), 0);
	}
	I = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.srcCall(f, "remove_from_storage", live(I), live(drop_loc));
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/storage/proc/attackby  (code/game/objects/items/weapons/storage/storage.dm:399)  may sleep
rt.def("/obj/item/weapon/storage/proc/attackby", function* attackby(f: Frame) {
	let labeler: Value = null;
	f.vars = () => [labeler];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/hand_labeler")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "mode", (labeler = live(f.args[0]))))) {
			return 0;
		}
	}
	f.dot = 1;
	if (truthy((rt.istype(live(f.args[1]), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "can_be_inserted", live(f.args[0]), 0, live(f.args[1]))))) {
		if (rt.ge(rt.len(f, rt.sv(f, "contents")), rt.sv(f, "storage_slots"))) {
			return 1;
		}
		return 0;
	}
	yield* g.srcCall(f, "handle_item_insertion", live(f.args[0]), 0, live(f.args[1]));
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/storage/proc/attack_hand  (code/game/objects/items/weapons/storage/storage.dm:417)  may sleep
rt.def("/obj/item/weapon/storage/proc/attack_hand", function* attack_hand(f: Frame) {
	let H: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [H, M, $e];
	if ((isEqual(rt.fv(f, "s_active", live(f.args[0])), live(f.src)) && isEqual(rt.sv(f, "loc"), live(f.args[0])))) {
		yield* g.callName(f, rt.fv(f, "s_active", live(f.args[0])), "close", [live(f.args[0])]);
		yield* g.srcCall(f, "close", live(f.args[0]));
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "rustle_jimmies"))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), "rustle", 50, 1, -5]);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if ((isEqual(rt.gv(f, "l_store", (H = live(f.args[0]))), live(f.src)) && !truthy((yield* g.callName(f, live(H), "get_active_held_item", []))))) {
			yield* g.callName(f, live(H), "put_in_hands", [live(f.src)]);
			rt.setFv(f, "l_store", live(H), null);
			return live(f.dot);
		}
		if ((isEqual(rt.fv(f, "r_store", live(H)), live(f.src)) && !truthy((yield* g.callName(f, live(H), "get_active_held_item", []))))) {
			yield* g.callName(f, live(H), "put_in_hands", [live(f.src)]);
			rt.setFv(f, "r_store", live(H), null);
			return live(f.dot);
		}
	}
	yield* g.srcCall(f, "orient2hud", live(f.args[0]));
	if (isEqual(rt.sv(f, "loc"), live(f.args[0]))) {
		if (truthy(rt.fv(f, "s_active", live(f.args[0])))) {
			yield* g.callName(f, rt.fv(f, "s_active", live(f.args[0])), "close", [live(f.args[0])]);
		}
		yield* g.srcCall(f, "show_to", live(f.args[0]));
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
		M = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1])), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if (isEqual(rt.fv(f, "s_active", live(M)), live(f.src))) {
				yield* g.srcCall(f, "close", live(M));
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/storage/proc/attack_paw  (code/game/objects/items/weapons/storage/storage.dm:449)  may sleep
rt.def("/obj/item/weapon/storage/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/item/weapon/storage/verb/toggle_gathering_mode  (code/game/objects/items/weapons/storage/storage.dm:455)
rt.def("/obj/item/weapon/storage/verb/toggle_gathering_mode", function toggle_gathering_mode(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || !truthy(rt.fv(f, "canmove", live(f.usr)))) || truthy(rt.callName(f, live(f.usr), "restrained", [])))) {
		return live(f.dot);
	}
	rt.setSv(f, "collection_mode", rt.modulus(add(rt.sv(f, "collection_mode"), 1), 3));
	$0 = rt.sv(f, "collection_mode");
	if ($0 === 2) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("＀ now picks up all items of a single type at once.", [live(f.src)])]);
	} else if ($0 === 1) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("＀ now picks up all items in a tile at once.", [live(f.src)])]);
	} else if ($0 === 0) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("＀ now picks up one item at a time.", [live(f.src)])]);
	}
	return f.dot;
}, false, { verb: { name: "Switch Gathering Method", category: "Object" } });

// /obj/item/weapon/storage/verb/quick_empty  (code/game/objects/items/weapons/storage/storage.dm:472)  may sleep
rt.def("/obj/item/weapon/storage/verb/quick_empty", function* quick_empty(f: Frame) {
	let _T: Value = null, things: Value = null, progress: Value = null;
	f.vars = () => [_T, things, progress];
	if (((((!truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0)) && !isEqual(rt.sv(f, "loc"), live(f.usr))) || truthy(rt.fv(f, "stat", live(f.usr)))) || truthy((yield* g.callName(f, live(f.usr), "restrained", [])))) || !truthy(rt.fv(f, "canmove", live(f.usr))))) {
		return live(f.dot);
	}
	_T = rt.getStep(f, live(f.src), 0);
	things = (yield* g.callName(f, rt.sv(f, "contents"), "Copy", []));
	progress = (yield* g.new_(f, T("/datum/progressbar"), [live(f.usr), rt.len(f, live(things)), live(_T)]));
	while (truthy((yield* g.call(f, P("/proc/do_after"), null, [live(f.usr), 10, 1, live(_T), 0, (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/storage/proc/mass_remove_from_storage"), live(_T), live(things), live(progress)]))])))) {
		yield* g.call(f, P("/proc/sleep"), null, [1]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(progress)]);
	return f.dot;
}, true, { verb: { name: "Empty Contents", category: "Object" } });

// /obj/item/weapon/storage/proc/mass_remove_from_storage  (code/game/objects/items/weapons/storage/storage.dm:482)  may sleep
rt.def("/obj/item/weapon/storage/proc/mass_remove_from_storage", function* mass_remove_from_storage(f: Frame, target: Value, things: Value, progress: Value) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [target, things, progress, I, $e];
	I = null;
	rt.forList(f, 0, live(things), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		(things = rt.modify(live(things), live(I), subtract));
		if (!isEqual(rt.fv(f, "loc", live(I)), live(f.src))) {
			continue;
		}
		yield* g.srcCall(f, "remove_from_storage", live(I), live(target));
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.callName(f, live(progress), "update", [subtract(rt.fv(f, "goal", live(progress)), rt.len(f, live(things)))]);
			return 1;
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(progress), "update", [subtract(rt.fv(f, "goal", live(progress)), rt.len(f, live(things)))]);
	return 0;
}, true, { argTypes: [{ path: "/atom" }, { path: "/list" }, { path: "/datum/progressbar" }] });

// /obj/item/weapon/storage/proc/do_quick_empty  (code/game/objects/items/weapons/storage/storage.dm:496)  may sleep
rt.def("/obj/item/weapon/storage/proc/do_quick_empty", function* do_quick_empty(f: Frame) {
	let _T: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [_T, I, $e];
	_T = rt.getStep(f, live(f.src), 0);
	if (truthy(live(f.usr))) {
		yield* g.srcCall(f, "hide_from", live(f.usr));
	}
	I = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.srcCall(f, "remove_from_storage", live(I), live(_T));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/weapon/storage/proc/Initialize  (code/game/objects/items/weapons/storage/storage.dm:504)  may sleep
rt.def("/obj/item/weapon/storage/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "can_hold", (yield* g.call(f, P("/proc/typecacheof"), null, [rt.sv(f, "can_hold")])));
	rt.setSv(f, "cant_hold", (yield* g.call(f, P("/proc/typecacheof"), null, [rt.sv(f, "cant_hold")])));
	if (truthy(rt.sv(f, "allow_quick_empty"))) {
		rt.modSrcVar(f, "verbs", P("/obj/item/weapon/storage/verb/quick_empty"), add);
	} else {
		(rt.modSrcVar(f, "verbs", P("/obj/item/weapon/storage/verb/quick_empty"), subtract));
	}
	if (truthy(rt.sv(f, "allow_quick_gather"))) {
		rt.modSrcVar(f, "verbs", P("/obj/item/weapon/storage/verb/toggle_gathering_mode"), add);
	} else {
		(rt.modSrcVar(f, "verbs", P("/obj/item/weapon/storage/verb/toggle_gathering_mode"), subtract));
	}
	rt.setSv(f, "boxes", (yield* g.new_(f, T("/obj/screen/storage"), [])));
	rt.setFv(f, "name", rt.sv(f, "boxes"), "storage");
	rt.setFv(f, "master", rt.sv(f, "boxes"), live(f.src));
	rt.setFv(f, "icon_state", rt.sv(f, "boxes"), "block");
	rt.setFv(f, "screen_loc", rt.sv(f, "boxes"), "7,7 to 10,8");
	rt.setFv(f, "layer", rt.sv(f, "boxes"), 19);
	rt.setFv(f, "plane", rt.sv(f, "boxes"), 19);
	rt.setSv(f, "closer", (yield* g.new_(f, T("/obj/screen/close"), [])));
	rt.setFv(f, "master", rt.sv(f, "closer"), live(f.src));
	rt.setFv(f, "icon_state", rt.sv(f, "closer"), "backpack_close");
	rt.setFv(f, "layer", rt.sv(f, "closer"), 20);
	rt.setFv(f, "plane", rt.sv(f, "closer"), 20);
	yield* g.srcCall(f, "orient2hud");
	yield* g.srcCall(f, "PopulateContents");
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/item/weapon/storage/proc/Destroy  (code/game/objects/items/weapons/storage/storage.dm:537)  may sleep
rt.def("/obj/item/weapon/storage/proc/Destroy", function* Destroy(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	O = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		rt.setFv(f, "mouse_opacity", live(O), rt.initial(f, live(O), "mouse_opacity"));
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "close_all");
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "boxes")]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "closer")]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/storage/proc/emp_act  (code/game/objects/items/weapons/storage/storage.dm:547)  may sleep
rt.def("/obj/item/weapon/storage/proc/emp_act", function* emp_act(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living")) ? 1 : 0))) {
		O = null;
		rt.forList(f, 0, rt.sv(f, "contents"), T("/obj"));
		while (($e = rt.next(f, 0)) !== undefined) {
			O = $e;
			yield* g.callName(f, live(O), "emp_act", [live(f.args[0])]);
		}
		rt.endFor(f, 0);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /obj/item/weapon/storage/proc/attack_self  (code/game/objects/items/weapons/storage/storage.dm:555)  may sleep
rt.def("/obj/item/weapon/storage/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!isEqual((yield* g.callName(f, live(user), "get_active_held_item", [])), live(f.src))) return f.dot;
	if (!truthy((yield* g.callName(f, rt.sv(f, "verbs"), "Find", [P("/obj/item/weapon/storage/verb/quick_empty")])))) return f.dot;
	yield* g.srcCall(f, "quick_empty");
	return f.dot;
}, true);

// /obj/item/weapon/storage/proc/handle_atom_del  (code/game/objects/items/weapons/storage/storage.dm:560)  may sleep
rt.def("/obj/item/weapon/storage/proc/handle_atom_del", function* handle_atom_del(f: Frame, A: Value) {
	f.vars = () => [A];
	if (!truthy((rt.isIn(f, live(A), rt.sv(f, "contents")) ? 1 : 0))) return f.dot;
	f.usr = null;
	yield* g.srcCall(f, "remove_from_storage", live(A), null);
	return f.dot;
}, true);

// /obj/item/weapon/storage/proc/contents_explosion  (code/game/objects/items/weapons/storage/storage.dm:565)  may sleep
rt.def("/obj/item/weapon/storage/proc/contents_explosion", function* contents_explosion(f: Frame, severity: Value, target: Value) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [severity, target, A, $e];
	A = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		yield* g.callName(f, live(A), "ex_act", [live(severity), live(target)]);
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
