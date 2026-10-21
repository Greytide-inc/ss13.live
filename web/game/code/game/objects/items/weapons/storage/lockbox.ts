// From code/game/objects/items/weapons/storage/lockbox.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5576, "/obj/item/weapon/storage/lockbox", "/obj/item/weapon/storage", {
	locked: 1,
	broken: 0,
	open: 0,
	icon_locked: "lockbox+l",
	icon_closed: "lockbox",
	icon_broken: "lockbox+b",
	name: "lockbox",
	desc: "A locked box.",
	icon_state: "lockbox+l",
	item_state: "syringe_kit",
	w_class: 4,
	max_w_class: 3,
	max_combined_w_class: 14,
	storage_slots: 4,
	req_access: null,
});

// /obj/item/weapon/storage/lockbox/proc/<init>  (code/game/objects/items/weapons/storage/lockbox.dm:10)
rt.def("/obj/item/weapon/storage/lockbox/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(3));
	return f.dot;
});

// /obj/item/weapon/storage/lockbox/proc/attackby  (code/game/objects/items/weapons/storage/lockbox.dm:20)  may sleep
rt.def("/obj/item/weapon/storage/lockbox/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.callName(f, live(f.args[0]), "GetID", [])))) {
		if (truthy(rt.sv(f, "broken"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>It appears to be broken.</span>"]);
			return live(f.dot);
		}
		if (truthy((yield* g.srcCall(f, "allowed", live(f.args[1]))))) {
			rt.setSv(f, "locked", (!truthy(rt.sv(f, "locked")) ? 1 : 0));
			if (truthy(rt.sv(f, "locked"))) {
				rt.setSv(f, "icon_state", rt.sv(f, "icon_locked"));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='danger'>You lock the ＀!</span>", [rt.fv(f, "name", live(f.src))])]);
				yield* g.srcCall(f, "close_all");
				return live(f.dot);
			} else {
				rt.setSv(f, "icon_state", rt.sv(f, "icon_closed"));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='danger'>You unlock the ＀!</span>", [rt.fv(f, "name", live(f.src))])]);
				return live(f.dot);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>Access Denied.</span>"]);
			return live(f.dot);
		}
	}
	if (!truthy(rt.sv(f, "locked"))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>It's locked!</span>"]);
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/storage/lockbox/proc/MouseDrop  (code/game/objects/items/weapons/storage/lockbox.dm:45)  may sleep
rt.def("/obj/item/weapon/storage/lockbox/proc/MouseDrop", function* MouseDrop(f: Frame) {
	if (truthy(rt.sv(f, "locked"))) {
		yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.usr)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>It's locked!</span>"]);
		return 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["over_object", "src_location", "over_location"] });

// /obj/item/weapon/storage/lockbox/proc/emag_act  (code/game/objects/items/weapons/storage/lockbox.dm:51)
rt.def("/obj/item/weapon/storage/lockbox/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "broken"))) return f.dot;
	rt.setSv(f, "broken", 1);
	rt.setSv(f, "locked", 0);
	rt.modSrcVar(f, "desc", "It appears to be broken.", add);
	rt.setSv(f, "icon_state", rt.fv(f, "icon_broken", live(f.src)));
	if (!truthy(live(user))) return f.dot;
	rt.callSrc(f, "visible_message", [fmt("<span class='warning'>＄！ has been broken by ＀ with an electromagnetic card!</span>", [live(f.src), live(user)])]);
	return live(f.dot);
});

// /obj/item/weapon/storage/lockbox/proc/show_to  (code/game/objects/items/weapons/storage/lockbox.dm:61)  may sleep
rt.def("/obj/item/weapon/storage/lockbox/proc/show_to", function* show_to(f: Frame) {
	if (truthy(rt.sv(f, "locked"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>It's locked!</span>"]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/item/weapon/storage/lockbox/proc/storage_contents_dump_act  (code/game/objects/items/weapons/storage/lockbox.dm:69)  may sleep
rt.def("/obj/item/weapon/storage/lockbox/proc/storage_contents_dump_act", function* storage_contents_dump_act(f: Frame) {
	if (truthy(rt.sv(f, "locked"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>It's locked!</span>"]);
		return 0;
	}
	rt.setSv(f, "open", 1);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["src_object", "user"] });

// /obj/item/weapon/storage/lockbox/proc/can_be_inserted  (code/game/objects/items/weapons/storage/lockbox.dm:77)
rt.def("/obj/item/weapon/storage/lockbox/proc/can_be_inserted", function can_be_inserted(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (truthy(rt.sv(f, "locked"))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["W", "stop_messages"] });

// /obj/item/weapon/storage/lockbox/proc/handle_item_insertion  (code/game/objects/items/weapons/storage/lockbox.dm:81)  may sleep
rt.def("/obj/item/weapon/storage/lockbox/proc/handle_item_insertion", function* handle_item_insertion(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	rt.setSv(f, "open", 1);
	yield* g.srcCall(f, "update_icon");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "prevent_warning", "user"] });

// /obj/item/weapon/storage/lockbox/proc/remove_from_storage  (code/game/objects/items/weapons/storage/lockbox.dm:85)  may sleep
rt.def("/obj/item/weapon/storage/lockbox/proc/remove_from_storage", function* remove_from_storage(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	rt.setSv(f, "open", 1);
	yield* g.srcCall(f, "update_icon");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "new_location", "burn"] });

rt.type(5577, "/obj/item/weapon/storage/lockbox/loyalty", "/obj/item/weapon/storage/lockbox", {
	name: "lockbox of mindshield implants",
	req_access: null,
});

// /obj/item/weapon/storage/lockbox/loyalty/proc/<init>  (code/game/objects/items/weapons/storage/lockbox.dm:90)
rt.def("/obj/item/weapon/storage/lockbox/loyalty/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(1));
	return f.dot;
});

// /obj/item/weapon/storage/lockbox/loyalty/proc/PopulateContents  (code/game/objects/items/weapons/storage/lockbox.dm:93)  may sleep
rt.def("/obj/item/weapon/storage/lockbox/loyalty/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/implantcase/mindshield"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/item/weapon/implanter/mindshield"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5578, "/obj/item/weapon/storage/lockbox/clusterbang", "/obj/item/weapon/storage/lockbox", {
	name: "lockbox of clusterbangs",
	desc: "You have a bad feeling about opening this.",
	req_access: null,
});

// /obj/item/weapon/storage/lockbox/clusterbang/proc/<init>  (code/game/objects/items/weapons/storage/lockbox.dm:101)
rt.def("/obj/item/weapon/storage/lockbox/clusterbang/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(1));
	return f.dot;
});

// /obj/item/weapon/storage/lockbox/clusterbang/proc/PopulateContents  (code/game/objects/items/weapons/storage/lockbox.dm:104)  may sleep
rt.def("/obj/item/weapon/storage/lockbox/clusterbang/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/grenade/clusterbuster"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5579, "/obj/item/weapon/storage/lockbox/medal", "/obj/item/weapon/storage/lockbox", {
	icon_locked: "medalbox+l",
	icon_closed: "medalbox",
	icon_broken: "medalbox+b",
	name: "medal box",
	desc: "A locked box used to store medals of honor.",
	icon_state: "medalbox+l",
	item_state: "syringe_kit",
	w_class: 3,
	max_w_class: 2,
	storage_slots: 10,
	max_combined_w_class: 20,
	req_access: null,
	can_hold: null,
});

// /obj/item/weapon/storage/lockbox/medal/proc/<init>  (code/game/objects/items/weapons/storage/lockbox.dm:115)
rt.def("/obj/item/weapon/storage/lockbox/medal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(20));
	$0 = $0;
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/clothing/accessory/medal")));
	return f.dot;
});

// /obj/item/weapon/storage/lockbox/medal/proc/AltClick  (code/game/objects/items/weapons/storage/lockbox.dm:122)  may sleep
rt.def("/obj/item/weapon/storage/lockbox/medal/proc/AltClick", function* AltClick(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(rt.sv(f, "locked"))) {
		if (truthy(rt.sv(f, "open"))) {
			$0 = 0;
		} else {
			$0 = 1;
		}
		rt.setSv(f, "open", $0);
		yield* g.srcCall(f, "update_icon");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/weapon/storage/lockbox/medal/proc/PopulateContents  (code/game/objects/items/weapons/storage/lockbox.dm:128)  may sleep
rt.def("/obj/item/weapon/storage/lockbox/medal/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.new_(f, T("/obj/item/clothing/accessory/medal/gold/captain"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/accessory/medal/silver/valor"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/accessory/medal/silver/valor"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/accessory/medal/silver/security"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/accessory/medal/bronze_heart"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/accessory/medal/plasma/nobel_science"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/accessory/medal/plasma/nobel_science"), [live(f.src)]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/accessory/medal/conduct"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/weapon/storage/lockbox/medal/proc/update_icon  (code/game/objects/items/weapons/storage/lockbox.dm:139)
rt.def("/obj/item/weapon/storage/lockbox/medal/proc/update_icon", function update_icon(f: Frame) {
	let i: Value = null, M: Value = null, medalicon: Value = null;
	let $e: any;
	f.vars = () => [i, M, medalicon, $e];
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "locked"))) {
		rt.setSv(f, "icon_state", "medalbox+l");
		rt.setSv(f, "open", 0);
	} else {
		rt.setSv(f, "icon_state", "medalbox");
		if (truthy(rt.sv(f, "open"))) {
			rt.modSrcVar(f, "icon_state", "open", add);
		}
		if (truthy(rt.sv(f, "broken"))) {
			rt.modSrcVar(f, "icon_state", "+b", add);
		}
		if (!(truthy(rt.sv(f, "contents")) && truthy(rt.sv(f, "open")))) return f.dot;
		i = null;
		rt.forRange(f, 0, 1, rt.len(f, rt.sv(f, "contents")), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			M = rt.index(rt.sv(f, "contents"), live(i));
			medalicon = rt.call(f, P("/proc/mutable_appearance"), null, [rt.initial(f, live(f.src), "icon"), rt.fv(f, "medaltype", live(M))]);
			if ((rt.gt(live(i), 1) && rt.le(live(i), 5))) {
				rt.modField(f, live(medalicon), "pixel_x", multiply(subtract(live(i), 1), 3), add);
			} else {
				if (rt.gt(live(i), 5)) {
					(rt.modField(f, live(medalicon), "pixel_y", 7, subtract));
					(rt.modField(f, live(medalicon), "pixel_x", 2, subtract));
					rt.modField(f, live(medalicon), "pixel_x", multiply(subtract(live(i), 6), 3), add);
				}
			}
			rt.callSrc(f, "add_overlay", [live(medalicon)]);
		}
		rt.endFor(f, 0);
	}
	return f.dot;
});

rt.type(5580, "/obj/item/weapon/storage/lockbox/medal/sec", "/obj/item/weapon/storage/lockbox/medal", {
	name: "security medal box",
	desc: "A locked box used to store medals to be given to members of the security department.",
	req_access: null,
});

// /obj/item/weapon/storage/lockbox/medal/sec/proc/<init>  (code/game/objects/items/weapons/storage/lockbox.dm:164)
rt.def("/obj/item/weapon/storage/lockbox/medal/sec/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(58));
	return f.dot;
});

// /obj/item/weapon/storage/lockbox/medal/sec/proc/PopulateContents  (code/game/objects/items/weapons/storage/lockbox.dm:167)  may sleep
rt.def("/obj/item/weapon/storage/lockbox/medal/sec/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/accessory/medal/silver/security"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5581, "/obj/item/weapon/storage/lockbox/medal/sci", "/obj/item/weapon/storage/lockbox/medal", {
	name: "science medal box",
	desc: "A locked box used to store medals to be given to members of the science department.",
	req_access: null,
});

// /obj/item/weapon/storage/lockbox/medal/sci/proc/<init>  (code/game/objects/items/weapons/storage/lockbox.dm:173)
rt.def("/obj/item/weapon/storage/lockbox/medal/sci/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(30));
	return f.dot;
});

// /obj/item/weapon/storage/lockbox/medal/sci/proc/PopulateContents  (code/game/objects/items/weapons/storage/lockbox.dm:176)  may sleep
rt.def("/obj/item/weapon/storage/lockbox/medal/sci/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clothing/accessory/medal/plasma/nobel_science"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
