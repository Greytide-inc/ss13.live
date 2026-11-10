// Based on /tg/station's code/game/objects/structures/flora.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12471, "/obj/structure/flora/tree", "/obj/structure/flora", {
	cut: 0,
	log_amount: 10,
	name: "tree",
	density: 1,
	pixel_x: -16,
	layer: 5,
});

// flora.dm:17
rt.def("/obj/structure/flora/tree/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let i: Value = null;
	let $e: any;
	if (!this.cut && this.log_amount && !rt.isIn(f, NODECONSTRUCT, this.flags)) {
		if (W.sharpness && W.force > 0) {
			if (W.hitsound) {
				playsound(rt.getStep(f, this, 0), W.hitsound, 100, 0, 0);
			}
			user.visible_message(`<span class='notice'>${user} begins to cut down ${this} with ${W}.</span>`, `<span class='notice'>You begin to cut down ${this} with ${W}.</span>`, "You hear the sound of sawing.");
			if (yield* do_after(user, 1000 / W.force, { target: user })) {
				if (this.cut) {
					return f.dot;
				}
				user.visible_message(`<span class='notice'>${user} fells ${this} with the ${W}.</span>`, `<span class='notice'>You fell ${this} with the ${W}.</span>`, "You hear the sound of a tree falling.");
				playsound(rt.getStep(f, this, 0), rt.rsc("sound/effects/meteorimpact.ogg"), 100, 0, 0);
				this.icon = rt.rsc("icons/obj/flora/pinetrees.dmi");
				this.icon_state = "tree_stump";
				this.density = 0;
				this.pixel_x = -16;
				this.name += " stump";
				this.cut = 1;
				rt.forRange(f, 0, 1, this.log_amount, 1);
				while (($e = rt.next(f, 0)) !== undefined) {
					i = $e;
					yield* new_(T("/obj/item/weapon/grown/log/tree"), rt.getStep(f, this, 0));
				}
				rt.endFor(f, 0);
			}
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(12472, "/obj/structure/flora/tree/pine", "/obj/structure/flora/tree", {
	name: "pine tree",
	icon: rt.rsc("icons/obj/flora/pinetrees.dmi"),
	icon_state: "pine_1",
});

// flora.dm:48
rt.def("/obj/structure/flora/tree/pine/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `pine_${rand(1, 3)}`;
	parent_proc();
	return f.dot;
});

rt.type(12473, "/obj/structure/flora/tree/pine/xmas", "/obj/structure/flora/tree/pine", {
	name: "xmas tree",
	icon_state: "pine_c",
});

// flora.dm:56
rt.def("/obj/structure/flora/tree/pine/xmas/proc/Initialize", function Initialize(f: Frame) {
	parent_proc();
	this.icon_state = "pine_c";
	return f.dot;
});

rt.type(12475, "/obj/structure/flora/tree/palm", "/obj/structure/flora/tree", {
	icon: rt.rsc("icons/misc/beach2.dmi"),
	icon_state: "palm1",
});

// flora.dm:68
rt.def("/obj/structure/flora/tree/palm/proc/Initialize", function Initialize(f: Frame) {
	parent_proc();
	this.icon_state = pick("palm1", "palm2");
	this.pixel_x = 0;
	return f.dot;
});

rt.type(12474, "/obj/structure/flora/tree/dead", "/obj/structure/flora/tree", {
	icon: rt.rsc("icons/obj/flora/deadtrees.dmi"),
	icon_state: "tree_1",
});

// flora.dm:79
rt.def("/obj/structure/flora/tree/dead/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `tree_${rand(1, 6)}`;
	parent_proc();
	return f.dot;
});

rt.type(12476, "/obj/structure/flora/tree/jungle", "/obj/structure/flora/tree", {
	name: "tree",
	icon_state: "tree",
	desc: "It's seriously hampering your view of the jungle.",
	icon: rt.rsc("icons/obj/flora/jungletrees.dmi"),
	pixel_x: -48,
	pixel_y: -20,
});

// flora.dm:91
rt.def("/obj/structure/flora/tree/jungle/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `${this.icon_state}${rand(1, 6)}`;
	parent_proc();
	return f.dot;
});

