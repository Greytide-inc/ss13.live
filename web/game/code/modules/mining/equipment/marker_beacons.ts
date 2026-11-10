// Based on /tg/station's code/modules/mining/equipment/marker_beacons.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


// marker_beacons.dm:2
rt.def("/datum/controller/global_vars/proc/InitGlobalmarker_beacon_colors", function InitGlobalmarker_beacon_colors(f: Frame) {
	GLOB.marker_beacon_colors = rt.alist(f, ["Random", 0, "Burgundy", "#FA644B", "Bronze", "#FA9632", "Yellow", "#E1E17D", "Lime", "#AFC84B", "Olive", "#64C864", "Jade", "#7DE1AF", "Teal", "#40CEFF", "Cerulean", "#6496FA", "Indigo", "#6496FA", "Purple", "#952CF4", "Violet", "#9B51FF", "Fuchsia", "#E17DE1"]);
	this.gvars_datum_init_order += "marker_beacon_colors";
	return f.dot;
});

rt.type(9111, "/obj/item/stack/marker_beacon", "/obj/item/stack", {
	picked_color: "random",
	singular_name: "marker beacon",
	merge_type: rt.typePath("/obj/item/stack/marker_beacon"),
	max_amount: 100,
	novariants: 1,
	name: "marker beacon",
	desc: "Prism-brand path illumination devices. Used by miners to mark paths and warn of danger.",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "marker",
});

// marker_beacons.dm:35
rt.def("/obj/item/stack/marker_beacon/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	yield* this.update_icon();
	return f.dot;
}, true);

// marker_beacons.dm:39
rt.def("/obj/item/stack/marker_beacon/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `<span class='notice'>Use in-hand to place a ${this.singular_name}.</span>`);
	to_chat(user, `<span class='notice'>Alt-click to select a color. Current color is ${this.picked_color}.</span>`);
	return f.dot;
}, false);

// marker_beacons.dm:44
rt.def("/obj/item/stack/marker_beacon/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `${rt.initial(f, this, "icon_state")}${lowertext(this.picked_color)}`;
	return f.dot;
});

// marker_beacons.dm:47
rt.def("/obj/item/stack/marker_beacon/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let M: Value = null;
	let $1: any;
	if (!isturf(user.loc)) {
		to_chat(user, `<span class='warning'>You need more space to place a ${this.singular_name} here.</span>`);
		return f.dot;
	}
	if (rt.locateIn(f, T("/obj/structure/marker_beacon"), user.loc)) {
		to_chat(user, `<span class='warning'>There is already a ${this.singular_name} here.</span>`);
		return f.dot;
	}
	if (!(yield* this.use(1))) return f.dot;
	let $0: any = user;
	if (this.amount) {
		$1 = "a";
	} else {
		$1 = "the";
	}
	to_chat($0, `<span class='notice'>You activate and anchor ${$1} ${this.singular_name} in place.</span>`);
	playsound(user, rt.rsc("sound/machines/click.ogg"), 50, 1);
	this.transfer_fingerprints_to((M = (yield* new_(T("/obj/structure/marker_beacon"), user.loc, this.picked_color))));
	return f.dot;
}, true);

// marker_beacons.dm:60
rt.def("/obj/item/stack/marker_beacon/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	if (user.incapacitated() || !rt.istype(user, T("/mob/living"))) {
		to_chat(user, "<span class='warning'>You can't do that right now!</span>");
		return f.dot;
	}
	if (!(get_dist(this, user) <= 1)) {
		return f.dot;
	}
	let input_color: Value = (yield* g.op(f, "Prompt", [1], [null, "Beacon Color", "Choose a color.", user, GLOB.marker_beacon_colors]));
	if (user.incapacitated() || !rt.istype(user, T("/mob/living")) || !(get_dist(this, user) <= 1)) {
		return f.dot;
	}
	if (!input_color) return f.dot;
	this.picked_color = input_color;
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(12957, "/obj/structure/marker_beacon", "/obj/structure", {
	remove_speed: 15,
	picked_color: null,
	anchored: 1,
	light_range: 2,
	light_power: 3,
	name: "marker beacon",
	desc: "A Prism-brand path illumination device. It is anchored in place and glowing steadily.",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "marker",
	layer: 2.6,
	armor: null,
	obj_integrity: 50,
	max_integrity: 50,
});

