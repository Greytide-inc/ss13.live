// From code/game/objects/items/weapons/grenades/grenade.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6879, "/obj/item/weapon/grenade", "/obj/item/weapon", {
	active: 0,
	det_time: 50,
	display_timer: 1,
	throw_speed: 3,
	throw_range: 7,
	flags: 64,
	name: "grenade",
	desc: "It has an adjustable timer.",
	w_class: 2,
	icon: rt.rsc("icons/obj/grenade.dmi"),
	icon_state: "grenade",
	item_state: "flashbang",
	slot_flags: 512,
	resistance_flags: 4,
	obj_integrity: 40,
	max_integrity: 40,
});

// /obj/item/weapon/grenade/proc/prime  empty
rt.def("/obj/item/weapon/grenade/proc/prime");

// /obj/item/weapon/grenade/proc/deconstruct  (code/game/objects/items/weapons/grenades/grenade.dm:20)  may sleep
rt.def("/obj/item/weapon/grenade/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(live(disassembled))) {
		yield* g.srcCall(f, "prime");
	}
	if (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/proc/clown_check  (code/game/objects/items/weapons/grenades/grenade.dm:26)
rt.def("/obj/item/weapon/grenade/proc/clown_check", function clown_check(f: Frame, user: Value) {
	if ((truthy(rt.bitAnd(rt.fv(f, "disabilities", live(user)), 256)) && truthy(rt.op(f, "Prob", [], [50])))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Huh? How does this thing work?</span>"]);
		rt.setSv(f, "active", 1);
		rt.setSv(f, "icon_state", add(rt.initial(f, live(f.src), "icon_state"), "_active"));
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/armbomb.ogg"), 75, 1, -3]);
		rt.spawnTail(f, 5, "/obj/item/weapon/grenade/proc/clown_check: spawn at game/objects/items/weapons/grenades/grenade.dm:31", user);
		return 0;
	}
	return 1;
});

// a spawn(5) body of /obj/item/weapon/grenade/proc/clown_check, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/grenade/proc/clown_check: spawn at game/objects/items/weapons/grenades/grenade.dm:31", function* (f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(live(user))) {
		yield* g.callName(f, live(user), "drop_item", []);
	}
	yield* g.srcCall(f, "prime");
	return null;
});

// /obj/item/weapon/grenade/proc/examine  (code/game/objects/items/weapons/grenades/grenade.dm:40)
rt.def("/obj/item/weapon/grenade/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "display_timer"))) return f.dot;
	if (rt.gt(rt.sv(f, "det_time"), 1)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("The timer is set to ＀ second５.", [divide(rt.sv(f, "det_time"), 10)])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("＄！ is set for instant detonation.", [live(f.src)])]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/grenade/proc/attack_self  (code/game/objects/items/weapons/grenades/grenade.dm:49)  may sleep
rt.def("/obj/item/weapon/grenade/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let C: Value = null;
	f.vars = () => [user, C];
	if (truthy(rt.sv(f, "active"))) return f.dot;
	if (!truthy((yield* g.srcCall(f, "clown_check", live(user))))) return f.dot;
	yield* g.srcCall(f, "preprime", live(user));
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (C = live(user)), "throw_mode_on", []);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/proc/preprime  (code/game/objects/items/weapons/grenades/grenade.dm:58)  may sleep
rt.def("/obj/item/weapon/grenade/proc/preprime", function* preprime(f: Frame, user: Value) {
	let bombturf: Value = null, A: Value = null, message: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [user, bombturf, A, message, $0, $1, $2];
	if (truthy(live(user))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You prime the ＀! ＀ seconds!</span>", [rt.sv(f, "name"), divide(rt.sv(f, "det_time"), 10)])]);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/armbomb.ogg"), 60, 1]);
	rt.setSv(f, "active", 1);
	rt.setSv(f, "icon_state", add(rt.initial(f, live(f.src), "icon_state"), "_active"));
	yield* g.srcCall(f, "add_fingerprint", live(user));
	bombturf = rt.getStep(f, live(f.src), 0);
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(bombturf)]));
	if (truthy(live(user))) {
		$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(user)])]);
		$1 = rt.sv(f, "name");
		if (truthy(live(bombturf))) {
			$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))])]);
		} else {
			$2 = "nonexistent location";
		}
		rt.modGl("bombers", (message = fmt("＀) has primed a ＀ for detonation at ＀", [$0, $1, fmt("＀", [$2])])), add);
		yield* g.call(f, P("/proc/message_admins"), null, [live(message)]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has primed a ＀ for detonation at ＀ ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "name"), rt.fv(f, "name", live(A)), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))])])]);
	}
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/grenade/proc/prime")])), rt.sv(f, "det_time")]);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/proc/update_mob  (code/game/objects/items/weapons/grenades/grenade.dm:76)  may sleep
rt.def("/obj/item/weapon/grenade/proc/update_mob", function* update_mob(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) return f.dot;
	yield* g.callName(f, (M = rt.sv(f, "loc")), "dropItemToGround", [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/proc/attackby  (code/game/objects/items/weapons/grenades/grenade.dm:82)  may sleep
rt.def("/obj/item/weapon/grenade/proc/attackby", function* attackby(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		$0 = rt.sv(f, "det_time");
		if ($0 === "1") {
			rt.setSv(f, "det_time", 10);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You set the ＀ for 1 second detonation time.</span>", [rt.sv(f, "name")])]);
		} else if ($0 === "10") {
			rt.setSv(f, "det_time", 30);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You set the ＀ for 3 second detonation time.</span>", [rt.sv(f, "name")])]);
		} else if ($0 === "30") {
			rt.setSv(f, "det_time", 50);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You set the ＀ for 5 second detonation time.</span>", [rt.sv(f, "name")])]);
		} else if ($0 === "50") {
			rt.setSv(f, "det_time", 1);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You set the ＀ for instant detonation.</span>", [rt.sv(f, "name")])]);
		}
		yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/grenade/proc/attack_hand  (code/game/objects/items/weapons/grenades/grenade.dm:101)  may sleep
rt.def("/obj/item/weapon/grenade/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.call(f, P("/proc/walk"), null, [live(f.src), null, null]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/proc/attack_paw  (code/game/objects/items/weapons/grenades/grenade.dm:105)  may sleep
rt.def("/obj/item/weapon/grenade/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/item/weapon/grenade/proc/hit_reaction  (code/game/objects/items/weapons/grenades/grenade.dm:108)  may sleep
rt.def("/obj/item/weapon/grenade/proc/hit_reaction", function* hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	let _P: Value = null;
	f.vars = () => [owner, hitby, attack_text, final_block_chance, damage, attack_type, _P];
	if (live(attack_text) === null) {
		attack_text = "the attack";
	}
	if (live(final_block_chance) === null) {
		final_block_chance = 0;
	}
	if (live(damage) === null) {
		damage = 0;
	}
	if (live(attack_type) === null) {
		attack_type = 1;
	}
	_P = live(hitby);
	if (!(((truthy(live(damage)) && isEqual(live(attack_type), 3)) && !isEqual(rt.fv(f, "damage_type", live(_P)), "stamina")) && truthy(rt.op(f, "Prob", [], [15])))) return f.dot;
	yield* g.callName(f, live(owner), "visible_message", [fmt("<span class='danger'>＀ hits ＀'s ＀, setting it off! What a shot!</span>", [live(attack_text), live(owner), live(f.src)])]);
	yield* g.srcCall(f, "prime");
	return 1;
}, true);
