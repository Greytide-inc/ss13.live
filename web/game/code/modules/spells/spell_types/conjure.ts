// Based on /tg/station's code/modules/spells/spell_types/conjure.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


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

// conjure.dm:5
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.summon_type = list();

	this.newVars = list();
	return f.dot;
});

// conjure.dm:19
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let _T: Value = null, summoned_object_type: Value = null, spawn_place: Value = null, O: Value = null, N: Value = null, summoned_object: Value = null, varName: Value = null;
	user ??= f.usr;
	playsound(rt.getStep(f, user, 0), this.cast_sound, 50, 1);
	for (_T of each(targets, T("/turf"))) {
		if (_T.density && !this.summon_ignore_density) {
			targets -= _T;
		}
	}
	let i: Value = 0;
	while (i < this.summon_amt) {
		if (!rt.len(f, targets)) {
			break;
		}
		summoned_object_type = pick(this.summon_type);
		spawn_place = pick(targets);
		if (this.summon_ignore_prev_spawn_points) {
			targets -= spawn_place;
		}
		if (ispath(summoned_object_type, T("/turf"))) {
			O = spawn_place;
			N = summoned_object_type;
			yield* O.ChangeTurf(N);
		} else {
			summoned_object = (yield* new_(summoned_object_type, spawn_place));
			varName = null;
			for (varName of each(this.newVars)) {
				if (rt.isIn(f, varName, summoned_object.vars)) {
					rt.setAt(summoned_object.vars, varName, rt.index(this.newVars, varName));
				}
			}
			summoned_object.admin_spawned = 1;
			if (this.summon_lifespan) {
				yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), summoned_object)), this.summon_lifespan, 8);
			}
			this.post_summon(summoned_object, user);
		}
		i++;
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

// conjure.dm:54
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/summonEdSwarm/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.summon_type = list(T("/mob/living/simple_animal/bot/ed209"));
	this.newVars = rt.alist(f, ["emagged", 2, "remote_disabled", 1, "shoot_sound", rt.rsc("sound/weapons/laser.ogg"), "projectile", T("/obj/item/projectile/beam/laser"), "declare_arrests", 0, "name", "Wizard's Justicebot"]);
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

// conjure.dm:73
rt.def("/obj/effect/proc_holder/spell/targeted/conjure_item/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let C: Value = null;
	user ??= f.usr;
	if (this.item && !(!this.item || this.item.gc_destroyed)) {
		yield* qdel(this.item);
		this.item = null;
	} else {
		for (C of each(targets, T("/mob/living/carbon"))) {
			if (yield* C.drop_item()) {
				this.item = (yield* this.make_item());
				yield* C.put_in_hands(this.item);
			}
		}
	}
	return f.dot;
}, true);

// conjure.dm:84
rt.def("/obj/effect/proc_holder/spell/targeted/conjure_item/proc/Destroy", function* Destroy(f: Frame) {
	if (this.item) {
		yield* qdel(this.item);
	}
	return (yield* parent_proc());
}, true);

// conjure.dm:88
rt.def("/obj/effect/proc_holder/spell/targeted/conjure_item/proc/make_item", function* make_item(f: Frame) {
	return (yield* new_(this.item_type));
}, true);
