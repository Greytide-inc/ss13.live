// From code/modules/reagents/chemistry/machinery/reagentgrinder.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10981, "/obj/machinery/reagentgrinder", "/obj/machinery", {
	operating: 0,
	beaker: null,
	limit: 10,
	holdingitems: null,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 5,
	active_power_usage: 100,
	pass_flags: 1,
	name: "All-In-One Grinder",
	desc: "From BlenderTech. Will It Blend? Let's test it out!",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "juicer1",
	layer: 2.9,
	resistance_flags: 32,
}, { global: { blend_items: 767, juice_items: 768, dried_items: 769 } });

// /obj/machinery/reagentgrinder/proc/<init>  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:83)
rt.def("/obj/machinery/reagentgrinder/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "holdingitems", rt.list());
	return f.dot;
});

// /obj/machinery/reagentgrinder/proc/Initialize  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:86)  may sleep
rt.def("/obj/machinery/reagentgrinder/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "beaker", (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker/large"), [live(f.src)])));
	rt.modField(f, rt.sv(f, "beaker"), "desc", " May contain blended dust. Don't breathe this in!", add);
	return f.dot;
}, true);

// /obj/machinery/reagentgrinder/proc/Destroy  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:91)  may sleep
rt.def("/obj/machinery/reagentgrinder/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "beaker")]);
	rt.setSv(f, "beaker", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/reagentgrinder/proc/contents_explosion  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:96)
rt.def("/obj/machinery/reagentgrinder/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	if (!truthy(rt.sv(f, "beaker"))) return f.dot;
	rt.callName(f, rt.sv(f, "beaker"), "ex_act", [live(severity), live(target)]);
	return f.dot;
});

// /obj/machinery/reagentgrinder/proc/handle_atom_del  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:99)  may sleep
rt.def("/obj/machinery/reagentgrinder/proc/handle_atom_del", function* handle_atom_del(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!isEqual(live(f.args[0]), rt.sv(f, "beaker"))) return f.dot;
	rt.setSv(f, "beaker", null);
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true, { args: ["A"] });

// /obj/machinery/reagentgrinder/proc/deconstruct  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:106)  may sleep
rt.def("/obj/machinery/reagentgrinder/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 3]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/reagentgrinder/proc/update_icon  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:111)
rt.def("/obj/machinery/reagentgrinder/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "beaker"))) {
		rt.setSv(f, "icon_state", "juicer1");
	} else {
		rt.setSv(f, "icon_state", "juicer0");
	}
	return f.dot;
});

// /obj/machinery/reagentgrinder/proc/attackby  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:116)  may sleep
rt.def("/obj/machinery/reagentgrinder/proc/attackby", function* attackby(f: Frame) {
	let G: Value = null, B: Value = null, G_1: Value = null;
	let $e: any;
	f.vars = () => [G, B, G_1, $e];
	if (truthy((yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers")) ? 1 : 0)) && truthy(rt.bitAnd(rt.fv(f, "container_type", live(f.args[0])), 4096)))) {
		if (!truthy(rt.sv(f, "beaker"))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return 1;
			}
			rt.setSv(f, "beaker", live(f.args[0]));
			rt.setFv(f, "loc", rt.sv(f, "beaker"), live(f.src));
			yield* g.srcCall(f, "update_icon");
			yield* g.callName(f, live(f.src), "updateUsrDialog", []);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There's already a container inside.</span>"]);
		}
		return 1;
	}
	if (truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(f.args[0]), rt.gl("dried_items")])))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks/grown")) ? 1 : 0))) {
			if (!truthy(rt.gv(f, "dry", (G = live(f.args[0]))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You must dry that first!</span>"]);
				return 1;
			}
		}
	}
	if ((truthy(rt.sv(f, "holdingitems")) && rt.ge(rt.len(f, rt.sv(f, "holdingitems")), rt.sv(f, "limit")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The machine cannot hold anymore items."]);
		return 1;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/storage/bag")) ? 1 : 0))) {
		B = live(f.args[0]);
		G_1 = null;
		rt.forList(f, 0, rt.fv(f, "contents", live(B)), T("/obj/item/weapon/reagent_containers/food/snacks/grown"));
		while (($e = rt.next(f, 0)) !== undefined) {
			G_1 = $e;
			yield* g.callName(f, live(B), "remove_from_storage", [live(G_1), live(f.src)]);
			if ((truthy((rt.modSrcVar(f, "holdingitems", live(G_1), add))) && rt.ge(rt.len(f, rt.sv(f, "holdingitems")), rt.sv(f, "limit")))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You fill the All-In-One grinder to the brim.</span>"]);
				break;
			}
		}
		rt.endFor(f, 0);
		if (!truthy(rt.getLen(f, rt.fv(f, "contents", live(f.args[0]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You empty the plant bag into the All-In-One grinder.</span>"]);
		}
		yield* g.callName(f, live(f.src), "updateUsrDialog", []);
		return 1;
	}
	if ((!truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(f.args[0]), rt.gl("blend_items")]))) && !truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(f.args[0]), rt.gl("juice_items")]))))) {
		if (isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Cannot refine into a reagent!</span>"]);
		return 1;
	}
	if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) return f.dot;
	rt.setFv(f, "loc", live(f.args[0]), live(f.src));
	rt.modSrcVar(f, "holdingitems", live(f.args[0]), add);
	yield* g.callName(f, live(f.src), "updateUsrDialog", []);
	return 0;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/reagentgrinder/proc/attack_paw  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:172)  may sleep
