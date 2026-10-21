// From code/_onclick/item_attack.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/item/proc/melee_attack_chain  (code/_onclick/item_attack.dm:3)  may sleep
rt.def("/obj/item/proc/melee_attack_chain", function* melee_attack_chain(f: Frame, user: Value, target: Value, params: Value) {
	let resolved: Value = null;
	f.vars = () => [user, target, params, resolved];
	if (!truthy((yield* g.srcCall(f, "pre_attackby", live(target), live(user), live(params))))) return f.dot;
	if (!((!truthy((resolved = (yield* g.callName(f, live(target), "attackby", [live(f.src), live(user), live(params)])))) && truthy(live(target))) && !(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))))) return f.dot;
	yield* g.srcCall(f, "afterattack", live(target), live(user), 1, live(params));
	return f.dot;
}, true);

// /obj/proc/attackby  (code/_onclick/item_attack.dm:22)  may sleep
rt.def("/obj/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	f.vars = () => [I, user, params];
	return (yield* g.callName(f, live(I), "attack_obj", [live(f.src), live(user)]));
}, true);

// /mob/living/proc/attackby  (code/_onclick/item_attack.dm:25)  may sleep
rt.def("/mob/living/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let sharpness: Value = null;
	f.vars = () => [I, user, params, sharpness];
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	if (((isEqual(rt.fv(f, "a_intent", live(user)), "harm") && isEqual(rt.sv(f, "stat"), 2)) && truthy(rt.sv(f, "butcher_results")))) {
		if (truthy((sharpness = (yield* g.callName(f, live(I), "is_sharp", []))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You begin to butcher ＀...</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/slice.ogg"), 50, 1, -1]);
			if ((truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(user), live(f.src), divide(80, live(sharpness))]))) && truthy((yield* g.srcCall(f, "Adjacent", live(I)))))) {
				yield* g.srcCall(f, "harvest", live(user));
			}
			return 1;
		}
	}
	return (yield* g.callName(f, live(I), "attack", [live(f.src), live(user)]));
}, true);

// /obj/item/proc/attack  (code/_onclick/item_attack.dm:38)  may sleep
rt.def("/obj/item/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	f.vars = () => [M, user];
	if (truthy(rt.bitAnd(rt.sv(f, "flags"), 4))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "force"))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/tap.ogg"), (yield* g.srcCall(f, "get_clamped_volume")), 1, -1]);
	} else {
		if (truthy(rt.sv(f, "hitsound"))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "hitsound"), (yield* g.srcCall(f, "get_clamped_volume")), 1, -1]);
		}
	}
	rt.setFv(f, "lastattacked", live(user), live(M));
	rt.setFv(f, "lastattacker", live(M), live(user));
	yield* g.callName(f, live(user), "do_attack_animation", [live(M)]);
	yield* g.callName(f, live(M), "attacked_by", [live(f.src), live(user)]);
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(M), "attacked", rt.fv(f, "name", live(f.src)), fmt("(INTENT: ＀) (DAMTYPE: ＀)", [(yield* g.call(f, P("/proc/uppertext"), null, [rt.fv(f, "a_intent", live(user))])), (yield* g.call(f, P("/proc/uppertext"), null, [rt.sv(f, "damtype")]))])]);
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return f.dot;
}, true);

// /obj/item/proc/attack_obj  (code/_onclick/item_attack.dm:57)  may sleep
rt.def("/obj/item/proc/attack_obj", function* attack_obj(f: Frame, O: Value, user: Value) {
	f.vars = () => [O, user];
	if (truthy(rt.bitAnd(rt.sv(f, "flags"), 4))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	yield* g.callName(f, live(user), "do_attack_animation", [live(O)]);
	yield* g.callName(f, live(O), "attacked_by", [live(f.src), live(user)]);
	return f.dot;
}, true);

// /obj/proc/attacked_by  (code/_onclick/item_attack.dm:67)  may sleep
rt.def("/obj/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value) {
	f.vars = () => [I, user];
	if (truthy(rt.fv(f, "force", live(I)))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has hit ＀ with ＀!</span>", [live(user), live(f.src), live(I)]), null, null, 3);
	}
	yield* g.srcCall(f, "take_damage", rt.fv(f, "force", live(I)), rt.fv(f, "damtype", live(I)), "melee", 1);
	return f.dot;
}, true);

