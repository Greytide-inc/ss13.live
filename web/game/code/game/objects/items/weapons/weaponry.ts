// Based on /tg/station's code/game/objects/items/weapons/weaponry.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7382, "/obj/item/weapon/banhammer", "/obj/item/weapon", {
	throw_speed: 3,
	throw_range: 7,
	desc: "A banhammer",
	name: "banhammer",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "toyhammer",
	slot_flags: 512,
	throwforce: 0,
	w_class: 1,
	attack_verb: null,
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
	resistance_flags: 2,
});

// weaponry.dm:13
rt.def("/obj/item/weapon/banhammer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("banned");
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 70]);
	return f.dot;
});

// weaponry.dm:20
rt.def("/obj/item/weapon/banhammer/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is hitting ${user.p_them()}self with ${this}! It looks like ${user.p_theyre()} trying to ban ${user.p_them()}self from life.</span>`);
	return 15;
});

// weaponry.dm:24
rt.def("/obj/item/weapon/banhammer/proc/attack", function attack(f: Frame, M: Value, user: Value) {
	to_chat(M, `<font color='red'><b> You have been banned FOR NO REISIN by ${user}<b></font>`);
	to_chat(user, `<font color='red'>You have <b>BANNED</b> ${M}</font>`);
	playsound(this.loc, rt.rsc("sound/effects/adminhelp.ogg"), 15);
	return f.dot;
});

rt.type(7383, "/obj/item/weapon/sord", "/obj/item/weapon", {
	name: "１SORD",
	desc: "This thing is so unspeakably shitty you are having a hard time even holding it.",
	icon_state: "sord",
	item_state: "sord",
	slot_flags: 512,
	force: 2,
	throwforce: 1,
	w_class: 3,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	attack_verb: null,
});

// weaponry.dm:41
rt.def("/obj/item/weapon/sord/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is trying to impale ${user.p_them()}self with ${this}! It might be a suicide attempt if it weren't so shitty.</span>`, `<span class='suicide'>You try to impale yourself with ${this}, but it's USELESS...</span>`);
	return 16;
});

rt.type(7001, "/obj/item/weapon/claymore", "/obj/item/weapon", {
	flags: 64,
	name: "claymore",
	desc: "What are you standing around staring at this for? Get to killing!",
	icon_state: "claymore",
	item_state: "claymore",
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	slot_flags: 1536,
	force: 40,
	throwforce: 10,
	w_class: 3,
	attack_verb: null,
	block_chance: 50,
	sharpness: 1,
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
	resistance_flags: 2,
});

// weaponry.dm:61
rt.def("/obj/item/weapon/claymore/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut");
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]);
	return f.dot;
});

// weaponry.dm:65
rt.def("/obj/item/weapon/claymore/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is falling on ${this}! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	return 1;
});

rt.type(7003, "/obj/item/weapon/claymore/highlander", "/obj/item/weapon/claymore", {
	notches: 0,
	nuke_disk: null,
	flags: 16450,
	desc: "<b><i>THERE CAN BE ONLY ONE, AND IT WILL BE YOU!!!</i></b>\nActivate it in your hand to point to the nearest victim.",
	slot_flags: null,
	block_chance: 0,
	luminosity: 3,
	attack_verb: null,
});

