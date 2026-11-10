// Based on /tg/station's code/game/objects/structures/watercloset.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(12890, "/obj/structure/toilet", "/obj/structure", {
	open: 0,
	cistern: 0,
	w_items: 0,
	swirlie: null,
	anchored: 1,
	name: "toilet",
	desc: "The HT-451, a torque rotation-based, waste disposal unit for small matter. This one seems remarkably clean.",
	icon: rt.rsc("icons/obj/watercloset.dmi"),
	icon_state: "toilet00",
	density: 0,
});

// watercloset.dm:15
rt.def("/obj/structure/toilet/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	this.open = round(rand(0, 1));
	this.update_icon();
	return f.dot;
});

// watercloset.dm:22
rt.def("/obj/structure/toilet/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let GM: Value = null, C: Value = null, I: Value = null;
	if (this.swirlie) {
		user.changeNext_move(8);
		playsound(this.loc, "swing_hit", 25, 1);
		this.swirlie.visible_message(`<span class='danger'>${user} slams the toilet seat onto ${this.swirlie}'s head!</span>`, `<span class='userdanger'>${user} slams the toilet seat onto your head!</span>`, "<span class='italics'>You hear reverberating porcelain.</span>");
		yield* this.swirlie.adjustBruteLoss(5);
	} else if (user.pulling && user.a_intent == "grab" && rt.istype(user.pulling, T("/mob/living"))) {
		user.changeNext_move(8);
		GM = user.pulling;
		if (user.grab_state >= 1) {
			if (GM.loc != rt.getStep(f, this, 0)) {
				to_chat(user, `<span class='warning'>${GM} needs to be on ${this}!</span>`);
				return f.dot;
			}
			if (!this.swirlie) {
				if (this.open) {
					GM.visible_message(`<span class='danger'>${user} starts to give ${GM} a swirlie!</span>`, `<span class='userdanger'>${user} starts to give you a swirlie...</span>`);
					this.swirlie = GM;
					if (yield* do_after(user, 30, 0, { target: this })) {
						GM.visible_message(`<span class='danger'>${user} gives ${GM} a swirlie!</span>`, `<span class='userdanger'>${user} gives you a swirlie!</span>`, "<span class='italics'>You hear a toilet flushing.</span>");
						if (rt.istype(GM, T("/mob/living/carbon"))) {
							if (!(C = GM).internal) {
								yield* C.adjustOxyLoss(5);
							}
						} else {
							yield* GM.adjustOxyLoss(5);
						}
					}
					this.swirlie = null;
				} else {
					playsound(this.loc, rt.rsc("sound/effects/bang.ogg"), 25, 1);
					GM.visible_message(`<span class='danger'>${user} slams ${GM.name} into ${this}!</span>`, `<span class='userdanger'>${user} slams you into ${this}!</span>`);
					yield* GM.adjustBruteLoss(5);
				}
			}
		} else {
			to_chat(user, "<span class='warning'>You need a tighter grip!</span>");
		}
	} else if (this.cistern && !this.open) {
		if (!rt.len(f, this.contents)) {
			to_chat(user, "<span class='notice'>The cistern is empty.</span>");
		} else {
			I = pick(this.contents);
			if (rt.istype(user, T("/mob/living/carbon/human"))) {
				yield* user.put_in_hands(I);
			} else {
				I.loc = rt.getStep(f, this, 0);
			}
			to_chat(user, `<span class='notice'>You find ${I} in the cistern.</span>`);
			this.w_items -= I.w_class;
		}
	} else {
		this.open = (!this.open ? 1 : 0);
		yield* this.update_icon();
	}
	return f.dot;
}, true);

// watercloset.dm:71
rt.def("/obj/structure/toilet/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `toilet${this.open}${this.cistern}`;
	return f.dot;
});