rt.type(12479, "/obj/structure/flora/grass/brown", "/obj/structure/flora/grass", {
	icon_state: "snowgrass1bb",
});

// flora.dm:109
rt.def("/obj/structure/flora/grass/brown/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `snowgrass${rand(1, 3)}bb`;
	parent_proc();
	return f.dot;
});

rt.type(12480, "/obj/structure/flora/grass/green", "/obj/structure/flora/grass", {
	icon_state: "snowgrass1gb",
});

// flora.dm:117
rt.def("/obj/structure/flora/grass/green/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `snowgrass${rand(1, 3)}gb`;
	parent_proc();
	return f.dot;
});

rt.type(12481, "/obj/structure/flora/grass/both", "/obj/structure/flora/grass", {
	icon_state: "snowgrassall1",
});

// flora.dm:124
rt.def("/obj/structure/flora/grass/both/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `snowgrassall${rand(1, 3)}`;
	parent_proc();
	return f.dot;
});

rt.type(12484, "/obj/structure/flora/bush", "/obj/structure/flora", {
	anchored: 1,
	name: "bush",
	icon: rt.rsc("icons/obj/flora/snowflora.dmi"),
	icon_state: "snowbush1",
});

// flora.dm:136
rt.def("/obj/structure/flora/bush/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `snowbush${rand(1, 6)}`;
	parent_proc();
	return f.dot;
});

rt.type(12485, "/obj/structure/flora/ausbushes", "/obj/structure/flora", {
	name: "bush",
	icon: rt.rsc("icons/obj/flora/ausflora.dmi"),
	icon_state: "firstbush_1",
});

// flora.dm:147
rt.def("/obj/structure/flora/ausbushes/proc/Initialize", function Initialize(f: Frame) {
	if (this.icon_state == "firstbush_1") {
		this.icon_state = `firstbush_${rand(1, 4)}`;
	}
	parent_proc();
	return f.dot;
});

rt.type(12486, "/obj/structure/flora/ausbushes/reedbush", "/obj/structure/flora/ausbushes", {
	icon_state: "reedbush_1",
});

// flora.dm:155
rt.def("/obj/structure/flora/ausbushes/reedbush/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `reedbush_${rand(1, 4)}`;
	parent_proc();
	return f.dot;
});

rt.type(12487, "/obj/structure/flora/ausbushes/leafybush", "/obj/structure/flora/ausbushes", {
	icon_state: "leafybush_1",
});

// flora.dm:162
rt.def("/obj/structure/flora/ausbushes/leafybush/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `leafybush_${rand(1, 3)}`;
	parent_proc();
	return f.dot;
});

rt.type(12488, "/obj/structure/flora/ausbushes/palebush", "/obj/structure/flora/ausbushes", {
	icon_state: "palebush_1",
});

// flora.dm:169
rt.def("/obj/structure/flora/ausbushes/palebush/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `palebush_${rand(1, 4)}`;
	parent_proc();
	return f.dot;
});

rt.type(12489, "/obj/structure/flora/ausbushes/stalkybush", "/obj/structure/flora/ausbushes", {
	icon_state: "stalkybush_1",
});

// flora.dm:176
rt.def("/obj/structure/flora/ausbushes/stalkybush/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `stalkybush_${rand(1, 3)}`;
	parent_proc();
	return f.dot;
});

rt.type(12490, "/obj/structure/flora/ausbushes/grassybush", "/obj/structure/flora/ausbushes", {
	icon_state: "grassybush_1",
});

// flora.dm:183
rt.def("/obj/structure/flora/ausbushes/grassybush/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `grassybush_${rand(1, 4)}`;
	parent_proc();
	return f.dot;
});

rt.type(12491, "/obj/structure/flora/ausbushes/fernybush", "/obj/structure/flora/ausbushes", {
	icon_state: "fernybush_1",
});

// flora.dm:190
rt.def("/obj/structure/flora/ausbushes/fernybush/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `fernybush_${rand(1, 3)}`;
	parent_proc();
	return f.dot;
});

rt.type(12492, "/obj/structure/flora/ausbushes/sunnybush", "/obj/structure/flora/ausbushes", {
	icon_state: "sunnybush_1",
});

