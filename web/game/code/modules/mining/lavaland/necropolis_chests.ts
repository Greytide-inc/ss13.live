// From code/modules/mining/lavaland/necropolis_chests.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12282, "/obj/structure/closet/crate/necropolis/tendril", "/obj/structure/closet/crate/necropolis", {
	desc: "It's watching you suspiciously.",
});

// /obj/structure/closet/crate/necropolis/tendril/proc/PopulateContents  (code/modules/mining/lavaland/necropolis_chests.dm:14)  may sleep
rt.def("/obj/structure/closet/crate/necropolis/tendril/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let loot: Value = null;
	let $0: any;
	f.vars = () => [loot, $0];
	$0 = (loot = (yield* g.call(f, P("/proc/rand"), null, [1, 28])));
	if ($0 === 1) {
		yield* g.new_(f, T("/obj/item/device/shared_storage/red"), [live(f.src)]);
	} else if ($0 === 2) {
		yield* g.new_(f, T("/obj/item/clothing/suit/space/hardsuit/cult"), [live(f.src)]);
	} else if ($0 === 3) {
		yield* g.new_(f, T("/obj/item/device/soulstone/anybody"), [live(f.src)]);
	} else if ($0 === 4) {
		yield* g.new_(f, T("/obj/item/weapon/katana/cursed"), [live(f.src)]);
	} else if ($0 === 5) {
		yield* g.new_(f, T("/obj/item/clothing/glasses/godeye"), [live(f.src)]);
	} else if ($0 === 6) {
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/bottle/potion/flight"), [live(f.src)]);
	} else if ($0 === 7) {
		yield* g.new_(f, T("/obj/item/weapon/pickaxe/diamond"), [live(f.src)]);
	} else if ($0 === 8) {
		yield* g.new_(f, T("/obj/item/weapon/disk/design_disk/modkit_disc/resonator_blast"), [live(f.src)]);
	} else if ($0 === 9) {
		yield* g.new_(f, T("/obj/item/organ/brain/alien"), [live(f.src)]);
	} else if ($0 === 10) {
		yield* g.new_(f, T("/obj/item/organ/heart/cursed/wizard"), [live(f.src)]);
	} else if ($0 === 11) {
		yield* g.new_(f, T("/obj/item/ship_in_a_bottle"), [live(f.src)]);
	} else if ($0 === 12) {
		yield* g.new_(f, T("/obj/item/clothing/suit/space/hardsuit/ert/paranormal/beserker"), [live(f.src)]);
	} else if ($0 === 13) {
		yield* g.new_(f, T("/obj/item/weapon/disk/design_disk/modkit_disc/rapid_repeater"), [live(f.src)]);
	} else if ($0 === 14) {
		yield* g.new_(f, T("/obj/item/weapon/nullrod/scythe/talking"), [live(f.src)]);
	} else if ($0 === 15) {
		yield* g.new_(f, T("/obj/item/weapon/nullrod/armblade"), [live(f.src)]);
	} else if ($0 === 16) {
		yield* g.new_(f, T("/obj/item/weapon/guardiancreator"), [live(f.src)]);
	} else if ($0 === 17) {
		yield* g.new_(f, T("/obj/item/weapon/disk/design_disk/modkit_disc/mob_and_turf_aoe"), [live(f.src)]);
	} else if ($0 === 18) {
		yield* g.new_(f, T("/obj/item/device/warp_cube/red"), [live(f.src)]);
	} else if ($0 === 19) {
		yield* g.new_(f, T("/obj/item/device/wisp_lantern"), [live(f.src)]);
	} else if ($0 === 20) {
		yield* g.new_(f, T("/obj/item/device/immortality_talisman"), [live(f.src)]);
	} else if ($0 === 21) {
		yield* g.new_(f, T("/obj/item/weapon/gun/magic/hook"), [live(f.src)]);
	} else if ($0 === 22) {
		yield* g.new_(f, T("/obj/item/voodoo"), [live(f.src)]);
	} else if ($0 === 23) {
		yield* g.new_(f, T("/obj/item/weapon/grenade/clusterbuster/inferno"), [live(f.src)]);
	} else if ($0 === 24) {
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/drinks/bottle/holywater/hell"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/clothing/suit/space/hardsuit/ert/paranormal/inquisitor"), [live(f.src)]);
	} else if ($0 === 25) {
		yield* g.new_(f, T("/obj/item/weapon/spellbook/oneuse/summonitem"), [live(f.src)]);
	} else if ($0 === 26) {
		yield* g.new_(f, T("/obj/item/book_of_babel"), [live(f.src)]);
	} else if ($0 === 27) {
		yield* g.new_(f, T("/obj/item/borg/upgrade/modkit/lifesteal"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/bedsheet/cult"), [live(f.src)]);
	} else if ($0 === 28) {
		yield* g.new_(f, T("/obj/item/weapon/disk/design_disk/modkit_disc/bounty"), [live(f.src)]);
	}
	return f.dot;
}, true);

rt.type(6677, "/obj/item/weapon/disk/design_disk/modkit_disc", "/obj/item/weapon/disk/design_disk", {
	modkit_design: rt.typePath("/datum/design/unique_modkit"),
	name: "KA Mod Disk",
	desc: "A design disc containing the design for a unique kinetic accelerator modkit.",
	icon_state: "datadisk1",
});

// /obj/item/weapon/disk/design_disk/modkit_disc/proc/Initialize  (code/modules/mining/lavaland/necropolis_chests.dm:83)  may sleep
rt.def("/obj/item/weapon/disk/design_disk/modkit_disc/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setAt(rt.sv(f, "blueprints"), 1, (yield* g.new_(f, rt.sv(f, "modkit_design"), [])));
	return f.dot;
}, true);

rt.type(2806, "/datum/design/unique_modkit", "/datum/design", {
	category: null,
	req_tech: null,
	build_type: 18,
});

// /datum/design/unique_modkit/proc/<init>  (code/modules/mining/lavaland/necropolis_chests.dm:104)
rt.def("/datum/design/unique_modkit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "category", rt.list("Mining Designs", "Cyborg Upgrade Modules"));
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 12]));
	return f.dot;
});

rt.type(2807, "/datum/design/unique_modkit/offensive_turf_aoe", "/datum/design/unique_modkit", {
	name: "Kinetic Accelerator Offensive Mining Explosion Mod",
	desc: "A device which causes kinetic accelerators to fire AoE blasts that destroy rock and damage creatures.",
	id: "hyperaoemod",
	materials: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/modkit/aoe/turfs/andmobs"),
});

// /datum/design/unique_modkit/offensive_turf_aoe/proc/<init>  (code/modules/mining/lavaland/necropolis_chests.dm:111)
rt.def("/datum/design/unique_modkit/offensive_turf_aoe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 7000, "$glass", 3000, "$silver", 3000, "$gold", 3000, "$diamond", 4000]));
	return f.dot;
});

rt.type(2808, "/datum/design/unique_modkit/rapid_repeater", "/datum/design/unique_modkit", {
	name: "Kinetic Accelerator Rapid Repeater Mod",
	desc: "A device which greatly reduces a kinetic accelerator's cooldown on striking a living target or rock, but greatly increases its base cooldown.",
	id: "repeatermod",
	materials: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/modkit/cooldown/repeater"),
});

// /datum/design/unique_modkit/rapid_repeater/proc/<init>  (code/modules/mining/lavaland/necropolis_chests.dm:118)
rt.def("/datum/design/unique_modkit/rapid_repeater/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 5000, "$glass", 5000, "$uranium", 8000, "$bluespace", 2000]));
	return f.dot;
});

rt.type(2809, "/datum/design/unique_modkit/resonator_blast", "/datum/design/unique_modkit", {
	name: "Kinetic Accelerator Resonator Blast Mod",
	desc: "A device which causes kinetic accelerators to fire shots that leave and detonate resonator blasts.",
	id: "resonatormod",
	materials: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/modkit/resonator_blasts"),
});

// /datum/design/unique_modkit/resonator_blast/proc/<init>  (code/modules/mining/lavaland/necropolis_chests.dm:125)
rt.def("/datum/design/unique_modkit/resonator_blast/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 5000, "$glass", 5000, "$silver", 5000, "$uranium", 5000]));
	return f.dot;
});

rt.type(2810, "/datum/design/unique_modkit/bounty", "/datum/design/unique_modkit", {
	name: "Kinetic Accelerator Death Syphon Mod",
	desc: "A device which causes kinetic accelerators to permenantly gain damage against creature types killed with it.",
	id: "bountymod",
	materials: null,
	reagents_list: null,
	build_path: rt.typePath("/obj/item/borg/upgrade/modkit/bounty"),
});

// /datum/design/unique_modkit/bounty/proc/<init>  (code/modules/mining/lavaland/necropolis_chests.dm:132)
rt.def("/datum/design/unique_modkit/bounty/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 4000, "$silver", 4000, "$gold", 4000, "$bluespace", 4000]));
	rt.setSv(f, "reagents_list", rt.alist(f, ["blood", 40]));
	return f.dot;
});

rt.type(9403, "/obj/item/device/wisp_lantern", "/obj/item/device", {
	wisp: null,
	name: "spooky lantern",
	desc: "This lantern gives off no light, but is home to a friendly wisp.",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "lantern-blue",
});

// /obj/item/device/wisp_lantern/proc/attack_self  (code/modules/mining/lavaland/necropolis_chests.dm:145)  may sleep
rt.def("/obj/item/device/wisp_lantern/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let A: Value = null, M: Value = null;
	f.vars = () => [user, A, M];
	if (!truthy(rt.sv(f, "wisp"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The wisp has gone missing!</span>"]);
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "loc", rt.sv(f, "wisp")), live(f.src))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You release the wisp. It begins to bob around your head.</span>"]);
		(rt.modField(f, live(user), "sight", 4, rt.bitOr));
		rt.setSv(f, "icon_state", "lantern");
		yield* g.callName(f, rt.sv(f, "wisp"), "orbit", [live(user), 20]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You return the wisp to the lantern.</span>"]);
		if (truthy(rt.fv(f, "orbiting", rt.sv(f, "wisp")))) {
			if (truthy((rt.istype((A = rt.gv(f, "orbiting", rt.fv(f, "orbiting", rt.sv(f, "wisp")))), T("/mob/living")) ? 1 : 0))) {
				(rt.modField(f, (M = live(A)), "sight", 16777211, rt.bitAnd));
				yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='notice'>Your vision returns to normal.</span>"]);
			}
		}
		yield* g.callName(f, rt.sv(f, "wisp"), "stop_orbit", []);
		rt.setFv(f, "loc", rt.sv(f, "wisp"), live(f.src));
		rt.setSv(f, "icon_state", "lantern-blue");
	}
	return f.dot;
}, true);