// watercloset.dm:75
rt.def("/obj/structure/toilet/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let RG: Value = null;
	let $0: any, $1: any, $2: any;
	if (rt.istype(I, T("/obj/item/weapon/crowbar"))) {
		$0 = user;
		if (this.cistern) {
			$1 = "replace the lid on the cistern";
		} else {
			$1 = "lift the lid off the cistern";
		}
		to_chat($0, `<span class='notice'>You start to ${$1}...</span>`);
		playsound(this.loc, rt.rsc("sound/effects/stonedoor_openclose.ogg"), 50, 1);
		if (yield* do_after(user, 30 * I.toolspeed, { target: this })) {
			$0 = user;
			$1 = user;
			if (this.cistern) {

				$2 = "replaces the lid on the cistern";
			} else {
				$2 = "lifts the lid off the cistern";
			}
			$1 = `${$1} ${$2}!`;
			if (this.cistern) {
				$2 = "replace the lid on the cistern";
			} else {
				$2 = "lift the lid off the cistern";
			}
			$0.visible_message($1, `<span class='notice'>You ${$2}!</span>`, "<span class='italics'>You hear grinding porcelain.</span>");
			this.cistern = (!this.cistern ? 1 : 0);
			yield* this.update_icon();
		}
	} else if (this.cistern) {
		if (user.a_intent != "harm") {
			if (I.w_class > WEIGHT_CLASS_NORMAL) {
				to_chat(user, `<span class='warning'>${I} does not fit!</span>`);
				return f.dot;
			}
			if (this.w_items + I.w_class > WEIGHT_CLASS_HUGE) {
				to_chat(user, "<span class='warning'>The cistern is full!</span>");
				return f.dot;
			}
			if (!(yield* user.drop_item())) {
				to_chat(user, fmt("<span class='warning'>＄！ is stuck to your hand, you cannot put it in the cistern!</span>", [I]));
				return f.dot;
			}
			I.loc = this;
			this.w_items += I.w_class;
			to_chat(user, `<span class='notice'>You carefully place ${I} into the cistern.</span>`);
		}
	} else if (rt.istype(I, T("/obj/item/weapon/reagent_containers"))) {
		if (!this.open) {
			return f.dot;
		}
		yield* (RG = I).reagents.add_reagent("water", min(RG.volume - RG.reagents.total_volume, RG.amount_per_transfer_from_this));
		to_chat(user, `<span class='notice'>You fill ${RG} from ${this}. Gross.</span>`);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(12891, "/obj/structure/toilet/secret", "/obj/structure/toilet", {
	secret: null,
	secret_type: null,
});

// watercloset.dm:112
rt.def("/obj/structure/toilet/secret/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	if (!this.secret_type) return f.dot;
	this.secret = (yield* new_(this.secret_type, this));
	this.secret.desc += " It's a secret!";
	this.w_items += this.secret.w_class;
	this.contents += this.secret;
	return f.dot;
}, true);

rt.type(12892, "/obj/structure/urinal", "/obj/structure", {
	exposed: 0,
	hiddenitem: null,
	anchored: 1,
	name: "urinal",
	desc: "The HU-452, an experimental urinal. Comes complete with experimental urinal cake.",
	icon: rt.rsc("icons/obj/watercloset.dmi"),
	icon_state: "urinal",
	density: 0,
});

// watercloset.dm:133
rt.def("/obj/structure/urinal/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.hiddenitem = (yield* new_(T("/obj/item/weapon/reagent_containers/food/urinalcake")));
	return f.dot;
}, true);