// weaponry.dm:79
rt.def("/obj/item/weapon/claymore/highlander/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// weaponry.dm:84
rt.def("/obj/item/weapon/claymore/highlander/proc/Destroy", function* Destroy(f: Frame) {
	if (this.nuke_disk) {
		yield* this.nuke_disk.forceMove(rt.getStep(f, this, 0));
		this.nuke_disk.visible_message("<span class='warning'>The nuke disk is vulnerable!</span>");
		this.nuke_disk = null;
	}
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return (yield* parent_proc());
}, true);

// weaponry.dm:91
rt.def("/obj/item/weapon/claymore/highlander/proc/process", function* process(f: Frame) {
	let H: Value = null;
	if (rt.istype(this.loc, T("/mob/living/carbon/human"))) {
		H = this.loc;
		this.loc.layer = LARGE_MOB_LAYER;
		H.bleedsuppress = 1;
	} else {
		if (this.admin_spawned) return f.dot;
		yield* qdel(this);
	}
	return f.dot;
}, true, { waitfor: false });

// weaponry.dm:101
rt.def("/obj/item/weapon/claymore/highlander/proc/pickup", function pickup(f: Frame, user: Value) {
	to_chat(user, "<span class='notice'>The power of Scotland protects you! You are shielded from all stuns and knockdowns.</span>");
	user.add_stun_absorption("highlander", 1e+31, 1, " is protected by the power of Scotland!", "The power of Scotland absorbs the stun!", " is protected by the power of Scotland!");
	user.status_flags += 16;
	return f.dot;
});

// weaponry.dm:106
rt.def("/obj/item/weapon/claymore/highlander/proc/dropped", function* dropped(f: Frame, user: Value) {
	user.status_flags -= 16;
	yield* qdel(this);
	return f.dot;
}, true);

// weaponry.dm:110
rt.def("/obj/item/weapon/claymore/highlander/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	let $0: any = user;
	to_chat($0, `It has ${!this.notches ? "nothing" : `${this.notches} notches`} scratched into the blade.`);
	if (!this.nuke_disk) return f.dot;
	to_chat(user, "<span class='boldwarning'>It's holding the nuke disk!</span>");
	return f.dot;
}, false);

// weaponry.dm:116
rt.def("/obj/item/weapon/claymore/highlander/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	f.dot = (yield* parent_proc());
	if (!(target && target.stat == 2 && target.mind && target.mind.special_role == "highlander")) return f.dot;
	yield* user.fully_heal();
	yield* this.add_notch(user);
	target.visible_message(`<span class='warning'>${target} crumbles to dust beneath ${user}'s blows!</span>`, "<span class='userdanger'>As you fall, your body crumbles to dust!</span>");
	yield* target.dust();
	return f.dot;
}, true);

// weaponry.dm:126
rt.def("/obj/item/weapon/claymore/highlander/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let closest_victim: Value = null, H: Value = null;
	let closest_distance: Value = 255;
	for (H of each(GLOB.player_list - user, T("/mob/living/carbon/human"))) {
		if (H.client && H.mind.special_role == "highlander" && (!closest_victim || get_dist(user, closest_victim) < closest_distance)) {
			closest_victim = H;
		}
	}
	if (!closest_victim) {
		to_chat(user, `<span class='warning'>${this} thrums for a moment and falls dark. Perhaps there's nobody nearby.</span>`);
		return f.dot;
	}
	to_chat(user, `<span class='danger'>${this} thrums and points to the ${dir2text(rt.getDir(f, user, closest_victim))}.</span>`);
	return f.dot;
});