// /obj/item/device/wisp_lantern/proc/Initialize  (code/modules/mining/lavaland/necropolis_chests.dm:171)  may sleep
rt.def("/obj/item/device/wisp_lantern/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "wisp", (yield* g.new_(f, T("/obj/effect/wisp"), [live(f.src)])));
	return f.dot;
}, true);

// /obj/item/device/wisp_lantern/proc/Destroy  (code/modules/mining/lavaland/necropolis_chests.dm:176)  may sleep
rt.def("/obj/item/device/wisp_lantern/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "wisp"))) {
		if (isEqual(rt.fv(f, "loc", rt.sv(f, "wisp")), live(f.src))) {
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "wisp")]);
		} else {
			yield* g.callName(f, rt.sv(f, "wisp"), "visible_message", [fmt("<span class='notice'>＀ has a sad feeling for a moment, then it passes.</span>", [rt.sv(f, "wisp")])]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(9404, "/obj/item/device/warp_cube", "/obj/item/device", {
	linked: null,
	name: "blue cube",
	desc: "A mysterious blue cube.",
	icon: rt.rsc("icons/obj/lavaland/artefacts.dmi"),
	icon_state: "blue_cube",
});

// /obj/item/device/warp_cube/proc/attack_self  (code/modules/mining/lavaland/necropolis_chests.dm:202)  may sleep
rt.def("/obj/item/device/warp_cube/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "linked"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ fizzles uselessly.", [live(f.src)])]);
		return live(f.dot);
	}
	yield* g.new_(f, T("/obj/effect/particle_effect/smoke"), [rt.fv(f, "loc", live(user))]);
	yield* g.callName(f, live(user), "forceMove", [rt.getStep(f, rt.sv(f, "linked"), 0)]);
	yield* g.new_(f, T("/obj/effect/particle_effect/smoke"), [rt.fv(f, "loc", live(user))]);
	return f.dot;
}, true);

rt.type(9405, "/obj/item/device/warp_cube/red", "/obj/item/device/warp_cube", {
	name: "red cube",
	desc: "A mysterious red cube.",
	icon_state: "red_cube",
});

// /obj/item/device/warp_cube/red/proc/Initialize  (code/modules/mining/lavaland/necropolis_chests.dm:216)  may sleep
rt.def("/obj/item/device/warp_cube/red/proc/Initialize", function* Initialize(f: Frame) {
	let blue: Value = null;
	f.vars = () => [blue];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "linked"))) return f.dot;
	rt.setSv(f, "linked", (blue = (yield* g.new_(f, T("/obj/item/device/warp_cube"), [rt.fv(f, "loc", live(f.src))]))));
	rt.setFv(f, "linked", live(blue), live(f.src));
	return f.dot;
}, true);

rt.type(8891, "/obj/item/projectile/hook", "/obj/item/projectile", {
	chain: null,
	pass_flags: 1,
	name: "hook",
	icon_state: "hook",
	icon: rt.rsc("icons/obj/lavaland/artefacts.dmi"),
	damage: 25,
	armour_penetration: 100,
	damage_type: "brute",
	hitsound: rt.rsc("sound/effects/splat.ogg"),
	knockdown: 30,
});

// /obj/item/projectile/hook/proc/fire  (code/modules/mining/lavaland/necropolis_chests.dm:255)  may sleep
rt.def("/obj/item/projectile/hook/proc/fire", function* fire(f: Frame) {
	if (truthy(rt.sv(f, "firer"))) {
		rt.setSv(f, "chain", (yield* g.callName(f, rt.sv(f, "firer"), "Beam", [null, live(f.src), "icon_state", "chain", "time", 9.999999848243207e+30, "maxdistance", 9.999999848243207e+30], rt.Args.Named)));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["setAngle"], waitfor: false });

// /obj/item/projectile/hook/proc/on_hit  (code/modules/mining/lavaland/necropolis_chests.dm:260)  may sleep
rt.def("/obj/item/projectile/hook/proc/on_hit", function* on_hit(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(live(f.args[0]), T("/atom/movable")) ? 1 : 0))) return f.dot;
	if (truthy(rt.gv(f, "anchored", (A = live(f.args[0]))))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(A), "visible_message", [fmt("<span class='danger'>＀ is snagged by ＀'s hook!</span>", [live(A), rt.sv(f, "firer")])]);
	yield* g.new_(f, T("/datum/forced_movement"), [live(A), rt.getStep(f, rt.sv(f, "firer"), 0), 5, 1]);
	return f.dot;
}, true, { args: ["target"] });

// /obj/item/projectile/hook/proc/Destroy  (code/modules/mining/lavaland/necropolis_chests.dm:271)  may sleep
rt.def("/obj/item/projectile/hook/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "chain")]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(9406, "/obj/item/device/immortality_talisman", "/obj/item/device", {
	cooldown: 0,
	name: "Immortality Talisman",
	desc: "A dread talisman that can render you completely invulnerable.",
	icon: rt.rsc("icons/obj/lavaland/artefacts.dmi"),
	icon_state: "talisman",
	actions_types: null,
});

// /obj/item/device/immortality_talisman/proc/<init>  (code/modules/mining/lavaland/necropolis_chests.dm:281)
rt.def("/obj/item/device/immortality_talisman/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/immortality")));
	return f.dot;
});

// /obj/item/device/immortality_talisman/proc/Destroy  (code/modules/mining/lavaland/necropolis_chests.dm:289)  may sleep
rt.def("/obj/item/device/immortality_talisman/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(live(f.args[0]))) {
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	} else {
		return 1;
	}
	return f.dot;
}, true, { args: ["force"] });

// /obj/item/device/immortality_talisman/proc/attack_self  (code/modules/mining/lavaland/necropolis_chests.dm:294)  may sleep
rt.def("/obj/item/device/immortality_talisman/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let Z: Value = null;
	f.vars = () => [user, Z];
	if (!rt.lt(rt.sv(f, "cooldown"), rt.worldTime(f))) return f.dot;
	rt.setSv(f, "cooldown", add(rt.worldTime(f), 600));
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ vanishes from reality, leaving a a hole in ＀ place!</span>", [live(user), (yield* g.callName(f, live(user), "p_their", []))])]);
	rt.setFv(f, "name", (Z = (yield* g.new_(f, T("/obj/effect/immortality_talisman"), [rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0)]))), "hole in reality");
	rt.setFv(f, "desc", live(Z), fmt("It's shaped an awful lot like ＀.", [rt.fv(f, "name", live(user))]));
	yield* g.callName(f, live(Z), "setDir", [rt.fv(f, "dir", live(user))]);
	yield* g.callName(f, live(user), "forceMove", [live(Z)]);
	rt.setFv(f, "notransform", live(user), 1);
	(rt.modField(f, live(user), "status_flags", 4096, rt.bitOr));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/device/immortality_talisman/proc/return_to_reality"), live(user), live(Z)])), 100]);
	return f.dot;
}, true);

// /obj/item/device/immortality_talisman/proc/return_to_reality  (code/modules/mining/lavaland/necropolis_chests.dm:308)  may sleep
rt.def("/obj/item/device/immortality_talisman/proc/return_to_reality", function* return_to_reality(f: Frame, user: Value, Z: Value) {
	f.vars = () => [user, Z];
	(rt.modField(f, live(user), "status_flags", 16773119, rt.bitAnd));
	rt.setFv(f, "notransform", live(user), 0);
	yield* g.callName(f, live(user), "forceMove", [rt.getStep(f, live(Z), 0)]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ pops back into reality!</span>", [live(user)])]);
	rt.setFv(f, "can_destroy", live(Z), 1);
	yield* g.call(f, P("/proc/qdel"), null, [live(Z)]);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }, { type: 4, path: "/obj/effect/immortality_talisman" }] });

rt.type(12084, "/obj/effect/immortality_talisman", "/obj/effect", {
	can_destroy: 0,
	icon_state: "blank",
	icon: rt.rsc("icons/effects/effects.dmi"),
});

// /obj/effect/immortality_talisman/proc/Destroy  (code/modules/mining/lavaland/necropolis_chests.dm:330)  may sleep
rt.def("/obj/effect/immortality_talisman/proc/Destroy", function* Destroy(f: Frame) {
	if ((!truthy(rt.sv(f, "can_destroy")) && !truthy(live(f.args[0])))) {
		return 1;
	} else {
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["force"] });

rt.type(9408, "/obj/item/device/shared_storage/red", "/obj/item/device/shared_storage", {
	name: "paradox bag",
	desc: "Somehow, it's in two places at once.",
});

// /obj/item/device/shared_storage/red/proc/Initialize  (code/modules/mining/lavaland/necropolis_chests.dm:363)  may sleep
rt.def("/obj/item/device/shared_storage/red/proc/Initialize", function* Initialize(f: Frame) {
	let S: Value = null, blue: Value = null;
	f.vars = () => [S, blue];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "bag"))) return f.dot;
	S = (yield* g.new_(f, T("/obj/item/weapon/storage/backpack/shared"), [live(f.src)]));
	blue = (yield* g.new_(f, T("/obj/item/device/shared_storage"), [rt.fv(f, "loc", live(f.src))]));
	rt.setFv(f, "bag", live(f.src), live(S));
	rt.setFv(f, "bag", live(blue), live(S));
	return f.dot;
}, true);

rt.type(9407, "/obj/item/device/shared_storage", "/obj/item/device", {
	bag: null,
	name: "paradox bag",
	desc: "Somehow, it's in two places at once.",
	icon: rt.rsc("icons/obj/storage.dmi"),
	icon_state: "cultpack",
	slot_flags: 1024,
});

// /obj/item/device/shared_storage/proc/attackby  (code/modules/mining/lavaland/necropolis_chests.dm:375)  may sleep
rt.def("/obj/item/device/shared_storage/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	f.vars = () => [W, user, params];
	if (!truthy(rt.sv(f, "bag"))) return f.dot;
	rt.setFv(f, "loc", rt.sv(f, "bag"), live(user));
	yield* g.callName(f, rt.sv(f, "bag"), "attackby", [live(W), live(user), live(params)]);
	return f.dot;
}, true);