// /mob/living/proc/attacked_by  (code/_onclick/item_attack.dm:73)  may sleep
rt.def("/mob/living/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value) {
	let location: Value = null;
	f.vars = () => [I, user, location];
	yield* g.srcCall(f, "send_item_attack_message", live(I), live(user));
	if (!truthy(rt.fv(f, "force", live(I)))) return f.dot;
	yield* g.srcCall(f, "apply_damage", rt.fv(f, "force", live(I)), rt.fv(f, "damtype", live(I)));
	if (isEqual(rt.fv(f, "damtype", live(I)), "brute")) {
		if (truthy(rt.op(f, "Prob", [], [33]))) {
			yield* g.callName(f, live(I), "add_mob_blood", [live(f.src)]);
			yield* g.srcCall(f, "add_splatter_floor", (location = rt.getStep(f, live(f.src), 0)));
			if (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(user), live(f.src)])), 1)) {
				yield* g.callName(f, live(user), "add_mob_blood", [live(f.src)]);
			}
		}
	}
	return 1;
}, true);

// /mob/living/simple_animal/proc/attacked_by  (code/_onclick/item_attack.dm:86)  may sleep
rt.def("/mob/living/simple_animal/proc/attacked_by", function* attacked_by(f: Frame) {
	if ((rt.lt(rt.fv(f, "force", live(f.args[0])), rt.sv(f, "force_threshold")) || isEqual(rt.fv(f, "damtype", live(f.args[0])), "stamina"))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/tap.ogg"), (yield* g.callName(f, live(f.args[0]), "get_clamped_volume", [])), 1, -1]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user"] });

// /obj/item/proc/get_clamped_volume  (code/_onclick/item_attack.dm:100)
rt.def("/obj/item/proc/get_clamped_volume", function get_clamped_volume(f: Frame) {
	if (!truthy(rt.sv(f, "w_class"))) return f.dot;
	if (truthy(rt.sv(f, "force"))) {
		return rt.call(f, P("/proc/max"), null, [30, rt.call(f, P("/proc/min"), null, [multiply(add(rt.sv(f, "force"), rt.sv(f, "w_class")), 4), 100])]);
	}
	return rt.call(f, P("/proc/max"), null, [10, rt.call(f, P("/proc/min"), null, [multiply(rt.sv(f, "w_class"), 6), 100])]);
});

// /mob/living/proc/send_item_attack_message  (code/_onclick/item_attack.dm:105)
rt.def("/mob/living/proc/send_item_attack_message", function send_item_attack_message(f: Frame, I: Value, user: Value, hit_area: Value) {
	let message_verb: Value = null, message_hit_area: Value = null, attack_message: Value = null;
	f.vars = () => [message_verb, message_hit_area, attack_message];
	message_verb = "attacked";
	if ((truthy(rt.fv(f, "attack_verb", live(I))) && truthy(rt.getLen(f, rt.fv(f, "attack_verb", live(I)))))) {
		message_verb = fmt("＀", [rt.op(f, "PickUnweighted", [1], [rt.fv(f, "attack_verb", live(I))])]);
	} else {
		if (!truthy(rt.fv(f, "force", live(I)))) {
			return live(f.dot);
		}
	}
	message_hit_area = "";
	if (truthy(live(hit_area))) {
		message_hit_area = fmt(" in the ＀", [live(hit_area)]);
	}
	attack_message = fmt("＀ has been ＀＀ with ＀.", [live(f.src), live(message_verb), live(message_hit_area), live(I)]);
	if (truthy((rt.isIn(f, live(user), rt.call(f, P("/proc/viewers"), null, [live(f.src), null])) ? 1 : 0))) {
		attack_message = fmt("＀ has ＀ ＀＀ with ＀!", [live(user), live(message_verb), live(f.src), live(message_hit_area), live(I)]);
	}
	rt.callSrc(f, "visible_message", [fmt("<span class='danger'>＀</span>", [live(attack_message)]), fmt("<span class='userdanger'>＀</span>", [live(attack_message)]), null, 3]);
	return 1;
});