// watercloset.dm:137
rt.def("/obj/structure/urinal/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let GM: Value = null;
	if (user.pulling && user.a_intent == "grab" && rt.istype(user.pulling, T("/mob/living"))) {
		GM = user.pulling;
		if (user.grab_state >= 1) {
			if (GM.loc != rt.getStep(f, this, 0)) {
				to_chat(user, `<span class='notice'>${GM.name} needs to be on ${this}.</span>`);
				return f.dot;
			}
			user.changeNext_move(8);
			user.visible_message(`<span class='danger'>${user} slams ${GM} into ${this}!</span>`, `<span class='danger'>You slam ${GM} into ${this}!</span>`);
			yield* GM.adjustBruteLoss(8);
		} else {
			to_chat(user, "<span class='warning'>You need a tighter grip!</span>");
		}
	} else if (this.exposed) {
		if (!this.hiddenitem) {
			to_chat(user, "<span class='notice'>There is nothing in the drain holder.</span>");
		} else {
			if (rt.istype(user, T("/mob/living/carbon/human"))) {
				yield* user.put_in_hands(this.hiddenitem);
			} else {
				yield* this.hiddenitem.forceMove(rt.getStep(f, this, 0));
			}
			to_chat(user, `<span class='notice'>You fish ${this.hiddenitem} out of the drain enclosure.</span>`);
			this.hiddenitem = null;
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// watercloset.dm:163
rt.def("/obj/structure/urinal/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let $0: any, $1: any, $2: any;
	if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		$0 = user;
		if (this.exposed) {
			$1 = "screw the cap back into place";
		} else {
			$1 = "unscrew the cap to the drain protector";
		}
		to_chat($0, `<span class='notice'>You start to ${$1}...</span>`);
		playsound(this.loc, rt.rsc("sound/effects/stonedoor_openclose.ogg"), 50, 1);
		if (yield* do_after(user, 20 * I.toolspeed, { target: this })) {
			$0 = user;
			$1 = user;
			if (this.exposed) {

				$2 = "screws the cap back into place";
			} else {
				$2 = "unscrew the cap to the drain protector";
			}
			$1 = `${$1} ${$2}!`;
			if (this.exposed) {
				$2 = "screw the cap back into place";
			} else {
				$2 = "unscrew the cap on the drain";
			}
			$0.visible_message($1, `<span class='notice'>You ${$2}!</span>`, "<span class='italics'>You hear metal and squishing noises.</span>");
			this.exposed = (!this.exposed ? 1 : 0);
		}
	} else {
		if (!this.exposed) return f.dot;
		if (this.hiddenitem) {
			to_chat(user, "<span class='warning'>There is already something in the drain enclosure.</span>");
			return f.dot;
		}
		if (I.w_class > 1) {
			to_chat(user, `<span class='warning'>${I} is too large for the drain enclosure.</span>`);
			return f.dot;
		}
		if (!(yield* user.drop_item())) {
			to_chat(user, "<span class='warning'>[I] is stuck to your hand, you cannot put it in the drain enclosure!</span>");
			return f.dot;
		}
		yield* I.forceMove(this);
		this.hiddenitem = I;
		to_chat(user, `<span class='notice'>You place ${I} into the drain enclosure.</span>`);
	}
	return f.dot;
}, true);

rt.type(5869, "/obj/item/weapon/reagent_containers/food/urinalcake", "/obj/item/weapon/reagent_containers/food", {
	name: "urinal cake",
	desc: "The noble urinal cake, protecting the station's pipes from the station's pee. Do not eat.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "urinalcake",
	w_class: 1,
	list_reagents: null,
});

// watercloset.dm:190
rt.def("/obj/item/weapon/reagent_containers/food/urinalcake/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["chlorine", 3, "ammonia", 1]);
	return f.dot;
});

rt.type(10879, "/obj/machinery/shower", "/obj/machinery", {
	on: 0,
	mymist: null,
	ismist: 0,
	watertemp: "normal",
	anchored: 1,
	use_power: 0,
	name: "shower",
	desc: "The HS-451. Installed in the 2550s by the Nanotrasen Hygiene Division.",
	icon: rt.rsc("icons/obj/watercloset.dmi"),
	icon_state: "shower",
	density: 0,
});

// watercloset.dm:216
rt.def("/obj/machinery/shower/proc/attack_hand", function* attack_hand(f: Frame, M: Value) {
	let G: Value = null, L: Value = null, tile: Value = null;
	this.on = (!this.on ? 1 : 0);
	yield* this.update_icon();
	yield* this.add_fingerprint(M);
	if (this.on) {
		yield* this.wash_turf();
		for (G of each(this.loc, T("/atom/movable"))) {
			if (rt.istype(G, T("/mob/living"))) {
				yield* this.wash_mob((L = G));
			} else {
				this.wash_obj(G);
			}
		}
	} else {
		if (!rt.istype(this.loc, T("/turf/open"))) return f.dot;
		yield* (tile = this.loc).MakeSlippery({ min_wet_time: 5, wet_time_to_add: 1 });
	}
	return f.dot;
}, true);