// /obj/item/device/shared_storage/proc/attack_hand  (code/modules/mining/lavaland/necropolis_chests.dm:379)  may sleep
rt.def("/obj/item/device/shared_storage/proc/attack_hand", function* attack_hand(f: Frame) {
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (((isEqual(rt.sv(f, "loc"), live(f.args[0])) && truthy(rt.fv(f, "back", live(f.args[0])))) && isEqual(rt.fv(f, "back", live(f.args[0])), live(f.src)))) {
		if (truthy(rt.sv(f, "bag"))) {
			rt.setFv(f, "loc", rt.sv(f, "bag"), live(f.args[0]));
			yield* g.callName(f, rt.sv(f, "bag"), "attack_hand", [live(f.args[0])]);
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/device/shared_storage/proc/MouseDrop  (code/modules/mining/lavaland/necropolis_chests.dm:390)  may sleep
rt.def("/obj/item/device/shared_storage/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value) {
	let M: Value = null, H: Value = null;
	f.vars = () => [over_object, M, H];
	if (!(truthy((rt.istype(live(f.usr), T("/mob/living/carbon")) ? 1 : 0)) || truthy((rt.istype(live(f.usr), T("/mob/living/simple_animal/drone")) ? 1 : 0)))) return f.dot;
	M = live(f.usr);
	if (!truthy(live(over_object))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(rt.fv(f, "loc", live(f.usr)), T("/obj/mecha")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(M), "incapacitated", [])))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), "rustle", 50, 1, -5]);
	if (truthy((rt.istype(live(over_object), T("/obj/screen/inventory/hand")) ? 1 : 0))) {
		H = live(over_object);
		yield* g.callName(f, live(M), "putItemFromInventoryInHandIfPossible", [live(f.src), rt.fv(f, "held_index", live(H))]);
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	return f.dot;
}, true);

rt.type(10116, "/obj/item/book_of_babel", "/obj/item", {
	w_class: 2,
	name: "Book of Babel",
	desc: "An ancient tome written in countless tongues.",
	icon: rt.rsc("icons/obj/library.dmi"),
	icon_state: "book1",
});

// /obj/item/book_of_babel/proc/attack_self  (code/modules/mining/lavaland/necropolis_chests.dm:422)  may sleep
rt.def("/obj/item/book_of_babel/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "You flip through the pages of the book, quickly and conveniently learning every language in existence. Somewhat less conveniently, the aging book crumbles to dust in the process. Whoops."]);
	yield* g.callName(f, live(user), "grant_all_languages", ["omnitongue", 1], rt.Args.Named);
	yield* g.new_(f, T("/obj/effect/decal/cleanable/ash"), [rt.getStep(f, live(user), 0)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(13058, "/obj/vehicle/lavaboat", "/obj/vehicle", {
	resistance_flags: 3,
	name: "lava boat",
	desc: "A boat used for traversing lava.",
	icon_state: "goliath_boat",
	icon: rt.rsc("icons/obj/lavaland/dragonboat.dmi"),
});

// /obj/vehicle/lavaboat/proc/buckle_mob  (code/modules/mining/lavaland/necropolis_chests.dm:438)  may sleep
rt.def("/obj/vehicle/lavaboat/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "riding_datum", (yield* g.new_(f, T("/datum/riding/boat"), [])));
	return f.dot;
}, true, { args: ["M", "force", "check_loc"] });

rt.type(1802, "/datum/crafting_recipe/oar", "/datum/crafting_recipe", {
	name: "goliath bone oar",
	time: 15,
	category: "Tribal",
	result: rt.typePath("/obj/item/weapon/oar"),
	reqs: null,
});

// /datum/crafting_recipe/oar/proc/<init>  (code/modules/mining/lavaland/necropolis_chests.dm:454)
rt.def("/datum/crafting_recipe/oar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/sheet/bone"), 2]));
	return f.dot;
});

rt.type(1803, "/datum/crafting_recipe/boat", "/datum/crafting_recipe", {
	name: "goliath hide boat",
	time: 50,
	category: "Tribal",
	result: rt.typePath("/obj/vehicle/lavaboat"),
	reqs: null,
});

// /datum/crafting_recipe/boat/proc/<init>  (code/modules/mining/lavaland/necropolis_chests.dm:461)
rt.def("/datum/crafting_recipe/boat/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/sheet/animalhide/goliath_hide"), 3]));
	return f.dot;
});

rt.type(10117, "/obj/item/ship_in_a_bottle", "/obj/item", {
	name: "ship in a bottle",
	desc: "A tiny ship inside a bottle.",
	icon: rt.rsc("icons/obj/lavaland/artefacts.dmi"),
	icon_state: "ship_bottle",
});

// /obj/item/ship_in_a_bottle/proc/attack_self  (code/modules/mining/lavaland/necropolis_chests.dm:475)  may sleep
rt.def("/obj/item/ship_in_a_bottle/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "You're not sure how they get the ships in these things, but you're pretty sure you know how to get it out."]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(user)), rt.rsc("sound/effects/glassbr1.ogg"), 100, 1]);
	yield* g.new_(f, T("/obj/vehicle/lavaboat/dragon"), [rt.getStep(f, live(f.src), 0)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(13059, "/obj/vehicle/lavaboat/dragon", "/obj/vehicle/lavaboat", {
	name: "mysterious boat",
	desc: "This boat moves where you will it, without the need for an oar.",
	icon_state: "dragon_boat",
});

// /obj/vehicle/lavaboat/dragon/proc/buckle_mob  (code/modules/mining/lavaland/necropolis_chests.dm:486)  may sleep
rt.def("/obj/vehicle/lavaboat/dragon/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "riding_datum", (yield* g.new_(f, T("/datum/riding/boat/dragon"), [])));
	return f.dot;
}, true, { args: ["M", "force", "check_loc"] });

rt.type(6403, "/obj/item/weapon/reagent_containers/glass/bottle/potion/flight", "/obj/item/weapon/reagent_containers/glass/bottle/potion", {
	name: "strange elixir",
	desc: "A flask with an almost-holy aura emitting from it. The label on the bottle says: 'erqo'hyy tvi'rf lbh jv'atf'.",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/potion/flight/proc/<init>  (code/modules/mining/lavaland/necropolis_chests.dm:497)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/potion/flight/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["flightpotion", 5]));
	return f.dot;
});

rt.type(6402, "/obj/item/weapon/reagent_containers/glass/bottle/potion", "/obj/item/weapon/reagent_containers/glass/bottle", {
	icon: rt.rsc("icons/obj/lavaland/artefacts.dmi"),
	icon_state: "potionflask",
});

// /obj/item/weapon/reagent_containers/glass/bottle/potion/proc/update_icon  (code/modules/mining/lavaland/necropolis_chests.dm:500)
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/potion/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
		rt.setSv(f, "icon_state", "potionflask");
	} else {
		rt.setSv(f, "icon_state", "potionflask_empty");
	}
	return f.dot;
});

rt.type(3357, "/datum/reagent/flightpotion", "/datum/reagent", {
	name: "Flight Potion",
	id: "flightpotion",
	description: "Strange mutagenic compound of unknown origins.",
	reagent_state: 2,
	color: "#FFEBEB",
});

// /datum/reagent/flightpotion/proc/reaction_mob  (code/modules/mining/lavaland/necropolis_chests.dm:513)  may sleep
rt.def("/datum/reagent/flightpotion/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0)) && !isEqual(rt.fv(f, "stat", live(f.args[0])), 2))) {
		if ((!truthy((yield* g.call(f, P("/proc/is_species"), null, [live(f.args[0]), T("/datum/species/human")]))) || rt.lt(live(f.args[2]), 5))) {
			if ((isEqual(live(f.args[1]), 2) && truthy(live(f.args[3])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'><i>You feel nothing but a terrible aftertaste.</i></span>"]);
			}
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='userdanger'>A terrible pain travels down your back as wings burst out!</span>"]);
		yield* g.callName(f, live(f.args[0]), "set_species", [T("/datum/species/angel")]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.args[0])), rt.rsc("sound/items/poster_ripped.ogg"), 50, 1, -1]);
		yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [20]);
		yield* g.callName(f, live(f.args[0]), "emote", ["scream"]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message"] });

rt.type(5693, "/obj/item/weapon/melee/transforming/cleaving_saw", "/obj/item/weapon/melee/transforming", {
	transform_cooldown: null,
	swiping: 0,
	beast_force_bonus: 30,
	force_on: 20,
	throwforce_on: 20,
	icon_state_on: "cleaving_saw_open",
	attack_verb_off: null,
	attack_verb_on: null,
	hitsound_on: rt.rsc("sound/weapons/bladeslice.ogg"),
	name: "cleaving saw",
	desc: "This saw, effective at drawing the blood of beasts, transforms into a long cleaver that makes use of centrifugal force.",
	force: 12,
	throwforce: 20,
	icon: rt.rsc("icons/obj/lavaland/artefacts.dmi"),
	lefthand_file: rt.rsc("icons/mob/inhands/64x64_lefthand.dmi"),
	righthand_file: rt.rsc("icons/mob/inhands/64x64_righthand.dmi"),
	inhand_x_dimension: 64,
	inhand_y_dimension: 64,
	icon_state: "cleaving_saw",
	slot_flags: 512,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	w_class: 4,
	sharpness: 1,
});

// /obj/item/weapon/melee/transforming/cleaving_saw/proc/examine  (code/modules/mining/lavaland/necropolis_chests.dm:559)
rt.def("/obj/item/weapon/melee/transforming/cleaving_saw/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if (truthy(rt.sv(f, "active"))) {
		$1 = "open, and will cleave enemies in a wide arc";
	} else {
		$1 = "closed, and can be used for rapid consecutive attacks that cause beastly enemies to bleed";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>It is ＀.<br>Both modes will build up existing bleed effects, doing a burst of high damage if the bleed is built up high enough.<br>Transforming it immediately after an attack causes the next attack to come out faster.</span>", [$1])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/melee/transforming/cleaving_saw/proc/suicide_act  (code/modules/mining/lavaland/necropolis_chests.dm:565)  may sleep
rt.def("/obj/item/weapon/melee/transforming/cleaving_saw/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [user, $0, $1, $2];
	$0 = live(user);
	$1 = live(user);
	if (truthy(rt.sv(f, "active"))) {
		$2 = fmt("closing ＀ on ＀ neck", [live(f.src), (yield* g.callName(f, live(user), "p_their", []))]);
	} else {
		$2 = fmt("opening ＀ into ＀ chest", [live(f.src), (yield* g.callName(f, live(user), "p_their", []))]);
	}
	yield* g.callName(f, $0, "visible_message", [fmt("<span class='suicide'>＀ is ＀! It looks like ＀ trying to commit suicide!</span>", [$1, $2, (yield* g.callName(f, live(user), "p_theyre", []))])]);
	rt.setSv(f, "transform_cooldown", 0);
	yield* g.srcCall(f, "transform_weapon", live(user), 1);
	return 1;
}, true);

// /obj/item/weapon/melee/transforming/cleaving_saw/proc/transform_weapon  (code/modules/mining/lavaland/necropolis_chests.dm:571)  may sleep
rt.def("/obj/item/weapon/melee/transforming/cleaving_saw/proc/transform_weapon", function* transform_weapon(f: Frame) {
	if (rt.gt(rt.sv(f, "transform_cooldown"), rt.worldTime(f))) {
		return 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	rt.setSv(f, "transform_cooldown", add(rt.worldTime(f), 4));
	yield* g.callName(f, live(f.args[0]), "changeNext_move", [2]);
	return f.dot;
}, true, { args: ["user", "supress_message_text"] });

// /obj/item/weapon/melee/transforming/cleaving_saw/proc/transform_messages  (code/modules/mining/lavaland/necropolis_chests.dm:579)
rt.def("/obj/item/weapon/melee/transforming/cleaving_saw/proc/transform_messages", function transform_messages(f: Frame, user: Value, supress_message_text: Value) {
	if (!truthy(live(supress_message_text))) {
		if (truthy(rt.sv(f, "active"))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You open ＀. It will now cleave enemies in a wide arc.</span>", [live(f.src)])]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You close ＀. It will now attack rapidly and cause beastly enemies to bleed.</span>", [live(f.src)])]);
		}
	}
	rt.call(f, P("/proc/playsound"), null, [null, live(user), null, rt.rsc("sound/magic/clockwork/fellowship_armory.ogg"), null, 35, null, 1, "frequency", subtract(90000, multiply(rt.sv(f, "active"), 30000))], rt.Args.Named);
	return f.dot;
});

