// From code/modules/mining/satchel_ore_boxdm.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12956, "/obj/structure/ore_box", "/obj/structure", {
	pressure_resistance: 506.625,
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "orebox",
	name: "ore box",
	desc: "A heavy wooden box, which can be filled with a lot of ores.",
	density: 1,
});

// /obj/structure/ore_box/proc/attackby  (code/modules/mining/satchel_ore_boxdm.dm:13)  may sleep
rt.def("/obj/structure/ore_box/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null, O: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [S, O, C, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/ore")) ? 1 : 0))) {
		if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
			return live(f.dot);
		}
		yield* g.callName(f, live(f.args[0]), "forceMove", [live(f.src)]);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/storage")) ? 1 : 0))) {
			S = live(f.args[0]);
			O = null;
			rt.forList(f, 0, rt.fv(f, "contents", live(S)), T("/obj/item/weapon/ore"));
			while (($e = rt.next(f, 0)) !== undefined) {
				O = $e;
				yield* g.callName(f, live(S), "remove_from_storage", [live(O), live(f.src)]);
			}
			rt.endFor(f, 0);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You empty the ore in ＀ into ％！.</span>", [live(S), live(f.src)])]);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
				C = live(f.args[0]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(50, rt.fv(f, "toolspeed", live(C))), "target", live(f.src)], rt.Args.Named)))) {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ pries ％！ apart.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You pry apart ％！.</span>", [live(f.src)]), "<span class='italics'>You hear splitting wood.</span>"]);
					yield* g.srcCall(f, "deconstruct", 1, live(f.args[1]));
				}
			} else {
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/ore_box/proc/examine  (code/modules/mining/satchel_ore_boxdm.dm:32)
rt.def("/obj/structure/ore_box/proc/examine", function examine(f: Frame) {
	if ((truthy(rt.callSrc(f, "Adjacent", [live(f.args[0])])) && truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0)))) {
		rt.callSrc(f, "show_contents", [live(f.args[0])]);
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/ore_box/proc/attack_hand  (code/modules/mining/satchel_ore_boxdm.dm:37)
rt.def("/obj/structure/ore_box/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	if (!truthy(rt.callSrc(f, "Adjacent", [live(user)]))) return f.dot;
	rt.callSrc(f, "show_contents", [live(user)]);
	return f.dot;
});

// /obj/structure/ore_box/proc/attack_robot  (code/modules/mining/satchel_ore_boxdm.dm:41)
rt.def("/obj/structure/ore_box/proc/attack_robot", function attack_robot(f: Frame, user: Value) {
	if (!truthy(rt.callSrc(f, "Adjacent", [live(user)]))) return f.dot;
	rt.callSrc(f, "show_contents", [live(user)]);
	return f.dot;
});

// /obj/structure/ore_box/proc/show_contents  (code/modules/mining/satchel_ore_boxdm.dm:45)
rt.def("/obj/structure/ore_box/proc/show_contents", function show_contents(f: Frame, user: Value) {
	let dat: Value = null, oretypes: Value = null, O: Value = null, i: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [dat, oretypes, O, i, _T, $e];
	dat = "<b>The contents of the ore box reveal...</b><br>";
	oretypes = rt.list();
	O = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/weapon/ore"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		(oretypes = rt.modify(live(oretypes), rt.fv(f, "type", live(O)), rt.bitOr));
	}
	rt.endFor(f, 0);
	i = null;
	rt.forList(f, 0, live(oretypes));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		dat = rt.modify(live(dat), fmt("＀: ＀<br>", [rt.call(f, P("/proc/capitalize"), null, [rt.gv(f, "name", (_T = rt.locateIn(f, live(i), rt.sv(f, "contents"))))]), rt.call(f, P("/proc/count_by_type"), null, [rt.sv(f, "contents"), rt.fv(f, "type", live(_T))])]), add);
	}
	rt.endFor(f, 0);
	dat = rt.modify(live(dat), fmt("<br><br><A href='?src=＃;removeall=1'>Empty box</A>", [live(f.src)]), add);
	rt.op(f, "Browse", [], [live(user), live(dat), "window=orebox"], false);
	return f.dot;
});

// /obj/structure/ore_box/proc/dump_box_contents  (code/modules/mining/satchel_ore_boxdm.dm:56)  may sleep
rt.def("/obj/structure/ore_box/proc/dump_box_contents", function* dump_box_contents(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	O = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/weapon/ore"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		yield* g.callName(f, live(O), "forceMove", [rt.sv(f, "loc")]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/ore_box/proc/Topic  (code/modules/mining/satchel_ore_boxdm.dm:60)  may sleep
rt.def("/obj/structure/ore_box/proc/Topic", function* Topic(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "Adjacent", live(f.usr))))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.usr)]);
	if (truthy(rt.at(live(f.args[1]), "removeall"))) {
		yield* g.srcCall(f, "dump_box_contents");
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>You empty the box.</span>"]);
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/structure/ore_box/proc/deconstruct  (code/modules/mining/satchel_ore_boxdm.dm:74)  may sleep
rt.def("/obj/structure/ore_box/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value, user: Value) {
	let WD: Value = null;
	f.vars = () => [disassembled, user, WD];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	WD = (yield* g.new_(f, T("/obj/item/stack/sheet/mineral/wood"), [rt.sv(f, "loc"), 4]));
	if (truthy(live(user))) {
		yield* g.callName(f, live(WD), "add_fingerprint", [live(user)]);
	}
	yield* g.srcCall(f, "dump_box_contents");
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