rt.def("/obj/machinery/reagentgrinder/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(user)]));
}, true);

// /obj/machinery/reagentgrinder/proc/attack_hand  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:178)  may sleep
rt.def("/obj/machinery/reagentgrinder/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	yield* g.srcCall(f, "interact", live(user));
	return f.dot;
}, true);

// /obj/machinery/reagentgrinder/proc/interact  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:184)  may sleep
rt.def("/obj/machinery/reagentgrinder/proc/interact", function* interact(f: Frame, user: Value) {
	let is_chamber_empty: Value = null, is_beaker_ready: Value = null, processing_chamber: Value = null, beaker_contents: Value = null, dat: Value = null, O: Value = null, anything: Value = null, R: Value = null, popup: Value = null;
	let $e: any;
	f.vars = () => [user, is_chamber_empty, is_beaker_ready, processing_chamber, beaker_contents, dat, O, anything, R, popup, $e];
	is_chamber_empty = 0;
	is_beaker_ready = 0;
	processing_chamber = "";
	beaker_contents = "";
	dat = "";
	if (!truthy(rt.sv(f, "operating"))) {
		O = null;
		rt.forList(f, 0, rt.sv(f, "holdingitems"), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			O = $e;
			processing_chamber = rt.modify(live(processing_chamber), fmt("＆！<BR>", [rt.fv(f, "name", live(O))]), add);
		}
		rt.endFor(f, 0);
		if (!truthy(live(processing_chamber))) {
			is_chamber_empty = 1;
			processing_chamber = "Nothing.";
		}
		if (!truthy(rt.sv(f, "beaker"))) {
			beaker_contents = "<B>No beaker attached.</B><br>";
		} else {
			is_beaker_ready = 1;
			beaker_contents = "<B>The beaker contains:</B><br>";
			anything = 0;
			R = null;
			rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", rt.sv(f, "beaker"))), T("/datum/reagent"));
			while (($e = rt.next(f, 0)) !== undefined) {
				R = $e;
				anything = 1;
				beaker_contents = rt.modify(live(beaker_contents), fmt("＀ - ＀<br>", [rt.fv(f, "volume", live(R)), rt.fv(f, "name", live(R))]), add);
			}
			rt.endFor(f, 0);
			if (!truthy(live(anything))) {
				beaker_contents = rt.modify(live(beaker_contents), "Nothing<br>", add);
			}
		}
		dat = fmt("\n\t\t<b>Processing chamber contains:</b><br>\n\t\t＀<br>\n\t\t＀<hr>\n\t\t", [live(processing_chamber), live(beaker_contents)]);
		if (truthy(live(is_beaker_ready))) {
			if ((!truthy(live(is_chamber_empty)) && !truthy(rt.bitAnd(rt.sv(f, "stat"), 3)))) {
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;action=grind'>Grind the reagents</a><BR>", [live(f.src)]), add);
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;action=juice'>Juice the reagents</a><BR><BR>", [live(f.src)]), add);
			} else {
				if (truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))))) {
					dat = rt.modify(live(dat), fmt("<A href='?src=＃;action=mix'>Mix the reagents</a><BR><BR>", [live(f.src)]), add);
				}
			}
		}
		if ((truthy(rt.sv(f, "holdingitems")) && rt.gt(rt.len(f, rt.sv(f, "holdingitems")), 0))) {
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;action=eject'>Eject the reagents</a><BR>", [live(f.src)]), add);
		}
		if (truthy(rt.sv(f, "beaker"))) {
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;action=detach'>Detach the beaker</a><BR>", [live(f.src)]), add);
		}
	} else {
		dat = rt.modify(live(dat), "Please wait...", add);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "reagentgrinder", "All-In-One Grinder"]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(user), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", [1]);
	return live(f.dot);
}, true);