// /obj/item/weapon/melee/transforming/cleaving_saw/proc/clumsy_transform_effect  (code/modules/mining/lavaland/necropolis_chests.dm:587)  may sleep
rt.def("/obj/item/weapon/melee/transforming/cleaving_saw/proc/clumsy_transform_effect", function* clumsy_transform_effect(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!(truthy(rt.bitAnd(rt.fv(f, "disabilities", live(user)), 256)) && truthy(rt.op(f, "Prob", [], [50])))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You accidentally cut yourself with ＀, like a doofus!</span>", [live(f.src)])]);
	yield* g.callName(f, live(user), "take_bodypart_damage", [10]);
	return f.dot;
}, true);

// /obj/item/weapon/melee/transforming/cleaving_saw/proc/melee_attack_chain  (code/modules/mining/lavaland/necropolis_chests.dm:592)  may sleep
rt.def("/obj/item/weapon/melee/transforming/cleaving_saw/proc/melee_attack_chain", function* melee_attack_chain(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "active"))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "changeNext_move", [4]);
	return f.dot;
}, true, { args: ["user", "target", "params"] });

// /obj/item/weapon/melee/transforming/cleaving_saw/proc/attack  (code/modules/mining/lavaland/necropolis_chests.dm:597)  may sleep
rt.def("/obj/item/weapon/melee/transforming/cleaving_saw/proc/attack", function* attack(f: Frame) {
	let beast_bonus_active: Value = null, B: Value = null, user_turf: Value = null, dir_to_target: Value = null, i: Value = null, _T: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [beast_bonus_active, B, user_turf, dir_to_target, i, _T, L, $e];
	if ((((!truthy(rt.sv(f, "active")) || truthy(rt.sv(f, "swiping"))) || !truthy(rt.fv(f, "density", live(f.args[0])))) || isEqual(rt.getStep(f, live(f.args[0]), 0), rt.getStep(f, live(f.args[1]), 0)))) {
		beast_bonus_active = 0;
		B = (yield* g.callName(f, live(f.args[0]), "has_status_effect", [T("/datum/status_effect/saw_bleed")]));
		if ((truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/hostile/asteroid")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/hostile/megafauna")) ? 1 : 0)))) {
			if (!truthy(rt.sv(f, "active"))) {
				if (!truthy(live(B))) {
					yield* g.callName(f, live(f.args[0]), "apply_status_effect", [T("/datum/status_effect/saw_bleed")]);
				} else {
					yield* g.callName(f, live(B), "add_bleed", [rt.fv(f, "bleed_buildup", live(B))]);
				}
			} else {
				rt.modSrcVar(f, "force", rt.sv(f, "beast_force_bonus"), add);
				beast_bonus_active = 1;
			}
		}
		yield* g.callSuper(f, [], rt.Args.Same);
		if (truthy(live(beast_bonus_active))) {
			if (truthy(live(B))) {
				yield* g.callName(f, live(B), "add_bleed", [rt.fv(f, "bleed_buildup", live(B))]);
			}
			(rt.modSrcVar(f, "force", rt.sv(f, "beast_force_bonus"), subtract));
		}
		return live(f.dot);
	}
	user_turf = rt.getStep(f, live(f.args[1]), 0);
	dir_to_target = rt.getDir(f, live(user_turf), rt.getStep(f, live(f.args[0]), 0));
	rt.setSv(f, "swiping", 1);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		_T = rt.getStep(f, live(user_turf), (yield* g.call(f, P("/proc/turn"), null, [live(dir_to_target), subtract(90, multiply(45, live(i)))])));
		L = null;
		rt.forList(f, 1, live(_T), T("/mob/living"));
		while (($e = rt.next(f, 1)) !== undefined) {
			L = $e;
			if ((truthy((yield* g.callName(f, live(f.args[1]), "Adjacent", [live(L)]))) && truthy(rt.fv(f, "density", live(L))))) {
				yield* g.srcCall(f, "melee_attack_chain", live(f.args[1]), live(L));
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "swiping", 0);
	return f.dot;
}, true, { args: ["target", "user"] });

rt.type(12283, "/obj/structure/closet/crate/necropolis/dragon", "/obj/structure/closet/crate/necropolis", {
	name: "dragon chest",
});

// /obj/structure/closet/crate/necropolis/dragon/proc/PopulateContents  (code/modules/mining/lavaland/necropolis_chests.dm:631)  may sleep
rt.def("/obj/structure/closet/crate/necropolis/dragon/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let loot: Value = null;
	let $0: any;
	f.vars = () => [loot, $0];
	$0 = (loot = (yield* g.call(f, P("/proc/rand"), null, [1, 4])));
	if ($0 === 1) {
		yield* g.new_(f, T("/obj/item/weapon/melee/ghost_sword"), [live(f.src)]);
	} else if ($0 === 2) {
		yield* g.new_(f, T("/obj/item/weapon/lava_staff"), [live(f.src)]);
	} else if ($0 === 3) {
		yield* g.new_(f, T("/obj/item/weapon/spellbook/oneuse/sacredflame"), [live(f.src)]);
		yield* g.new_(f, T("/obj/item/weapon/gun/magic/wand/fireball"), [live(f.src)]);
	} else if ($0 === 4) {
		yield* g.new_(f, T("/obj/item/weapon/dragons_blood"), [live(f.src)]);
	}
	return f.dot;
}, true);

rt.type(12284, "/obj/structure/closet/crate/necropolis/dragon/crusher", "/obj/structure/closet/crate/necropolis/dragon", {
	name: "firey dragon chest",
});

// /obj/structure/closet/crate/necropolis/dragon/crusher/proc/PopulateContents  (code/modules/mining/lavaland/necropolis_chests.dm:647)  may sleep
rt.def("/obj/structure/closet/crate/necropolis/dragon/crusher/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/crusher_trophy/tail_spike"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5695, "/obj/item/weapon/melee/ghost_sword", "/obj/item/weapon/melee", {
	summon_cooldown: 0,
	spirits: null,
	flags: 64,
	name: "１spectral blade",
	desc: "A rusted and dulled blade. It doesn't look like it'd do much damage. It glows weakly.",
	icon_state: "spectral",
	item_state: "spectral",
	sharpness: 1,
	w_class: 4,
	force: 1,
	throwforce: 1,
	hitsound: rt.rsc("sound/effects/ghost2.ogg"),
	attack_verb: null,
});

// /obj/item/weapon/melee/ghost_sword/proc/Initialize  (code/modules/mining/lavaland/necropolis_chests.dm:666)  may sleep
rt.def("/obj/item/weapon/melee/ghost_sword/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "spirits", rt.list());
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	(rt.modGl("poi_list", live(f.src), rt.bitOr));
	return f.dot;
}, true);

