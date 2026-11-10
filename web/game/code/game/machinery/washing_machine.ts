// Based on /tg/station's code/game/machinery/washing_machine.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10856, "/obj/machinery/washing_machine", "/obj/machinery", {
	busy: 0,
	bloody_mess: 0,
	has_corgi: 0,
	color_source: null,
	max_wash_capacity: 5,
	anchored: 1,
	state_open: 1,
	name: "washing machine",
	desc: "Gets rid of those pesky bloodstains, or your money back!",
	icon: rt.rsc("icons/obj/machines/washing_machine.dmi"),
	icon_state: "wm_1_0",
	density: 1,
});

// washing_machine.dm:16
rt.def("/obj/machinery/washing_machine/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, "<span class='notice'>Alt-click it to start a wash cycle.</span>");
	return f.dot;
}, false);

// washing_machine.dm:20
rt.def("/obj/machinery/washing_machine/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	if (!user.canUseTopic(this)) {
		return f.dot;
	}
	if (this.busy) {
		return f.dot;
	}
	if (this.state_open) {
		to_chat(user, "<span class='notice'>Close the door first</span>");
		return f.dot;
	}
	if (this.bloody_mess) {
		to_chat(user, `<span class='warning'>${this} must be cleaned up first.</span>`);
		return f.dot;
	}
	if (this.has_corgi) {
		this.bloody_mess = 1;
	}
	this.busy = 1;
	yield* this.update_icon();
	yield* sleep(200);
	yield* this.wash_cycle();
	return f.dot;
}, true);

// washing_machine.dm:43
rt.def("/obj/machinery/washing_machine/proc/clean_blood", function clean_blood(f: Frame) {
	parent_proc();
	if (this.busy) return f.dot;
	this.bloody_mess = 0;
	this.update_icon();
	return f.dot;
});

// washing_machine.dm:50
rt.def("/obj/machinery/washing_machine/proc/wash_cycle", function* wash_cycle(f: Frame) {
	let X: Value = null, AM: Value = null;
	for (X of each(this.contents)) {
		(AM = X).clean_blood();
		yield* AM.machine_wash(this);
	}
	this.busy = 0;
	if (this.color_source) {
		yield* qdel(this.color_source);
		this.color_source = null;
	}
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(9020, "/obj/item/stack/sheet/hairlesshide", "/obj/item/stack/sheet", {
	name: "hairless hide",
	desc: "This hide was stripped of its hair, but still needs washing and tanning.",
	singular_name: "hairless hide piece",
	icon_state: "sheet-hairlesshide",
	origin_tech: null,
});

// washing_machine.dm:67
rt.def("/obj/item/stack/sheet/hairlesshide/proc/machine_wash", function* machine_wash(f: Frame, WM: Value) {
	let WL: Value = null;
	(WL = (yield* new_(T("/obj/item/stack/sheet/wetleather"), this.loc))).amount = this.amount;
	yield* qdel(this);
	return f.dot;
}, true);

// washing_machine.dm:72
rt.def("/obj/item/clothing/suit/hooded/ian_costume/proc/machine_wash", function* machine_wash(f: Frame, WM: Value) {
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/corgi"), this.loc);
	yield* qdel(this);
	return f.dot;
}, true);

// washing_machine.dm:76
rt.def("/obj/item/weapon/paper/proc/machine_wash", function machine_wash(f: Frame, WM: Value) {
	let CR: Value = null;
	if (!WM.color_source) return f.dot;
	if (!rt.istype(WM.color_source, T("/obj/item/toy/crayon"))) return f.dot;
	this.add_atom_colour((CR = WM.color_source).paint_color, WASHABLE_COLOUR_PRIORITY);
	return f.dot;
});

// washing_machine.dm:82
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/machine_wash", function* machine_wash(f: Frame, WM: Value) {
	yield* this.gib();
	return f.dot;
}, true);

rt.type(8261, "/obj/item/clothing/under/color", "/obj/item/clothing/under", {
	desc: "A standard issue colored jumpsuit. Variety is the spice of life!",
});

// washing_machine.dm:85
rt.def("/obj/item/clothing/under/color/proc/machine_wash", function machine_wash(f: Frame, WM: Value) {
	this.jumpsuit_wash(WM);
	return f.dot;
});

