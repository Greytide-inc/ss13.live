// Types declared in code/game/objects/items/devices/PDA that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";

rt.type(7011, "/obj/item/weapon/cartridge/engineering", "/obj/item/weapon/cartridge", {
	access: 16386,
	bot_access_flags: 4,
	name: "１Power-ON cartridge",
	icon_state: "cart-e",
});
rt.type(7012, "/obj/item/weapon/cartridge/atmos", "/obj/item/weapon/cartridge", {
	access: 16388,
	bot_access_flags: 4,
	name: "１BreatheDeep cartridge",
	icon_state: "cart-a",
});
rt.type(7013, "/obj/item/weapon/cartridge/medical", "/obj/item/weapon/cartridge", {
	access: 8,
	bot_access_flags: 16,
	name: "１Med-U cartridge",
	icon_state: "cart-m",
});
rt.type(7014, "/obj/item/weapon/cartridge/chemistry", "/obj/item/weapon/cartridge", {
	access: 256,
	bot_access_flags: 16,
	name: "１ChemWhiz cartridge",
	icon_state: "cart-chem",
});
rt.type(7015, "/obj/item/weapon/cartridge/security", "/obj/item/weapon/cartridge", {
	access: 1,
	bot_access_flags: 1,
	name: "１R.O.B.U.S.T. cartridge",
	icon_state: "cart-s",
});
rt.type(7016, "/obj/item/weapon/cartridge/detective", "/obj/item/weapon/cartridge", {
	access: 25,
	bot_access_flags: 1,
	name: "１D.E.T.E.C.T. cartridge",
	icon_state: "cart-s",
});
rt.type(7017, "/obj/item/weapon/cartridge/janitor", "/obj/item/weapon/cartridge", {
	access: 16512,
	bot_access_flags: 8,
	name: "１CustodiPRO cartridge",
	desc: "The ultimate in clean-room design.",
	icon_state: "cart-j",
});
rt.type(7018, "/obj/item/weapon/cartridge/lawyer", "/obj/item/weapon/cartridge", {
	access: 1,
	spam_enabled: 1,
	name: "１P.R.O.V.E. cartridge",
	icon_state: "cart-s",
});
rt.type(7019, "/obj/item/weapon/cartridge/curator", "/obj/item/weapon/cartridge", {
	access: 512,
	name: "１Lib-Tweet cartridge",
	icon_state: "cart-s",
});
rt.type(7020, "/obj/item/weapon/cartridge/roboticist", "/obj/item/weapon/cartridge", {
	bot_access_flags: 28,
	access: 16384,
	name: "１B.O.O.P. Remote Control cartridge",
	desc: "Packed with heavy duty triple-bot interlink!",
});
rt.type(7022, "/obj/item/weapon/cartridge/signal/toxins", "/obj/item/weapon/cartridge/signal", {
	access: 260,
	name: "１Signal Ace 2 cartridge",
	desc: "Complete with integrated radio signaler!",
	icon_state: "cart-tox",
});
rt.type(7023, "/obj/item/weapon/cartridge/quartermaster", "/obj/item/weapon/cartridge", {
	access: 4096,
	bot_access_flags: 2,
	name: "space parts & space vendors cartridge",
	desc: "Perfect for the Quartermaster on the go!",
	icon_state: "cart-q",
});
rt.type(7024, "/obj/item/weapon/cartridge/head", "/obj/item/weapon/cartridge", {
	access: 2064,
	name: "１Easy-Record DELUXE cartridge",
	icon_state: "cart-h",
});
rt.type(7025, "/obj/item/weapon/cartridge/hop", "/obj/item/weapon/cartridge", {
	access: 23185,
	bot_access_flags: 10,
	name: "１HumanResources9001 cartridge",
	icon_state: "cart-h",
});
rt.type(7026, "/obj/item/weapon/cartridge/hos", "/obj/item/weapon/cartridge", {
	access: 2065,
	bot_access_flags: 1,
	name: "１R.O.B.U.S.T. DELUXE cartridge",
	icon_state: "cart-hos",
});
rt.type(7027, "/obj/item/weapon/cartridge/ce", "/obj/item/weapon/cartridge", {
	access: 18454,
	bot_access_flags: 4,
	name: "１Power-On DELUXE cartridge",
	icon_state: "cart-ce",
});
rt.type(7028, "/obj/item/weapon/cartridge/cmo", "/obj/item/weapon/cartridge", {
	access: 2328,
	bot_access_flags: 16,
	name: "１Med-U DELUXE cartridge",
	icon_state: "cart-cmo",
});
rt.type(9300, "/obj/item/device/pda/ai/pai", "/obj/item/device/pda/ai", {
	ttone: "assist",
});
rt.type(9301, "/obj/item/device/pda/medical", "/obj/item/device/pda", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/medical"),
	name: "medical PDA",
	icon_state: "pda-medical",
});
rt.type(9302, "/obj/item/device/pda/viro", "/obj/item/device/pda", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/medical"),
	name: "virology PDA",
	icon_state: "pda-virology",
});
rt.type(9303, "/obj/item/device/pda/engineering", "/obj/item/device/pda", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/engineering"),
	name: "engineering PDA",
	icon_state: "pda-engineer",
});
rt.type(9304, "/obj/item/device/pda/security", "/obj/item/device/pda", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/security"),
	name: "security PDA",
	icon_state: "pda-security",
});
rt.type(9305, "/obj/item/device/pda/detective", "/obj/item/device/pda", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/detective"),
	name: "detective PDA",
	icon_state: "pda-detective",
});
rt.type(9306, "/obj/item/device/pda/warden", "/obj/item/device/pda", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/security"),
	name: "warden PDA",
	icon_state: "pda-warden",
});
rt.type(9307, "/obj/item/device/pda/janitor", "/obj/item/device/pda", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/janitor"),
	ttone: "slip",
	name: "janitor PDA",
	icon_state: "pda-janitor",
});
rt.type(9308, "/obj/item/device/pda/toxins", "/obj/item/device/pda", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/signal/toxins"),
	ttone: "boom",
	name: "scientist PDA",
	icon_state: "pda-science",
});
rt.type(9309, "/obj/item/device/pda/mime", "/obj/item/device/pda", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/virus/mime"),
	silent: 1,
	ttone: "silence",
	name: "mime PDA",
	inserted_item: rt.typePath("/obj/item/toy/crayon/mime"),
	icon_state: "pda-mime",
});
rt.type(9310, "/obj/item/device/pda/heads", "/obj/item/device/pda", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/head"),
	icon_state: "pda-hop",
});
rt.type(9311, "/obj/item/device/pda/heads/hop", "/obj/item/device/pda/heads", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/hop"),
	name: "head of personnel PDA",
	icon_state: "pda-hop",
});
rt.type(9312, "/obj/item/device/pda/heads/hos", "/obj/item/device/pda/heads", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/hos"),
	name: "head of security PDA",
	icon_state: "pda-hos",
});
rt.type(9313, "/obj/item/device/pda/heads/ce", "/obj/item/device/pda/heads", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/ce"),
	name: "chief engineer PDA",
	icon_state: "pda-ce",
});
rt.type(9314, "/obj/item/device/pda/heads/cmo", "/obj/item/device/pda/heads", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/cmo"),
	name: "chief medical officer PDA",
	icon_state: "pda-cmo",
});
rt.type(9315, "/obj/item/device/pda/heads/rd", "/obj/item/device/pda/heads", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/rd"),
	inserted_item: rt.typePath("/obj/item/weapon/pen/fountain"),
	name: "research director PDA",
	icon_state: "pda-rd",
});
rt.type(9316, "/obj/item/device/pda/captain", "/obj/item/device/pda", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/captain"),
	inserted_item: rt.typePath("/obj/item/weapon/pen/fountain/captain"),
	detonatable: 0,
	name: "captain PDA",
	icon_state: "pda-captain",
});
rt.type(9317, "/obj/item/device/pda/cargo", "/obj/item/device/pda", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/quartermaster"),
	name: "cargo technician PDA",
	icon_state: "pda-cargo",
});
rt.type(9318, "/obj/item/device/pda/quartermaster", "/obj/item/device/pda", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/quartermaster"),
	inserted_item: rt.typePath("/obj/item/weapon/pen/fountain"),
	name: "quartermaster PDA",
	icon_state: "pda-qm",
});
rt.type(9319, "/obj/item/device/pda/shaftminer", "/obj/item/device/pda", {
	name: "shaft miner PDA",
	icon_state: "pda-miner",
});
rt.type(9320, "/obj/item/device/pda/syndicate", "/obj/item/device/pda", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/virus/syndicate"),
	owner: "John Doe",
	hidden: 1,
	icon_state: "pda-syndi",
	name: "military PDA",
});
rt.type(9321, "/obj/item/device/pda/chaplain", "/obj/item/device/pda", {
	ttone: "holy",
	name: "chaplain PDA",
	icon_state: "pda-chaplain",
});
rt.type(9322, "/obj/item/device/pda/lawyer", "/obj/item/device/pda", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/lawyer"),
	inserted_item: rt.typePath("/obj/item/weapon/pen/fountain"),
	ttone: "objection",
	name: "lawyer PDA",
	icon_state: "pda-lawyer",
});
rt.type(9323, "/obj/item/device/pda/botanist", "/obj/item/device/pda", {
	name: "botanist PDA",
	icon_state: "pda-hydro",
});
rt.type(9324, "/obj/item/device/pda/roboticist", "/obj/item/device/pda", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/roboticist"),
	name: "roboticist PDA",
	icon_state: "pda-roboticist",
});
rt.type(9325, "/obj/item/device/pda/curator", "/obj/item/device/pda", {
	icon_alert: "pda-r-library",
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/curator"),
	inserted_item: rt.typePath("/obj/item/weapon/pen/fountain"),
	note: "Congratulations, your station has chosen the Thinktronic 5290 WGW-11 Series E-reader and Personal Data Assistant!",
	silent: 1,
	overlays_x_offset: -3,
	name: "curator PDA",
	icon_state: "pda-library",
	desc: "A portable microcomputer by Thinktronic Systems, LTD. This model is a WGW-11 series e-reader.",
});
rt.type(9326, "/obj/item/device/pda/clear", "/obj/item/device/pda", {
	note: "Congratulations, you have chosen the Thinktronic 5230 Personal Data Assistant Deluxe Special Max Turbo Limited Edition!",
	name: "clear PDA",
	icon_state: "pda-clear",
	desc: "A portable microcomputer by Thinktronic Systems, LTD. This model is a special edition with a transparent case.",
});
rt.type(9327, "/obj/item/device/pda/cook", "/obj/item/device/pda", {
	name: "cook PDA",
	icon_state: "pda-cook",
});
rt.type(9328, "/obj/item/device/pda/bar", "/obj/item/device/pda", {
	inserted_item: rt.typePath("/obj/item/weapon/pen/fountain"),
	name: "bartender PDA",
	icon_state: "pda-bartender",
});
rt.type(9329, "/obj/item/device/pda/atmos", "/obj/item/device/pda", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/atmos"),
	name: "atmospherics PDA",
	icon_state: "pda-atmos",
});
rt.type(9330, "/obj/item/device/pda/chemist", "/obj/item/device/pda", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/chemistry"),
	name: "chemist PDA",
	icon_state: "pda-chemistry",
});
rt.type(9331, "/obj/item/device/pda/geneticist", "/obj/item/device/pda", {
	default_cartridge: rt.typePath("/obj/item/weapon/cartridge/medical"),
	name: "geneticist PDA",
	icon_state: "pda-genetics",
});