// flora.dm:197
rt.def("/obj/structure/flora/ausbushes/sunnybush/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `sunnybush_${rand(1, 3)}`;
	parent_proc();
	return f.dot;
});

rt.type(12493, "/obj/structure/flora/ausbushes/genericbush", "/obj/structure/flora/ausbushes", {
	icon_state: "genericbush_1",
});

// flora.dm:204
rt.def("/obj/structure/flora/ausbushes/genericbush/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `genericbush_${rand(1, 4)}`;
	parent_proc();
	return f.dot;
});

rt.type(12494, "/obj/structure/flora/ausbushes/pointybush", "/obj/structure/flora/ausbushes", {
	icon_state: "pointybush_1",
});

// flora.dm:211
rt.def("/obj/structure/flora/ausbushes/pointybush/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `pointybush_${rand(1, 4)}`;
	parent_proc();
	return f.dot;
});

rt.type(12495, "/obj/structure/flora/ausbushes/lavendergrass", "/obj/structure/flora/ausbushes", {
	icon_state: "lavendergrass_1",
});

// flora.dm:218
rt.def("/obj/structure/flora/ausbushes/lavendergrass/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `lavendergrass_${rand(1, 4)}`;
	parent_proc();
	return f.dot;
});

rt.type(12496, "/obj/structure/flora/ausbushes/ywflowers", "/obj/structure/flora/ausbushes", {
	icon_state: "ywflowers_1",
});

// flora.dm:225
rt.def("/obj/structure/flora/ausbushes/ywflowers/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `ywflowers_${rand(1, 3)}`;
	parent_proc();
	return f.dot;
});

rt.type(12497, "/obj/structure/flora/ausbushes/brflowers", "/obj/structure/flora/ausbushes", {
	icon_state: "brflowers_1",
});

// flora.dm:232
rt.def("/obj/structure/flora/ausbushes/brflowers/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `brflowers_${rand(1, 3)}`;
	parent_proc();
	return f.dot;
});

rt.type(12498, "/obj/structure/flora/ausbushes/ppflowers", "/obj/structure/flora/ausbushes", {
	icon_state: "ppflowers_1",
});

// flora.dm:239
rt.def("/obj/structure/flora/ausbushes/ppflowers/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `ppflowers_${rand(1, 3)}`;
	parent_proc();
	return f.dot;
});

rt.type(12499, "/obj/structure/flora/ausbushes/sparsegrass", "/obj/structure/flora/ausbushes", {
	icon_state: "sparsegrass_1",
});

// flora.dm:246
rt.def("/obj/structure/flora/ausbushes/sparsegrass/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `sparsegrass_${rand(1, 3)}`;
	parent_proc();
	return f.dot;
});

rt.type(12500, "/obj/structure/flora/ausbushes/fullgrass", "/obj/structure/flora/ausbushes", {
	icon_state: "fullgrass_1",
});

// flora.dm:253
rt.def("/obj/structure/flora/ausbushes/fullgrass/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `fullgrass_${rand(1, 3)}`;
	parent_proc();
	return f.dot;
});

rt.type(5628, "/obj/item/weapon/twohanded/required/kirbyplants", "/obj/item/weapon/twohanded/required", {
	throw_speed: 2,
	throw_range: 4,
	name: "potted plant",
	icon: rt.rsc("icons/obj/flora/plants.dmi"),
	icon_state: "plant-01",
	layer: 4.1,
	w_class: 5,
	force: 10,
	throwforce: 13,
});

// flora.dm:268
rt.def("/obj/item/weapon/twohanded/required/kirbyplants/proc/equipped", function* equipped(f: Frame, user: Value) {
	let I: Value = null;
	(I = (yield* image({ icon: rt.rsc("icons/obj/flora/plants.dmi"), icon_state: this.icon_state, loc: user }))).override = 1;
	yield* this.add_alt_appearance(T("/datum/atom_hud/alternate_appearance/basic/everyone"), "sneaking_mission", I);
	yield* parent_proc();
	return f.dot;
}, true);