// /obj/machinery/reagentgrinder/proc/Topic  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:233)  may sleep
rt.def("/obj/machinery/reagentgrinder/proc/Topic", function* Topic(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	if (truthy(rt.sv(f, "operating"))) {
		yield* g.srcCall(f, "updateUsrDialog");
		return live(f.dot);
	}
	$0 = rt.at(live(f.args[1]), "action");
	if ($0 === "grind") {
		yield* g.srcCall(f, "grind");
	} else if ($0 === "juice") {
		yield* g.srcCall(f, "juice");
	} else if ($0 === "mix") {
		yield* g.srcCall(f, "mix");
	} else if ($0 === "eject") {
		yield* g.srcCall(f, "eject");
	} else if ($0 === "detach") {
		yield* g.srcCall(f, "detach");
	}
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/reagentgrinder/proc/detach  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:253)  may sleep
rt.def("/obj/machinery/reagentgrinder/proc/detach", function* detach(f: Frame) {
	if (!isEqual(rt.fv(f, "stat", live(f.usr)), 0)) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "beaker"))) {
		return live(f.dot);
	}
	rt.setFv(f, "loc", rt.sv(f, "beaker"), rt.fv(f, "loc", live(f.src)));
	rt.setSv(f, "beaker", null);
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true);

// /obj/machinery/reagentgrinder/proc/eject  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:264)  may sleep
rt.def("/obj/machinery/reagentgrinder/proc/eject", function* eject(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	if (!isEqual(rt.fv(f, "stat", live(f.usr)), 0)) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "holdingitems")) && isEqual(rt.len(f, rt.sv(f, "holdingitems")), 0))) {
		return live(f.dot);
	}
	O = null;
	rt.forList(f, 0, rt.sv(f, "holdingitems"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		rt.setFv(f, "loc", live(O), rt.fv(f, "loc", live(f.src)));
		(rt.modSrcVar(f, "holdingitems", live(O), subtract));
	}
	rt.endFor(f, 0);
	rt.setSv(f, "holdingitems", rt.list());
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true);