rt.type(8282, "/obj/item/clothing/under/rank", "/obj/item/clothing/under", {});

// washing_machine.dm:88
rt.def("/obj/item/clothing/under/rank/proc/machine_wash", function machine_wash(f: Frame, WM: Value) {
	this.jumpsuit_wash(WM);
	return f.dot;
});

// washing_machine.dm:91
rt.def("/obj/item/clothing/under/proc/jumpsuit_wash", function jumpsuit_wash(f: Frame, WM: Value) {
	let U: Value = null, _T: Value = null, J: Value = null, R: Value = null;
	if (!WM.color_source) return f.dot;
	let wash_color: Value = WM.color_source.item_color;
	for (_T of each(typesof(T("/obj/item/clothing/under/color")))) {
		J = _T;
		if (wash_color == rt.initial(f, J, "item_color")) {
			U = J;
			break;
		}
	}
	if (!U) {
		_T = null;
		for (_T of each(typesof(T("/obj/item/clothing/under/rank")))) {
			R = _T;
			if (wash_color == rt.initial(f, R, "item_color")) {
				U = R;
				break;
			}
		}
	}
	if (!U) return f.dot;
	this.item_state = rt.initial(f, U, "item_state");
	this.icon_state = rt.initial(f, U, "icon_state");
	this.item_color = wash_color;
	this.name = rt.initial(f, U, "name");
	this.desc = "The colors are a bit dodgy.";
	this.can_adjust = rt.initial(f, U, "can_adjust");
	if (!(!this.can_adjust && this.adjusted)) return f.dot;
	this.toggle_jumpsuit_adjust();
	return f.dot;
});

rt.type(7663, "/obj/item/clothing/gloves/color", "/obj/item/clothing/gloves", {});

// washing_machine.dm:116
rt.def("/obj/item/clothing/gloves/color/proc/machine_wash", function machine_wash(f: Frame, WM: Value) {
	let _T: Value = null, G: Value = null;
	if (!WM.color_source) return f.dot;
	let wash_color: Value = WM.color_source.item_color;
	for (_T of each(typesof(T("/obj/item/clothing/gloves/color")))) {
		G = _T;
		if (wash_color == rt.initial(f, G, "item_color")) {
			this.item_state = rt.initial(f, G, "item_state");
			this.icon_state = rt.initial(f, G, "icon_state");
			this.item_color = wash_color;
			this.name = rt.initial(f, G, "name");
			this.desc = "The colors are a bit dodgy.";
			break;
		}
	}
	return f.dot;
});

rt.type(8464, "/obj/item/clothing/shoes/sneakers", "/obj/item/clothing/shoes", {});

// washing_machine.dm:132
rt.def("/obj/item/clothing/shoes/sneakers/proc/machine_wash", function* machine_wash(f: Frame, WM: Value) {
	let _T: Value = null, S: Value = null;
	if (this.chained) {
		this.chained = 0;
		this.slowdown = SHOES_SLOWDOWN;
		yield* new_(T("/obj/item/weapon/restraints/handcuffs"), this.loc);
	}
	if (!WM.color_source) return f.dot;
	let wash_color: Value = WM.color_source.item_color;
	for (_T of each(typesof(T("/obj/item/clothing/shoes/sneakers")))) {
		S = _T;
		if (wash_color == rt.initial(f, S, "item_color")) {
			this.icon_state = rt.initial(f, S, "icon_state");
			this.item_color = wash_color;
			this.name = rt.initial(f, S, "name");
			this.desc = "The colors are a bit dodgy.";
			break;
		}
	}
	return f.dot;
}, true);

// washing_machine.dm:145
rt.def("/obj/item/weapon/bedsheet/proc/machine_wash", function machine_wash(f: Frame, WM: Value) {
	let _T: Value = null, B: Value = null;
	if (!WM.color_source) return f.dot;
	let wash_color: Value = WM.color_source.item_color;
	for (_T of each(typesof(T("/obj/item/weapon/bedsheet")))) {
		B = _T;
		if (wash_color == rt.initial(f, B, "item_color")) {
			this.icon_state = rt.initial(f, B, "icon_state");
			this.item_color = wash_color;
			this.name = rt.initial(f, B, "name");
			this.desc = "The colors are a bit dodgy.";
			break;
		}
	}
	return f.dot;
});

