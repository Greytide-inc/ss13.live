// From code/modules/ruins/lavaland_ruin_code.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11886, "/obj/effect/spawner/lootdrop/seed_vault", "/obj/effect/spawner/lootdrop", {
	lootcount: 1,
	loot: null,
	name: "seed vault seeds",
});

// /obj/effect/spawner/lootdrop/seed_vault/proc/<init>  (code/modules/ruins/lavaland_ruin_code.dm:13)
rt.def("/obj/effect/spawner/lootdrop/seed_vault/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.alist(f, [T("/obj/item/seeds/gatfruit"), 10, T("/obj/item/seeds/cherry/bomb"), 10, T("/obj/item/seeds/berry/glow"), 10, T("/obj/item/seeds/sunflower/moonflower"), 8]));
	return f.dot;
});

rt.type(6683, "/obj/item/weapon/disk/design_disk/golem_shell", "/obj/item/weapon/disk/design_disk", {
	max_blueprints: 1,
	name: "Golem Creation Disk",
	desc: "A gift from the Liberator.",
	icon_state: "datadisk1",
});

// /obj/item/weapon/disk/design_disk/golem_shell/proc/Initialize  (code/modules/ruins/lavaland_ruin_code.dm:28)  may sleep
rt.def("/obj/item/weapon/disk/design_disk/golem_shell/proc/Initialize", function* Initialize(f: Frame) {
	let G: Value = null;
	f.vars = () => [G];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	G = (yield* g.new_(f, T("/datum/design/golem_shell"), []));
	rt.setAt(rt.sv(f, "blueprints"), 1, live(G));
	return f.dot;
}, true);

rt.type(3355, "/datum/design/golem_shell", "/datum/design", {
	name: "Golem Shell Construction",
	desc: "Allows for the construction of a Golem Shell.",
	id: "golem",
	req_tech: null,
	build_type: 4,
	materials: null,
	category: null,
	build_path: rt.typePath("/obj/item/golem_shell"),
});

// /datum/design/golem_shell/proc/<init>  (code/modules/ruins/lavaland_ruin_code.dm:36)
rt.def("/datum/design/golem_shell/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_tech", rt.alist(f, ["materials", 12]));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 40000]));
	$0 = $0;
	rt.setSv(f, "category", rt.list("Imported"));
	return f.dot;
});

rt.type(10160, "/obj/item/golem_shell", "/obj/item", {
	has_owner: 0,
	shell_type: rt.typePath("/obj/effect/mob_spawn/human/golem"),
	name: "incomplete free golem shell",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "construct",
	desc: "The incomplete body of a golem. Add ten sheets of any mineral to finish.",
});

