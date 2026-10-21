// From code/game/objects/structures/janicart.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12788, "/obj/structure/janitorialcart", "/obj/structure", {
	amount_per_transfer_from_this: 5,
	mybag: null,
	mymop: null,
	myspray: null,
	myreplacer: null,
	signs: 0,
	max_signs: 4,
	anchored: 0,
	container_type: 4096,
	name: "janitorial cart",
	desc: "This is the alpha and omega of sanitation.",
	icon: rt.rsc("icons/obj/janitor.dmi"),
	icon_state: "cart",
	density: 1,
}, { const: ["max_signs"] });

// /obj/structure/janitorialcart/proc/New  (code/game/objects/structures/janicart.dm:20)  may sleep
rt.def("/obj/structure/janitorialcart/proc/New", function* New(f: Frame) {
	yield* g.srcCall(f, "create_reagents", 100);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/structure/janitorialcart/proc/wet_mop  (code/game/objects/structures/janicart.dm:25)  may sleep
rt.def("/obj/structure/janitorialcart/proc/wet_mop", function* wet_mop(f: Frame, mop: Value, user: Value) {
	f.vars = () => [mop, user];
	if (rt.lt(rt.fv(f, "total_volume", rt.sv(f, "reagents")), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is out of water!</span>", [live(f.src)])]);
		return 0;
	} else {
		yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(mop), 5]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You wet ＀ in ＀.</span>", [live(mop), live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/slosh.ogg"), 25, 1]);
		return 1;
	}
	return f.dot;
}, true);

// /obj/structure/janitorialcart/proc/put_in_cart  (code/game/objects/structures/janicart.dm:35)  may sleep
rt.def("/obj/structure/janitorialcart/proc/put_in_cart", function* put_in_cart(f: Frame, I: Value, user: Value) {
	f.vars = () => [I, user];
	if (!truthy((yield* g.callName(f, live(user), "drop_item", [])))) {
		return live(f.dot);
	}
	rt.setFv(f, "loc", live(I), live(f.src));
	yield* g.srcCall(f, "updateUsrDialog");
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You put ＀ into ＀.</span>", [live(I), live(f.src)])]);
	return live(f.dot);
}, true);

