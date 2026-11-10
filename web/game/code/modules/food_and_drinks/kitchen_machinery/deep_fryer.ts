// Based on /tg/station's code/modules/food_and_drinks/kitchen_machinery/deep_fryer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(6748, "/obj/item/weapon/circuitboard/machine/deep_fryer", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "circuit board (Deep Fryer)",
	build_path: rt.typePath("/obj/machinery/deepfryer"),
	origin_tech: "programming=1",
});

// deep_fryer.dm:35
rt.def("/obj/item/weapon/circuitboard/machine/deep_fryer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/micro_laser"), 1]);
	return f.dot;
});

rt.type(10749, "/obj/machinery/deepfryer", "/obj/machinery", {
	frying: null,
	cook_time: 0,
	anchored: 1,
	container_type: 4096,
	name: "deep fryer",
	desc: "Deep fried <i>everything</i>.",
	icon: rt.rsc("icons/obj/kitchen.dmi"),
	icon_state: "fryer_off",
	density: 1,
	use_power: 1,
	idle_power_usage: 5,
}, { global: { blacklisted_items: 752 } });

// deep_fryer.dm:38
rt.def("/obj/machinery/deepfryer/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.create_reagents(50);
	yield* this.reagents.add_reagent("nutriment", 25);
	this.component_parts = list();
	this.component_parts += (yield* new_(T("/obj/item/weapon/circuitboard/machine/deep_fryer"), null));
	this.component_parts += (yield* new_(T("/obj/item/weapon/stock_parts/micro_laser"), null));
	yield* this.RefreshParts();
	return f.dot;
}, true);

// deep_fryer.dm:47
rt.def("/obj/machinery/deepfryer/proc/examine", function examine(f: Frame) {
	parent_proc();
	if (!this.frying) return f.dot;
	to_chat(f.usr, `You can make out ${this.frying} in the oil.`);
	return f.dot;
});

// deep_fryer.dm:52
rt.def("/obj/machinery/deepfryer/proc/attackby", function* attackby(f: Frame, I: Value, user: Value) {
	if (!this.reagents.total_volume) {
		to_chat(user, `There's nothing to fry with in ${this}!`);
		return f.dot;
	}
	if (rt.istype(I, T("/obj/item/weapon/reagent_containers/food/snacks/deepfryholder"))) {
		to_chat(user, "<span class='userdanger'>Your cooking skills are not up to the legendary Doublefry technique.</span>");
		return f.dot;
	}
	if (yield* this.default_unfasten_wrench(user, I)) {
		return f.dot;
	} else if (yield* this.exchange_parts(user, I)) {
		return f.dot;
	} else if (this.default_deconstruction_screwdriver(user, "fryer_off", "fryer_off", I)) {
		return f.dot;
	} else if (is_type_in_typecache(I, GLOB.blacklisted_items)) {
		f.dot = (yield* parent_proc());
	} else {
		if (!((yield* user.drop_item()) && !this.frying)) return f.dot;
		to_chat(user, `<span class='notice'>You put ${I} into ${this}.</span>`);
		this.frying = I;
		yield* this.frying.forceMove(this);
		this.icon_state = "fryer_on";
	}
	return f.dot;
}, true);

// deep_fryer.dm:74
rt.def("/obj/machinery/deepfryer/proc/process", function process(f: Frame) {
	parent_proc();
	if (!this.reagents.total_volume) {
		return f.dot;
	}
	if (!this.frying) return f.dot;
	this.cook_time++;
	if (this.cook_time == 30) {
		playsound(this.loc, rt.rsc("sound/machines/ding.ogg"), 50, 1);
		this.visible_message(`${this} dings!`);
	} else {
		if (this.cook_time != 60) return f.dot;
		this.visible_message(`${this} emits an acrid smell!`);
	}
	return f.dot;
}, false, { waitfor: false });

// deep_fryer.dm:88
rt.def("/obj/machinery/deepfryer/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let S: Value = null, food: Value = null, C: Value = null;
	if (this.frying) {
		if (this.frying.loc == this) {
			to_chat(user, `<span class='notice'>You eject ${this.frying} from ${this}.</span>`);
			S = (yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/deepfryholder"), rt.getStep(f, this, 0)));
			if (rt.istype(this.frying, T("/obj/item/weapon/reagent_containers"))) {
				yield* (food = this.frying).reagents.trans_to(S, food.reagents.total_volume);
			}
			S.icon = this.frying.icon;
			S.overlays = this.frying.overlays;
			S.icon_state = this.frying.icon_state;
			S.desc = this.frying.desc;
			S.w_class = this.frying.w_class;
			yield* this.reagents.trans_to(S, 2 * (this.cook_time / 15));
			if (rt.inRange(this.cook_time, 0, 15)) {
				S.add_atom_colour("#a66736", FIXED_COLOUR_PRIORITY);
				S.name = `lightly-fried ${this.frying.name}`;
			} else if (rt.inRange(this.cook_time, 16, 49)) {
				S.add_atom_colour("#673f18", FIXED_COLOUR_PRIORITY);
				S.name = `fried ${this.frying.name}`;
			} else if (rt.inRange(this.cook_time, 50, 59)) {
				S.add_atom_colour("#3f1704", 4);
				S.name = `deep-fried ${this.frying.name}`;
			} else if (rt.inRange(this.cook_time, 60, 1e+31)) {
				S.add_atom_colour("#211309", FIXED_COLOUR_PRIORITY);
				S.name = "the physical manifestation of the very concept of fried foods";
				S.desc = "A heavily fried...something.  Who can tell anymore?";
			}
			S.filling_color = S.color;
			if (rt.istype(this.frying, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
				yield* qdel(this.frying);
			} else {
				yield* this.frying.forceMove(S);
			}
			this.icon_state = "fryer_off";
			yield* user.put_in_hands(S);
			this.frying = null;
			this.cook_time = 0;
			return f.dot;
		}
	} else if (user.pulling && user.a_intent == "grab" && rt.istype(user.pulling, T("/mob/living/carbon")) && this.reagents.total_volume) {
		if (user.grab_state < 1) {
			to_chat(user, "<span class='warning'>You need a better grip to do that!</span>");
			return f.dot;
		}
		C = user.pulling;
		user.visible_message(`<span class = 'danger'>${user} dunks ${C}'s face in ${this}!</span>`);
		yield* this.reagents.reaction(C, 1);
		yield* C.adjustFireLoss(this.reagents.total_volume);
		yield* this.reagents.remove_any(this.reagents.total_volume / 2);
		yield* C.Knockdown(60);
		user.changeNext_move(8);
	}
	yield* parent_proc();
	return f.dot;
}, true);