// /obj/machinery/reagentgrinder/proc/is_allowed  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:276)
rt.def("/obj/machinery/reagentgrinder/proc/is_allowed", function is_allowed(f: Frame, O: Value) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forList(f, 0, rt.gl("blend_items"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (truthy(rt.op(f, "IsType", [], [live(O), live(i)]))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /obj/machinery/reagentgrinder/proc/get_allowed_by_id  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:282)
rt.def("/obj/machinery/reagentgrinder/proc/get_allowed_by_id", function get_allowed_by_id(f: Frame, O: Value) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forList(f, 0, rt.gl("blend_items"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (truthy(rt.op(f, "IsType", [], [live(O), live(i)]))) {
			return rt.index(rt.gl("blend_items"), live(i));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/reagentgrinder/proc/get_allowed_snack_by_id  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:287)
rt.def("/obj/machinery/reagentgrinder/proc/get_allowed_snack_by_id", function get_allowed_snack_by_id(f: Frame, O: Value) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forList(f, 0, rt.gl("blend_items"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (truthy(rt.op(f, "IsType", [], [live(O), live(i)]))) {
			return rt.index(rt.gl("blend_items"), live(i));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/reagentgrinder/proc/get_allowed_juice_by_id  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:292)
rt.def("/obj/machinery/reagentgrinder/proc/get_allowed_juice_by_id", function get_allowed_juice_by_id(f: Frame, O: Value) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forList(f, 0, rt.gl("juice_items"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (truthy(rt.op(f, "IsType", [], [live(O), live(i)]))) {
			return rt.index(rt.gl("juice_items"), live(i));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/reagentgrinder/proc/get_grownweapon_amount  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:297)
rt.def("/obj/machinery/reagentgrinder/proc/get_grownweapon_amount", function get_grownweapon_amount(f: Frame, O: Value) {
	if ((!truthy((rt.istype(live(O), T("/obj/item/weapon/grown")) ? 1 : 0)) || !truthy(rt.fv(f, "seed", live(O))))) {
		return 5;
	} else {
		if (isEqual(rt.gv(f, "potency", rt.fv(f, "seed", live(O))), -1)) {
			return 5;
		} else {
			return rt.call(f, P("/proc/round"), null, [rt.gv(f, "potency", rt.fv(f, "seed", live(O)))]);
		}
	}
	return f.dot;
});

// /obj/machinery/reagentgrinder/proc/get_juice_amount  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:305)
rt.def("/obj/machinery/reagentgrinder/proc/get_juice_amount", function get_juice_amount(f: Frame, O: Value) {
	if ((!truthy((rt.istype(live(O), T("/obj/item/weapon/reagent_containers/food/snacks/grown")) ? 1 : 0)) || !truthy(rt.fv(f, "seed", live(O))))) {
		return 5;
	} else {
		if (isEqual(rt.gv(f, "potency", rt.fv(f, "seed", live(O))), -1)) {
			return 5;
		} else {
			return rt.call(f, P("/proc/round"), null, [multiply(5, rt.op(f, "Sqrt", [], [rt.gv(f, "potency", rt.fv(f, "seed", live(O)))]))]);
		}
	}
	return f.dot;
});

// /obj/machinery/reagentgrinder/proc/remove_object  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:313)  may sleep
rt.def("/obj/machinery/reagentgrinder/proc/remove_object", function* remove_object(f: Frame, O: Value) {
	f.vars = () => [O];
	(rt.modSrcVar(f, "holdingitems", live(O), subtract));
	yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
	return f.dot;
}, true);

// /obj/machinery/reagentgrinder/proc/juice  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:317)  may sleep
rt.def("/obj/machinery/reagentgrinder/proc/juice", function* juice(f: Frame) {
	let offset: Value = null, O: Value = null, allowed: Value = null, r_id: Value = null, space: Value = null, amount: Value = null;
	let $0: any, $e: any;
	f.vars = () => [offset, O, allowed, r_id, space, amount, $0, $e];
	yield* g.srcCall(f, "power_change");
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "beaker")) || (truthy(rt.sv(f, "beaker")) && rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/juicer.ogg"), 20, 1]);
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		$0 = -2;
	} else {
		$0 = 2;
	}
	offset = $0;
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "pixel_x", add(rt.sv(f, "pixel_x"), live(offset)), "time", 0.20000000298023224, "loop", 250]);
	rt.setSv(f, "operating", 1);
	yield* g.srcCall(f, "updateUsrDialog");
	rt.spawnTail(f, 50, "/obj/machinery/reagentgrinder/proc/juice: spawn at modules/reagents/chemistry/machinery/reagentgrinder.dm:327", offset, O, allowed, r_id, space, amount);
	O = null;
	rt.forList(f, 0, rt.sv(f, "holdingitems"), T("/obj/item/weapon/reagent_containers/food/snacks"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))))) {
			break;
		}
		if ((allowed = (yield* g.srcCall(f, "get_allowed_juice_by_id", live(O)))) === null) {
			break;
		}
		r_id = null;
		rt.forList(f, 1, live(allowed));
		while (($e = rt.next(f, 1)) !== undefined) {
			r_id = $e;
			space = subtract(rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))));
			amount = (yield* g.srcCall(f, "get_juice_amount", live(O)));
			yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "add_reagent", [live(r_id), (yield* g.call(f, P("/proc/min"), null, [live(amount), live(space)]))]);
			if (rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))))) {
				break;
			}
		}
		rt.endFor(f, 1);
		yield* g.srcCall(f, "remove_object", live(O));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// a spawn(50) body of /obj/machinery/reagentgrinder/proc/juice, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/reagentgrinder/proc/juice: spawn at modules/reagents/chemistry/machinery/reagentgrinder.dm:327", function* (f: Frame, offset: Value, O: Value, allowed: Value, r_id: Value, space: Value, amount: Value) {
	f.vars = () => [offset, O, allowed, r_id, space, amount];
	rt.setSv(f, "pixel_x", rt.initial(f, live(f.src), "pixel_x"));
	rt.setSv(f, "operating", 0);
	yield* g.srcCall(f, "updateUsrDialog");
	return null;
});