// flora.dm:274
rt.def("/obj/item/weapon/twohanded/required/kirbyplants/proc/dropped", function* dropped(f: Frame, user: Value) {
	yield* parent_proc();
	yield* user.remove_alt_appearance("sneaking_mission");
	return f.dot;
}, true);

rt.type(5629, "/obj/item/weapon/twohanded/required/kirbyplants/random", "/obj/item/weapon/twohanded/required/kirbyplants", {}, { global: { states: 729 } });

// flora.dm:281
rt.def("/obj/item/weapon/twohanded/required/kirbyplants/random/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!GLOB.states) {
		this.generate_states();
	}
	this.icon_state = pick(GLOB.states);
	return f.dot;
}, true);

// flora.dm:287
rt.def("/obj/item/weapon/twohanded/required/kirbyplants/random/proc/generate_states", function generate_states(f: Frame) {
	let i: Value = null, number: Value = null;
	let $e: any;
	GLOB.states = list();
	rt.forRange(f, 0, 1, 25, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		number = null;
		if (i < 10) {
			number = `0${i}`;
		} else {
			number = `${i}`;
		}
		GLOB.states += `plant-${number}`;
	}
	rt.endFor(f, 0);
	GLOB.states += "applebush";
	return f.dot;
});

rt.type(12501, "/obj/structure/flora/rock", "/obj/structure/flora", {
	icon_state: "basalt",
	desc: "A volcanic rock",
	icon: rt.rsc("icons/obj/flora/rocks.dmi"),
	resistance_flags: 2,
	density: 1,
});

// flora.dm:315
rt.def("/obj/structure/flora/rock/proc/Initialize", function Initialize(f: Frame) {
	parent_proc();
	this.icon_state = `${this.icon_state}${rand(1, 3)}`;
	return f.dot;
});

rt.type(12502, "/obj/structure/flora/rock/pile", "/obj/structure/flora/rock", {
	icon_state: "lavarocks",
	desc: "A pile of rocks",
});

// flora.dm:323
rt.def("/obj/structure/flora/rock/pile/proc/Initialize", function Initialize(f: Frame) {
	parent_proc();
	this.icon_state = `${this.icon_state}${rand(1, 3)}`;
	return f.dot;
});

rt.type(12482, "/obj/structure/flora/grass/jungle", "/obj/structure/flora/grass", {
	name: "jungle grass",
	desc: "Thick alien flora.",
	icon: rt.rsc("icons/obj/flora/jungleflora.dmi"),
	icon_state: "grassa",
});

// flora.dm:336
rt.def("/obj/structure/flora/grass/jungle/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `${this.icon_state}${rand(1, 5)}`;
	parent_proc();
	return f.dot;
});

rt.type(12505, "/obj/structure/flora/rock/jungle", "/obj/structure/flora/rock", {
	icon_state: "rock",
	desc: "A pile of rocks.",
	icon: rt.rsc("icons/obj/flora/jungleflora.dmi"),
	density: 0,
});

// flora.dm:352
rt.def("/obj/structure/flora/rock/jungle/proc/Initialize", function Initialize(f: Frame) {
	parent_proc();
	this.icon_state = `${rt.initial(f, this, "icon_state")}${rand(1, 5)}`;
	return f.dot;
});

rt.type(12507, "/obj/structure/flora/junglebush", "/obj/structure/flora", {
	name: "bush",
	icon: rt.rsc("icons/obj/flora/jungleflora.dmi"),
	icon_state: "busha",
});

// flora.dm:364
rt.def("/obj/structure/flora/junglebush/proc/Initialize", function Initialize(f: Frame) {
	this.icon_state = `${this.icon_state}${rand(1, 3)}`;
	parent_proc();
	return f.dot;
});

rt.type(12503, "/obj/structure/flora/rock/pile/largejungle", "/obj/structure/flora/rock/pile", {
	name: "rocks",
	icon_state: "rocks",
	icon: rt.rsc("icons/obj/flora/largejungleflora.dmi"),
	density: 0,
	pixel_x: -16,
	pixel_y: -16,
});

// flora.dm:389
rt.def("/obj/structure/flora/rock/pile/largejungle/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	this.icon_state = `${rt.initial(f, this, "icon_state")}${rand(1, 3)}`;
	return f.dot;
});
