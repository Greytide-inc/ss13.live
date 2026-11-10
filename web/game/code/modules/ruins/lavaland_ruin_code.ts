// Based on /tg/station's code/modules/ruins/lavaland_ruin_code.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11886, "/obj/effect/spawner/lootdrop/seed_vault", "/obj/effect/spawner/lootdrop", {
	lootcount: 1,
	loot: null,
	name: "seed vault seeds",
});

// lavaland_ruin_code.dm:13
rt.def("/obj/effect/spawner/lootdrop/seed_vault/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.loot = rt.alist(f, [T("/obj/item/seeds/gatfruit"), 10, T("/obj/item/seeds/cherry/bomb"), 10, T("/obj/item/seeds/berry/glow"), 10, T("/obj/item/seeds/sunflower/moonflower"), 8]);
	return f.dot;
});

rt.type(6683, "/obj/item/weapon/disk/design_disk/golem_shell", "/obj/item/weapon/disk/design_disk", {
	max_blueprints: 1,
	name: "Golem Creation Disk",
	desc: "A gift from the Liberator.",
	icon_state: "datadisk1",
});

// lavaland_ruin_code.dm:28
rt.def("/obj/item/weapon/disk/design_disk/golem_shell/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	let G: Value = (yield* new_(T("/datum/design/golem_shell")));
	rt.setAt(this.blueprints, 1, G);
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

// lavaland_ruin_code.dm:36
rt.def("/datum/design/golem_shell/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = rt.alist(f, ["materials", 12]);
	this.materials = rt.alist(f, ["$metal", 40000]);

	this.category = list("Imported");
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

// lavaland_ruin_code.dm:51
rt.def("/obj/item/golem_shell/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let species: Value = null, O: Value = null;
	yield* parent_proc();
	if (!rt.istype(I, T("/obj/item/stack"))) return f.dot;
	if (rt.istype((O = I), T("/obj/item/stack/sheet/metal"))) {
		species = T("/datum/species/golem");
	}
	if (rt.istype(O, T("/obj/item/stack/sheet/glass"))) {
		species = T("/datum/species/golem/glass");
	}
	if (rt.istype(O, T("/obj/item/stack/sheet/plasteel"))) {
		species = T("/datum/species/golem/plasteel");
	}
	if (rt.istype(O, T("/obj/item/stack/sheet/mineral/sandstone"))) {
		species = T("/datum/species/golem/sand");
	}
	if (rt.istype(O, T("/obj/item/stack/sheet/mineral/plasma"))) {
		species = T("/datum/species/golem/plasma");
	}
	if (rt.istype(O, T("/obj/item/stack/sheet/mineral/diamond"))) {
		species = T("/datum/species/golem/diamond");
	}
	if (rt.istype(O, T("/obj/item/stack/sheet/mineral/gold"))) {
		species = T("/datum/species/golem/gold");
	}
	if (rt.istype(O, T("/obj/item/stack/sheet/mineral/silver"))) {
		species = T("/datum/species/golem/silver");
	}
	if (rt.istype(O, T("/obj/item/stack/sheet/mineral/uranium"))) {
		species = T("/datum/species/golem/uranium");
	}
	if (rt.istype(O, T("/obj/item/stack/sheet/mineral/bananium"))) {
		species = T("/datum/species/golem/bananium");
	}
	if (rt.istype(O, T("/obj/item/stack/sheet/mineral/titanium"))) {
		species = T("/datum/species/golem/titanium");
	}
	if (rt.istype(O, T("/obj/item/stack/sheet/mineral/plastitanium"))) {
		species = T("/datum/species/golem/plastitanium");
	}
	if (rt.istype(O, T("/obj/item/stack/sheet/mineral/abductor"))) {
		species = T("/datum/species/golem/alloy");
	}
	if (rt.istype(O, T("/obj/item/stack/sheet/mineral/wood"))) {
		species = T("/datum/species/golem/wood");
	}
	if (rt.istype(O, T("/obj/item/stack/sheet/bluespace_crystal"))) {
		species = T("/datum/species/golem/bluespace");
	}
	if (rt.istype(O, T("/obj/item/stack/sheet/runed_metal"))) {
		species = T("/datum/species/golem/runic");
	}
	if (rt.istype(O, T("/obj/item/stack/medical/gauze")) || rt.istype(O, T("/obj/item/stack/sheet/cloth"))) {
		species = T("/datum/species/golem/cloth");
	}
	if (rt.istype(O, T("/obj/item/stack/sheet/mineral/adamantine"))) {
		species = T("/datum/species/golem/adamantine");
	}
	if (rt.istype(O, T("/obj/item/stack/sheet/plastic"))) {
		species = T("/datum/species/golem/plastic");
	}
	if (species) {
		if (yield* O.use(10)) {
			to_chat(user, `You finish up the golem shell with ten sheets of ${O}.`);
			yield* new_(this.shell_type, rt.getStep(f, this, 0), species, user);
			yield* qdel(this);
		} else {
			to_chat(user, "You need at least ten sheets to finish a golem.");
		}
	} else {
		to_chat(user, "You can't build a golem out of this kind of material.");
	}
	return f.dot;
}, true);

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

// lavaland_ruin_code.dm:137
rt.def("/obj/effect/mob_spawn/human/lavaland_syndicate/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.id_access_list = list(150);
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

// lavaland_ruin_code.dm:151
rt.def("/datum/outfit/lavaland_syndicate/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implants = list(T("/obj/item/weapon/implant/weapons_auth"));
	return f.dot;
});

// lavaland_ruin_code.dm:154
rt.def("/datum/outfit/lavaland_syndicate/proc/post_equip", function post_equip(f: Frame, H: Value) {
	(rt.modField(f, H, "faction", "syndicate", rt.bitOr));
	return f.dot;
});