// weaponry.dm:138
rt.def("/obj/item/weapon/claymore/highlander/proc/add_notch", function* add_notch(f: Frame, user: Value) {
	this.notches++;
	this.force++;
	let new_name: Value = this.name;
	if (this.notches === 1) {
		to_chat(user, `<span class='notice'>Your first kill - hopefully one of many. You scratch a notch into ${this}'s blade.</span>`);
		to_chat(user, "<span class='warning'>You feel your fallen foe's soul entering your blade, restoring your wounds!</span>");
		new_name = "notched claymore";
	} else if (this.notches === 2) {
		to_chat(user, "<span class='notice'>Another falls before you. Another soul fuses with your own. Another notch in the blade.</span>");
		new_name = "double-notched claymore";
		this.add_atom_colour("#ffebeb", ADMIN_COLOUR_PRIORITY);
	} else if (this.notches === 3) {
		to_chat(user, "<span class='notice'>You're beginning to</span> <span class='danger'><b>relish</b> the <b>thrill</b> of <b>battle.</b></span>");
		new_name = "triple-notched claymore";
		this.add_atom_colour("#ffd7d7", ADMIN_COLOUR_PRIORITY);
	} else if (this.notches === 4) {
		to_chat(user, "<span class='notice'>You've lost count of</span> <span class='boldannounce'>how many you've killed.</span>");
		new_name = "many-notched claymore";
		this.add_atom_colour("#ffc3c3", ADMIN_COLOUR_PRIORITY);
	} else if (this.notches === 5) {
		to_chat(user, "<span class='boldannounce'>Five voices now echo in your mind, cheering the slaughter.</span>");
		new_name = "battle-tested claymore";
		this.add_atom_colour("#ffafaf", ADMIN_COLOUR_PRIORITY);
	} else if (this.notches === 6) {
		to_chat(user, "<span class='boldannounce'>Is this what the vikings felt like? Visions of glory fill your head as you slay your sixth foe.</span>");
		new_name = "battle-scarred claymore";
		this.add_atom_colour("#ff9b9b", ADMIN_COLOUR_PRIORITY);
	} else if (this.notches === 7) {
		to_chat(user, "<span class='boldannounce'>Kill. Butcher. <i>Conquer.</i></span>");
		new_name = "vicious claymore";
		this.add_atom_colour("#ff8787", ADMIN_COLOUR_PRIORITY);
	} else if (this.notches === 8) {
		to_chat(user, "<span class='userdanger'>IT NEVER GETS OLD. THE <i>SCREAMING</i>. THE <i>BLOOD</i> AS IT <i>SPRAYS</i> ACROSS YOUR <i>FACE.</i></span>");
		new_name = "bloodthirsty claymore";
		this.add_atom_colour("#ff7373", ADMIN_COLOUR_PRIORITY);
	} else if (this.notches === 9) {
		to_chat(user, "<span class='userdanger'>ANOTHER ONE FALLS TO YOUR BLOWS. ANOTHER WEAKLING UNFIT TO LIVE.</span>");
		new_name = "gore-stained claymore";
		this.add_atom_colour("#ff5f5f", ADMIN_COLOUR_PRIORITY);
	} else if (this.notches === 10) {
		user.visible_message(`<span class='warning'>${user}'s eyes light up with a vengeful fire!</span>`, "<span class='userdanger'>YOU FEEL THE POWER OF VALHALLA FLOWING THROUGH YOU! <i>THERE CAN BE ONLY ONE!!!</i></span>");
		yield* user.update_icons();
		new_name = `GORE-DRENCHED CLAYMORE OF ${pick("THE WHIMSICAL SLAUGHTER", "A THOUSAND SLAUGHTERED CATTLE", "GLORY AND VALHALLA", "ANNIHILATION", "OBLITERATION")}`;
		this.icon_state = "claymore_valhalla";
		this.item_state = "cultblade";
		this.remove_atom_colour(ADMIN_COLOUR_PRIORITY);
	}
	this.name = new_name;
	playsound(user, rt.rsc("sound/items/screwdriver2.ogg"), 50, 1);
	return f.dot;
}, true);

rt.type(7384, "/obj/item/weapon/katana", "/obj/item/weapon", {
	flags: 64,
	name: "katana",
	desc: "Woefully underpowered in D20",
	icon_state: "katana",
	item_state: "katana",
	slot_flags: 1536,
	force: 40,
	throwforce: 10,
	w_class: 3,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	attack_verb: null,
	block_chance: 50,
	sharpness: 1,
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
	resistance_flags: 2,
});

// weaponry.dm:206
rt.def("/obj/item/weapon/katana/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut");
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]);
	return f.dot;
});

// weaponry.dm:213
rt.def("/obj/item/weapon/katana/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is slitting ${user.p_their()} stomach open with ${this}! It looks like ${user.p_theyre()} trying to commit seppuku!</span>`);
	return 1;
});

rt.type(7386, "/obj/item/weapon/wirerod", "/obj/item/weapon", {
	flags: 64,
	name: "wired rod",
	desc: "A rod with some wire wrapped around the top. It'd be easy to attach something to the top bit.",
	icon_state: "wiredrod",
	item_state: "rods",
	force: 9,
	throwforce: 10,
	w_class: 3,
	materials: null,
	attack_verb: null,
});

