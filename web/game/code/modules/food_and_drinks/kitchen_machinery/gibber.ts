// Based on /tg/station's code/modules/food_and_drinks/kitchen_machinery/gibber.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(10894, "/obj/machinery/gibber/autogibber", "/obj/machinery/gibber", {
	input_plate: null,
});

// gibber.dm:23
rt.def("/obj/machinery/gibber/autogibber/proc/Initialize", function* Initialize(f: Frame) {
	let i: Value = null, input_obj: Value = null;
	f.dot = (yield* parent_proc());
	for (i of each(GLOB.cardinal)) {
		if (input_obj = rt.locateIn(f, T("/obj/machinery/mineral/input"), rt.getStep(f, this.loc, i))) {
			if (isturf(input_obj.loc)) {
				this.input_plate = input_obj.loc;
				yield* qdel(input_obj);
				break;
			}
		}
	}
	if (this.input_plate) return f.dot;
	CRASH("Didn't find an input plate.");
	return f.dot;
}, true);

// gibber.dm:37
rt.def("/obj/machinery/gibber/autogibber/proc/Bumped", function* Bumped(f: Frame, A: Value) {
	let M: Value = null;
	if (!this.input_plate) {
		return f.dot;
	}
	if (!ismob(A)) return f.dot;
	if ((M = A).loc != this.input_plate) return f.dot;
	M.loc = this;
	yield* M.gib();
	return f.dot;
}, true);

rt.type(10893, "/obj/machinery/gibber", "/obj/machinery", {
	operating: 0,
	dirty: 0,
	gibtime: 40,
	meat_produced: 0,
	ignore_clothing: 0,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 2,
	active_power_usage: 500,
	name: "gibber",
	desc: "The name isn't descriptive enough?",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "grinder",
	density: 1,
});

// gibber.dm:48
rt.def("/obj/machinery/gibber/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.dot = (yield* parent_proc());
	this.add_overlay("grjam");
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/gibber")))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6749, "/obj/item/weapon/circuitboard/machine/gibber", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Gibber (Machine Board)",
	build_path: rt.typePath("/obj/machinery/gibber"),
	origin_tech: "programming=2;engineering=2",
});

// gibber.dm:57
rt.def("/obj/item/weapon/circuitboard/machine/gibber/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1]);
	return f.dot;
});

// gibber.dm:63
rt.def("/obj/machinery/gibber/proc/RefreshParts", function RefreshParts(f: Frame) {
	let B: Value = null, M: Value = null;
	let gib_time: Value = 40;
	for (B of each(this.component_parts, T("/obj/item/weapon/stock_parts/matter_bin"))) {
		this.meat_produced += B.rating;
	}
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		gib_time -= 5 * M.rating;
		this.gibtime = gib_time;
		if (M.rating >= 2) {
			this.ignore_clothing = 1;
		}
	}
	return f.dot;
});

// gibber.dm:72
rt.def("/obj/machinery/gibber/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (this.dirty) {
		this.add_overlay("grbloody");
	}
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (!this.occupant) {
		this.add_overlay("grjam");
	} else if (this.operating) {
		this.add_overlay("gruse");
	} else {
		this.add_overlay("gridle");
	}
	return f.dot;
});

// gibber.dm:85
rt.def("/obj/machinery/gibber/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// gibber.dm:88
rt.def("/obj/machinery/gibber/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	yield* this.go_out();
	return f.dot;
}, true);

