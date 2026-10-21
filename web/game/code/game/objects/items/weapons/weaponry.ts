// From code/game/objects/items/weapons/weaponry.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/weapon/banhammer/proc/<init>  (code/game/objects/items/weapons/weaponry.dm:13)
rt.def("/obj/item/weapon/banhammer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("banned"));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 70]));
	return f.dot;
});

// /obj/item/weapon/banhammer/proc/suicide_act  (code/game/objects/items/weapons/weaponry.dm:20)
rt.def("/obj/item/weapon/banhammer/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is hitting ＀self with ＀! It looks like ＀ trying to ban ＀self from life.</span>", [live(user), rt.callName(f, live(user), "p_them", []), live(f.src), rt.callName(f, live(user), "p_theyre", []), rt.callName(f, live(user), "p_them", [])])]);
	return 15;
});

// /obj/item/weapon/banhammer/proc/attack  (code/game/objects/items/weapons/weaponry.dm:24)
rt.def("/obj/item/weapon/banhammer/proc/attack", function attack(f: Frame, M: Value, user: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<font color='red'><b> You have been banned FOR NO REISIN by ＀<b></font>", [live(user)])]);
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<font color='red'>You have <b>BANNED</b> ＀</font>", [live(M)])]);
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/adminhelp.ogg"), 15]);
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

// /obj/item/weapon/sord/proc/suicide_act  (code/game/objects/items/weapons/weaponry.dm:41)
rt.def("/obj/item/weapon/sord/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is trying to impale ＀self with ＀! It might be a suicide attempt if it weren't so shitty.</span>", [live(user), rt.callName(f, live(user), "p_them", []), live(f.src)]), fmt("<span class='suicide'>You try to impale yourself with ＀, but it's USELESS...</span>", [live(f.src)])]);
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

// /obj/item/weapon/claymore/proc/<init>  (code/game/objects/items/weapons/weaponry.dm:61)
rt.def("/obj/item/weapon/claymore/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut"));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]));
	return f.dot;
});