// watercloset.dm:234
rt.def("/obj/machinery/shower/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (I.type == T("/obj/item/device/analyzer")) {
		to_chat(user, `<span class='notice'>The water temperature seems to be ${this.watertemp}.</span>`);
	}
	if (!rt.istype(I, T("/obj/item/weapon/wrench"))) return f.dot;
	to_chat(user, fmt("<span class='notice'>You begin to adjust the temperature valve with ％！...</span>", [I]));
	if (!(yield* do_after(user, 50 * I.toolspeed, { target: this }))) return f.dot;
	if (this.watertemp === "normal") {
		this.watertemp = "freezing";
	} else if (this.watertemp === "freezing") {
		this.watertemp = "boiling";
	} else if (this.watertemp === "boiling") {
		this.watertemp = "normal";
	}
	user.visible_message(fmt("<span class='notice'>＀ adjusts the shower with ％！.</span>", [user, I]), fmt("<span class='notice'>You adjust the shower with ％！ to ＀ temperature.</span>", [I, this.watertemp]));
	log_game(`${key_name(user)} has wrenched a shower to ${this.watertemp} at (${this.x},${this.y},${this.z})`);
	this.add_hiddenprint(user);
	return f.dot;
}, true);

// watercloset.dm:252
rt.def("/obj/machinery/shower/proc/update_icon", function* update_icon(f: Frame) {
	this.cut_overlays();
	if (this.mymist) {
		yield* qdel(this.mymist);
	}
	if (this.on) {
		this.add_overlay(mutable_appearance(rt.rsc("icons/obj/watercloset.dmi"), "water", ABOVE_MOB_LAYER));
		if (this.watertemp == "freezing") {
			return f.dot;
		}
		if (!this.ismist) {
			rt.spawnTail(f, 50, "/obj/machinery/shower/proc/update_icon: spawn at game/objects/structures/watercloset.dm:261");
		} else {
			this.ismist = 1;
			this.mymist = (yield* new_(T("/obj/effect/mist"), this.loc));
		}
	} else {
		if (!this.ismist) return f.dot;
		this.ismist = 1;
		this.mymist = (yield* new_(T("/obj/effect/mist"), this.loc));
		rt.spawnTail(f, 250, "/obj/machinery/shower/proc/update_icon: spawn at game/objects/structures/watercloset.dm:271");
	}
	return f.dot;
}, true);

// a spawn(250) body of /obj/machinery/shower/proc/update_icon, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/shower/proc/update_icon: spawn at game/objects/structures/watercloset.dm:271", function* (f: Frame) {
	if (!this.on && this.mymist) {
		yield* qdel(this.mymist);
		this.ismist = 0;
	}
	return null;
});

// a spawn(50) body of /obj/machinery/shower/proc/update_icon, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/shower/proc/update_icon: spawn at game/objects/structures/watercloset.dm:261", function* (f: Frame) {
	if (this && this.on) {
		this.ismist = 1;
		this.mymist = (yield* new_(T("/obj/effect/mist"), this.loc));
	}
	return null;
});

// watercloset.dm:278
rt.def("/obj/machinery/shower/proc/Crossed", function* Crossed(f: Frame, O: Value) {
	let L: Value = null, C: Value = null;
	yield* parent_proc();
	if (!this.on) return f.dot;
	if (rt.istype(O, T("/mob/living"))) {
		if (yield* this.wash_mob((L = O))) {
			yield* (C = L).slip(80, null, NO_SLIP_WHEN_WALKING);
		}
	} else {
		this.wash_obj(O);
	}
	return f.dot;
}, true);

