// From code/modules/spells/spell_types/conjure.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11352, "/obj/effect/proc_holder/spell/aoe_turf/conjure", "/obj/effect/proc_holder/spell/aoe_turf", {
	summon_type: null,
	summon_lifespan: 0,
	summon_amt: 1,
	summon_ignore_density: 0,
	summon_ignore_prev_spawn_points: 0,
	newVars: null,
	cast_sound: rt.rsc("sound/items/welder.ogg"),
	name: "Conjure",
	desc: "This spell conjures objs of the specified types in range.",
});

// /obj/effect/proc_holder/spell/aoe_turf/conjure/proc/<init>  (code/modules/spells/spell_types/conjure.dm:5)
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "summon_type", rt.list());
	$0 = $0;
	rt.setSv(f, "newVars", rt.list());
	return f.dot;
});

// /obj/effect/proc_holder/spell/aoe_turf/conjure/proc/cast  (code/modules/spells/spell_types/conjure.dm:19)  may sleep
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let _T: Value = null, i: Value = null, summoned_object_type: Value = null, spawn_place: Value = null, O: Value = null, N: Value = null, summoned_object: Value = null, varName: Value = null;
	let $e: any;
	f.vars = () => [targets, user, _T, i, summoned_object_type, spawn_place, O, N, summoned_object, varName, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.sv(f, "cast_sound"), 50, 1]);
	_T = null;
	rt.forList(f, 0, live(targets), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if ((truthy(rt.fv(f, "density", live(_T))) && !truthy(rt.sv(f, "summon_ignore_density")))) {
			(targets = rt.modify(live(targets), live(_T), subtract));
		}
	}
	rt.endFor(f, 0);
	i = null;
	i = 0;
	while (rt.lt(live(i), rt.sv(f, "summon_amt"))) {
		if (!truthy(rt.len(f, live(targets)))) {
			break;
		}
		summoned_object_type = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "summon_type")]);
		spawn_place = rt.op(f, "PickUnweighted", [1], [live(targets)]);
		if (truthy(rt.sv(f, "summon_ignore_prev_spawn_points"))) {
			(targets = rt.modify(live(targets), live(spawn_place), subtract));
		}
		if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(summoned_object_type), T("/turf")])))) {
			O = live(spawn_place);
			N = live(summoned_object_type);
			yield* g.callName(f, live(O), "ChangeTurf", [live(N)]);
		} else {
			summoned_object = (yield* g.new_(f, live(summoned_object_type), [live(spawn_place)]));
			varName = null;
			rt.forList(f, 0, rt.sv(f, "newVars"));
			while (($e = rt.next(f, 0)) !== undefined) {
				varName = $e;
				if (truthy((rt.isIn(f, live(varName), rt.fv(f, "vars", live(summoned_object))) ? 1 : 0))) {
					rt.setAt(rt.fv(f, "vars", live(summoned_object)), live(varName), rt.index(rt.sv(f, "newVars"), live(varName)));
				}
			}
			rt.endFor(f, 0);
			rt.setFv(f, "admin_spawned", live(summoned_object), 1);
			if (truthy(rt.sv(f, "summon_lifespan"))) {
				yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(summoned_object)])), rt.sv(f, "summon_lifespan"), 8]);
			}
			yield* g.srcCall(f, "post_summon", live(summoned_object), live(user));
		}
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

rt.type(11353, "/obj/effect/proc_holder/spell/aoe_turf/conjure/summonEdSwarm", "/obj/effect/proc_holder/spell/aoe_turf/conjure", {
	summon_type: null,
	summon_amt: 10,
	newVars: null,
	name: "Dispense Wizard Justice",
	desc: "This spell dispenses wizard justice.",
	range: 3,
});

// /obj/effect/proc_holder/spell/aoe_turf/conjure/summonEdSwarm/proc/<init>  (code/modules/spells/spell_types/conjure.dm:54)
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/summonEdSwarm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "summon_type", rt.list(T("/mob/living/simple_animal/bot/ed209")));
	rt.setSv(f, "newVars", rt.alist(f, ["emagged", 2, "remote_disabled", 1, "shoot_sound", rt.rsc("sound/weapons/laser.ogg"), "projectile", T("/obj/item/projectile/beam/laser"), "declare_arrests", 0, "name", "Wizard's Justicebot"]));
	return f.dot;
});

rt.type(11285, "/obj/effect/proc_holder/spell/targeted/conjure_item", "/obj/effect/proc_holder/spell/targeted", {
	item: null,
	item_type: rt.typePath("/obj/item/weapon/banhammer"),
	include_user: 1,
	name: "Summon weapon",
	desc: "A generic spell that should not exist.  This summons an instance of a specific type of item, or if one already exists, un-summons it.  Summons into hand if possible.",
	invocation_type: "none",
	range: -1,
	clothes_req: 0,
	school: "conjuration",
	charge_max: 150,
	cooldown_min: 10,
});

// /obj/effect/proc_holder/spell/targeted/conjure_item/proc/cast  (code/modules/spells/spell_types/conjure.dm:73)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/conjure_item/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [targets, user, C, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if ((truthy(rt.sv(f, "item")) && !(!truthy(rt.sv(f, "item")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "item")))))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "item")]);
		rt.setSv(f, "item", null);
	} else {
		C = null;
		rt.forList(f, 0, live(targets), T("/mob/living/carbon"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			if (truthy((yield* g.callName(f, live(C), "drop_item", [])))) {
				rt.setSv(f, "item", (yield* g.srcCall(f, "make_item")));
				yield* g.callName(f, live(C), "put_in_hands", [rt.sv(f, "item")]);
			}
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/targeted/conjure_item/proc/Destroy  (code/modules/spells/spell_types/conjure.dm:84)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/conjure_item/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "item"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "item")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/proc_holder/spell/targeted/conjure_item/proc/make_item  (code/modules/spells/spell_types/conjure.dm:88)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/conjure_item/proc/make_item", function* make_item(f: Frame) {
	return (yield* g.new_(f, rt.sv(f, "item_type"), []));
}, true);