// /obj/item/golem_shell/proc/attackby  (code/modules/ruins/lavaland_ruin_code.dm:51)  may sleep
rt.def("/obj/item/golem_shell/proc/attackby", function* attackby(f: Frame) {
	let species: Value = null, O: Value = null;
	f.vars = () => [species, O];
	yield* g.callSuper(f, [], rt.Args.Same);
	species = null;
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/stack")) ? 1 : 0))) return f.dot;
	if (truthy((rt.istype((O = live(f.args[0])), T("/obj/item/stack/sheet/metal")) ? 1 : 0))) {
		species = T("/datum/species/golem");
	}
	if (truthy((rt.istype(live(O), T("/obj/item/stack/sheet/glass")) ? 1 : 0))) {
		species = T("/datum/species/golem/glass");
	}
	if (truthy((rt.istype(live(O), T("/obj/item/stack/sheet/plasteel")) ? 1 : 0))) {
		species = T("/datum/species/golem/plasteel");
	}
	if (truthy((rt.istype(live(O), T("/obj/item/stack/sheet/mineral/sandstone")) ? 1 : 0))) {
		species = T("/datum/species/golem/sand");
	}
	if (truthy((rt.istype(live(O), T("/obj/item/stack/sheet/mineral/plasma")) ? 1 : 0))) {
		species = T("/datum/species/golem/plasma");
	}
	if (truthy((rt.istype(live(O), T("/obj/item/stack/sheet/mineral/diamond")) ? 1 : 0))) {
		species = T("/datum/species/golem/diamond");
	}
	if (truthy((rt.istype(live(O), T("/obj/item/stack/sheet/mineral/gold")) ? 1 : 0))) {
		species = T("/datum/species/golem/gold");
	}
	if (truthy((rt.istype(live(O), T("/obj/item/stack/sheet/mineral/silver")) ? 1 : 0))) {
		species = T("/datum/species/golem/silver");
	}
	if (truthy((rt.istype(live(O), T("/obj/item/stack/sheet/mineral/uranium")) ? 1 : 0))) {
		species = T("/datum/species/golem/uranium");
	}
	if (truthy((rt.istype(live(O), T("/obj/item/stack/sheet/mineral/bananium")) ? 1 : 0))) {
		species = T("/datum/species/golem/bananium");
	}
	if (truthy((rt.istype(live(O), T("/obj/item/stack/sheet/mineral/titanium")) ? 1 : 0))) {
		species = T("/datum/species/golem/titanium");
	}
	if (truthy((rt.istype(live(O), T("/obj/item/stack/sheet/mineral/plastitanium")) ? 1 : 0))) {
		species = T("/datum/species/golem/plastitanium");
	}
	if (truthy((rt.istype(live(O), T("/obj/item/stack/sheet/mineral/abductor")) ? 1 : 0))) {
		species = T("/datum/species/golem/alloy");
	}
	if (truthy((rt.istype(live(O), T("/obj/item/stack/sheet/mineral/wood")) ? 1 : 0))) {
		species = T("/datum/species/golem/wood");
	}
	if (truthy((rt.istype(live(O), T("/obj/item/stack/sheet/bluespace_crystal")) ? 1 : 0))) {
		species = T("/datum/species/golem/bluespace");
	}
	if (truthy((rt.istype(live(O), T("/obj/item/stack/sheet/runed_metal")) ? 1 : 0))) {
		species = T("/datum/species/golem/runic");
	}
	if ((truthy((rt.istype(live(O), T("/obj/item/stack/medical/gauze")) ? 1 : 0)) || truthy((rt.istype(live(O), T("/obj/item/stack/sheet/cloth")) ? 1 : 0)))) {
		species = T("/datum/species/golem/cloth");
	}
	if (truthy((rt.istype(live(O), T("/obj/item/stack/sheet/mineral/adamantine")) ? 1 : 0))) {
		species = T("/datum/species/golem/adamantine");
	}
	if (truthy((rt.istype(live(O), T("/obj/item/stack/sheet/plastic")) ? 1 : 0))) {
		species = T("/datum/species/golem/plastic");
	}
	if (truthy(live(species))) {
		if (truthy((yield* g.callName(f, live(O), "use", [10])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("You finish up the golem shell with ten sheets of ＀.", [live(O)])]);
			yield* g.new_(f, rt.sv(f, "shell_type"), [rt.getStep(f, live(f.src), 0), live(species), live(f.args[1])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "You need at least ten sheets to finish a golem."]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "You can't build a golem out of this kind of material."]);
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(12023, "/obj/effect/mob_spawn/human/lavaland_syndicate", "/obj/effect/mob_spawn/human", {
	outfit: rt.typePath("/datum/outfit/lavaland_syndicate"),
	name: "Syndicate Bioweapon Scientist",
	roundstart: 0,
	death: 0,
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper_s",
	flavour_text: "<font size=3>You are a syndicate agent, employed in a top secret research facility developing biological weapons. Unfortunately, your hated enemy, Nanotrasen, has begun mining in this sector. <b>Continue your research as best you can, and try to keep a low profile. <font size=6><b>DON'T</b></font> abandon the base without good cause.</b> The base is rigged with explosives should the worst happen, do not let the base fall into enemy hands!</b>",
	id_access_list: null,
});

// /obj/effect/mob_spawn/human/lavaland_syndicate/proc/<init>  (code/modules/ruins/lavaland_ruin_code.dm:137)
rt.def("/obj/effect/mob_spawn/human/lavaland_syndicate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "id_access_list", rt.list(150));
	return f.dot;
});

rt.type(734, "/datum/outfit/lavaland_syndicate", "/datum/outfit", {
	name: "Lavaland Syndicate Agent",
	r_hand: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/sniper_rifle"),
	uniform: rt.typePath("/obj/item/clothing/under/syndicate"),
	suit: rt.typePath("/obj/item/clothing/suit/toggle/labcoat"),
	shoes: rt.typePath("/obj/item/clothing/shoes/combat"),
	gloves: rt.typePath("/obj/item/clothing/gloves/combat"),
	ears: rt.typePath("/obj/item/device/radio/headset/syndicate/alt"),
	back: rt.typePath("/obj/item/weapon/storage/backpack"),
	r_pocket: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/pistol"),
	id: rt.typePath("/obj/item/weapon/card/id"),
	implants: null,
});

// /datum/outfit/lavaland_syndicate/proc/<init>  (code/modules/ruins/lavaland_ruin_code.dm:151)
rt.def("/datum/outfit/lavaland_syndicate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implants", rt.list(T("/obj/item/weapon/implant/weapons_auth")));
	return f.dot;
});

// /datum/outfit/lavaland_syndicate/proc/post_equip  (code/modules/ruins/lavaland_ruin_code.dm:154)
rt.def("/datum/outfit/lavaland_syndicate/proc/post_equip", function post_equip(f: Frame, H: Value) {
	(rt.modField(f, live(H), "faction", "syndicate", rt.bitOr));
	return f.dot;
});