// watercloset.dm:290
rt.def("/obj/machinery/shower/proc/wash_obj", function wash_obj(f: Frame, O: Value) {
	let I: Value = null;
	O.clean_blood();
	if (!rt.istype(O, T("/obj/item"))) return f.dot;
	(I = O).acid_level = 0;
	I.extinguish();
	return f.dot;
});

// watercloset.dm:299
rt.def("/obj/machinery/shower/proc/wash_turf", function* wash_turf(f: Frame) {
	let E: Value = null;
	if (!isturf(this.loc)) return f.dot;
	let tile: Value = this.loc;
	this.loc.clean_blood();
	for (E of each(tile, T("/obj/effect"))) {
		if (rt.istype(E, T("/obj/effect/decal/cleanable")) || rt.istype(E, T("/obj/effect/rune"))) {
			yield* qdel(E);
		}
	}
	return f.dot;
}, true);

// watercloset.dm:308
rt.def("/obj/machinery/shower/proc/wash_mob", function* wash_mob(f: Frame, L: Value) {
	let M: Value = null, I: Value = null, H: Value = null, washgloves: Value = null, washshoes: Value = null, washmask: Value = null, washears: Value = null, washglasses: Value = null;
	L.wash_cream();
	yield* L.ExtinguishMob();
	yield* L.adjust_fire_stacks(-20);
	if (rt.istype(L, T("/mob/living/carbon"))) {
		M = L;
		f.dot = 1;
		yield* this.check_heat(M);
		for (I of each(M.held_items, T("/obj/item"))) {
			I.clean_blood();
		}
		if (M.back) {
			if (M.back.clean_blood()) {
				M.update_inv_back(0);
			}
		}
		if (rt.istype(M, T("/mob/living/carbon/human"))) {
			H = M;
			washgloves = 1;
			washshoes = 1;
			washmask = 1;
			washears = 1;
			washglasses = 1;
			if (H.wear_suit) {
				washgloves = (!rt.bitAnd(H.wear_suit.flags_inv, 1) ? 1 : 0);
				washshoes = (!rt.bitAnd(H.wear_suit.flags_inv, HIDESHOES) ? 1 : 0);
			}
			if (H.head) {
				washmask = (!rt.bitAnd(H.head.flags_inv, HIDEMASK) ? 1 : 0);
				washglasses = (!rt.bitAnd(H.head.flags_inv, HIDEEYES) ? 1 : 0);
				washears = (!rt.bitAnd(H.head.flags_inv, HIDEEARS) ? 1 : 0);
			}
			if (H.wear_mask) {
				if (washears) {
					washears = (!rt.bitAnd(H.wear_mask.flags_inv, HIDEEARS) ? 1 : 0);
				}
				if (washglasses) {
					washglasses = (!rt.bitAnd(H.wear_mask.flags_inv, HIDEEYES) ? 1 : 0);
				}
			}
			if (H.head) {
				if (H.head.clean_blood()) {
					yield* H.update_inv_head();
				}
			}
			if (H.wear_suit) {
				if (H.wear_suit.clean_blood()) {
					yield* H.update_inv_wear_suit();
				}
			} else if (H.w_uniform) {
				if (H.w_uniform.clean_blood()) {
					yield* H.update_inv_w_uniform();
				}
			}
			if (washgloves) {
				H.clean_blood();
			}
			if (H.shoes && washshoes) {
				if (H.shoes.clean_blood()) {
					H.update_inv_shoes();
				}
			}
			if (H.wear_mask) {
				if (washmask) {
					if (H.wear_mask.clean_blood()) {
						yield* H.update_inv_wear_mask();
					}
				}
			} else {
				H.lip_style = null;
				yield* H.update_body();
			}
			if (H.glasses && washglasses) {
				if (H.glasses.clean_blood()) {
					H.update_inv_glasses();
				}
			}
			if (H.ears && washears) {
				if (H.ears.clean_blood()) {
					H.update_inv_ears();
				}
			}
			if (H.belt) {
				if (H.belt.clean_blood()) {
					H.update_inv_belt();
				}
			}
		} else {
			if (M.wear_mask) {
				if (M.wear_mask.clean_blood()) {
					yield* M.update_inv_wear_mask(0);
				}
			}
			M.clean_blood();
		}
	} else {
		L.clean_blood();
	}
	return f.dot;
}, true);

