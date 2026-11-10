// Based on /tg/station's code/modules/hydroponics/beekeeping/beebox.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// beebox.dm:19
rt.def("/mob/living/carbon/human/proc/bee_friendly", function bee_friendly(f: Frame) {
	if (this.dna && this.dna.species && this.dna.species.id == "pod") {
		return 1;
	}
	if (this.wear_suit && rt.bitAnd(this.wear_suit.flags, THICKMATERIAL) && this.head && rt.bitAnd(this.head.flags, THICKMATERIAL)) {
		return 1;
	}
	return 0;
});

rt.type(12938, "/obj/structure/beebox", "/obj/structure", {
	queen_bee: null,
	bees: null,
	honeycombs: null,
	honey_frames: null,
	bee_resources: 0,
	anchored: 1,
	name: "apiary",
	desc: "Dr Miles Manners is just your average wasp-themed super hero by day, but by night he becomes DR BEES!",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "beebox",
	density: 1,
});

// beebox.dm:34
rt.def("/obj/structure/beebox/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bees = list();

	this.honeycombs = list();

	this.honey_frames = list();
	return f.dot;
});

// beebox.dm:41
rt.def("/obj/structure/beebox/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// beebox.dm:46
rt.def("/obj/structure/beebox/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	this.bees.Cut();
	this.bees = null;
	this.honeycombs.Cut();
	this.honeycombs = null;
	this.queen_bee = null;
	return (yield* parent_proc());
}, true);

rt.type(12939, "/obj/structure/beebox/premade", "/obj/structure/beebox", {
	random_reagent: 0,
});