// gibber.dm:91
rt.def("/obj/machinery/gibber/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let L: Value = null, C: Value = null;
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (this.operating) {
		to_chat(user, "<span class='danger'>It's locked and running.</span>");
		return f.dot;
	}
	if (user.pulling && user.a_intent == "grab" && rt.istype(user.pulling, T("/mob/living"))) {
		if (!rt.istype((L = user.pulling), T("/mob/living/carbon"))) {
			to_chat(user, "<span class='danger'>This item is not suitable for the gibber!</span>");
			return f.dot;
		}
		if ((C = L).buckled || C.has_buckled_mobs()) {
			to_chat(user, `<span class='warning'>${C} is attached to something!</span>`);
			return f.dot;
		}
		if (C.abiotic(1) && !this.ignore_clothing) {
			to_chat(user, "<span class='danger'>Subject may not have abiotic items on.</span>");
			return f.dot;
		}
		user.visible_message(`<span class='danger'>${user} starts to put ${C} into the gibber!</span>`);
		yield* this.add_fingerprint(user);
		if (yield* do_after(user, this.gibtime, { target: this })) {
			if (C && user.pulling == C && !C.buckled && !C.has_buckled_mobs() && !this.occupant) {
				user.visible_message(`<span class='danger'>${user} stuffs ${C} into the gibber!</span>`);
				yield* C.forceMove(this);
				this.occupant = C;
				yield* this.update_icon();
			}
		}
	} else {
		yield* this.startgibbing(user);
	}
	return f.dot;
}, true);

// gibber.dm:122
rt.def("/obj/machinery/gibber/proc/attackby", function* attackby(f: Frame, P: Value, user: Value, params: Value) {
	if (this.default_deconstruction_screwdriver(user, "grinder_open", "grinder", P)) {
		return f.dot;
	} else if (yield* this.exchange_parts(user, P)) {
		return f.dot;
	} else if (yield* this.default_pry_open(P)) {
		return f.dot;
	} else if (yield* this.default_unfasten_wrench(user, P)) {
		return f.dot;
	} else if (yield* this.default_deconstruction_crowbar(P)) {
		return f.dot;
	} else {
		return (yield* parent_proc());
	}
}, true);

// gibber.dm:146
rt.def("/obj/machinery/gibber/verb/eject", function* eject(f: Frame) {
	if (f.usr.incapacitated()) {
		return f.dot;
	}
	yield* this.go_out();
	yield* this.add_fingerprint(f.usr);
	return f.dot;
}, true, { verb: { name: "empty gibber", category: "Object", src: 3, range: 1 } });

// gibber.dm:153
rt.def("/obj/machinery/gibber/proc/go_out", function* go_out(f: Frame) {
	yield* this.dropContents();
	yield* this.update_icon();
	return f.dot;
}, true);