// watercloset.dm:384
rt.def("/obj/machinery/shower/proc/process", function* process(f: Frame) {
	let G: Value = null, L: Value = null;
	if (!this.on) return f.dot;
	yield* this.wash_turf();
	for (G of each(this.loc, T("/atom/movable"))) {
		if (rt.istype(G, T("/mob/living"))) {
			yield* this.wash_mob((L = G));
		} else {
			this.wash_obj(G);
		}
	}
	return f.dot;
}, true, { waitfor: false });

// watercloset.dm:393
rt.def("/obj/machinery/shower/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 3);
	yield* qdel(this);
	return f.dot;
}, true);

// watercloset.dm:397
rt.def("/obj/machinery/shower/proc/check_heat", function* check_heat(f: Frame, C: Value) {
	if (this.watertemp == "freezing") {
		C.bodytemperature = max(80, C.bodytemperature - 80);
		to_chat(C, "<span class='warning'>The water is freezing!</span>");
	} else {
		if (this.watertemp != "boiling") return f.dot;
		C.bodytemperature = min(500, C.bodytemperature + 35);
		yield* C.adjustFireLoss(5);
		to_chat(C, "<span class='danger'>The water is searing!</span>");
	}
	return f.dot;
}, true);

rt.type(12893, "/obj/structure/sink", "/obj/structure", {
	busy: 0,
	dispensedreagent: "water",
	anchored: 1,
	name: "sink",
	icon: rt.rsc("icons/obj/watercloset.dmi"),
	icon_state: "sink",
	desc: "A sink used for washing one's hands and face.",
});

// watercloset.dm:428
rt.def("/obj/structure/sink/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let H: Value = null;
	let $2: any;
	if (!user || !rt.istype(user, T("/mob/living"))) {
		return f.dot;
	}
	if (!rt.istype(user, T("/mob/living/carbon"))) {
		return f.dot;
	}
	if (!this.Adjacent(user)) {
		return f.dot;
	}
	if (this.busy) {
		to_chat(user, "<span class='notice'>Someone's already washing here.</span>");
		return f.dot;
	}
	let selected_area: Value = parse_zone(user.zone_selected);
	let washing_face: Value = 0;
	if (rt.isIn(f, selected_area, list("head", "mouth", "eyes"))) {
		washing_face = 1;
	}
	let $0: any = user;
	let $1: any = user;
	if (washing_face) {

		$2 = "face";
	} else {
		$2 = "hands";
	}
	$1 = `<span class='notice'>${$1} starts washing their ${$2}...</span>`;
	if (washing_face) {
		$2 = "face";
	} else {
		$2 = "hands";
	}
	$0.visible_message($1, `<span class='notice'>You start washing your ${$2}...</span>`);
	this.busy = 1;
	if (!(yield* do_after(user, 40, { target: this }))) {
		this.busy = 0;
		return f.dot;
	}
	this.busy = 0;
	$0 = user;
	$1 = user;
	if (washing_face) {

		$2 = "face";
	} else {
		$2 = "hands";
	}
	$1 = `<span class='notice'>${$1} washes their ${$2} using ${this}.</span>`;
	$0.visible_message($1, `<span class='notice'>You wash your ${washing_face ? "face" : "hands"} using ${this}.</span>`);
	if (washing_face) {
		if (rt.istype(user, T("/mob/living/carbon/human"))) {
			(H = user).lip_style = null;
			H.lip_color = rt.initial(f, H, "lip_color");
			H.wash_cream();
			yield* H.regenerate_icons();
		}
		user.drowsyness = max(user.drowsyness - rand(2, 3), 0);
	} else {
		user.clean_blood();
	}
	return f.dot;
}, true);