// beebox.dm:61
rt.def("/obj/structure/beebox/premade/proc/New", function* New(f: Frame) {
	let R: Value = null, i: Value = null, HF: Value = null, B: Value = null;
	let $e: any;
	yield* parent_proc();
	if (this.random_reagent) {
		R = pick(typesof(T("/datum/reagent")) - T("/datum/reagent"));
		R = rt.index(GLOB.chemical_reagents_list, rt.initial(f, R, "id"));
	}
	this.queen_bee = (yield* new_(T("/mob/living/simple_animal/hostile/poison/bees/queen"), this));
	this.queen_bee.beehome = this;
	this.bees += this.queen_bee;
	this.queen_bee.assign_reagent(R);
	rt.forRange(f, 0, 1, BEEBOX_MAX_FRAMES, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		this.honey_frames += (HF = (yield* new_(T("/obj/item/honey_frame"), this)));
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, this.get_max_bees(), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		this.bees += (B = (yield* new_(T("/mob/living/simple_animal/hostile/poison/bees"), this)));
		B.beehome = this;
		B.assign_reagent(R);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// beebox.dm:90
rt.def("/obj/structure/beebox/proc/process", function* process(f: Frame) {
	let HC: Value = null, B: Value = null;
	if (!this.queen_bee) return f.dot;
	if (this.bee_resources >= BEE_RESOURCE_HONEYCOMB_COST) {
		if (rt.len(f, this.honeycombs) < this.get_max_honeycomb()) {
			this.bee_resources = max(this.bee_resources - BEE_RESOURCE_HONEYCOMB_COST, 0);
			HC = (yield* new_(T("/obj/item/weapon/reagent_containers/honeycomb"), this));
			if (this.queen_bee.beegent) {
				yield* HC.set_reagent(this.queen_bee.beegent.id);
			}
			this.honeycombs += HC;
		}
	}
	if (!(rt.len(f, this.bees) < this.get_max_bees())) return f.dot;
	let freebee: Value = 0;
	if (rt.len(f, this.bees) <= 1) {
		freebee = 1;
	}
	if (!(this.bee_resources >= BEE_RESOURCE_NEW_BEE_COST && prob(BEE_PROB_NEW_BEE) || freebee)) return f.dot;
	if (!freebee) {
		this.bee_resources = max(this.bee_resources - BEE_RESOURCE_NEW_BEE_COST, 0);
	}
	(B = (yield* new_(T("/mob/living/simple_animal/hostile/poison/bees"), this))).beehome = this;
	B.assign_reagent(this.queen_bee.beegent);
	this.bees += B;
	return f.dot;
}, true, { waitfor: false });

// beebox.dm:113
rt.def("/obj/structure/beebox/proc/get_max_honeycomb", function get_max_honeycomb(f: Frame) {
	let hf: Value = null, HF: Value = null;
	f.dot = 0;
	for (hf of each(this.honey_frames)) {
		f.dot += (HF = hf).honeycomb_capacity;
	}
	return f.dot;
});

// beebox.dm:119
rt.def("/obj/structure/beebox/proc/get_max_bees", function get_max_bees(f: Frame) {
	f.dot = this.get_max_honeycomb() * BEES_RATIO;
	return f.dot;
});

// beebox.dm:123
rt.def("/obj/structure/beebox/proc/examine", function examine(f: Frame, user: Value) {
	let half_bee: Value = null, plural: Value = null;
	let $0: any, $1: any;
	parent_proc();
	if (!this.queen_bee) {
		to_chat(user, "<span class='warning'>There is no queen bee! There won't bee any honeycomb without a queen!</span>");
	}
	if ((half_bee = this.get_max_bees() * 0.5) && rt.len(f, this.bees) >= half_bee) {
		to_chat(user, "<span class='notice'>This place is aBUZZ with activity... there are lots of bees!</span>");
	}
	to_chat(user, `<span class='notice'>${this.bee_resources}/100 resource supply.</span>`);
	to_chat(user, `<span class='notice'>${this.bee_resources}% towards a new honeycomb.</span>`);
	to_chat(user, `<span class='notice'>${this.bee_resources * 2}% towards a new bee.</span>`);
	if (rt.len(f, this.honeycombs)) {
		plural = (rt.len(f, this.honeycombs) > 1 ? 1 : 0);
		$0 = user;
		if (plural) {
			$1 = "are";
		} else {
			$1 = "is";
		}
		to_chat($0, `<span class='notice'>There ${$1} ${rt.len(f, this.honeycombs)} uncollected honeycomb${plural ? "s" : ""} in the apiary.</span>`);
	}
	if (!(rt.len(f, this.honeycombs) >= this.get_max_honeycomb())) return f.dot;
	to_chat(user, "<span class='warning'>there's no room for more honeycomb!</span>");
	return f.dot;
}, false);

// beebox.dm:145
rt.def("/obj/structure/beebox/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let HF: Value = null, relocated: Value = null, b: Value = null, B: Value = null;
	if (rt.istype(I, T("/obj/item/honey_frame"))) {
		HF = I;
		if (rt.len(f, this.honey_frames) < BEEBOX_MAX_FRAMES) {
			this.visible_message(`<span class='notice'>${user} adds a frame to the apiary.</span>`);
			if (!(yield* user.transferItemToLoc(HF, this))) {
				return f.dot;
			}
			this.honey_frames += HF;
		} else {
			to_chat(user, "<span class='warning'>There's no room for any more frames in the apiary!</span>");
		}
	}
	if (rt.istype(I, T("/obj/item/weapon/wrench"))) {
		if (yield* this.default_unfasten_wrench(user, I, { time: 20 })) {
			return f.dot;
		}
	}
	if (!rt.istype(I, T("/obj/item/queen_bee"))) return f.dot;
	if (this.queen_bee) {
		to_chat(user, "<span class='warning'>This hive already has a queen!</span>");
		return f.dot;
	}
	let qb: Value = I;
	yield* user.temporarilyRemoveItemFromInventory(qb);
	yield* qb.queen.forceMove(this);
	this.bees += qb.queen;
	this.queen_bee = qb.queen;
	qb.queen = null;
	if (this.queen_bee) {
		this.visible_message(`<span class='notice'>${user} sets ${qb} down inside the apiary, making it their new home.</span>`);
		relocated = 0;
		for (b of each(this.bees)) {
			if ((B = b).reagent_incompatible(this.queen_bee)) {
				this.bees -= B;
				B.beehome = null;
				if (B.loc == this) {
					B.loc = rt.getStep(f, this, 0);
				}
				relocated++;
			}
		}
		if (relocated) {
			to_chat(user, "<span class='warning'>This queen has a different reagent to some of the bees who live here, those bees will not return to this apiary!</span>");
		}
	} else {
		to_chat(user, "<span class='warning'>The queen bee disappeared! Disappearing bees have been in the news lately...</span>");
	}
	yield* qdel(qb);
	return f.dot;
}, true);

// beebox.dm:193
rt.def("/obj/structure/beebox/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let bees: Value = null, b: Value = null, B: Value = null, option: Value = null, HF: Value = null, amtH: Value = null, fallen: Value = null, HC: Value = null, multiple: Value = null, QB: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	if (!user.bee_friendly()) {
		bees = 0;
		for (b of each(bees)) {
			if ((B = b).isqueen) {
				continue;
			}
			if (B.loc == this) {
				B.loc = rt.getStep(f, this, 0);
			}
			B.target = user;
			bees = 1;
		}
		if (bees) {
			this.visible_message(`<span class='danger'>${user} disturbs the bees!</span>`);
		}
	} else {
		option = (yield* alert(user, "What action do you wish to perform?", "Apiary", "Remove a Honey Frame", "Remove the Queen Bee"));
		if (!this.Adjacent(user)) {
			return f.dot;
		}
		if (option === "Remove a Honey Frame") {
			if (!rt.len(f, this.honey_frames)) {
				to_chat(user, "<span class='warning'>There are no honey frames to remove!</span>");
				return f.dot;
			}
			if (HF = pick_n_take(this.honey_frames)) {
				if (!(yield* user.put_in_active_hand(HF))) {
					HF.loc = rt.getStep(f, this, 0);
				}
				this.visible_message(`<span class='notice'>${user} removes a frame from the apiary.</span>`);
				amtH = HF.honeycomb_capacity;
				fallen = 0;
				while (rt.len(f, this.honeycombs) && amtH) {
					if (HC = pick_n_take(this.honeycombs)) {
						HC.loc = rt.getStep(f, user, 0);
						amtH--;
						fallen++;
					}
				}
				if (fallen) {
					multiple = (fallen > 1 ? 1 : 0);
					$0 = user;
					if (multiple) {
						$1 = `${fallen}`;
					} else {
						$1 = "a";
					}
					if (multiple) {
						$2 = "s";
					} else {
						$2 = "";
					}
					this.visible_message(`<span class='notice'>${$0} scrapes ${$1} honeycomb${$2} off of the frame.</span>`);
				}
			}
		} else if (option === "Remove the Queen Bee") {
			if (!this.queen_bee || this.queen_bee.loc != this) {
				to_chat(user, "<span class='warning'>There is no queen bee to remove!</span>");
				return f.dot;
			}
			QB = (yield* new_(T("/obj/item/queen_bee")));
			this.queen_bee.loc = QB;
			this.bees -= this.queen_bee;
			QB.queen = this.queen_bee;
			QB.name = this.queen_bee.name;
			if (!(yield* user.put_in_active_hand(QB))) {
				QB.loc = rt.getStep(f, this, 0);
			}
			this.visible_message(`<span class='notice'>${user} removes the queen from the apiary.</span>`);
			this.queen_bee = null;
		}
	}
	return f.dot;
}, true);