// /obj/machinery/reagentgrinder/proc/grind  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:355)  may sleep
rt.def("/obj/machinery/reagentgrinder/proc/grind", function* grind(f: Frame) {
	let offset: Value = null, O: Value = null, allowed: Value = null, r_id: Value = null, space: Value = null, amount: Value = null, i: Value = null, r_id_4: Value = null, space_5: Value = null, amount_6: Value = null, space_2: Value = null, amount_3: Value = null, amount_2: Value = null, r_id_2: Value = null, space_3: Value = null;
	let $0: any, $e: any;
	f.vars = () => [offset, O, allowed, r_id, space, amount, i, r_id_4, space_5, amount_6, space_2, amount_3, amount_2, r_id_2, space_3, $0, $e];
	yield* g.srcCall(f, "power_change");
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "beaker")) || (truthy(rt.sv(f, "beaker")) && rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/blender.ogg"), 50, 1]);
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		$0 = -2;
	} else {
		$0 = 2;
	}
	offset = $0;
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "pixel_x", add(rt.sv(f, "pixel_x"), live(offset)), "time", 0.20000000298023224, "loop", 250]);
	rt.setSv(f, "operating", 1);
	yield* g.srcCall(f, "updateUsrDialog");
	rt.spawnTail(f, 60, "/obj/machinery/reagentgrinder/proc/grind: spawn at modules/reagents/chemistry/machinery/reagentgrinder.dm:365", offset, O, allowed, r_id, space, amount, i, r_id_4, space_5, amount_6, space_2, amount_3, amount_2, r_id_2, space_3);
	O = null;
	rt.forList(f, 0, rt.sv(f, "holdingitems"), T("/obj/item/weapon/reagent_containers/food/snacks"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))))) {
			break;
		}
		if ((allowed = (yield* g.srcCall(f, "get_allowed_snack_by_id", live(O)))) === null) {
			break;
		}
		r_id = null;
		rt.forList(f, 1, live(allowed));
		while (($e = rt.next(f, 1)) !== undefined) {
			r_id = $e;
			space = subtract(rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))));
			if (rt.le((amount = rt.index(live(allowed), live(r_id))), 0)) {
				if (isEqual(live(amount), 0)) {
					if ((rt.fv(f, "reagents", live(O)) !== null && truthy((yield* g.callName(f, rt.fv(f, "reagents", live(O)), "has_reagent", ["nutriment"]))))) {
						yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "add_reagent", [live(r_id), (yield* g.call(f, P("/proc/min"), null, [(yield* g.callName(f, rt.fv(f, "reagents", live(O)), "get_reagent_amount", ["nutriment"])), live(space)]))]);
						yield* g.callName(f, rt.fv(f, "reagents", live(O)), "remove_reagent", ["nutriment", (yield* g.call(f, P("/proc/min"), null, [(yield* g.callName(f, rt.fv(f, "reagents", live(O)), "get_reagent_amount", ["nutriment"])), live(space)]))]);
					}
				} else {
					if ((rt.fv(f, "reagents", live(O)) !== null && truthy((yield* g.callName(f, rt.fv(f, "reagents", live(O)), "has_reagent", ["nutriment"]))))) {
						yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "add_reagent", [live(r_id), (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/round"), null, [multiply((yield* g.callName(f, rt.fv(f, "reagents", live(O)), "get_reagent_amount", ["nutriment"])), rt.op(f, "Abs", [], [live(amount)]))])), live(space)]))]);
						yield* g.callName(f, rt.fv(f, "reagents", live(O)), "remove_reagent", ["nutriment", (yield* g.call(f, P("/proc/min"), null, [(yield* g.callName(f, rt.fv(f, "reagents", live(O)), "get_reagent_amount", ["nutriment"])), live(space)]))]);
					}
				}
			} else {
				yield* g.callName(f, rt.fv(f, "reagents", live(O)), "trans_id_to", [rt.sv(f, "beaker"), live(r_id), (yield* g.call(f, P("/proc/min"), null, [live(amount), live(space)]))]);
			}
			if (rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))))) {
				break;
			}
		}
		rt.endFor(f, 1);
		if (isEqual(rt.getLen(f, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(O)))), 0)) {
			yield* g.srcCall(f, "remove_object", live(O));
		}
	}
	rt.endFor(f, 0);
	O = null;
	rt.forList(f, 0, rt.sv(f, "holdingitems"), T("/obj/item/stack/sheet"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		allowed = (yield* g.srcCall(f, "get_allowed_by_id", live(O)));
		if (rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))))) {
			break;
		}
		i = null;
		i = 1;
		while (rt.le(live(i), (yield* g.call(f, P("/proc/round"), null, [rt.fv(f, "amount", live(O)), 1])))) {
			r_id_4 = null;
			rt.forList(f, 1, live(allowed));
			while (($e = rt.next(f, 1)) !== undefined) {
				r_id_4 = $e;
				space_5 = subtract(rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))));
				amount_6 = rt.index(live(allowed), live(r_id_4));
				yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "add_reagent", [live(r_id_4), (yield* g.call(f, P("/proc/min"), null, [live(amount_6), live(space_5)]))]);
				if (rt.lt(live(space_5), live(amount_6))) {
					break;
				}
			}
			rt.endFor(f, 1);
			if (isEqual(live(i), (yield* g.call(f, P("/proc/round"), null, [rt.fv(f, "amount", live(O)), 1])))) {
				yield* g.srcCall(f, "remove_object", live(O));
				break;
			}
			i = rt.inc(live(i), 1);
		}
	}
	rt.endFor(f, 0);
	O = null;
	rt.forList(f, 0, rt.sv(f, "holdingitems"), T("/obj/item/weapon/grown"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))))) {
			break;
		}
		allowed = (yield* g.srcCall(f, "get_allowed_by_id", live(O)));
		r_id = null;
		rt.forList(f, 1, live(allowed));
		while (($e = rt.next(f, 1)) !== undefined) {
			r_id = $e;
			space = subtract(rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))));
			if (isEqual((amount = rt.index(live(allowed), live(r_id))), 0)) {
				if ((rt.fv(f, "reagents", live(O)) !== null && truthy((yield* g.callName(f, rt.fv(f, "reagents", live(O)), "has_reagent", [live(r_id)]))))) {
					yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "add_reagent", [live(r_id), (yield* g.call(f, P("/proc/min"), null, [(yield* g.callName(f, rt.fv(f, "reagents", live(O)), "get_reagent_amount", [live(r_id)])), live(space)]))]);
				}
			} else {
				yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "add_reagent", [live(r_id), (yield* g.call(f, P("/proc/min"), null, [live(amount), live(space)]))]);
			}
			if (rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))))) {
				break;
			}
		}
		rt.endFor(f, 1);
		yield* g.srcCall(f, "remove_object", live(O));
	}
	rt.endFor(f, 0);
	O = null;
	rt.forList(f, 0, rt.sv(f, "holdingitems"), T("/obj/item/slime_extract"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))))) {
			break;
		}
		space_2 = subtract(rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))));
		if (rt.fv(f, "reagents", live(O)) !== null) {
			amount_3 = rt.gv(f, "total_volume", rt.fv(f, "reagents", live(O)));
			yield* g.callName(f, rt.fv(f, "reagents", live(O)), "trans_to", [rt.sv(f, "beaker"), (yield* g.call(f, P("/proc/min"), null, [live(amount_3), live(space_2)]))]);
		}
		if (rt.gt(rt.fv(f, "Uses", live(O)), 0)) {
			yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "add_reagent", ["slimejelly", (yield* g.call(f, P("/proc/min"), null, [20, live(space_2)]))]);
		}
		yield* g.srcCall(f, "remove_object", live(O));
	}
	rt.endFor(f, 0);
	O = null;
	rt.forList(f, 0, rt.sv(f, "holdingitems"), T("/obj/item/weapon/reagent_containers"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))))) {
			break;
		}
		amount_2 = rt.gv(f, "total_volume", rt.fv(f, "reagents", live(O)));
		yield* g.callName(f, rt.fv(f, "reagents", live(O)), "trans_to", [rt.sv(f, "beaker"), live(amount_2)]);
		if (!truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(O))))) {
			yield* g.srcCall(f, "remove_object", live(O));
		}
	}
	rt.endFor(f, 0);
	O = null;
	rt.forList(f, 0, rt.sv(f, "holdingitems"), T("/obj/item/toy/crayon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))))) {
			break;
		}
		r_id_2 = null;
		rt.forList(f, 1, rt.fv(f, "reagent_contents", live(O)));
		while (($e = rt.next(f, 1)) !== undefined) {
			r_id_2 = $e;
			if (isEqual((space_3 = subtract(rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))))), 0)) {
				break;
			}
			yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "add_reagent", [live(r_id_2), (yield* g.call(f, P("/proc/min"), null, [rt.index(rt.fv(f, "reagent_contents", live(O)), live(r_id_2)), live(space_3)]))]);
			yield* g.srcCall(f, "remove_object", live(O));
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// a spawn(60) body of /obj/machinery/reagentgrinder/proc/grind, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/reagentgrinder/proc/grind: spawn at modules/reagents/chemistry/machinery/reagentgrinder.dm:365", function* (f: Frame, offset: Value, O: Value, allowed: Value, r_id: Value, space: Value, amount: Value, i: Value, r_id_4: Value, space_5: Value, amount_6: Value, space_2: Value, amount_3: Value, amount_2: Value, r_id_2: Value, space_3: Value) {
	f.vars = () => [offset, O, allowed, r_id, space, amount, i, r_id_4, space_5, amount_6, space_2, amount_3, amount_2, r_id_2, space_3];
	rt.setSv(f, "pixel_x", rt.initial(f, live(f.src), "pixel_x"));
	rt.setSv(f, "operating", 0);
	yield* g.srcCall(f, "updateUsrDialog");
	return null;
});