// marker_beacons.dm:78
rt.def("/obj/structure/marker_beacon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 75, "laser", 75, "energy", 75, "bomb", 25, "bio", 100, "rad", 100, "fire", 25, "acid", 0]);
	return f.dot;
});

// marker_beacons.dm:88
rt.def("/obj/structure/marker_beacon/proc/Initialize", function Initialize(f: Frame, mapload: Value, set_color: Value) {
	f.dot = parent_proc();
	this.picked_color = set_color;
	this.update_icon();
	return f.dot;
}, false);

// marker_beacons.dm:93
rt.def("/obj/structure/marker_beacon/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let M: Value = null;
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		(M = (yield* new_(T("/obj/item/stack/marker_beacon"), this.loc))).picked_color = this.picked_color;
		yield* M.update_icon();
	}
	yield* qdel(this);
	return f.dot;
}, true);

// marker_beacons.dm:100
rt.def("/obj/structure/marker_beacon/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `<span class='notice'>Alt-click to select a color. Current color is ${this.picked_color}.</span>`);
	return f.dot;
}, false);

// marker_beacons.dm:104
rt.def("/obj/structure/marker_beacon/proc/update_icon", function update_icon(f: Frame) {
	while (!this.picked_color || !rt.index(GLOB.marker_beacon_colors, this.picked_color)) {
		this.picked_color = pick(GLOB.marker_beacon_colors);
	}
	this.icon_state = `${rt.initial(f, this, "icon_state")}${lowertext(this.picked_color)}-on`;
	this.set_light(this.light_range, this.light_power, rt.index(GLOB.marker_beacon_colors, this.picked_color));
	return f.dot;
});

// marker_beacons.dm:110
rt.def("/obj/structure/marker_beacon/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let M: Value = null;
	to_chat(user, `<span class='notice'>You start picking ${this} up...</span>`);
	if (!(yield* do_after(user, this.remove_speed, { target: this }))) return f.dot;
	(M = (yield* new_(T("/obj/item/stack/marker_beacon"), this.loc))).picked_color = this.picked_color;
	yield* M.update_icon();
	this.transfer_fingerprints_to(M);
	if (!(yield* user.put_in_hands(M, 1))) return f.dot;
	playsound(this, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
	yield* qdel(this);
	return f.dot;
}, true);

// marker_beacons.dm:121
rt.def("/obj/structure/marker_beacon/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let M: Value = null;
	if (rt.istype(I, T("/obj/item/stack/marker_beacon"))) {
		M = I;
		to_chat(user, `<span class='notice'>You start picking ${this} up...</span>`);
		if ((yield* do_after(user, this.remove_speed, { target: this })) && M.amount + 1 <= M.max_amount) {
			yield* g.callName(f, M, "add", [1]);
			playsound(this, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			yield* qdel(this);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// marker_beacons.dm:132
rt.def("/obj/structure/marker_beacon/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	yield* parent_proc();
	if (user.incapacitated() || !rt.istype(user, T("/mob/living"))) {
		to_chat(user, "<span class='warning'>You can't do that right now!</span>");
		return f.dot;
	}
	if (!(get_dist(this, user) <= 1)) {
		return f.dot;
	}
	let input_color: Value = (yield* g.op(f, "Prompt", [1], [null, "Beacon Color", "Choose a color.", user, GLOB.marker_beacon_colors]));
	if (user.incapacitated() || !rt.istype(user, T("/mob/living")) || !(get_dist(this, user) <= 1)) {
		return f.dot;
	}
	if (!input_color) return f.dot;
	this.picked_color = input_color;
	yield* this.update_icon();
	return f.dot;
}, true);