// /obj/item/weapon/melee/ghost_sword/proc/Destroy  (code/modules/mining/lavaland/necropolis_chests.dm:672)  may sleep
rt.def("/obj/item/weapon/melee/ghost_sword/proc/Destroy", function* Destroy(f: Frame) {
	let G: Value = null;
	let $e: any;
	f.vars = () => [G, $e];
	G = null;
	rt.forList(f, 0, rt.sv(f, "spirits"), T("/mob/dead/observer"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		rt.setFv(f, "invisibility", live(G), rt.gl("observer_default_invisibility"));
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "spirits"), "Cut", []);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	(rt.modGl("poi_list", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/weapon/melee/ghost_sword/proc/attack_self  (code/modules/mining/lavaland/necropolis_chests.dm:680)  may sleep
rt.def("/obj/item/weapon/melee/ghost_sword/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (rt.gt(rt.sv(f, "summon_cooldown"), rt.worldTime(f))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "You just recently called out for aid. You don't want to annoy the spirits."]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "You call out for aid, attempting to summon spirits to your side."]);
	yield* g.call(f, P("/proc/notify_ghosts"), null, [null, fmt("＀ is raising ＀ ＀, calling for your help!", [live(user), (yield* g.callName(f, live(user), "p_their", [])), live(f.src)]), "enter_link", fmt("<a href=?src=＃;orbit=1>(Click to help)</a>", [live(f.src)]), "source", live(user), "action", "orbit"], rt.Args.Named);
	rt.setSv(f, "summon_cooldown", add(rt.worldTime(f), 600));
	return f.dot;
}, true);

// /obj/item/weapon/melee/ghost_sword/proc/Topic  (code/modules/mining/lavaland/necropolis_chests.dm:692)  may sleep
rt.def("/obj/item/weapon/melee/ghost_sword/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let ghost: Value = null;
	f.vars = () => [href, href_list, ghost];
	if (!truthy(rt.at(live(href_list), "orbit"))) return f.dot;
	if (!truthy((rt.istype((ghost = live(f.usr)), T("/mob/dead/observer")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, live(ghost), "ManualFollow", [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/melee/ghost_sword/proc/process  (code/modules/mining/lavaland/necropolis_chests.dm:698)
rt.def("/obj/item/weapon/melee/ghost_sword/proc/process", function process(f: Frame) {
	rt.callSrc(f, "ghost_check", []);
	return f.dot;
}, false, { waitfor: false });

// /obj/item/weapon/melee/ghost_sword/proc/ghost_check  (code/modules/mining/lavaland/necropolis_chests.dm:702)
rt.def("/obj/item/weapon/melee/ghost_sword/proc/ghost_check", function ghost_check(f: Frame) {
	let ghost_counter: Value = null, _T: Value = null, contents: Value = null, current_spirits: Value = null, orbiters: Value = null, thing: Value = null, A: Value = null, O: Value = null, G: Value = null, G_5: Value = null;
	let $e: any;
	f.vars = () => [ghost_counter, _T, contents, current_spirits, orbiters, thing, A, O, G, G_5, $e];
	ghost_counter = 0;
	_T = rt.getStep(f, live(f.src), 0);
	contents = rt.callName(f, live(_T), "GetAllContents", []);
	current_spirits = rt.list();
	orbiters = rt.list();
	thing = null;
	rt.forList(f, 0, live(contents));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (truthy(rt.gv(f, "orbiters", (A = live(thing))))) {
			orbiters = rt.modify(live(orbiters), rt.fv(f, "orbiters", live(A)), add);
		}
	}
	rt.endFor(f, 0);
	thing = null;
	rt.forList(f, 0, live(orbiters));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (truthy((rt.istype(rt.gv(f, "orbiter", (O = live(thing))), T("/mob/dead/observer")) ? 1 : 0))) {
			G = rt.fv(f, "orbiter", live(O));
			ghost_counter = rt.inc(live(ghost_counter), 1);
			rt.setFv(f, "invisibility", live(G), 0);
			(current_spirits = rt.modify(live(current_spirits), live(G), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	G_5 = null;
	rt.forList(f, 0, subtract(rt.sv(f, "spirits"), live(current_spirits)), T("/mob/dead/observer"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G_5 = $e;
		rt.setFv(f, "invisibility", live(G_5), rt.gl("observer_default_invisibility"));
	}
	rt.endFor(f, 0);
	rt.setSv(f, "spirits", live(current_spirits));
	return live(ghost_counter);
});

// /obj/item/weapon/melee/ghost_sword/proc/attack  (code/modules/mining/lavaland/necropolis_chests.dm:728)  may sleep
rt.def("/obj/item/weapon/melee/ghost_sword/proc/attack", function* attack(f: Frame) {
	let ghost_counter: Value = null;
	f.vars = () => [ghost_counter];
	rt.setSv(f, "force", 0);
	ghost_counter = (yield* g.srcCall(f, "ghost_check"));
	rt.setSv(f, "force", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [multiply(live(ghost_counter), 4), 75]))])));
	yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='danger'>＀ strikes with the force of ＀ vengeful spirits!</span>", [live(f.args[1]), live(ghost_counter)])]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user"] });

// /obj/item/weapon/melee/ghost_sword/proc/hit_reaction  (code/modules/mining/lavaland/necropolis_chests.dm:735)
rt.def("/obj/item/weapon/melee/ghost_sword/proc/hit_reaction", function hit_reaction(f: Frame) {
	let ghost_counter: Value = null;
	f.vars = () => [ghost_counter];
	if (live(f.args[2]) === null) {
		f.args[2] = "the attack";
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if (live(f.args[4]) === null) {
		f.args[4] = 0;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = 1;
	}
	ghost_counter = rt.callSrc(f, "ghost_check", []);
	f.args[3] = rt.modify(live(f.args[3]), rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [multiply(live(ghost_counter), 5), 75])]), add);
	rt.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='danger'>＀ is protected by a ring of ＀ ghosts!</span>", [live(f.args[0]), live(ghost_counter)])]);
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });

rt.type(7547, "/obj/item/weapon/dragons_blood", "/obj/item/weapon", {
	name: "bottle of dragons blood",
	desc: "You're not actually going to drink this, are you?",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "vial",
});

// /obj/item/weapon/dragons_blood/proc/attack_self  (code/modules/mining/lavaland/necropolis_chests.dm:749)  may sleep
rt.def("/obj/item/weapon/dragons_blood/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let H: Value = null, random: Value = null, D: Value = null;
	let $0: any;
	f.vars = () => [user, H, random, D, $0];
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	H = live(user);
	$0 = (random = (yield* g.call(f, P("/proc/rand"), null, [1, 4])));
	if ($0 === 1) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>Your appearence morphs to that of a very small humanoid ash dragon! You get to look like a freak without the cool abilities.</span>"]);
		rt.setFv(f, "features", rt.fv(f, "dna", live(H)), rt.alist(f, ["mcolor", "A02720", "tail_lizard", "Dark Tiger", "tail_human", "None", "snout", "Sharp", "horns", "Curled", "ears", "None", "wings", "None", "frills", "None", "spines", "Long", "body_markings", "Dark Tiger Body", "legs", "Digitigrade Legs"]));
		rt.setFv(f, "eye_color", live(H), "fee5a3");
		yield* g.callName(f, live(H), "set_species", [T("/datum/species/lizard")]);
	} else if ($0 === 2) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>Your flesh begins to melt! Miraculously, you seem fine otherwise.</span>"]);
		yield* g.callName(f, live(H), "set_species", [T("/datum/species/skeleton")]);
	} else if ($0 === 3) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>Power courses through you! You can now shift your form at will."]);
		if (truthy(rt.fv(f, "mind", live(user)))) {
			D = (yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/shapeshift/dragon"), []));
			yield* g.callName(f, rt.fv(f, "mind", live(user)), "AddSpell", [live(D)]);
		}
	} else if ($0 === 4) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>You feel like you could walk straight through lava now.</span>"]);
		(rt.modField(f, live(H), "weather_immunities", "lava", rt.bitOr));
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(user)), rt.rsc("sound/items/drink.ogg"), (yield* g.call(f, P("/proc/rand"), null, [10, 50])), 1]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(969, "/datum/disease/transformation/dragon", "/datum/disease/transformation", {
	name: "dragon transformation",
	cure_text: "nothing",
	cures: null,
	agent: "dragon's blood",
	desc: "What do dragons have to do with Space Station 13?",
	stage_prob: 20,
	severity: "BIOHAZARD THREAT!",
	visibility_flags: 0,
	stage1: null,
	stage2: null,
	stage3: null,
	stage4: null,
	stage5: null,
	new_form: rt.typePath("/mob/living/simple_animal/hostile/megafauna/dragon/lesser"),
});

// /datum/disease/transformation/dragon/proc/<init>  (code/modules/mining/lavaland/necropolis_chests.dm:779)
rt.def("/datum/disease/transformation/dragon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cures", rt.list("adminordrazine"));
	$0 = $0;
	rt.setSv(f, "stage1", rt.list("Your bones ache."));
	$0 = $0;
	rt.setSv(f, "stage2", rt.list("Your skin feels scaley."));
	rt.setSv(f, "stage3", rt.list("<span class='danger'>You have an overwhelming urge to terrorize some peasants.</span>", "<span class='danger'>Your teeth feel sharper.</span>"));
	$0 = $0;
	rt.setSv(f, "stage4", rt.list("<span class='danger'>Your blood burns.</span>"));
	$0 = $0;
	rt.setSv(f, "stage5", rt.list("<span class='danger'>You're a fucking dragon. However, any previous allegiances you held still apply. It'd be incredibly rude to eat your still human friends for no reason.</span>"));
	return f.dot;
});

rt.type(7548, "/obj/item/weapon/lava_staff", "/obj/item/weapon", {
	turf_type: rt.typePath("/turf/open/floor/plating/lava/smooth"),
	transform_string: "lava",
	reset_turf_type: rt.typePath("/turf/open/floor/plating/asteroid/basalt"),
	reset_string: "basalt",
	create_cooldown: 100,
	create_delay: 30,
	reset_cooldown: 50,
	timer: 0,
	banned_turfs: null,
	name: "staff of lava",
	desc: "The ability to fill the emergency shuttle with lava. What more could you want out of life?",
	icon_state: "staffofstorms",
	item_state: "staffofstorms",
	icon: rt.rsc("icons/obj/guns/magic.dmi"),
	slot_flags: 1024,
	w_class: 4,
	force: 25,
	damtype: "fire",
	resistance_flags: 35,
	hitsound: rt.rsc("sound/weapons/sear.ogg"),
});

// /obj/item/weapon/lava_staff/proc/Initialize  (code/modules/mining/lavaland/necropolis_chests.dm:818)  may sleep
rt.def("/obj/item/weapon/lava_staff/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "banned_turfs", (yield* g.call(f, P("/proc/typecacheof"), null, [rt.list(T("/turf/open/space/transit"), T("/turf/closed"))])));
	return f.dot;
}, true);

