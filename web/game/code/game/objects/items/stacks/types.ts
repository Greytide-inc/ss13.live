// Types declared in code/game/objects/items/stacks that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(7038, "/obj/item/weapon/ore/bluespace_crystal/refined", "/obj/item/weapon/ore/bluespace_crystal", {
	name: "refined bluespace crystal",
	points: 0,
	refined_type: null,
});
rt.type(9008, "/obj/item/stack/rods/ten", "/obj/item/stack/rods", {
	amount: 10,
});
rt.type(9009, "/obj/item/stack/rods/twentyfive", "/obj/item/stack/rods", {
	amount: 25,
});
rt.type(9010, "/obj/item/stack/rods/fifty", "/obj/item/stack/rods", {
	amount: 50,
});
rt.type(9011, "/obj/item/stack/sheet", "/obj/item/stack", {
	perunit: 2000,
	sheettype: null,
	throw_speed: 1,
	throw_range: 3,
	name: "sheet",
	full_w_class: 3,
	force: 5,
	throwforce: 5,
	max_amount: 50,
	attack_verb: null,
	novariants: 0,
});
rt.type(9037, "/obj/item/stack/sheet/xenochitin", "/obj/item/stack/sheet", {
	name: "alien chitin",
	desc: "A piece of the hide of a terrible creature.",
	singular_name: "alien hide piece",
	icon: rt.rsc("icons/mob/alien.dmi"),
	icon_state: "chitin",
	origin_tech: null,
	novariants: 1,
});
rt.type(9067, "/obj/item/stack/sheet/lessergem", "/obj/item/stack/sheet", {
	name: "lesser gems",
	desc: "Rare kind of gems which are only gained by blood sacrifice to minor deities. They are needed in crafting powerful objects.",
	singular_name: "lesser gem",
	icon_state: "sheet-lessergem",
	origin_tech: "materials=4",
	novariants: 1,
});
rt.type(9068, "/obj/item/stack/sheet/greatergem", "/obj/item/stack/sheet", {
	name: "greater gems",
	desc: "Rare kind of gems which are only gained by blood sacrifice to minor deities. They are needed in crafting powerful objects.",
	singular_name: "greater gem",
	icon_state: "sheet-greatergem",
	origin_tech: "materials=7",
	novariants: 1,
});
rt.type(9069, "/obj/item/stack/sheet/bone", "/obj/item/stack/sheet", {
	throw_speed: 1,
	throw_range: 3,
	name: "bones",
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "bone",
	singular_name: "bone",
	desc: "Someone's been drinking their milk.",
	force: 7,
	throwforce: 5,
	max_amount: 12,
	w_class: 3,
	origin_tech: "materials=2;biotech=2",
});
rt.type(9091, "/obj/item/stack/spacecash/c1", "/obj/item/stack/spacecash", {
	value: 1,
	icon_state: "spacecash",
	singular_name: "one credit bill",
});
rt.type(9092, "/obj/item/stack/spacecash/c10", "/obj/item/stack/spacecash", {
	value: 10,
	icon_state: "spacecash10",
	singular_name: "ten credit bill",
});
rt.type(9093, "/obj/item/stack/spacecash/c20", "/obj/item/stack/spacecash", {
	value: 20,
	icon_state: "spacecash20",
	singular_name: "twenty credit bill",
});
rt.type(9094, "/obj/item/stack/spacecash/c50", "/obj/item/stack/spacecash", {
	value: 50,
	icon_state: "spacecash50",
	singular_name: "fifty credit bill",
});
rt.type(9095, "/obj/item/stack/spacecash/c100", "/obj/item/stack/spacecash", {
	value: 100,
	icon_state: "spacecash100",
	singular_name: "one hundred credit bill",
});
rt.type(9096, "/obj/item/stack/spacecash/c200", "/obj/item/stack/spacecash", {
	value: 200,
	icon_state: "spacecash200",
	singular_name: "two hundred credit bill",
});
rt.type(9097, "/obj/item/stack/spacecash/c500", "/obj/item/stack/spacecash", {
	value: 500,
	icon_state: "spacecash500",
	singular_name: "five hundred credit bill",
});
rt.type(9098, "/obj/item/stack/spacecash/c1000", "/obj/item/stack/spacecash", {
	value: 1000,
	icon_state: "spacecash1000",
	singular_name: "one thousand credit bill",
});
rt.type(9100, "/obj/item/stack/medical/bruise_pack", "/obj/item/stack/medical", {
	heal_brute: 40,
	self_delay: 20,
	name: "bruise pack",
	singular_name: "bruise pack",
	desc: "A theraputic gel pack and bandages designed to treat blunt-force trauma.",
	icon_state: "brutepack",
	origin_tech: "biotech=2",
});
rt.type(9101, "/obj/item/stack/medical/gauze", "/obj/item/stack/medical", {
	stop_bleeding: 1800,
	self_delay: 20,
	name: "medical gauze",
	desc: "A roll of elastic cloth that is extremely effective at stopping bleeding, but does not heal wounds.",
	gender: "plural",
	singular_name: "medical gauze",
	icon_state: "gauze",
	max_amount: 12,
});
rt.type(9102, "/obj/item/stack/medical/gauze/improvised", "/obj/item/stack/medical/gauze", {
	stop_bleeding: 900,
	name: "improvised gauze",
	singular_name: "improvised gauze",
	desc: "A roll of cloth roughly cut from something that can stop bleeding, but does not heal wounds.",
});
rt.type(9104, "/obj/item/stack/medical/ointment", "/obj/item/stack/medical", {
	heal_burn: 40,
	self_delay: 20,
	name: "ointment",
	desc: "Used to treat those nasty burn wounds.",
	gender: "plural",
	singular_name: "ointment",
	icon_state: "ointment",
	origin_tech: "biotech=2",
});
rt.type(9106, "/obj/item/stack/telecrystal/five", "/obj/item/stack/telecrystal", {
	amount: 5,
});
rt.type(9107, "/obj/item/stack/telecrystal/twenty", "/obj/item/stack/telecrystal", {
	amount: 20,
});