// weaponry.dm:225
rt.def("/obj/item/weapon/wirerod/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 1150, "$glass", 75]);
	this.attack_verb = list("hit", "bludgeoned", "whacked", "bonked");
	return f.dot;
});

// weaponry.dm:229
rt.def("/obj/item/weapon/wirerod/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let S: Value = null, _P: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/shard"))) {
		S = (yield* new_(T("/obj/item/weapon/twohanded/spear")));
		yield* this.remove_item_from_storage(user);
		yield* qdel(I);
		yield* qdel(this);
		yield* user.put_in_hands(S);
		to_chat(user, "<span class='notice'>You fasten the glass shard to the top of the rod with the cable.</span>");
	} else if (rt.istype(I, T("/obj/item/device/assembly/igniter")) && !rt.bitAnd(I.flags, NODROP)) {
		_P = (yield* new_(T("/obj/item/weapon/melee/baton/cattleprod")));
		yield* this.remove_item_from_storage(user);
		to_chat(user, `<span class='notice'>You fasten ${I} to the top of the rod with the cable.</span>`);
		yield* qdel(I);
		yield* qdel(this);
		yield* user.put_in_hands(_P);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(7387, "/obj/item/weapon/throwing_star", "/obj/item/weapon", {
	throw_speed: 4,
	name: "throwing star",
	desc: "An ancient weapon still used to this day due to it's ease of lodging itself into victim's body parts",
	icon_state: "throwingstar",
	item_state: "eshield0",
	force: 2,
	throwforce: 20,
	embedded_pain_multiplier: 4,
	w_class: 2,
	embed_chance: 100,
	embedded_fall_chance: 0,
	sharpness: 1,
	materials: null,
	resistance_flags: 2,
});

// weaponry.dm:267
rt.def("/obj/item/weapon/throwing_star/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 500, "$glass", 500]);
	return f.dot;
});

rt.type(7389, "/obj/item/weapon/switchblade", "/obj/item/weapon", {
	extended: 0,
	flags: 64,
	throw_speed: 3,
	throw_range: 6,
	name: "switchblade",
	icon_state: "switchblade",
	desc: "A sharp, concealable, spring-loaded knife.",
	force: 3,
	w_class: 2,
	throwforce: 5,
	materials: null,
	origin_tech: "engineering=3;combat=2",
	hitsound: rt.rsc("sound/weapons/genhit.ogg"),
	attack_verb: null,
	resistance_flags: 2,
});

// weaponry.dm:281
rt.def("/obj/item/weapon/switchblade/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 12000]);
	this.attack_verb = list("stubbed", "poked");
	return f.dot;
});

// weaponry.dm:289
rt.def("/obj/item/weapon/switchblade/proc/attack_self", function attack_self(f: Frame, user: Value) {
	this.extended = (!this.extended ? 1 : 0);
	playsound(this.loc, rt.rsc("sound/weapons/batonextend.ogg"), 50, 1);
	if (this.extended) {
		this.force = 20;
		this.w_class = WEIGHT_CLASS_NORMAL;
		this.throwforce = 23;
		this.icon_state = "switchblade_ext";
		this.attack_verb = list("slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut");
		this.hitsound = rt.rsc("sound/weapons/bladeslice.ogg");
		this.sharpness = 1;
	} else {
		this.force = 3;
		this.w_class = WEIGHT_CLASS_SMALL;
		this.throwforce = 5;
		this.icon_state = "switchblade";
		this.attack_verb = list("stubbed", "poked");
		this.hitsound = rt.rsc("sound/weapons/genhit.ogg");
		this.sharpness = 0;
	}
	return f.dot;
});

// weaponry.dm:309
rt.def("/obj/item/weapon/switchblade/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is slitting ${user.p_their()} own throat with ${this}! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	return 1;
});