// watercloset.dm:468
rt.def("/obj/structure/sink/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let RG: Value = null, B: Value = null, stunforce: Value = null, G: Value = null;
	if (this.busy) {
		to_chat(user, "<span class='warning'>Someone's already washing here!</span>");
		return f.dot;
	}
	if (rt.istype(O, T("/obj/item/weapon/reagent_containers"))) {
		if (rt.bitAnd((RG = O).container_type, 4096)) {
			if (!RG.reagents.holder_full()) {
				yield* RG.reagents.add_reagent(`${this.dispensedreagent}`, min(RG.volume - RG.reagents.total_volume, RG.amount_per_transfer_from_this));
				to_chat(user, `<span class='notice'>You fill ${RG} from ${this}.</span>`);
				return 1;
			}
			to_chat(user, fmt("<span class='notice'>＄！ is full.</span>", [RG]));
			return 0;
		}
	}
	if (rt.istype(O, T("/obj/item/weapon/melee/baton"))) {
		if ((B = O).cell) {
			if (B.cell.charge > 0 && B.status == 1) {
				flick("baton_active", this);
				stunforce = B.stunforce;
				yield* user.Knockdown(stunforce);
				user.stuttering = stunforce;
				yield* B.deductcharge(B.hitcost);
				user.visible_message(`<span class='warning'>${user} shocks themself while attempting to wash the active ${B.name}!</span>`, `<span class='userdanger'>You unwisely attempt to wash ${B} while it's still on.</span>`);
				playsound(this, "sparks", 50, 1);
				return f.dot;
			}
		}
	}
	if (rt.istype(O, T("/obj/item/weapon/mop"))) {
		yield* O.reagents.add_reagent(`${this.dispensedreagent}`, 5);
		to_chat(user, `<span class='notice'>You wet ${O} in ${this}.</span>`);
		playsound(this.loc, rt.rsc("sound/effects/slosh.ogg"), 25, 1);
		return f.dot;
	}
	if (rt.istype(O, T("/obj/item/stack/medical/gauze"))) {
		G = O;
		yield* new_(T("/obj/item/weapon/reagent_containers/glass/rag"), this.loc);
		to_chat(user, "<span class='notice'>You tear off a strip of gauze and make a rag.</span>");
		yield* G.use(1);
		return f.dot;
	}
	if (!rt.istype(O, T("/obj/item"))) {
		return f.dot;
	}
	if (rt.bitAnd(O.flags, 128)) {
		return f.dot;
	}
	if (user.a_intent != "harm") {
		to_chat(user, `<span class='notice'>You start washing ${O}...</span>`);
		this.busy = 1;
		if (!(yield* do_after(user, 40, { target: this }))) {
			this.busy = 0;
			return 1;
		}
		this.busy = 0;
		O.clean_blood();
		O.acid_level = 0;
		yield* this.create_reagents(5);
		yield* this.reagents.add_reagent(`${this.dispensedreagent}`, 5);
		yield* this.reagents.reaction(O, 1);
		user.visible_message(`<span class='notice'>${user} washes ${O} using ${this}.</span>`, `<span class='notice'>You wash ${O} using ${this}.</span>`);
		return 1;
	} else {
		return (yield* parent_proc());
	}
}, true);

// watercloset.dm:532
rt.def("/obj/structure/sink/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 3);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12895, "/obj/structure/sink/puddle", "/obj/structure/sink", {
	name: "puddle",
	desc: "A puddle used for washing one's hands and face.",
	icon_state: "puddle",
});

// watercloset.dm:548
rt.def("/obj/structure/sink/puddle/proc/attack_hand", function* attack_hand(f: Frame, M: Value) {
	this.icon_state = "puddle-splash";
	yield* parent_proc();
	this.icon_state = "puddle";
	return f.dot;
}, true);

// watercloset.dm:553
rt.def("/obj/structure/sink/puddle/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	this.icon_state = "puddle-splash";
	f.dot = (yield* parent_proc());
	this.icon_state = "puddle";
	return f.dot;
}, true);