// /obj/structure/janitorialcart/proc/attackby  (code/game/objects/structures/janicart.dm:44)  may sleep
rt.def("/obj/structure/janitorialcart/proc/attackby", function* attackby(f: Frame) {
	let fail_msg: Value = null, m: Value = null, t: Value = null, l: Value = null;
	f.vars = () => [fail_msg, m, t, l];
	fail_msg = fmt("<span class='warning'>There is already one of those in ＀!</span>", [live(f.src)]);
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/mop")) ? 1 : 0))) {
		if (rt.lt(rt.gv(f, "total_volume", rt.gv(f, "reagents", (m = live(f.args[0])))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", live(m))))) {
			if (truthy((yield* g.srcCall(f, "wet_mop", live(m), live(f.args[1]))))) {
				return live(f.dot);
			}
		}
		if (!truthy(rt.sv(f, "mymop"))) {
			yield* g.callName(f, live(m), "janicart_insert", [live(f.args[1]), live(f.src)]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), live(fail_msg)]);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/storage/bag/trash")) ? 1 : 0))) {
			if (!truthy(rt.sv(f, "mybag"))) {
				yield* g.callName(f, (t = live(f.args[0])), "janicart_insert", [live(f.args[1]), live(f.src)]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), live(fail_msg)]);
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/spray/cleaner")) ? 1 : 0))) {
				if (!truthy(rt.sv(f, "myspray"))) {
					yield* g.srcCall(f, "put_in_cart", live(f.args[0]), live(f.args[1]));
					rt.setSv(f, "myspray", live(f.args[0]));
					yield* g.srcCall(f, "update_icon");
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), live(fail_msg)]);
				}
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/lightreplacer")) ? 1 : 0))) {
					if (!truthy(rt.sv(f, "myreplacer"))) {
						yield* g.callName(f, (l = live(f.args[0])), "janicart_insert", [live(f.args[1]), live(f.src)]);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), live(fail_msg)]);
					}
				} else {
					if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/caution")) ? 1 : 0))) {
						if (rt.lt(rt.sv(f, "signs"), 4)) {
							yield* g.srcCall(f, "put_in_cart", live(f.args[0]), live(f.args[1]));
							rt.incSrcVar(f, "signs", 1, true);
							yield* g.srcCall(f, "update_icon");
						} else {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ can't hold any more signs!</span>", [live(f.src)])]);
						}
					} else {
						if (truthy(rt.sv(f, "mybag"))) {
							yield* g.callName(f, rt.sv(f, "mybag"), "attackby", [live(f.args[0]), live(f.args[1])]);
						} else {
							if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
								yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ begins to empty the contents of ＀.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You begin to empty the contents of ＀...</span>", [live(f.src)])]);
								if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(30, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You empty the contents of ＀'s bucket onto the floor.</span>", [live(f.src)])]);
									yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [rt.fv(f, "loc", live(f.src))]);
									yield* g.callName(f, rt.fv(f, "reagents", live(f.src)), "clear_reagents", []);
								}
							} else {
								return (yield* g.callSuper(f, [], rt.Args.Same));
							}
						}
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/janitorialcart/proc/attack_hand  (code/game/objects/structures/janicart.dm:94)  may sleep
rt.def("/obj/structure/janitorialcart/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let dat: Value = null, popup: Value = null;
	f.vars = () => [user, dat, popup];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = null;
	if (truthy(rt.sv(f, "mybag"))) {
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;garbage=1'>＀</a><br>", [live(f.src), rt.fv(f, "name", rt.sv(f, "mybag"))]), add);
	}
	if (truthy(rt.sv(f, "mymop"))) {
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;mop=1'>＀</a><br>", [live(f.src), rt.fv(f, "name", rt.sv(f, "mymop"))]), add);
	}
	if (truthy(rt.sv(f, "myspray"))) {
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;spray=1'>＀</a><br>", [live(f.src), rt.fv(f, "name", rt.sv(f, "myspray"))]), add);
	}
	if (truthy(rt.sv(f, "myreplacer"))) {
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;replacer=1'>＀</a><br>", [live(f.src), rt.fv(f, "name", rt.sv(f, "myreplacer"))]), add);
	}
	if (truthy(rt.sv(f, "signs"))) {
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;sign=1'>＀ sign５</a><br>", [live(f.src), rt.sv(f, "signs")]), add);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "janicart", rt.sv(f, "name"), 240, 160]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/structure/janitorialcart/proc/Topic  (code/game/objects/structures/janicart.dm:112)  may sleep
rt.def("/obj/structure/janitorialcart/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let user: Value = null, Sign: Value = null;
	f.vars = () => [href, href_list, user, Sign];
	if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1)) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.usr), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	user = live(f.usr);
	if (truthy(rt.at(live(href_list), "garbage"))) {
		if (truthy(rt.sv(f, "mybag"))) {
			yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "mybag")]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You take ＀ from ＀.</span>", [rt.sv(f, "mybag"), live(f.src)])]);
			rt.setSv(f, "mybag", null);
		}
	}
	if (truthy(rt.at(live(href_list), "mop"))) {
		if (truthy(rt.sv(f, "mymop"))) {
			yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "mymop")]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You take ＀ from ＀.</span>", [rt.sv(f, "mymop"), live(f.src)])]);
			rt.setSv(f, "mymop", null);
		}
	}
	if (truthy(rt.at(live(href_list), "spray"))) {
		if (truthy(rt.sv(f, "myspray"))) {
			yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "myspray")]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You take ＀ from ＀.</span>", [rt.sv(f, "myspray"), live(f.src)])]);
			rt.setSv(f, "myspray", null);
		}
	}
	if (truthy(rt.at(live(href_list), "replacer"))) {
		if (truthy(rt.sv(f, "myreplacer"))) {
			yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "myreplacer")]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You take ＀ from ＀.</span>", [rt.sv(f, "myreplacer"), live(f.src)])]);
			rt.setSv(f, "myreplacer", null);
		}
	}
	if (truthy(rt.at(live(href_list), "sign"))) {
		if (truthy(rt.sv(f, "signs"))) {
			if (truthy((Sign = rt.locateIn(f, T("/obj/item/weapon/caution"), live(f.src))))) {
				yield* g.callName(f, live(user), "put_in_hands", [live(Sign)]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You take ＇！ from ＀.</span>", [live(Sign), live(f.src)])]);
				rt.incSrcVar(f, "signs", -1, true);
			} else {
				yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", [fmt("Signs (＀) didn't match contents", [rt.sv(f, "signs")]), "code/game/objects/structures/janicart.dm", 145, live(f.src), live(f.usr)])]);
				rt.setSv(f, "signs", 0);
			}
		}
	}
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true);

// /obj/structure/janitorialcart/proc/update_icon  (code/game/objects/structures/janicart.dm:153)
rt.def("/obj/structure/janitorialcart/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "mybag"))) {
		rt.callSrc(f, "add_overlay", ["cart_garbage"]);
	}
	if (truthy(rt.sv(f, "mymop"))) {
		rt.callSrc(f, "add_overlay", ["cart_mop"]);
	}
	if (truthy(rt.sv(f, "myspray"))) {
		rt.callSrc(f, "add_overlay", ["cart_spray"]);
	}
	if (truthy(rt.sv(f, "myreplacer"))) {
		rt.callSrc(f, "add_overlay", ["cart_replacer"]);
	}
	if (!truthy(rt.sv(f, "signs"))) return f.dot;
	rt.callSrc(f, "add_overlay", [fmt("cart_sign＀", [rt.sv(f, "signs")])]);
	return f.dot;
});