rt.type(7390, "/obj/item/weapon/phone", "/obj/item/weapon", {
	throw_speed: 3,
	throw_range: 4,
	name: "red phone",
	desc: "Should anything ever go wrong...",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "red_phone",
	force: 3,
	throwforce: 2,
	w_class: 2,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/ring.ogg"),
});

// weaponry.dm:326
rt.def("/obj/item/weapon/phone/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	if (rt.locateIn(f, T("/obj/structure/chair/stool"), user.loc)) {
		user.visible_message(`<span class='suicide'>${user} begins to tie a noose with ${this}'s cord! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	} else {
		user.visible_message(`<span class='suicide'>${user} is strangling ${user.p_them()}self with ${this}'s cord! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	}
	return 8;
});

rt.type(7391, "/obj/item/weapon/cane", "/obj/item/weapon", {
	name: "cane",
	desc: "A cane used by a true gentleman. Or a clown.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "cane",
	item_state: "stick",
	force: 5,
	throwforce: 5,
	w_class: 2,
	materials: null,
	attack_verb: null,
});

// weaponry.dm:341
rt.def("/obj/item/weapon/cane/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 50]);
	this.attack_verb = list("bludgeoned", "whacked", "disciplined", "thrashed");
	return f.dot;
});

rt.type(6669, "/obj/item/weapon/ectoplasm", "/obj/item/weapon", {
	name: "ectoplasm",
	desc: "spooky",
	gender: "plural",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "ectoplasm",
});

// weaponry.dm:385
rt.def("/obj/item/weapon/ectoplasm/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is inhaling ${this}! It looks like ${user.p_theyre()} trying to visit the astral plane.</span>`);
	return 8;
});

rt.type(7396, "/obj/item/weapon/mounted_chainsaw", "/obj/item/weapon", {
	flags: 16514,
	throw_range: 0,
	throw_speed: 0,
	name: "mounted chainsaw",
	desc: "A chainsaw that has replaced your arm.",
	icon_state: "chainsaw_on",
	item_state: "mounted_chainsaw",
	w_class: 5,
	force: 21,
	throwforce: 0,
	sharpness: 1,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/chainsawhit.ogg"),
});

// weaponry.dm:405
rt.def("/obj/item/weapon/mounted_chainsaw/proc/Destroy", function* Destroy(f: Frame) {
	let part: Value = null, holder: Value = null, index: Value = null;
	yield* new_(T("/obj/item/weapon/twohanded/required/chainsaw"), rt.getStep(f, this, 0));
	if (rt.istype(this.loc, T("/mob/living/carbon"))) {
		holder = this.loc;
		if (index = holder.get_held_index_of_item(this)) {
			part = rt.index(holder.hand_bodyparts, index);
		}
	}
	f.dot = (yield* parent_proc());
	if (!part) return f.dot;
	yield* part.drop_limb();
	return f.dot;
}, true);

rt.type(7397, "/obj/item/weapon/statuebust", "/obj/item/weapon", {
	throw_speed: 5,
	throw_range: 2,
	name: "bust",
	desc: "A priceless ancient marble bust, the kind that belongs in a museum.",
	icon: rt.rsc("icons/obj/statue.dmi"),
	icon_state: "bust",
	force: 15,
	throwforce: 10,
	attack_verb: null,
});

// weaponry.dm:424
rt.def("/obj/item/weapon/statuebust/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("busted");
	return f.dot;
});

rt.type(5668, "/obj/item/weapon/melee/skateboard", "/obj/item/weapon/melee", {
	name: "skateboard",
	desc: "A skateboard. It can be placed on its wheels and ridden, or used as a strong weapon.",
	icon_state: "skateboard",
	item_state: "skateboard",
	force: 12,
	throwforce: 4,
	w_class: 5,
	attack_verb: null,
});