rt.type(12896, "/obj/structure/curtain", "/obj/structure", {
	open: 1,
	anchored: 1,
	name: "curtain",
	desc: "Contains less than 1% mercury.",
	icon: rt.rsc("icons/obj/watercloset.dmi"),
	icon_state: "open",
	color: "#ACD1E9",
	alpha: 200,
	layer: 3.4,
	opacity: 0,
	density: 0,
});

// watercloset.dm:576
rt.def("/obj/structure/curtain/proc/toggle", function toggle(f: Frame) {
	this.open = (!this.open ? 1 : 0);
	this.update_icon();
	return f.dot;
});

// watercloset.dm:580
rt.def("/obj/structure/curtain/proc/update_icon", function update_icon(f: Frame) {
	if (!this.open) {
		this.icon_state = "closed";
		this.layer = WALL_OBJ_LAYER;
		this.density = 1;
		this.open = 0;
	} else {
		this.icon_state = "open";
		this.layer = SIGN_LAYER;
		this.density = 0;
		this.open = 1;
	}
	return f.dot;
});

// watercloset.dm:593
rt.def("/obj/structure/curtain/proc/attackby", function* attackby(f: Frame, W: Value, user: Value) {
	if (rt.istype(W, T("/obj/item/toy/crayon"))) {
		this.color = (yield* g.op(f, "Prompt", [256], [null, null, "Choose Color", user, null]));
	} else if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		if (this.anchored) {
			playsound(this.loc, W.usesound, 100, 1);
			user.visible_message(`<span class='warning'>${user} unscrews ${this} from the floor.</span>`, `<span class='notice'>You start to unscrew ${this} from the floor...</span>`, "You hear rustling noises.");
			if (yield* do_after(user, 50 * W.toolspeed, { target: this })) {
				if (!this.anchored) {
					return f.dot;
				}
				this.anchored = 0;
				to_chat(user, `<span class='notice'>You unscrew ${this} from the floor.</span>`);
			}
		} else {
			playsound(this.loc, W.usesound, 100, 1);
			user.visible_message(`<span class='warning'>${user} screws ${this} to the floor.</span>`, `<span class='notice'>You start to screw ${this} to the floor...</span>`, "You hear rustling noises.");
			if (yield* do_after(user, 50 * W.toolspeed, { target: this })) {
				if (this.anchored) {
					return f.dot;
				}
				this.anchored = 1;
				to_chat(user, `<span class='notice'>You screw ${this} to the floor.</span>`);
			}
		}
	} else if (rt.istype(W, T("/obj/item/weapon/wirecutters"))) {
		if (!this.anchored) {
			playsound(this.loc, W.usesound, 100, 1);
			user.visible_message(`<span class='warning'>${user} cuts apart ${this}.</span>`, `<span class='notice'>You start to cut apart ${this}.</span>`, "You hear cutting.");
			if (yield* do_after(user, 50 * W.toolspeed, { target: this })) {
				if (this.anchored) {
					return f.dot;
				}
				to_chat(user, `<span class='notice'>You cut apart ${this}.</span>`);
				yield* this.deconstruct();
			}
		}
	} else {
		f.dot = (yield* parent_proc());
	}
	return f.dot;
}, true);

// watercloset.dm:626
rt.def("/obj/structure/curtain/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	playsound(this.loc, rt.rsc("sound/effects/curtain.ogg"), 50, 1);
	yield* this.toggle();
	yield* parent_proc();
	return f.dot;
}, true);

// watercloset.dm:631
rt.def("/obj/structure/curtain/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	yield* new_(T("/obj/item/stack/sheet/cloth"), this.loc, 2);
	yield* new_(T("/obj/item/stack/sheet/plastic"), this.loc, 2);
	yield* new_(T("/obj/item/stack/rods"), this.loc, 1);
	yield* qdel(this);
	return f.dot;
}, true);

// watercloset.dm:637
rt.def("/obj/structure/curtain/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		if (damage_amount) {
			playsound(this.loc, rt.rsc("sound/weapons/slash.ogg"), 80, 1);
		} else {
			playsound(this.loc, rt.rsc("sound/weapons/tap.ogg"), 50, 1);
		}
	} else if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 80, 1);
	}
	return f.dot;
});