// /obj/machinery/reagentgrinder/proc/mix  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:469)  may sleep
rt.def("/obj/machinery/reagentgrinder/proc/mix", function* mix(f: Frame) {
	let offset: Value = null;
	let $0: any;
	f.vars = () => [offset, $0];
	yield* g.srcCall(f, "power_change");
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "beaker"))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/juicer.ogg"), 20, 1]);
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		$0 = -2;
	} else {
		$0 = 2;
	}
	offset = $0;
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "pixel_x", add(rt.sv(f, "pixel_x"), live(offset)), "time", 0.20000000298023224, "loop", 250]);
	rt.setSv(f, "operating", 1);
	yield* g.srcCall(f, "updateUsrDialog");
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/reagentgrinder/proc/mix_complete")])), 50]);
	return f.dot;
}, true);

// /obj/machinery/reagentgrinder/proc/mix_complete  (code/modules/reagents/chemistry/machinery/reagentgrinder.dm:482)  may sleep
rt.def("/obj/machinery/reagentgrinder/proc/mix_complete", function* mix_complete(f: Frame) {
	let amount: Value = null;
	f.vars = () => [amount];
	rt.setSv(f, "pixel_x", rt.initial(f, live(f.src), "pixel_x"));
	rt.setSv(f, "operating", 0);
	yield* g.srcCall(f, "updateUsrDialog");
	if (!truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))))) return f.dot;
	while (rt.ge((yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "get_reagent_amount", ["milk"])), 15)) {
		yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "remove_reagent", ["milk", 15]);
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/butter"), [rt.fv(f, "loc", live(f.src))]);
	}
	if (!truthy((yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "has_reagent", ["eggyolk"])))) return f.dot;
	amount = (yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "get_reagent_amount", ["eggyolk"]));
	yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "remove_reagent", ["eggyolk", live(amount)]);
	yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "add_reagent", ["mayonnaise", live(amount)]);
	return f.dot;
}, true);
