// From code/modules/spells/spell_types/aimed.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11377, "/obj/effect/proc_holder/spell/aimed", "/obj/effect/proc_holder/spell", {
	projectile_type: rt.typePath("/obj/item/projectile/magic/teleport"),
	deactive_msg: "You discharge your projectile...",
	active_msg: "You charge your projectile!",
	base_icon_state: "projectile",
	active_icon_state: "projectile",
	projectile_var_overrides: null,
	projectile_amount: 1,
	current_amount: 0,
	name: "aimed projectile spell",
});

// /obj/effect/proc_holder/spell/aimed/proc/<init>  (code/modules/spells/spell_types/aimed.dm:9)
rt.def("/obj/effect/proc_holder/spell/aimed/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "projectile_var_overrides", rt.list());
	return f.dot;
});

// /obj/effect/proc_holder/spell/aimed/proc/Click  (code/modules/spells/spell_types/aimed.dm:14)  may sleep
rt.def("/obj/effect/proc_holder/spell/aimed/proc/Click", function* Click(f: Frame) {
	let user: Value = null, msg: Value = null, refund_percent: Value = null;
	f.vars = () => [user, msg, refund_percent];
	if (!truthy((rt.istype((user = live(f.usr)), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	msg = null;
	if (!truthy((yield* g.srcCall(f, "can_cast", live(user))))) {
		yield* g.srcCall(f, "remove_ranged_ability", (msg = fmt("<span class='warning'>You can no longer cast ＀!</span>", [rt.sv(f, "name")])));
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "active"))) {
		msg = fmt("<span class='notice'>＀</span>", [rt.sv(f, "deactive_msg")]);
		if (isEqual(rt.sv(f, "charge_type"), "recharge")) {
			refund_percent = divide(rt.sv(f, "current_amount"), rt.sv(f, "projectile_amount"));
			rt.setSv(f, "charge_counter", multiply(rt.sv(f, "charge_max"), live(refund_percent)));
			yield* g.srcCall(f, "start_recharge");
		}
		yield* g.srcCall(f, "remove_ranged_ability", live(msg));
	} else {
		msg = fmt("<span class='notice'>＀<B>Left-click to shoot it at a target!</B></span>", [rt.sv(f, "active_msg")]);
		rt.setSv(f, "current_amount", rt.sv(f, "projectile_amount"));
		yield* g.srcCall(f, "add_ranged_ability", live(user), live(msg), 1);
	}
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/aimed/proc/update_icon  (code/modules/spells/spell_types/aimed.dm:35)  may sleep
rt.def("/obj/effect/proc_holder/spell/aimed/proc/update_icon", function* update_icon(f: Frame) {
	if (!truthy(rt.sv(f, "action"))) {
		return live(f.dot);
	}
	rt.setFv(f, "button_icon_state", rt.sv(f, "action"), fmt("＀＀", [rt.sv(f, "base_icon_state"), rt.sv(f, "active")]));
	yield* g.callName(f, rt.sv(f, "action"), "UpdateButtonIcon", []);
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/aimed/proc/InterceptClickOn  (code/modules/spells/spell_types/aimed.dm:41)  may sleep
rt.def("/obj/effect/proc_holder/spell/aimed/proc/InterceptClickOn", function* InterceptClickOn(f: Frame) {
	let ran_out: Value = null, targets: Value = null;
	f.vars = () => [ran_out, targets];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	if (!truthy((yield* g.srcCall(f, "cast_check", (!truthy((ran_out = (rt.le(rt.sv(f, "current_amount"), 0) ? 1 : 0))) ? 1 : 0), rt.sv(f, "ranged_ability_user"))))) {
		yield* g.srcCall(f, "remove_ranged_ability");
		return 0;
	}
	targets = rt.list(live(f.args[2]));
	yield* g.callSrc(f, "perform", [null, live(targets), null, live(ran_out), "user", rt.sv(f, "ranged_ability_user")], rt.Args.Named);
	return 1;
}, true, { args: ["caller", "params", "target"] });

// /obj/effect/proc_holder/spell/aimed/proc/cast  (code/modules/spells/spell_types/aimed.dm:52)  may sleep
rt.def("/obj/effect/proc_holder/spell/aimed/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null, _T: Value = null, U: Value = null;
	f.vars = () => [targets, user, target, _T, U];
	target = rt.index(live(targets), 1);
	_T = rt.fv(f, "loc", live(user));
	if ((!truthy((yield* g.call(f, P("/proc/isturf"), null, [(U = rt.getStep(f, live(user), rt.fv(f, "dir", live(user))))]))) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [live(_T)]))))) {
		return 0;
	}
	yield* g.srcCall(f, "fire_projectile", live(user), live(target));
	yield* g.callName(f, live(user), "newtonian_move", [rt.getDir(f, live(U), live(_T))]);
	if (rt.le(rt.sv(f, "current_amount"), 0)) {
		yield* g.srcCall(f, "remove_ranged_ability");
		rt.setSv(f, "charge_counter", 0);
		yield* g.srcCall(f, "start_recharge");
	}
	return 1;
}, true);

// /obj/effect/proc_holder/spell/aimed/proc/fire_projectile  (code/modules/spells/spell_types/aimed.dm:66)  may sleep
rt.def("/obj/effect/proc_holder/spell/aimed/proc/fire_projectile", function* fire_projectile(f: Frame, user: Value, target: Value) {
	let _P: Value = null, V: Value = null;
	let $e: any;
	f.vars = () => [user, target, _P, V, $e];
	rt.incSrcVar(f, "current_amount", -1, true);
	rt.setFv(f, "current", (_P = (yield* g.new_(f, rt.sv(f, "projectile_type"), [rt.fv(f, "loc", live(user))]))), rt.getStep(f, live(user), 0));
	rt.setFv(f, "firer", live(_P), live(user));
	yield* g.callName(f, live(_P), "preparePixelProjectile", [live(target), rt.getStep(f, live(target), 0), live(user)]);
	V = null;
	rt.forList(f, 0, rt.sv(f, "projectile_var_overrides"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (truthy(rt.index(rt.fv(f, "vars", live(_P)), live(V)))) {
			rt.setAt(rt.fv(f, "vars", live(_P)), live(V), rt.index(rt.sv(f, "projectile_var_overrides"), live(V)));
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(_P), "fire", []);
	return 1;
}, true);

rt.type(11378, "/obj/effect/proc_holder/spell/aimed/lightningbolt", "/obj/effect/proc_holder/spell/aimed", {
	school: "evocation",
	charge_max: 200,
	clothes_req: 1,
	invocation: "UN'LTD P'WAH",
	invocation_type: "shout",
	cooldown_min: 30,
	active_icon_state: "lightning",
	base_icon_state: "lightning",
	sound: rt.rsc("sound/magic/lightningbolt.ogg"),
	projectile_var_overrides: null,
	active_msg: "You energize your hand with arcane lightning!",
	deactive_msg: "You let the energy flow out of your hands back into yourself...",
	projectile_type: rt.typePath("/obj/item/projectile/magic/aoe/lightning"),
	name: "Lightning Bolt",
	desc: "Fire a high powered lightning bolt at your foes!",
	active: 0,
});

// /obj/effect/proc_holder/spell/aimed/lightningbolt/proc/<init>  (code/modules/spells/spell_types/aimed.dm:90)
rt.def("/obj/effect/proc_holder/spell/aimed/lightningbolt/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "projectile_var_overrides", rt.alist(f, ["tesla_range", 15, "tesla_power", 20000, "tesla_boom", 0]));
	return f.dot;
});