// /obj/item/weapon/lava_staff/proc/afterattack  (code/modules/mining/lavaland/necropolis_chests.dm:822)  may sleep
rt.def("/obj/item/weapon/lava_staff/proc/afterattack", function* afterattack(f: Frame) {
	let _T: Value = null, L: Value = null, old_name: Value = null, old_name_1: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [_T, L, old_name, old_name_1, $0, $1, $2];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (rt.gt(rt.sv(f, "timer"), rt.worldTime(f))) {
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(f.args[0]), rt.sv(f, "banned_turfs")])))) {
		return live(f.dot);
	}
	if (!truthy((rt.isIn(f, live(f.args[0]), (yield* g.call(f, P("/proc/view"), null, [rt.gv(f, "view", rt.fv(f, "client", live(f.args[1]))), rt.getStep(f, live(f.args[1]), 0)]))) ? 1 : 0))) return f.dot;
	if (!truthy((rt.istype((_T = rt.getStep(f, live(f.args[0]), 0)), T("/turf/open")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy(rt.op(f, "IsType", [], [live(_T), rt.sv(f, "turf_type")]))) {
		rt.setFv(f, "alpha", (L = (yield* g.new_(f, T("/obj/effect/temp_visual/lavastaff"), [live(_T)]))), 0);
		rt.op(f, "Animate", [2, 6], [null, live(L), "alpha", 255, "time", rt.sv(f, "create_delay")]);
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='danger'>＀ points ＀ at ＀!</span>", [live(f.args[1]), live(f.src), live(_T)])]);
		rt.setSv(f, "timer", add(add(rt.worldTime(f), rt.sv(f, "create_delay")), 1));
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, rt.sv(f, "create_delay"), "target", live(_T)], rt.Args.Named)))) {
			old_name = rt.fv(f, "name", live(_T));
			if (truthy((yield* g.callName(f, live(_T), "TerraformTurf", [rt.sv(f, "turf_type")])))) {
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='danger'>＀ turns ％！ into ＀!</span>", [live(f.args[1]), live(old_name), rt.sv(f, "transform_string")])]);
				$0 = (yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[1])]));
				$1 = (yield* g.call(f, P("/proc/get_area"), null, [live(f.args[0])]));
				if (truthy(live(_T))) {
					$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
				} else {
					$2 = "nonexistent location";
				}
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ fired the lava staff at ＀. ＀", [$0, $1, fmt("＀", [$2])])]);
				yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ fired the lava staff at ＀ ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.args[1])])), (yield* g.call(f, P("/proc/get_area"), null, [live(f.args[0])])), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])]);
				rt.setSv(f, "timer", add(rt.worldTime(f), rt.sv(f, "create_cooldown")));
				yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/magic/fireball.ogg"), 200, 1]);
			}
		} else {
			rt.setSv(f, "timer", rt.worldTime(f));
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(L)]);
	} else {
		old_name_1 = rt.fv(f, "name", live(_T));
		if (!truthy((yield* g.callName(f, live(_T), "TerraformTurf", [rt.sv(f, "reset_turf_type")])))) return f.dot;
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='danger'>＀ turns ％！ into ＀!</span>", [live(f.args[1]), live(old_name_1), rt.sv(f, "reset_string")])]);
		rt.setSv(f, "timer", add(rt.worldTime(f), rt.sv(f, "reset_cooldown")));
		yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/magic/fireball.ogg"), 200, 1]);
	}
	return f.dot;
}, true, { args: ["target", "user", "proximity_flag", "click_parameters"] });

rt.type(12285, "/obj/structure/closet/crate/necropolis/bubblegum", "/obj/structure/closet/crate/necropolis", {
	name: "bubblegum chest",
});

// /obj/structure/closet/crate/necropolis/bubblegum/proc/PopulateContents  (code/modules/mining/lavaland/necropolis_chests.dm:867)  may sleep
rt.def("/obj/structure/closet/crate/necropolis/bubblegum/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let loot: Value = null;
	let $0: any;
	f.vars = () => [loot, $0];
	$0 = (loot = (yield* g.call(f, P("/proc/rand"), null, [1, 3])));
	if ($0 === 1) {
		yield* g.new_(f, T("/obj/item/mayhem"), [live(f.src)]);
	} else if ($0 === 2) {
		yield* g.new_(f, T("/obj/item/blood_contract"), [live(f.src)]);
	} else if ($0 === 3) {
		yield* g.new_(f, T("/obj/item/weapon/gun/magic/staff/spellblade"), [live(f.src)]);
	}
	return f.dot;
}, true);

rt.type(12286, "/obj/structure/closet/crate/necropolis/bubblegum/crusher", "/obj/structure/closet/crate/necropolis/bubblegum", {
	name: "bloody bubblegum chest",
});

// /obj/structure/closet/crate/necropolis/bubblegum/crusher/proc/PopulateContents  (code/modules/mining/lavaland/necropolis_chests.dm:880)  may sleep
rt.def("/obj/structure/closet/crate/necropolis/bubblegum/crusher/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/crusher_trophy/demon_claws"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(10118, "/obj/item/mayhem", "/obj/item", {
	name: "mayhem in a bottle",
	desc: "A magically infused bottle of blood, the scent of which will drive anyone nearby into a murderous frenzy.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "vial",
});

// /obj/item/mayhem/proc/attack_self  (code/modules/mining/lavaland/necropolis_chests.dm:890)  may sleep
rt.def("/obj/item/mayhem/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let H: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [user, H, B, $e];
	H = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [7, live(user)])), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [(B = (yield* g.new_(f, T("/obj/effect/mine/pickup/bloodbath"), [live(H)]))), P("/obj/effect/mine/pickup/bloodbath/proc/mineEffect"), live(H)]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You shatter the bottle!</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(user)), rt.rsc("sound/effects/glassbr1.ogg"), 100, 1]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(10119, "/obj/item/blood_contract", "/obj/item", {
	used: 0,
	name: "blood contract",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "scroll2",
	color: "#FF0000",
	desc: "Mark your target for death. ",
});

// /obj/item/blood_contract/proc/attack_self  (code/modules/mining/lavaland/necropolis_chests.dm:909)  may sleep
rt.def("/obj/item/blood_contract/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let choice: Value = null, L: Value = null, survive: Value = null, B: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [user, choice, L, survive, B, H, $e];
	if (truthy(rt.sv(f, "used"))) {
		return live(f.dot);
	}
	rt.setSv(f, "used", 1);
	if (!truthy((rt.istype((choice = (yield* g.op(f, "Prompt", [1], [null, "Choose Your Victim", "Who do you want dead?", live(user), rt.gl("player_list")]))), T("/mob/living")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ is already dead!", [live(choice)])]);
		rt.setSv(f, "used", 0);
		return live(f.dot);
	}
	if (isEqual(live(choice), live(user))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "You feel like writing your own name into a cursed death warrant would be unwise."]);
		rt.setSv(f, "used", 0);
		return live(f.dot);
	} else {
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ has been marked for death!</span>", [(L = live(choice))])]);
		rt.setFv(f, "owner", (survive = (yield* g.new_(f, T("/datum/objective/survive"), []))), rt.fv(f, "mind", live(L)));
		rt.modField(f, rt.fv(f, "mind", live(L)), "objectives", live(survive), add);
		yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='userdanger'>You've been marked for death! Don't let the demons get you!</span>"]);
		yield* g.callName(f, live(L), "add_atom_colour", ["#FF0000", 1]);
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [(B = (yield* g.new_(f, T("/obj/effect/mine/pickup/bloodbath"), [live(L)]))), P("/obj/effect/mine/pickup/bloodbath/proc/mineEffect"), live(L)]);
		H = null;
		rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/carbon/human"));
		while (($e = rt.next(f, 0)) !== undefined) {
			H = $e;
			if (isEqual(live(H), live(L))) {
				continue;
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='userdanger'>You have an overwhelming desire to kill ＀. ＀ ＀ been marked red! Go kill ＀!</span>", [live(L), (yield* g.callName(f, live(L), "p_they", [1])), (yield* g.callName(f, live(L), "p_have", [])), (yield* g.callName(f, live(L), "p_them", []))])]);
			yield* g.callName(f, live(H), "put_in_hands_or_del", [(yield* g.new_(f, T("/obj/item/weapon/kitchen/knife/butcher"), [live(H)]))]);
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(12287, "/obj/structure/closet/crate/necropolis/colossus", "/obj/structure/closet/crate/necropolis", {
	name: "colossus chest",
});

// /obj/structure/closet/crate/necropolis/colossus/proc/PopulateContents  (code/modules/mining/lavaland/necropolis_chests.dm:946)  may sleep
rt.def("/obj/structure/closet/crate/necropolis/colossus/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let choices: Value = null, random_crystal: Value = null;
	f.vars = () => [choices, random_crystal];
	choices = subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/machinery/anomalous_crystal")])), T("/obj/machinery/anomalous_crystal"));
	random_crystal = rt.op(f, "PickUnweighted", [1], [live(choices)]);
	yield* g.new_(f, live(random_crystal), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/organ/vocal_cords/colossus"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12288, "/obj/structure/closet/crate/necropolis/colossus/crusher", "/obj/structure/closet/crate/necropolis/colossus", {
	name: "angelic colossus chest",
});

// /obj/structure/closet/crate/necropolis/colossus/crusher/proc/PopulateContents  (code/modules/mining/lavaland/necropolis_chests.dm:955)  may sleep
rt.def("/obj/structure/closet/crate/necropolis/colossus/crusher/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/crusher_trophy/blaster_tubes"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(7549, "/obj/item/weapon/hierophant_club", "/obj/item/weapon", {
	cooldown_time: 20,
	chaser_cooldown: 81,
	chaser_timer: 0,
	chaser_speed: 0.8,
	timer: 0,
	blast_range: 13,
	beacon: null,
	teleporting: 0,
	friendly_fire_check: 0,
	name: "hierophant club",
	desc: "The strange technology of this large club allows various nigh-magical feats. It used to beat you, but now you can set the beat.",
	icon_state: "hierophant_club_ready_beacon",
	item_state: "hierophant_club_ready_beacon",
	icon: rt.rsc("icons/obj/lavaland/artefacts.dmi"),
	lefthand_file: rt.rsc("icons/mob/inhands/64x64_lefthand.dmi"),
	righthand_file: rt.rsc("icons/mob/inhands/64x64_righthand.dmi"),
	inhand_x_dimension: 64,
	inhand_y_dimension: 64,
	slot_flags: 1024,
	w_class: 4,
	force: 15,
	hitsound: rt.rsc("sound/weapons/sonic_jackhammer.ogg"),
	actions_types: null,
});

// /obj/item/weapon/hierophant_club/proc/<init>  (code/modules/mining/lavaland/necropolis_chests.dm:973)
rt.def("/obj/item/weapon/hierophant_club/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/vortex_recall"), T("/datum/action/item_action/toggle_unfriendly_fire")));
	return f.dot;
});

// /obj/item/weapon/hierophant_club/proc/examine  (code/modules/mining/lavaland/necropolis_chests.dm:985)
rt.def("/obj/item/weapon/hierophant_club/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if (truthy(rt.sv(f, "beacon"))) {
		$1 = " beacon is not currently";
	} else {
		$1 = "re is a beacon";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='hierophant_warning'>The＀ attached.</span>", [$1])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/hierophant_club/proc/afterattack  (code/modules/mining/lavaland/necropolis_chests.dm:989)  may sleep
rt.def("/obj/item/weapon/hierophant_club/proc/afterattack", function* afterattack(f: Frame) {
	let _T: Value = null, C: Value = null;
	f.vars = () => [_T, C];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((!truthy((_T = rt.getStep(f, live(f.args[0]), 0))) || rt.gt(rt.sv(f, "timer"), rt.worldTime(f)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "calculate_anger_mod", live(f.args[1]));
	rt.setSv(f, "timer", add(rt.worldTime(f), 8));
	if (truthy(live(f.args[2]))) {
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/item/weapon/hierophant_club/proc/aoe_burst"), live(_T), live(f.args[1])]);
		yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[1]), live(f.args[0]), "fired 3x3 blast at", live(f.src)]);
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/turf/closed/mineral")) ? 1 : 0)) && rt.lt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.args[1]), live(f.args[0])])), 6))) {
			yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/item/weapon/hierophant_club/proc/cardinal_blasts"), live(_T), live(f.args[1])]);
			rt.setSv(f, "timer", add(rt.worldTime(f), rt.sv(f, "cooldown_time")));
		} else {
			if (truthy((rt.isIn(f, live(f.args[0]), (yield* g.call(f, P("/proc/view"), null, [5, rt.getStep(f, live(f.args[1]), 0)]))) ? 1 : 0))) {
				rt.setSv(f, "timer", add(rt.worldTime(f), rt.sv(f, "cooldown_time")));
				if ((truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0)) && rt.le(rt.sv(f, "chaser_timer"), rt.worldTime(f)))) {
					rt.setSv(f, "chaser_timer", add(rt.worldTime(f), rt.sv(f, "chaser_cooldown")));
					rt.setFv(f, "damage", (C = (yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/chaser"), [rt.getStep(f, live(f.args[1]), 0), live(f.args[1]), live(f.args[0]), rt.sv(f, "chaser_speed"), rt.sv(f, "friendly_fire_check")]))), 30);
					rt.setFv(f, "monster_damage_boost", live(C), 0);
					yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[1]), live(f.args[0]), "fired a chaser at", live(f.src)]);
				} else {
					yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/item/weapon/hierophant_club/proc/cardinal_blasts"), live(_T), live(f.args[1])]);
					yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[1]), live(f.args[0]), "fired cardinal blast at", live(f.src)]);
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>That target is out of range!</span>"]);
				rt.setSv(f, "timer", rt.worldTime(f));
			}
		}
	}
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/item/weapon/hierophant_club/proc/prepare_icon_update")]);
	return f.dot;
}, true, { args: ["target", "user", "proximity_flag", "click_parameters"] });