// washing_machine.dm:157
rt.def("/obj/item/clothing/head/soft/proc/machine_wash", function machine_wash(f: Frame, WM: Value) {
	let _T: Value = null, H: Value = null;
	if (!WM.color_source) return f.dot;
	let wash_color: Value = WM.color_source.item_color;
	for (_T of each(typesof(T("/obj/item/clothing/head/soft")))) {
		H = _T;
		if (wash_color == rt.initial(f, H, "item_color")) {
			this.icon_state = rt.initial(f, H, "icon_state");
			this.item_color = wash_color;
			this.name = rt.initial(f, H, "name");
			this.desc = "The colors are a bit dodgy.";
			break;
		}
	}
	return f.dot;
});

// washing_machine.dm:170
rt.def("/obj/machinery/washing_machine/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	yield* this.container_resist(user);
	return f.dot;
}, true);

// washing_machine.dm:173
rt.def("/obj/machinery/washing_machine/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	if (this.busy) return f.dot;
	yield* this.add_fingerprint(user);
	yield* this.open_machine();
	return f.dot;
}, true);

// washing_machine.dm:180
rt.def("/obj/machinery/washing_machine/proc/update_icon", function update_icon(f: Frame) {
	let full: Value = null;
	this.cut_overlays();
	if (this.busy) {
		this.icon_state = `wm_running_${this.bloody_mess}`;
	} else if (this.bloody_mess) {
		this.icon_state = `wm_${this.state_open}_blood`;
	} else {
		full = rt.len(f, this.contents) ? 1 : 0;
		this.icon_state = `wm_${this.state_open}_${full}`;
	}
	if (!this.panel_open) return f.dot;
	this.add_overlay("wm_panel");
	return f.dot;
});

// washing_machine.dm:192
rt.def("/obj/machinery/washing_machine/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (this.default_deconstruction_screwdriver(user, null, null, W)) {
		yield* this.update_icon();
		return f.dot;
	} else if (user.a_intent != "harm") {
		if (!this.state_open) {
			to_chat(user, "<span class='warning'>Open the door first!</span>");
			return 1;
		}
		if (this.bloody_mess) {
			to_chat(user, `<span class='warning'>${this} must be cleaned up first.</span>`);
			return 1;
		}
		if (rt.len(f, this.contents) >= this.max_wash_capacity) {
			to_chat(user, "<span class='warning'>The washing machine is full!</span>");
			return 1;
		}
		if (!(yield* user.transferItemToLoc(W, this))) {
			to_chat(user, fmt("<span class='warning'>＄！ is stuck to your hand, you cannot put it in the washing machine!</span>", [W]));
			return 1;
		}
		if (rt.istype(W, T("/obj/item/toy/crayon")) || rt.istype(W, T("/obj/item/weapon/stamp"))) {
			this.color_source = W;
		}
		yield* this.update_icon();
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// washing_machine.dm:223
rt.def("/obj/machinery/washing_machine/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let L: Value = null;
	if (this.busy) {
		to_chat(user, `<span class='warning'>${this} is busy.</span>`);
		return f.dot;
	}
	if (user.pulling && user.a_intent == "grab" && rt.istype(user.pulling, T("/mob/living"))) {
		if ((L = user.pulling).buckled || L.has_buckled_mobs()) {
			return f.dot;
		}
		if (this.state_open) {
			if (rt.istype(L, T("/mob/living/simple_animal/pet/dog/corgi"))) {
				this.has_corgi = 1;
				yield* L.forceMove(this);
				yield* this.update_icon();
			}
		}
		return f.dot;
	}
	if (!this.state_open) {
		yield* this.open_machine();
	} else {
		this.state_open = 0;
		yield* this.update_icon();
	}
	return f.dot;
}, true);

// washing_machine.dm:244
rt.def("/obj/machinery/washing_machine/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 2);
	yield* qdel(this);
	return f.dot;
}, true);

// washing_machine.dm:248
rt.def("/obj/machinery/washing_machine/proc/open_machine", function* open_machine(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	yield* parent_proc();
	this.density = 1;
	this.color_source = null;
	this.has_corgi = 0;
	return f.dot;
}, true, { args: ["drop"] });
