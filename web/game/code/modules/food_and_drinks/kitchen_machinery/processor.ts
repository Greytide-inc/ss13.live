// Based on /tg/station's code/modules/food_and_drinks/kitchen_machinery/processor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, fmt } = rt;


rt.type(10899, "/obj/machinery/processor", "/obj/machinery", {
	broken: 0,
	processing: 0,
	rating_speed: 1,
	rating_amount: 1,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 5,
	active_power_usage: 50,
	name: "food processor",
	desc: "An industrial grinder used to process meat and other foods. Keep hands clear of intake area while operating.",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "processor1",
	layer: 2.9,
	density: 1,
});

// processor.dm:19
rt.def("/obj/machinery/processor/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/processor"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6752, "/obj/item/weapon/circuitboard/machine/processor", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Food Processor (Machine Board)",
	build_path: rt.typePath("/obj/machinery/processor"),
	origin_tech: "programming=1",
});

// processor.dm:27
rt.def("/obj/item/weapon/circuitboard/machine/processor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1]);
	return f.dot;
});

// processor.dm:36
rt.def("/obj/item/weapon/circuitboard/machine/processor/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		if (this.build_path == T("/obj/machinery/processor")) {
			this.name = "Slime Processor (Machine Board)";
			this.build_path = T("/obj/machinery/processor/slime");
			to_chat(user, "<span class='notice'>Name protocols successfully updated.</span>");
		} else {
			this.name = "Food Processor (Machine Board)";
			this.build_path = T("/obj/machinery/processor");
			to_chat(user, "<span class='notice'>Defaulting name protocols.</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// processor.dm:49
rt.def("/obj/machinery/processor/proc/RefreshParts", function RefreshParts(f: Frame) {
	let B: Value = null, M: Value = null;
	for (B of each(this.component_parts, T("/obj/item/weapon/stock_parts/matter_bin"))) {
		this.rating_amount = B.rating;
	}
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		this.rating_speed = M.rating;
	}
	return f.dot;
});

// processor.dm:55
rt.def("/obj/machinery/processor/proc/process", function* process(f: Frame) {
	let picked_slime: Value = null, slime: Value = null, _P: Value = null;
	yield* parent_proc();
	if (this.processing) {
		return f.dot;
	}
	for (slime of each(range(1, this), T("/mob/living/simple_animal/slime"))) {
		if (slime.loc == this) {
			continue;
		}
		if (rt.istype(slime, T("/mob/living/simple_animal/slime"))) {
			if (slime.stat) {
				picked_slime = slime;
				break;
			}
		}
	}
	if (!picked_slime) {
		return f.dot;
	}
	if (!(_P = (yield* this.select_recipe(picked_slime)))) {
		return f.dot;
	}
	this.visible_message(`${picked_slime} is sucked into ${this}.`);
	picked_slime.loc = this;
	return f.dot;
}, true, { waitfor: false });

rt.type(2316, "/datum/food_processor_process", "/datum", {
	input: null,
	output: null,
	time: 40,
});

// processor.dm:82
rt.def("/datum/food_processor_process/proc/process_food", function* process_food(f: Frame, loc: Value, what: Value, processor: Value) {
	let i: Value = null;
	if (this.output && loc && processor) {
		i = 0;
		while (i < processor.rating_amount) {
			yield* new_(this.output, loc);
			i++;
		}
	}
	if (!what) return f.dot;
	yield* qdel(what);
	return f.dot;
}, true);

rt.type(2327, "/datum/food_processor_process/mob", "/datum/food_processor_process", {});

// processor.dm:131
rt.def("/datum/food_processor_process/mob/proc/process_food", function* process_food(f: Frame, loc: Value, what: Value, processor: Value) {
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2328, "/datum/food_processor_process/mob/slime", "/datum/food_processor_process/mob", {
	output: null,
	input: rt.typePath("/mob/living/simple_animal/slime"),
});

// processor.dm:135
rt.def("/datum/food_processor_process/mob/slime/proc/process_food", function* process_food(f: Frame, loc: Value, what: Value, processor: Value) {
	let i: Value = null;
	let $e: any;
	let S: Value = what;
	let C: Value = S.cores;
	if (S.stat != 2) {
		S.loc = loc;
		S.visible_message(`<span class='notice'>${C} crawls free of the processor!</span>`);
		return f.dot;
	}
	rt.forRange(f, 0, 1, C + processor.rating_amount - 1, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(S.coretype, loc);
	}
	rt.endFor(f, 0);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(2329, "/datum/food_processor_process/mob/monkey", "/datum/food_processor_process/mob", {
	output: null,
	input: rt.typePath("/mob/living/carbon/monkey"),
});

// processor.dm:150
rt.def("/datum/food_processor_process/mob/monkey/proc/process_food", function* process_food(f: Frame, loc: Value, what: Value, processor: Value) {
	let O: Value = null, B: Value = null, D: Value = null;
	if ((O = what).client) {
		O.loc = loc;
		O.visible_message(`<span class='notice'>Suddenly ${O} jumps out from the processor!</span>`, "<span class='notice'>You jump out from the processor!</span>", "<span class='italics'>You hear chimpering.</span>");
		return f.dot;
	}
	let bucket: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/bucket"), loc));
	(B = (yield* new_(T("/datum/reagent/blood")))).holder = bucket;
	B.volume = 70;
	rt.setAt(B.data, "donor", O);
	for (D of each(O.viruses, T("/datum/disease"))) {
		if (!rt.bitAnd(D.spread_flags, SPECIAL)) {
			rt.modAt(B.data, "viruses", (yield* D.Copy()), add);
		}
	}
	if (O.has_dna()) {
		rt.setAt(B.data, "blood_DNA", O.dna.unique_enzymes);
	}
	if (O.resistances && rt.len(f, O.resistances)) {
		rt.setAt(B.data, "resistances", (yield* O.resistances.Copy()));
	}
	bucket.reagents.reagent_list += B;
	yield* bucket.reagents.update_total();
	bucket.on_reagent_change();
	yield* parent_proc();
	return f.dot;
}, true);

// processor.dm:183
rt.def("/obj/machinery/processor/proc/select_recipe", function* select_recipe(f: Frame, X: Value) {
	let Type: Value = null, _P: Value = null;
	for (Type of each(typesof(T("/datum/food_processor_process")) - T("/datum/food_processor_process") - T("/datum/food_processor_process/mob"))) {
		_P = (yield* new_(Type));
		if (!rt.op(f, "IsType", [], [X, _P.input])) {
			continue;
		}
		return _P;
	}
	return 0;
}, true);

// processor.dm:191
rt.def("/obj/machinery/processor/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let _T: Value = null, loaded: Value = null, S: Value = null, _P: Value = null, _P_0: Value = null;
	if (this.processing) {
		to_chat(user, "<span class='warning'>The processor is in the process of processing!</span>");
		return 1;
	}
	if (this.default_deconstruction_screwdriver(user, "processor", "processor1", O)) {
		return f.dot;
	}
	if (yield* this.exchange_parts(user, O)) {
		return f.dot;
	}
	if (yield* this.default_pry_open(O)) {
		return f.dot;
	}
	if (yield* this.default_unfasten_wrench(user, O)) {
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(O)) {
		return f.dot;
	}
	if (rt.istype(O, T("/obj/item/weapon/storage/bag/tray"))) {
		_T = O;
		loaded = 0;
		for (S of each(_T.contents, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
			if (_P = (yield* this.select_recipe(S))) {
				yield* _T.remove_from_storage(S, this);
				loaded++;
			}
		}
		if (loaded) {
			to_chat(user, `<span class='notice'>You insert ${loaded} items into ${this}.</span>`);
		}
		return f.dot;
	}
	if (_P_0 = (yield* this.select_recipe(O))) {
		user.visible_message(`${user} put ${O} into ${this}.`, `You put ${O} into ${this}.`);
		yield* user.drop_item();
		O.loc = this;
		return 1;
	} else if (user.a_intent != "harm") {
		to_chat(user, "<span class='warning'>That probably won't blend!</span>");
		return 1;
	} else {
		return (yield* parent_proc());
	}
}, true);

// processor.dm:237
rt.def("/obj/machinery/processor/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let pushed_mob: Value = null, O: Value = null, _P: Value = null, O_2: Value = null, _P_3: Value = null;
	let $e: any;
	if (this.stat != 0) {
		return f.dot;
	}
	if (this.processing) {
		to_chat(user, "<span class='warning'>The processor is in the process of processing!</span>");
		return 1;
	}
	if (user.a_intent == "grab" && user.pulling && (rt.istype(user.pulling, T("/mob/living/simple_animal/slime")) || rt.istype(user.pulling, T("/mob/living/carbon/monkey")))) {
		if (user.grab_state < 1) {
			to_chat(user, "<span class='warning'>You need a better grip to do that!</span>");
			return f.dot;
		}
		pushed_mob = user.pulling;
		this.visible_message(`<span class='warner'>${user} stuffs ${pushed_mob} into ${this}!</span>`);
		yield* pushed_mob.forceMove(this);
		yield* user.stop_pulling();
		return f.dot;
	}
	if (rt.len(f, this.contents) == 0) {
		to_chat(user, "<span class='warning'>The processor is empty!</span>");
		return 1;
	}
	this.processing = 1;
	user.visible_message(`${user} turns on ${this}.`, `<span class='notice'>You turn on ${this}.</span>`, "<span class='italics'>You hear a food processor.</span>");
	playsound(this.loc, rt.rsc("sound/machines/blender.ogg"), 50, 1);
	yield* this.use_power(500);
	let total_time: Value = 0;
	for (O of each(this.contents)) {
		if (!(_P = (yield* this.select_recipe(O)))) {
			log_admin(`DEBUG: ${O} in processor hasnt got a suitable recipe. How did it get in there? Please report it immediatly!!!`);
			continue;
		}
		total_time += _P.time;
	}
	let offset: Value = prob(50) ? -2 : 2;
	rt.op(f, "Animate", [2, 8], [null, this, "pixel_x", this.pixel_x + offset, "time", 0.2, "loop", total_time / this.rating_speed * 5]);
	yield* sleep(total_time / this.rating_speed);
	for (O_2 of each(this.contents)) {
		if (!(_P_3 = (yield* this.select_recipe(O_2)))) {
			log_admin(`DEBUG: ${O_2} in processor havent suitable recipe. How do you put it in?`);
			continue;
		}
		yield* _P_3.process_food(this.loc, O_2, this);
	}
	this.pixel_x = rt.initial(f, this, "pixel_x");
	this.processing = 0;
	this.visible_message(fmt("＄！ finishes processing.", [this]));
	return f.dot;
}, true);

// processor.dm:285
rt.def("/obj/machinery/processor/verb/eject", function* eject(f: Frame) {
	if (f.usr.stat || !f.usr.canmove || f.usr.restrained()) {
		return f.dot;
	}
	yield* this.empty();
	yield* this.add_fingerprint(f.usr);
	return f.dot;
}, true, { verb: { name: "Eject Contents", category: "Object", src: 3, range: 1 } });

// processor.dm:292
rt.def("/obj/machinery/processor/proc/empty", function empty(f: Frame) {
	let O: Value = null, M: Value = null;
	for (O of each(this, T("/obj"))) {
		O.loc = this.loc;
	}
	for (M of each(this, T("/mob"))) {
		M.loc = this.loc;
	}
	return f.dot;
});

rt.type(10900, "/obj/machinery/processor/slime", "/obj/machinery/processor", {
	name: "Slime processor",
	desc: "An industrial grinder with a sticker saying appropriated for science department. Keep hands clear of intake area while operating.",
});

// processor.dm:303
rt.def("/obj/machinery/processor/slime/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/processor/slime"), null))).apply_default_parts(this);
	return f.dot;
}, true);