// /obj/item/weapon/hierophant_club/proc/calculate_anger_mod  (code/modules/mining/lavaland/necropolis_chests.dm:1019)
rt.def("/obj/item/weapon/hierophant_club/proc/calculate_anger_mod", function calculate_anger_mod(f: Frame, user: Value) {
	let L: Value = null, health_percent: Value = null;
	f.vars = () => [L, health_percent];
	rt.setSv(f, "chaser_cooldown", rt.initial(f, live(f.src), "chaser_cooldown"));
	rt.setSv(f, "cooldown_time", rt.initial(f, live(f.src), "cooldown_time"));
	rt.setSv(f, "chaser_speed", rt.initial(f, live(f.src), "chaser_speed"));
	rt.setSv(f, "blast_range", rt.initial(f, live(f.src), "blast_range"));
	if (!truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0))) return f.dot;
	L = live(user);
	rt.modSrcVar(f, "chaser_cooldown", rt.call(f, P("/proc/round"), null, [multiply((health_percent = divide(rt.fv(f, "health", live(L)), rt.fv(f, "maxHealth", live(L)))), 20)]), add);
	rt.modSrcVar(f, "cooldown_time", rt.call(f, P("/proc/round"), null, [multiply(live(health_percent), 10)]), add);
	rt.setSv(f, "chaser_speed", rt.call(f, P("/proc/max"), null, [add(rt.sv(f, "chaser_speed"), live(health_percent)), 0.5]));
	(rt.modSrcVar(f, "blast_range", rt.call(f, P("/proc/round"), null, [multiply(live(health_percent), 10)]), subtract));
	return f.dot;
});

// /obj/item/weapon/hierophant_club/proc/update_icon  (code/modules/mining/lavaland/necropolis_chests.dm:1032)  may sleep
rt.def("/obj/item/weapon/hierophant_club/proc/update_icon", function* update_icon(f: Frame) {
	let M: Value = null;
	let $0: any, $1: any;
	f.vars = () => [M, $0, $1];
	if (rt.le(rt.sv(f, "timer"), rt.worldTime(f))) {
		$0 = "_ready";
	} else {
		$0 = "";
	}
	if ((truthy(rt.sv(f, "beacon")) && !(!truthy(rt.sv(f, "beacon")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "beacon")))))) {
		$1 = "";
	} else {
		$1 = "_beacon";
	}
	rt.setSv(f, "icon_state", fmt("hierophant_club＀＀", [$0, $1]));
	rt.setSv(f, "item_state", rt.sv(f, "icon_state"));
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) return f.dot;
	yield* g.callName(f, (M = rt.sv(f, "loc")), "update_inv_hands", []);
	yield* g.callName(f, live(M), "update_inv_back", []);
	return f.dot;
}, true);