// gibber.dm:157
rt.def("/obj/machinery/gibber/proc/startgibbing", function* startgibbing(f: Frame, user: Value) {
	let sourcejob: Value = null, gibee: Value = null, allskin: Value = null, gibee_10: Value = null, C: Value = null, i: Value = null, newmeat: Value = null, newskin: Value = null, _T: Value = null, nearby_turfs: Value = null, skin: Value = null, i_13: Value = null, meatslab: Value = null, turfs: Value = null, gibturf: Value = null;
	let $e: any;
	if (this.operating) {
		return f.dot;
	}
	if (!this.occupant) {
		this.visible_message("<span class='italics'>You hear a loud metallic grinding sound.</span>");
		return f.dot;
	}
	yield* this.use_power(1000);
	this.visible_message("<span class='italics'>You hear a loud squelchy grinding sound.</span>");
	playsound(this.loc, rt.rsc("sound/machines/juicer.ogg"), 50, 1);
	this.operating = 1;
	yield* this.update_icon();
	let offset: Value = prob(50) ? -2 : 2;
	rt.op(f, "Animate", [2, 8], [null, this, "pixel_x", this.pixel_x + offset, "time", 0.2, "loop", 200]);
	let mob_occupant: Value = this.occupant;
	let sourcename: Value = mob_occupant.real_name;
	if (rt.istype(this.occupant, T("/mob/living/carbon/human"))) {
		sourcejob = (gibee = this.occupant).job;
	}
	let sourcenutriment: Value = mob_occupant.nutrition / 15;
	let gibtype: Value = T("/obj/effect/decal/cleanable/blood/gibs");
	let typeofmeat: Value = T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human");
	let typeofskin: Value = T("/obj/item/stack/sheet/animalhide/human");
	let allmeat: Value = rt.op(f, "CreateMultidimensionalList", [1], [this.meat_produced]);
	if (rt.istype(this.occupant, T("/mob/living/carbon/human"))) {
		if ((gibee_10 = this.occupant).dna && gibee_10.dna.species) {
			typeofmeat = gibee_10.dna.species.meat;
			if (gibee_10.dna.species.skinned_type) {
				typeofskin = gibee_10.dna.species.skinned_type;
			}
		}
	} else if (rt.istype(this.occupant, T("/mob/living/carbon"))) {
		typeofmeat = (C = this.occupant).type_of_meat;
		gibtype = C.gib_type;
		if (rt.istype(C, T("/mob/living/carbon/monkey"))) {
			typeofskin = T("/obj/item/stack/sheet/animalhide/monkey");
		} else if (rt.istype(C, T("/mob/living/carbon/alien"))) {
			typeofskin = T("/obj/item/stack/sheet/animalhide/xeno");
		}
	}
	rt.forRange(f, 0, 1, this.meat_produced, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		newmeat = (yield* new_(typeofmeat));
		newskin = (yield* new_(typeofskin));
		newmeat.name = `${sourcename} ${newmeat.name}`;
		if (rt.istype(newmeat, T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"))) {
			newmeat.subjectname = sourcename;
			yield* newmeat.reagents.add_reagent("nutriment", sourcenutriment / this.meat_produced);
			if (sourcejob) {
				newmeat.subjectjob = sourcejob;
			}
		}
		rt.setAt(allmeat, i, newmeat);
		allskin = newskin;
	}
	rt.endFor(f, 0);
	add_logs(user, this.occupant, "gibbed");
	yield* mob_occupant.death(1);
	yield* mob_occupant.ghostize();
	yield* qdel(this.occupant);
	rt.spawnTail(f, this.gibtime, "/obj/machinery/gibber/proc/startgibbing: spawn at modules/food_and_drinks/kitchen_machinery/gibber.dm:215", user, offset, mob_occupant, sourcename, sourcejob, gibee, sourcenutriment, gibtype, typeofmeat, typeofskin, allmeat, allskin, gibee_10, C, i, newmeat, newskin, _T, nearby_turfs, skin, i_13, meatslab, turfs, gibturf);
	return f.dot;
}, true);

// a spawn(rt.fieldI(f, live(f.src), $ic[73])) body of /obj/machinery/gibber/proc/startgibbing, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/gibber/proc/startgibbing: spawn at modules/food_and_drinks/kitchen_machinery/gibber.dm:215", function* (f: Frame, user: Value, offset: Value, mob_occupant: Value, sourcename: Value, sourcejob: Value, gibee: Value, sourcenutriment: Value, gibtype: Value, typeofmeat: Value, typeofskin: Value, allmeat: Value, allskin: Value, gibee_10: Value, C: Value, i: Value, newmeat: Value, newskin: Value, _T: Value, nearby_turfs: Value, skin: Value, i_13: Value, meatslab: Value, turfs: Value, gibturf: Value) {
	let $e: any;
	playsound(this.loc, rt.rsc("sound/effects/splat.ogg"), 50, 1);
	this.operating = 0;
	_T = rt.getStep(f, this, 0);
	nearby_turfs = block(rt.locate(max(_T.x - 3, 1), max(_T.y - 3, 1), _T.z), rt.locate(min(_T.x + 3, rt.world().maxx), min(_T.y + 3, rt.world().maxy), _T.z)) - _T;
	(skin = allskin).loc = this.loc;
	yield* skin.throw_at(pick(nearby_turfs), this.meat_produced, 3);
	i_13 = null;
	rt.forRange(f, 0, 1, this.meat_produced, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i_13 = $e;
		(meatslab = rt.index(allmeat, i_13)).loc = this.loc;
		yield* meatslab.throw_at(pick(nearby_turfs), i_13, 3);
		turfs = null;
		rt.forRange(f, 1, 1, this.meat_produced, 1);
		while (($e = rt.next(f, 1)) !== undefined) {
			turfs = $e;
			if (rt.isIn(f, ((!(gibturf = pick(nearby_turfs)).density ? 1 : 0) && this), view(gibturf))) {
				yield* new_(gibtype, gibturf, i_13);
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	this.pixel_x = rt.initial(f, this, "pixel_x");
	this.operating = 0;
	yield* this.update_icon();
	return null;
});
