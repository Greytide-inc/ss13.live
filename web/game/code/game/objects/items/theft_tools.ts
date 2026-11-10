// Based on /tg/station's code/game/objects/items/theft_tools.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(9782, "/obj/item/nuke_core", "/obj/item", {
	pulse: 0,
	cooldown: 0,
	pulseicon: "plutonium_core_pulse",
	item_state: "plutoniumcore",
	name: "plutonium core",
	desc: "Extremely radioactive. Wear goggles.",
	icon: rt.rsc("icons/obj/nuke_tools.dmi"),
	icon_state: "plutonium_core",
	resistance_flags: 99,
});

// theft_tools.dm:19
rt.def("/obj/item/nuke_core/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// theft_tools.dm:23
rt.def("/obj/item/nuke_core/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return (yield* parent_proc());
}, true);

// theft_tools.dm:27
rt.def("/obj/item/nuke_core/proc/attackby", function* attackby(f: Frame, container: Value, user: Value) {
	if (rt.istype(container, T("/obj/item/nuke_core_container"))) {
		yield* container.load(this, user);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// theft_tools.dm:33
rt.def("/obj/item/nuke_core/proc/process", function* process(f: Frame) {
	if (!(this.cooldown < rt.worldTime(f) - 60)) return f.dot;
	this.cooldown = rt.worldTime(f);
	flick(this.pulseicon, this);
	yield* radiation_pulse(rt.getStep(f, this, 0), 1, 4, 40, 1);
	return f.dot;
}, true, { waitfor: false });

rt.type(9784, "/obj/item/nuke_core_container", "/obj/item", {
	core: null,
	item_state: "tile",
	name: "nuke core container",
	desc: "Solid container for radioactive objects.",
	icon: rt.rsc("icons/obj/nuke_tools.dmi"),
	icon_state: "core_container_empty",
});

// theft_tools.dm:48
rt.def("/obj/item/nuke_core_container/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.core);
	this.core = null;
	return (yield* parent_proc());
}, true);

// theft_tools.dm:52
rt.def("/obj/item/nuke_core_container/proc/load", function* load(f: Frame, ncore: Value, user: Value) {
	if (this.core || !rt.istype(ncore, T("/obj/item/nuke_core"))) {
		return 0;
	}
	yield* ncore.forceMove(this);
	this.core = ncore;
	this.icon_state = "core_container_loaded";
	to_chat(user, "<span class='warning'>Container is sealing...</span>");
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/nuke_core_container/proc/seal"))), 50);
	return 1;
}, true);

// theft_tools.dm:62
rt.def("/obj/item/nuke_core_container/proc/seal", function seal(f: Frame) {
	if (!rt.istype(this.core, T("/obj/item/nuke_core"))) return f.dot;
	this.core.isprocessing = 0;
	GLOB.SSobj.processing -= this.core;
	this.icon_state = "core_container_sealed";
	playsound(this, rt.rsc("sound/items/deconstruct.ogg"), 60, 1);
	if (!ismob(this.loc)) return f.dot;
	to_chat(this.loc, `<span class='warning'>${this} is permanently sealed, ${this.core}'s radiation is contained.</span>`);
	return f.dot;
});

// theft_tools.dm:70
rt.def("/obj/item/nuke_core_container/proc/attackby", function* attackby(f: Frame, core: Value, user: Value) {
	if (rt.istype(core, T("/obj/item/nuke_core"))) {
		if (!(yield* user.temporarilyRemoveItemFromInventory(core))) {
			to_chat(user, `<span class='warning'>The ${core} is stuck to your hand!</span>`);
			return f.dot;
		} else {
			yield* this.load(core, user);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(9783, "/obj/item/nuke_core/supermatter_sliver", "/obj/item/nuke_core", {
	item_state: "supermattersliver",
	pulseicon: "supermatter_sliver_pulse",
	name: "supermatter sliver",
	desc: "A tiny, highly volatile sliver of a supermatter crystal. Do not handle without protection!",
	icon_state: "supermatter_sliver",
});

// theft_tools.dm:126
rt.def("/obj/item/nuke_core/supermatter_sliver/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let tongs: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/hemostat/supermatter"))) {
		if ((tongs = W).sliver) {
			to_chat(user, fmt("<span class='notice'>＄！ is already holding a supermatter sliver!</span>", [tongs]));
			return 0;
		}
		yield* this.forceMove(tongs);
		tongs.sliver = this;
		tongs.icon_state = "supermatter_tongs_loaded";
		to_chat(user, `<span class='notice'>You carefully pick up ${this} with ${tongs}.</span>`);
	} else if (rt.istype(W, T("/obj/item/weapon/scalpel/supermatter")) || rt.istype(W, T("/obj/item/nuke_core_container/supermatter"))) {
		return f.dot;
	} else {
		to_chat(user, fmt("<span class='notice'>As it touches ％！, both ％！ and ％！ burst into dust!</span>", [this, this, W]));
		yield* radiation_pulse(rt.getStep(f, user, 0), 1, 2, 10, 1);
		playsound(this, rt.rsc("sound/effects/supermatter.ogg"), 50, 1);
		yield* qdel(W);
		yield* qdel(this);
	}
	return f.dot;
}, true);

// theft_tools.dm:145
rt.def("/obj/item/nuke_core/supermatter_sliver/proc/pickup", function* pickup(f: Frame, user: Value) {
	yield* parent_proc();
	if (!rt.istype(user, T("/mob/living/carbon"))) {
		return 0;
	}
	let ded: Value = user;
	to_chat(user, "<span class='warning'>You reach for the supermatter sliver with your hands. That was dumb.</span>");
	yield* radiation_pulse(rt.getStep(f, user, 0), 2, 4, 50, 1);
	playsound(rt.getStep(f, user, 0), rt.rsc("sound/effects/supermatter.ogg"), 50, 1);
	yield* ded.dust();
	return f.dot;
}, true);

rt.type(9785, "/obj/item/nuke_core_container/supermatter", "/obj/item/nuke_core_container", {
	sliver: null,
	name: "supermatter bin",
	desc: "A tiny receptacle that releases an inert freon mix upon sealing, allowing a sliver of a supermatter crystal to be safely stored..",
});

// theft_tools.dm:160
rt.def("/obj/item/nuke_core_container/supermatter/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.sliver);
	this.sliver = null;
	return (yield* parent_proc());
}, true);

// theft_tools.dm:164
rt.def("/obj/item/nuke_core_container/supermatter/proc/load", function* load(f: Frame, _T: Value, user: Value) {
	if (!rt.istype(_T, T("/obj/item/weapon/hemostat/supermatter")) || !_T.sliver) {
		return 0;
	}
	yield* _T.sliver.forceMove(this);
	this.sliver = _T.sliver;
	_T.sliver = null;
	this.icon_state = "core_container_loaded";
	to_chat(user, "<span class='warning'>Container is sealing...</span>");
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/nuke_core_container/supermatter/proc/seal"))), 50);
	return 1;
}, true);

// theft_tools.dm:175
rt.def("/obj/item/nuke_core_container/supermatter/proc/seal", function seal(f: Frame) {
	if (!rt.istype(this.sliver, T("/obj/item/nuke_core/supermatter_sliver"))) return f.dot;
	this.sliver.isprocessing = 0;
	GLOB.SSobj.processing -= this.sliver;
	this.icon_state = "core_container_sealed";
	playsound(this, rt.rsc("sound/items/deconstruct.ogg"), 60, 1);
	if (!ismob(this.loc)) return f.dot;
	to_chat(this.loc, `<span class='warning'>${this} is permanently sealed, ${this.sliver} is safely contained.</span>`);
	return f.dot;
});

// theft_tools.dm:183
rt.def("/obj/item/nuke_core_container/supermatter/proc/attackby", function* attackby(f: Frame, tongs: Value, user: Value) {
	if (rt.istype(tongs, T("/obj/item/weapon/hemostat/supermatter"))) {
		if (!(yield* user.temporarilyRemoveItemFromInventory(tongs))) {
			to_chat(user, fmt("<span class='warning'>＄！ is stuck to your hand!</span>", [tongs]));
		} else {
			yield* this.load(this.sliver, user);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(6660, "/obj/item/weapon/hemostat/supermatter", "/obj/item/weapon/hemostat", {
	sliver: null,
	name: "supermatter extraction tongs",
	desc: "A pair of tongs made from condensed freon gas, searingly cold to the touch, that can safely grip a supermatter sliver.",
	icon: rt.rsc("icons/obj/nuke_tools.dmi"),
	icon_state: "supermatter_tongs",
	toolspeed: 0.75,
	damtype: "fire",
});

// theft_tools.dm:210
rt.def("/obj/item/weapon/hemostat/supermatter/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.sliver);
	this.sliver = null;
	return (yield* parent_proc());
}, true);

// theft_tools.dm:214
rt.def("/obj/item/weapon/hemostat/supermatter/proc/afterattack", function* afterattack(f: Frame, O: Value, user: Value, proximity: Value) {
	if (!this.sliver) {
		return f.dot;
	}
	if (!rt.istype(O, T("/atom/movable"))) return f.dot;
	yield* this.Consume(O);
	to_chat(f.usr, fmt("<span class='notice'>＄！ is dusted along with ％！!</span>", [this.sliver, O]));
	yield* qdel(this.sliver);
	this.sliver = null;
	return f.dot;
}, true);

// theft_tools.dm:223
rt.def("/obj/item/weapon/hemostat/supermatter/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value) {
	if (this.sliver) {
		yield* this.sliver.forceMove(this.loc);
		to_chat(f.usr, fmt("<span class='notice'>＄！ falls out of ％！ as you throw them.</span>", [this.sliver, this]));
		this.sliver = null;
	}
	yield* parent_proc();
	return f.dot;
}, true, { waitfor: false });

// theft_tools.dm:229
rt.def("/obj/item/weapon/hemostat/supermatter/proc/Consume", function* Consume(f: Frame, AM: Value, user: Value) {
	let victim: Value = null;
	if (ismob(AM)) {
		yield* (victim = AM).dust();
		message_admins(`${this} has consumed ${key_name_admin(victim)} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${this.x};Y=${this.y};Z=${this.z}'>JMP</a>)`}.`);
		this.investigate_log(`has consumed ${key_name(victim)}.`, "supermatter");
	} else {
		this.investigate_log(`has consumed ${AM}.`, "supermatter");
		yield* qdel(AM);
	}
	user.visible_message(fmt("<span class='danger'>As ＀ touches ％！ with ＇！, silence fills the room...</span>", [user, AM, this]), fmt("<span class='userdanger'>You touch ％！ with ％！, and everything suddenly goes silent.</span>\n<span class='notice'>＄！ flashes into dust, and soon as you can register this, you do as well.</span>", [AM, this, AM]), "<span class='italics'>Everything suddenly goes silent.</span>");
	yield* radiation_pulse(rt.getStep(f, user, 0), 2, 4, 50, 1);
	playsound(this, rt.rsc("sound/effects/supermatter.ogg"), 50, 1);
	yield* user.dust();
	this.icon_state = "supermatter_tongs";
	yield* qdel(this.sliver);
	this.sliver = null;
	return f.dot;
}, true);