// /obj/item/weapon/claymore/proc/suicide_act  (code/game/objects/items/weapons/weaponry.dm:65)
rt.def("/obj/item/weapon/claymore/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is falling on ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
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

// /obj/item/weapon/claymore/highlander/proc/New  (code/game/objects/items/weapons/weaponry.dm:79)  may sleep
rt.def("/obj/item/weapon/claymore/highlander/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/weapon/claymore/highlander/proc/Destroy  (code/game/objects/items/weapons/weaponry.dm:84)  may sleep
rt.def("/obj/item/weapon/claymore/highlander/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "nuke_disk"))) {
		yield* g.callName(f, rt.sv(f, "nuke_disk"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
		yield* g.callName(f, rt.sv(f, "nuke_disk"), "visible_message", ["<span class='warning'>The nuke disk is vulnerable!</span>"]);
		rt.setSv(f, "nuke_disk", null);
	}
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/claymore/highlander/proc/process  (code/game/objects/items/weapons/weaponry.dm:91)  may sleep
rt.def("/obj/item/weapon/claymore/highlander/proc/process", function* process(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = rt.sv(f, "loc");
		rt.setFv(f, "layer", rt.sv(f, "loc"), 4.400000095367432);
		rt.setFv(f, "bleedsuppress", live(H), 1);
	} else {
		if (truthy(rt.sv(f, "admin_spawned"))) return f.dot;
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/claymore/highlander/proc/pickup  (code/game/objects/items/weapons/weaponry.dm:101)
rt.def("/obj/item/weapon/claymore/highlander/proc/pickup", function pickup(f: Frame, user: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The power of Scotland protects you! You are shielded from all stuns and knockdowns.</span>"]);
	rt.callName(f, live(user), "add_stun_absorption", ["highlander", 9.999999848243207e+30, 1, " is protected by the power of Scotland!", "The power of Scotland absorbs the stun!", " is protected by the power of Scotland!"]);
	rt.modField(f, live(user), "status_flags", 16, add);
	return f.dot;
});

// /obj/item/weapon/claymore/highlander/proc/dropped  (code/game/objects/items/weapons/weaponry.dm:106)  may sleep
rt.def("/obj/item/weapon/claymore/highlander/proc/dropped", function* dropped(f: Frame, user: Value) {
	f.vars = () => [user];
	(rt.modField(f, live(user), "status_flags", 16, subtract));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/claymore/highlander/proc/examine  (code/game/objects/items/weapons/weaponry.dm:110)
rt.def("/obj/item/weapon/claymore/highlander/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if (!truthy(rt.sv(f, "notches"))) {
		$1 = "nothing";
	} else {
		$1 = fmt("＀ notches", [rt.sv(f, "notches")]);
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("It has ＀ scratched into the blade.", [$1])]);
	if (!truthy(rt.sv(f, "nuke_disk"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='boldwarning'>It's holding the nuke disk!</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/claymore/highlander/proc/attack  (code/game/objects/items/weapons/weaponry.dm:116)  may sleep
rt.def("/obj/item/weapon/claymore/highlander/proc/attack", function* attack(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(((truthy(live(f.args[0])) && isEqual(rt.fv(f, "stat", live(f.args[0])), 2)) && truthy(rt.fv(f, "mind", live(f.args[0])))) && isEqual(rt.gv(f, "special_role", rt.fv(f, "mind", live(f.args[0]))), "highlander"))) return f.dot;
	yield* g.callName(f, live(f.args[1]), "fully_heal", []);
	yield* g.srcCall(f, "add_notch", live(f.args[1]));
	yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>＀ crumbles to dust beneath ＀'s blows!</span>", [live(f.args[0]), live(f.args[1])]), "<span class='userdanger'>As you fall, your body crumbles to dust!</span>"]);
	yield* g.callName(f, live(f.args[0]), "dust", []);
	return f.dot;
}, true, { args: ["target", "user"] });

// /obj/item/weapon/claymore/highlander/proc/attack_self  (code/game/objects/items/weapons/weaponry.dm:126)
rt.def("/obj/item/weapon/claymore/highlander/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let closest_victim: Value = null, closest_distance: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [closest_victim, closest_distance, H, $e];
	closest_victim = null;
	closest_distance = 255;
	H = null;
	rt.forList(f, 0, subtract(rt.gl("player_list"), live(user)), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (((truthy(rt.fv(f, "client", live(H))) && isEqual(rt.gv(f, "special_role", rt.fv(f, "mind", live(H))), "highlander")) && (!truthy(live(closest_victim)) || rt.lt(rt.call(f, P("/proc/get_dist"), null, [live(user), live(closest_victim)]), live(closest_distance))))) {
			closest_victim = live(H);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(closest_victim))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ thrums for a moment and falls dark. Perhaps there's nobody nearby.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>＀ thrums and points to the ＀.</span>", [live(f.src), rt.call(f, P("/proc/dir2text"), null, [rt.getDir(f, live(user), live(closest_victim))])])]);
	return f.dot;
});

// /obj/item/weapon/claymore/highlander/proc/add_notch  (code/game/objects/items/weapons/weaponry.dm:138)  may sleep
rt.def("/obj/item/weapon/claymore/highlander/proc/add_notch", function* add_notch(f: Frame, user: Value) {
	let new_name: Value = null;
	let $0: any;
	f.vars = () => [user, new_name, $0];
	rt.incSrcVar(f, "notches", 1, true);
	rt.incSrcVar(f, "force", 1, true);
	new_name = rt.sv(f, "name");
	$0 = rt.sv(f, "notches");
	if ($0 === 1) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>Your first kill - hopefully one of many. You scratch a notch into ＀'s blade.</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You feel your fallen foe's soul entering your blade, restoring your wounds!</span>"]);
		new_name = "notched claymore";
	} else if ($0 === 2) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Another falls before you. Another soul fuses with your own. Another notch in the blade.</span>"]);
		new_name = "double-notched claymore";
		yield* g.srcCall(f, "add_atom_colour", "#ffebeb", 1);
	} else if ($0 === 3) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You're beginning to</span> <span class='danger'><b>relish</b> the <b>thrill</b> of <b>battle.</b></span>"]);
		new_name = "triple-notched claymore";
		yield* g.srcCall(f, "add_atom_colour", "#ffd7d7", 1);
	} else if ($0 === 4) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You've lost count of</span> <span class='boldannounce'>how many you've killed.</span>"]);
		new_name = "many-notched claymore";
		yield* g.srcCall(f, "add_atom_colour", "#ffc3c3", 1);
	} else if ($0 === 5) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='boldannounce'>Five voices now echo in your mind, cheering the slaughter.</span>"]);
		new_name = "battle-tested claymore";
		yield* g.srcCall(f, "add_atom_colour", "#ffafaf", 1);
	} else if ($0 === 6) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='boldannounce'>Is this what the vikings felt like? Visions of glory fill your head as you slay your sixth foe.</span>"]);
		new_name = "battle-scarred claymore";
		yield* g.srcCall(f, "add_atom_colour", "#ff9b9b", 1);
	} else if ($0 === 7) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='boldannounce'>Kill. Butcher. <i>Conquer.</i></span>"]);
		new_name = "vicious claymore";
		yield* g.srcCall(f, "add_atom_colour", "#ff8787", 1);
	} else if ($0 === 8) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='userdanger'>IT NEVER GETS OLD. THE <i>SCREAMING</i>. THE <i>BLOOD</i> AS IT <i>SPRAYS</i> ACROSS YOUR <i>FACE.</i></span>"]);
		new_name = "bloodthirsty claymore";
		yield* g.srcCall(f, "add_atom_colour", "#ff7373", 1);
	} else if ($0 === 9) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='userdanger'>ANOTHER ONE FALLS TO YOUR BLOWS. ANOTHER WEAKLING UNFIT TO LIVE.</span>"]);
		new_name = "gore-stained claymore";
		yield* g.srcCall(f, "add_atom_colour", "#ff5f5f", 1);
	} else if ($0 === 10) {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀'s eyes light up with a vengeful fire!</span>", [live(user)]), "<span class='userdanger'>YOU FEEL THE POWER OF VALHALLA FLOWING THROUGH YOU! <i>THERE CAN BE ONLY ONE!!!</i></span>"]);
		yield* g.callName(f, live(user), "update_icons", []);
		new_name = fmt("GORE-DRENCHED CLAYMORE OF ＀", [rt.op(f, "PickUnweighted", [5], ["THE WHIMSICAL SLAUGHTER", "A THOUSAND SLAUGHTERED CATTLE", "GLORY AND VALHALLA", "ANNIHILATION", "OBLITERATION"])]);
		rt.setSv(f, "icon_state", "claymore_valhalla");
		rt.setSv(f, "item_state", "cultblade");
		yield* g.srcCall(f, "remove_atom_colour", 1);
	}
	rt.setSv(f, "name", live(new_name));
	yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/items/screwdriver2.ogg"), 50, 1]);
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

// /obj/item/weapon/katana/proc/<init>  (code/game/objects/items/weapons/weaponry.dm:206)
rt.def("/obj/item/weapon/katana/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut"));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]));
	return f.dot;
});

