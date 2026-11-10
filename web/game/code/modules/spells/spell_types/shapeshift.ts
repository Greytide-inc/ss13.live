// Based on /tg/station's code/modules/spells/spell_types/shapeshift.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(11331, "/obj/effect/proc_holder/spell/targeted/shapeshift", "/obj/effect/proc_holder/spell/targeted", {
	shapeshift_type: null,
	current_shapes: null,
	current_casters: null,
	possible_shapes: null,
	include_user: 1,
	name: "Shapechange",
	desc: "Take on the shape of another for a time to use their natural abilities. Once you've made your choice it cannot be changed.",
	clothes_req: 0,
	human_req: 0,
	charge_max: 200,
	cooldown_min: 50,
	range: -1,
	invocation: "RAC'WA NO!",
	invocation_type: "shout",
	action_icon_state: "shapeshift",
});

// shapeshift.dm:15
rt.def("/obj/effect/proc_holder/spell/targeted/shapeshift/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.current_shapes = list();

	this.current_casters = list();

	this.possible_shapes = list(T("/mob/living/simple_animal/mouse"), T("/mob/living/simple_animal/pet/dog/corgi"), T("/mob/living/simple_animal/hostile/carp/ranged/chaos"), T("/mob/living/simple_animal/bot/ed209"), T("/mob/living/simple_animal/hostile/construct/armored"));
	return f.dot;
});

// shapeshift.dm:24
rt.def("/obj/effect/proc_holder/spell/targeted/shapeshift/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let M: Value = null, animal_list: Value = null, path: Value = null, A: Value = null, new_shapeshift_type: Value = null;
	user ??= f.usr;
	for (M of each(targets, T("/mob/living"))) {
		if (!this.shapeshift_type) {
			animal_list = list();
			path = null;
			for (path of each(this.possible_shapes)) {
				A = path;
				rt.setAt(animal_list, rt.initial(f, A, "name"), path);
			}
			new_shapeshift_type = (yield* g.op(f, "Prompt", [1], [null, "It's Morphing Time!", "Choose Your Animal Form!", M, animal_list]));
			if (this.shapeshift_type) {
				return f.dot;
			}
			this.shapeshift_type = new_shapeshift_type;
			if (!this.shapeshift_type) {
				this.shapeshift_type = pick(animal_list);
			}
			this.shapeshift_type = rt.index(animal_list, this.shapeshift_type);
		}
		if (rt.isIn(f, M, this.current_shapes)) {
			yield* this.Restore(M);
		} else {
			yield* this.Shapeshift(M);
		}
	}
	return f.dot;
}, true);

// shapeshift.dm:43
rt.def("/obj/effect/proc_holder/spell/targeted/shapeshift/proc/Shapeshift", function* Shapeshift(f: Frame, caster: Value) {
	let M: Value = null;
	for (M of each(caster, T("/mob/living"))) {
		if (rt.bitAnd(M.status_flags, 4096)) {
			to_chat(caster, "<span class='warning'>You're already shapeshifted!</span>");
			return f.dot;
		}
	}
	let shape: Value = (yield* new_(this.shapeshift_type, caster.loc));
	caster.loc = shape;
	(rt.modField(f, caster, "status_flags", 4096, rt.bitOr));
	(rt.modSrcVar(f, "current_shapes", shape, rt.bitOr));
	(rt.modSrcVar(f, "current_casters", caster, rt.bitOr));
	this.clothes_req = 0;
	this.human_req = 0;
	yield* caster.mind.transfer_to(shape);
	return f.dot;
}, true);

// shapeshift.dm:61
rt.def("/obj/effect/proc_holder/spell/targeted/shapeshift/proc/Restore", function* Restore(f: Frame, shape: Value) {
	let caster: Value = null, M: Value = null;
	for (M of each(shape, T("/mob/living"))) {
		if (rt.isIn(f, M, this.current_casters)) {
			caster = M;
			break;
		}
	}
	if (!caster) {
		return f.dot;
	}
	caster.loc = shape.loc;
	(rt.modField(f, caster, "status_flags", 16773119, rt.bitAnd));
	this.clothes_req = rt.initial(f, this, "clothes_req");
	this.human_req = rt.initial(f, this, "human_req");
	yield* this.current_casters.Remove(caster);
	yield* this.current_shapes.Remove(shape);
	yield* shape.mind.transfer_to(caster);
	yield* qdel(shape);
	return f.dot;
}, true);

rt.type(11333, "/obj/effect/proc_holder/spell/targeted/shapeshift/dragon/list", "/obj/effect/proc_holder/spell/targeted/shapeshift/dragon", {
	current_shapes: null,
	current_casters: null,
	possible_shapes: null,
});

// shapeshift.dm:84
rt.def("/obj/effect/proc_holder/spell/targeted/shapeshift/dragon/list/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.current_shapes = list(T("/mob/living/simple_animal/hostile/megafauna/dragon/lesser"));

	this.current_casters = list();

	this.possible_shapes = list(T("/mob/living/simple_animal/hostile/megafauna/dragon/lesser"));
	return f.dot;
});