// /obj/item/weapon/hierophant_club/proc/prepare_icon_update  (code/modules/mining/lavaland/necropolis_chests.dm:1040)  may sleep
rt.def("/obj/item/weapon/hierophant_club/proc/prepare_icon_update", function* prepare_icon_update(f: Frame) {
	yield* g.srcCall(f, "update_icon");
	yield* g.call(f, P("/proc/sleep"), null, [subtract(rt.sv(f, "timer"), rt.worldTime(f))]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/hierophant_club/proc/ui_action_click  (code/modules/mining/lavaland/necropolis_chests.dm:1045)  may sleep
rt.def("/obj/item/weapon/hierophant_club/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value, action: Value) {
	let _T: Value = null, TE1: Value = null, TE2: Value = null, _T_2: Value = null, source: Value = null, t: Value = null, B: Value = null, L: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [user, action, _T, TE1, TE2, _T_2, source, t, B, L, $0, $1, $e];
	if (truthy((rt.istype(live(action), T("/datum/action/item_action/toggle_unfriendly_fire")) ? 1 : 0))) {
		rt.setSv(f, "friendly_fire_check", (!truthy(rt.sv(f, "friendly_fire_check")) ? 1 : 0));
		$0 = live(user);
		if (truthy(rt.sv(f, "friendly_fire_check"))) {
			$1 = "off";
		} else {
			$1 = "on";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='warning'>You toggle friendly fire ＀!</span>", [$1])]);
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "timer"), rt.worldTime(f))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(user), "is_holding", [live(f.src)])))) {
		$0 = live(user);
		if (truthy(rt.sv(f, "beacon"))) {
			$1 = "teleport with it";
		} else {
			$1 = "detach the beacon";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='warning'>You need to hold the club in your hands to ＀!</span>", [$1])]);
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "beacon")) || (!truthy(rt.sv(f, "beacon")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "beacon")))))) {
		if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(user))])))) {
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='hierophant_warning'>＀ starts fiddling with ＀'s pommel...</span>", [live(user), live(f.src)]), "<span class='notice'>You start detaching the hierophant beacon...</span>"]);
			rt.setSv(f, "timer", add(rt.worldTime(f), 51));
			yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/item/weapon/hierophant_club/proc/prepare_icon_update")]);
			if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 50, "target", live(user)], rt.Args.Named))) && !truthy(rt.sv(f, "beacon")))) {
				yield* g.call(f, P("/proc/playsound"), null, [(_T = rt.getStep(f, live(user), 0)), rt.rsc("sound/magic/blind.ogg"), 200, 1, -4]);
				yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/telegraph/teleport"), [live(_T), live(user)]);
				rt.setSv(f, "beacon", (yield* g.new_(f, T("/obj/effect/hierophant"), [live(_T)])));
				yield* g.callName(f, live(user), "update_action_buttons_icon", []);
				yield* g.callName(f, live(user), "visible_message", [fmt("<span class='hierophant_warning'>＀ places a strange machine beneath ＀ feet!</span>", [live(user), (yield* g.callName(f, live(user), "p_their", []))]), "<span class='hierophant'>You detach the hierophant beacon, allowing you to teleport yourself and any allies to it at any time!</span>\n<span class='notice'>You can remove the beacon to place it again by striking it with the club.</span>"]);
			} else {
				rt.setSv(f, "timer", rt.worldTime(f));
				yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/item/weapon/hierophant_club/proc/prepare_icon_update")]);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need to be on solid ground to detach the beacon!</span>"]);
		}
		return live(f.dot);
	}
	if (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(user), rt.sv(f, "beacon")])), 2)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You are too close to the beacon to teleport to it!</span>"]);
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [rt.getStep(f, rt.sv(f, "beacon"), 0), 1])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The beacon is blocked by something, preventing teleportation!</span>"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(user))])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You don't have enough space to teleport from here!</span>"]);
		return live(f.dot);
	}
	rt.setSv(f, "teleporting", 1);
	yield* g.callName(f, live(user), "update_action_buttons_icon", []);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='hierophant_warning'>＀ starts to glow faintly...</span>", [live(user)])]);
	rt.setSv(f, "timer", add(rt.worldTime(f), 50));
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/item/weapon/hierophant_club/proc/prepare_icon_update")]);
	rt.setFv(f, "icon_state", rt.sv(f, "beacon"), "hierophant_tele_on");
	TE1 = (yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/telegraph/edge"), [rt.fv(f, "loc", live(user))]));
	TE2 = (yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/telegraph/edge"), [rt.fv(f, "loc", rt.sv(f, "beacon"))]));
	if (((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 40, "target", live(user)], rt.Args.Named))) && truthy(live(user))) && truthy(rt.sv(f, "beacon")))) {
		_T_2 = rt.getStep(f, rt.sv(f, "beacon"), 0);
		source = rt.getStep(f, live(user), 0);
		if (truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [live(_T_2), 1])))) {
			rt.setSv(f, "teleporting", 0);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The beacon is blocked by something, preventing teleportation!</span>"]);
			yield* g.callName(f, live(user), "update_action_buttons_icon", []);
			rt.setSv(f, "timer", rt.worldTime(f));
			yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/item/weapon/hierophant_club/proc/prepare_icon_update")]);
			rt.setFv(f, "icon_state", rt.sv(f, "beacon"), "hierophant_tele_off");
			return live(f.dot);
		}
		yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/telegraph"), [live(_T_2), live(user)]);
		yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/telegraph"), [live(source), live(user)]);
		yield* g.call(f, P("/proc/playsound"), null, [live(_T_2), rt.rsc("sound/magic/wand_teleport.ogg"), 200, 1]);
		yield* g.call(f, P("/proc/playsound"), null, [live(source), rt.rsc("sound/machines/airlockopen.ogg"), 200, 1]);
		if ((((!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 3, "target", live(user)], rt.Args.Named))) || !truthy(live(user))) || !truthy(rt.sv(f, "beacon"))) || (!truthy(rt.sv(f, "beacon")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "beacon")))))) {
			rt.setSv(f, "teleporting", 0);
			if (truthy(live(user))) {
				yield* g.callName(f, live(user), "update_action_buttons_icon", []);
			}
			rt.setSv(f, "timer", rt.worldTime(f));
			yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/item/weapon/hierophant_club/proc/prepare_icon_update")]);
			if (truthy(rt.sv(f, "beacon"))) {
				rt.setFv(f, "icon_state", rt.sv(f, "beacon"), "hierophant_tele_off");
			}
			return live(f.dot);
		}
		if (truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [live(_T_2), 1])))) {
			rt.setSv(f, "teleporting", 0);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The beacon is blocked by something, preventing teleportation!</span>"]);
			yield* g.callName(f, live(user), "update_action_buttons_icon", []);
			rt.setSv(f, "timer", rt.worldTime(f));
			yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/item/weapon/hierophant_club/proc/prepare_icon_update")]);
			rt.setFv(f, "icon_state", rt.sv(f, "beacon"), "hierophant_tele_off");
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/add_logs"), null, [live(user), rt.sv(f, "beacon"), fmt("teleported self from (＀,＀,＀) to", [rt.fv(f, "x", live(source)), rt.fv(f, "y", live(source)), rt.fv(f, "z", live(source))])]);
		yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/telegraph/teleport"), [live(_T_2), live(user)]);
		yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/telegraph/teleport"), [live(source), live(user)]);
		t = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/block"), null, [rt.locate((yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(_T_2)), 1), 1])), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(_T_2)), 1), 1])), rt.fv(f, "z", live(_T_2))), rt.locate((yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(_T_2)), 1), rt.fv(f, "maxx", rt.world())])), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(_T_2)), 1), rt.fv(f, "maxy", rt.world())])), rt.fv(f, "z", live(_T_2)))])));
		while (($e = rt.next(f, 0)) !== undefined) {
			t = $e;
			rt.setFv(f, "damage", (B = (yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/blast"), [live(t), live(user), 1]))), 30);
		}
		rt.endFor(f, 0);
		t = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/block"), null, [rt.locate((yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(source)), 1), 1])), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(source)), 1), 1])), rt.fv(f, "z", live(source))), rt.locate((yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(source)), 1), rt.fv(f, "maxx", rt.world())])), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(source)), 1), rt.fv(f, "maxy", rt.world())])), rt.fv(f, "z", live(source)))])));
		while (($e = rt.next(f, 0)) !== undefined) {
			t = $e;
			rt.setFv(f, "damage", (B = (yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/blast"), [live(t), live(user), 1]))), 30);
		}
		rt.endFor(f, 0);
		L = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(source)])), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/item/weapon/hierophant_club/proc/teleport_mob"), live(source), live(L), live(_T_2), live(user)]);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/sleep"), null, [6]);
		if (truthy(rt.sv(f, "beacon"))) {
			rt.setFv(f, "icon_state", rt.sv(f, "beacon"), "hierophant_tele_off");
		}
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [live(TE1)]);
		yield* g.call(f, P("/proc/qdel"), null, [live(TE2)]);
		rt.setSv(f, "timer", rt.worldTime(f));
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/item/weapon/hierophant_club/proc/prepare_icon_update")]);
	}
	if (truthy(rt.sv(f, "beacon"))) {
		rt.setFv(f, "icon_state", rt.sv(f, "beacon"), "hierophant_tele_off");
	}
	rt.setSv(f, "teleporting", 0);
	if (!truthy(live(user))) return f.dot;
	yield* g.callName(f, live(user), "update_action_buttons_icon", []);
	return f.dot;
}, true);

// /obj/item/weapon/hierophant_club/proc/teleport_mob  (code/modules/mining/lavaland/necropolis_chests.dm:1150)  may sleep
rt.def("/obj/item/weapon/hierophant_club/proc/teleport_mob", function* teleport_mob(f: Frame, source: Value, M: Value, target: Value, user: Value) {
	let turf_to_teleport_to: Value = null;
	f.vars = () => [source, M, target, user, turf_to_teleport_to];
	if ((!truthy((turf_to_teleport_to = rt.getStep(f, live(target), rt.getDir(f, live(source), live(M))))) || truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [live(turf_to_teleport_to), 1]))))) {
		return live(f.dot);
	}
	rt.op(f, "Animate", [2, 8], [null, live(M), "alpha", 0, "time", 2, "easing", 128]);
	yield* g.call(f, P("/proc/sleep"), null, [1]);
	if (!truthy(live(M))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(M), "visible_message", [fmt("<span class='hierophant_warning'>＀ fades out!</span>", [live(M)])]);
	yield* g.call(f, P("/proc/sleep"), null, [2]);
	if (!truthy(live(M))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(M), "forceMove", [live(turf_to_teleport_to)]);
	yield* g.call(f, P("/proc/sleep"), null, [1]);
	if (!truthy(live(M))) {
		return live(f.dot);
	}
	rt.op(f, "Animate", [2, 8], [null, live(M), "alpha", 255, "time", 2, "easing", 64]);
	yield* g.call(f, P("/proc/sleep"), null, [1]);
	if (!truthy(live(M))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(M), "visible_message", [fmt("<span class='hierophant_warning'>＀ fades in!</span>", [live(M)])]);
	if (isEqual(live(user), live(M))) return f.dot;
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(M), "teleported", null, fmt("from (＀,＀,＀)", [rt.fv(f, "x", live(source)), rt.fv(f, "y", live(source)), rt.fv(f, "z", live(source))])]);
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }, { type: 8, path: "/mob" }, { path: "/turf" }, { type: 8, path: "/mob" }] });

// /obj/item/weapon/hierophant_club/proc/cardinal_blasts  (code/modules/mining/lavaland/necropolis_chests.dm:1174)  may sleep
rt.def("/obj/item/weapon/hierophant_club/proc/cardinal_blasts", function* cardinal_blasts(f: Frame, _T: Value, user: Value) {
	let d: Value = null;
	let $e: any;
	f.vars = () => [_T, user, d, $e];
	if (!truthy(live(_T))) {
		return live(f.dot);
	}
	yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/telegraph/cardinal"), [live(_T), live(user)]);
	yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/effects/bin_close.ogg"), 200, 1]);
	yield* g.call(f, P("/proc/sleep"), null, [2]);
	yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/blast"), [live(_T), live(user), rt.sv(f, "friendly_fire_check")]);
	d = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		d = $e;
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/item/weapon/hierophant_club/proc/blast_wall"), live(_T), live(d), live(user)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }, { type: 8, path: "/mob/living" }] });

// /obj/item/weapon/hierophant_club/proc/blast_wall  (code/modules/mining/lavaland/necropolis_chests.dm:1184)  may sleep
rt.def("/obj/item/weapon/hierophant_club/proc/blast_wall", function* blast_wall(f: Frame, _T: Value, dir: Value, user: Value) {
	let range: Value = null, previousturf: Value = null, J: Value = null, i: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [_T, dir, user, range, previousturf, J, i, B, $e];
	if (!truthy(live(_T))) {
		return live(f.dot);
	}
	range = rt.sv(f, "blast_range");
	previousturf = live(_T);
	J = rt.getStep(f, live(previousturf), live(dir));
	i = null;
	rt.forRange(f, 0, 1, live(range), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!truthy(live(J))) {
			return live(f.dot);
		}
		rt.setFv(f, "damage", (B = (yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/blast"), [live(J), live(user), rt.sv(f, "friendly_fire_check")]))), 30);
		rt.setFv(f, "monster_damage_boost", live(B), 0);
		J = rt.getStep(f, (previousturf = live(J)), live(dir));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }, {  }, { type: 8, path: "/mob/living" }] });

// /obj/item/weapon/hierophant_club/proc/aoe_burst  (code/modules/mining/lavaland/necropolis_chests.dm:1199)  may sleep
rt.def("/obj/item/weapon/hierophant_club/proc/aoe_burst", function* aoe_burst(f: Frame, _T: Value, user: Value) {
	let t: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [_T, user, t, B, $e];
	if (!truthy(live(_T))) {
		return live(f.dot);
	}
	yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/telegraph"), [live(_T), live(user)]);
	yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/effects/bin_close.ogg"), 200, 1]);
	yield* g.call(f, P("/proc/sleep"), null, [2]);
	t = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/block"), null, [rt.locate((yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(_T)), 1), 1])), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(_T)), 1), 1])), rt.fv(f, "z", live(_T))), rt.locate((yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(_T)), 1), rt.fv(f, "maxx", rt.world())])), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(_T)), 1), rt.fv(f, "maxy", rt.world())])), rt.fv(f, "z", live(_T)))])));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		rt.setFv(f, "damage", (B = (yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/blast"), [live(t), live(user), rt.sv(f, "friendly_fire_check")]))), 15);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }, { type: 8, path: "/mob/living" }] });