// /obj/item/weapon/katana/proc/suicide_act  (code/game/objects/items/weapons/weaponry.dm:213)
rt.def("/obj/item/weapon/katana/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is slitting ＀ stomach open with ＀! It looks like ＀ trying to commit seppuku!</span>", [live(user), rt.callName(f, live(user), "p_their", []), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
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

// /obj/item/weapon/wirerod/proc/<init>  (code/game/objects/items/weapons/weaponry.dm:225)
rt.def("/obj/item/weapon/wirerod/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1150, "$glass", 75]));
	rt.setSv(f, "attack_verb", rt.list("hit", "bludgeoned", "whacked", "bonked"));
	return f.dot;
});

// /obj/item/weapon/wirerod/proc/attackby  (code/game/objects/items/weapons/weaponry.dm:229)  may sleep
rt.def("/obj/item/weapon/wirerod/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null, _P: Value = null;
	f.vars = () => [S, _P];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/shard")) ? 1 : 0))) {
		S = (yield* g.new_(f, T("/obj/item/weapon/twohanded/spear"), []));
		yield* g.srcCall(f, "remove_item_from_storage", live(f.args[1]));
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		yield* g.callName(f, live(f.args[1]), "put_in_hands", [live(S)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You fasten the glass shard to the top of the rod with the cable.</span>"]);
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/device/assembly/igniter")) ? 1 : 0)) && !truthy(rt.bitAnd(rt.fv(f, "flags", live(f.args[0])), 2)))) {
			_P = (yield* g.new_(f, T("/obj/item/weapon/melee/baton/cattleprod"), []));
			yield* g.srcCall(f, "remove_item_from_storage", live(f.args[1]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You fasten ＀ to the top of the rod with the cable.</span>", [live(f.args[0])])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			yield* g.callName(f, live(f.args[1]), "put_in_hands", [live(_P)]);
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

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

// /obj/item/weapon/throwing_star/proc/<init>  (code/game/objects/items/weapons/weaponry.dm:267)
rt.def("/obj/item/weapon/throwing_star/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500, "$glass", 500]));
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

// /obj/item/weapon/switchblade/proc/<init>  (code/game/objects/items/weapons/weaponry.dm:281)
rt.def("/obj/item/weapon/switchblade/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 12000]));
	rt.setSv(f, "attack_verb", rt.list("stubbed", "poked"));
	return f.dot;
});

// /obj/item/weapon/switchblade/proc/attack_self  (code/game/objects/items/weapons/weaponry.dm:289)
rt.def("/obj/item/weapon/switchblade/proc/attack_self", function attack_self(f: Frame, user: Value) {
	rt.setSv(f, "extended", (!truthy(rt.sv(f, "extended")) ? 1 : 0));
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/batonextend.ogg"), 50, 1]);
	if (truthy(rt.sv(f, "extended"))) {
		rt.setSv(f, "force", 20);
		rt.setSv(f, "w_class", 3);
		rt.setSv(f, "throwforce", 23);
		rt.setSv(f, "icon_state", "switchblade_ext");
		rt.setSv(f, "attack_verb", rt.list("slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut"));
		rt.setSv(f, "hitsound", rt.rsc("sound/weapons/bladeslice.ogg"));
		rt.setSv(f, "sharpness", 1);
	} else {
		rt.setSv(f, "force", 3);
		rt.setSv(f, "w_class", 2);
		rt.setSv(f, "throwforce", 5);
		rt.setSv(f, "icon_state", "switchblade");
		rt.setSv(f, "attack_verb", rt.list("stubbed", "poked"));
		rt.setSv(f, "hitsound", rt.rsc("sound/weapons/genhit.ogg"));
		rt.setSv(f, "sharpness", 0);
	}
	return f.dot;
});

// /obj/item/weapon/switchblade/proc/suicide_act  (code/game/objects/items/weapons/weaponry.dm:309)
rt.def("/obj/item/weapon/switchblade/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is slitting ＀ own throat with ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.callName(f, live(user), "p_their", []), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
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

// /obj/item/weapon/phone/proc/suicide_act  (code/game/objects/items/weapons/weaponry.dm:326)
rt.def("/obj/item/weapon/phone/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	if (truthy(rt.locateIn(f, T("/obj/structure/chair/stool"), rt.fv(f, "loc", live(user))))) {
		rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ begins to tie a noose with ＀'s cord! It looks like ＀ trying to commit suicide!</span>", [live(user), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
	} else {
		rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is strangling ＀self with ＀'s cord! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.callName(f, live(user), "p_them", []), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
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

// /obj/item/weapon/cane/proc/<init>  (code/game/objects/items/weapons/weaponry.dm:341)
rt.def("/obj/item/weapon/cane/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50]));
	rt.setSv(f, "attack_verb", rt.list("bludgeoned", "whacked", "disciplined", "thrashed"));
	return f.dot;
});

rt.type(6669, "/obj/item/weapon/ectoplasm", "/obj/item/weapon", {
	name: "ectoplasm",
	desc: "spooky",
	gender: "plural",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "ectoplasm",
});

// /obj/item/weapon/ectoplasm/proc/suicide_act  (code/game/objects/items/weapons/weaponry.dm:385)
rt.def("/obj/item/weapon/ectoplasm/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is inhaling ＀! It looks like ＀ trying to visit the astral plane.</span>", [live(user), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
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

// /obj/item/weapon/mounted_chainsaw/proc/Destroy  (code/game/objects/items/weapons/weaponry.dm:405)  may sleep
rt.def("/obj/item/weapon/mounted_chainsaw/proc/Destroy", function* Destroy(f: Frame) {
	let part: Value = null, holder: Value = null, index: Value = null;
	f.vars = () => [part, holder, index];
	part = null;
	yield* g.new_(f, T("/obj/item/weapon/twohanded/required/chainsaw"), [rt.getStep(f, live(f.src), 0)]);
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon")) ? 1 : 0))) {
		holder = rt.sv(f, "loc");
		if (truthy((index = (yield* g.callName(f, live(holder), "get_held_index_of_item", [live(f.src)]))))) {
			part = rt.index(rt.fv(f, "hand_bodyparts", live(holder)), live(index));
		}
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(part))) return f.dot;
	yield* g.callName(f, live(part), "drop_limb", []);
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

// /obj/item/weapon/statuebust/proc/<init>  (code/game/objects/items/weapons/weaponry.dm:424)
rt.def("/obj/item/weapon/statuebust/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("busted"));
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

// /obj/item/weapon/melee/skateboard/proc/attack_self  (code/game/objects/items/weapons/weaponry.dm:459)  may sleep
rt.def("/obj/item/weapon/melee/skateboard/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.new_(f, T("/obj/vehicle/scooter/skateboard"), [rt.getStep(f, live(user), 0)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
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

// /obj/item/weapon/melee/baseball_bat/proc/attack_self  (code/game/objects/items/weapons/weaponry.dm:481)  may sleep
rt.def("/obj/item/weapon/melee/baseball_bat/proc/attack_self", function* attack_self(f: Frame) {
	if (!truthy(rt.sv(f, "homerun_able"))) {
		yield* g.callSuper(f, [], rt.Args.Same);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "homerun_ready"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You're already ready to do a home run!</span>"]);
		yield* g.callSuper(f, [], rt.Args.Same);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You begin gathering strength...</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/magic/lightning_chargeup.ogg"), 65, 1]);
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[0]), null, 90, "target", live(f.src)], rt.Args.Named)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='userdanger'>You gather power! Time for a home run!</span>"]);
		rt.setSv(f, "homerun_ready", 1);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/melee/baseball_bat/proc/attack  (code/game/objects/items/weapons/weaponry.dm:496)  may sleep
rt.def("/obj/item/weapon/melee/baseball_bat/proc/attack", function* attack(f: Frame) {
	let throw_target: Value = null;
	f.vars = () => [throw_target];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	throw_target = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(f.args[0]), rt.fv(f, "dir", live(f.args[1]))]));
	if (truthy(rt.sv(f, "homerun_ready"))) {
		yield* g.callName(f, live(f.args[1]), "visible_message", ["<span class='userdanger'>It's a home run!</span>"]);
		yield* g.callName(f, live(f.args[0]), "throw_at", [live(throw_target), (yield* g.call(f, P("/proc/rand"), null, [8, 10])), 14, live(f.args[1])]);
		yield* g.callName(f, live(f.args[0]), "ex_act", [2]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/weapons/homerun.ogg"), 100, 1]);
		rt.setSv(f, "homerun_ready", 0);
		return live(f.dot);
	} else {
		if (truthy(rt.fv(f, "anchored", live(f.args[0])))) return f.dot;
		yield* g.callName(f, live(f.args[0]), "throw_at", [live(throw_target), (yield* g.call(f, P("/proc/rand"), null, [1, 2])), 7, live(f.args[1])]);
	}
	return f.dot;
}, true, { args: ["target", "user"] });

rt.type(5671, "/obj/item/weapon/melee/baseball_bat/ablative", "/obj/item/weapon/melee/baseball_bat", {
	name: "metal baseball bat",
	desc: "This bat is made of highly reflective, highly armored material.",
	icon_state: "baseball_bat_metal",
	item_state: "baseball_bat_metal",
	force: 12,
	throwforce: 15,
});

// /obj/item/weapon/melee/baseball_bat/ablative/proc/IsReflect  (code/game/objects/items/weapons/weaponry.dm:517)
rt.def("/obj/item/weapon/melee/baseball_bat/ablative/proc/IsReflect", function IsReflect(f: Frame) {
	let picksound: Value = null, turf: Value = null;
	f.vars = () => [picksound, turf];
	picksound = rt.call(f, P("/proc/rand"), null, [1, 2]);
	turf = rt.getStep(f, live(f.src), 0);
	if (isEqual(live(picksound), 1)) {
		rt.call(f, P("/proc/playsound"), null, [live(turf), rt.rsc("sound/weapons/effects/batreflect1.ogg"), 50, 1]);
	}
	if (isEqual(live(picksound), 2)) {
		rt.call(f, P("/proc/playsound"), null, [live(turf), rt.rsc("sound/weapons/effects/batreflect2.ogg"), 50, 1]);
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

// /obj/item/weapon/melee/flyswatter/proc/New  (code/game/objects/items/weapons/weaponry.dm:540)  may sleep
rt.def("/obj/item/weapon/melee/flyswatter/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "strong_against", (yield* g.call(f, P("/proc/typecacheof"), null, [rt.list(T("/mob/living/simple_animal/hostile/poison/bees"), T("/mob/living/simple_animal/butterfly"), T("/mob/living/simple_animal/cockroach"), T("/obj/item/queen_bee"))])));
	return f.dot;
}, true);

// /obj/item/weapon/melee/flyswatter/proc/afterattack  (code/game/objects/items/weapons/weaponry.dm:551)  may sleep
rt.def("/obj/item/weapon/melee/flyswatter/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value) {
	let bug: Value = null;
	f.vars = () => [target, user, proximity_flag, bug];
	if (!truthy(live(proximity_flag))) return f.dot;
	if (!truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(target), rt.sv(f, "strong_against")])))) return f.dot;
	yield* g.new_(f, T("/obj/effect/decal/cleanable/deadcockroach"), [rt.getStep(f, live(target), 0)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You easily splat the ＀.</span>", [live(target)])]);
	if (truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0))) {
		yield* g.callName(f, (bug = live(target)), "death", [1]);
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [live(target)]);
	}
	return f.dot;
}, true);
