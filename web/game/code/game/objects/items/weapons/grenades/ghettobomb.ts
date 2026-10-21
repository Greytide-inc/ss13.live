// From code/game/objects/items/weapons/grenades/ghettobomb.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6920, "/obj/item/weapon/grenade/iedcasing", "/obj/item/weapon/grenade", {
	range: 3,
	times: null,
	throw_speed: 3,
	throw_range: 7,
	flags: 64,
	name: "improvised firebomb",
	desc: "A weak, improvised incendiary device.",
	w_class: 2,
	icon: rt.rsc("icons/obj/grenade.dmi"),
	icon_state: "improvised_grenade",
	item_state: "flashbang",
	slot_flags: 512,
	active: 0,
	det_time: 50,
	display_timer: 0,
});

// /obj/item/weapon/grenade/iedcasing/proc/Initialize  (code/game/objects/items/weapons/grenades/ghettobomb.dm:21)  may sleep
rt.def("/obj/item/weapon/grenade/iedcasing/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "add_overlay", "improvised_grenade_filled");
	yield* g.srcCall(f, "add_overlay", "improvised_grenade_wired");
	rt.setSv(f, "times", rt.alist(f, ["5", 10, "-1", 20, fmt("＀", [(yield* g.call(f, P("/proc/rand"), null, [30, 80]))]), 50, fmt("＀", [(yield* g.call(f, P("/proc/rand"), null, [65, 180]))]), 20]));
	rt.setSv(f, "det_time", (yield* g.call(f, P("/proc/text2num"), null, [(yield* g.call(f, P("/proc/pickweight"), null, [rt.sv(f, "times")]))])));
	if (rt.lt(rt.sv(f, "det_time"), 0)) {
		rt.setSv(f, "range", 1);
		rt.setSv(f, "det_time", (yield* g.call(f, P("/proc/rand"), null, [30, 80])));
	} else {
		rt.setSv(f, "range", rt.op(f, "PickUnweighted", [7], [2, 2, 2, 3, 3, 3, 4]));
	}
	return f.dot;
}, true);

// /obj/item/weapon/grenade/iedcasing/proc/CheckParts  (code/game/objects/items/weapons/grenades/ghettobomb.dm:33)  may sleep
rt.def("/obj/item/weapon/grenade/iedcasing/proc/CheckParts", function* CheckParts(f: Frame) {
	let can: Value = null, can_underlay: Value = null;
	f.vars = () => [can, can_underlay];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((can = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/food/drinks/soda_cans"), rt.sv(f, "contents"))))) return f.dot;
	rt.setFv(f, "pixel_x", live(can), 0);
	rt.setFv(f, "pixel_y", live(can), 0);
	rt.setFv(f, "layer", (can_underlay = (yield* g.new_(f, T("/mutable_appearance"), [live(can)]))), -1);
	rt.setFv(f, "plane", live(can_underlay), -32767);
	rt.modSrcVar(f, "underlays", live(can_underlay), add);
	return f.dot;
}, true, { args: ["parts_list"] });

// /obj/item/weapon/grenade/iedcasing/proc/attack_self  (code/game/objects/items/weapons/grenades/ghettobomb.dm:45)  may sleep
rt.def("/obj/item/weapon/grenade/iedcasing/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let bombturf: Value = null, A: Value = null, C: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [user, bombturf, A, C, $0, $1, $2];
	if (truthy(rt.sv(f, "active"))) return f.dot;
	if (!truthy((yield* g.srcCall(f, "clown_check", live(user))))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You light the ＀!</span>", [rt.sv(f, "name")])]);
	rt.setSv(f, "active", 1);
	yield* g.srcCall(f, "cut_overlay", "improvised_grenade_filled");
	rt.setSv(f, "icon_state", add(rt.initial(f, live(f.src), "icon_state"), "_active"));
	yield* g.srcCall(f, "add_fingerprint", live(user));
	bombturf = rt.getStep(f, live(f.src), 0);
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(bombturf)]));
	$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(user)])]);
	$1 = rt.sv(f, "name");
	if (truthy(live(bombturf))) {
		$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))])]);
	} else {
		$2 = "nonexistent location";
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has primed a ＀ for detonation at ＀.", [$0, $1, fmt("＀", [$2])])]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has primed a ＀ for detonation at ＀ ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "name"), rt.fv(f, "name", live(A)), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))])])]);
	if (truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.callName(f, (C = live(user)), "throw_mode_on", []);
	}
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/grenade/iedcasing/proc/prime")])), rt.sv(f, "det_time")]);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/iedcasing/proc/prime  (code/game/objects/items/weapons/grenades/ghettobomb.dm:63)  may sleep
rt.def("/obj/item/weapon/grenade/iedcasing/proc/prime", function* prime(f: Frame) {
	yield* g.srcCall(f, "update_mob");
	yield* g.call(f, P("/proc/explosion"), null, [null, rt.fv(f, "loc", live(f.src)), null, -1, null, -1, null, 2, "flame_range", 4], rt.Args.Named);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/iedcasing/proc/examine  (code/game/objects/items/weapons/grenades/ghettobomb.dm:68)
rt.def("/obj/item/weapon/grenade/iedcasing/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "You can't tell when it will explode!"]);
	return f.dot;
}, false, { args: ["user"] });