// weaponry.dm:459
rt.def("/obj/item/weapon/melee/skateboard/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* new_(T("/obj/vehicle/scooter/skateboard"), rt.getStep(f, user, 0));
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(5669, "/obj/item/weapon/melee/baseball_bat", "/obj/item/weapon/melee", {
	homerun_ready: 0,
	homerun_able: 0,
	name: "baseball bat",
	desc: "There ain't a skull in the league that can withstand a swatter.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "baseball_bat",
	item_state: "baseball_bat",
	force: 10,
	throwforce: 12,
	attack_verb: null,
	w_class: 5,
});

// weaponry.dm:481
rt.def("/obj/item/weapon/melee/baseball_bat/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!this.homerun_able) {
		yield* parent_proc();
		return f.dot;
	}
	if (this.homerun_ready) {
		to_chat(user, "<span class='notice'>You're already ready to do a home run!</span>");
		yield* parent_proc();
		return f.dot;
	}
	to_chat(user, "<span class='warning'>You begin gathering strength...</span>");
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/magic/lightning_chargeup.ogg"), 65, 1);
	if (yield* do_after(user, 90, { target: this })) {
		to_chat(user, "<span class='userdanger'>You gather power! Time for a home run!</span>");
		this.homerun_ready = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// weaponry.dm:496
rt.def("/obj/item/weapon/melee/baseball_bat/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	f.dot = (yield* parent_proc());
	let throw_target: Value = get_edge_target_turf(target, user.dir);
	if (this.homerun_ready) {
		user.visible_message("<span class='userdanger'>It's a home run!</span>");
		yield* target.throw_at(throw_target, rand(8, 10), 14, user);
		yield* target.ex_act(2);
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/weapons/homerun.ogg"), 100, 1);
		this.homerun_ready = 0;
		return f.dot;
	} else {
		if (target.anchored) return f.dot;
		yield* target.throw_at(throw_target, rand(1, 2), 7, user);
	}
	return f.dot;
}, true);

rt.type(5671, "/obj/item/weapon/melee/baseball_bat/ablative", "/obj/item/weapon/melee/baseball_bat", {
	name: "metal baseball bat",
	desc: "This bat is made of highly reflective, highly armored material.",
	icon_state: "baseball_bat_metal",
	item_state: "baseball_bat_metal",
	force: 12,
	throwforce: 15,
});

// weaponry.dm:517
rt.def("/obj/item/weapon/melee/baseball_bat/ablative/proc/IsReflect", function IsReflect(f: Frame) {
	let picksound: Value = rand(1, 2);
	let turf: Value = rt.getStep(f, this, 0);
	if (picksound == 1) {
		playsound(turf, rt.rsc("sound/weapons/effects/batreflect1.ogg"), 50, 1);
	}
	if (picksound == 2) {
		playsound(turf, rt.rsc("sound/weapons/effects/batreflect2.ogg"), 50, 1);
	}
	return 1;
});

rt.type(5672, "/obj/item/weapon/melee/flyswatter", "/obj/item/weapon/melee", {
	strong_against: null,
	name: "Flyswatter",
	desc: "Useful for killing insects of all sizes.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "flyswatter",
	item_state: "flyswatter",
	force: 1,
	throwforce: 1,
	attack_verb: null,
	hitsound: rt.rsc("sound/effects/snap.ogg"),
	w_class: 2,
});

// weaponry.dm:540
rt.def("/obj/item/weapon/melee/flyswatter/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.strong_against = typecacheof(list(T("/mob/living/simple_animal/hostile/poison/bees"), T("/mob/living/simple_animal/butterfly"), T("/mob/living/simple_animal/cockroach"), T("/obj/item/queen_bee")));
	return f.dot;
}, true);

// weaponry.dm:551
rt.def("/obj/item/weapon/melee/flyswatter/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value) {
	let bug: Value = null;
	if (!proximity_flag) return f.dot;
	if (!is_type_in_typecache(target, this.strong_against)) return f.dot;
	yield* new_(T("/obj/effect/decal/cleanable/deadcockroach"), rt.getStep(f, target, 0));
	to_chat(user, `<span class='warning'>You easily splat the ${target}.</span>`);
	if (rt.istype(target, T("/mob/living"))) {
		yield* (bug = target).death(1);
	} else {
		yield* qdel(target);
	}
	return f.dot;
}, true);
